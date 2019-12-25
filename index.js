const AudioContext = window.AudioContext || window.webkitAudioContext
const log10Multiplier = 1 / Math.log10(2.0)
const expMultiplier = 1 / (Math.exp(1.0) - 1.0)
const squareLengthNumber = 4
const squareLength = `${squareLengthNumber}em`
const defaultColors = {
	background: '#222',
	lightBackground: '#333',
	fill: '#66e',
	line: '#ee6',
}
const presets = []
let colors = defaultColors

window.onload = () => {
	console.log("Welcome to ModaW")
	go(presets['patch-2'])
	//test()
};

const test = () => {
	console.log("This is a test")
}

const go = (config) => {
	const audioContext = new AudioContext()
	overrideColors(config.colors)
	nodes = create(audioContext, config.nodes)
	connect(audioContext, nodes, config.nodes)
	start(audioContext, nodes, config.nodes)
}

const overrideColors = (configColors) => {
	if (configColors === undefined) {
		return
	}
	if (configColors.background) {
		colors.background = configColors.background
	}
	if (configColors.fill) {
		colors.fill = configColors.fill
	}
}

const create = (audioContext, nodesConfig) => {
	let nodes = new Map()
	nodesConfig.forEach(config => {
		let id = config.id;
		let node = newObject(audioContext, config)
		node.config = config
		nodes.set(id, node)
	})
	return nodes
}

const start = (audioContext, nodes, nodesConfig) => {
	startTime = audioContext.currentTime
	nodesConfig.forEach(config => {
		let id = config.id;
		let node = nodes.get(id)
		if (config.startTime !== undefined && config.type === 'oscillator') {
			node.audioNode.frequency.setValueAtTime(config.frequency, startTime + config.startTime);
		} else {
			// Do nothing
		}
	})
	nodesConfig.forEach(config => {
		if (config.startTime !== undefined && nodes.get(config.id).audioNode) {
			nodes.get(config.id).audioNode.start()
		} else if (config.startTime !== undefined) {
			nodes.get(config.id).start()
		} else {
			// Do nothing
		}
	})
}

const newObject = (audioContext, config) => {
	switch (config.type) {
		case 'gain':
			return newGain(
				audioContext,
				config.id,
				config.min,
				config.max,
				config.value,
				config.isMainOut,
				config.resolution || config.max,
				config.out ? config.out.id : null,
				config.out ? config.out.param : null,
				config.mode ? config.mode : 'exp',
			)
		case 'oscillator':
			return newOscillator(
				audioContext,
				config.id,
				config.signal,
				config.frequency,
				config.detune ? config.detune.min : -1200,
				config.detune ? config.detune.value : 0,
				config.detune ? config.detune.max : 1200,
				config.detune ? config.detune.resolution : 24,
			)
		case 'clock':
			return newClock(
				audioContext,
				config.id,
				config.bpm,
				config.resolution
			)
		case 'sequencer':
			return newSequencer(
				audioContext,
				config.id,
				config.resolution,
				config.steps,
				config.width,
				config.outs,
			)
		case 'modulator':
			return newModulator(audioContext, config.id, config.signal, config.out,
				config.frequency.min, config.frequency.value, config.frequency.max,
				config.gain.min, config.gain.value, config.gain.max
			);
		case 'break': 
			document.getElementById('body').appendChild( document.createElement('div'));
			return {id:config.id}
		default:
			console.error(`cannot create node of type '${config.type}'`)
	}
}

const newGain = (audioContext, id, min, max, value, isMainOut, resolution, outId, outParam, mode) => {
	let node = new Object();
	node.resolution = resolution
	node.audioNode = audioContext.createGain()
	node.audioNode.gain.value = value
	node.html = newControl(id, 'slider', mode, min, max, value, resolution, node.audioNode.gain)
	document.getElementById('body').appendChild(node.html);
	node.connect = (nodes) => {
		outNode = nodes.get(outId)
		if (outNode === undefined) {
			console.warn(`no out node for '${id}'`)
			return
		}
		switch (outNode.config.type) {
			case 'oscillator':
				switch (outParam) {
					case 'detune':
						node.audioNode.connect(outNode.audioNode.detune)
						break;
					default:
						log.error(`cannot connect '${id}' to param '${outparam}'`)
				}
				break;
			default:
				console.error(`cannot connect '${id}' to '${outId}'`)
				break;
		}
	}
	return node
}

const newOscillator = (audioContext, id, signal, frequency, detuneMin, detuneValue, detuneMax, detuneResolution) => {
	let node = new Object();
	node.audioNode = audioContext.createOscillator();
	node.audioNode.type = signal;
	node.html = document.createElement('div');
	node.html.detune = newControl(id, 'slider', 'default', detuneMin, detuneMax, detuneValue, detuneResolution, node.audioNode.detune)
	node.html.appendChild(node.html.detune);
	document.getElementById('body').appendChild(node.html);
	return node;
}

const newClock = (audioContext, id, bpm, resolution) => {
	let node = new Object()
	node.html = document.createElement('canvas');
	node.html.id = id;
	node.html.width = resolution;
	node.html.height = resolution;
	node.html.style.width = getCssSquareLength(1);
	node.html.style.height = getCssSquareLength(1);
	node.html.style.border = '0px solid';
	document.getElementById('body').appendChild(node.html);
	let a = bpm / 60.0
	let b = 1.0 / a / resolution
	node.localTimeAtTime = (t) => {
		return ( t * a ) % 1.0 
	}
	node.valueAtTime = (t) => {
		return 1.0 - node.localTimeAtTime(t)
	}
	let context = node.html.getContext('2d')
	setInterval(() => {
		context.fillStyle = colors.background
		context.fillRect(0, 0, resolution, resolution)
		context.fillStyle = colors.fill
		context.fillRect(0, resolution - resolution * node.valueAtTime(audioContext.currentTime), resolution , resolution)
		context.fillStyle = colors.line
		for( let i = 0 ; i < resolution ; i++ ) {
			v = node.valueAtTime(i * b) * resolution 
			context.fillRect(i, resolution - v-2, 1, 4)
		}
		context.fillRect(resolution - node.valueAtTime(audioContext.currentTime) * resolution, 0, 1, resolution)
	}, 0);
	return node
}

const newSequencer = (audioContext, id, resolution, steps, width, outs) => {
	let node = new Object();
	node.steps = steps;
	node.html = document.createElement('div');
	node.html.style.background = colors.lightBackground
	node.html.style.width = getCssSquareLength(width)
	node.canvas = document.createElement('canvas');
	node.canvas.id = id;
	node.canvas.width = resolution * width;
	node.canvas.height = resolution;
	node.canvas.style.width = getCssSquareLength(width);
	node.canvas.style.height = getCssSquareLength(1);
	node.canvas.style.border = '0px solid';
	node.html.appendChild(node.canvas);
	
	node.html.controls = document.createElement('div');
	node.html.controls.classList.add('sequencer-controls');
	node.html.appendChild(node.html.controls)
	
	node.steps = []
	document.getElementById('body').appendChild(node.html);
	steps.forEach((stepValue, i) => {
		node.steps[i] = {
			start: {
				value: stepValue
			}
		}
		slider = newControl(id+'-slider-'+i, 'slider', 'default', 0, 1, stepValue, 100, node.steps[i].start)
		node.html.controls.appendChild(slider);
	})
	node.valueAtTime = (t) => {
		return node.valueAtLocalTime(node.localTimeAtTime(t))
	}
	node.valueAtLocalTime = (t) => {
		let u = t * steps.length
		let i = Math.floor(u)
		return (1.0 - u % 1.0) * node.steps[i].start.value
	}
	node.localTimeAtTime = (t) => {
		return 0.5
	}
	let context = node.canvas.getContext('2d')
	setInterval(() => {
		context.fillStyle = colors.background
		context.fillRect(0, 0, node.canvas.width, resolution)
		context.fillStyle = colors.fill
		context.fillRect(0, resolution - resolution * node.valueAtTime(audioContext.currentTime), node.canvas.width , resolution)
		context.fillStyle = colors.line
		for( let i = 0 ; i < resolution ; i++ ) {
			v = node.valueAtLocalTime(i / resolution) * resolution
			context.fillRect(i * width, resolution - v-2, 1, 4)
		}
		context.fillRect(node.localTimeAtTime(audioContext.currentTime) * node.canvas.width, 0, 1, resolution)
	}, 0);
	node.connect = (nodes) => {
		if (outs === undefined) {
			console.warn(`no out configured for '${id}'`)
			return
		}
		if (outs.length === 0) {
			console.warn(`out configured for '${id}', but lentgh is 0`)
			return
		}
		outs.forEach(out => {
			outNode = nodes.get(out.id)
			switch (outNode.config.type) {
				case 'gain':
					switch (out.param) {
						case 'gain':
							connectControllerToGain(audioContext, node, outNode)
							break;
						default:
							console.error(`cannot connect '${id}' '${out.id}.${out.param}'`)
					}
					break;
				case 'oscillator':
					switch (out.param) {
						case 'detune':
							connectControllerToDetune(audioContext, node, outNode)
							break;
						default:
							console.error(`cannot connect '${id}' '${out.id}.${out.param}'`)
							break;
					}
					break;
				default:
					console.error(`cannot connect '${id}' to '${out.id}', with type '${outNode.config.type}'`)
					break;
			}
		})
	}
	return node
}

//const newModulator = (audioContext, id, signal, out, frequencyMin, frequencyValue, frequencyMax, gainMin, gainValue, gainMax) => {
//	let node = new Object()
//	node.html = document.createElement('div');
//	document.getElementById('body').appendChild(node.html);
//	// Gain
//	node.gainAudioNode = audioContext.createGain()
//	node.htmlGain = newControl(id+'-gain', 'slider', 'default', gainMin, gainMax, gainValue, gainMax, node.gainAudioNode.gain)
//	node.html.appendChild(node.htmlGain)
//	// Osc
//	node.oscAudioNode = audioContext.createOscillator();
//	node.oscAudioNode.type = signal;
//	node.htmlFrequency = newControl(id+'-frequency', 'slider', 'default', frequencyMin, frequencyMax, frequencyValue, frequencyMax, node.oscAudioNode.frequency)
//	node.html.appendChild(node.htmlFrequency)
//	//
//	node.start = () => {
//		//node.gainAudioNode.start()
//		node.oscAudioNode.start()
//	}
//	node.connect = (nodes) => {
//		node.oscAudioNode.connect(node.gainAudioNode);
//		node.gainAudioNode.connect(nodes.get(out).audioNode.detune);
//	}
//	return node
//}

const connect = (audioContext, nodes, nodesConfig) => {
	nodesConfig.forEach(config => {
		let id = config.id;
		let node = nodes.get(id)
		if (node.connect) {
			node.connect(nodes)
		}  
		if (config.isMainOut) {
			node.audioNode.connect(audioContext.destination);
		}  
		if (config.out !== undefined && nodes.get(config.out) && nodes.get(config.out).config.type === 'gain') {
			node.audioNode.connect(nodes.get(config.out).audioNode)
		}
		if (config.controller && config.type === 'gain') {
			connectControllerToGain(audioContext, nodes.get(config.controller), nodes.get(config.id))
		}  
		if (config.clock && config.type === 'sequencer') {
			let sequencer = nodes.get(config.id)
			if (sequencer === undefined) {
				console.error(`${config.id} does not exist`)
			}
			let clock = nodes.get(config.clock)
			if (clock === undefined) {
				console.error(`${config.clock} does not exist`)
			}
			sequencer.localTimeAtTime = clock.localTimeAtTime
		}
	})
}

const connectControllerToGain = (audioContext, controller, node) => {
	let startTime = audioContext.currentTime;
	let durationSeconds = 4
	let intervalMilliseconds = durationSeconds * 1000.0
	let resolution = 100
	let stepDuration = durationSeconds / resolution
	/*setInterval(() => {
		let values = [];
		for (let i = 0 ; i < resolution ; i += 1) {
			values[i] = controller.valueAtTime(startTime + stepDuration * i)
		}
		node.audioNode.gain.setValueCurveAtTime(values, startTime, durationSeconds)
	}, intervalMilliseconds)*/
	setInterval(() => {
		node.audioNode.gain.setValueAtTime(
			floatValueToRange(controller.valueAtTime(audioContext.currentTime),  node.config.min, node.config.max), 
			audioContext.currentTime
		)
		node.html.value = controller.valueAtTime(audioContext.currentTime) * node.resolution
	}, 0)
}

const connectControllerToDetune = (audioContext, controller, node) => {
	let startTime = audioContext.currentTime;
	let durationSeconds = 4
	let intervalMilliseconds = durationSeconds * 1000.0
	let resolution = 100
	let stepDuration = durationSeconds / resolution
	/*setInterval(() => {
		let values = [];
		for (let i = 0 ; i < resolution ; i += 1) {
			values[i] = controller.valueAtTime(startTime + stepDuration * i)
		}
		node.audioNode.gain.setValueCurveAtTime(values, startTime, durationSeconds)
	}, intervalMilliseconds)*/
	setInterval(() => {
		node.audioNode.detune.setValueAtTime(
			floatValueToRange(controller.valueAtTime(audioContext.currentTime),  node.config.detune.min, node.config.detune.max), 
			audioContext.currentTime
		)
		node.html.detune.value = floatValueToRange(controller.valueAtTime(audioContext.currentTime), 0, node.config.detune.resolution)
	}, 0)
}

//
// Helpers
//
const newControl = (id, type, mode, min, max, value, resolution, controlledSetting) => {
	switch (type) {
		case 'slider':
			const slider = document.createElement('input');
			slider.id = id
			slider.type = 'range';
			slider.min = 0;
			slider.max = resolution;
			slider.value = ((value-min) / (max-min) )* resolution //+ (max-min);
			console.log(id, value, slider.value, min)
			let setSettingValue = (sliderValue) => {
				try {
					let a = convertSliderValue(sliderValue, resolution, min, max, mode)
					console.log(a)
					controlledSetting.value = a
				} catch (e) {
					console.error('sliderValue:', sliderValue)
					console.error('resolution:', resolution)
					console.error('min:', min)
					console.error('max:', max)
					console.error('value:', convertSliderValue(sliderValue, resolution, min, max, mode))
					console.error(`error for '${id}'`)
					console.error(e)
				}
			}
			setSettingValue(slider.value)
			slider.addEventListener('input', () => {
				setSettingValue(window.event.target.value)
			})
			return slider
			break
		default:
			console.error(`Invalid type '${type}' for newControl()`)
			break
	}
}

const floatValueToRange = (floatValue, min, max) => {
	return floatValue * (max - min) + min
}

const convertSliderValue = (sliderValue, resolution, min, max, mode) => {
	return convertValue((sliderValue / resolution) * (max - min) + min, mode, resolution)
}

const convertValue = (value, mode, resolution) => {
	switch (mode) {
		case 'exp':
			return (Math.exp(value / resolution) - 1.0) * expMultiplier * resolution
		case 'log10':
			return logValue = Math.log10(value + 1.0) * log10Multiplier
		case 'default':
			return value;
		default:
			console.error(`Invalid mode '${mode}' for convertValue()`)
			return value;
	}
}

const getCssSquareLength = (count) => {
	return `${squareLengthNumber*count}em`
}

const AudioContext = window.AudioContext || window.webkitAudioContext
const log10Multiplier = 1 / Math.log10(2.0)
const expMultiplier = 1 / (Math.exp(1.0) - 1.0)
const squareLengthNumber = 4
const defaultDrawInterval = 30
const squareLength = `${squareLengthNumber}em`
const defaultColors = {
	background: '#222',
	lightBackground: '#333',
	fill: '#66e',
	line: '#ee6',
}
const presets = new Map()

const audioContext = new AudioContext()
let colors
let nodes = new Map()

window.onload = () => {
	registerHtmlElements();
	console.log("Welcome to ModaW")
	writePresetToEditor('patch-2')
	go(getConfigFromEditor())
	//test()
};

const test = () => {
	console.log("This is a test")
}

const writePresetToEditor = (presetName) => {
	document.getElementById('editor').value = JSON.stringify(presets.get(presetName), null, 2)
}

const getConfigFromEditor = () => {
	return JSON.parse(document.getElementById('editor').value)
}

const go = (config) => {
	// Stop & Reset
	nodes.forEach(node => {
		if (node.draw !== undefined) {
			if (node.drawTimeoutID === undefined) {
				console.error(`cannot clear timeout for ${node.config.id}`)
			}
			clearTimeout(node.drawTimeoutID)
		}
		if (node.intervalIDs !== undefined) {
			node.intervalIDs.forEach(intervalID => {
				clearInterval(intervalID)
			})
		}
		if (node.config.startTime !== undefined && node.audioNode) {
			node.audioNode.stop()
		} else if (node.stop !== undefined) {
			node.stop()
		} else {
			//console.warn(`could not stop ${node.config.id}`)
			// Do nothing
		}
	})
	document.getElementById('content').innerHTML = '';
	colors = JSON.parse(JSON.stringify(defaultColors))
	// Start
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
	let lastId = ''
	nodesConfig.forEach(config => {
		if (!config) {
			console.warn(`null nodeConfig after ${lastId}`)
			return
		}
		let id = config.id;
		lastId = id;
		let node = newObject(audioContext, config)
		node.config = config
		if (node.drawInterval === undefined) {
			node.drawInterval = defaultDrawInterval
		}
		nodes.set(id, node)
	})
	return nodes
}

const start = (audioContext, nodes, nodesConfig) => {
	currentTime = audioContext.currentTime
	nodesConfig.forEach(config => {
		let id = config.id;
		let node = nodes.get(id)
		if (config.startTime !== undefined && config.type === 'oscillator') {
			
		} else {
			// Do nothing
		}
	})
	nodesConfig.forEach(config => {
		if (config.startTime !== undefined && nodes.get(config.id).audioNode) {
			nodes.get(config.id).audioNode.start()
			nodes.get(config.id).start(currentTime)
		} else if (config.startTime !== undefined) {
			nodes.get(config.id).start(currentTime)
		} else {
			// Do nothing
		}
	})
	nodes.forEach(node => {
		if (node.draw) {
			node.draw()
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
				
				config.frequency.min !== undefined ? config.frequency.min : config.frequency.value / 2,
				config.frequency.value,
				config.frequency.max !== undefined ? config.frequency.max : config.frequency.value * 2,
				config.frequency.resolution !== undefined ? config.frequency.resolution : 24,
				
				config.detune ? config.detune.min : -1200,
				config.detune ? config.detune.value : 0,
				config.detune ? config.detune.max : 1200,
				config.detune ? config.detune.resolution : 24,
				config.out,
				config.startTime
			)
		case 'clock':
			return newClock(
				audioContext,
				config.id,
				config.bpm,
				config.resolution,
				config.length ? config.length : 1,
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
		case 'filter':
			return newFilter(
				audioContext,
				config.id,
				config.filter_type,
				config.out,
				config.frequency && config.frequency.min ? config.frequency.min : 1,
				config.frequency && config.frequency.value ? config.frequency.value : 1000,
				config.frequency && config.frequency.max ? config.frequency.max : 20000,
				config.frequency && config.frequency.resolution ? config.frequency.resolution : 1000,
				config.gain && config.gain.min ? config.gain.min : 0,
				config.gain && config.gain.value ? config.gain.value : 25,
				config.gain && config.gain.max ? config.gain.max : 50,
				config.gain && config.gain.resolution ? config.gain.resolution : 100,
				config.q && config.q.min ? config.q.min : 0,
				config.q && config.q.value ? config.q.value : 25,
				config.q && config.q.max ? config.q.max : 50,
				config.q && config.q.resolution ? config.q.resolution : 100,
			)
		case 'controller':
			return newController(
				audioContext,
				config.id,
				config.min,
				config.max,
				config.resolution,
				config.values,
				config.width,
				config.outs,
				config.clock,
			)
		case 'break': 
			appendContent(document.createElement('div'));
			return {id:config.id}
		default:
			console.error(`cannot create node of type '${config.type}'`)
	}
}

const appendContent = (element) => {
	document.getElementById('content').appendChild( element )
}

const newFilter = (
	audioContext, id, type, outId,
	frequencyMin, frequencyValue, frequencyMax, frequencyResolution,
	gainMin, gainValue, gainMax, gainResolution,
	qMin, qValue, qMax, qResolution
) => {
	let node = new Object();
	node.audioNode = audioContext.createBiquadFilter();
	node.html = document.createElement('div');
	node.html.frequency = newControl(id+'-frequency', 'slider', 'default', frequencyMin, frequencyMax, frequencyValue, frequencyResolution, node.audioNode.frequency)
	node.html.appendChild(node.html.frequency);
	node.html.gain = newControl(id+'-gain', 'slider', 'default', gainMin, gainMax, gainValue, gainResolution, node.audioNode.gain)
	node.html.appendChild(node.html.gain);
	node.html.Q = newControl(id+'-Q', 'slider', 'default', qMin, qMax, qValue, qResolution, node.audioNode.Q)
	node.html.appendChild(node.html.Q);
	appendContent(node.html);
	node.audioNode.type = type;
	node.connect = (nodes) => {
		outNode = nodes.get(outId)
		if (outNode === undefined) {
			console.warn(`no out node for '${id}'`)
			return
		}
		switch (outNode.config.type) {
			case 'gain':
				node.audioNode.connect(outNode.audioNode)
				break;
			default:
				console.error(`cannot connect '${id}' to '${outId}'`)
				break;
		}
	}
	return node
}

//const newModulator = (audioContext, id, signal, out, frequencyMin, frequencyValue, frequencyMax, gainMin, gainValue, gainMax) => {
//	let node = new Object()
//	node.html = document.createElement('div');
//	appendContent(node.html);
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

//
// Helpers
//
const newControl = (id, type, mode, min, max, value, resolution, controlledSetting, audioContext) => {
	switch (type) {
		case 'slider':
			const slider = document.createElement('input');
			slider.id = id
			slider.type = 'range';
			slider.min = 0;
			slider.max = resolution;
			slider.value = ((value-min) / (max-min) )* resolution
			let setSettingValue = (sliderValue) => {
				try {
					let v = convertSliderValue(sliderValue, resolution, min, max, mode)
					controlledSetting.value = v
					if (audioContext !== undefined) {
						controlledSetting.setValueAtTime(v, audioContext.currentTime)
					}
					console.log(`slider: ${sliderValue}\t value: ${v}`)
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

const rangeValueToFloatValue = (rangeValue, min, max) => {
	return (rangeValue - min) / (max - min) 
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

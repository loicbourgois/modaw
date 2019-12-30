const newSequencer = (audioContext, id, resolution, steps, width, outs) => {
	resolution /= 2
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
	appendContent(node.html);
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
	node.draw = () => {
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
		node.drawTimeoutID = setTimeout(node.draw, node.drawInterval);
	};
	node.intervalIDs = []
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
			if (outNode === undefined) {
				console.error(`cannot find node ${out.id} for ${id}`)
			}
			switch (outNode.config.type) {
				case 'gain':
					switch (out.param) {
						case 'gain':
							node.intervalIDs.push(connectControllerToGain(audioContext, node, outNode))
							break;
						default:
							console.error(`cannot connect '${id}' '${out.id}.${out.param}'`)
					}
					break;
				case 'oscillator':
					switch (out.param) {
						case 'detune':
							node.intervalIDs.push(connectControllerToDetune(audioContext, node, outNode))
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

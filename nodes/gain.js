const newGain = (audioContext, id, min, max, value, isMainOut, resolution, outId, outParam, mode) => {
	let node = new Object();
	node.resolution = resolution
	node.audioNode = audioContext.createGain()
	node.audioNode.gain.value = value
	node.html = document.createElement('span');
	node.html.gain = newControl(id, 'slider', mode, min, max, value, resolution, node.audioNode.gain)
	
	let label = document.createElement('label');
	label.innerHTML = id;
	node.html.classList.add('gain');
	node.html.appendChild(node.html.gain)
	node.html.appendChild(label)
	appendContent(node.html);
	node.connect = (nodes) => {
		outNode = nodes.get(outId)
		if (isMainOut===true) {
			return
		}
		if (outNode === undefined) {
			console.warn(`no out node for '${id}'`)
			return
		}
		switch (outNode.config.type) {
			case 'gain':
				node.audioNode.connect(outNode.audioNode)
				break;
			case 'oscillator':
				switch (outParam) {
					case 'detune':
						node.audioNode.connect(outNode.audioNode.detune)
						break;
					default:
						console.log.error(`cannot connect '${id}' to param '${outId}.${outparam}'`)
						break;
				}
				break;
			case 'filter':
				node.audioNode.connect(outNode.audioNode)
				break;
			default:
				console.error(`cannot connect '${id}' to '${outId}'`)
				break;
		}
	}
	return node
}
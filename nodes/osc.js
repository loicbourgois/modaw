const newOscillator = (
	audioContext, id, signal,
	frequencyMin, frequencyValue, frequencyMax, frequencyResolution, 
	detuneMin, detuneValue, detuneMax, detuneResolution, 
	outId, startTime
) => {
	let node = new Object();
	node.audioNode = audioContext.createOscillator();
	node.audioNode.type = signal;
	node.html = document.createElement('div');
	node.html.detune = newControl(id+'-detune', 'slider', 'default', detuneMin, detuneMax, detuneValue, detuneResolution, node.audioNode.detune)
	node.html.frequency = newControl(id+'-frequency', 'slider', 'default', frequencyMin, frequencyMax, frequencyValue, frequencyResolution, node.audioNode.frequency, audioContext)
	node.html.appendChild(node.html.frequency);
	node.html.appendChild(node.html.detune);
	appendContent(node.html);
	node.connect = (nodes) => {
		outNode = nodes.get(outId)
		if (outNode === undefined) {
			console.warn(`for '${id}', out '${outId}' does not exist`)
			return
		}
		switch (outNode.config.type) {
			case 'filter':
				node.audioNode.connect(outNode.audioNode)
				break;
			case 'gain':
				node.audioNode.connect(outNode.audioNode)
				break;
			default:
				console.error(`cannot connect '${id}' to '${outId}'`)
				break;
		}
	}
	node.start = (currentTime) => {
		console.log("ee", id, frequencyValue)
		node.audioNode.frequency.setValueAtTime(frequencyValue, currentTime + startTime);
	}
	return node
}

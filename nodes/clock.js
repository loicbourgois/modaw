const newClock = (audioContext, id, bpm, resolution, length) => {
	let node = new Object()
	node.html = document.createElement('canvas');
	node.html.id = id;
	node.html.width = resolution;
	node.html.height = resolution;
	node.html.style.width = getCssSquareLength(1);
	node.html.style.height = getCssSquareLength(1);
	node.html.style.border = '0px solid';
	appendContent(node.html);
	let a = bpm / 60.0 / length
	let b = 1.0 / a / resolution
	node.localTimeAtTime = (t) => {
		return ( t * a ) % 1.0 
	}
	node.valueAtTime = (t) => {
		return 1.0 - node.localTimeAtTime(t)
	}
	let context = node.html.getContext('2d')
	node.draw = () => {
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
		node.drawTimeoutID = setTimeout(node.draw, node.drawInterval);
	}
	return node
}

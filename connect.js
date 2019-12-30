let durationSeconds = 0.001
let intervalMilliseconds = durationSeconds * 1000.0
let resolution = 2
let stepDuration = durationSeconds / resolution
	
const connectControllerToGain = (audioContext, controller, node) => {
	let t = 0;
	let value = 0;
	let startTime = 0;
	return setInterval(() => {
		startTime = audioContext.currentTime;
		for (let i = 0 ; i < resolution*2 ; i += 1) {
			t = startTime + stepDuration * i
			value = floatValueToRange(controller.valueAtTime(t),  node.config.min, node.config.max)
			node.audioNode.gain.setValueAtTime(value, t)
		}
		t = audioContext.currentTime
		value = floatValueToRange(controller.valueAtTime(t),  node.config.min, node.config.max)
		node.audioNode.gain.setValueAtTime(value, t)
		node.html.gain.value = controller.valueAtTime(t) * node.resolution
	}, intervalMilliseconds)
}

const connectControllerToDetune = (audioContext, controller, node) => {
	let t = 0;
	let value = 0;
	let startTime = 0;
	return setInterval(() => {
		startTime = audioContext.currentTime;
		for (let i = 0 ; i < resolution*2 ; i += 1) {
			t = startTime + stepDuration * i
			value = floatValueToRange(controller.valueAtTime(t),  node.config.detune.min, node.config.detune.max)
			node.audioNode.detune.setValueAtTime(value, t)
		}
		t = audioContext.currentTime
		value = floatValueToRange(controller.valueAtTime(t),  node.config.detune.min, node.config.detune.max)
		node.audioNode.detune.setValueAtTime(value, t)
		node.html.detune.value = floatValueToRange(controller.valueAtTime(t), 0, node.config.detune.resolution)
	}, intervalMilliseconds)
}

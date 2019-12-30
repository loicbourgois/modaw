const registerHtmlElements = () => {
	registerPresets()
	registerLoadButton()
	registerRunButton()
}


const registerPresets = () => {
	let selectPreset = document.getElementById('select-preset')
	presets.forEach((preset, key) => {
		let option = document.createElement('option');
		option.value = key
		option.innerHTML = key
		selectPreset.appendChild(option)
	})
}

const registerLoadButton = () => {
	document.getElementById('button-load').addEventListener('click', () => {
		writePresetToEditor(document.getElementById('select-preset').value)
		document.getElementById('button-run').click()
	})
}

const registerRunButton = () => {
	document.getElementById('button-run').addEventListener('click', () => {
		go(getConfigFromEditor())
	})
}

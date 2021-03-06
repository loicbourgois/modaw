presets.set('patch-1', {
	colors: {
		fill: '#e66',
	},
	nodes: [
		{
			id: 'clock-16',
			type: 'clock',
			bpm: 120 / 4 / 4,
			resolution: 100,
		}, {
			id: 'clock',
			type: 'clock',
			bpm: 120 / 4,
			resolution: 100,
		}, {
			id: 'clock-2',
			type: 'clock',
			bpm: 120,
			resolution: 100,
		}, {
			id: 'clock-3',
			type: 'clock',
			bpm: 120 * 3 / 2,
			resolution: 100,
		},  {
			id: 'sequencer',
			type: 'sequencer',
			clock: 'clock',
			resolution: 100,
			steps: [0.8, 0, 0.8, 0],
			width: 16,
			outs: [{
				id: 'gain-1',
				param: 'gain',
			}]
		},  {
			id: 'sequencer-2',
			type: 'sequencer',
			clock: 'clock',
			resolution: 100,
			steps: [0.8, 0.5, 0.1, 0.5, 0.8, 0.5],
			width: 16,
			outs: [{
				id: 'gain-2',
				param: 'gain',
			}]
		},  {
			id: 'sequencer-3',
			type: 'sequencer',
			clock: 'clock',
			resolution: 100,
			steps: [0.8, 0.0, 0.0, .8, 0.8, 0.0, 0.8, 0.0, 1.0],
			width: 16,
			outs: [{
				id: 'gain-3',
				param: 'gain',
			}]
		}, {
			id: 'sequencer-4',
			type: 'sequencer',
			clock: 'clock-2',
			resolution: 100,
			steps: [0.8, 0.5, 0.1],
			width: 4,
			outs: [{
				id: 'gain-4',
				param: 'gain',
			}]
		}, {
			id: 'sequencer-modulator-1-gain',
			type: 'sequencer',
			clock: 'clock-16',
			resolution: 100,
			steps: [1.0, 0.5, 1.0, 0.2],
			width: 16,
			outs: [{
				id: 'modulator-1-gain',
				param: 'gain',
			}]
		}, {
			id: 'osc-1',
			type: 'oscillator',
			signal: 'square',
			out: 'gain-1',
			frequency: {value: 55},
			startTime: 0,
		}, {
			id: 'osc-2',
			type: 'oscillator',
			signal: 'square',
			out: 'gain-2',
			frequency: {value: 110},
			startTime: 0,
		}, {
			id: 'osc-3',
			type: 'oscillator',
			signal: 'square',
			out: 'gain-3',
			frequency: {value: 220},
			startTime: 0,
		}, {
			id: 'gain-1',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: 'mixer-1',
		}, {
			id: 'gain-2',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: 'mixer-2',
		}, {
			id: 'gain-3',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: 'mixer-3',
		}, {
			id: 'gain-4',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: 'mixer-4',
		}, {
			id: 'osc-4',
			type: 'oscillator',
			signal: 'sine',
			out: 'gain-4',
			frequency: {value: 110},
			startTime: 0,
		}, 
		{
			id: 'modulator-1-osc',
			type: 'oscillator',
			out: 'modulator-1-gain',
			signal: 'sine',
			frequency: {value: 55},
			startTime: 0,
		}, {
			id: 'modulator-1-gain',
			type: 'gain',
			out: {
				id: 'osc-4',
				param: 'detune',
			},
			min: 0,
			value: 3111,
			max: 10000,
			mode: 'default',
		}, 
		{
			type: 'break',
			id: 'break-1'
		},{
			id: 'mixer-1',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: 'main-out',
		}, {
			id: 'mixer-2',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: 'main-out',
		}, {
			id: 'mixer-3',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: 'main-out',
		}, {
			id: 'mixer-4',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: 'main-out',
		}, {
			id: 'main-out',
			type: 'gain',
			value: 1,
			min: 0,
			max: 4,
			resolution: 1000,
			isMainOut: true,
		}
	]
})
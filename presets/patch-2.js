presets['patch-2'] = {
	nodes: [
		{
			id: 'clock-16',
			type: 'clock',
			bpm: 174 / 16,
			resolution: 100,
		}, {
			id: 'clock-8',
			type: 'clock',
			bpm: 174 / 8,
			resolution: 100,
		}, {
			id: 'clock',
			type: 'clock',
			bpm: 174,
			resolution: 100,
		}, {
			id: 'sequencer-1',
			type: 'sequencer',
			clock: 'clock-8',
			resolution: 100,
			steps: [0.8, 0.0, 0.5, 0.0, 0.8, 0.0, 0.0, 0.8, 0.7, 0.0, 0.7, 0.0, 0.8, 0.5, 0.1, 0.0],
			width: 16,
			outs: [{
				id: 'gain-1',
				param: 'gain',
			}]
		}, {
			id: 'sequencer-2',
			type: 'sequencer',
			clock: 'clock-8',
			resolution: 100,
			steps: [0.5, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0],
			width: 16,
			outs: [{
				id: 'osc-1',
				param: 'detune',
			}]
		}, {
			id: 'osc-1',
			type: 'oscillator',
			signal: 'square',
			out: 'gain-1',
			frequency: 55,
			detune: {
				min: -1000,
				value: 0,
				max: 4000,
				resolution: 10,
			},
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
			id: 'mixer-1',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: 'main-out',
		}, {
			id: 'main-out',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 4,
			resolution: 1000,
			isMainOut: true,
		}
	]
}
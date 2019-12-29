presets.set('patch-3', {
	colors: {
		fill: '#6e6',
	},
	nodes: [
		// Clocks
		{
			id: 'clock-16',
			type: 'clock',
			bpm: 120,
			length: 16,
			resolution: 100,
		},
		{
			id: 'clock-8',
			type: 'clock',
			bpm: 120,
			length: 8,
			resolution: 100,
		},
		{
			id: 'clock-4',
			type: 'clock',
			bpm: 120,
			length: 4,
			resolution: 100,
		},
		{
			id: 'clock-1',
			type: 'clock',
			bpm: 120,
			length: 1,
			resolution: 100,
		},
		// Bass
		{
			id: 'controller-1',
			type: 'controller',
			clock: 'clock-4',
			min: -12,
			max: 12,
			resolution: 24,
			values: [10, -5, 1, 5, -4, 1, 3, -2],
			width: 16,
			outs: [
				{
					id: 'osc-1',
					param: 'detune',
				}
			]
		},
		{
			id: 'osc-1',
			type: 'oscillator',
			signal: 'sine',
			frequency: {
				value: 55*4,
			},
			detune: {
				min: -1200,
				value: 0,
				max: 1200,
				resolution: 24,
			},
			startTime: 0,
			out: 'filter-1',
		}, 
		{
			id: 'osc-1-modulator',
			type: 'oscillator',
			out: 'osc-1-modulator-gain',
			signal: 'sine',
			frequency: {
				value: 55,
			},
			detune: {
				min: -1200,
				value: 0,
				max: 1200,
				resolution: 24,
			},
			startTime: 0,
		}, 
		{
			id: 'osc-1-modulator-gain',
			type: 'gain',
			out: {
				id: 'osc-1',
				param: 'detune',
			},
			min: 0,
			value: 1200,
			max: 1200*4,
			//resolution: ,
			mode: 'default',
		},
		{
			id: 'filter-1',
			type: 'filter',
			filter_type: 'lowshelf',
			frequency: {
				max: 2000,
				value: 1500,
				min: 1,
			},
			gain: {
				value: 35,
			},
			out: 'gain-1',
		},
		{
			id: 'gain-1',
			type: 'gain',
			value: 0.01,
			min: 0,
			max: 0.1,
			resolution: 1000,
			out: {
				id: 'mixer-1',
			}
		},
		///////////////////////////////////////////////////////////////////////
		// Kick
		///////////////////////////////////////////////////////////////////////
		{
			id: 'sequencer-1',
			type: 'sequencer',
			clock: 'clock-1',
			resolution: 100,
			steps: [0.8, 0.0, 0.0, 0.0],
			width: 16,
			outs: [{
				id: 'kick-gain-1',
				param: 'gain',
			}]
		}, 
		{
			id: 'sequencer-2',
			type: 'sequencer',
			clock: 'clock-1',
			resolution: 100,
			steps: [0.5, 0.0, 0.0, 0.0],
			width: 16,
			outs: [{
				id: 'kick-osc-1',
				param: 'detune',
			}]
		}, 
		{
			id: 'kick-osc-1',
			type: 'oscillator',
			signal: 'square',
			out: 'kick-gain-1',
			frequency: {
				value: 55,
			},
			detune: {
				min: -1000,
				value: 0,
				max: 4000,
				resolution: 10,
			},
			startTime: 0,
		}, 
		{
			id: 'kick-gain-1',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: {
				id: 'kick-filter-1',
			},
		},
		{
			id: 'kick-filter-1',
			type: 'filter',
			filter_type: 'lowshelf',
			out: 'kick-gain-2',
			frequency: {
				max: 1000,
				value: 200,
				min: 10,
			},
			gain: {
				value: 35,
			}
		}, 
		{
			id: 'kick-gain-2',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: {
				id: 'mixer-kick',
			}
		},
		///////////////////////////////////////////////////////////////////////
		// Hat
		///////////////////////////////////////////////////////////////////////
		{
			id: 'hat-sequencer',
			type: 'sequencer',
			clock: 'clock-1',
			resolution: 100,
			steps: [0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
			width: 16,
			outs: [
			{
				id: 'hat-gain',
				param: 'gain',
			}]
		},
		{
			id: 'hat-osc',
			type: 'oscillator',
			signal: 'sine',
			frequency: {
				value: 55*4,
			},
			detune: {
				min: -1200,
				value: 0,
				max: 1200,
				resolution: 24,
			},
			startTime: 0,
			out: 'hat-gain',
		}, 
		{
			id: 'hat-modulator',
			type: 'oscillator',
			out: 'hat-modulator-gain',
			signal: 'sine',
			frequency: {
				value: 55*4*4,
			},
			detune: {
				min: -1200,
				value: 0,
				max: 1200,
				resolution: 24,
			},
			startTime: 0,
		}, 
		{
			id: 'hat-modulator-gain',
			type: 'gain',
			out: {
				id: 'hat-osc',
				param: 'detune',
			},
			min: 0,
			value: 1200*35,
			max: 1200*4*10,
			mode: 'default',
		},
		/*{
			id: 'hat-filter',
			type: 'filter',
			filter_type: 'lowshelf',
			frequency: {
				max: 2000,
				value: 1500,
				min: 1,
			},
			gain: {
				value: 35,
			},
			out: 'hat-gain',
		},*/
		{
			id: 'hat-gain',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1.0,
			resolution: 1000,
			out: {
				id: 'mixer-hat',
			}
		},
		///////////////////////////////////////////////////////////////////////
		// Mixer
		///////////////////////////////////////////////////////////////////////
		{
			id: 'mixer-break',
			type: 'break',
		}, {
			id: 'mixer-1',
			type: 'gain',
			value: 0,//.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: {
				id: 'main-out',
			}
		}, 
		{
			id: 'mixer-kick',
			type: 'gain',
			value: 0,//.3,
			min: 0,
			max: 1,
			resolution: 1000,
			out: {
				id: 'main-out',
			}
		}, 
		{
			id: 'mixer-hat',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: {
				id: 'main-out',
			}
		}, 
		{
			id: 'main-out',
			type: 'gain',
			value: 2,
			min: 0,
			max: 4,
			resolution: 1000,
			isMainOut: true,
		}
	]
})
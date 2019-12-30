presets.set('patch-2', {
	nodes: [
		{
			id: 'clock-32',
			type: 'clock',
			bpm: 174,
			resolution: 30,
			length: 32,
		},
		{
			id: 'clock-16',
			type: 'clock',
			bpm: 174,
			resolution: 30,
			length: 16,
		},
		{
			id: 'clock-8',
			type: 'clock',
			bpm: 174,
			resolution: 30,
			length: 8,
		},
		{
			id: 'clock-4',
			type: 'clock',
			bpm: 174,
			resolution: 30,
			length: 4,
		},
		{
			id: 'clock',
			type: 'clock',
			bpm: 174,
			resolution: 30,
		},
		///////////////////////////////////////////////////////////////////////
		// Kick
		///////////////////////////////////////////////////////////////////////
		{
			id: 'sequencer-1',
			type: 'sequencer',
			clock: 'clock-8',
			resolution: 100,
			steps: [0.8, 0.2, 0.5, 0.1, 0.8, 0.3, 0.2, 0.8, 0.7, 0.2, 0.7, 0.8, 0.8, 0.5, 0.8, 0.1],
			width: 16,
			outs: [{
				id: 'gain-1-1',
				param: 'gain',
			}]
		}, 
		{
			id: 'sequencer-2',
			type: 'sequencer',
			clock: 'clock-8',
			resolution: 100,
			steps: [0.5, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.5, 0.0, 0.0, 0.5, 0.0],
			width: 16,
			outs: [{
				id: 'osc-1',
				param: 'detune',
			}]
		}, 
		{
			id: 'osc-1',
			type: 'oscillator',
			signal: 'square',
			out: 'gain-1-1',
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
			id: 'gain-1-1',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: {
				id: 'filter-1',
			},
		}, {
			id: 'filter-1',
			type: 'filter',
			filter_type: 'lowshelf',
			out: 'gain-1-2',
			frequency: {
				max: 1000,
				value: 200,
			},
			gain: {
				value: 35,
			}
		}, 
		{
			id: 'gain-1-2',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: 'mixer-1',
		}, 
		///////////////////////////////////////////////////////////////////////
		// Hi stuff
		///////////////////////////////////////////////////////////////////////
		/*/
		{
			id: 'sequencer-3',
			type: 'sequencer',
			clock: 'clock',
			resolution: 100,
			steps: [0.8, 0.5, 0.2],
			width: 4,
			outs: [{
				id: 'gain-2-1',
				param: 'gain',
			}]
		}, {
			id: 'sequencer-4',
			type: 'sequencer',
			clock: 'clock',
			resolution: 100,
			steps: [0.5, 0.0, 0.0],
			width: 4,
			outs: [{
				id: 'osc-2',
				param: 'detune',
			}]
		}, {
			id: 'osc-2',
			type: 'oscillator',
			signal: 'square',
			out: 'gain-2-1',
			frequency: {
				value: 55
			},
			detune: {
				min: -1000,
				value: 0,
				max: 4000,
				resolution: 10,
			},
			startTime: 0,
		}, {
			id: 'gain-2-1',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: {
				id: 'filter-2',
			},
		}, 
		{
			id: 'filter-2',
			type: 'filter',
			filter_type: 'highshelf',
			frequency: {
				max: 2000,
				value: 200,
			},
			gain: {
				value: 10,
			},
			out: 'gain-2-2',
		}, 
		{
			id: 'gain-2-2',
			type: 'gain',
			value: 0.2,
			min: 0,
			max: 1,
			resolution: 1000,
			out: 'mixer-2',
		},
		/**/
		///////////////////////////////////////////////////////////////////////
		// Noise 3
		///////////////////////////////////////////////////////////////////////
		{
			id: 'noise-3-controller-detune',
			type: 'controller',
			clock: 'clock-32',
			min: -12,
			max: 12,
			resolution: 24,
			values: [0, 3, 5, -2, 0, 3, 5, -2],
			width: 8,
			outs: [
				{
					id: 'noise-3-osc',
					param: 'detune',
				}
			]
		},
		{
			id: 'noise-3-sequencer-gain',
			type: 'sequencer',
			clock: 'clock-4',
			resolution: 100,
			steps: [0.8, 0.0, 0.0, 0.0, 0.8, 0.0, 0.0, 0.0, 0.8, 0.0, 0.0, 0.0, 0.8, 0.0, 0.0, 0.0],
			width: 16,
			outs: [
				{
					id: 'noise-3-gain',
					param: 'gain',
				}
			]
		},
		{
			id: 'noise-3-osc',
			type: 'oscillator',
			signal: 'square',
			frequency: {
				min: 55*4*2,
				value: 55*4*4,
				max: 55*4*4,
			},
			detune: {
				min: -1200,
				value: 0,
				max: 1200,
				resolution: 24,
			},
			startTime: 0,
			out: 'noise-3-gain',
		}, 
		{
			id: 'noise-3-gain',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: {
				id: 'noise-3-filter',
			},
		},
		{
			id: 'noise-3-filter',
			type: 'filter',
			filter_type: 'peaking',
			frequency: {
				max: 2000,
				value: 200,
			},
			gain: {
				value: 10,
			},
			out: 'noise-3-gain-2',
		},
		{
			id: 'noise-3-gain-2',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: {
				id: 'mixer-3',
			},
		},
		///////////////////////////////////////////////////////////////////////
		// Noise 4
		///////////////////////////////////////////////////////////////////////
		{
			id: 'noise-4-controller-detune',
			type: 'controller',
			clock: 'clock-32',
			min: -12,
			max: 12,
			resolution: 24,
			values: [0, 3, 5, -2, 0, 3, 5, -2],
			width: 8,
			outs: [
				{
					id: 'noise-4-osc',
					param: 'detune',
				}
			]
		},
		{
			id: 'noise-4-sequencer-gain',
			type: 'sequencer',
			clock: 'clock-4',
			resolution: 100,
			steps: [0.8, 0.0, 0.0, 0.0, 0.8, 0.0, 0.0, 0.0, 0.8, 0.0, 0.0, 0.0, 0.8, 0.0, 0.5, 0.0],
			width: 16,
			outs: [
				{
					id: 'noise-4-gain',
					param: 'gain',
				}
			]
		},
		{
			id: 'noise-4-osc',
			type: 'oscillator',
			signal: 'square',
			frequency: {
				min: 55*2,
				value: 55*2,
				max: 55*4,
			},
			detune: {
				min: -1200,
				value: 0,
				max: 1200,
				resolution: 24,
			},
			startTime: 0,
			out: 'noise-4-gain',
		}, 
		{
			id: 'noise-4-gain',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: {
				id: 'noise-4-filter',
			},
		},
		{
			id: 'noise-4-filter',
			type: 'filter',
			filter_type: 'lowshelf',
			frequency: {
				max: 5000,
				value: 2000,
			},
			gain: {
				value: 10,
			},
			out: 'noise-4-gain-2',
		},
		{
			id: 'noise-4-gain-2',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: {
				id: 'mixer-4',
			},
		},
		///////////////////////////////////////////////////////////////////////
		//Mixer
		///////////////////////////////////////////////////////////////////////
		{
			id: 'mixer-break',
			type: 'break',
		},
		{
			id: 'mixer-1',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: 'main-out',
		},
		{
			id: 'mixer-2',
			type: 'gain',
			value: 0.05,
			min: 0,
			max: 1,
			resolution: 1000,
			out: 'main-out',
		},
		{
			id: 'mixer-3',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: 'main-out',
		},
		{
			id: 'mixer-4',
			type: 'gain',
			value: 0.5,
			min: 0,
			max: 1,
			resolution: 1000,
			out: 'main-out',
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
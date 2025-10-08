import { Vector2 } from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/Addons.js';

const createBloomFx = () => {
	const params = {
		strength: 0.5,
		radius: 0.5,
		threshold: 0.5,
		enabled: true,
	};
	const fx = new UnrealBloomPass(
		new Vector2(256, 256),
		params.strength,
		params.radius,
		params.threshold
	);

	return {
		get fx() {
			return fx;
		},

		get params() {
			return params;
		},

		resize: ({ width, height }: { width: number; height: number }) => {
			fx.resolution.set(width, height);
		},

		update: () => {
			fx.enabled = params.enabled;
			fx.strength = params.strength;
			fx.radius = params.radius;
			fx.threshold = params.threshold;
		},
	};
};

export default createBloomFx;

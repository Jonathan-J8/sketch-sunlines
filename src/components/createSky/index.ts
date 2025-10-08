import { BackSide, ShaderMaterial, SphereGeometry } from 'three';
import { Sky } from 'three/examples/jsm/Addons.js';
import { degToRad } from 'three/src/math/MathUtils.js';
import fragmentShader from './frag.glsl';
import vertexShader from './vert.glsl';

type Props = {
	uniforms: {
		uTime: { value: number };
	};
};

const createSky = ({ uniforms: globalUni }: Props) => {
	class CustomSky extends Sky {
		constructor() {
			super();
			this.material = new ShaderMaterial({
				name: 'CustomSky',
				uniforms: {
					//@ts-ignore
					...Sky.SkyShader.uniforms,
					...globalUni,
					sunOpacity: {
						value: 0,
					},
					horizonOffset: {
						value: 0,
					},
				},
				vertexShader: vertexShader,
				fragmentShader: fragmentShader,
				side: BackSide,
				depthWrite: false,
			});
			//@ts-ignore
			this.geometry = new SphereGeometry(1, 50, 50);
		}
	}

	const SCALE = 45000;
	const mesh = new CustomSky();
	mesh.name = 'sky';
	mesh.material.uniforms = { ...globalUni, ...mesh.material.uniforms };
	mesh.scale.setScalar(SCALE);

	const params = {
		horizonOffset: { value: -0.6 },
		elevation: { value: 0.5 },
		azimuth: { value: 180 },
		visible: { value: true },
	};
	const uniforms = mesh.material.uniforms;
	uniforms.turbidity.value = 15;
	uniforms.rayleigh.value = 0.5;
	uniforms.mieCoefficient.value = 0.005;
	uniforms.mieDirectionalG.value = 0.6;
	uniforms.sunOpacity.value = 1;

	// const updateSunPosition = () => {
	// 	const { sunPosition } = uniforms;
	// 	const phi = degToRad(90 - params.elevation.value);
	// 	const theta = degToRad(params.azimuth.value);
	// 	sunPosition.value.setFromSphericalCoords(1, phi, theta);
	// };

	// const updateHorizonOffset = () => {
	// 	const { horizonOffset } = uniforms;
	// 	horizonOffset.value = params.horizonOffset.value * -SCALE;
	// };

	// updateHorizonOffset();
	// updateSunPosition();

	const update = () => {
		const { sunPosition, horizonOffset } = uniforms;
		const phi = degToRad(90 - params.elevation.value);
		const theta = degToRad(params.azimuth.value);
		sunPosition.value.setFromSphericalCoords(1, phi, theta);
		horizonOffset.value = params.horizonOffset.value * -SCALE;
	};

	update();

	return Object.freeze({
		get mesh() {
			return mesh;
		},

		get params() {
			const { turbidity, rayleigh, mieCoefficient, mieDirectionalG, sunOpacity } = uniforms;

			return {
				turbidity,
				rayleigh,
				mieCoefficient,
				mieDirectionalG,
				sunOpacity,
				...params,
			};
		},
		update: () => {
			const { sunPosition, horizonOffset } = uniforms;
			const phi = degToRad(90 - params.elevation.value);
			const theta = degToRad(params.azimuth.value);
			sunPosition.value.setFromSphericalCoords(1, phi, theta);
			horizonOffset.value = params.horizonOffset.value * -SCALE;
			mesh.visible = params.visible.value;
		},
	});
};

export default createSky;

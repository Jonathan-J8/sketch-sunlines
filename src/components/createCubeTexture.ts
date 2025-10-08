import {
	CubeCamera,
	HalfFloatType,
	WebGLCubeRenderTarget,
	type Scene,
	type WebGLRenderer,
} from 'three';

const createCubeTexture = () => {
	const rt = new WebGLCubeRenderTarget(256);
	rt.texture.type = HalfFloatType;

	const camera = new CubeCamera(1, 1000, rt);

	const update = ({ renderer, scene }: { renderer: WebGLRenderer; scene: Scene }) => {
		camera.update(renderer, scene);
	};

	return {
		get texture() {
			return rt.texture;
		},
		update,
	};
};

export default createCubeTexture;

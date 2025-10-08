import { Animator, CameraWrapper, RendererWrapper, Resizer, SceneWrapper } from 'joeat-utils';
import { PerspectiveCamera, Quaternion, Scene, Vector2, Vector3, WebGLRenderer } from 'three';
import { EffectComposer, OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

// THREE
const canvas = document.getElementById('three') as HTMLCanvasElement;
const threeRenderer = new WebGLRenderer({ canvas });
const threeCamera = new PerspectiveCamera(75, 2, 0.1, 1000);
const threeScene = new Scene();
const threeControls = new OrbitControls(threeCamera, canvas);

// WRAPPERS & EMITTERS
const animator = new Animator();
const resizer = new Resizer(canvas);
const scene = new SceneWrapper({ instance: threeScene });
const renderer = new RendererWrapper({ instance: threeRenderer, EffectComposer, Vector2 });
const camera = new CameraWrapper({
	instance: threeCamera,
	controls: threeControls,
	Vector3,
	Quaternion,
});

// GUI
const gui = new GUI();
gui.close();
animator.debug(gui);
resizer.debug(gui);
renderer.debug(gui);
camera.debug(gui);

// HMR
if (import.meta?.hot) {
	import.meta.hot.dispose(() => {
		gui.destroy();
		animator.clear();
		resizer.clear();
		renderer.clear();
		camera.clear();
		scene.clear();
	});
}

// HOOK
const useThreeWrapper = () => {
	return { gui, canvas, animator, resizer, renderer, scene, camera };
};

export default useThreeWrapper;

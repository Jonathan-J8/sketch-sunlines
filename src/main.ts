import './style.css';

import { dampThreshold } from 'joeat-utils';
import { ColorManagement, LinearToneMapping } from 'three';
import { FXAAShader, OutputPass, RenderPass, ShaderPass } from 'three/examples/jsm/Addons.js';
import { mapLinear } from 'three/src/math/MathUtils.js';
import createBloomFx from './components/createBloomFx';
import createCubeTexture from './components/createCubeTexture';
import createLines from './components/createLines';
import createSky from './components/createSky';
import usePointerUniforms from './usePointerUniforms';
import useThreeWrapper from './useThreeWrapper';

const { scene, gui, renderer, animator, camera, resizer } = useThreeWrapper();
const pointerUniforms = usePointerUniforms();
ColorManagement.enabled = true;
const SCENE_HEIGHT = 50;
let scrollY = 100;
camera.instance.position.z = 15;
camera.instance.position.y = scrollY;
scene.instance.fog = null;
renderer.instance.toneMapping = LinearToneMapping;

// COMPONENTS
const renderPass = new RenderPass(scene.instance, camera.instance);
const fxaa = new ShaderPass(FXAAShader);
const output = new OutputPass();
const bloom = createBloomFx();
const cubeTexture = createCubeTexture();
const sky = createSky({ uniforms: { uTime: animator.uniforms.uTime } });
const lines = createLines({
	count: 256,
	width: 10,
	height: SCENE_HEIGHT,
	envMap: cubeTexture.texture,
	uniforms: {
		uTime: animator.uniforms.uTime,
		...pointerUniforms,
	},
});

// SETUP SCENE
const scroll = () => {
	scrollY = window.scrollY / (document.body.scrollHeight - window.innerHeight);
};

const update = ({ deltaMs, deltaTime }: { deltaMs: number; deltaTime: number }) => {
	const y = scrollY;

	sky.params.rayleigh.value = (1 - y) * 2;
	sky.params.mieDirectionalG.value = mapLinear(y, 0, 1, 0.3, 0.95);
	sky.params.horizonOffset.value = mapLinear(y, 0, 1, -0.9, 0.3);
	bloom.params.threshold = mapLinear(y, 0, 1, 0.5, 1);

	if (!camera.controls.enabled)
		camera.instance.position.y = dampThreshold(
			camera.instance.position.y,
			y * -SCENE_HEIGHT,
			0.003,
			deltaMs
		);

	if (renderer.instance)
		cubeTexture.update({ renderer: renderer.instance, scene: scene.instance });

	camera.update({ deltaTime });
	renderer.update({ scene: scene.instance, camera: camera.instance, deltaTime });
};

scene.instance.add(sky.mesh, lines.mesh);
renderer.addEffect(renderPass, bloom.fx, fxaa, output);

window.addEventListener('scroll', scroll, false);
resizer.addListener(camera.resize, renderer.resize, bloom.resize);
animator.addListener(update);
scroll();

resizer.fire();
animator.play(renderer.instance);

// GUI
{
	const folder = gui.addFolder('BLOOM');
	const params = bloom.params;
	folder.add(params, 'enabled').onChange(bloom.update);
	folder.add(params, 'strength', 0, 1).onChange(bloom.update);
	folder.add(params, 'radius', 0, 1).onChange(bloom.update);
	folder.add(params, 'threshold', 0, 1).onChange(bloom.update).listen();
}
{
	const folder = gui.addFolder('SKY');
	const params = sky.params;
	folder.add(params.visible, 'value').name('visible').onChange(sky.update);
	folder.add(params.turbidity, 'value', 0, 20).name('turbidity');
	folder.add(params.rayleigh, 'value', 0, 2).name('rayleigh').listen();
	folder.add(params.mieCoefficient, 'value', 0.001, 0.01).name('mieCoefficient');
	folder.add(params.mieDirectionalG, 'value', 0, 1).name('mieDirectionalG').listen();
	folder.add(params.sunOpacity, 'value', 0, 1).name('sunOpacity');
	folder.add(params.azimuth, 'value', 0, 360).name('azimuth').onChange(sky.update).listen();
	folder
		.add(params.horizonOffset, 'value', -1, 2, 0.0001)
		.name('horizonOffset')
		.onChange(sky.update)
		.listen();
	folder.add(params.elevation, 'value', -2, 90).name('elevation').onChange(sky.update).listen();
	// folder.add({ hours: 12 }, 'hours', 0, 24).name('hours').onChange((h: number) => {
	// 		const PI2 = Math.PI * 2;
	// 		const HALF_PI = Math.PI / 2;
	// 		const elevation = 0.5 * (1 + Math.sin((h / 24) * PI2 - HALF_PI));
	// 		sky.params.elevation.value = elevation * 90;
	// 		sky.params.azimuth.value = mapLinear(h, 0, 24, 360, 0);
	// 		sky.updateSunPosition();
	// 	});
}

if (import.meta?.hot) {
	import.meta.hot.dispose(() => {
		window.removeEventListener('scroll', scroll, false);
	});
}

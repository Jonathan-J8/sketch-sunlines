import { CubeTexture, DoubleSide, MeshStandardMaterial, type Vector2, type Vector3 } from 'three';

import frag_include from './frag_include.glsl';
import frag_main from './frag_main.glsl';
import vert_include from './vert_include.glsl';
import vert_main from './vert_main.glsl';

type Props = {
	uniforms: {
		uTime: { value: number };
		uPointerWorldPosition: { value: Vector3 };
		uPointerPositionVelocity: { value: Vector2 };
	};
	envMap: CubeTexture;
	count: number;
	height: number;
};

const createMaterial = ({ uniforms, envMap, count, height }: Props) => {
	const material = new MeshStandardMaterial({
		side: DoubleSide,
		envMap,
		envMapIntensity: 1,
		transparent: true,
		metalness: 1,
		roughness: 0.07,
		opacity: 1,
		fog: false,
	});
	material.customProgramCacheKey = () => `CustomStandardLines2`;

	material.onBeforeCompile = (shader) => {
		shader.defines = { COUNT: count, HEIGHT: height };
		shader.uniforms = { ...uniforms, ...shader.uniforms };

		shader.vertexShader = shader.vertexShader.replace(
			'#include <common>',
			`${vert_include}
      		#include <common>`
		);
		shader.vertexShader = shader.vertexShader.replace(
			'#include <project_vertex>',
			`${vert_main}`
		);

		shader.fragmentShader = shader.fragmentShader.replace(
			'#include <common>',
			`${frag_include}
      		#include <common>`
		);
		shader.fragmentShader = shader.fragmentShader.replace(
			'#include <opaque_fragment>',
			`${frag_main}`
		);
	};

	return material;
};

export default createMaterial;

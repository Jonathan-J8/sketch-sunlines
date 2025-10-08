import { PointerTracker, Spring } from 'joeat-utils';
import { Plane, Raycaster, Vector2, Vector3 } from 'three';
import useThreeWrapper from './useThreeWrapper';

const { animator, camera, canvas } = useThreeWrapper();
const pointer = new PointerTracker({ camera: camera.instance, Raycaster, Plane, Vector2, Vector3 });

const options = { mass: 0.2, tension: 1, friction: 0.5 };

const uPointerWorldPosition = {
	value: new Vector3(),
};

const posx = new Spring(0, {
	...options,
	onUpdate: (value) => {
		uPointerWorldPosition.value.x = value;
	},
});

const posy = new Spring(0, {
	...options,
	onUpdate: (value) => {
		uPointerWorldPosition.value.y = value;
	},
});

const posz = new Spring(0, {
	...options,
	onUpdate: (value) => {
		uPointerWorldPosition.value.z = value;
	},
});

canvas.addEventListener('pointermove', pointer.onMove, false);
canvas.addEventListener('pointerout', pointer.onMove, false);

pointer.addMoveListener(() => {
	const {
		uPointerWorldPosition: { value: position },
	} = pointer.uniforms;
	posx.to(position.x);
	posy.to(position.y);
	posz.to(position.z);
});

animator.addListener(({ deltaTime }) => {
	posx.update(deltaTime);
	posy.update(deltaTime);
	posz.update(deltaTime);
});

if (import.meta?.hot) {
	import.meta.hot.dispose(() => {
		canvas.removeEventListener('pointermove', pointer.onMove, false);
		canvas.removeEventListener('pointerout', pointer.onMove, false);
		pointer.clear();
	});
}

export default () => ({
	uPointerWorldPosition,
	uPointerPositionVelocity: pointer.uniforms.uPointerPositionVelocity,
});

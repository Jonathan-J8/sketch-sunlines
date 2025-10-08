import {
	BufferGeometry,
	InstancedBufferAttribute,
	InstancedBufferGeometry,
	PlaneGeometry,
} from 'three';

const createOffsets = ({ count, width = 1 }: { count: number; width: number; height: number }) => {
	const offsets = new Float32Array(count * 3);

	for (let i = 0; i < count; ++i) {
		const inc = i * 3;
		const theta = Math.random() * Math.PI * 2; // Random angle around the cylinder
		const r = Math.sqrt(Math.random()) * width; // Random radius (using square root for uniform distribution)
		const x = r * Math.cos(theta);
		const z = r * Math.sin(theta);
		offsets[inc + 0] = x;
		offsets[inc + 1] = 0;
		offsets[inc + 2] = z;
	}
	return offsets;
};

const createIndexes = ({ count }: { count: number }) => {
	const indexes = new Float32Array(count);
	for (let i = 0; i < count; ++i) indexes[i] = i;
	return indexes;
};

type Props = {
	count: number;
	width: number;
	height: number;
};

const createGeometry = ({ count, width = 1, height = 1 }: Props) => {
	const geometry = new InstancedBufferGeometry();
	let temp: BufferGeometry | undefined = new PlaneGeometry(0.05, height, 1, height * 10);
	temp.translate(0, height / -2.5, 0);

	geometry.index = temp.index;
	geometry.attributes = temp.attributes;

	temp.dispose();
	temp = undefined;

	const indexes = createIndexes({ count });
	const offsets = createOffsets({ count, width, height });
	geometry.setAttribute('index', new InstancedBufferAttribute(indexes, 1));
	geometry.setAttribute('offset', new InstancedBufferAttribute(offsets, 3));

	return geometry;
};

export default createGeometry;

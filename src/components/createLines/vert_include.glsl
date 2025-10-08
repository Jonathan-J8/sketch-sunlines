#include /lygia/generative/pnoise

uniform float uTime;
uniform vec3 uPointerWorldPosition;
uniform vec2 uPointerPositionVelocity;

in vec3 offset;
in float index;

out vec3 vPosition2;
out vec2 vUv2;
out float vIndex;

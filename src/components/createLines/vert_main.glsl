float time = uTime;
float freq = .1;
float speed = .0001;


 // Displacement
vec3 displaced = transformed;
displaced.x += pnoise(vec2(transformed.x, transformed.y * freq + time * speed ), vec2(.587, .138)) * 2. ;
displaced.z += pnoise(vec2(transformed.z, transformed.y * freq + time * speed ), vec2(3.5, 2.3)) * 5.;
transformed += displaced;

// Billboard rotation matrix
vec3 look = normalize(cameraPosition - offset);
look.y = 0.0;
look = normalize(look);
vec3 up = vec3(0.0, 1.0, 0.0);  
vec3 right = normalize(cross(up, look));
vec3 forward = cross(right, up); // maintain Y-up
mat3 billboardRotation = mat3(right, up, forward);

// Add world offset
transformed = offset + billboardRotation * transformed;
vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif

// Mouse interaction
mvPosition = modelMatrix * mvPosition;
vec3 mousePos = uPointerWorldPosition;
vec2 mouseVel = clamp(uPointerPositionVelocity, -.2, .2);
float dist = distance( mvPosition.xy, mousePos.xy );
float influence = smoothstep( 15., .0, dist );
mvPosition.x +=  mousePos.x * influence ;
mvPosition.z +=  mousePos.z * influence ;


vPosition2 = mvPosition.xyz;
vUv2 = uv;
vIndex = index;
gl_Position = projectionMatrix * viewMatrix * mvPosition;
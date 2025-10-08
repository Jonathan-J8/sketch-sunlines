

vec3 _pos = vPosition2;
vec2 _uv = vUv2;
float _time = uTime * -0.00001;
float _phase =  vIndex / float( COUNT ) ;
float _size = 100.;


float rect = smoothstep(.95, 1., sin( (_uv.y + _time + _phase  ) * _size ) ); 
float centerFade = abs(_uv.y - 0.5); 
float fade = 1.-  smoothstep(.3,  .5, centerFade) ; 

outgoingLight += rect;

#ifdef OPAQUE
    diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
    diffuseColor.a *= material.transmissionAlpha;
#endif


diffuseColor.a *= clamp(rect, 0.2, 1.) * fade;

gl_FragColor = vec4( outgoingLight, diffuseColor.a );
  
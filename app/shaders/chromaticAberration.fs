uniform sampler2D tDiffuse;
uniform float time;
varying vec2 vUv;

void main( ){
	vec2 uv = vUv;

	float amount = 0.0;
	
	amount = (1.0 + sin(time*6.0)) * 0.5;
	amount *= 1.0 + sin(time*16.0) * 0.5;
	amount *= 1.0 + sin(time*19.0) * 0.5;
	amount *= 1.0 + sin(time*27.0) * 0.5;
	amount = pow(amount, 3.0);

	amount *= 0.05;
	
	vec3 col;
	col.r = texture2D( tDiffuse, vec2(uv.x+amount,uv.y) ).r;
	col.g = texture2D( tDiffuse, uv ).g;
	col.b = texture2D( tDiffuse, vec2(uv.x-amount,uv.y) ).b;

	col *= (1.0 - amount * 0.5);
	
	gl_FragColor = vec4(col,1.0);
}

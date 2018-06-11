uniform sampler2D tDiffuse;
uniform float time;
varying vec2 vUv;

float rand () {
	return fract(sin(time)*1e4);
}

void main( ){
	vec2 uv = vUv;

	vec2 uvR = uv;
	vec2 uvB = uv;
	uvR.x = uv.x * 1.0 - rand() * 0.02 * 0.8;
	uvB.y = uv.y * 1.0 + rand() * 0.02 * 0.8;
	if(uv.y < rand() && uv.y > rand() -0.1 && sin(time) < 0.0){
		uv.x = (uv + 0.02 * rand()).x;
	}
	vec4 c;
	c.r = texture2D(tDiffuse, uvR).r;
	c.g = texture2D(tDiffuse, uv).g;
	c.b = texture2D(tDiffuse, uvB).b;
	float scanline = sin( uv.y * 800.0 * rand())/30.0; 
	c *= 1.0 - scanline; 
	//vignette
	float vegDist = length(( 0.5 , 0.5 ) - uv);
	c *= 1.0 - vegDist * 0.6;
	gl_FragColor = c;
}
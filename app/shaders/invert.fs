uniform sampler2D tDiffuse;
uniform bool on;
varying vec2 vUv;

void main(){
	vec4 col = texture2D( tDiffuse, vUv );
	if( on ) gl_FragColor = vec4( 1.0 - col.r, 1.0 - col.g, 1.0 - col.b, 1.0 );
	else gl_FragColor = col;
}
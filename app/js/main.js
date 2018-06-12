var data = require('./data.json');
window.THREE = require('three');
var EffectComposer = require('three-effectcomposer')(THREE);

var Shaders = require('./Shaders');
var Letters = require('./Letters');
var Body = require('./Body');

var Main = function( ) {
	this.node = document.getElementById('main');
	
	this.time = 0;
	this.timeInc = 0.01;

	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();
	this.renderer = new THREE.WebGLRenderer( { alpha : false, antialias : true } );
	this.node.appendChild( this.renderer.domElement );

	this.beats = 0;
	this.bars = 0;
	this.fourbars = 0;

	this.bpms = 60 / data[ 0 ].bpm * 1000;
	
	this.beatInterval = setInterval( this.beat.bind( this ), this.bpms );

	this.letters = new Letters( this.node.offsetWidth * 2, 13 * 4 ); // THREE.WebGLRenderTarget
	this.letters.updateWord( data[0].song );

	this.body = new Body( this.letters, this.node.offsetWidth, this.letters.fontSize );

	this.scene.add( this.body );

	var renderTarget = new THREE.WebGLRenderTarget( this.node.offsetWidth * 2, this.node.offsetHeight * 2, { depthBuffer : false, stencilBuffer : false } );

	// Create your composer and first RenderPass
	this.composer = new EffectComposer( this.renderer, renderTarget );
	this.composer.addPass(new EffectComposer.RenderPass( this.scene, this.camera ) );
	
	// this.tapTempo.on( 'beat', this.beat.bind( this ) );
	
	// And another shader, drawing to the screen at this point
	this.effect = new EffectComposer.ShaderPass( Shaders.invert );
	this.composer.addPass( this.effect );

	// this.effect3 = new EffectComposer.ShaderPass( THREE.RGBShiftShader );
	// this.composer.addPass( this.effect3 );

	// this.effect2 = new EffectComposer.ShaderPass( THREE.cromaticAberrationShader );
	// this.composer.addPass( this.effect2 );

	this.effect.renderToScreen = true;

	window.addEventListener( 'keydown', this.keyDown.bind( this ) );
	window.addEventListener( 'resize', this.resize.bind( this ) );

	this.resize();
	this.step();
}

Main.prototype.keyDown = function( e ){
	if( e.keyCode == 37 ) this.input.prevWord(); // left
	if( e.keyCode == 39 ) this.input.nextWord(); // right
}

Main.prototype.beat = function( ){
	if( this.beats < 3 ) this.beats++;
	else {
		this.beats = 0;
		if( this.bars < 3 ) this.bars++;
		else {
			this.bars = 0;
			this.fourbars++;
		}
	}

	console.log( this.beats, this.bars, this.fourbars );

	this.letters.updateTrack( -1 + Math.random() * 2 );
	this.letters.updateRotation( -1 + Math.random() * 2 );
	this.body.updateLineHeight( -1 + Math.random() * 2 );
	this.body.updateLineOffset( -1 + Math.random() * 2 );
}

Main.prototype.resize = function( e ) {
	var width = this.node.offsetWidth, height = this.node.offsetHeight;

	this.letters.resize( width, height );
	this.body.resize( width, height );

	var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 };
	for ( var prop in camView) this.camera[ prop ] = camView[ prop ];
	this.camera.position.z = 1000;
	
	this.renderer.setSize( width * 2, height * 2 );
	this.renderer.domElement.setAttribute( 'style', 'width:' + width + 'px; height:' + height + 'px;' );

	this.camera.updateProjectionMatrix( );
}

Main.prototype.step = function( time ) {
	window.requestAnimationFrame( this.step.bind( this ) );

	this.time += this.timeInc;
	this.renderer.render( this.letters.scene, this.letters.camera, this.letters, true );

	this.composer.render()
};

var root = new Main();
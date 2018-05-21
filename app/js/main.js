window.THREE = require('three');
var EffectComposer = require('three-effectcomposer')(THREE)

var baseVs = require('./../shaders/base.vs');
var rgbShiftFs = require('./../shaders/rgbShift.fs');
// var xp = JSON.parse( require('./../img/export/export.json') );
// console.log(xp);

// var glyphs = {};

// for( var i = 0 ; i < xp.length ; i++ ){
// 	glyphs[ 'g' + xp[i].id ] = xp[i];
// }

// console.log( JSON.stringify(glyphs) );

THREE.RGBShiftShader = {
  uniforms: {
    "tDiffuse": { type: "t", value: null },
    "amount":   { type: "f", value: 0.0 },
    "angle":    { type: "f", value: 0.0 }
  },
  vertexShader: baseVs,
  fragmentShader: rgbShiftFs
};

var Input = require('./input');
var TapTempo = require('./TapTempo');
var Letters = require('./Letters');
var Body = require('./Body');
var Controller = require('./Controller');

var Main = function( ) {
	this.node = document.getElementById('main');
	
	this.time = 0;
	this.timeInc = 0.01;
	this.sides = 8;
	this.fontSize = 13;

	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();
	this.renderer = new THREE.WebGLRenderer( { alpha : true, antialias : true } );
	this.node.appendChild( this.renderer.domElement );

	this.input = new Input();
	
	this.tapTempo = new TapTempo();
	this.letters = new Letters( this.node.offsetWidth * 2, this.fontSize * 4 );
	this.input.on( 'updateWord', this.letters.updateWord.bind(this.letters) );
	this.letters.updateWord( this.input.values[ this.input.currentValue ] );

	this.body = new Body( this.letters, this.node.offsetWidth, this.letters.fontSize );
	this.controller = new Controller( this.letters, this.body, this.tapTempo );

	this.scene.add( this.body );



	// Create your composer and first RenderPass
	this.composer = new EffectComposer( this.renderer );
	this.composer.addPass(new EffectComposer.RenderPass( this.scene, this.camera ) );
	console.log(this.composer)
	this.tapTempo.on( 'beat', this.beat.bind( this ) );
	// Redraw with a shader
	// var effect = new EffectComposer.ShaderPass( THREE.DotScreenShader );
	// this.composer.addPass( effect );

	// And another shader, drawing to the screen at this point
	var effect = new EffectComposer.ShaderPass( THREE.RGBShiftShader );
	effect.renderToScreen = true;
	this.composer.addPass( effect );

	window.addEventListener( 'keydown', this.keyDown.bind( this ) );
	window.addEventListener( 'resize', this.resize.bind( this ) );

	this.resize();
	this.step();
}

Main.prototype.keyDown = function( e ){
	if( e.keyCode == 37 ) this.input.prevWord(); // left
	if( e.keyCode == 39 ) this.input.nextWord(); // right
	if( e.keyCode == 18 ) this.input.switch(); // alt
	if( e.keyCode == 32 ) this.tapTempo.tap(); // spacebar
	if( e.keyCode == 109 ) this.tapTempo.resetCount(); // m
}

Main.prototype.beat = function( ){
	// this.composer.passes[1].uniforms.amount.value = Math.random() / 10;
}

Main.prototype.nextWord = function( ){

}

Main.prototype.resize = function( e ) {
	var width = this.node.offsetWidth, height = this.node.offsetHeight;

	this.letters.resize( width, height );
	this.body.resize( width, height );

	var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 };
	for ( var prop in camView) this.camera[ prop ] = camView[ prop ];
	this.camera.position.z = 1000;
	this.camera.updateProjectionMatrix( );

	this.renderer.setSize( width * 2, height * 2 );
	this.renderer.domElement.setAttribute( 'style', 'width:' + width + 'px; height:' + height + 'px;' );

}

Main.prototype.step = function( time ) {
	window.requestAnimationFrame( this.step.bind( this ) );

	this.controller.step( time );
	this.tapTempo.step( time );

	this.time += this.timeInc;
	this.renderer.render( this.letters.scene, this.letters.camera, this.letters, true );
	// this.renderer.render( this.scene, this.camera );
	this.composer.render()
};

var root = new Main();
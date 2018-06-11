window.THREE = require('three');
var EffectComposer = require('three-effectcomposer')(THREE)

var baseVs = require('./../shaders/base.vs');
var rgbShiftFs = require('./../shaders/rgbShift.fs');
var glitchFs = require('./../shaders/glitch.fs');
var glitch2Fs = require('./../shaders/glitch2.fs');
var noiseFs = require('./../shaders/noise.fs');
var invertFs = require('./../shaders/invert.fs');
var chromaticAberrationFs = require('./../shaders/chromaticAberration.fs');
var data = require('./data.json');

console.log( data );

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
    "amount":   { type: "f", value: 0.01 },
    "angle":    { type: "f", value: 0.3 }
  },
  vertexShader: baseVs,
  fragmentShader: rgbShiftFs
};

THREE.glitchShader = {
  uniforms: {
    "tDiffuse": { type: "t", value: null },
    "time":    { type: "f", value: 1.0 }
  },
  vertexShader: baseVs,
  fragmentShader: glitchFs
};

THREE.glitchShader2 = {
  uniforms: {
    "tDiffuse": { type: "t", value: null },
    "time":    { type: "f", value: 1.0 }
  },
  vertexShader: baseVs,
  fragmentShader: glitch2Fs
};

THREE.noiseShader = {
  uniforms: {
    "tDiffuse": { type: "t", value: null },
    "seed":    { type: "f", value: 1.0 }
  },
  vertexShader: baseVs,
  fragmentShader: noiseFs
};

THREE.invertShader = {
  uniforms: {
    "tDiffuse": { type: "t", value: null },
    "on":    { type: "f", value: 1.0 }
  },
  vertexShader: baseVs,
  fragmentShader: invertFs
};

THREE.cromaticAberrationShader = {
  uniforms: {
    "tDiffuse": { type: "t", value: null },
    "time":    { type: "f", value: 1.0 }
  },
  vertexShader: baseVs,
  fragmentShader: invertFs
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
	this.renderer = new THREE.WebGLRenderer( { alpha : false, antialias : true } );
	this.node.appendChild( this.renderer.domElement );

	this.input = new Input();
	
	this.tapTempo = new TapTempo();
	this.letters = new Letters( this.node.offsetWidth * 2, this.fontSize * 4 );
	this.input.on( 'updateWord', this.letters.updateWord.bind(this.letters) );
	this.letters.updateWord( this.input.values[ this.input.currentValue ] );

	this.body = new Body( this.letters, this.node.offsetWidth, this.letters.fontSize );
	this.controller = new Controller( this.letters, this.body, this.tapTempo );

	this.scene.add( this.body );

	var renderTarget = new THREE.WebGLRenderTarget( this.node.offsetWidth * 2, this.node.offsetHeight * 2, { depthBuffer : false, stencilBuffer : false } );

	// Create your composer and first RenderPass
	this.composer = new EffectComposer( this.renderer, renderTarget );
	this.composer.addPass(new EffectComposer.RenderPass( this.scene, this.camera ) );
	
	this.tapTempo.on( 'beat', this.beat.bind( this ) );
	
	// And another shader, drawing to the screen at this point
	this.effect = new EffectComposer.ShaderPass( THREE.invertShader );
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
	if( e.keyCode == 18 ) this.input.switch(); // alt
	if( e.keyCode == 32 ) this.tapTempo.tap(); // spacebar
	if( e.keyCode == 109 ) this.tapTempo.resetCount(); // m
}

Main.prototype.beat = function( ){
	// this.composer.passes[1].uniforms.on.value = 1-this.composer.passes[1].uniforms.on.value;
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

	this.controller.step( time );
	this.tapTempo.step( time );

	this.time += this.timeInc;
	this.renderer.render( this.letters.scene, this.letters.camera, this.letters, true );

	// this.effect2.uniforms.time.value = this.time;
	// this.renderer.render( this.scene, this.camera );
	this.composer.render()
};

var root = new Main();
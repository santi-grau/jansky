window.THREE = require('three');


// var xp = JSON.parse( require('./../img/export/export.json') );
// console.log(xp);

// var glyphs = {};

// for( var i = 0 ; i < xp.length ; i++ ){
// 	glyphs[ 'g' + xp[i].id ] = xp[i];
// }

// console.log( JSON.stringify(glyphs) );

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

	window.addEventListener( 'keydown', this.keyDown.bind( this ) );
	window.addEventListener( 'resize', this.resize.bind( this ) );

	this.resize();
	this.step();
}

Main.prototype.keyDown = function( e ){
	console.log(e.keyCode)

	if( e.keyCode == 37 ) this.input.prevWord(); // left
	if( e.keyCode == 39 ) this.input.nextWord(); // right
	if( e.keyCode == 18 ) this.input.switch(); // alt
	if( e.keyCode == 32 ) this.tapTempo.tap(); // spacebar
	if( e.keyCode == 109 ) this.tapTempo.resetCount(); // m
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
	this.renderer.render( this.scene, this.camera );
};

var root = new Main();
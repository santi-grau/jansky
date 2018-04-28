var SimplexNoise = require('simplex-noise');
window.THREE = require('three');
var Letters = require('./Letters');
var Body = require('./Body');

var Main = function( ) {
	this.node = document.getElementById('main');
	
	this.simplex = new SimplexNoise( Math.random );
	this.time = 0;
	this.timeInc = 0.01;
	this.sides = 8;
	this.fontSize = 13;

	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();
	this.renderer = new THREE.WebGLRenderer( { alpha : true, antialias : true } );
	this.node.appendChild( this.renderer.domElement );

	this.letters = new Letters( this.node.offsetWidth * 2, this.fontSize * 4 );
	this.body = new Body( this.letters, this.node.offsetWidth, this.letters.fontSize );
	
	this.scene.add( this.body );

	window.addEventListener( 'resize', this.resize.bind( this ) );

	setInterval( function(){
		this.letters.updateTrack( -1 + Math.random() * 2 );
		this.letters.updateRotation( -1 + Math.random() * 2 );
		this.body.updateLineHeight( -1 + Math.random() * 2 );
		this.body.updateLineOffset( -1 + Math.random() * 2 );
	}.bind( this ), 400);
	this.resize();
	this.step();
}

Main.prototype.resize = function( e ) {
	var width = this.node.offsetWidth, height = this.node.offsetHeight;

	this.letters.resize( width, height );

	var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 };
	for ( var prop in camView) this.camera[ prop ] = camView[ prop ];
	this.camera.position.z = 1000;
	this.camera.updateProjectionMatrix( );
	
	this.renderer.setSize( width * 2, height * 2 );
	this.renderer.domElement.setAttribute( 'style', 'width:' + width + 'px; height:' + height + 'px;' );
}

Main.prototype.step = function( time ) {
	window.requestAnimationFrame( this.step.bind( this ) );

	this.time += this.timeInc;
	var n = this.simplex.noise2D( 0.5, this.time );

	// this.letters.updateTrack( 1 );
	// this.letters.updateRotation( -0.1 );

	this.renderer.render( this.letters.scene, this.letters.camera, this.letters, true );
	this.renderer.render( this.scene, this.camera );
};

var root = new Main();
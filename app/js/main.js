var data = require('./data.json');
window.THREE = require('three');
var EffectComposer = require('three-effectcomposer')(THREE);

var Controller = require('./Controller');
var Body = require('./Body');
var Composer = require('./COmposer');

var Main = function( ) {
	this.node = document.getElementById('main');

	this.currentTrack = 1;

	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();
	this.renderer = new THREE.WebGLRenderer( { alpha : false, antialias : true } );
	this.node.appendChild( this.renderer.domElement );

	var bpms = 60 / data[ this.currentTrack ].bpm * 1000;
	this.controller = new Controller( bpms );

	this.body = new Body( this.controller, { fontSize : 13, word : data[this.currentTrack].song } );
	this.scene.add( this.body );

	// this.body2 = new Body( this.controller, { fontSize : 13, word : data[0].song } );
	// this.body2.scale.set(3,3,1)
	// this.scene.add( this.body2 );

	// Composer
	var renderTarget = new THREE.WebGLRenderTarget( this.node.offsetWidth * 2, this.node.offsetHeight * 2, { depthBuffer : false, stencilBuffer : false } );

	this.composer = new Composer( this.renderer, renderTarget, this.scene, this.camera, this.controller, this.node );

	window.addEventListener( 'keydown', this.keyDown.bind( this ) );
	window.addEventListener( 'resize', this.resize.bind( this ) );

	this.resize();
	this.step();
}

Main.prototype.keyDown = function( e ){
	if( e.keyCode == 37 ) this.body.prevWord(); // left
	if( e.keyCode == 39 ) this.body.nextWord(); // right
}

Main.prototype.resize = function( e ) {
	var width = this.node.offsetWidth, height = this.node.offsetHeight;

	var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 };
	for ( var prop in camView) this.camera[ prop ] = camView[ prop ];
	this.camera.position.z = 1000;	
	this.renderer.setSize( width * 2, height * 2 );
	this.renderer.domElement.setAttribute( 'style', 'width:' + width + 'px; height:' + height + 'px;' );
	this.camera.updateProjectionMatrix( );

	this.body.resize( width, height );
	// this.body2.resize( width, height );
}

Main.prototype.step = function( time ) {
	window.requestAnimationFrame( this.step.bind( this ) );

	this.controller.step( time );
	this.body.step( time , this.renderer );

	// this.body2.step( time , this.renderer );
	
	this.composer.step( time );
	this.composer.render()
};

var root = new Main();
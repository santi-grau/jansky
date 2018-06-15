var data = require('./data.json');
window.THREE = require('three');
var EffectComposer = require('three-effectcomposer')(THREE);

var DragFile = require('./DragFile');
var Controller = require('./Controller');
var Body = require('./Body');
var Composer = require('./COmposer');

var Main = function( ) {
	this.node = document.getElementById('main');

	this.data = data;

	this.currentTrack = 0;

	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();
	this.renderer = new THREE.WebGLRenderer( { alpha : false, antialias : true } );
	this.node.appendChild( this.renderer.domElement );

	this.dragFile = new DragFile();
	this.dragFile.on( 'data', this.updateData.bind( this ) );

	this.controller = new Controller( this.data[ this.currentTrack ].bpm );

	this.body = new Body( this.controller, { fontSize : 13, word : this.data[this.currentTrack].song } );
	this.scene.add( this.body );

	// Composer
	var renderTarget = new THREE.WebGLRenderTarget( this.node.offsetWidth * 2, this.node.offsetHeight * 2, { depthBuffer : false, stencilBuffer : false } );

	this.composer = new Composer( this.renderer, renderTarget, this.scene, this.camera, this.controller, this.node );

	window.addEventListener( 'keydown', this.keyDown.bind( this ) );
	window.addEventListener( 'resize', this.resize.bind( this ) );

	this.resize();
	this.step();
}

Main.prototype.updateData = function( e ){
	this.data = e;
	this.updateTrack();
}

Main.prototype.updateTrack = function( track ){
	this.controller.reset( this.data[ this.currentTrack ].bpm );
	this.body.updateWord( this.data[ this.currentTrack ].song );
}

Main.prototype.keyDown = function( e ){
	if( e.keyCode == 32 ) this.controller.reset( data[ this.currentTrack ].bpm ); // space
	if( e.keyCode == 37 ) this.prevWord(); // left
	if( e.keyCode == 39 ) this.nextWord(); // right
}

Main.prototype.prevWord = function(){
	if( this.currentTrack == 0 ) return;
	this.currentTrack--;
	this.updateTrack();
}

Main.prototype.nextWord = function(){
	if( this.currentTrack == data.length - 1 ) return;
	this.currentTrack++;
	this.updateTrack();
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
}

Main.prototype.step = function( time ) {
	window.requestAnimationFrame( this.step.bind( this ) );

	this.controller.step( time );
	this.body.step( time , this.renderer );
	
	this.composer.step( time );
	this.composer.render()
};

var root = new Main();
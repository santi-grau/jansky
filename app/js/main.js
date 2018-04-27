var SimplexNoise = require('simplex-noise');
window.THREE = require('three');


var d = JSON.parse( require('./../img/export.json') );
console.log(d)

var glyphs = {};
for( var i = 0 ; i < d.length ; i++ ){
	glyphs['g'+d[i].id] = d[i];
}

console.log(JSON.stringify(glyphs))

var Octo = require('./Octo');

var Main = function( ) {
	this.node = document.getElementById('main');
	
	this.simplex = new SimplexNoise( Math.random );
	this.time = 0;
	this.timeInc = 0.01;

	this.letterScene = new THREE.Scene();
	this.letterCamera = new THREE.OrthographicCamera();

	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();
	this.renderer = new THREE.WebGLRenderer( { alpha : true, antialias : true } );
	this.node.appendChild( this.renderer.domElement );

	this.octo = new Octo( );
	
	this.fbo = new THREE.WebGLRenderTarget( this.node.offsetWidth * 2, this.octo.fontSize * 4, {} );

	var geometry = new THREE.PlaneBufferGeometry( this.node.offsetWidth, this.octo.fontSize  );
	var material = new THREE.MeshBasicMaterial( { map : this.fbo.texture, transparent : true } );
	
	this.group = new THREE.Object3D();
	this.scene.add( this.group );

	for( var h = 0 ; h < 8 ; h++ ){
		var group = new THREE.Object3D();
		for( var i = 0 ; i < 8 ; i++ ){
			var plane = new THREE.Mesh( geometry, material );
			group.add( plane );
			plane.position.y = 200 - 30 * i;	
		}
		group.rotation.z = h / 7 * Math.PI * 2;
		this.group.add( group );
	}

	this.letterScene.add( this.octo );

	this.resize();
	this.step();
}

Main.prototype.resize = function( e ) {
	var width = this.node.offsetWidth, height = this.node.offsetHeight;

	this.octo.resize( width, height );

	var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 };
	for ( var prop in camView) this.camera[ prop ] = camView[ prop ];
	this.camera.position.z = 1000;
	this.camera.updateProjectionMatrix( );


	var letterCamView = { left :  width / -2, right : width / 2, top : this.octo.fontSize / 2, bottom : this.octo.fontSize / -2 };
	for ( var prop in letterCamView) this.letterCamera[ prop ] = letterCamView[ prop ];
	this.letterCamera.position.z = 1000;
	this.letterCamera.updateProjectionMatrix( );

	
	this.renderer.setSize( width * 2, height * 2 );
	this.renderer.domElement.setAttribute( 'style', 'width:' + width + 'px; height:' + height + 'px;' );
}

Main.prototype.step = function( time ) {
	window.requestAnimationFrame( this.step.bind( this ) );

	this.time += this.timeInc;
	var n = this.simplex.noise2D( 0.5, this.time );



	this.octo.step( time );

	this.renderer.render( this.letterScene, this.letterCamera, this.fbo, true );

	this.renderer.render( this.scene, this.camera );
};

var root = new Main();
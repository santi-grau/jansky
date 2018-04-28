var letters = JSON.parse( require('./../img/font.json') );

var Letters = function( ){
	THREE.WebGLRenderTarget.apply(this, arguments);
	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();

	console.log(this)
	var string = 'COMMEDIA'.split('');
	this.fontSize = 13;
	this.stdWidth = Math.sin( 22.5 * Math.PI / 180 ) * 200 * 2;
	
	this.group = new THREE.Object3D();

	var texture = new THREE.TextureLoader().load( 'img/font.png' );
	var max = 0;
	for( var i = 0 ; i < string.length ; i++ ){
		var ls = letters.glyphs[ 'g' + string[ i ].charCodeAt( 0 ) ];
		var scale = this.fontSize / letters.info.size; 
		var geometry = new THREE.PlaneBufferGeometry( ls.width * scale, ls.height * scale );
		var material = new THREE.ShaderMaterial({
			uniforms : {
				lookAt : { value : new THREE.Vector4( ls.x / 2048.0, ( 2048 - ( ls.y + ls.height ) ) / 2048.0, ls.width / 2048.0, ls.height / 2048.0 ) },
				tex : { value : texture }
			},
			transparent : true,
			vertexShader: require('./letter.vs'),
			fragmentShader: require('./letter.fs')
		});
		max = Math.max( max, ls.height * scale );
		var plane = new THREE.Mesh( geometry, material );
		plane.position.x = ( i / ( string.length - 1 ) ) * this.stdWidth * 0.9;
		plane.position.y = ( letters.info.base * 2 - ls.height - ls.yoffset * 2 ) * scale / 2;
		this.group.add( plane );
	}

	this.group.position.set( -this.stdWidth / 2, -max / 2, 0 );
	this.scene.add( this.group );
}

Letters.prototype = Object.create(THREE.WebGLRenderTarget.prototype);
Letters.prototype.constructor = Letters;

Letters.prototype.resize = function( width, height ){
	var camView = { left :  width / -2, right : width / 2, top : this.fontSize / 2, bottom : this.fontSize / -2 };
	for ( var prop in camView) this.camera[ prop ] = camView[ prop ];
	this.camera.position.z = 1000;
	this.camera.updateProjectionMatrix( );
}

Letters.prototype.updateTrack = function( n ){
	if( n < 0 ) n *= 0.5;
	else n *= 2;
	var child = this.group.children;
	for( var i = 0 ; i < child.length ; i++ ){
		var l = child[ i ];
		var p = ( i / ( child.length - 1 ) ) * this.stdWidth * 0.9;
		var d = (this.stdWidth / child.length * i);
		l.position.x = p + d * n;
	}
	var dif = child[child.length-1].position.x - child[0].position.x;
	this.group.position.x = -dif / 2;
}

Letters.prototype.updateRotation = function( n ){
	for( var i = 0 ; i < this.group.children.length ; i++ ) this.group.children[ i ].rotation.z = Math.PI * 0.2 * n;
}

module.exports = Letters;
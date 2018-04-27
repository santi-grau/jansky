var SimplexNoise = require('simplex-noise');
var letters = JSON.parse( require('./../img/font.json') );

var Octo = function( ){
	THREE.Object3D.apply(this, arguments);

	this.simplex = new SimplexNoise( Math.random );
	this.simplex2 = new SimplexNoise( Math.random );

	this.time = 0;
	this.timeInc = 0.01;

	var string = 'COMMEDIA'.split('');
	this.fontSize = 14;
	this.stdWidth = Math.sin( 22.5 * Math.PI / 180 ) * 200 * 2;
	
	this.group = new THREE.Object3D();

	var texture = new THREE.TextureLoader().load( 'img/export.png' );
	var max = 0;
	for( var i = 0 ; i < string.length ; i++ ){
		var letterData = letters.glyphs[ 'g' +string[ i ].charCodeAt( 0 ) ];
		// console.log(letterData)
		var scale = this.fontSize / letters.info.size; 
		var geometry = new THREE.PlaneBufferGeometry( letterData.width * scale, letterData.height * scale );
		var material = new THREE.ShaderMaterial({
			uniforms : {
				lookAt : { value : new THREE.Vector4( letterData.x / 2048.0, ( 2048 - ( letterData.y + letterData.height ) ) / 2048.0, letterData.width / 2048.0, letterData.height / 2048.0 ) },
				tex : { value : texture }
			},
			transparent : true,
			vertexShader: require('./letter.vs'),
			fragmentShader: require('./letter.fs')
		});
		max = Math.max( max, letterData.height * scale );
		var plane = new THREE.Mesh( geometry, material );
		plane.position.x = ( i / ( string.length - 1 ) ) * this.stdWidth;
		plane.position.y = ( letters.info.base * 2 - letterData.height - letterData.yoffset * 2 ) * scale / 2;
		this.group.add( plane );
	}

	this.group.position.x = -this.stdWidth / 2;
	this.group.position.y = -max / 2;
	this.add( this.group );
}

Octo.prototype = Object.create(THREE.Object3D.prototype);
Octo.prototype.constructor = Octo;

Octo.prototype.resize = function( width, height ){
	
}

Octo.prototype.updateTrack = function( n ){
	if( n < 0 ) n *= 0.6;
	else n *= 2;
	var child = this.group.children;
	for( var i = 0 ; i < child.length ; i++ ){
		var l = child[ i ];
		var p = ( i / ( child.length - 1 ) ) * this.stdWidth;
		var d = (this.stdWidth / child.length * i);
		l.position.x = p + d * n;
	}
	var dif = child[child.length-1].position.x - child[0].position.x;
	this.group.position.x = -dif / 2;
}

Octo.prototype.updateRotation = function( n ){
	for( var i = 0 ; i < this.group.children.length ; i++ ){
		var l = this.group.children[ i ];
		l.rotation.z = Math.PI * 2 * n;
	}
}

Octo.prototype.step = function( time ){
	this.time += this.timeInc;
	var n = this.simplex.noise2D( 0.5, this.time );
	var n2 = this.simplex.noise2D( 0.5, this.time );
	this.updateTrack( n );
	this.updateRotation( n2 );
}

module.exports = Octo;
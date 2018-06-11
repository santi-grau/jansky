var Body = function( fbo, width, height ){
	THREE.Object3D.apply(this, arguments);

	this.rows = 8;
	this.sides = 8;
	var geometry = new THREE.PlaneBufferGeometry( 1, height  );
	var material = new THREE.MeshBasicMaterial( { map : fbo.texture, transparent : true } );

	for( var h = 0 ; h < this.sides + 1 ; h++ ){
		var group = new THREE.Object3D();
		for( var i = 0 ; i < this.rows + 1 ; i++ ){
			var plane = new THREE.Mesh( geometry, material );
			group.add( plane );
			plane.position.y = 200;
		}
		group.rotation.z = h / this.sides * Math.PI * 2;
		this.add( group );
	}

	this.resize( width, height );
}

Body.prototype = Object.create(THREE.Object3D.prototype);
Body.prototype.constructor = Body;

Body.prototype.resize = function( width, height ){
	for( var i = 0 ; i < this.children.length ; i++ ) {
		var column = this.children[i];
		for( var j = 0 ; j < column.children.length ; j++ ){
			var line = column.children[ j ];
			line.scale.x = width;
		}
	}
}

Body.prototype.updateLineHeight = function( n ){
	for( var i = 0 ; i < this.children.length ; i++ ) {
		var column = this.children[i];
		for( var j = 0 ; j < column.children.length ; j++ ){
			var line = column.children[ j ];
			line.position.y = 200 - j * ( n * 30 )
		}
	}
}

Body.prototype.updateLineOffset = function( n ){
	for( var i = 0 ; i < this.children.length ; i++ ) {
		var column = this.children[i];
		for( var j = 0 ; j < column.children.length ; j++ ){
			var line = column.children[ j ];
			line.position.x = j * ( n * 5 )
		}
	}
}

module.exports = Body;
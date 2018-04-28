var Body = function( fbo, width, height ){
	THREE.Object3D.apply(this, arguments);

	this.sides = 8;
	var geometry = new THREE.PlaneBufferGeometry( width, height  );
	var material = new THREE.MeshBasicMaterial( { map : fbo.texture, transparent : true } );

	for( var h = 0 ; h < this.sides + 1 ; h++ ){
		var group = new THREE.Object3D();
		for( var i = 0 ; i < this.sides + 1 ; i++ ){
			var plane = new THREE.Mesh( geometry, material );
			group.add( plane );
			// plane.position.x =  i * 30;
			plane.position.y = 200;
		}
		group.rotation.z = h / this.sides * Math.PI * 2;
		this.add( group );
	}
}

Body.prototype = Object.create(THREE.Object3D.prototype);
Body.prototype.constructor = Body;

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
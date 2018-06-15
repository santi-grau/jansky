var EventEmitter = require('events').EventEmitter;
var inherits = require( 'util' ).inherits;

var DragFile = function(){
	
	this.drop = document.createElement('div');
	this.drop.setAttribute( 'id', 'drop' );
	this.drop.innerHTML = 'F o t - l i !'
	document.body.append( this.drop );


	// Setup the dnd listeners.
	var dropZone = document.getElementById('drop');
	dropZone.addEventListener('dragover', this.handleDragOver.bind( this ), false);
	dropZone.addEventListener('dragleave', this.handleDragOut.bind( this ), false);
	dropZone.addEventListener('drop', this.handleFileSelect.bind( this ), false);
}

inherits( DragFile, EventEmitter );

DragFile.prototype.handleDragOver = function( evt ){
	evt.stopPropagation();
	evt.preventDefault();
	this.drop.classList.add('active');
}

DragFile.prototype.handleDragOut = function( evt ){
	evt.stopPropagation();
	evt.preventDefault();
	this.drop.classList.remove('active');
}

DragFile.prototype.handleFileSelect = function( evt ){
	evt.stopPropagation();
	evt.preventDefault();
	this.drop.classList.remove('active');

	var files = evt.dataTransfer.files;
	
	var reader = new FileReader();

	reader.onload = function(e) {
		var data = e.target.result.split('\n');
		for( var i = 0 ; i < data.length ; i++ ){
			var info = data[i].split(' | ');
			data[i] = { song : info[0], bpm : info[1] };
		}
		this.emit( 'data', data );
	}.bind( this );
	reader.readAsText( files[ 0 ] );
}


module.exports = DragFile;
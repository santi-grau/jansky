var EventEmitter = require('events').EventEmitter;
var inherits = require( 'util' ).inherits;

var Input = function(){
	this.node = document.getElementById('input');
	this.currentValue = 0;
	this.updateValues();
}

inherits( Input, EventEmitter );

Input.prototype.prevWord = function(){
	if( this.currentValue > 0 ) this.currentValue--;
	else return;
	this.emit( 'updateWord', this.values[this.currentValue] );
}

Input.prototype.nextWord = function(){
	if( this.currentValue < this.values.length - 1 ) this.currentValue++;
	else return;
	this.emit( 'updateWord', this.values[this.currentValue] );
}

Input.prototype.updateValues = function(){
	this.values = this.node.value.split('\n');
	this.currentValue = 0;
	// console.log(this.values)
}

Input.prototype.switch = function(){
	if( !this.node.classList.contains('active') ) {
		this.node.classList.add('active');
		setTimeout( function(){ this.node.focus() }.bind( this ), 200 );
		this.node.selectionStart = this.node.selectionEnd = this.node.value.length;
	} else {
		this.node.classList.remove('active');
		this.node.blur();
		this.updateValues();
	}
}

module.exports = Input;
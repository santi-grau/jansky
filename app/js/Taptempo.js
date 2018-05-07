var Gsap = require('gsap');
var EventEmitter = require('events').EventEmitter;
var inherits = require( 'util' ).inherits;

var TapTempo = function(){
	var defBpm = 90;
	this.bpmArray = [];
	this.bpmAvg = defBpm;
	this.tapStarted = null;
	this.time = 0;

	this.tics = {
		beat : 0,
		semibar : 0, 
		bar : 0,
		fourbar : 0
	}
	this.resetCount();
}

inherits( TapTempo, EventEmitter );

TapTempo.prototype.resetCount = function(){
	this.beatCount = 0;
	this.tics = {
		beat : 0,
		semibar : 0, 
		bar : 0,
		fourbar : 0
	}
	if( this.beatTween ) this.beatTween.kill();
	this.beatTween = TweenMax.to( this.tics, 60 / this.bpmAvg , { beat : 1, repeat : -1, onRepeat : this.tic.bind( this ) } );
	// console.log('here', 'beat 0')
}

TapTempo.prototype.tapEnd = function(){
	this.bpmArray = [];
	this.tapStarted = null;
	this.resetCount();
	this.tic();
	
	// this.semibarTween = TweenMax.to( this.semibar, 60 / this.bpmAvg , { beat : 1, repeat : -1, onRepeat : this.tic.bind( this ) } );
}

TapTempo.prototype.tap = function(){
	// console.log('tap')
	var d = new Date();
	var n = d.getTime();
	var t;
	this.tic();
	if( this.tapTimeout ) clearTimeout( this.tapTimeout );
	if( this.tapStarted ){
		t = n - this.tapStarted;
		var bpms =  60 / ( t / 1000 );
		if( this.bpmArray.length > 7 ) this.bpmArray.shift();
		this.bpmArray.push( bpms );
		for( var i = 0 ; i < this.bpmArray.length ; i++ ) this.bpmAvg += this.bpmArray[ i ];
		this.bpmAvg /= this.bpmArray.length + 1;
		this.tapTimeout = setTimeout( this.tapEnd.bind( this ), 60 / this.bpmAvg * 2 * 1000 );
	} else {
		this.beatCount = 0;
		if( this.beatTween ) this.beatTween.kill();
	}
	this.tapStarted = n;
}

TapTempo.prototype.tic = function(){
	if( this.beatCount < 15 )this.beatCount++;
	else this.beatCount = 0;
	this.emit( 'beat' );
	if( this.beatCount == 0 ) this.emit( 'fourbar' );
	if( this.beatCount % 4 ) this.emit( 'bar' );
	if( this.beatCount % 2 ) this.emit( 'semibar' );
}

TapTempo.prototype.step = function( time ){
	// console.log( this.tics.beat)

}

module.exports = TapTempo;


var Controller = function( letters, body, tapTempo ){
	this.tapTempo = tapTempo;
	this.letters = letters;
	this.body = body;

	this.tapTempo.on( 'beat', this.beat.bind( this ) );
	this.tapTempo.on( 'semibar', this.semibar.bind( this ) );
	this.tapTempo.on( 'bar', this.bar.bind( this ) );
	this.tapTempo.on( 'fourbar', this.fourbar.bind( this ) );

}

Controller.prototype.beat = function(){
	// console.log('beat')
	this.letters.updateTrack( -1 + Math.random() * 2 );
	this.letters.updateRotation( -1 + Math.random() * 2 );
	this.body.updateLineHeight( -1 + Math.random() * 2 );
	this.body.updateLineOffset( -1 + Math.random() * 2 );
}

Controller.prototype.semibar = function(){
	// console.log( 'semibar' );
}

Controller.prototype.bar = function(){
	// console.log( 'bar' );	
}

Controller.prototype.fourbar = function(){
	// console.log( 'fourbar' );
}

Controller.prototype.step = function(){
	// console.log( this.tics.beat );

	// this.letters.updateRotation( -1 + Math.random() * 2 );
	// this.body.updateLineHeight( Math.sin( this.tapTempo.tics.beat * Math.PI ) );
	// this.letters.updateTrack( Math.sin( this.tapTempo.tics.beat * Math.PI ) );
}

module.exports = Controller;
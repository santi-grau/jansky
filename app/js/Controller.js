

var Controller = function( letters, body, tapTempo ){
	this.tapTempo = tapTempo;
	this.letters = letters;
	this.body = body;

	this.tapTempo.on( 'beat', this.beat.bind( this ) );

}

Controller.prototype.beat = function(){
	this.letters.updateTrack( -1 + Math.random() * 2 );
	this.letters.updateRotation( -1 + Math.random() * 2 );
	this.body.updateLineHeight( -1 + Math.random() * 2 );
	this.body.updateLineOffset( -1 + Math.random() * 2 );
}

Controller.prototype.step = function(){
	// console.log( this.tics.beat );

	// this.letters.updateRotation( -1 + Math.random() * 2 );
	// this.body.updateLineHeight( Math.sin( this.tapTempo.tics.beat * Math.PI ) );
	// this.letters.updateTrack( Math.sin( this.tapTempo.tics.beat * Math.PI ) );
}

module.exports = Controller;
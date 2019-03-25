/**
 *
 */
import { VGTComponent } from "../VGTComponent.js";
import { VGTGameOpts } from "../VGTGameOpts.js";
import { VGTPlayer } from "../VGTPlayer.js";
import { VGTPlayerInfo } from "../VGTPlayerInfo.js";
import { VGTStartControls } from "../VGTStartControls.js";
import { VGTPINPad } from "../VGTPINPad.js";

class VGTGame extends VGTComponent {
	constructor ( app, title ) {
		super( "div", "game", "vgtgame" );

		this.app = app;
		this.title = title;

		this.players = [];
		this.currentPlayerIndex = -1;

		this.playerInfo = new VGTPlayerInfo();

		this.gameOpts = new VGTGameOpts( this );

		this.startControls = new VGTStartControls( this );

		this.pinPad = new VGTPINPad();

		this.stage = 0;

		this.dragging = null;
		this.dropping = null;
	};

	get currentPlayer () {
		return this.players[ this.currentPlayerIndex ];
	};

	// Set by VGTPlayer or index
	set currentPlayer ( player ) {
		this.currentPlayerIndex = isFinite( player ) ? parseInt( player ) : this.players.indexOf( player );
	};

	init () {
		this.node.appendChild( document.createTextNode( this.title ) );
		this.node.appendChild( document.createElement( "hr" ) );
		this.node.appendChild( this.playerInfo.node );
		this.node.appendChild( document.createElement( "hr" ) );
		this.node.appendChild( this.gameOpts.node );
		this.node.appendChild( document.createElement( "hr" ) );
		this.node.appendChild( this.startControls.node );

		this.node.appendChild( this.pinPad.node );

		this.playerInfo.addEventListener( "change", this, false );

		this.gameOpts.addEventListener( "change", this, false );

		this.startControls.addEventListener( "previous", this, false );
		this.startControls.addEventListener( "next", this, false );
		this.startControls.addEventListener( "start", this, false );
		this.startControls.addEventListener( "cancel", this, false );
		this.startControls.addEventListener( "delete", this, false );

		this.pinPad.addEventListener( "done", this, false );
		this.pinPad.addEventListener( "previous", this, false );
		this.pinPad.addEventListener( "next", this, false );

		document.addEventListener ( "drag", this, false );
		document.addEventListener( "dragstart", this, false );
		document.addEventListener( "dragend", this, false );
		document.addEventListener( "dragover", this, false );
		document.addEventListener( "dragenter", this, false );
		document.addEventListener( "dragleave", this, false );
		document.addEventListener( "drop", this, false );
	};

	getPlayers () {
		return this.players.slice();
	};

	setup () {
		this.currentPlayerIndex = -1;
		this.shiftCurrentPlayer( 1, true );
		this.startControls.update();
	};

	start () {
		this.pinPad.setControlsVisible( false );
		this.playerInfo.visible = false;
		this.gameOpts.visible = false;
		this.startControls.visible = false;

		this.stage = 1;
	};

	shiftCurrentPlayer ( dir, allowNew ) {

		this.playerInfo.visible = false;
		this.gameOpts.visible = false;
		this.startControls.visible = false;

		this.currentPlayerIndex += dir;

		if ( this.currentPlayerIndex < 0 ) {
			this.currentPlayerIndex = this.players.length - 1;
		} else if ( allowNew && this.currentPlayerIndex >= this.players.length && this.currentPlayerIndex <= this.gameOpts.opts.maxPlayers.value ) {
			this.players.push( new VGTPlayer( "", "" ) );
		} else if ( !allowNew && this.currentPlayerIndex >= this.players.length ) {
			this.currentPlayerIndex = 0;
		} else if ( this.currentPlayerIndex > this.gameOpts.opts.maxPlayers.value ) {
			this.currentPlayerIndex = 0;
		}

		if ( this.currentPlayer.pin.length > 0 && dir != 0 ) {

			this.pinPad.setControlsVisible( this.stage == 0 );

			this.pinPad.validate( this.currentPlayer.name, this.currentPlayer.pin );
		} else {

			if ( this.stage == 0 ) {

				this.playerInfo.setPlayer( this.currentPlayer );

				if ( this.currentPlayer.name == "" ) {
					this.playerInfo.name.placeholder = "Enter name or initials...";
				}

				this.playerInfo.visible = true;
				this.gameOpts.visible = true;
				this.gameOpts.enabled = this.currentPlayerIndex == 0;
				this.startControls.visible = true;
			}
		}

	};

	handleEvent ( event ) {
		if ( event.target == this.playerInfo ) {
			;
		} else if ( event instanceof DragEvent || event.dataTransfer ) {
			this.handleDragEvent( event );
		} else if ( event.type == "next" ) {
			this.shiftCurrentPlayer( 1, event.target != this.pinPad );
		} else if ( event.type == "previous" ) {
			this.shiftCurrentPlayer( -1 );
		} else if ( event.type == "done" ) {
			this.shiftCurrentPlayer( 0 );
		} else if ( event.type == "delete" ) {
			this.players.splice( this.currentPlayerIndex, 1 );
			this.shiftCurrentPlayer( -1 );
		} else if ( event.type == "start" ) {
			if ( this.currentPlayerIndex != 0 ) {
				this.shiftCurrentPlayer( -this.currentPlayerIndex );
			} else {
				this.start();
			}
		} else if ( event.type == "cancel" ) {
			console.log( "CANCEL!" );
		} else {
			console.error( "HTH?!?", event );
		}

		this.startControls.update();
		this.gameOpts.enabled = this.currentPlayerIndex == 0;
	};

	handleDragEvent ( event ) {
		if ( event.type == "drag" ) {
			;
		} else if ( event.type == "dragstart" ) {
			this.dragging = event.target;
			this.dragging.srcPile = this.dragging.card.pile;
			event.target.style.opacity = 0.5;
		} else if ( event.type == "dragend" ) {
			event.target.style.opacity = "";
		} else if ( event.type == "dragover" ) {
			event.preventDefault();
		} else if ( event.type == "dragenter" ) {
			this.dropping = getDroppableParent( event.target );
			if ( this.dropping != null ) {
				this.dropping.style.background = "purple";
			}
		} else if ( event.type == "dragleave" ) {
			this.dropping = getDroppableParent( event.target );
			if ( this.dropping != null ) {
				this.dropping.style.background = "";
			}
		} else if ( event.type == "drop" ) {
			event.preventDefault();

			this.dropping = getDroppableParent( event.target );

			if ( this.dropping != null ) {
				this.dropping.style.background = "";

				if ( this.dragging.card.pile == this.dropping.card.pile ) {
					this.dragging.card.pile.reorder( this.dragging.card, this.dropping.card );
				} else {
					this.dragging.card.pile.removeCard( this.dragging.card );
					this.dragging.card.faceUp = true;
					this.dropping.card.pile.addCardAt( this.dragging.card, this.dropping.card );
				}

			}
		} else {
			console.error( "HTH!?!", event );
		}
	};

}

function getDroppableParent ( target ) {
	let dropZone = null;
	while ( dropZone == null && target != null ) {
		if ( target.classList && target.classList.contains( "droppable" ) ) {
			dropZone = target;
		} else {
			target = target.parentNode;
		}
	}
	return dropZone;
}

export { VGTGame };

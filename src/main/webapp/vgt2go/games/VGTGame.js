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
		this.currentPlayer = null;

		this.playerInfo = new VGTPlayerInfo();

		this.gameOpts = new VGTGameOpts( this );

		this.startControls = new VGTStartControls( this );

		this.pinPad = new VGTPINPad();

		this.dragging = null;
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
		this.currentPlayer = -1;
		this.shiftCurrentPlayer( 1, true );
		this.startControls.update();
	};

	start () {
		this.playerInfo.visible = false;
		this.gameOpts.visible = false;
		this.startControls.visible = false;
	};

	shiftCurrentPlayer ( dir, allowNew ) {

		this.playerInfo.visible = false;
		this.gameOpts.visible = false;
		this.startControls.visible = false;

		this.currentPlayer += dir;

		if ( this.currentPlayer < 0 ) {
			this.currentPlayer = this.players.length - 1;
		} else if ( allowNew && this.currentPlayer >= this.players.length && this.currentPlayer <= this.gameOpts.opts.maxPlayers.value ) {
			this.players.push( new VGTPlayer( "", "" ) );
		} else if ( !allowNew && this.currentPlayer >= this.players.length ) {
			this.currentPlayer = 0;
		} else if ( this.currentPlayer > this.gameOpts.opts.maxPlayers.value ) {
			this.currentPlayer = 0;
		}

		if ( this.players[ this.currentPlayer ].pin.length > 0 && dir != 0 ) {

			this.pinPad.setControlsVisible( true );

			this.pinPad.validate( this.players[ this.currentPlayer ].name, this.players[ this.currentPlayer ].pin );
		} else {
			this.playerInfo.setPlayer( this.players[ this.currentPlayer ] );

			if ( this.players[ this.currentPlayer ].name == "" ) {
				this.playerInfo.name.placeholder = "Enter name or initials...";
			}

			this.playerInfo.visible = true;
			this.gameOpts.visible = true;
			this.gameOpts.enabled = this.currentPlayer == 0;
			this.startControls.visible = true;
		}

	};

	handleEvent ( event ) {
		if ( event.target == this.playerInfo ) {
			;
		} else if ( event instanceof DragEvent ) {
			this.handleDragEvent( event );
		} else if ( event.type == "next" ) {
			this.shiftCurrentPlayer( 1, event.target != this.pinPad );
		} else if ( event.type == "previous" ) {
			this.shiftCurrentPlayer( -1 );
		} else if ( event.type == "done" ) {
			this.shiftCurrentPlayer( 0 );
		} else if ( event.type == "delete" ) {
			this.players.splice( this.currentPlayer, 1 );
			this.shiftCurrentPlayer( -1 );
		} else if ( event.type == "start" ) {
			if ( this.currentPlayer != 0 ) {
				this.shiftCurrentPlayer( -this.currentPlayer );
			} else {
				this.start();
			}
		} else if ( event.type == "cancel" ) {
			console.log( "CANCEL!" );
		} else {
			console.error( "HTH?!?", event );
		}

		this.startControls.update();
		this.gameOpts.enabled = this.currentPlayer == 0;
	};

	handleDragEvent ( event ) {
		if ( event.type == "drag" ) {
			;
		} else if ( event.type == "dragstart" ) {
			this.dragging = event.target;
			event.target.style.opacity = 0.5;
		} else if ( event.type == "dragend" ) {
			event.target.style.opacity = "";
		} else if ( event.type == "dragover" ) {
			event.preventDefault();
		} else if ( event.type == "dragenter" ) {
			const droppable = getDroppableParent( event.target );
			if ( droppable != null ) {
				droppable.style.background = "purple";
			}
		} else if ( event.type == "dragleave" ) {
			const droppable = getDroppableParent( event.target );
			if ( droppable != null ) {
				droppable.style.background = "";
			}
		} else if ( event.type == "drop" ) {
			event.preventDefault();

			const droppable = getDroppableParent( event.target );

			if ( droppable != null ) {
				droppable.style.background = "";

				if ( this.dragging.card.pile == droppable.card.pile ) {
					this.dragging.card.pile.reorder( this.dragging.card, droppable.card );
				} else {
					//    HAND(RTL) -> DISC(FU) = push
					// XX HAND(RTL) -> STOC(FD) = ins (FD)
					//    DISC(
					this.dragging.card.pile.removeCard( this.dragging.card );
					this.dragging.card.faceUp = true;
					droppable.card.pile.addCardAt( this.dragging.card, droppable.card );
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
		//if ( target.className == "droppable" ) {
		if ( target.classList && target.classList.contains( "droppable" ) ) {
			dropZone = target;
		} else {
			target = target.parentNode;
		}
	}
	return dropZone;
}

export { VGTGame };

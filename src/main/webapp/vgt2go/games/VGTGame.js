/**
 *
 */
import { VGTComponent } from "../VGTComponent.js";
import { VGTGameOpts } from "../VGTGameOpts.js";
import { VGTPlayer } from "../VGTPlayer.js";
import { VGTStartControls } from "../VGTStartControls.js";
import { VGTPINPad } from "../VGTPINPad.js";
import { Utils } from "../Utils.js";

class VGTGame extends VGTComponent {
	constructor ( app, title ) {
		super( "div", "game", "vgtgame" );

		this.app = app;
		this.title = title;

		this.players = [];
		this.currentPlayerIndex = -1;

		this.playerInfoDiv = null;

		this.gameOpts = new VGTGameOpts( this );

		this.startControls = new VGTStartControls( this );

		this.pinPad = new VGTPINPad();

		this.stage = 0;

		this.dragging = null;
		this.dropping = null;

		this.gameOpts.opts.first = {
			id : "first",
			text : "First",
			type : "player-select",
			value : 0
		};

		this.dragHoverClass = "dragHover";
	};

	get currentPlayer () {
		return this.players[ this.currentPlayerIndex ];
	};

	// Set by VGTPlayer or index
	set currentPlayer ( player ) {
		this.currentPlayerIndex = isFinite( player ) ? parseInt( player ) : this.players.indexOf( player );
	};

	init () {
		super.init();

		this.app.gameTitle = this.title;

		this.playerInfoDiv = document.createElement( "div" );

		this.node.appendChild( this.playerInfoDiv );
		this.node.appendChild( this.gameOpts.node );
		this.node.appendChild( this.startControls.node );

		this.node.appendChild( this.pinPad.node );

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
		this.currentPlayer.visible = false;
		this.gameOpts.visible = false;
		this.startControls.visible = false;

		this.stage = 1;
	};

	addPlayer ( player ) {
		this.players.push( player );
		this.playerInfoDiv.appendChild( player.node );
		player.visible = this.players.length - 1 == this.currentPlayerIndex;
		player.addEventListener( "change", this, false );

		this.dispatchEvent( new Event( "player" ) );
	};

	deletePlayer ( player ) {

		if ( player == null ) {
			player = this.currentPlayer;
		}

		this.players.splice( this.players.indexOf( player ), 1 );

		player.visible = false;
		this.playerInfoDiv.removeChild( player.node );
		this.shiftCurrentPlayer( -1 );

		this.dispatchEvent( new Event( "player" ) );
	};

	shiftCurrentPlayer ( dir, allowNew ) {

		if ( this.currentPlayer != null ) {
			this.currentPlayer.visible = false;
			this.currentPlayer.pinPad.setSmall( true );
		}

		this.pinPad.visible = false;
		this.gameOpts.visible = false;
		this.startControls.visible = false;

		this.currentPlayerIndex += dir;

		if ( this.currentPlayerIndex < 0 ) {
			this.currentPlayerIndex = this.players.length - 1;
		} else if ( allowNew && this.currentPlayerIndex >= this.players.length && this.currentPlayerIndex <= this.gameOpts.opts.maxPlayers.value ) {
			this.addPlayer( new VGTPlayer( this, "", "" ) );
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

				this.currentPlayer.visible = true;
				this.gameOpts.visible = true;
				this.gameOpts.enabled = this.currentPlayerIndex == 0;
				this.startControls.visible = true;
			}
		}
	};

	cancelGame () {
		console.log( "CANCEL!" );
	};

	handleEvent ( event ) {
		if ( event instanceof DragEvent || event.dataTransfer ) {
			this.handleDragEvent( event );
		} else if ( event.type == "next" ) {
			this.shiftCurrentPlayer( 1, event.target != this.pinPad );
		} else if ( event.type == "previous" ) {
			this.shiftCurrentPlayer( -1 );
		} else if ( event.type == "done" ) {
			this.shiftCurrentPlayer( 0 );
		} else if ( event.type == "delete" ) {
			this.deletePlayer();
		} else if ( event.type == "start" ) {
			if ( this.currentPlayerIndex != 0 ) {
				this.shiftCurrentPlayer( -this.currentPlayerIndex );
			} else {
				this.start();
			}
		} else if ( event.type == "cancel" ) {
			this.cancelGame();
		} else if ( event.target instanceof VGTPlayer ) {
			this.dispatchEvent( new Event( "player" ) );
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
// ??		this.dragging.srcPile = this.dragging.card.pile;
			event.target.style.opacity = 0.5;
		} else if ( event.type == "dragend" ) {
			event.target.style.opacity = "";
		} else if ( event.type == "dragover" ) {
			event.preventDefault();
		} else if ( event.type == "dragenter" ) {
			//this.dropping = getDroppableParent( event.target );
			this.dropping = Utils.getClassedParent( event.target, "droppable" );
			if ( this.dropping != null ) {
				this.dropping.classList.add( this.dragHoverClass );
			}
		} else if ( event.type == "dragleave" ) {
			//this.dropping = getDroppableParent( event.target );
			this.dropping = Utils.getClassedParent( event.target, "droppable" );
			if ( this.dropping != null ) {
				this.dropping.classList.remove( this.dragHoverClass );
			}
		} else if ( event.type == "drop" ) {
			event.preventDefault();
			this.dropping.classList.remove( this.dragHoverClass );
		} else {
			console.error( "HTH!?!", event );
		}
	};

}

function XgetDroppableParent ( target ) {
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

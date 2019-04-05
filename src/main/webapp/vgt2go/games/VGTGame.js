/**
 *
 */
import { VGTComponent } from "../VGTComponent.js";
//import { VGTGameOpts } from "../VGTGameOpts.js";
import { VGTGameProperties } from "../VGTProperties.js";
import { VGTPlayer } from "../VGTPlayer.js";
import { VGTStartControls } from "../VGTStartControls.js";
import { VGTPINPad } from "../VGTPINPad.js";
import { Utils } from "../Utils.js";
import { VGTEvent } from "../VGTEvent.js";

class VGTGameEvent extends VGTEvent {
	constructor( type, change, player ) {
		super( type );
		this.addDetail( "change", change );
		this.addDetail( "player", player );
	};
}

class VGTGame extends VGTComponent {
	constructor ( app, title ) {
		super( "div", "game", "vgtgame" );

		this.app = app;
		this.title = title;

		this.players = [];
		this.currentPlayerIndex = -1;

		this.playerInfoDiv = null;

		//this.gameOpts = new VGTGameOpts( this );
		this.gameProps = new VGTGameProperties( this );

		this.startControls = new VGTStartControls( this );

		this.pinPad = new VGTPINPad();

		this.stage = 0;

		this.dragging = null;
		this.dropping = null;

//		this.gameOpts.opts.first = {
//			id : "first",
//			text : "First",
//			type : "player-select",
//			value : 0
//		};

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

		this.appendChild( this.playerInfoDiv );
		this.appendChild( this.gameProps );
		this.appendChild( this.startControls );

		this.appendChild( this.pinPad );

		this.tableDiv = document.createElement( "div" );
		this.appendChild( this.tableDiv );

		this.gameProps.addEventListener( "change", this, false );

		this.startControls.addEventListener( "previous", this, false );
		this.startControls.addEventListener( "next", this, false );
		this.startControls.addEventListener( "start", this, false );
		this.startControls.addEventListener( "cancel", this, false );
		this.startControls.addEventListener( "delete", this, false );

		this.pinPad.addEventListener( "done", this, false );
		this.pinPad.addEventListener( "previous", this, false );
		this.pinPad.addEventListener( "next", this, false );

//		document.addEventListener ( "drag", this, false );
//		document.addEventListener( "dragstart", this, false );
//		document.addEventListener( "dragend", this, false );
//		document.addEventListener( "dragover", this, false );
//		document.addEventListener( "dragenter", this, false );
//		document.addEventListener( "dragleave", this, false );
//		document.addEventListener( "drop", this, false );

		this.tableDiv.addEventListener ( "drag", this, false );
		this.tableDiv.addEventListener( "dragstart", this, false );
		this.tableDiv.addEventListener( "dragend", this, false );
		this.tableDiv.addEventListener( "dragover", this, false );
		this.tableDiv.addEventListener( "dragenter", this, false );
		this.tableDiv.addEventListener( "dragleave", this, false );
		this.tableDiv.addEventListener( "drop", this, false );
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
		this.gameProps.visible = false;
		this.startControls.visible = false;

		this.stage = 1;
	};

	addPlayer ( player ) {
		this.players.push( player );
		this.playerInfoDiv.appendChild( player.node );
		player.visible = this.players.length - 1 == this.currentPlayerIndex;
		player.addEventListener( "change", this, false );

		this.dispatchEvent( new VGTGameEvent( "player", "add", player ) );
	};

	deletePlayer ( player ) {

		if ( player == null ) {
			player = this.currentPlayer;
		}

		this.players.splice( this.players.indexOf( player ), 1 );

		player.visible = false;
		this.playerInfoDiv.removeChild( player.node );
		this.shiftCurrentPlayer( -1 );

		this.dispatchEvent( new VGTGameEvent( "player", "delete", player ) );
	};

	shiftCurrentPlayer ( dir, allowNew ) {

		if ( this.currentPlayer != null ) {
			this.currentPlayer.visible = false;
			this.currentPlayer.pinPad.setSmall( true );
		}

		this.pinPad.visible = false;
		this.gameProps.visible = false;
		this.startControls.visible = false;

		this.currentPlayerIndex += dir;

		if ( this.currentPlayerIndex < 0 ) {
			this.currentPlayerIndex = this.players.length - 1;
		} else if ( allowNew && this.currentPlayerIndex >= this.players.length && this.currentPlayerIndex <= this.gameProps.rules.maxPlayers.value ) {
			this.addPlayer( new VGTPlayer( this, "", "" ) );
		} else if ( !allowNew && this.currentPlayerIndex >= this.players.length ) {
			this.currentPlayerIndex = 0;
		} else if ( this.currentPlayerIndex > this.gameProps.rules.maxPlayers.value ) {
			this.currentPlayerIndex = 0;
		}

		if ( this.currentPlayer.pin.length > 0 && dir != 0 ) {

			this.pinPad.setControlsVisible( this.stage == 0 );

			this.pinPad.validate( this.currentPlayer.name, this.currentPlayer.pin );
		} else {

			if ( this.stage == 0 ) {

				this.currentPlayer.visible = true;
				this.gameProps.visible = true;
				this.gameProps.enabled = this.currentPlayerIndex == 0;
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
			this.dispatchEvent( new VGTGameEvent( "player", "change", event.target ) );
		} else {
			console.error( "HTH?!?", event );
		}

		this.startControls.update();
		this.gameProps.enabled = this.currentPlayerIndex == 0;
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
			this.dropping = Utils.getClassedParent( event.target, "droppable" );
			if ( this.dropping != null ) {
				this.dropping.classList.add( this.dragHoverClass );
			}
		} else if ( event.type == "dragleave" ) {
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

export { VGTGame, VGTGameEvent };

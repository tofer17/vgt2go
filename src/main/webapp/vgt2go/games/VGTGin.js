/**
 *
 */

import { VGTComponent } from "../VGTComponent.js";
import { VGTGameOpts } from "../VGTGameOpts.js";
import { VGTPlayer } from "../VGTPlayer.js";
import { VGTPlayerInfo } from "../VGTPlayerInfo.js";
import { VGTStartControls } from "../VGTStartControls.js?3";
import { VGTPINPad } from "../VGTPINPad.js";

class VGTGinGameOpts extends VGTGameOpts {
	constructor ( game ) {
		super( game );

		this.opts.ace = {
			id : "aces",
			text : "Aces",
			type : "select",
			value : 1,
			opts : [ "start", "start/end", "end", "modulo" ]
		};

		this.opts.jokers = {
			id : "jokers",
			text : "Jokers",
			type : "radio",
			value : 0,
			opts : [ "removed", "wild" ]
		};

		this.opts.deal = {
			id : "deal",
			text : "Deal",
			type : "select",
			value : 0,
			opts : [ "11 cards", "10 cards" ]
		};

		this.opts.first = {
			id : "first",
			text : "First",
			type : "player-select",
			value : 0
		};

		this.opts.minplayers.opts = [ 2, 5 ];
		this.opts.minplayers.value = 3;

		this.opts.maxplayers.opts = [ 2, 5 ];
		this.opts.maxplayers.value = 5;

		this.layout();
		this.opts.minplayers.visible = false;
		this.opts.maxplayers.visible = false;
	};
}

class VGTGin extends VGTComponent {
	constructor ( app ) {
		super( "div", "game", "vgtgamegin" );

		this.app = app;
		this.players = [];
		this.currentPlayer = 0;

		this.playerInfo = new VGTPlayerInfo();
		this.playerInfo.addEventListener( "change", this, false );

		this.gameOpts = new VGTGinGameOpts( this );
		this.gameOpts.addEventListener( "change", this, false );

		this.startControls = new VGTStartControls( this );
		this.startControls.addEventListener( "previous", this, false );
		this.startControls.addEventListener( "next", this, false );
		this.startControls.addEventListener( "start", this, false );
		this.startControls.addEventListener( "cancel", this, false );
		this.startControls.addEventListener( "delete", this, false );

		this.pinPad = new VGTPINPad();
		this.pinPad.addEventListener( "done", this, false );
		this.pinPad.addEventListener( "previous", this, false );
		this.pinPad.addEventListener( "next", this, false );

		this.node.appendChild( document.createTextNode( "Gin" ) );
		this.node.appendChild( document.createElement( "hr" ) );
		this.node.appendChild( this.playerInfo.node );
		this.node.appendChild( document.createElement( "hr" ) );
		this.node.appendChild( this.gameOpts.node );
		this.node.appendChild( document.createElement( "hr" ) );
		this.node.appendChild( this.startControls.node );

		this.node.appendChild( this.pinPad.node );

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

		console.log("START!");
		this.node.appendChild( document.createTextNode( "TABLE" ) );
	};


	shiftCurrentPlayer ( dir, allowNew ) {
		this.playerInfo.visible = false;
		this.gameOpts.visible = false;
		this.startControls.visible = false;

		this.currentPlayer += dir;

		if ( this.currentPlayer < 0 ) {
			this.currentPlayer = this.players.length - 1;
		} else if ( allowNew && this.currentPlayer >= this.players.length && this.currentPlayer <= this.gameOpts.opts.maxplayers.value ) {
			this.players.push( new VGTPlayer( "", "" ) );
		} else if ( !allowNew && this.currentPlayer >= this.players.length ) {
			this.currentPlayer = 0;
		} else if ( this.currentPlayer > this.gameOpts.opts.maxplayers.value ) {
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

	}

	handleEvent ( event ) {
		if ( event.target == this.playerInfo ) {
			;
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
				console.log( "return to host");
				this.shiftCurrentPlayer( -this.currentPlayer );
			} else {
				this.start();
			}
		} else if ( event.type == "cancel" ) {
			console.log( "CANCEL!" );
		}

		this.startControls.update();
		this.gameOpts.enabled = this.currentPlayer == 0;
	};

}

function launch ( app ) {
	return new VGTGin( app );
}

export { launch };

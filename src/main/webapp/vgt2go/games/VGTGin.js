/**
 *
 */

import { VGTComponent } from "../VGTComponent.js";
import { VGTGameOpts } from "../VGTGameOpts.js";
import { VGTPlayer } from "../VGTPlayer.js";
import { VGTPlayerInfo } from "../VGTPlayerInfo.js";
import { VGTStartControls } from "../VGTStartControls.js";

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

		this.node.appendChild( document.createTextNode( "Gin" ) );
		this.node.appendChild( document.createElement( "hr" ) );
		this.node.appendChild( this.playerInfo.node );
		this.node.appendChild( document.createElement( "hr" ) );
		this.node.appendChild( this.gameOpts.node );
		this.node.appendChild( document.createElement( "hr" ) );
		this.node.appendChild( this.startControls.node );

	};

	getPlayers () {
		return this.players.slice();
	};

	start () {

		this.players = [ new VGTPlayer( "Player 1", "" ) ];
		this.currentPlayer = 0;
		//this.players.push( new VGTPlayer( "Chris", "1" ) );
		//this.players.push( new VGTPlayer( "Diana", "2" ) );
		//this.players.push( new VGTPlayer( "Anika", "3" ) );

		//const pi = new VGTPlayerInfo();
		this.playerInfo.setPlayer( this.players[ this.currentPlayer ] );

		this.startControls.previousPlayer.disabled = true;
		this.startControls.nextPlayer.disabled = true;
		this.startControls.startGame.disabled = true;
		// Get players
		//const go = new VGTGinGameOpts( this );
		//this.node.appendChild( go.node );
		//go.addEventListener( "change", this, false );
		//go.enabled = false;
		//go.visible = false;

		//const sc = new VGTStartControls( this );
	};

	handleEvent ( event ) {
		const cp = this.players[ this.currentPlayer ];
		if ( event.target == this.playerInfo ) {
			this.startControls.nextPlayer.disabled = cp.name.length < 1 || cp.pin.length < 1;
			this.startControls.startGame.disabled = this.players.length < this.gameOpts.opts.minplayers.value;
		} else if ( event.type == "next" ) {
			if ( this.currentPlayer + 1 == this.players.length ) {
				console.log("yo");
				this.currentPlayer++;
				const newPlayer = new VGTPlayer( "Player " + (this.currentPlayer + 1), "" );
				this.players.push( newPlayer );
				this.playerInfo.setPlayer( newPlayer);
				this.startControls.nextPlayer.disabled = true;
				this.startControls.previousPlayer.disabled = false;
				this.startControls.startGame.disabled = this.players.length < this.gameOpts.opts.minplayers.value;
			}
		}
		console.log("ingin", event );
	}
}

function launch ( app ) {
	return new VGTGin( app );
}

export { launch };

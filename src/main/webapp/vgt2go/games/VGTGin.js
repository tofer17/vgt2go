/**
 *
 */

import { VGTComponent } from "../VGTComponent.js";
import { VGTGameOpts } from "../VGTGameOpts.js";
import { VGTPlayer } from "../VGTPlayer.js";
import { VGTPlayerInfo } from "../VGTPlayerInfo.js";
import { VGTStartControls } from "../VGTStartControls.js";
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

	start () {

		this.players = [ new VGTPlayer( "Player 1", "" ) ];
		this.currentPlayer = 0;
		//this.players.push( new VGTPlayer( "Chris", "1" ) );
		//this.players.push( new VGTPlayer( "Diana", "2" ) );
		//this.players.push( new VGTPlayer( "Anika", "3" ) );

		//const pi = new VGTPlayerInfo();
		this.playerInfo.setPlayer( this.players[ this.currentPlayer ] );
		this.whackStartControls();

		//this.startControls.previousPlayer.disabled = true;
		//this.startControls.nextPlayer.disabled = true;
		//this.startControls.startGame.disabled = true;
		// Get players
		//const go = new VGTGinGameOpts( this );
		//this.node.appendChild( go.node );
		//go.addEventListener( "change", this, false );
		//go.enabled = false;
		//go.visible = false;

		//const sc = new VGTStartControls( this );
	};

	//get hasEnoughPlayers () {
	//	return this.players.length >= this.gameOpts.opts.minplayers.value && this.players.length <= this.gameOpts.opts.maxplayers.value;
	//};

	whackStartControls () {
		const piOk = this.playerInfo.isValid;
		const sc = this.startControls;
		sc.previousPlayer.enabled = piOk && this.currentPlayer > 0;
		sc.nextPlayer.enabled = piOk && this.currentPlayer <= this.gameOpts.opts.maxplayers.value;
		sc.startGame.enabled = piOk && this.players.length >= this.gameOpts.opts.minplayers.value;

		this.gameOpts.enabled = this.currentPlayer == 0;
	};

	handleEvent ( event ) {
		const cp = this.players[ this.currentPlayer ];
		if ( event.target == this.playerInfo ) {
			this.whackStartControls();
		} else if ( event.type == "next" ) {
			if ( this.currentPlayer + 1 == this.players.length ) {
				console.log("yo");
				this.currentPlayer++;
				const newPlayer = new VGTPlayer( "Player " + (this.currentPlayer + 1), "" );
				this.players.push( newPlayer );
				this.playerInfo.setPlayer( newPlayer);
				this.whackStartControls();
			} else {
				this.currentPlayer++;
				this.playerInfo.visible = false;
				this.gameOpts.visible = false;
				this.startControls.visible = false;
				if ( this.players[ this.currentPlayer ].pin.length > 0 ) {
					this.pinPad.setControlsVisible( true );
					this.pinPad.validate( this.players[ this.currentPlayer ].name, this.players[ this.currentPlayer ].pin, null );
				}
			}

		} else if ( event.type == "previous" ) {

			this.playerInfo.visible = false;
			this.gameOpts.visible = false;
			this.startControls.visible = false;

			this.currentPlayer--;
			if ( this.currentPlayer < 0 ) {
				this.currentPlayer = this.players.length - 1;
			}

			const cp = this.players[ this.currentPlayer ];

			if ( cp.pin.length > 0 ) {
				this.pinPad.setControlsVisible( true );
				this.pinPad.validate( this.players[ this.currentPlayer ].name, cp.pin, console.log() );
			}


		} else if ( event.type == "done" ) {
			const cp = this.players[ this.currentPlayer ];
			this.playerInfo.setPlayer( cp );
			this.playerInfo.visible = true;
			this.gameOpts.visible = true;
			this.gameOpts.enabled = this.currentPlayer == 0;
			this.startControls.visible = true;
			this.whackStartControls();

		}
		console.log("ingin", event );
	}
}

function launch ( app ) {
	return new VGTGin( app );
}

export { launch };

/**
 *
 */

import { VGTGame } from "./VGTGame.js";
import { VGTCardGroup } from "../VGTCardGroup.js";
import { VGTPlayer } from "../VGTPlayer.js";

class VGTGin extends VGTGame {
	constructor ( app ) {
		super( app, "Gin" );

		this.gameOpts.opts.ace = {
			id : "aces",
			text : "Aces",
			type : "select",
			value : 1,
			opts : [ "start", "start/end", "end", "modulo" ]
		};

		this.gameOpts.opts.jokers = {
			id : "jokers",
			text : "Jokers",
			type : "radio",
			value : 0,
			opts : [ "removed", "wild" ]
		};

		this.gameOpts.opts.deal = {
			id : "deal",
			text : "Deal",
			type : "select",
			value : 0,
			opts : [ "11 cards", "10 cards" ]
		};

		this.gameOpts.opts.first = {
			id : "first",
			text : "First",
			type : "player-select",
			value : 0
		};

		this.gameOpts.opts.minPlayers.opts = [ 2, 5 ];
		this.gameOpts.opts.minPlayers.value = 3;

		this.gameOpts.opts.maxPlayers.opts = [ 2, 5 ];
		this.gameOpts.opts.maxPlayers.value = 5;

		this.deck = null;
		this.discard = null;
		this.table = null;
	};

	init () {
		super.init();

		this.gameOpts.opts.minPlayers.visible = false;
		this.gameOpts.opts.maxPlayers.visible = false;

		this.players.push ( new VGTPlayer( "cm", "1" ) );
		this.players.push ( new VGTPlayer( "dm", "2" ) );
		this.players.push ( new VGTPlayer( "am", "3" ) );
	}

	start () {
		super.start();
		console.log("START!");
		this.node.appendChild( document.createTextNode( "TABLE" ) );

		this.deck = VGTCardGroup.MakeStandardDeck();
		if ( this.gameOpts.opts.jokers.value == 0 ) {
			this.deck.removeJokers();
		}

		this.deck.shuffle();

		let i = 0;
		for ( let player of this.players ) {
			player.hand = new VGTCardGroup (
				"vgtjinplayerhand" + i++,
				VGTCardGroup.TYPES.RTL,
				...this.deck.deal( 10 )
			);
		}

		if ( this.gameOpts.opts.deal.value == 0 ) {
			this.players[ this.currentPlayer ].hand.add( this.deck.deal( 1 ) );
		} else {

		}

	};

}

function launch ( app ) {
	return new VGTGin( app );
}

export { launch };

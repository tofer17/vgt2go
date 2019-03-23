/**
 *
 */

import { VGTComponent } from "../VGTComponent.js";
import { VGTGame } from "./VGTGame.js";
import { VGTCardGroup } from "../VGTCardGroup.js";
import { VGTPlayer } from "../VGTPlayer.js";

class VGTTable extends VGTComponent {
	constructor () {
		super( "div", "vgttable" );
	};
}

class VGTCardTable extends VGTTable {
	constructor () {
		super();
	};
}

class VGTGinTable extends VGTCardTable {
	constructor ( stockPile, discardPile ) {
		super();

		this.stockPile = stockPile;
		this.discardPile = discardPile;
		this.playerHand = document.createElement( "div" );
	};

	init () {
		super.init();

		this.node.appendChild( document.createTextNode( "s" ) );
		this.node.appendChild( this.stockPile.node );

		this.node.appendChild( document.createTextNode( "d" ) );
		this.node.appendChild( this.discardPile.node );

		this.node.appendChild( document.createTextNode( "p" ) );
		this.node.appendChild( this.playerHand );

		this.stockPile.addEventListener( "change", this, false );
		this.discardPile.addEventListener( "change", this, false );
	};

	setPlayerHand ( playerHand ) {
		this.playerHand.innerHTML = "";
		this.playerHand.appendChild( playerHand.node );
	};
}

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
		this.discards = null;
		this.table = null;
	};

	init () {
		super.init();

		this.gameOpts.opts.minPlayers.visible = false;
		this.gameOpts.opts.maxPlayers.visible = false;

		this.players.push ( new VGTPlayer( "cm", "1" ) );
		this.players.push ( new VGTPlayer( "dm", "2" ) );
		this.players.push ( new VGTPlayer( "am", "3" ) );
	};

	setup () {
		super.setup();
	};

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
				"vgtginplayerhand" + i++,
				VGTCardGroup.TYPES.RTL,
				...this.deck.deal( 10 )
			);
		}

		this.discards = new VGTCardGroup( "vgtgindiscards", VGTCardGroup.TYPES.FaceUp );

		if ( this.gameOpts.opts.deal.value == 0 ) {
			this.players[ this.currentPlayer ].hand.add( this.deck.deal( 1 ) );
		} else {

		}

		this.table = new VGTGinTable( this.deck, this.discards );
		this.table.setPlayerHand( this.players[ this.currentPlayer ].hand );

		this.node.appendChild( this.table.node );

	};

}

function launch ( app ) {
	return new VGTGin( app );
}

export { launch };

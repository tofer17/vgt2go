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
		this.playerHand = null;
		this.playerHandDiv = document.createElement( "div" );
	};

	init () {
		super.init();

		//this.node.appendChild( document.createTextNode( "s" ) );
		this.node.appendChild( this.stockPile.node );

		//this.node.appendChild( document.createTextNode( "d" ) );
		this.node.appendChild( this.discardPile.node );

		//this.node.appendChild( document.createTextNode( "p" ) );
		this.node.appendChild( this.playerHandDiv );

		this.stockPile.addEventListener( "change", this, false );
		this.discardPile.addEventListener( "change", this, false );

		const btn = document.createElement( "button" );
		btn.innerHTML = "check meld";
		btn.addEventListener( "click", this, false );
		this.node.appendChild( btn );
	};

	// TODO: Add wild cards
	// ** = WILD RANK OR SUIT
	// *_ = WILD RANK
	// _* = WILD SUIT

	// aceOpt can be:
	//		*0: start-only => A23=ok, KQA=no, KA2=no
	//		 1: end-only => A23=no, KQA=ok, KA2=no
	//		 2: start-or-end-only => A23=ok, KQA=ok, K2A=no
	//		 3: modulus => A23=ok, KQA=ok, K2A=ok
	checkMeld ( cards, aceOpt ) {
		if ( aceOpt == null ) {
			aceOpt = 0;
		}

		// Check for a SET (all the same rank):
		let chk = cards[0].rank;
		for ( let card of cards ) {
			chk = chk == card.rank ? card.rank : null;
		}

		if ( chk != null ) {
			return true;
		}

		// check for RUN-- must all be same suit
		chk = cards[0].suit;
		for ( let card of cards ) {
			chk = chk == card.suit ? card.suit : null;
		}

		if ( chk == null ) {
			return false;
		}

		// Check they're in order (once sorted)

		cards.sort( ( c1, c2 ) => {
			const v1 = c1.suit.order * 4 + c1.rank.order;
			const v2 = c2.suit.order * 4 + c2.rank.order;
			return v1 == v2 ? 0 : v1 > v2 ? 1 : -1;
		});

		chk = cards[0].rank.order;

		// TODO: need aceOpt logic :( As is => aceOpt = 0
		for ( let card of cards ) {
			if ( chk++ != card.rank.order ) {
				return false;
			}
		}

		return true;
	};

	handleEvent( event ) {
		if ( event.type == "click" ) {
			const cards = this.playerHand.cards;
			const m0 = [ cards[0], cards[1], cards[2] ];
			const m1 = [ cards[3], cards[4], cards[5] ];
			const m2 = [ cards[6], cards[7], cards[8], cards[9] ];

			this.checkMeld( m0 );
			//checkMeld( m1 );
			//checkMeld( m2 );
		}
	};

	setPlayerHand ( playerHand ) {
		this.playerHandDiv.innerHTML = "";
		this.playerHandDiv.appendChild( playerHand.node );
		this.playerHand = playerHand;
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
		//this.node.appendChild( document.createTextNode( "TABLE" ) );

		this.deck = VGTCardGroup.MakeStandardDeck();
		this.deck.droppable = false;

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
			player.hand.turnAllFaceUp( true );
		}

		this.discards = new VGTCardGroup( "vgtgindiscards", VGTCardGroup.TYPES.FaceUp );

		if ( this.gameOpts.opts.deal.value == 0 ) {
			this.currentPlayer.hand.add( this.deck.deal( 1 ) );
			this.currentPlayer.hand.turnAllFaceUp( true );
			this.currentPlayer.hand.update();
			this.currentPlayer.hand.droppable = true;

			this.deck.draggable = false;

			this.discards.draggable = false;
			this.discards.droppable = true;
		} else {
			this.discards.add( this.deck.deal( 1 ) );
			this.discards.turnAllFaceUp( true );

			this.deck.draggable = true;

			this.discards.draggable = true;
			this.discards.droppable = false;
		}

		this.table = new VGTGinTable( this.deck, this.discards );
		this.table.setPlayerHand( this.currentPlayer.hand );

		this.node.appendChild( this.table.node );

	};

	handleDragEvent ( event ) {
		super.handleDragEvent( event );
		/*
		 * At Player Start: you have 10 cards, draw a card from stock or disc
		 *  stock: +drag -drop; disc: +drag -drop; hand: +drag +drop
		 * After Drop: you have 11 cards, discard a card from hand to disc
		 *  stock: -drag -drop; disc: -drag +drop; hand: +drag +drop
		 * After Drop: u just discarded, next player
		 */

		if ( event.type == "drop" ) {

			if ( this.dropping == null ) { // off-drop
				; // nop
			} else if ( this.dragging.srcPile == this.dropping.card.pile ) { // Rearranging
				; // nop
			} else if ( this.currentPlayer.hand.length == 10 && this.dropping.card.pile == this.discards) {
				//console.log( "Just discarded-- next player" );
				this.table.visible = false;
				this.shiftCurrentPlayer( 1, false );
			} else if ( this.currentPlayer.hand.length == 11 && this.dropping.card.pile == this.currentPlayer.hand ) {
				//console.log( "Just drew a card." );

				this.deck.draggable = false;
				this.deck.droppable = false;

				this.discards.draggable = false;
				this.discards.droppable = true;
			}
		}
	};

	shiftCurrentPlayer ( dir, allowNew ) {
		super.shiftCurrentPlayer( dir, allowNew );

		if ( this.stage == 1 && dir == 0 ) {

			this.table.setPlayerHand( this.currentPlayer.hand );

			this.currentPlayer.hand.draggable = true;
			this.currentPlayer.hand.droppable = true;

			this.deck.draggable = true;
			this.deck.droppable = false;

			this.discards.draggable = true;
			this.discards.droppable = false;

			this.table.visible = true;
		}
	};
}

function launch ( app ) {
	return new VGTGin( app );
}

export { launch };

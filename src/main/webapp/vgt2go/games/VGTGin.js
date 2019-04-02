/**
 *
 */

import { VGTCardGroup } from "../VGTCardGroup.js";
import { VGTCardTable } from "../VGTCardTable.js";
import { VGTComponent } from "../VGTComponent.js";
import { VGTGame } from "./VGTGame.js";
import { VGTPlayer } from "../VGTPlayer.js";


class VGTGinTable extends VGTCardTable {
	constructor ( stockPile, discardPile ) {
		super();

		this.stockPile= stockPile;
		this.discardPile = discardPile;
		this.playerHand = null;
		this.playerHandDiv = null;
	};

	init () {
		super.init();

		this.playerHandDiv = document.createElement( "div" );

		const tab = document.createElement( "table" );
		const tr = tab.insertRow();
		tr.insertCell().appendChild( this.stockPile.node );
//		this.appendChild( this.stockPile );

		tr.insertCell().appendChild( this.discardPile.node );
//		this.appendChild( this.discardPile );

		this.appendChild( tab );

		this.appendChild( this.playerHandDiv );

		this.stockPile.addEventListener( "change", this, false );
		this.discardPile.addEventListener( "change", this, false );

	};

	setActivePlayer ( player ) {
		this.playerHandDiv.innerHTML = "";
		this.playerHandDiv.appendChild( player.hand.node );
		this.playerHand = player.hand;
		this.activePlayer.innerHTML = player.name;
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
		this.gameOpts.opts.minPlayers.value = 2;

		this.gameOpts.opts.maxPlayers.opts = [ 2, 5 ];
		this.gameOpts.opts.maxPlayers.value = 5;

		this.deck = null;
		this.discards = null;
		this.table = null;
		this.ginButton = null;
	};

	init () {
		super.init();

		this.deck = VGTCardGroup.MakeStandardDeck();
		this.deck.droppable = false;

		this.discards = new VGTCardGroup( "vgtgindiscards", VGTCardGroup.TYPES.FaceUp );

		this.table = new VGTGinTable( this.deck, this.discards );

		this.ginButton = document.createElement( "button" );
		this.ginButton.id = "ginButton";
		this.ginButton.innerHTML = "Gin";
		this.ginButton.disabled = true;
		this.ginButton.style.display = "none";

		this.appendChild( this.table );
		this.appendChild( this.ginButton );

		this.gameOpts.opts.minPlayers.visible = false;
		this.gameOpts.opts.maxPlayers.visible = false;

		this.table.visible = false;

		this.ginButton.addEventListener( "click", this, false );

		//this.addPlayer( new VGTPlayer( "cm", "1" ) );
		//this.addPlayer( new VGTPlayer( "dm", "2" ) );
		//this.addPlayer( new VGTPlayer( "am", "3" ) );
	};

	setup () {
		super.setup();
	};

	update () {
		super.update();
	};

	start () {
		super.start();
		console.log("START!");

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
			player.hand.addEventListener( "click", this, false );
		}

		if ( this.gameOpts.opts.deal.value == 0 ) {
			this.currentPlayer.hand.add( this.deck.deal( 1 ) );
			this.currentPlayer.hand.turnAllFaceUp( true );
			this.currentPlayer.hand.update();
			this.currentPlayer.hand.droppable = true;

			this.deck.draggable = false;

			this.discards.draggable = false;
			this.discards.droppable = true;

			this.ginButton.disabled = false;
		} else {
			this.discards.add( this.deck.deal( 1 ) );
			this.discards.turnAllFaceUp( true );

			this.deck.draggable = true;

			this.discards.draggable = true;
			this.discards.droppable = false;
		}

		this.deck.addEventListener( "click", this, false );
		this.discards.addEventListener( "click", this, false );

		this.table.setActivePlayer( this.currentPlayer );

		this.table.visible = true;

		this.ginButton.style.display = "";

	};

	checkMelds () {

		const cards = this.currentPlayer.hand.cards;

		const m0 = [ cards[0], cards[1], cards[2] ];
		const m1 = [ cards[3], cards[4], cards[5] ];
		const m2 = [ cards[6], cards[7], cards[8], cards[9] ];

		const im0 = checkMeld( m0, this.gameOpts.opts.ace.value );
		const im1 = checkMeld( m1, this.gameOpts.opts.ace.value );
		const im2 = checkMeld( m2, this.gameOpts.opts.ace.value );

		console.log(   "m0:[" + m0 + "]=>" + im0 +
					 ", m1:[" + m1 + "]=>" + im1 +
					 ", m2:[" + m2 + "]=>" + im2 );

		if ( im0 && im1 && im2 ) {
			Promise.resolve().then( ()=>{ window.alert( "WIN!!!" );} );
		} else {
			Promise.resolve().then( ()=>{ window.alert( "Nope!!" );} );
		}

	};

	handleEvent ( event ) {
		if ( event.target == this.ginButton ) {
			this.checkMelds();
		} else if ( event.type == "click" ) {
			this.handleClickEvent( event );
		} else {
			super.handleEvent( event );
		}
	};

	handleClickEvent ( event ) {
		const hl = this.currentPlayer.hand.length;
		if ( hl == 10 ) {
			// Drawing a card...
			if ( event.target != this.currentPlayer.hand ) {
				// ...from stock or discard pile
				console.log( "draw", event.targetCard );

				event.target.removeCard( event.targetCard );
				event.targetCard.faceUp = true;
				this.currentPlayer.hand.addCardAt( event.targetCard );

				this.drew();

			} // else ignore player-hand click
		} else {
			// Discarding a card...
			if ( event.target == this.currentPlayer.hand ) {
				// ...from player-hand
				console.log( "discard", event.targetCard );
				event.target.removeCard( event.targetCard );
				this.discards.addCardAt( event.targetCard );

				this.discarded();
			} // else ignore deck or discard click.
		}
	}

	drew () {
		this.deck.draggable = false;
		this.deck.droppable = false;

		this.discards.draggable = false;
		this.discards.droppable = true;

		this.currentPlayer.hand.draggable = true;
		this.currentPlayer.hand.droppable = true;

		this.ginButton.disabled = false;
	};

	discarded () {
		this.table.visible = false;
		this.shiftCurrentPlayer( 1, false );
		this.ginButton.disabled = true;
		// FIXME: Check for empty deck and shuffle.

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

			if ( this.dropping == null ) {
				// off-drop
				; // nop
			} else if ( this.dragging.srcPile == this.dropping.card.pile ) {
				// Rearranging
				; // nop
			} else if ( this.currentPlayer.hand.length == 10 && this.dropping.card.pile == this.discards) {
				// Just discarded-- next player
				this.discarded();
			} else if ( this.currentPlayer.hand.length == 11 && this.dropping.card.pile == this.currentPlayer.hand ) {
				// Just drew a card
				this.drew();
			}
		}
	};

	shiftCurrentPlayer ( dir, allowNew ) {
		super.shiftCurrentPlayer( dir, allowNew );

		if ( this.stage == 1 && dir == 0 ) {

			this.table.setActivePlayer( this.currentPlayer );

			this.currentPlayer.hand.draggable = true;
			this.currentPlayer.hand.droppable = true;

			this.deck.draggable = true;
			this.deck.droppable = false;

			this.discards.draggable = true;
			this.discards.droppable = false;

			this.table.visible = true;

			this.ginButton.style.display = "";
		} else {
			this.ginButton.style.display = "none";
		}
	};
}

// TODO: Add wild cards
// ** = WILD RANK OR SUIT
// *_ = WILD RANK
// _* = WILD SUIT

// aceOpt can be:
//		*0: start-only => A23=ok, KQA=no, KA2=no
//		 1: end-only => A23=no, KQA=ok, KA2=no
//		 2: start-or-end-only => A23=ok, KQA=ok, K2A=no
//		 3: modulus => A23=ok, KQA=ok, K2A=ok
function checkMeld ( cards, aceOpt ) {

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
		const v1 = ( c1.suit.order * 4 ) + c1.rank.order;
		const v2 = ( c2.suit.order * 4 ) + c2.rank.order;
		return v1 == v2 ? 0 : ( v1 > v2 ? 1 : -1 );
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


function launch ( app ) {
	return new VGTGin( app );
}

export { VGTGin, launch };

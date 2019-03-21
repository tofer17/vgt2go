/**
 *
 */
import { VGTComponent } from "./VGTComponent.js";

class VGTCardBase extends Object {
	constructor ( id, name, order ) {
		super();
		Object.defineProperty( this, "id", { value: id } );
		Object.defineProperty( this, "name", { value: name } );
		Object.defineProperty( this, "order", { value: order } );
	};
}

class VGTRank extends VGTCardBase {
	constructor ( id, name, order ) {
		super( id, name, order );
	};
}


const RANKS = [];
RANKS.push( new VGTRank( "A", "Ace", 1 ) );
RANKS.push( new VGTRank( "2", "Two", 2 ) );
RANKS.push( new VGTRank( "3", "Three", 3 ) );
RANKS.push( new VGTRank( "4", "Four", 4 ) );
RANKS.push( new VGTRank( "5", "Five", 5 ) );
RANKS.push( new VGTRank( "6", "Six", 6 ) );
RANKS.push( new VGTRank( "7", "Seven", 7 ) );
RANKS.push( new VGTRank( "8", "Eight", 8 ) );
RANKS.push( new VGTRank( "9", "Nine", 9 ) );
RANKS.push( new VGTRank( "T", "Ten", 10 ) );
RANKS.push( new VGTRank( "J", "Jack", 11 ) );
RANKS.push( new VGTRank( "Q", "Queen", 12 ) );
RANKS.push( new VGTRank( "K", "King", 13 ) );

class VGTSuit extends VGTCardBase {
	constructor ( id, name, order ) {
		super( id, name, order );
	};

	get color () {
		return this.id == "D" || this.id == "H" ? "red" : (this.id == "C" || this.id == "S" ? "black" : "joker");
	};
}

const SUITS = [];
SUITS.push( new VGTSuit( "C", "Clubs", 1 ) );
SUITS.push( new VGTSuit( "D", "Diamonds", 2 ) );
SUITS.push( new VGTSuit( "H", "Hearts", 3 ) );
SUITS.push( new VGTSuit( "S", "Spades", 4 ) );

const JOKER_SUIT = new VGTSuit( "X", "Joker", 100 );

class VGTCard extends VGTComponent {
	constructor ( rank, suit ) {
		super( "div",
			"vgtcard-" +
			rank.id + suit.id,
			"vgtcard", suit.color + "suit"
		);

		Object.defineProperty( this, "rank", { value: rank } );
		Object.defineProperty( this, "suit", { value: suit } );
		Object.defineProperty( this, "id", { value: rank.id + suit.id } );
	};

	update () {
		this.node.innerHTML = this.id;
	};

	toString () {
		return this.id;
	};

	static get SUITS () {
		return SUITS;
	};

	static get RANKS () {
		return RANKS;
	};

	static get JOKER_SUIT () {
		return JOKER_SUIT;
	}

	static MakeJoker ( rank ) {
		return new VGTCard( new VGTRank( rank, "Joker " + rank, 100 + rank ), JOKER_SUIT );
	};
}

export { VGTCard };

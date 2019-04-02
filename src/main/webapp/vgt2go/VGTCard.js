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

const STANDARD_RANKS = [];
STANDARD_RANKS.push( new VGTRank( "A", "Ace", 1 ) );
STANDARD_RANKS.push( new VGTRank( "2", "Two", 2 ) );
STANDARD_RANKS.push( new VGTRank( "3", "Three", 3 ) );
STANDARD_RANKS.push( new VGTRank( "4", "Four", 4 ) );
STANDARD_RANKS.push( new VGTRank( "5", "Five", 5 ) );
STANDARD_RANKS.push( new VGTRank( "6", "Six", 6 ) );
STANDARD_RANKS.push( new VGTRank( "7", "Seven", 7 ) );
STANDARD_RANKS.push( new VGTRank( "8", "Eight", 8 ) );
STANDARD_RANKS.push( new VGTRank( "9", "Nine", 9 ) );
STANDARD_RANKS.push( new VGTRank( "T", "Ten", 10 ) );
STANDARD_RANKS.push( new VGTRank( "J", "Jack", 11 ) );
STANDARD_RANKS.push( new VGTRank( "Q", "Queen", 12 ) );
STANDARD_RANKS.push( new VGTRank( "K", "King", 13 ) );

class VGTSuit extends VGTCardBase {
	constructor ( id, name, order ) {
		super( id, name, order );
	};

	get color () {
		return this.id == "D" || this.id == "H" ? "red" : (this.id == "C" || this.id == "S" ? "black" : "joker");
	};

	get char () {
		switch ( this.id ) {
			case "C" : return "&clubs;";
			case "D" : return "&diams;";
			case "H" : return "&hearts;";
			case "S" : return "&spades;";
			case "X" : return "&#9786;";
			default : return "?";
		}
	};
}

const STANDARD_SUITS = [];
STANDARD_SUITS.push( new VGTSuit( "C", "Clubs", 1 ) );
STANDARD_SUITS.push( new VGTSuit( "D", "Diamonds", 2 ) );
STANDARD_SUITS.push( new VGTSuit( "H", "Hearts", 3 ) );
STANDARD_SUITS.push( new VGTSuit( "S", "Spades", 4 ) );

const JOKER_SUIT = new VGTSuit( "X", "Joker", 100 );
const EMPTY_SUIT = new VGTSuit( "e", "Empty", 101 );
const BACK_SUIT = new VGTSuit( "b", "Back", 101 );

class VGTCard extends VGTComponent {
	constructor ( rank, suit ) {
		super( "div", null, "vgtcard" );

		Object.defineProperty( this, "rank", { value: rank } );
		Object.defineProperty( this, "suit", { value: suit } );
		Object.defineProperty( this, "id", { value: rank.id + suit.id } );

		this.facingUp = true;
		this.pile = null;
	};

	get faceUp () {
		return this.facingUp;
	};

	set faceUp ( faceUp ) {
		this.facingUp = faceUp;

		if ( this.suit == EMPTY_SUIT ) {
			this.node.style.background = "#bbb";
		} else if ( this.suit == BACK_SUIT || (!this.facingUp) ) {
			this.node.classList.remove( "redsuit" );
			this.node.classList.remove( "blacksuit" );
			this.node.classList.add( "backsuit" );
			this.node.id = "";
			this.node.style.backgroundPosition = ( ( 2 ) * -100) + "px " + ( ( 4 ) * -146) + "px";
		} else {
			this.node.innerHTML = "";
			this.node.classList.remove( "backsuit" );
			this.node.classList.add( this.suit.color + "suit" );
			this.node.id = "vgtcard-" + this.rank.id + this.suit.id
			this.node.style.backgroundPosition = ( ( this.rank.order - 1 ) * -100) + "px " + ( ( this.suit.order - 1 ) * -146) + "px";
		}
	};

	init () {
		super.init();

		this.faceUp = this.facingUp;

		this.draggable = this.suit != EMPTY_SUIT;
		this.droppable = true;

		this.node.addEventListener( "mouseenter", (e) => {
			e.target.classList.toggle( "cardHover" );
		}, false );

		this.node.addEventListener( "mouseleave", (e) => {
			e.target.classList.toggle( "cardHover" );
		}, false );

		this.node.addEventListener( "click", this, false );

		this.node.card = this;
	};

	get draggable () {
		return this.node.draggable;
	};

	set draggable ( draggable ) {
		this.node.draggable = draggable;
		if ( draggable ) {
			this.node.classList.add( "draggable" );
		} else {
			this.node.classList.remove( "draggable" );
		}
	};

	get droppable () {
		return this.node.classList.contains( "droppable" );
	};

	set droppable ( droppable ) {
		if ( droppable ) {
			this.node.classList.add( "droppable" );
		} else {
			this.node.classList.remove( "droppable" );
		}
	};

	toString () {
		return this.id;
	};

	handleEvent ( event ) {
		if ( event.type == "click" ) {
			this.dispatchEvent( new Event( "click" ) );
		}
	}

	static get STANDARD_SUITS () {
		return STANDARD_SUITS;
	};

	static get STANDARD_RANKS () {
		return STANDARD_RANKS;
	};

	static get JOKER_SUIT () {
		return JOKER_SUIT;
	}

	static MakeJoker ( rank ) {
		return new VGTCard( new VGTRank( rank, "Joker " + rank, 100 + rank ), JOKER_SUIT );
	};

	static MakeEmpty () {
		return new VGTCard( new VGTRank( 0, "Empty", 101 ), EMPTY_SUIT );
	};

	static MakeBack () {
		return new VGTCard( new VGTRank( 0, "Back", 101 ), BACK_SUIT );
	};

}

export { VGTCard };

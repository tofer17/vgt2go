/**
 *
 */
import { VGTComponent } from "./VGTComponent.js";
import { VGTEvent } from "./VGTEvent.js";

class VGTCardEvent extends VGTEvent {
	constructor ( type ) {
		super( type );
	};
}

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

const CARDPNGDIMS = { width : 1300, height : 730 };
const CARDBACKPOS = { x : 12, y : 4 };

class VGTCard extends VGTComponent {
	constructor ( rank, suit ) {
		super( "div", null, "vgtcard" );

		Object.defineProperty( this, "rank", { value: rank } );
		Object.defineProperty( this, "suit", { value: suit } );
		Object.defineProperty( this, "id", { value: rank.id + suit.id } );

		this.facingUp = true;
		this.pile = null;

		this.width = CARDPNGDIMS.width / 13;
		this.height = CARDPNGDIMS.height / 5;

		this.canClick = true;
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
			this.node.style.backgroundPosition = ( ( CARDBACKPOS.x ) * ( -1 * this.width ) ) + "px " + ( ( CARDBACKPOS.y ) * ( -1 * this.height ) ) + "px";
		} else {
			this.node.innerHTML = "";
			this.node.classList.remove( "backsuit" );
			this.node.classList.add( this.suit.color + "suit" );
			this.node.id = "vgtcard-" + this.rank.id + this.suit.id;
			if ( this.suit != JOKER_SUIT ) {
				this.node.style.backgroundPosition = ( ( this.rank.order - 1 ) * ( -1 * this.width ) ) + "px " + ( ( this.suit.order - 1 ) * ( -1 * this.height ) ) + "px";
			} else {
				// FIXME: Ideally this should be reflected properly in Joker rank/suit.
				this.node.style.backgroundPosition = ( ( this.rank.order - 101 ) * ( -1 * this.width ) ) + "px " + ( ( 4 ) * ( -1 * this.height ) ) + "px";
			}
		}
	};

	init () {
		super.init();

		this.faceUp = this.facingUp;

		this.draggable = this.suit != EMPTY_SUIT;
		this.droppable = true;

		this.node.addEventListener( "mouseenter", (e) => {
			e.target.classList.toggle( "cardHover", true );
		}, false );

		this.node.addEventListener( "mouseleave", (e) => {
			e.target.classList.toggle( "cardHover", false );
		}, false );

		this.node.addEventListener( "click", this, false );

		this.node.card = this;

		if ( !GlobalVGTCard.stylesheet ) {
			VGTCard.setCardStyle( this.width + "px", this.height + "px", "../resources/Cards_1a.png", CARDPNGDIMS.width + "px", CARDPNGDIMS.height + "px" );
		}
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

	get clickable () {
		return this.canClick;
	};

	set clickable ( clickable ) {
		this.canClick = clickable;
	};

	toString ( debug ) {
		return this.id + debugCard( debug, this );
	};

	handleEvent ( event ) {
		event.preventDefault();

		if ( event.type == "click" && this.canClick ) {
			this.dispatchEvent( new VGTCardEvent( "click" ).addDetail( "srcEvent", event ) );
		}
	};

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

	static setCardStyle ( cardWidth, cardHeight, bkgUrl, bkgWidth, bkgHeight ) {

		if ( !GlobalVGTCard.stylesheet || GlobalVGTCard.stylesheet == "loading" ) {

			if ( GlobalVGTCard.stylesheet == "loading" ) {
				return;
			}

			GlobalVGTCard.stylesheet = "loading";

			const loadFunc = ( event ) => {

				event.target.removeEventListener( "load", loadFunc, false );

				GlobalVGTCard.stylesheet = document.getElementById( "VGTCard.css" ).sheet;

				const i = GlobalVGTCard.stylesheet.insertRule( ".vgtcard {}", 0 );

				GlobalVGTCard.cssRule = GlobalVGTCard.stylesheet.cssRules[ i ];

				VGTCard.setCardStyle ( cardWidth, cardHeight, bkgUrl, bkgWidth, bkgHeight );
			};

			document.getElementById( "VGTCard.css" ).addEventListener( "load", loadFunc, false );

			return;
		}

		GlobalVGTCard.cssRule.style.width = cardWidth;
		GlobalVGTCard.cssRule.style.height = cardHeight;
		GlobalVGTCard.cssRule.style.background = "url('" + bkgUrl + "')";
		GlobalVGTCard.cssRule.style.backgroundSize = bkgWidth + " " + bkgHeight;

	};

}

function debugCard ( debug, card ) {
	return !debug ? "" :( card.clickable ? "C" : "c" ) +
			( card.draggable ? "D" : "d" ) +
			( card.droppable ? "P" : "p" );
}

const GlobalVGTCard = {};
window.vgt.GlobalVGTCard = GlobalVGTCard;

export { VGTCard, VGTCardEvent };

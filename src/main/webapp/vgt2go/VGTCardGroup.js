/**
 *
 */
import { VGTComponent  } from "./VGTComponent.js";
import { VGTCard } from "./VGTCard.js";

const _TYPES = { FaceDown : "FD", RTL : "RTL", FaceUp : "FU" };

class VGTCardGroup extends VGTComponent {
	constructor ( id, type, ...cards ) {
		super( "div", id, "vgtcardgroup" );

		this.id = id;
		this.type = type;

		this.cardBack = VGTCard.MakeBack();
		this.cardBack.pile = this;

		this.emptyCard = VGTCard.MakeEmpty();
		this.emptyCard.pile = this;

		this.cards = [];
		this.add( cards );

		if ( this.type != null ) {
			this.node.classList.add( this.type );
		}
	};

	init () {
		this.update();
	};

	update () {
		this.node.innerHTML = "";
		const tab = document.createElement( "table" );
		const tr = tab.insertRow();
		let td;

		if ( this.type == _TYPES.FaceDown ) {
			td = tr.insertCell();
			const card = this.cards[ 0 ];
			td.appendChild( this.cards.length > 0 ? card.node : this.emptyCard.node );
		} else if ( this.type == _TYPES.FaceUp ) {
			td = tr.insertCell();
			const card = this.cards[ this.cards.length - 1 ];
			td.appendChild( card != null ? card.node : this.emptyCard.node );
		} else if ( this.type == _TYPES.RTL ) {
			for ( let card of this.cards ) {
				td = tr.insertCell();
				td.appendChild( card.node );
			}
		}

		this.node.append( tab );
	};

	get length () {
		return this.cards.length;
	};

	turnAllFaceUp ( faceUp ) {
		for ( let card of this.cards ) {
			card.faceUp = faceUp;
		}
	};

	removeJokers () {
		this.cards = this.cards.filter( card => card.suit != VGTCard.JOKER_SUIT );
	};

	shuffle () {
		// Adapted from:
		// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	    for ( let i = this.cards.length - 1; i > 0; i-- ) {
	        const j = Math.floor( Math.random() * ( i + 1 ) );
	        [ this.cards[ i ], this.cards[ j ] ] = [ this.cards[ j ], this.cards[ i ] ];
	    }
	};

	deal ( count ) {
		if ( count < 1 ) {
			return null
		}

		const ret = [];
		for ( let i = 0; i < count; i++ ) {

			const card = this.cards.pop();

			card.pile = null;
			ret.push( card );
		}

		this.update();
		return count > 1 ? ret : ret[0];
	};

	add ( ...cards ) {
		for ( let card of cards ) {
			if ( card instanceof Array ) {

				this.add( ...card );

			} else {

				card.pile = this;
				this.cards.push( card );

			}
		}

	};

	removeCard ( card ) {
		const index = isFinite( card ) ? card : this.cards.indexOf( card );
		if ( index == -1 ) {
			return this.removeCard( this.type == _TYPES.FaceDown ? 0 : this.cards.length - 1 );
		}
		this.cards.splice( index, 1 );
		card.pile = null;
		this.update();
		return card;
	};

	/*
	 * RTL: Add the card to position specified.
	 * FU: Top card is LAST card, ergo PUSH
	 * FD: Top card is FIRST card, ergo SPLICE
	 */
	addCardAt ( card, dst ) {
		let index = isFinite( dst ) ? dst : this.cards.indexOf( dst );

		if ( index == -1 ) {
			return this.addCardAt( card, this.type == _TYPES.FaceUp ? 0 : Math.max(0,this.cards.length - 1 ));
		}

		if ( this.type == _TYPES.FaceUp ) {
			index++;
		}

		this.cards.splice( index, 0, card );
		card.pile = this;
		this.update();
	};

	// Place SRC at DST.
	//	SRC=null: remove DST
	//  DST=null: push SRC
	reorder ( src, dst ) {

		const to = isFinite( dst ) ? dst : this.cards.indexOf( dst );
		const from = isFinite( src ) ? src : this.cards.indexOf( src );

		if ( to >= 0 && from >= 0 ) {
			this.cards.splice(to, 0, this.cards.splice(from, 1)[0]);
		} else if ( to == -1 && from == -1 ) {
			this.cards.push( src );
		} else if ( from == -1 ) { // to >= 0
			this.cards.splice( to, 0, dst );
		} else { // to == -1, from >= 0
			reorder( this.cards, from, this.cards.length - 1 );
		}

		this.update();

	};

	set draggable ( draggable ) {
		for ( let card of this.cards ) {
			card.draggable = draggable;
		}
	};

	set droppable ( droppable ) {
		for ( let card of this.cards ) {
			card.droppable = droppable;
		}
	}

	static get TYPES () {
		return _TYPES;
	};

	static MakeStandardDeck () {
		const cards = [];
		for ( let suit of VGTCard.SUITS ) {
			for ( let rank of VGTCard.RANKS ) {
				const card = new VGTCard( rank, suit );
				card.faceUp = false;
				cards.push( card );
			}
		}

		for ( let i = 1; i < 3; i++ ) {
			const card = VGTCard.MakeJoker( i );
			card.faceUp = false;
			cards.push( card );
		}

		return new VGTCardGroup( "standard", _TYPES.FaceDown, ...cards );
	};
}

export { VGTCardGroup };

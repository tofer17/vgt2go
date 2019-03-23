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
		this.emptyCard = VGTCard.MakeEmpty();

		this.cards = [];
		if ( cards != null ) {
			this.cards.push( ...cards );
		}

		if ( this.type != null ) {
			this.node.classList.add( this.type );
		}
	};

	init () {
		const tab = document.createElement( "table" );
		const tr = tab.insertRow();
		let td;

		if ( this.type == _TYPES.FaceDown ) {
			td = tr.insertCell();
			td.appendChild( this.cards.length > 0 ? this.cardBack.node : this.emptyCard.node );
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
			ret.push( this.cards.pop() );
		}

		return count > 1 ? ret : ret[0];
	};

	add ( ...cards ) {
		this.cards.push( ...cards );
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

	static get TYPES () {
		return _TYPES;
	};

	static MakeStandardDeck () {
		const cards = [];
		for ( let suit of VGTCard.SUITS ) {
			for ( let rank of VGTCard.RANKS ) {
					cards.push( new VGTCard( rank, suit ) );
			}
		}
		cards.push( VGTCard.MakeJoker( 1 ) );
		cards.push( VGTCard.MakeJoker( 2 ) );
		return new VGTCardGroup( "standard", _TYPES.FaceDown, ...cards );
	};
}

export { VGTCardGroup };

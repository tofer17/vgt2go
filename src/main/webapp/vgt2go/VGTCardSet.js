import { VGTComponent } from "./VGTComponent.js";
import { VGTEvent } from "./VGTEvent.js";

/**
 *
 */

class VGTCardSetEvent extends VGTEvent {
	constructor ( op ) {
		super( "change" );

		if ( op != null ) {
			this.addDetail( "op", op );
		}
	};
}

class VGTCardSet extends VGTComponent {

	constructor ( id, ...cards ) {
		super( "div", null, "vgtcardset" );

		this._node.id = "vgtcardset-" + this._hashCode;
		this.offset = { x : 0, y : 0 };

		const me = this;

		Object.defineProperty( this, "cards",
			{ value : new Proxy( new Array, {

				apply : function( target, thisArg, argumentsList ) {
					return thisArg[ target ].apply( this, argumentList );
				},

				deleteProperty : function( target, property ) {
					if ( !me._beSilent ) {
						me.dispatchEvent( new VGTCardSetEvent( "delete" ) );
					}
					return true;
				},

				set : function( target, property, value, receiver ) {
					target[ property ] = value;
					if ( property == "length" ) {
						return true;
					}
					value.pile = me;
					if ( !me._beSilent ) {
						me.dispatchEvent( new VGTCardSetEvent( property ) );
					}
					return true;
				}
			})}
		);

		this._beSilent = true;
		this.cards.push( ...cards );
		this._beSilent = false;
	};

	init () {
		super.init();
	};

	turnCards ( facing, ...cards ) {
		if ( cards == null || cards.length == 0 ) {
			cards = this.cards;
		}

		if ( facing == null ) {
			facing = cards[0].facing;
		}

		const ret = [];

		for ( let card of cards ) {
			card.facing = facing;
			ret.push( card );
		}

		this.dispatchEvent( new VGTCardSetEvent( "facing" ) );

		return ret;
	};

	shuffle () {
		this._beSilent = true;

		for ( let i = this.cards.length - 1; i > 0; i-- ) {
			const r = window.crypto.getRandomValues( new Uint32Array(1) )[ 0 ];
			const j = Math.floor( ( r / 4294967295.0 ) * ( i + 1 ) );
			[ this.cards[ i ], this.cards[ j ] ] = [ this.cards[ j ], this.cards[ i ] ];
		}

		this.dispatchEvent( new VGTCardSetEvent( "shuffle") );

		return this.cards;
	};

	/**
	 * Deals count number of cards from the top or bottom of the deck.
	 *
	 * @this {VGTCardSet}
	 * @param {number}
	 *            count The number of cards to deal. If count is positive, the
	 *            cards will be taken from the top of the deck (shift); if the
	 *            number is negative, the cards will be taken from the bottom of
	 *            the deck (pop).
	 * @return {Array} An array of cards if more than one was request
	 */
	deal ( count ) {
		if ( count == null || count == 0 ) {
			throw "Count cannot be 0: '" + count + "'";
		}

		this._beSilent = true;
		const ret = [];
		if ( count > 0 ) {
			for ( let i = 0; i < count; i++ ) {
				ret.push( this.cards.shift() );
			}
		} else {
			for ( let i = count; i < 0; i++ ) {
				ret.push( this.cards.pop() );
			}
		}

		this.dispatchEvent( new VGTCardSetEvent( "deal" ) );

		// return count > 1 ? ret : ret[0];
		// return ret.length > 1 ? ret : ret[0];
		return ret;
	};

	/**
	 * Removes cards by object and/or index from the deck.
	 *
	 * @this {VGTCardSet}
	 * @param {Array}
	 *            ...cards Can either be a set of cards or index positions (or
	 *            a mixture). If the index position is negative then it is
	 *            subtracted from (added to) the length of the deck. -1 becomes
	 *            deck.length-1. The deck mutates with each change; remove(0,0)
	 *            will remove the first two cards!
	 * @return {Array} An array of the cards removed.
	 */
	// TODO: if ...cards is a FUNCTION then use the FUNCTION as a sort of FUNCTION.
	//		Thus one could say: remove(c=>!c.isJoker())
	//		But, keep in mind, it will APPEAR that a VGTCard = function
	remove ( ...cards ) {
		this._beSilent = true;
		const ret = [];

		for ( let card of cards ) {
			if ( isFinite( card ) ) {
				const index = parseInt( card );
				ret.push( this.cards.splice( index >= 0 ? index : this.cards.length + index, 1 ) );
			} else {
				ret.push( ...this.cards.splice( this.cards.indexOf( card ), 1 ) );
			}
		}

		this.dispatchEvent( new VGTCardSetEvent( "remove" ) );

		return ret;
	};

	dispatchEvent ( event ) {
		console.log( "Dispatching:", event );
		super.dispatchEvent( event );
		this._beSilent = false;
	};

	concat ( ...args ) { return this.cards.concat( ...args ); };
	copyWithin ( ...args ) {
		this._beSilent = true;
		const ret = this.cards.copyWithin( ...args );
		this.dispatchEvent( new VGTCardSetEvent( "copyWithin" ) );
		return ret;
	};
	entries ( ...args ) { return this.cards.entries( ...args ); };
	every ( ...args ) { return this.cards.every( ...args ); };
	fill ( ...args ) {
		this._beSilent = true;
		const ret = this.cards.fill( ...args );
		this.dispatchEvent( new VGTCardSetEvent( "fill" ) );
		return ret;
	};
	filter ( ...args ) { return this.cards.filter( ...args ); };
	find ( ...args ) { return this.cards.find( ...args ); };
	findIndex ( ...args ) { return this.cards.findIndex( ...args ); };
	flat ( ...args ) { return this.cards.flat( ...args ); };
	flatMap ( ...args ) { return this.cards.flatMap( ...args ); };
	forEach ( ...args ) { return this.cards.forEach( ...args ); };
	includes ( ...args ) { return this.cards.includes( ...args ); };
	indexOf ( ...args ) { return this.cards.indexOf( ...args ); };
	join ( ...args ) { return this.cards.join( ...args ); };
	keys ( ...args ) { return this.cards.keys( ...args ); };
	lastIndexOf ( ...args ) { return this.cards.lastIndexOf( ...args ); };
	length ( ...args ) { return this.cards.length( ...args ); };
	map ( ...args ) { return this.cards.map( ...args ); };
	pop ( ...args ) { return this.cards.pop( ...args ); };
	push ( ...args ) {
		this._beSilent = true;
		const ret = this.cards.push( ...args );
		this.dispatchEvent( new VGTCardSetEvent( "push" ) );
		return ret;
	};
	reduce ( ...args ) { return this.cards.reduce( ...args ); };
	reduceRight ( ...args ) { return this.cards.reduceRight( ...args ); };
	reverse ( ...args ) {
		this._beSilent = true;
		const ret = this.cards.reverse( ...args );
		this.dispatchEvent( new VGTCardSetEvent( "reverse" ) );
		return ret;
	};
	shift ( ...args ) { return this.cards.shift( ...args ); };
	slice ( ...args ) { return this.cards.slice( ...args ); };
	some ( ...args ) { return this.cards.some( ...args ); };
	sort ( ...args ) { return this.cards.sort( ...args ); };
	splice ( ...args ) {
		this._beSilent = true;
		const ret = this.cards.splice( ...args );
		this.dispatchEvent( new VGTCardSetEvent( "splice" ) );
		return ret;
	};
	unshift ( ...args ) {
		this._beSilent = true;
		const ret = this.cards.unshift( ...args );
		this.dispatchEvent( new VGTCardSetEvent( "unshift" ) );
		return ret;
	};
	values ( ...args ) { return this.cards.values( ...args ); };

}


export { VGTCardSet, VGTCardSetEvent };

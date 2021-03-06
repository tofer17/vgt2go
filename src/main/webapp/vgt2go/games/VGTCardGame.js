import { VGTGame } from "./VGTGame.js";
import { VGTProperty } from "../VGTProperties.js";
import { Utils } from "../Utils.js";

/**
*
*/

class VGTCardGame extends VGTGame {
	constructor ( app, title ) {
		super( app, title );

//		this.gameProps.rules.jokers = {
//			id : "jokers",
//			text : "Jokers",
//			type : "radio",
//			value : 0,
//			opts : [ "removed", "wild" ]
//		};

		this.gameProps.rules.jokers = VGTProperty.make( "radio", "jokers" )
			.withSort( 10 )
			.withTitle( "Jokers" )
			.withValue( 0 )
			.withOpts( [ "removed", "wild" ] );

//		this.gameProps.rules.clickDraw = {
//			id : "clickdraw",
//			text : "Click draw",
//			type : "radio",
//			value : 1,
//			opts : [ "First", "Last" ]
//		};

//		This is a card-player option
		this.gameProps.rules.clickDraw = VGTProperty.make( "radio", "clickdraw" )
			.withSort( 100 )
			.withTitle( "Click Draw" )
			.withValue( 0 )
			.withOpts( [ "First", "Last" ] );

		this.dragHoverClass = "cardHover";
	};

	init () {
		super.init();
	};


	handleDragEvent ( event ) {
		if ( event.type != "drop" ) {
			super.handleDragEvent( event );
		} else {

			event.preventDefault();

			//this.dropping = getDroppableParent( event.target );
			this.dropping = Utils.getClassedParent( event.target, "droppable" );

			if ( this.dropping != null ) {
				this.dropping.classList.remove( this.dragHoverClass );

				if ( this.dragging.card.pile == this.dropping.card.pile ) {
					this.dragging.card.pile.reorder( this.dragging.card, this.dropping.card );
				} else {
					this.dragging.card.pile.removeCard( this.dragging.card );
					this.dragging.card.faceUp = true;
					this.dropping.card.pile.addCardAt( this.dragging.card, this.dropping.card );
				}
			}
		}
	};
}

export { VGTCardGame };

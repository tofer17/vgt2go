/**
 * 
 */
import { VGTComponent } from "./VGTComponent.js";
import { VGTCard } from "./VGTCard.js";

class VGTCard2 extends VGTCard {
	constructor ( rank, suit ) {
		super( rank, suit );
		this.constructor.css = "VGTCard";
		this.svg = null;
	};
	
	init () {
		super.init();

		this.svg = VGTCard2.getSVG( this );

		this._node.innerHTML = "";
		this.appendChild( this.svg );
		
		this.node.style.overflow = "hidden";
	};
	
	static getSVG ( card ) {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute('style', 'border: 1px solid black');
		svg.setAttribute('width', card.width);
		svg.setAttribute('height', card.height);
		svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

		if ( !SVG.state ) {
			// First time
			SVG.state = 1;
			SVG.cards = [ card ];
			const xhr = new XMLHttpRequest();
			xhr.open( "GET", "./vgt2go/resources/Suits.svg", true );
			xhr.addEventListener( "load", ( event ) => {
				console.log( event );
				SVG.document = event.target.responseXML;
				SVG.state = 2;
				for ( let card of SVG.cards ) {
					VGTCard2.getSVG( card );
				}
			}, false );
			xhr.send();
		} else if ( SVG.state == 1 ) {
			// Still not loaded
			SVG.cards.push( card );			
		} else {
			// Loaded!

			if ( card.suit.id == "S" ) {
				card.svg.innerHTML = SVG.document.getElementById("spades").innerHTML;
			} else if ( card.suit.id == "C" ) {
				card.svg.innerHTML = SVG.document.getElementById("clubs").innerHTML;
			} else if ( card.suit.id == "H" ) {
				card.svg.innerHTML = SVG.document.getElementById("hearts").innerHTML;
			} else if ( card.suit.id == "D" ) {
				card.svg.innerHTML = SVG.document.getElementById("diamonds").innerHTML;				
			}
			
		}
		
		return svg;
	};
}

const SVG = {};

class VGTCardTest extends VGTComponent {
	constructor ( cardClass ) {
		super( "div", "vgtcardtest" );
		this.constructor.css = null;
		
		this.cards = [];
		for ( let suit of VGTCard.STANDARD_SUITS ) {
			for ( let rank of VGTCard.STANDARD_RANKS ) {
				const card = new cardClass( rank, suit );
				this.cards.push( card );
			}
		}
	};
	
	init () {
		super.init();
		for ( let card of this.cards ) {
			card.node.style.marginLeft = "100px";
			this.appendChild( card );return;
		}
	}
	
	static main ( div ) {
		if ( !div ) {
			div = document.body;
		}
		
		const cardTest = new VGTCardTest( VGTCard2 );
		
		div.appendChild( cardTest.node );
	}
}

VGTCardTest.main();

import { VGTComponent } from "./VGTComponent.js";

/**
 *
 */

class VGTRenderer extends Object {
	constructor ( design ) {
		super( design );
		this.design = design;
		this.lastComp = null;

		this.cache = [];
	};

	get theme () {
		return this.design;
	};

	set theme ( theme ) {
		if ( this.design == theme ) {
			return;
		}

		this.design = theme;
		const comps = [];

		for ( let entry of this.cache ) {
			comps.push( entry.comp );
		}

		this.clearCache();

		for ( let comp of comps ) {
			this.render( comp );
		}
	};

	layout ( comp ) {
		return document.createElement( "div" );
	}

	render ( comp ) {

		this.lastComp = comp;

		let node = null;

		for ( let entry of this.cache ) {
			if ( entry.comp == comp ) {
				node = entry.node;
				break;
			}
		}

		if ( node == null ) {
			node = this.layout( comp );

			if ( node != null ) {
				this.cache.push( { comp : comp, node : node } );
			}

			comp.addEventListener( "change", this, false );
		}

		// FIXME: Check if visible...
		if ( node != null ) {
			comp.node.innerHTML = "";
			comp.node.appendChild( node );
		}
	};

	clearCache ( comp ) {

		if ( comp == null ) {
			for ( let entry of this.cache ) {
				entry.comp.removeEventListener( "change", this, false );
			}

			this.cache = [];

			return;
		}

		let index = -1;

		for ( let i = 0; i < this.cache.length; i++ ) {
			if ( this.cache[ i ].comp == comp ) {
				index = i;
				break;
			}
		}

		if ( index < 0 ) {
			return;
		}

		comp.removeEventListener( "change", this, false );
		this.cache.splice( index, 1 );
	};

	handleEvent ( event ) {
		if ( event.type == "change" ) {
			this.clearCache( event.target );

			// FIXME: Check if visible.
			this.render( event.target );
		}
	};

	static getResource( key, url, callback ) {

		let resource = VGTRenderer.resources[ key ];

		if ( !resource ) {

			resource = {};
			VGTRenderer.resources[ key ] = resource;

			resource.state = 1;
			resource.callbacks = [ callback ];

			const xhr = new XMLHttpRequest();
			xhr.open( "GET", url, true );

			xhr.addEventListener( "load", ( event ) => {

				resource.state = 2;
				resource.xml = event.target.responseXML;
				resource.text = event.target.responseText;
				resource.status = event.target.status;
				resource.type = event.target.responseType;

				const callbacks = resource.callbacks;
				delete resource.callbacks;

				for ( let callback of callbacks ) {
					callback( resource );
				}
			}, false );

			xhr.send();

		} else if ( resource.state == 1 ) {
			resource.callbacks.push ( callback );
		}

		return resource;
	};
}

VGTRenderer.resources = {};


class VGTCardRenderer extends VGTRenderer {
	constructor ( design ) {
		super( design );
	};

}


class VGTStandardCardRenderer extends VGTCardRenderer {
	constructor ( design ) {
		super( design );
	};

}


class VGTSVGCardRenderer extends VGTStandardCardRenderer {
	constructor ( design ) {
		super( "./vgt2go/resources/Suits.svg" );
	};

	layout ( card ) {
		if ( card == null ) {
			card = this.lastComp;
		}

		const node = super.layout( card );

		const resource = VGTRenderer.getResource( "svg", this.design,
			( resource ) => {
				if ( resource.status != 200 ) {
					throw "Resource not available.";
				} else {
					this.render( card );
				}
			}
		);

		if ( resource.status != 200 ) {
			return;
		}

		const suits = resource.xml;

		const svg = document.createElementNS( "http://www.w3.org/2000/svg", "svg" );
		svg.setAttributeNS( "http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink" );
		svg.setAttribute( "width", card.width );
		svg.setAttribute( "height", card.height );

		if ( card.suit.id == "S" ) {
			svg.innerHTML = suits.getElementById("spades").outerHTML;
		} else if ( card.suit.id == "C" ) {
			svg.innerHTML = suits.getElementById("clubs").outerHTML;
		} else if ( card.suit.id == "H" ) {
			svg.innerHTML = suits.getElementById("hearts").outerHTML;
		} else if ( card.suit.id == "D" ) {
			svg.innerHTML = suits.getElementById("diamonds").outerHTML;
		}

		svg.style.position = "relative";
		svg.style.zIndex = "1";
		svg.style.marginTop = "-95px";
		svg.style.fill = "#00f";

		const g = svg.querySelector( "g" );
		g.style.transform = "translate(-65px,45px) scale(1.3)";

		const div = document.createElement( "div" );
		div.style.zIndex = "2";

		div.style.position = "relative";
		div.style.fontSize = "100px";
		div.style.fontWeight = "bold";
		div.style.letterSpacing = "-15px"
		div.style.marginTop = "-20px";
		div.style.overflow = "hidden";
		div.innerHTML = card.rank.id != "T" ? card.rank.id : "10";

		node.style.overflow = "hidden";
		node.style.border = "1px solid black";
		node.style.borderRadius = "8px";
		node.style.boxShadow = "1px 1px rgba(0,0,0,.5)";
		node.style.background = "#efefef";
		node.style.width = card.width + "px";
		node.style.height = card.height + "px";

		if ( card.suit.color == "red" ) {
			node.style.color = "#b00";
			svg.style.fill = "#a00";
			div.style.textShadow = "1px 1px rgba(0,0,0,.5)";
		} else {
			node.style.color = "#000";
			svg.style.fill = "#222";
			div.style.textShadow = "1px 1px rgba(255,255,255,.5)";
		}

		node.appendChild( div );
		node.appendChild( svg );

		card.node.classList.remove( "vgtcard" );
		return node;
	};

}


class VGTPNGCardRenderer extends VGTStandardCardRenderer {
	constructor ( design ) {
		super();
		this.design = design ? design : "./vgt2go/resources/Cards_1a.png";
	};

	layout ( card ) {
		if ( card == null ) {
			card = this.lastComp;
		}

		const node = super.layout( card );

		node.style.cursor = "default";
		node.style.background = "url('" + this.design + "')";
		node.style.backgroundSize = "1300px 730px";
		if ( card.faceUp ) {
			node.style.backgroundPosition = ( ( card.rank.order - 1 ) * ( -1 * card.width ) ) + "px " + ( ( card.suit.order - 1 ) * ( -1 * card.height ) ) + "px";
		} else {
			node.style.backgroundPosition = ( ( 12 ) * ( -1 * card.width ) ) + "px " + ( ( 4 ) * ( -1 * card.height ) ) + "px";
		}
		node.style.width = card.width + "px";
		node.style.height = card.height + "px";


		card.node.classList.remove( "vgtcard" );
		return node;
	};

}


class VGTRendererFactory {

	static getFor ( id ) {
		if ( VGTRendererFactory.factories[ id ] ) {
			return VGTRendererFactory.factories[ id ];
		}

		let renderer = null;
		switch ( id ) {
			case "StandardSVGCard" :
				renderer = new VGTSVGCardRenderer();
				break;
			case "StandardPNGCard_a" :
				renderer = new VGTPNGCardRenderer( "./vgt2go/resources/Cards_1a.png" );
				break;
			case "StandardPNGCard_b" :
				renderer = new VGTPNGCardRenderer( "./vgt2go/resources/Cards_1b.png" );
				break;
			default :
				throw "'" + id + "' is not a valid renderer!";
		}

		VGTRendererFactory.factories[ id ] = renderer;

		return renderer;
	};

	static get STANDARD_CARD_RENDERER () {

	};

}

VGTRendererFactory.STANDARD_CARD_RENDERERS = [
	"StandardSVGCard", "StandardPNGCard_a", "StandardPNGCard_b"
];

VGTRendererFactory.factories = {};


import { VGTCard } from "./VGTCard.js";

let card = new VGTCard( VGTCard.STANDARD_RANKS[0], VGTCard.STANDARD_SUITS[3] );
console.warn( "" + card );
document.body.appendChild( document.createElement("hr"));
document.body.appendChild( card.node );
card.node.style.marginLeft = "10px";
document.body.appendChild( document.createElement("hr"));

//let svgRenderer = new VGTSVGCardRenderer();
let svgRenderer = VGTRendererFactory.getFor( "StandardSVGCard" );
//let pngRendererA = new VGTPNGCardRenderer( "./vgt2go/resources/Cards_1a.png" );
let pngRendererA = VGTRendererFactory.getFor( "StandardPNGCard_a" );
//let pngRendererB = new VGTPNGCardRenderer( "./vgt2go/resources/Cards_1b.png" );
let pngRendererB = VGTRendererFactory.getFor( "StandardPNGCard_b" );

pngRendererB.render( card );

window.cards = [ card ];
window.renderers = [ svgRenderer, pngRendererA, pngRendererB ];


export { VGTRendererFactory };

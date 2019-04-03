/**
 *
 */
import { VGTEvent } from "./VGTEvent.js";
import { Utils } from "./Utils.js";

class VGTComponent extends EventTarget {
	constructor ( tagName, id, ...classes ) {
		super();

		Object.defineProperty( this, "_hashCode", { value : Utils.hashCode() } );

		Object.defineProperty( this, "_node", {
			value : tagName != null ? document.createElement( tagName ) : null
		});

		if ( this._node != null ) {
			if ( id ) {
				this._node.id = id;
			}
			if ( classes ) {
				this._node.classList.add( ...classes );
			}
		}

	};

	init () {
		if ( this.constructor.name != "VGTComponent" ) {
			Utils.importCSS( this.constructor.name );
		}
	};

	get node () {
		if ( !this.hasOwnProperty( "initialized" ) ) {
			Object.defineProperty( this, "initialized", { value : true } );
			this.init();
		}

		return this._node;
	};

	get visible () {
		return this._node.style.display != "none";
	};

	set visible ( vis ) {
		this._node.style.display = vis ? "" : "none";
	};

	update () {
		;
	};

	handleEvent ( evt ) {
		;
	};

	appendChild ( child ) {
		if ( child instanceof VGTComponent ) {
			this._node.appendChild( child.node );
		} else {
			this._node.appendChild( child );
		}
	};

	dispatchEvent ( event, init ) {

		if ( typeof( event ) == "string" ) {
			console.warn("yay");
			return super.dispatchEvent( new VGTEvent( event, init ) );
		}

		if ( !( event instanceof VGTEvent ) ) {
			console.warn( "Event is not a VGTEvent", event );
		}

		return super.dispatchEvent( event );
	};

}

export { VGTComponent };

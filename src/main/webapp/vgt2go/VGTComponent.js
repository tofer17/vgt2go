/**
 *
 */
class VGTComponent extends EventTarget {
	constructor ( tagName, id, ...classes ) {
		super();
		Object.defineProperty( this, "_node", {
			value : tagName ? document.createElement( tagName ) : null
		});
		Object.defineProperty( this, "listeners", { value : {} } );

		if ( this._node && id ) {
			this._node.id = id;
		}

		if ( this._node ) {
			this._node.classList.add( ...classes );
		}
	};

	init () {
		;
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

}

export { VGTComponent };
/**
 *
 */
class VGTComponent extends EventTarget {
	constructor ( tagName, id, ...classes ) {
		super();
		Object.defineProperty( this, "node", { value : tagName ? document.createElement( tagName ) : null } );
		Object.defineProperty( this, "listeners", { value : {} } );

		if ( this.node && id ) {
			this.node.id = id;
		}

		if ( this.node ) {
			this.node.classList.add( ...classes );
		}
	};

	get node () {
		return this.node;
	};

	get visible () {
		return this.node.style.display != "none";
	};

	set visible ( vis ) {
		this.node.style.display = vis ? "" : "none";
	};

	update () {
		if ( super.update ) {
			super.update();
		}
	};

	handleEvent ( evt ) {
		if ( super.handleEvent ) {
			super.handleEvent( evt );
		}
	};

}

export { VGTComponent };
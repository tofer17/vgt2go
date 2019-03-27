/**
 *
 */

import { VGTComponent } from "./VGTComponent.js"

class VGTTable extends VGTComponent {
	constructor () {
		super( "div", "vgttable" );
		this.activePlayer;
	};

	init () {
		super.init();
		this.activePlayer = document.createElement( "div" );
		this.activePlayer.innerHTML = "?";
		this.node.appendChild( this.activePlayer );
	};

	update () {
		super.update();
	};
}

export { VGTTable };

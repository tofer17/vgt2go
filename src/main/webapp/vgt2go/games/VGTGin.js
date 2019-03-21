/**
 *
 */

import { VGTComponent } from "../VGTComponent.js";

function launch ( app ) {
	console.log("hi");
	return new VGTGin( app );
}

class VGTGin extends VGTComponent {
	constructor ( app ) {
		super( "div", "game", "vgtgamegin" );

		this.node.innerHTML = "GIN Game";
	}
}

export { launch };
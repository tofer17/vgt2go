/**
 *
 */

import { VGTGin } from "./VGTGin.js";
import { VGTPlayer } from "../VGTPlayer.js";


class VGTGinTest extends VGTGin {
	constructor ( app ) {
		super( app );
	};

	init () {
		super.init();

		this.addPlayer( new VGTPlayer( this, "cm", "1" ) );
		this.addPlayer( new VGTPlayer( this, "dm", "2" ) );
		this.addPlayer( new VGTPlayer( this, "am", "3" ) );
		
		if ( 1 == 1 ) {
			this.deck.deal(20);
		}
	};

}

function launch ( app ) {
	return new VGTGinTest( app );
}

export { launch };

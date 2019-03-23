/**
 *
 */

import { VGTGame } from "./VGTGame.js";

class VGTGin extends VGTGame {
	constructor ( app ) {
		super( app, "Gin" );

		this.gameOpts.opts.ace = {
			id : "aces",
			text : "Aces",
			type : "select",
			value : 1,
			opts : [ "start", "start/end", "end", "modulo" ]
		};

		this.gameOpts.opts.jokers = {
			id : "jokers",
			text : "Jokers",
			type : "radio",
			value : 0,
			opts : [ "removed", "wild" ]
		};

		this.gameOpts.opts.deal = {
			id : "deal",
			text : "Deal",
			type : "select",
			value : 0,
			opts : [ "11 cards", "10 cards" ]
		};

		this.gameOpts.opts.first = {
			id : "first",
			text : "First",
			type : "player-select",
			value : 0
		};

		this.gameOpts.opts.minplayers.opts = [ 2, 5 ];
		this.gameOpts.opts.minplayers.value = 3;

		this.gameOpts.opts.maxplayers.opts = [ 2, 5 ];
		this.gameOpts.opts.maxplayers.value = 5;

		//this.init();

	};

	init () {
		super.init();

		this.gameOpts.opts.minplayers.visible = false;
		this.gameOpts.opts.maxplayers.visible = false;
	}

	start () {
		super.start();
		console.log("START!");
		this.node.appendChild( document.createTextNode( "TABLE" ) );
	};

}

function launch ( app ) {
	return new VGTGin( app );
}

export { launch };

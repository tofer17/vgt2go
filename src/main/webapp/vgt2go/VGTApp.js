/**
 * List games to create and resume.
 * Create that game or load it.
 *
 */
import { VGTComponent } from "./VGTComponent.js";
import { VGTGameSelector } from "./VGTGameSelector.js";

class VGTApp extends VGTComponent {
	constructor () {
		super( "div", "vgtapp" );

		this.newGames = [];
		this.game = null;

		this.gameSelector = null;
		this.gameDiv = null;

		document.body.appendChild( this.node );
	};

	init () {
		super.init();

		this.gameSelector = new VGTGameSelector( this );
		this.gameSelector.addEventListener( "newgame", this, false );
		this.gameSelector.addEventListener( "resumegame", this, false );

		this.gameDiv = new VGTComponent( "div", "vgtgamediv" );

		this.appendChild( this.gameSelector );
		this.appendChild( this.gameDiv );
	};

	launchGame ( game ) {
		this.gameSelector.visible = false;
		this.game = game.launch( this );
		this.gameDiv.node.innerHTML = "";
		this.gameDiv.appendChild( this.game );
		this.game.setup();
	};

	handleEvent ( event ) {
		if ( event.type == "newgame" ) {
			const game = event.game;
			window.importGame(  game.importURI ).then( ( game ) => { this.launchGame( game ); } );
		} else if ( event.type == "resumegame" ) {
			console.error( "FIXME" );
		}
	};
}

export { VGTApp };

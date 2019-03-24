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
		document.body.appendChild( this.node );

		this.newGames = [];
		this.game = null;

		this.gameSelector = new VGTGameSelector( this );
		this.gameSelector.addEventListener( "newgame", this, false );
		this.gameSelector.addEventListener( "resumegame", this, false );
		this.node.appendChild( this.gameSelector.node );

		this.gameDiv = document.createElement( "div" );
		this.node.appendChild( this.gameDiv );

	};

	launchGame ( game ) {
		this.gameSelector.visible = false;
		this.game = game.launch( this );
		this.gameDiv.innerHTML = "";
		this.gameDiv.appendChild( this.game.node );
		this.game.setup();
	};

	handleEvent ( event ) {
		if ( event.type == "newgame" ) {
			const game = event.game;
			window.importGame(  game.importURI ).then( (game) => { this.launchGame( game ); } );
		} else if ( event.type == "resumegame" ) {
			console.error( "FIXME" );
		}
	};
}

export { VGTApp };

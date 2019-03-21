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
		this.node.appendChild( this.gameSelector.node );

		this.gameDiv = document.createElement( "div" );
		this.node.appendChild( this.gameDiv );

	};

	launchGame ( game ) {
		this.gameSelector.visible = false;
		this.game = game.launch();
		this.gameDiv.innerHTML = "";
		this.gameDiv.appendChild( this.game.node );
	};

	handleEvent ( event ) {
		console.log(event );
		if ( event.target.newGame ) {
			const game = event.target.newGame;
			window.importGame(  game.importURI ).then( (game) => { this.launchGame( game ); } );
		}
	};
}

export { VGTApp };

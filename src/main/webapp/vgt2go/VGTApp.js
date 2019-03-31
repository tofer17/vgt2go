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

		window.history.replaceState( "vgt2go>main", null, null );

		const vgtTitle = document.createElement( "h1" );
		vgtTitle.appendChild( document.createTextNode ( "VGT 2 Go" ) );

		const vgtVersion = document.createElement( "div" );
		vgtVersion.id = "vgtversion";
		vgtVersion.appendChild( document.createTextNode( "v 0.0.1" ) );

		this.gameSelector = new VGTGameSelector( this );
		this.gameSelector.addEventListener( "newgame", this, false );
		this.gameSelector.addEventListener( "resumegame", this, false );

		this.gameDiv = new VGTComponent( "div", "vgtgamediv" );

		this.appendChild( vgtTitle );
		this.appendChild( this.gameSelector );
		this.appendChild( this.gameDiv );
		this.appendChild( vgtVersion );

		window.addEventListener( "popstate", this, false );
	};

	launchGame ( game ) {
		this.gameSelector.visible = false;

		window.history.pushState( "vgt2go>main>game", null, null );

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
		} else if ( event.type == "popstate" ){
			console.log( window.history.state );
		}
	};
}

export { VGTApp };

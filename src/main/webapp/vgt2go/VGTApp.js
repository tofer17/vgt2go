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

		this.title = null;
		this.gameSelector = null;
		this.gameDiv = null;

		document.body.appendChild( this.node );
	};

	init () {
		super.init();

		window.history.replaceState( "vgt2go>main", null, null );

		this.title = document.createElement( "h1" );
		this.title.appendChild( document.createTextNode ( "VGT 2 Go" ) );

		this.vgtVersion = document.createElement( "div" );
		this.vgtVersion.id = "vgtversion";
		this.vgtVersion.appendChild( document.createTextNode( "v 0.0.1" ) );

		this.gameSelector = new VGTGameSelector( this );
		this.gameSelector.addEventListener( "newgame", this, false );
		this.gameSelector.addEventListener( "resumegame", this, false );

		this.gameDiv = new VGTComponent( "div", "vgtgamediv" );

		this.appendChild( this.title );
		this.appendChild( this.gameSelector );
		this.appendChild( this.gameDiv );
		this.appendChild( this.vgtVersion );

		window.addEventListener( "popstate", this, false );
	};

	launchGame ( game ) {
		this.gameSelector.visible = false;
		this.vgtVersion.style.display = "none";

		window.history.pushState( "vgt2go>main>game", null, null );

		this.game = game.launch( this );
		this.gameDiv.node.innerHTML = "";
		this.gameDiv.appendChild( this.game );

		this.game.setup();
	};

	set gameTitle ( gameTitle ) {
		this.title.innerHTML = "VGT 2 Go : " + gameTitle;
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

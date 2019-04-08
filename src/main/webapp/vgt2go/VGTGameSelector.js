import { VGTComponent } from "./VGTComponent.js";
import { AVAILABLE_GAMES } from "./games/Available.js";
import { VGTEvent } from "./VGTEvent.js";

/**
*
*/

/*
 * Displays:
 * * Gin                                          // click = new
 *   o New...                                     // click = new
 *   o Resume: Created 3/21/2019 4:30 pm [delete] // click = resume, [delete] = delete
 * * UNO
 *   o New...

 */

class VGTGameSelectorEvent extends VGTEvent {
	constructor ( type, game ) {
		super( type, { detail : game } );
		Object.defineProperty( this, "game", { value : game } );
	};
}

class VGTGameSelector extends VGTComponent {
	constructor () {
		super( "div", "vgtgameselector" );

		this.selectedGame = null;
	};

	init () {
		super.init();

		// TODO: stub... init() should query local storage
		const newGames = window.importGame( "./vgt2go/games/Available.js" );
		const oldGames = newGames;
		Promise.all( [ newGames, oldGames ] ).then( this.postInit.bind( this ) );
	};

	postInit ( x ) {
		const ul = document.createElement( "ul" );

		for ( let game of AVAILABLE_GAMES ) {
			const li = document.createElement( "li" );
			li.addEventListener( "click", this, false );
			li.id = game.id;
			li.classList.add( "vgtnewgame" );
			li.innerHTML = game.text;
			li.newGame = game;

			ul.appendChild( li );
		}


		const gsTitle = document.createElement( "h2" );
		gsTitle.appendChild( document.createTextNode( "Available Games" ) );

		this.appendChild( gsTitle );
		this.appendChild( ul );
	};

	handleEvent ( event ) {

		let evt = null;

		if ( event.target.newGame ) {
			evt = new VGTGameSelectorEvent( "newgame", event.target.newGame );
			this.selectedGame = event.target.newGame;
		} else if ( event.target.resumeGame ) {
			evt = new VGTGameSelectorEvent( "resumegame", event.target.resumeGame );
			this.selectedGame = event.target.resumeGame;
		}

		if ( evt != null ) {
			this.dispatchEvent( evt );
		}
	};
}

export { VGTGameSelector, VGTGameSelectorEvent };

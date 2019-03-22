/**
 *
 */
import { VGTComponent } from "./VGTComponent.js";
import { AVAILABLE_GAMES } from "./games/Available.js";

/*
 * Displays:
 * * Gin                                          // click = new
 *   o New...                                     // click = new
 *   o Resume: Created 3/21/2019 4:30 pm [delete] // click = resume, [delete] = delete
 * * UNO
 *   o New...

 */
class VGTGameSelector extends VGTComponent {
	constructor () {
		super( "div", "vgtgameselector" );

		this.node.appendChild( document.createTextNode( "Available Games" ) );

		const ul = document.createElement( "ul" );
		this.node.appendChild( ul );
		this.selectedGame = null;

		for ( let game of AVAILABLE_GAMES ) {
			const li = document.createElement( "li" );
			li.addEventListener( "click", this, false );
			li.id = game.id;
			li.classList.add( "vgtnewgame" );
			li.innerHTML = game.text;
			li.newGame = game;

			ul.appendChild( li );
		}
	};

	handleEvent ( event ) {

		let evt = null;

		if ( event.target.newGame ) {
			evt = new Event( "newgame" );
			evt.game = event.target.newGame;
			this.selectedGame = event.target.newGame;
		} else if ( event.target.resumeGame ) {
			evt = new Event( "resumegame" );
			evt.game = event.target.resumeGame;
			this.selectedGame = event.target.resumeGame;
		}

		if ( evt != null ) {
			this.dispatchEvent( evt );
		}
	};
}

export { VGTGameSelector };

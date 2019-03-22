/**
 *
 */
import { VGTComponent } from "./VGTComponent.js";

class VGTStartControls extends VGTComponent {
	constructor ( game ) {
		super( "div", "vgtstartcontrols" );

		this.game = game;

		this.previousPlayer = document.createElement( "button" );
		this.previousPlayer.innerHTML = "Previous Player";
		this.previousPlayer.addEventListener( "click", this, false );
		this.node.appendChild( this.previousPlayer );

		this.nextPlayer = document.createElement( "button" );
		this.nextPlayer.innerHTML = "Next Player";
		this.nextPlayer.addEventListener( "click", this, false );
		this.node.appendChild( this.nextPlayer );

		this.startGame = document.createElement( "button" );
		this.startGame.innerHTML = "Start";
		this.startGame.addEventListener( "click", this, false );
		this.node.appendChild( this.startGame );

		this.cancelGame = document.createElement( "button" );
		this.cancelGame.innerHTML = "Cancel";
		this.cancelGame.addEventListener( "click", this, false );
		this.node.appendChild( this.cancelGame );
	};

	handleEvent ( event ) {

		let evt = null;

		if ( event.target == this.previousPlayer ) {
			evt = new Event( "previous" );
		} else if ( event.target == this.nextPlayer ) {
			evt = new Event( "next" );
		} else if ( event.target == this.startGame ) {
			evt = new Event( "start" );
		} else if ( event.target == this.cancelGame ) {
			evt = new Event( "cancel" );
		}

		if ( evt != null ) {
			this.dispatchEvent( evt );
		}
	}
}

export { VGTStartControls };
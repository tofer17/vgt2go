/**
 *
 */
import { VGTComponent } from "./VGTComponent.js";

class VGTStartControls extends VGTComponent {
	constructor ( game ) {
		super( "div", "vgtstartcontrols" );

		this.game = game;
	};

	init () {
		super.init();

		this.previousPlayer = document.createElement( "button" );
		this.previousPlayer.innerHTML = "Previous Player";
		this.previousPlayer.addEventListener( "click", this, false );
		Object.defineProperty( this.previousPlayer, "enabled", {
			get () { return !this.disabled },
			set ( enabled ) { this.disabled = !enabled; }
		});
		this.node.appendChild( this.previousPlayer );

		this.nextPlayer = document.createElement( "button" );
		this.nextPlayer.innerHTML = "Next Player";
		this.nextPlayer.addEventListener( "click", this, false );
		Object.defineProperty( this.nextPlayer, "enabled", {
			get () { return !this.disabled },
			set ( enabled ) { this.disabled = !enabled; }
		});
		this.node.appendChild( this.nextPlayer );

		this.startGame = document.createElement( "button" );
		this.startGame.id = "startGame";
		this.startGame.innerHTML = "Start";
		this.startGame.addEventListener( "click", this, false );
		Object.defineProperty( this.startGame, "enabled", {
			get () { return !this.disabled },
			set ( enabled ) { this.disabled = !enabled; }
		});
		this.node.appendChild( this.startGame );

		this.cancelGame = document.createElement( "button" );
		this.cancelGame.innerHTML = "Cancel";
		this.cancelGame.addEventListener( "click", this, false );
		Object.defineProperty( this.cancelGame, "enabled", {
			get () { return !this.disabled },
			set ( enabled ) { this.disabled = !enabled; }
		});
		this.node.appendChild( this.cancelGame );

		this.deletePlayer = document.createElement( "button" );
		this.deletePlayer.innerHTML = "Delete";
		this.deletePlayer.addEventListener( "click", this, false );
		Object.defineProperty( this.deletePlayer, "enabled", {
			get () { return !this.disabled },
			set ( enabled ) { this.disabled = !enabled; }
		});
		this.node.appendChild( this.deletePlayer );
		this.deletePlayer	};

	update () {
		//const piOk = this.game.playerInfo.isValid;

		const piOk = this.game.currentPlayer.name.length > 0 && this.game.currentPlayer.pin.length > 0;
		this.previousPlayer.enabled = piOk && this.game.players.length > 1;
		this.nextPlayer.enabled = piOk && this.game.currentPlayerIndex <= this.game.gameOpts.opts.maxPlayers.value;
		this.startGame.enabled = piOk && this.game.players.length >= this.game.gameOpts.opts.minPlayers.value;
		this.deletePlayer.enabled = this.game.currentPlayerIndex != 0;

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
		} else if ( event.target == this.deletePlayer ) {
			console.log("ggg");
			evt = new Event( "delete" );
		}

		if ( evt != null ) {
			this.dispatchEvent( evt );
		}
	}
}

export { VGTStartControls };
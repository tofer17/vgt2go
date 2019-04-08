import { VGTComponent } from "./VGTComponent.js";
import { VGTEvent } from "./VGTEvent.js";

/**
*
*/

class VGTStartControlsEvent extends VGTEvent {
	constructor ( type ) {
		super( type );
	};
}

class VGTStartControls extends VGTComponent {
	constructor ( game ) {
		super( "div", "vgtstartcontrols" );

		this.game = game;

		this.previousPlayer = null;
		this.nextPlayer = null;
		this.startGame = null;
		this.cancelGame = null;
		this.deletePlayer = null;
	};

	init () {
		super.init();

		this.previousPlayer = document.createElement( "button" );
		this.previousPlayer.id = "vgtstcopp";
		this.previousPlayer.innerHTML = "Previous Player";
		Object.defineProperty( this.previousPlayer, "enabled", {
			get () { return !this.disabled },
			set ( enabled ) { this.disabled = !enabled; }
		});

		this.nextPlayer = document.createElement( "button" );
		this.nextPlayer.id = "vgtstconp";
		this.nextPlayer.innerHTML = "Next Player";
		Object.defineProperty( this.nextPlayer, "enabled", {
			get () { return !this.disabled },
			set ( enabled ) { this.disabled = !enabled; }
		});

		this.startGame = document.createElement( "button" );
		this.startGame.id = "vgtstcosg";
		this.startGame.innerHTML = "Start";
		Object.defineProperty( this.startGame, "enabled", {
			get () { return !this.disabled },
			set ( enabled ) { this.disabled = !enabled; }
		});

		this.cancelGame = document.createElement( "button" );
		this.cancelGame.id = "vgtstcocg";
		this.cancelGame.innerHTML = "Cancel";
		Object.defineProperty( this.cancelGame, "enabled", {
			get () { return !this.disabled },
			set ( enabled ) { this.disabled = !enabled; }
		});

		this.deletePlayer = document.createElement( "button" );
		this.deletePlayer.id = "vgtstcodp";
		this.deletePlayer.innerHTML = "Delete";
		Object.defineProperty( this.deletePlayer, "enabled", {
			get () { return !this.disabled },
			set ( enabled ) { this.disabled = !enabled; }
		});


		this.appendChild( this.previousPlayer );
		this.appendChild( this.nextPlayer );
		this.appendChild( this.startGame );
		this.appendChild( this.cancelGame );
		this.appendChild( this.deletePlayer );

		this.previousPlayer.addEventListener( "click", this, false );
		this.nextPlayer.addEventListener( "click", this, false );
		this.startGame.addEventListener( "click", this, false );
		this.cancelGame.addEventListener( "click", this, false );
		this.deletePlayer.addEventListener( "click", this, false );

	};

	update () {

		const piOk = this.game.currentPlayer.name.length > 0 && this.game.currentPlayer.pin.length > 0;

		this.previousPlayer.enabled = piOk && this.game.players.length > 1;
		this.nextPlayer.enabled = piOk && this.game.currentPlayerIndex <= this.game.gameProps.rules.maxPlayers.value;
		this.startGame.enabled = piOk && this.game.players.length >= this.game.gameProps.rules.minPlayers.value;
		this.deletePlayer.enabled = this.game.currentPlayerIndex != 0;

	};

	handleEvent ( event ) {

		let evt = null;

		if ( event.target == this.previousPlayer ) {
			evt = new VGTStartControlsEvent( "previous" );
		} else if ( event.target == this.nextPlayer ) {
			evt = new VGTStartControlsEvent( "next" );
		} else if ( event.target == this.startGame ) {
			evt = new VGTStartControlsEvent( "start" );
		} else if ( event.target == this.cancelGame ) {
			evt = new VGTStartControlsEvent( "cancel" );
		} else if ( event.target == this.deletePlayer ) {
			evt = new VGTStartControlsEvent( "delete" );
		}

		if ( evt != null ) {
			this.dispatchEvent( evt );
		}
	}
}

export { VGTStartControls, VGTStartControlsEvent };

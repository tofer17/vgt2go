/**
 *
 */
import { VGTComponent } from "./VGTComponent.js";

class VGTStartControls extends VGTComponent {
	constructor ( game ) {
		super( "div", "vgtstartcontrols" );

		this.game = game;

		const btn1 = document.createElement( "button" );
		btn1.innerHTML = "Previous Player";
		btn1.addEventListener( "click", this, false );
		Object.defineProperty( btn1, "enabled", {
			get () { return !btn1.disabled },
			set ( enabled ) { btn1.disabled = !enabled; }
		});
		this.node.appendChild( btn1 );
		this.previousPlayer = btn1;

		const btn2 = document.createElement( "button" );
		btn2.innerHTML = "Next Player";
		btn2.addEventListener( "click", this, false );
		Object.defineProperty( btn2, "enabled", {
			get () { return !btn2.disabled },
			set ( enabled ) { btn2.disabled = !enabled; }
		});
		this.node.appendChild( btn2 );
		this.nextPlayer = btn2;

		const btn3 = document.createElement( "button" );
		btn3.innerHTML = "Start";
		btn3.addEventListener( "click", this, false );
		Object.defineProperty( btn3, "enabled", {
			get () { return !btn3.disabled },
			set ( enabled ) { btn3.disabled = !enabled; }
		});
		this.node.appendChild( btn3 );
		this.startGame = btn3;

		const btn4 = document.createElement( "button" );
		btn4.innerHTML = "Cancel";
		btn4.addEventListener( "click", this, false );
		Object.defineProperty( btn4, "enabled", {
			get () { return !btn4.disabled },
			set ( enabled ) { btn4.disabled = !enabled; }
		});
		this.node.appendChild( btn4 );
		this.cancelGame = btn4;
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
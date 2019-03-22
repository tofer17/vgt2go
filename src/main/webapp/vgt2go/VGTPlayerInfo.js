/**
 *
 */
import { VGTComponent } from "./VGTComponent.js";

class VGTPlayerInfo extends VGTComponent {
	constructor () {
		super( "div", "vgtplayerinfo" );

		this.player = null;

		let label;

		label = document.createElement( "label" );
		label.htmlFor = "vgtpiname";
		label.innerHTML = "Name: ";
		this.node.appendChild( label );

		this.name = document.createElement( "input" );
		this.name.id = "vgtpiname";
		this.name.addEventListener( "keyup", this, false );
		this.node.appendChild( this.name );

		label = document.createElement( "label" );
		label.htmlFor = "vgtpipin";
		label.innerHTML = "PIN: ";
		this.node.appendChild( label );

		this.pin = document.createElement( "input" );
		this.pin.id = "vgtpipin";
		this.pin.addEventListener( "keyup", this, false );
		this.node.appendChild( this.pin );
	};

	get enabled () {
		return (!this.name.disabled) && (!this.pin.disabled);
	};

	set enabled ( enabled ) {
		this.name.disabled = !enabled;
		this.pin.disabled = !enabled;
	};

	setPlayer ( player ) {
		this.player = player;
		this.update();
	};

	update () {
		this.name.value = this.player != null ? this.player.name : "";
		this.pin.value = this.player != null ? this.player.pin : "";
	};

	handleEvent ( event ) {

		let evt = null;

		if ( event.target == this.name ) {
			this.player.name = event.target.value;
			evt = new Event( "change" );
		} else if ( event.target == this.pin ) {
			this.player.pin = event.target.value;
			evt = new Event( "change" );
		}

		if ( evt != null ) {
			this.dispatchEvent( evt );
		}
	};

}

export { VGTPlayerInfo };
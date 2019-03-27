/**
 *
 */
import { VGTComponent } from "./VGTComponent.js";
import { VGTPINPad } from "./VGTPINPad.js";

class VGTAvatarMaker extends VGTComponent {
	constructor () {
		super( "div" );
	};

	init () {
		this.node.innerHTML = "VGT Avatar Maker";
	};
}

class VGTPlayer extends VGTComponent {
	constructor ( name, pin ) {
		super( "div" );

		this._node.id = "vgtplayer-" + this._hashCode;

		this.name = name;
		this.pin = pin;
		this.avatar = null;
	};

	init () {
		super.init();

		this.nameInput = document.createElement( "input" );
		this.nameInput.minlength = 1;
		this.nameInput.placeHolder = "Enter name or initials...";

		this.pinPad = new VGTPINPad();

		this.avatarMaker = new VGTAvatarMaker( this );

		const nameLbl = document.createElement( "label" );
		nameLbl.htmlFor = this.node.id;
		nameLbl.appendChild( document.createTextNode( "Name" ) );

		this.appendChild( nameLbl );
		this.appendChild( this.nameInput );
		this.appendChild( this.pinPad );
		this.appendChild( this.avatarMaker );

		this.pinPad.setSmall( true );
		this.pinPad.visible = true;

		this.nameInput.addEventListener( "keyup", this, false );
		this.pinPad.addEventListener( "done", this, false );
		this.avatarMaker.addEventListener( "?", this, false );
	};

	handleEvent ( event ) {
		if ( event.type == "keyup" ) {
			this.name = this.nameInput.value;
		} else if ( event.type == "done" ) {
			this.pin = this.pinPad.entry;
			this.pinPad.setSmall( true );
		}

		this.dispatchEvent( new Event( "change" ) );
	};
}

export { VGTPlayer };

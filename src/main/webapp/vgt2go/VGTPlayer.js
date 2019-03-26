/**
 *
 */
import { VGTComponent } from "./VGTComponent.js";
import { VGTPINPad } from "./VGTPINPad.js";

function * PlayerIds () {
	var id = 0;
	while ( id < id + 1 ) {
		yield id++;
	}
}

function uuidv4 () {
	return ( [1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		(c ^ window.crypto.getRandomValues( new Uint8Array(1) )[ 0 ] & 15 >> c / 4 )
		.toString( 16 ) );
}

const playerIds = PlayerIds();

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

		Object.defineProperty( this, "id", { value : playerIds.next().value } );
		this._node.id = "vgtplayer-" + this.id;

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

		this.node.appendChild( nameLbl );
		this.node.appendChild( this.nameInput );
		this.node.appendChild( this.pinPad.node );
		this.node.appendChild( this.avatarMaker.node );

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
			//console.log("pin is " + this.pin);
			this.pinPad.setSmall( true );
		}

		this.dispatchEvent( new Event( "change" ) );
	};
}

export { VGTPlayer };
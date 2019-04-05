/**
 *
 */
import { VGTComponent } from "./VGTComponent.js";
import { VGTPINPad } from "./VGTPINPad.js";
import { VGTEvent } from "./VGTEvent.js";


class VGTPlayerEvent extends VGTEvent {
	constructor ( type ) {
		super( type );
	};
}

class VGTAvatarMaker extends VGTComponent {
	constructor () {
		super( "div" );
	};

	init () {
		//super.init();
		this.node.classList.add( "vgtavatarmaker" );
		this.node.innerHTML = "VGT Avatar Maker";
	};
}

class VGTPlayer extends VGTComponent {
	constructor ( game, name, pin ) {
		super( "div", null, "vgtplayer" );

		this._node.id = "vgtplayer-" + this._hashCode;

		this.meta = {
			playerIndex : {},
			outOf : {},
			max : {}
		};

		this.game = game;
		this.name = name;
		this.pin = pin;
		this.avatar = null;
	};

	init () {
		super.init();

		this.game.addEventListener( "player", this, false );
		this.game.gameProps.addEventListener( "change", this, false );

		const row1 = document.createElement( "div" );
		row1.classList.add( "vgtplayermetarow" );

		this.meta.playerIndex = document.createElement( "span" );
		this.meta.playerIndex.classList.add( "vgtplayermetan" );
		this.meta.playerIndex.innerHTML = this.meta.n;
		row1.appendChild( this.meta.playerIndex );

		row1.appendChild( document.createTextNode( "/" ) );

		this.meta.outOf = document.createElement( "span" );
		this.meta.outOf.classList.add( "vgtplayermetaoo" );
		this.meta.outOf.innerHTML = this.meta.oo;
		row1.appendChild( this.meta.outOf );

		row1.appendChild( document.createTextNode( "(min" ) );

		this.meta.max = document.createElement( "span" );
		this.meta.max.classList.add( "vgtplayermetam" );
		this.meta.max.innerHTML = this.meta.m;
		row1.appendChild( this.meta.max );

		row1.appendChild( document.createTextNode( "max)" ) );

		const row2 = document.createElement( "div" );
		row2.classList.add( "vgtplayerrow" );

		this.nameInput = document.createElement( "input" );
		this.nameInput.minlength = 1;
		this.nameInput.value = this.name;
		this.nameInput.placeholder = "Enter name or initials...";

		this.pinPad = new VGTPINPad();
		this.pinPad.entry = this.pin;

		this.avatarMaker = new VGTAvatarMaker( this );
		this.avatarMaker.img = this.avatar;

		row2.appendChild( this.avatarMaker.node );
		row2.appendChild( this.nameInput );
		row2.appendChild( this.pinPad.node );

		this.appendChild( row1 );
		this.appendChild( row2 );

		this.pinPad.setSmall( true );
		this.pinPad.visible = true;

		this.nameInput.addEventListener( "keyup", this, false );
		this.pinPad.addEventListener( "raise", this, false );
		this.pinPad.addEventListener( "lower", this, false );
		this.pinPad.addEventListener( "done", this, false );
		this.avatarMaker.addEventListener( "?", this, false );

		this.update();
	};

	update () {
		super.update();
		this.meta.playerIndex.innerHTML = this.game.currentPlayerIndex + 1;
		this.meta.outOf.innerHTML = this.game.getPlayers().length;
		this.meta.max.innerHTML = this.game.gameProps.rules.minPlayers.value + "/" + this.game.gameProps.rules.maxPlayers.value;
	};

	addEventListener ( type, listener, useCapture ) {
		if ( type == "raise" || type == "lower" ) {
			this.pinPad.addEventListener( type, listener, useCapture );
		} else {
			super.addEventListener( type, listener, useCapture );
		}
	};

	handleEvent ( event ) {
		if ( event.type == "keyup" ) {
			this.name = this.nameInput.value;
			this.pinPad.setTitle( this.name );
		} else if ( event.type == "done" ) {
			this.pin = this.pinPad.entry;
			this.pinPad.setSmall( true );
		} else if ( event.type == "raise" ) {
			this.nameInput.style.display = "none";
			this.avatarMaker.visible = false;
		} else if ( event.type == "lower" ) {
			this.nameInput.style.display = "initial";
			this.avatarMaker.visible = true;
		}

		this.update();

		if ( event.target != this.game && event.type != "raise" && event.type != "lower" ) {
			this.dispatchEvent( new VGTPlayerEvent( "change" ) );
		}
	};
}


export { VGTPlayer, VGTPlayerEvent };

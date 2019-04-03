/**
 *
 */

import { VGTComponent } from "./VGTComponent.js";
import { VGTEvent } from "./VGTEvent.js";

class VGTGameOptsEvent extends VGTEvent {
	constructor ( type, opt ) {
		super( type );
		Object.defineProperty( this, "gameOpt", { value : opt } );
	};
}

class VGTRule extends VGTComponent {
	constructor ( id, type, value ) {
		super( "div", id, "vgtrule" );

		Object.defineProperty( this, "id", { value : id } );
		Object.defineProperty( this, "type", { value : type } );

		this._value = value;
		this.valueNode = null;

		this.titleDiv = document.createElement( "label" );
		this.textDiv = document.createElement( "div" );

		this._opts = [];

	};

	get title () {
		return this.titleDiv.innerHTML;
	};

	set title ( title ) {
		this.titleDiv.innerHTML = title;
	};

	withTitle ( title ) {
		this.title = title;
		return this;
	};

	get text () {
		return this.textDiv.innerHTML;
	};

	set text ( text ) {
		this.textDiv.innerHTML = text;
	};

	withText ( text ) {
		this.text = text;
		return this;
	};

	get value () {
		return this._value;
	};

	set value ( newValue ) {
		const oldValue = this._value;
		this._value = newValue;
		this.dispatchEvent( new VGTRuleEvent( "change", "value", oldValue, newValue ) );
	};

	withValue ( value ) {
		this._value = value;
		return this;
	};

	get opts () {
		return this._opts;
	};

	set opts ( opts ) {
		this._opts = opts;
	};

	withOpts ( ...opts ) {

		for ( let opt of opts ) {
			if ( opt instanceof Array ) {
				this.withOpts( ...opt );
			} else {
				this._opts.push( opt );
			}
		}

		return this;
	};

	withOpt ( ...opts ) {
		return this.withOpts( ...opts );
	};

	get enabled () {
		return !this.valueNode.disabled;
	};

	set enabled ( enabled ) {
		this.valueNode.disabled = !enabled;
	};

	withEnabled ( enabled ) {
		this.valueNode.disabled = !enabled;
		return this;
	};

	/* [ TITLE ] [ ....... ] */
	init () {
		super.init();

		this.titleDiv.classList.add( "vgtruletitle" );
		this.valueDiv.classList.add( "vgtrulevalue" );

		this.titleDiv.htmlFor = this.valueNode.id;
		this.valueDiv.appendChild( this.valueNode );

		this.appendChild( this.titleDiv );
		this.appendChild( this.valueDiv );

		this.update();
	};

	handleEvent ( event ) {
// FIXME: This ain't gonn'a work
		if ( event.target.type == "select" ) {
			this.value = this.valueNode.selectedIndex;
		} else {
			this.value = this.valueNode.value;
		}
	};

}


class VGTRuleNumber extends VGTGameRule {
	constructor ( id, value ) {
		super( id, "number", value );
	};

	init () {

		this.valueNode = document.createElement( "input" );
		this.valueNode.id = "vgtrulenumber-" + this._hashCode;
		this.valueNode.classList.add( "vgtrulenumber" );
		this.valueNode.type = "number";

		this.valueNode.addEventListener( "keyup", this, false );

		super.init();
	};

	update () {
		super.update();

		this.valueDiv.min = this._opts[0] != null ? this._opts[0] : "";
		this.valueDiv.max = this._opts[1] != null ? this._opts[1] : "";
		this.valueDiv.step = this._opts[2] != null ? this._opts[2] : "";

		this.valueDiv.value = this._value;
	};
}

class VGTRuleSelect extends VGTGameRule {
	constructor( id, value ) {
		super( id, "select", value );
	};

	init () {

		this.valueNode = document.createElement( "select" );
		this.valueNode.id = "vgtruleselect-" + this._hashCode;
		this.valueNode.classList.add( "vgtruleselect" );

		for ( let opt of this.opts ) {
			const option = document.createElement("option");
			option.innerHTML = opt;
			this.valueDiv.appendChild( option );
		}

		this.valueDiv.addEventListener( "change", this, false );

		super.init();
	};

	update () {
		this.valueDiv.selectedIndex = this._value;
	};
}

class VGTRuleRadio extends VGTGameRule {
	constructor( id, value ) {
		super( id, "radio", value );
	};

	init () {
		this.valueNode = {};




		super.init();
	}
}

class VGTRulePlayerSelect extends VGTGameRule {
	constructor ( id, value ) {
		super( id, "player-select", value );
	};
}

// this.rules.minPlayers = new VGTGameRuleNumber( "minplayers" )
//	.withTitle("Minimum Player")
//	.withText("Minimum players can be set to be between 2 and 5")
//	.withValue( 2 )
//	.withOpts( 0, null )

class VGTGameRules extends VGTComponent {
	constructor ( game ) {
		super( "div", null, "vgtgameopts" );

		this.game = game;
		this.opts = {};

		this.opts.minPlayers = {
			id : "minplayers",
			text : "Minimum Players",
			type : "number",
			value : 2,
			opts : [ 0, null ]
		};

		this.opts.maxPlayers = {
			id : "maxplayers",
			text : "Maximum Players",
			type : "number",
			value : 5,
			opts : [ 0, null ]
		};

//		this.opts.selTest = {
//			id : "sletest",
//			text : "SelTest",
//			type : "select",
//			value : 1,
//			opts : [ "one", "two", "three", "four" ]
//		};
//
//		this.opts.radTest = {
//			id : "radtest",
//			text : "RadTest",
//			type : "radio",
//			value : 1,
//			opts : [ "a", "b", "c", "d" ]
//		};

		this.opts.seating = {
			id : "seating",
			text : "Seating",
			type : "player-select",
			value : 0
		};
	};

	set enabled ( enabled ) {
		for ( let optKey in this.opts ) {
			this.opts[ optKey ].enabled = enabled;
		}
	};

	makeOpt ( opt ) {
		const node = document.createElement( "div" );
		opt.node = node;
		node.classList.add( "vgtgameopt" );

		// Option title
		const label = document.createElement( "label" );
		label.htmlFor = opt.id;
		label.innerHTML = opt.text;
		label.classList.add( "vgtgameoptlabel" );
		node.appendChild( label );

		// Option input
		if ( opt.type == "select" ) {

			const sel = document.createElement( "select" );
			sel.id = opt.id;
			sel.addEventListener( "change", this, false );
			sel.gameOpt = opt;

			for ( let i = 0; i < opt.opts.length; i++ ) {
				const selopt = document.createElement( "option" );
				selopt.innerHTML = opt.opts[i];
				selopt.value = i;
				sel.appendChild( selopt );
			}

			sel.selectedIndex = opt.value;

			Object.defineProperty( opt, "enabled", {
				get () { return !sel.disabled; },
				set ( enabled ) { sel.disabled = !enabled; }
			});

			node.appendChild( sel );
		} else if ( opt.type == "radio" ) {

			for ( let i = 0; i < opt.opts.length; i++ ) {
				const rad = document.createElement( "input" );
				rad.id = opt.id + i;
				rad.name = opt.id;
				rad.type = "radio";
				rad.checked = i == opt.value;
				rad.value = i;
				rad.addEventListener( "change", this, false );
				rad.gameOpt = opt;
				node.appendChild( rad );

				const label = document.createElement( "label" );
				label.htmlFor = opt.id + i;
				label.innerHTML = opt.opts[i];
				node.appendChild( label );
			}

			Object.defineProperty( opt, "enabled", {
				get () {  for ( let r of document.getElementsByName( opt.id ) ) return !r.disabled; },
				set ( enabled ) { for ( let r of document.getElementsByName( opt.id ) ) r.disabled = !enabled; }
			});

		} else if ( opt.type == "player-select" ) {
			for ( let player of this.game.getPlayers() ) {
				node.appendChild( document.createTextNode( player.name + " " ) );
			}
			Object.defineProperty( opt, "enabled", {
				get () { return true; },
				set ( enabled ) { ; }
			});
		} else if ( opt.type == "number" ) {
			const inp = document.createElement( "input" );
			inp.type = "number";
			inp.id = opt.id;
			inp.value = opt.value;

			if ( opt.opts && isFinite( opt.opts[0] ) ) {
				inp.min = opt.opts[0]
			}

			if ( opt.opts && isFinite( opt.opts[1] ) ) {
				inp.max = opt.opts[1];
			}

			node.append( inp );

			Object.defineProperty( opt, "enabled", {
				get () { return !inp.disabled; },
				set ( enabled ) { inp.disabled = !enabled; }
			});
		};

		Object.defineProperty( opt, "visible", {
			get () { return node.style.display != "none"; },
			set ( visible ) { node.style.display = visible ? "" : "none"; }
		});

		return node;
	};

	init () {
		super.init();

		for ( let optKey in this.opts ) {
			this.appendChild( this.makeOpt( this.opts[optKey] ) );
		}

		this.game.addEventListener( "player", this, false );
	};

	update () {
		super.update();

		for ( let optKey in this.opts ) {
			const gameOpt = this.opts[optKey];

			if ( gameOpt.type == "player-select" ) {

				const seatingNode = gameOpt.node;

				let n = seatingNode.firstChild;
				while ( n.nextSibling ) {
					seatingNode.removeChild( n.nextSibling );
				}

				for ( let player of this.game.getPlayers() ) {
					seatingNode.appendChild( document.createTextNode( player.name + " " ) );
				}

			}
		}
	};

	handleEvent ( event ) {

		if ( event.target != this.game ) {
			event.target.gameOpt.value = event.target.value;
			//const evt = new Event( "change" );
			//evt.gameOpt = event.target.gameOpt;
			//this.dispatchEvent( evt );
			this.dispatchEvent( new VGTGameOptsEvent( "change", event.target.gameOpt ) );
		}

		this.update();
	};
}


export { VGTGameOpts, VGTGameOptsEvent };

/**
 *
 */

import { VGTComponent } from "./VGTComponent.js";
import { VGTEvent } from "./VGTEvent.js";


class VGTPropertyEvent extends VGTEvent {
	constructor ( type, field, oldValue, newValue ) {
		super( type );
		this.addDetail( "field", field );
		this.addDetail( "oldValue", oldValue );
		this.addDetail( "newValue", newValue );
	};
}


class VGTProperty extends VGTComponent {
	constructor ( id, type, value ) {
		super( "div", id, "vgtproperty" );
		this.constructor.css = "VGTProperty";

		Object.defineProperty( this, "id", { value : id } );
		Object.defineProperty( this, "type", { value : type } );

		this.sort = -1;

		this._value = value;
		this.valueNode = null;

		this.titleDiv = document.createElement( "label" );
		this.textDiv = document.createElement( "div" );
		this.valueDiv = document.createElement( "div" );

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
		this.dispatchEvent( new VGTPropertyEvent( "change", "value", oldValue, newValue ) );
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

	withSort ( sort ) {
		this.sort = sort;
		return this;
	};

	get enabled () {
		return !this.valueNode.disabled;
	};

	set enabled ( enabled ) {
		this.valueNode.disabled = !enabled;
	};

	/* [ TITLE ] [ ....... ] */
	init () {
		super.init();

		this.titleDiv.classList.add( "vgtproptitle" );
		this.valueDiv.classList.add( "vgtpropvalue" );

		this.titleDiv.htmlFor = this.valueNode.id;
		this.valueDiv.appendChild( this.valueNode );

		this.appendChild( this.titleDiv );
		this.appendChild( this.valueDiv );

		this.update();
	};

	handleEvent ( event ) {
		event.preventDefault();
		this.value = parseInt( this.valueNode.value );
	};

	static make ( type, id, value ) {
		if ( type == "number" ) {
			return new VGTPropertyNumber( id, value );
		} else if ( type == "select" ) {
			return new VGTPropertySelect( id, value );
		} else if ( type == "radio" ) {
			return new VGTPropertyRadio( id, value );
		} else if ( type == "player-select" ) {
			return new VGTPropertyPlayerSelect( id, value );
		} else {
			throw "Don't know that type: '" + type + "'.";
		}
	}

}


class VGTPropertyNumber extends VGTProperty {
	constructor ( id, value ) {
		super( id, "number", value );
	};

	init () {

		this.valueNode = document.createElement( "input" );
		this.valueNode.id = "vgtpropnumber-" + this._hashCode;
		this.valueNode.classList.add( "vgtpropnumber" );
		this.valueNode.type = "number";

		this.valueNode.addEventListener( "keyup", this, false );
		this.valueNode.addEventListener( "change", this, false );

		super.init();
	};

	update () {
		super.update();

		this.valueNode.min = this._opts[0] != null ? this._opts[0] : "";
		this.valueNode.max = this._opts[1] != null ? this._opts[1] : "";
		this.valueNode.step = this._opts[2] != null ? this._opts[2] : "";

		this.valueNode.value = this._value;
	};
}


class VGTPropertySelect extends VGTProperty {
	constructor( id, value ) {
		super( id, "select", value );
	};

	init () {

		this.valueNode = document.createElement( "select" );
		this.valueNode.id = "vgtpropselect-" + this._hashCode;
		this.valueNode.classList.add( "vgtpropselect" );

		for ( let i = 0; i < this.opts.length; i++ ) {
			const option = document.createElement("option");
			option.innerHTML = this.opts[i];
			option.value = i;
			this.valueNode.appendChild( option );
		}

		this.valueNode.selectedIndex = this._value;

		this.valueDiv.addEventListener( "change", this, false );

		super.init();
	};

	update () {
		this.valueDiv.selectedIndex = this._value;
	};
}


class VGTPropertyRadio extends VGTProperty {
	constructor( id, value ) {
		super( id, "radio", value );
	};

	init () {
		this.valueNode = document.createElement( "div" );
		Object.defineProperty( this.valueNode, "disabled", {

			get : function () {
				return this.querySelector( "input" ).disabled;
			},

			set : function ( disabled ) {
				const rads = this.querySelectorAll( "input" );
				for ( let rad of rads ) {
					rad.disabled = disabled;
				}
			}
		});

		Object.defineProperty( this.valueNode, "value", {
			get : function () {
				const rads = this.querySelectorAll( "input" );
				for ( let rad of rads ) {
					if ( rad.checked ) {
						return rad.value;
					}
				}
				return -1;
			},

			set : function ( value ) {
				const rads = this.querySelectorAll( "input" );
				for ( let i = 0; i < rads.length; i++ ) {
					rads[i].checked = rads[i].value == this.value;
				}
			}
		});

		for ( let i = 0; i < this.opts.length; i++ ) {
			const rad = document.createElement( "input" );
			rad.id = this.id + i;
			rad.name = this.id;
			rad.type = "radio";
			rad.checked = i == this.value;
			rad.value = i;
			rad.addEventListener( "change", this, false );
			this.valueNode.appendChild( rad );

			const label = document.createElement( "label" );
			label.htmlFor = this.id + i;
			label.innerHTML = this.opts[i];
			this.valueNode.appendChild( label );
		}

		super.init();
	};

	update () {
		const rads = this.valueNode.querySelectorAll( "input" );
		for ( let rad of rads ) {
			rad.checked = this.value == rad.value;
		}
	};
}


class VGTPropertyPlayerSelect extends VGTProperty {
	constructor ( id, value ) {
		super( id, "player-select", value );
		this.game = null;
		this.draggable = false;

		this.dragging = null;
		this.dropping = null;
	};

	withGame ( game ) {
		this.game = game;

		const players = [];

		for ( let player of game.players ) {
			players.push( player.name );
		}

		return this.withOpts( players );
	};

	withDraggable ( draggable ) {
		this.draggable = draggable;
		return this;
	};

	init () {

		this.valueNode = document.createElement( "div" );
		Object.defineProperty( this.valueNode, "disabled", {
			get : function () {
				return this.querySelector( "button" ).disabled;
			},
			set : function ( disabled ) {
				const btns = this.querySelectorAll( "button" );
				for ( let btn of btns ) {
					btn.disabled = disabled;
				}
			}
		});

		Object.defineProperty( this.valueNode, "value", {
			get : function () {
				const btns = this.querySelectorAll( "button" );
				for ( let i = 0; i < btns.length; i++ ) {
					const btn = btns[i];
					if ( btn.classList.contains( "down" ) ) {
						return i;
					}
				}
				return -1;
			},
			set : function ( value ) {
				const btns = this.querySelectorAll( "button" );
				console.log(value);
				for ( let i = 0; i < btns.length; i++ ) {
					//rads[i].checked = rads[i].value == this.value;
					btns[i].classList.toggle( "down", i == this.value );
				}
			}
		});

		if ( this.draggable ) {
			this.valueNode.addEventListener( "drag", this, false );
			this.valueNode.addEventListener( "dragstart", this, false );
			this.valueNode.addEventListener( "dragend", this, false );
			this.valueNode.addEventListener( "dragover", this, false );
			this.valueNode.addEventListener( "dragenter", this, false );
			this.valueNode.addEventListener( "dragleave", this, false );
			this.valueNode.addEventListener( "drop", this, false );
		}

		this.game.addEventListener( "player", this, false );

		super.init();
		this.update();
	};

	handleEvent ( event ) {

		if ( event.type == "change" ) {
			return super.handleEvent();
		} else if ( event.type == "player" ) {
			this.update();
		} else if ( event.type == "drag" ) {
			; // nop
		} else if ( event.type == "dragstart" ) {
			this.dragging = event.target;
			event.target.style.opacity = 0.5;
		} else if ( event.type == "dragend" ) {
			event.target.style.opacity = "";
		} else if ( event.type == "dragover" ) {
			event.preventDefault();
		} else if ( event.type == "dragenter" ) {
			this.dropping = event.target.parentElement == this.valueNode && event.target.classList.contains( "droppable" ) ? event.target : null;
			if ( this.dropping != null ) {
				//this.dropping.style.background = "#a44";
				this.dropping.classList.add( "dragover" );
			}
		} else if ( event.type == "dragleave" ) {
			this.dropping = event.target.parentElement == this.valueNode && event.target.classList.contains( "droppable" ) ? event.target : null;
			if ( this.dropping != null ) {
				//this.dropping.style.background = "";
				this.dropping.classList.remove( "dragover" );
			}
		} else if ( event.type == "drop" ) {
			event.preventDefault();
			this.dropping = event.target.parentElement == this.valueNode && event.target.classList.contains( "droppable" ) ? event.target : null;
			if ( this.dropping == null ) {
				return;
			}
			//this.dropping.style.background = "";
			this.dropping.classList.remove( "dragover" );

			const players = this.game.players;
			const oldValue = players.slice();

			const from = this.dragging.playerIndex;
			const to = this.dropping.playerIndex;

			players.splice( to, 0, players.splice( from, 1 )[ 0 ] );

			this.dispatchEvent( new VGTPropertyEvent( "change", "options", oldValue, players ) );

			this.update();
		}
	};

	update () {
		this.valueNode.innerHTML = "";
		const players = this.game.players;
		for ( let i = 0; i < players.length; i++ ) {

			const p = players[i];
			const btn = document.createElement( "button" );
			btn.classList.add( "vgtpropertyplayerselect")

			btn.innerHTML = p.name;
			btn.playerIndex = i;
			if ( this.draggable ) {
				btn.classList.add( "droppable" );
			}
			btn.classList.toggle( "down", ( this.value == i || ( this.game.currentPlayerIndex == -1 && i == 0 )  ) );
			btn.draggable = this.draggable;

			btn.addEventListener( "click", (e)=>{
				e.stopPropagation();
				const sibs = e.target.parentElement.querySelectorAll( "button" );
				for ( let i = 0; i < sibs.length; i++ ) {
					sibs[i].classList.toggle( "down", ( e.target.playerIndex == i ) );
				}
				this.value = e.target.playerIndex;
			}, false );

			this.valueNode.appendChild( btn );
		}
	};
}


class VGTProperties extends VGTComponent {
	constructor () {
		super( "div", null, "vgtproperties" );

		this.rules = {};
	};

	init () {
		super.init();
		const arr = [];

		for ( let ruleKey in this.rules ) {
			//this.appendChild( this.rules[ ruleKey ] );
			arr.push( this.rules[ ruleKey ] );
		}

		arr.sort( ( o1, o2 ) => {
			return o1.sort == o2.sort ? 0 : ( o1.sort > o2.sort ? 1 : -1 );
		});

		for ( let rule of arr ) {
			this.appendChild( rule );
		}
	};

	get enabled () {
		for ( let ruleKey in this.rules ) {
			return this.rules[ ruleKey ].enabled;
		}
	};

	set enabled ( enabled ) {
		for ( let ruleKey in this.rules ) {
			this.rules[ ruleKey ].enabled = enabled;
		}
	};

	addEventListener ( type, listener, useCapture ) {
		for ( let ruleKey in this.rules ) {
			this.rules[ ruleKey ].addEventListener( type, listener, useCapture );
		}
	};

	handleEvent( event ) {
		console.error(event);
	};

}


class VGTAppProperties extends VGTProperties {
	constructor ( app ) {
		super();

		this.app = app;
	};
}


class VGTGameProperties extends VGTProperties {
	constructor ( game ) {
		super();

		this.game = game;

		this.rules.minPlayers = new VGTPropertyNumber( "minplayers" )
			.withSort( 1 )
			.withTitle( "Minimum Players" )
			.withText( "Minimum players can be set between 2 and 5." )
			.withValue( 2 )
			.withOpts( 2, 5, 1 );

		this.rules.maxPlayers = new VGTPropertyNumber( "maxplayers" )
			.withSort( 2 )
			.withTitle( "Maximum Players" )
			.withText( "Maximum players can be set between 2 and 5." )
			.withValue( 2 )
			.withOpts( 2, 5, 1 );

//		this.rules.selTest = new VGTPropertySelect( "seltest" )
//			.withTitle( "Selct Test" )
//			.withText( "Helpful select test text." )
//			.withValue( 1 )
//			.withOpts( [ "Item 0", "Item 1", "Item 2", "Item 3" ] );
//
//		this.rules.radTest = new VGTPropertyRadio ( "radtest" )
//			.withTitle( "Radio Test" )
//			.withText( "Less helpful radio input text." )
//			.withValue( 0 )
//			.withOpts( [ "First Option", "Second Option", "Third Option" ] );
//
//		this.rules.playerTest1 = new VGTPropertyPlayerSelect ( "playerTest1" )
//			.withTitle( "Select Player 1" )
//			.withText( "Selects a player-- order too??" )
//			.withValue( game.currentPlayerIndex )
//			.withGame( game );
//
//		this.rules.playerTest2 = new VGTPropertyPlayerSelect ( "playerTest2" )
//			.withTitle( "Select Player 2" )
//			.withText( "Selects a player-- order too??" )
//			.withValue( game.currentPlayerIndex )
//			.withGame( game )
//			.withDraggable( true );

		this.rules.seating = new VGTPropertyPlayerSelect ( "seating" )
			.withSort( 3 )
			.withTitle( "Seating" )
			.withText( "Indicate starting player and seating order." )
			.withValue( 0 )//game.currentPlayerIndex )
			.withGame( game )
			.withDraggable( true );

	};

}


class VGTPlayerProperties extends VGTProperties {
	constructor ( player ) {
		super();

		this.player = player;
	};
}


//export { VGTPropertyNumber, VGTPropertySelect, VGTPropertyRadio, VGTProperties, VGTGameProperties };
export { VGTProperty, VGTAppProperties, VGTGameProperties, VGTPlayerProperties };

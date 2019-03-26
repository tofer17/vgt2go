/**
 *
 */
import { VGTComponent } from "./VGTComponent.js";

class VGTPINPad extends VGTComponent {
	constructor ( title ) {
		super( "div", null, "pinpad" );

		this.entry = "";

		this.title = document.createElement( "div" );
		this.setTitle( title ? title : "" );

		this.display = document.createElement( "div" );

		this.bs = document.createElement( "button" );
		this.bs.disabled = true;

		this.ok = document.createElement( "button" );
		this.ok.disabled = true;

		this.prev = document.createElement( "button" );
		Object.defineProperty( this.prev, "enabled", {
			get () { return !this.disabled; },
			set ( enabled ) { this.disabled = !enabled; }
		});

		this.next = document.createElement( "button" );
		Object.defineProperty( this.next, "enabled", {
			get () { return !this.disabled; },
			set ( enabled ) { this.disabled = !enabled; }
		});


		this.small = null;
		this.large = null;

	};

	init () {
		super.init();

		this.small = document.createElement( "div" );
		this.small.innerHTML = "P I N";
		this.small.style.display = "none";
		this.small.addEventListener( "click", (e)=>{this.setSmall(false)}, false);

		const t = document.createElement( "table" );
		let tr, td, b;

		tr = t.insertRow();
		td = tr.insertCell();
		td.colSpan = "3";
		td.appendChild( this.display );

		tr = t.insertRow();
		td = tr.insertCell();
		b = document.createElement( "button" );
		b.id = "pin1";
		b.addEventListener( "click", this, false );
		b.appendChild( document.createTextNode( "1" ) );
		td.appendChild( b );

		td = tr.insertCell();
		b = document.createElement( "button" );
		b.id = "pin2";
		b.addEventListener( "click", this, false );
		b.appendChild( document.createTextNode( "2" ) );
		td.appendChild( b );

		td = tr.insertCell();
		b = document.createElement( "button" );
		b.id = "pin3";
		b.addEventListener( "click", this, false );
		b.appendChild( document.createTextNode( "3" ) );
		td.appendChild( b );

		tr = t.insertRow();
		td = tr.insertCell();
		b = document.createElement( "button" );
		b.id = "pin4";
		b.addEventListener( "click", this, false );
		b.appendChild( document.createTextNode( "4" ) );
		td.appendChild( b );

		td = tr.insertCell();
		b = document.createElement( "button" );
		b.id = "pin5";
		b.addEventListener( "click", this, false );
		b.appendChild( document.createTextNode( "5" ) );
		td.appendChild( b );

		td = tr.insertCell();
		b = document.createElement( "button" );
		b.id = "pin6";
		b.addEventListener( "click", this, false );
		b.appendChild( document.createTextNode( "6" ) );
		td.appendChild( b );

		tr = t.insertRow();
		td = tr.insertCell();
		b = document.createElement( "button" );
		b.id = "pin7";
		b.addEventListener( "click", this, false );
		b.appendChild( document.createTextNode( "7" ) );
		td.appendChild( b );

		td = tr.insertCell();
		b = document.createElement( "button" );
		b.id = "pin8";
		b.addEventListener( "click", this, false );
		b.appendChild( document.createTextNode( "8" ) );
		td.appendChild( b );

		td = tr.insertCell();
		b = document.createElement( "button" );
		b.id = "pin9";
		b.addEventListener( "click", this, false );
		b.appendChild( document.createTextNode( "9" ) );
		td.appendChild( b );

		tr = t.insertRow();
		td = tr.insertCell();
		b = this.bs;
		b.id = "pinBS";
		b.addEventListener( "click", this, false );
		b.appendChild( document.createTextNode( "⌫" ) );
		td.appendChild( b );

		td = tr.insertCell();
		b = document.createElement( "button" );
		b.id = "pin0";
		b.addEventListener( "click", this, false );
		b.appendChild( document.createTextNode( "0" ) );
		td.appendChild( b );

		td = tr.insertCell();
		b = this.ok;
		b.id = "pinOK";
		b.addEventListener( "click", this, false );
		b.appendChild( document.createTextNode( "↵" ) );
		td.appendChild( b );

		tr = t.insertRow();
		td = tr.insertCell();
		b = this.prev;
		b.id = "pinPREV";
		b.addEventListener( "click", this, false );
		b.appendChild( document.createTextNode( "«" ) );
		td.appendChild( b );

		td = tr.insertCell();

		td = tr.insertCell();
		b = this.next;
		b.id = "pinNEXT";
		b.addEventListener( "click", this, false );
		b.appendChild( document.createTextNode( "»" ) );
		td.appendChild( b );

		this.controls = tr;
		this.controls.style.display = "none";


		this.large = document.createElement( "div" );
		this.large.appendChild( this.title );
		this.large.appendChild( t );

		this.node.appendChild( this.small );
		this.node.appendChild( this.large );

		if ( this.title == null || this.title.innerHTML.length < 1 ) {
			this.visible = false;
		}

		this.update();
	};

	setSmall ( small ) {
		this.small.style.display = small ? "" : "none";
		this.large.style.display = small ? "none" : "";
	};

	setTitle ( title ) {
		this.title.innerHTML = title;
	};

	setControlsVisible ( visible ) {
		this.controls.style.display = visible ? "" : "none";
	};

	setError ( text ) {

		if ( !text ) {
			text = "Incorrect.";
		}

		this.visible = true;
		this.display.innerHTML = text;
		this.entry = "";
	};

	validate ( title, validPin, callback ) {
		this.entry = "";
		this.validPin = validPin;
		this.setTitle( title );
		this.update();
		this.visible = true;
	};

	update () {
		if ( this.entry.length < 1 ) {
			this.display.innerHTML = "Input PIN";
		} else {
			this.display.innerHTML = "";
			for ( let i = 0; i < this.entry.length; i++ ) {
				this.display.innerHTML += i < this.entry.length - 1 ? "*" : this.entry.charAt(i);
			}
		}

		this.bs.disabled = this.entry.length < 1;
		this.ok.disabled = this.entry.length < 1;
	};

	handleEvent ( e ) {

		if ( e.target.id == "pinOK" && this.validPin && this.validPin != this.entry ) {
			this.setError();
			return;
		}

		switch ( e.target.id ) {
			case "pin0" : this.entry += "0"; break;
			case "pin1" : this.entry += "1"; break;
			case "pin2" : this.entry += "2"; break;
			case "pin3" : this.entry += "3"; break;
			case "pin4" : this.entry += "4"; break;
			case "pin5" : this.entry += "5"; break;
			case "pin6" : this.entry += "6"; break;
			case "pin7" : this.entry += "7"; break;
			case "pin8" : this.entry += "8"; break;
			case "pin9" : this.entry += "9"; break;
			case "pinBS" : this.entry = this.entry.substring( 0, this.entry.length - 1 ); break;
			//case "pinOK" : this.validPin = null; this.dispatchEvent( new Event( "done" ) );
			case "pinOK" : this.validPin = null; this.dispatchEvent( new Event( "done" ) );
		};

		if ( e.target.id == "pinPREV" ) {
			//this.visible = false;
			this.validPin = null;
			this.dispatchEvent( new Event( "previous" ) );
			return;
		}

		if ( e.target.id == "pinNEXT" ) {
			//this.visible = false;
			this.validPin = null;
			this.dispatchEvent( new Event( "next" ) );
			return;
		}

		if ( e.target.id != "pinOK" ) {
			this.update();
		}
	};


}

export { VGTPINPad };

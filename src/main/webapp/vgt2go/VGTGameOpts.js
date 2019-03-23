/**
 *
 */

import { VGTComponent } from "./VGTComponent.js";

class VGTGameOpts extends VGTComponent {
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

		this.opts.selTest = {
			id : "sletest",
			text : "SelTest",
			type : "select",
			value : 1,
			opts : [ "one", "two", "three", "four" ]
		};

		this.opts.radTest = {
			id : "radtest",
			text : "RadTest",
			type : "radio",
			value : 1,
			opts : [ "a", "b", "c", "d" ]
		};

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
			node.appendChild( document.createTextNode( this.game.getPlayers() ) );
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
		for ( let optKey in this.opts ) {
			this.node.appendChild( this.makeOpt( this.opts[optKey] ) );
		}
	};

	update () {

	};

	handleEvent ( event ) {
		event.target.gameOpt.value = event.target.value;
		const evt = new Event( "change" );
		evt.gameOpt = event.target.gameOpt
		this.dispatchEvent( evt );
	};
}


export { VGTGameOpts };
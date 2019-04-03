/**
 *
 */

class Utils {
	/*
	 * Returns a "hashCode" for the supplied string; if a string
	 * is not supplied, it will return the hashCode for a new UUID.
	 */
	static hashCode ( string ) {

		if ( string == null ) {
			string = Utils.uuid;
		} else {
			string = string.toString();
		}

		if ( string.length == 0) {
			return 0;
		}

		let hash = 0;

		for ( let i = 0; i < string.length; i++) {
			const char = string.charCodeAt( i );
			hash = ( ( hash << 5 ) - hash ) + char;
			hash |= 0;
		}

		return hash.toString( 16 );
	};

	static * Ids () {
		var id = 0;
		while ( id < id + 1 ) {
			yield id++;
		}
	};

	static get uuid () {
		return ( [1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
			(c ^ window.crypto.getRandomValues( new Uint8Array(1) )[ 0 ] & 15 >> c / 4 )
			.toString( 16 ) );
	};

	static get IDS () {
		return crud;
	};

	static get id () {
		return crud.next().value;
	};

	static importCSS ( comp ) {

		comp += ".css";

		if ( document.getElementById( comp ) ) {
			return;
		}

		const head  = document.getElementsByTagName( "head" )[0];
		const link  = document.createElement( "link" );
		link.id = comp;
		link.rel = "stylesheet";
		link.type = "text/css";
		link.media = "all";
		link.href = "./vgt2go/css/" + comp;
		link.addEventListener( "error", ( e ) => {
			head.removeChild( link );
		});

		head.appendChild( link );
	};

	static getClassedParent ( target, className ) {
		let classed = null;
		while ( classed == null && target != null ) {
			if ( target.classList && target.classList.contains( className ) ) {
				classed = target;
			} else {
				target = target.parentNode;
			}
		}
		return classed;
	};

}

const crud = Utils.Ids();

export { Utils };

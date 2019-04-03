/**
 *
 */

class VGTEvent extends CustomEvent {
	constructor ( typeArg, customEventInit ) {
		super( typeArg, customEventInit != null ? customEventInit : { detail : {} } );
	};

	addDetail ( detailKey, detailValue ) {
		Object.defineProperty( this.detail, detailKey, { value : detailValue } );
		return this;
	};

}

export { VGTEvent };

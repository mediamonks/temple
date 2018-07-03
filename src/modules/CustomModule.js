temple.modules.CustomModule = ( function( _super ) {
	__extends(CustomModule, _super);
	
	function CustomModule(data) {
		this.version = '0.0.0';
		this._initCustomModule();
	}
	
	CustomModule.prototype._initCustomModule = function() {
		this.done();
	}

	return CustomModule;

})( temple.core.Module );

temple.CustomModule = temple.modules.CustomModule;
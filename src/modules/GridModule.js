temple.modules.GridModule = ( function( _super ) {
	__extends(GridModule, _super);
	
	function GridModule(data, banner, id) {
		this.version = '1.0.0';
		this.banner  = (data == temple.banner) ? data : banner ? banner : temple.banner;
		this.data = {};
		this.data.id = id || 0;
		this.data.element = data.element || $(".bannerClick");

		this.data.idNameRow = "gridModuleRow";
		this.data.idNameColumn = "gridModuleColumn";
		this.data.classNameRow = "gridModuleRow";
		this.data.classNameColumn = "gridModuleColumn";

		this.data.gridSize = data.gridSize || {x:10,y:10};

		this.data.color = data.color || '#c9007a';
		this.data.opacity = data.opacity || 0.5;

		this.data.autoInit = data.autoInit || true;

		if (this.data.autoInit) {
			temple.utils.debug('Auto initing the GridModule', '#c9007a');
			this.setupGrid(this.data.gridSize.x,this.data.gridSize.y);
		}

		temple.utils.createStyle("." + this.data.classNameRow, 	
								'position: absolute;' + 
								'left: 0px;' +
								'top: 0px;' +
								'width: 100%;' +
								'height: 1px;' +
								'pointer-events:none;' +
								'opacity:' + this.data.opacity + ';' +
								'background-color:' + this.data.color + ';');

		temple.utils.createStyle("." + this.data.classNameColumn, 	
								'position: absolute;' + 
								'left: 0px;' +
								'top: 0px;' +
								'width: 1px;' +
								'height: 100%;' +
								'pointer-events:none;' +
								'opacity:' + this.data.opacity + ';' +
								'background-color:' + this.data.color + ';');

		this.done();
	}

	GridModule.prototype.setupGrid = function(x,y){	
		for (i = 0 ; i < this.banner.config.size.height ; i=i+x) {
			var div = document.createElement('div');
			div.id = this.data.idNameRow+i;
			div.className += this.data.classNameRow;
			div.style.top = i-1+"px"; // -1 to start the first line on the black border of the banner
			this.data.element.appendChild(div);
		}

		for (i = 0 ; i < this.banner.config.size.width ; i=i+y) {
			var div = document.createElement('div');
			div.id = this.data.idNameColumn+i;
			div.className += this.data.classNameColumn;
			div.style.left = i-1+"px"; // -1 to start the first line on the black border of the banner
			this.data.element.appendChild(div);
		}

		temple.banner.gridModuleTL = new TimelineMax({paused: true});
		temple.banner.gridModuleTL.from([	"."+this.data.classNameRow,
							"."+this.data.classNameColumn],5,{opacity:0});
	}

	return GridModule;

})( temple.core.Module );

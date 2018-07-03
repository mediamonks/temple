temple.modules.IconModule = ( function( _super ) {
	__extends(IconModule, _super);
	
	function IconModule(data, banner, id) {
		this.version 				= '1.2.0';
		this.svgns 					= "http://www.w3.org/2000/svg";
		this.banner  				= (data == temple.banner) ? data : banner ? banner : temple.banner;
		this.data 					= {};
		this.data.id 				= id || 0;
		this.data.element 			= (data.element) ? data.element : (data != temple.banner) ? data : null;
		this.data.elementClass 		= 'icon_module_'+this.data.id;
		this.data.color 			= data.color || ["#e52715","#FFFFFF"];
		this.data.backgroundElement = {shape: "circle", color: this.data.color};
		this.data.backgroundClass	= "background-shape-iconModule";
		this.data.iconElement 		= {shape: "triangle", color: this.data.color.slice(0).reverse()};
		this.data.iconClass 		= "icon-shape-iconModule";
		this.data.autoInit 			= undefined;
		this.data.size 				= {};
		this.data.size.width 		= this.data.element.clientWidth || this.data.element.getAttribute("width") || 20;
		this.data.size.height 		= this.data.element.clientHeight || this.data.element.getAttribute("height") || 20;

		if (data != temple.banner) {
			this.sortData(data);

			if (data.autoInit == undefined) {
				this.data.autoInit = true;
			}
		}

		if (this.data.autoInit) {
			temple.utils.debug('Auto initing the IconModule', 'orange');
			this.buildIcon(data);
		}

		this.done();
	}

	IconModule.prototype.buildIcon = function(data) {	
		if (data) {
			this.sortData(data);
		}

		this.data.element.classList.add(this.data.elementClass);
		temple.utils.createStyle("." + this.data.elementClass, 	'cursor: pointer;');

		this.data.svgContainer = document.createElementNS(this.svgns, "svg");

		this.data.svgContainer.setAttribute('width', this.data.element.clientWidth);
		this.data.svgContainer.setAttribute('height', this.data.element.clientHeight);
		this.data.svgContainer.setAttribute('overflow', "visible");
		this.data.element.appendChild(this.data.svgContainer);

		this.buildBackgroundElement();
		this.buildIconElement();
	}

	IconModule.prototype.buildBackgroundElement = function() {	

		this.data.svgBackgroundElement = new Array();
		this.colorBackground = new Array();

		// convert single element to array for genericity
		if(!(this.data.backgroundElement.constructor === Array)) {
			this.data.backgroundElement = new Array(this.data.backgroundElement);
		}

		for( var index = 0; index < this.data.backgroundElement.length ; index++){
			switch(this.data.backgroundElement[index].shape) {
				case "rectangle":	
				case "square":
					this.colorBackground[index] = this.data.backgroundElement[index].color || this.data.color;
					this.data.svgBackgroundElement[index] = document.createElementNS(this.svgns, "rect");
					this.data.svgBackgroundElement[index].setAttributeNS(null, "width", this.data.size.width);
					this.data.svgBackgroundElement[index].setAttributeNS(null, "height", this.data.size.height);
					this.data.svgBackgroundElement[index].setAttributeNS(null, "fill", this.colorBackground[index][0]); 
					this.data.svgContainer.appendChild(this.data.svgBackgroundElement[index]);
				break;

				case "circle":
				default:
					this.colorBackground[index] = this.data.backgroundElement[index].color || this.data.color;
					this.data.svgBackgroundElement[index] = document.createElementNS(this.svgns, "circle");
					this.data.svgBackgroundElement[index].setAttributeNS(null, "cx", this.data.size.width/2);
					this.data.svgBackgroundElement[index].setAttributeNS(null, "cy", this.data.size.height/2);
					this.data.svgBackgroundElement[index].setAttributeNS(null, "r",  this.data.size.width/2);
					this.data.svgBackgroundElement[index].setAttributeNS(null, "fill", this.colorBackground[index][0]); 
					this.data.svgContainer.appendChild(this.data.svgBackgroundElement[index]);

					// go through params
					for (element in this.data.backgroundElement[index]){
						if (element == "shape" || element == "color"){
							continue;
						} else {
							this.data.svgBackgroundElement[index].setAttributeNS(null, element, this.data.backgroundElement[index][element]); 
						}
					}
				break;
			}
			this.data.svgBackgroundElement[index].classList.add(this.data.backgroundClass);
		}
	}

	IconModule.prototype.buildIconElement = function(data) {	
		this.colorIcon = new Array();
		this.colorIcon = this.data.iconElement.color || this.data.color.slice(0).reverse();

		switch (this.data.iconElement.shape) {
			case "svg": //TODO 
			
			break;

			case "leftArrow":
				var parameters = {
					startX: Math.floor(this.data.size.width * 0.65),
					startY: Math.floor(this.data.size.width * 0.2),
					endX: Math.floor(this.data.size.width * 0.30),
					endY: Math.floor(this.data.size.width * 0.8),
					middleY: Math.ceil(this.data.size.height * 0.5),
					stroke: Math.ceil(this.data.size.width * 0.05)
				};

				this.data.svgIconElement = document.createElementNS(this.svgns,"path");
				this.data.svgIconElement.setAttributeNS(null, "d", "M" + Math.floor(parameters.startX) + "," + Math.ceil(parameters.startY) 
																+ " L" + Math.ceil(parameters.endX) + "," + Math.floor(parameters.middleY)
																+ " L" + Math.ceil(parameters.startX) + "," + Math.floor(parameters.endY)
																+ " L" + Math.ceil(parameters.startX) + "," + Math.floor(parameters.endY-parameters.stroke)
																+ " L" + Math.ceil(parameters.endX+parameters.stroke) + "," + Math.floor(parameters.middleY)
																+ " L" + Math.ceil(parameters.startX) + "," + Math.floor(parameters.startY+parameters.stroke)
																);
				this.data.svgIconElement.setAttributeNS(null, "fill", this.colorIcon[0]);
				this.data.svgIconElement.classList.add(this.data.iconClass);
				this.data.svgContainer.appendChild(this.data.svgIconElement);
			break;

			case "rightArrow":
				var parameters = {
					startX: Math.floor(this.data.size.width * 0.35),
					startY: Math.floor(this.data.size.width * 0.1),
					endX: Math.floor(this.data.size.width * 0.75),
					endY: Math.floor(this.data.size.width * 0.9),
					middle: Math.ceil(this.data.size.height * 0.5),
					stroke: Math.ceil(this.data.size.width * 0.05)
				};

				this.data.svgIconElement = document.createElementNS(this.svgns,"path");
				this.data.svgIconElement.setAttributeNS(null, "d", "M" + Math.floor(parameters.startX) + "," + Math.ceil(parameters.startY) 
																+ " L" + Math.ceil(parameters.endX) + "," + Math.floor(parameters.middle)
																+ " L" + Math.ceil(parameters.startX) + "," + Math.floor(parameters.endY)
																+ " L" + Math.ceil(parameters.startX) + "," + Math.floor(parameters.endY-parameters.stroke)
																+ " L" + Math.ceil(parameters.endX-parameters.stroke) + "," + Math.floor(parameters.middle)
																+ " L" + Math.ceil(parameters.startX) + "," + Math.floor(parameters.startY+parameters.stroke)
																);
				this.data.svgIconElement.setAttributeNS(null, "fill", this.colorIcon[0]);
				this.data.svgIconElement.classList.add(this.data.iconClass);
				this.data.svgContainer.appendChild(this.data.svgIconElement);
			break;

			case "close":		
				var parameters = {
					start: Math.floor(this.data.size.width * 0.30), 
					end: Math.ceil(this.data.size.height * 0.70),
					stroke: Math.ceil(this.data.size.width * 0.03)
				};	
				this.data.svgIconElement = document.createElementNS(this.svgns,"path");
				this.data.svgIconElement.setAttributeNS(null, "d", "M" + Math.floor(parameters.start-parameters.stroke) + "," + Math.ceil(parameters.start+parameters.stroke) 
																+ " L" + Math.ceil(parameters.start+parameters.stroke) + "," + Math.floor(parameters.start-parameters.stroke)
																+ " L" + Math.ceil(parameters.end+parameters.stroke) + "," + Math.floor(parameters.end-parameters.stroke)
																+ " L" + Math.floor(parameters.end-parameters.stroke) + "," + Math.ceil(parameters.end+parameters.stroke)
																
																+ " M" + Math.floor(parameters.end-parameters.stroke) + "," + Math.floor(parameters.start-parameters.stroke) 
																+ " L" + Math.ceil(parameters.end+parameters.stroke) + "," + Math.ceil(parameters.start+parameters.stroke)
																+ " L" + Math.ceil(parameters.start+parameters.stroke) + "," + Math.ceil(parameters.end+parameters.stroke)
																+ " L" + Math.floor(parameters.start-parameters.stroke) + "," + Math.floor(parameters.end-parameters.stroke)
																);
				this.data.svgIconElement.setAttributeNS(null, "fill", this.colorIcon[0]);
				this.data.svgIconElement.classList.add(this.data.iconClass);
				this.data.svgContainer.appendChild(this.data.svgIconElement);
			break;

			case "play":
				var center = {
					x: this.data.size.width/2, 
					y: this.data.size.height/2
				};
				var shapeSize = {
					width: Math.sqrt(Math.pow((this.data.size.width/2),2) - Math.pow(this.data.size.width/4,2)),
					height: this.data.size.width/2
				};
				var offset = {
					x: center.x-shapeSize.width/2.5, 
					y: center.y-shapeSize.height/2
				};		
				this.data.svgIconElement = document.createElementNS(this.svgns,"path");
				this.data.svgIconElement.setAttributeNS(null, "d", "M" + Math.floor(offset.x) + " " + Math.floor(offset.y) + " L" + Math.floor(offset.x) + " " + Math.floor(offset.y+shapeSize.height) + " L" + Math.floor(offset.x+shapeSize.width) + " " + Math.floor(center.y) + " Z");
				this.data.svgIconElement.setAttributeNS(null, "fill", this.colorIcon[0]); 
				this.data.svgIconElement.classList.add(this.data.iconClass);	
				this.data.svgContainer.appendChild(this.data.svgIconElement);
			break;

			default :
			break;
		}
		
	}
	
	IconModule.prototype.onOver = function() {
		for ( var index = 0; index < this.data.backgroundElement.length ; index++){
	 		TweenMax.to(this.data.svgBackgroundElement[index], .5, {fill: this.colorBackground[index][1], ease:Power2.easeOut});
		}
		TweenMax.to(this.data.svgIconElement, .5, {fill: this.colorIcon[1], ease:Power2.easeOut});
	}
	
	IconModule.prototype.onOut = function() {
		for ( var index = 0; index < this.data.backgroundElement.length ; index++){
			TweenMax.to(this.data.svgBackgroundElement[index], .5, {fill: this.colorBackground[index][0], ease:Power2.easeOut});
		}
		TweenMax.to(this.data.svgIconElement, .5, {fill: this.colorIcon[0], ease:Power2.easeOut});
	}

	IconModule.prototype.sortData = function(data) {
		for (var i in data) {
			this.data[i] = data[i];
		}
		if (this.data.element && typeof(this.data.element) == "string") {
			this.data.element = $(this.data.element);
		}
	}

	return IconModule;

})( temple.core.Module );

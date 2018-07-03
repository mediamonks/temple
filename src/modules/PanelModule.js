TweenMax = TweenMax || TweenLite;
temple.modules.PanelModule = ( function( _super ) {
	__extends(PanelModule, _super);
	
	function PanelModule(data, banner, id) {
		this.version = '1.4.4';
		this.banner  = (data == temple.banner) ? data : banner ? banner : temple.banner;
		this.data = {};
		this.data.id = id || 0;
		this.data.panels 				= ["bigPanel","smallPanel"];
		this.data.size 					= [{width: 300,height: 82},{width: 300,height: 69}];
		this.data.color 				= ['#dc0012', '#191818']
		this.data.position 				= "";
		this.data.timeline 				= null;
		this.data.elements 				= [];
		this.data.timelinePosition		= 0;
		this.data.staggerTime			= 0;
		this.data.animationTime			= 1;
		this.data.ease 					= Power2.easeOut; //Back.easeOut.config(0);
		this.data.autoInit 				= undefined; 

		if (!TweenMax) {
			temple.utils.debug('ERROR TweenMax or TweenLite not found - this module requires the GSAP Tween Library', 'red');
			return;
		}

		//when data is found in chain it auto inits the panels with the animation
		if (data != temple.banner) {
			this.sortData(data);

			if (data.autoInit == undefined) {
				this.data.autoInit = true;
			};
		}

		if (this.data.autoInit) {
			temple.utils.debug('Auto initing the panelModule', 'orange');
			this.addPanels();
		}
		
		this.initPanelModule();
	}

	PanelModule.prototype.addPanels = function(data) {
		this.sortData(data);

		this.data.panelObjects	= this.getPanelObjects(this.data.panels);
		if (this.data.position == "") {
			this.data.position = (this.getPosition(this.data.panelObjects) != "") ? this.getPosition(this.data.panelObjects) : "right";
		}
		this.createPanelStyles(this.data.panelObjects);
		
		if (this.data.autoInit) {
			this.createTween(this.data);
		}
	}

	PanelModule.prototype.createTween = function(data) {
		this.sortData(data);

		if (!this.data.panelObjects) {
			this.addPanels();
		}

		if (this.data.timeline)	{
			this.tl = this.banner.panelModuleTL = new TimelineMax({onComplete:this.onComplete, onCompleteScope:this.onCompleteScope});

			this.data.timeline.add(this.banner.panelModuleTL,this.data.timelinePosition);
		} else {
			this.tl = new TimelineMax({onComplete:this.onComplete, onCompleteScope:this.onCompleteScope});
		}

		var X = 0, Y = 0;
		if (this.data.position == "") {
			this.data.position = (this.getPosition(this.data.panelObjects) != "") ? this.getPosition(this.data.panelObjects) : "right";
		}
		switch (this.data.position) {
			case "bottom":	var Y = this.banner.config.size.height;	 break;
			case "top":		var Y = -this.banner.config.size.height; break;
			case "left":	var X = -this.banner.config.size.width;	 break;
			case "right":	var X = this.banner.config.size.width;	 break;
		}

		for (var i = 0; i < this.data.panelObjects.length ; i++) {
			this.tl.from(this.data.panelObjects[i].element, this.data.animationTime, {x: X,y: Y,ease: this.data.ease}, "stack+="+i*this.data.staggerTime);
		}
		this.tl.from(this.data.elements, this.data.animationTime, {x: X,y: Y,ease: this.data.ease}, "stack+=" + this.data.staggerTime);
		this.tl.set(".panel",{clearProps:"transform"});
		if (this.data.elements)
			this.tl.set(this.data.elements,{clearProps:"transform"},"endPanelModule");

		if (!this.data.timeline) {
			return this.tl;
		} 
	}

	PanelModule.prototype.sortData = function(data) {
		for (var i in data) {
			this.data[i] = data[i];
		}

		for (var j in this.banner.config.stack) {
			this.data[j] = this.banner.config.stack[j];
		}
	}

	PanelModule.prototype.getPosition = function(panelObjects) {
		if (window.getComputedStyle(panelObjects[0].element, null).getPropertyValue('display') == "none") {
			TweenMax.set(panelObjects[0].element,{display: "block"});
		}

		var top = 		{pos:"bottom", val:parseInt(window.getComputedStyle(panelObjects[0].element, null).getPropertyValue('top'))};
		var bottom = 	{pos:"top", val:parseInt(window.getComputedStyle(panelObjects[0].element, null).getPropertyValue('bottom'))};
		var left = 		{pos:"right", val:parseInt(window.getComputedStyle(panelObjects[0].element, null).getPropertyValue('left'))};
		var right = 	{pos:"left", val:parseInt(window.getComputedStyle(panelObjects[0].element, null).getPropertyValue('right'))};
		var width = 	{pos:"width", val:parseInt(window.getComputedStyle(panelObjects[0].element, null).getPropertyValue('width'))};
		var height = 	{pos:"height", val:parseInt(window.getComputedStyle(panelObjects[0].element, null).getPropertyValue('height'))};
		var arr = 		[top, bottom, left, right, width, height];
		var pos = 		Math.max(arr[0].val, arr[1].val, arr[2].val, arr[3].val);

		if (width.val == temple.config.size.width) {
			if(bottom > 0 && top < 0) {
				return "top";
			} else {
				return "bottom";
			}
		} else {
			if(left > 0 && right < 0) {
				return "left";
			} else {
				// console.log("you are so right")
				return "right";
			}
		}
		
		TweenMax.set(panelObjects[0].element,{clearProps:"display"});
	}

	PanelModule.prototype.getPanelObjects = function(panelNames) 
	{
		var panelElements = []
		for (var i = 0; i < panelNames.length; i++) {
			this["panel" + i] = {};
			if(panelNames[i][0] == "#" || panelNames[i][0] == ".") {
				this["panel" + i].name = panelNames[i].slice(1);
			} else {
				this["panel" + i].name = panelNames[i];
			}

			if(document.getElementById(this["panel" + i].name) != undefined) {
				this["panel" + i].element = document.getElementById(this["panel" + i].name)
			} else if(document.getElementsByClassName(this["panel" + i].name)[0] != null) {
				this["panel" + i].element = document.getElementsByClassName(this["panel" + i].name)[0]
			} else {
				temple.utils.debug('ERROR #' + panelNames[i] + ' Not found in your DOM', 'orange');
				break;
			}

			panelElements.push(this["panel" + i])

		}

		return panelElements;
	}

	PanelModule.prototype.createPanelStyles = function(panelObjects) 
	{
		var panelStyle 	= 	"";
		temple.utils.createStyle('.panel', 'position:absolute;width:100%;height:100%;');
		
		for (var i = 0; i < panelObjects.length; i++) {
			panelStyle		+=	"background-color:"+this.data.color[i]+";";			

			switch(this.data.position){
				case "bottom":	panelStyle += "left:0px;top:"+ (this.banner.config.size.height - this.data.size[i].height) + "px;box-shadow: 0px -1px 10px #000;";		break;
				case "top":		panelStyle += "left:0px;top:"+ (this.data.size[i].height - this.banner.config.size.height) + "px;box-shadow: 0px 1px 10px #000;";		break;
				case "left":	panelStyle += "left:"+ (this.data.size[i].width - this.banner.config.size.width) + "px;top:0px;box-shadow: 1px 0px 10px #000;";		break;
				case "right":	panelStyle += "left:"+ (this.banner.config.size.width - this.data.size[i].width) + "px;top:0px;box-shadow: -1px 0px 10px #000;";		break;
			}

			if(document.getElementById(panelObjects[i].name)) {
				temple.utils.createStyle("#" + panelObjects[i].element.id,panelStyle);
			} else if(document.getElementsByClassName(panelObjects[i].name)) {
				temple.utils.createStyle("." + panelObjects[i].name,panelStyle);
			} 

			TweenMax.set(panelObjects[i].element,{className:"+=panel"});
			TweenMax.set(panelObjects[i].element,{className:"+="+this.data.position});

		}
	}

	PanelModule.prototype.getDuration = function() {
		return this.data.animationTime;
	}

	PanelModule.prototype.setDuration = function(value) {
		this.data.animationTime = value;

	}

	PanelModule.prototype.setOnComplete = function(value) {
		this.data.onComplete = value;
	}

	PanelModule.prototype.initPanelModule = function() {
		this.done();
	}

	PanelModule.prototype.showPanel = function(id) {
		$(id).show();
	}

	PanelModule.prototype.hidePanel = function(id) {
		$(id).hide();
	}

	PanelModule.prototype.showAllPanels = function() {
		for( var i = 0 ; i < this.data.panels.length ; i++ ){	
			this.panelObjects[i].element.show();
		}	
	}

	PanelModule.prototype.hideAllPanels = function() {
		for( var i = 0 ; i < this.data.panels.length ; i++ ){	
			this.panelObjects[i].element.hide();
		}
	}

	PanelModule.prototype.disablePanels = function() {

		this.tl.progress(1).pause();
		TweenMax.set(".panel",{clearProps:"transform"});
		delete this.tl;
		this.hideAllPanels();
	}

	return PanelModule;

})( temple.core.Module );
temple.PanelModule = temple.modules.PanelModule;

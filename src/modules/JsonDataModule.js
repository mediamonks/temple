temple.modules.JsonDataModule = ( function(_super,args) {
	__extends(JsonDataModule, _super);
	
	function JsonDataModule(config, banner) {
		this.version = "0.2.1";
		this.banner = banner;
		this.config = config;
		 temple.utils.loadJSON(this.config.backup, function(jsonContent) {
		 	this.data = jsonContent;
		 	this.setDynamicVars();
		 }.bind(this));
	}

	JsonDataModule.prototype.setDynamicVars = function() {
		this.dynamicElements = document.querySelectorAll('[data-dynamic]');
		if (document.body.hasAttribute('data-dynamic-exit')) {
			this.exitURLs = this.parseDataArray('exit');
		}
		if (temple.banner.config.variation === "rich") {
			temple.config.video.sources = this.parseDataArray('video');
		}
		for (var i = 0; i < this.dynamicElements.length; i++) {
			var d = this.dynamicElements[i].getAttribute('data-dynamic');
			var p = 'this.data.' + d;p = p.split('.');p.pop();p = eval(p.join('.'));
			d = eval('this.data.' + d);
			var svg = {};

			if (this.dynamicElements[i].nodeName == "IMG") {
				this.imagesToLoad = (this.imagesToLoad+1) || 1;
				this.dynamicElements[i].onload = this.imageLoaded.bind(this);
				this.dynamicElements[i].onerror = this.imageLoaded.bind(this);
				this.dynamicElements[i].src = d;
			} else if (this.dynamicElements[i].nodeName == "svg") {
				this.imagesToLoad = (this.imagesToLoad+1) || 1;
				svg[i] = {xhr:new XMLHttpRequest(), id:i};
	        	svg[i].xhr.id = i;
	        	svg[i].xhr.onload = function(e) {
	        		var r = e.currentTarget.responseXML.documentElement;
	        		r.setAttribute('class', this.dynamicElements[e.currentTarget.id].getAttribute('class'));
					var id = this.dynamicElements[e.currentTarget.id].getAttribute('id');
	        		r.setAttribute('id', id);
	        		this.dynamicElements[e.currentTarget.id].parentNode.replaceChild(r, this.dynamicElements[e.currentTarget.id]);
	        		this.imageLoaded();
	        	}.bind(this);
	        	svg[i].xhr.open('GET', d, !0);
	        	svg[i].xhr.overrideMimeType("image/svg+xml");
				svg[i].xhr.send("");
			} else {
				if (p.type == "image") {
					var img = new Image();
					this.imagesToLoad = (this.imagesToLoad + 1) || 1;
					img.onload = this.imageLoaded.bind(this);
					img.onerror = this.imageLoaded.bind(this);
					img.src = d;
					img.div = this.dynamicElements[i];
					this.dynamicElements[i].style.backgroundImage = "url('" + d + "')";
				} else {
					this.dynamicElements[i].innerHTML = d;
				}
			}
		}
		
		if (!this.imagesToLoad) this.initJsonDataModule();
	}

	JsonDataModule.prototype.imageLoaded = function imageLoaded(e) {
		this.imagesLoaded = this.imagesLoaded+1 || 1;
		if(this.imagesLoaded == this.imagesToLoad) {
			this.initJsonDataModule();
		}
	}

	JsonDataModule.prototype.parseDataArray = function parseDataArray(a) {
		var s = [];
		var v = document.body.getAttribute('data-dynamic-'+a);
		v = v.split(',');
		for (var i = 0; i < v.length; i++) {
			var d = eval('this.data.'+v[i]).split(',');
			s = s.concat(d);
		}
		return s;
	}

	JsonDataModule.prototype.initJsonDataModule = function() {
		this.done();
	}
			
	return JsonDataModule;

} )( temple.core.Module );
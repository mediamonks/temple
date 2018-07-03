temple.modules.NetflixLogoModule = ( function( _super ) {
	__extends(NetflixLogoModule, _super);
	
	function NetflixLogoModule(data) {
		this.version = '1.0.0';
		this.parts();

		this.element = data.element || data;
		this.speed = data.speed != undefined ? data.speed : 1;
		this.width = (data.width+1) || 274;
		this.scale = (this.width / 274);
		this.height = Math.floor(this.scale * 500) - 3;

		this.leftLeg = document.createElement('div');
		this.leftLeg.className = 'leftLeg';
		this.rightLeg = document.createElement('div');
		this.rightLeg.className = 'rightLeg';
		this.c1 = document.createElement('div');
		this.c1.className = 'c1';
		this.c2 = document.createElement('div');
		this.c2.className = 'c2';
		this.c3 = document.createElement('div');
		this.c3.className = 'c3';

 		temple.utils.createStyle('#' + this.element.id, 'position:absolute;width:'+(this.width-1)+'px;height:'+this.height+'px;');
		temple.utils.createStyle('#' + this.element.id + ' *', 'position:absolute;');
		temple.utils.createStyle('#' + this.element.id + ' > div', 'overflow:hidden;');
		temple.utils.createStyle('#' + this.element.id + ' .leftLeg', 'width:'+Math.round(this.scale*97)+'px;background-color:#b1060f;');
		temple.utils.createStyle('#' + this.element.id + ' .rightLeg', 'width:'+Math.round(this.scale*97)+'px;background-color:#b1060f;right:0;bottom:'+Math.round(this.scale * 14)+'px;');
		temple.utils.createStyle('#' + this.element.id + ' .c1', 'height:0;width:'+Math.round(this.scale*97)+'px;');
		temple.utils.createStyle('#' + this.element.id + ' .c1 svg', 'top:0;left:0;width:'+Math.round(this.scale*97)+'px;height:'+this.height+'px;');
		temple.utils.createStyle('#' + this.element.id + ' .c2', 'height:0;width:'+this.width+'px;');
		temple.utils.createStyle('#' + this.element.id + ' .c2 svg', 'top:0;left:0;width:'+this.width+'px;height:'+this.height+'px;');
		temple.utils.createStyle('#' + this.element.id + ' .c3', 'right:0;height:0%;width:100%;bottom:0;');
		temple.utils.createStyle('#' + this.element.id + ' .c3 svg', 'right:0;bottom:0;width:'+Math.round(this.scale*97)+'px;height:'+this.height+'px;');
		temple.utils.createStyle('#' + this.element.id + ' .c2.out', 'right:0;bottom:0;');
		temple.utils.createStyle('#' + this.element.id + ' .c2.out svg', 'right:-1px;bottom:0;left:auto;top:auto;');
		temple.utils.createStyle('#' + this.element.id + ' .rightLeg.out', 'bottom:auto;top:0;');

		this.c1.appendChild(this.part1);
		this.c2.appendChild(this.part2);
		this.c3.appendChild(this.part3);
		this.element.appendChild(this.leftLeg);
		this.element.appendChild(this.rightLeg);
		this.element.appendChild(this.c3);
		this.element.appendChild(this.c2);
		this.element.appendChild(this.c1);

		TweenMax.set(this.leftLeg, {height:40 * this.scale, y:790 * this.scale});

		this.done();
	}
	
	NetflixLogoModule.prototype.in = function(time) {
		if (time != undefined) {
			var t = this.speed;
			this.speed = time;
		}

		this.c2.classList.remove('out');
		this.rightLeg.classList.remove('out');
		TweenMax.to(this.leftLeg, this.speed*.4, {height:790 * this.scale, y:0, ease:Quad.easeIn});
		TweenMax.to(this.leftLeg, this.speed*1, {height:480 * this.scale, ease:Expo.easeOut, delay:this.speed*.4});
		TweenMax.to(this.c1, this.speed*.3, {height:500 * this.scale, ease:Linear.easeNone, delay:this.speed*.4});
		TweenMax.to(this.c2, this.speed*.3, {height:500 * this.scale, ease:Linear.easeNone, delay:this.speed*.4});
		TweenMax.to(this.c3, this.speed*1, {height:'100%', ease:Expo.easeOut, delay:this.speed*.7});
		TweenMax.to(this.rightLeg, this.speed*1, {height:475 * this.scale, ease:Expo.easeOut, delay:this.speed*.7});

		if (time != undefined) this.speed = t;
	}
	
	NetflixLogoModule.prototype.out = function(time) {
		if (time != undefined) {
			var t = this.speed;
			this.speed = time;
		}

		this.c2.classList.add('out');
		this.rightLeg.classList.add('out');
		TweenMax.to(this.leftLeg, this.speed*.3, {height:0, y:0, ease:Quad.easeIn});
		TweenMax.to(this.c1, this.speed*.3, {height:0, ease:Quad.easeIn});
		TweenMax.to(this.c2, this.speed*.2, {height:0, ease:Linear.easeNone, delay:this.speed*.3});
		TweenMax.to(this.c3, this.speed*.2, {height:'0%', ease:Linear.easeNone, delay:this.speed*.3});
		TweenMax.to(this.rightLeg, this.speed*.2, {y:-165*this.scale,height:645*this.scale, ease:Quad.easeIn, delay:this.speed*.3});
		TweenMax.to(this.rightLeg, this.speed*.2, {y:-245*this.scale, ease:Linear.easeNone, delay:(this.speed*.3)+(this.speed*.2)});
		TweenMax.to(this.rightLeg, this.speed*.2, {height:0, ease:Quad.easeOut, delay:(this.speed*.3)+(this.speed*.2)});

		if (time != undefined) this.speed = t;
	}

	NetflixLogoModule.prototype.parts = function() {
		var parser = new DOMParser();
		this.part1 = parser.parseFromString('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" x="0px" y="0px" width="74px" height="376px" viewBox="0 0 74 376"><defs><linearGradient id="Gradient_1" gradientUnits="userSpaceOnUse" x1="56.2625" y1="128.55" x2="32.1375" y2="135.05" spreadMethod="pad"><stop offset="0%" stop-color="#68010A"/><stop offset="100%" stop-color="#B1060F"/></linearGradient><g id="Layer0_0_FILL"><path fill="url(#Gradient_1)" stroke="none" d="M 0 375 Q 40.3 368.85 74 368 L 74 209.25 0 0 0 375 Z"/></g></defs><g transform="matrix( 1, 0, 0, 1, 0,0) "><use xlink:href="#Layer0_0_FILL"/></g></svg>', 'text/xml').getElementsByTagName('svg')[0];

		this.part2 = parser.parseFromString('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" x="0px" y="0px" width="207px" height="376px" viewBox="0 0 207 376"><defs><g id="Layer1_0_FILL"><path fill="#E50914" stroke="none" d="M 74 0 L 0 0 130.2 368.1 Q 130.3751953125 368.105859375 130.55 368.1 135.7123046875 368.2849609375 140.75 368.5 145.9154296875 368.740625 150.95 369 156.119140625 369.306640625 161.15 369.65 166.3228515625 370.0109375 171.35 370.4 176.5275390625 370.8591796875 181.55 371.35 186.7322265625 371.8525390625 191.75 372.4 196.937890625 373.0125 201.95 373.65 202.451171875 373.733203125 202.95 373.8 203.4763671875 373.8787109375 204 373.95 204.50078125 374.00625 205 374.05 205.50078125 374.155078125 206 374.2 206.0751953125 374.239453125 206.15 374.25 L 74 0 Z"/></g></defs><g transform="matrix( 1, 0, 0, 1, 0,0) "><use xlink:href="#Layer1_0_FILL"/></g></svg>', 'text/xml').getElementsByTagName('svg')[0];

		this.part3 = parser.parseFromString('<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" x="0px" y="0px" width="74px" height="376px" viewBox="0 0 74 376"><defs><linearGradient id="Gradient_2" gradientUnits="userSpaceOnUse" x1="9.75" y1="243.2625" x2="38.85" y2="235.4375" spreadMethod="pad"><stop  offset="0%" stop-color="#68010A"/><stop  offset="100%" stop-color="#B1060F"/></linearGradient><g id="Layer2_0_FILL"><path fill="url(#Gradient_2)" stroke="none" d="M 73.75 0 L 0 0 0 165.4 73.75 374.25 73.75 0 Z"/></g></defs><g transform="matrix( 1, 0, 0, 1, 0,0) "><use xlink:href="#Layer2_0_FILL"/></g></svg>', 'text/xml').getElementsByTagName('svg')[0];
	}

	return NetflixLogoModule;

})( temple.core.Module );
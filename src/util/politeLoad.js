export default politeLoads = function() {
	var loads = document.querySelectorAll('[multilingual], [polite]'),
		svgs = document.querySelectorAll('[svg]'),
		comps = document.querySelectorAll('component'),
		t = 0,
		t2 = 0,
		_s = [];

	function onload(e, img) {
		if (loads[t].nodeName == 'DIV') {
			loads[t].style.backgroundImage = "url('" + loads[t].ml + loads[t].getAttribute('data-src') + "')";
			loads[t].style.width = img.width + 'px';
			loads[t].style.height = img.height + 'px';
		}
		t++;
		if (t + t2 == loads.length + svgs.length) if (c) setTimeout(c.call(this), 10);
	}

	for (var i = 0; i < loads.length; i++) {
		loads[i].ml = loads[i].hasAttribute('multilingual') || '';
		if (loads[i].ml === true) loads[i].ml = 'img/' + this.config.language + '/';
		if (loads[i].nodeName == 'DIV') {
			temple.utils.loadImage(loads[i].ml + loads[i].getAttribute('data-src'), onload.bind(this));
		} else {
			loads[i].onload = onload.bind(this, loads[i]);
			loads[i].src = loads[i].ml + loads[i].getAttribute('data-src');
		}
	}

	for (i = 0; i < svgs.length; i++) {
		_s[i] = { xhr: new XMLHttpRequest(), el: svgs[i] };
		_s[i].xhr.id = i;
		_s[i].xhr.onload = function(e) {
			var r = e.currentTarget.responseXML.documentElement;
			r.setAttribute('class', _s[e.currentTarget.id].el.getAttribute('class'));
			var id = _s[e.currentTarget.id].el.getAttribute('id');
			r.setAttribute('id', id);
			_s[e.currentTarget.id].el.parentNode.replaceChild(r, _s[e.currentTarget.id].el);
			window[id] = r;
			t2++;
			if (t + t2 == loads.length + svgs.length) if (c) setTimeout(c.call(this), 10);
		}.bind(this);
		_s[i].xhr.open('GET', svgs[i].getAttribute('data-src'), !0);
		_s[i].xhr.overrideMimeType('image/svg+xml');
		_s[i].xhr.send('');
	}

	for (i = 0; i < comps.length; i++) {
		var comp = document.createElement(comps[i].getAttribute('type'));
		var atts = comps[i].attributes;
		for (var u = 0; u < atts.length; u++) {
			comp.setAttribute(atts[u].nodeName, atts[u].nodeValue);
		}
		comps[i].parentNode.replaceChild(comp, comps[i]);
	}

	if (!loads.length && !svgs.length) if (c) setTimeout(c.call(this), 10);
};
function Util() {}
(function(Class) {
	Class.extend = function(dst, src) {
		if (src == null) return dst;
		dst.prototype._super = src.prototype;
		for (var k in src.prototype) {
			dst.prototype[k] = src.prototype[k];
		}
		return dst;
	}
	Class.css = function(elem, data) {
		for (var k in data) {
			elem.style[k] = data[k];
		}
	}
	Class.newElem = function(name, css) {
		var elem = document.createElement(name);
		if (css) Class.css(elem, css);
		return elem;
	}
	
	Class.createImg = function(src, css) {
		var img = document.createElement("img");
		img.src = src;
		Util.css(img, {
			position: "absolute",
		});
		Util.css(img, css);
		return img;
	}
	Class.createDiv = function(css) {
		var div = document.createElement("img");
		Util.css(div, {
			position: "absolute",
		});
		Util.css(div, css);
		return div;
	}
	Class.byId = function(id) {
		return document.getElementById(id);
	}
	Class.createElem = function(name) {
		return document.createElement(name);
	}
	
	Class.setSelect = function(select, val) {
		var opts = select.options;
		for (var i=0; i<opts.length; i++) {
			if (val == opts[i].value) {
				select.selectedIndex = i;
				return;
			}
		}
	}
	Class.preload = function(images) {
		for (var i=0; i<images.length; i++) {
			var img = new Image();
			img.src = images[i];
		}
	}

})(Util);
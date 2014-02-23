(function(global, document) {
	'use strict';
	
	var COLOR_SELECTOR_ID = 'color-selector';

	(new Image()).src = 'hue.png';
	(new Image()).src = 'color.png';

	function hsv2rgb(h, s, v) {
		var f = h / 60,
			i = f ^ 0,
			m = v - v * s,
			k = v * s * (f - i),
			p = v - k,
			q = k + m;
		return [[v, p, m, m, q, v][i] * 255 ^ 0, [q, v, v, p, m, m][i] * 255 ^ 0, [m, m, q, v, v, p][i] * 255 ^ 0];
	}
	
	function rgb2hsv(r, g, b) {
		var m = Math.max(r, g, b),
			n = Math.min(r, g, b),
			c = m - n,
			h = 0;
		if(c === 0) return [0, 0, m / 255];
		if(m === r) h = (g - b) / c;
		else if(m === g) h = (b - r) / c + 2;
		else if(m === b) h = (r - g) / c + 4;
		if(h < 0) h += 6;
		return [h * 60 ^ 0, c / m, m / 255];
	}
	
	function str2rgb(str) {
		if (str[0] === '#') {
			if (str.length === 7) {
				return [parseInt(str.slice(1, 3), 16), parseInt(str.slice(3, 5), 16), parseInt(str.slice(5), 16)];
			} else if (str.length === 4) {
				return [parseInt(str[1] + str[1], 16), parseInt(str[2] + str[2], 16), parseInt(str[3] + str[3], 16)];
			}
		} else {
			var c = str.match(/(\d+)/g);
			return [parseInt(c[0], 10), parseInt(c[1], 10), parseInt(c[2], 10)];
		}
	}
	
	function hex(v) {
		return ('0' + (v ^ 0).toString(16).toUpperCase()).slice(-2);
	}
	
	function rgb2str(r, g, b) {
		return '#' + hex(r) + hex(g) + hex(b);
	}
	
	function hsv2str(h, s, v) {
		var rgb = hsv2rgb(h, s, v);
		return rgb2str(rgb[0], rgb[1], rgb[2]);
	}
	
	function range(v, min, max) {
		return v < min ? min : v > max ? max : v;
	}
	
	function create() {
		var container = document.createElement('div');
		
		hue = document.createElement('img');
		hue.setAttribute('src', 'hue.png');
		hue.style.marginLeft = '4px';
		
		color = document.createElement('img');
		color.setAttribute('src', 'color.png');
		color.style.backgroundColor = '#FF0000';
		
		var footer = document.createElement('p');
		var input = document.createElement('input');
		input.setAttribute('type', 'text');
		footer.appendChild(input);
		
		colorCursor = document.createElement('span');
		colorCursor.id = 'color-cursor';
		colorCursor.style.position = 'absolute';
		colorCursor.style.display = 'block';
		colorCursor.style.top = '5px';
		colorCursor.style.left = '100px';
		colorCursor.style.width = '2px';
		colorCursor.style.height = '2px';
		colorCursor.style.borderWidth = '1px';
		colorCursor.style.borderStyle = 'solid';
		colorCursor.style.borderColor = '#FFF';
		colorCursor.style.boxShadow = 'rgba(0, 0, 0, 0.4) 0 1px 3px 0';
		
		hueCursor = document.createElement('span');
		hueCursor.id = 'hue-cursor';
		hueCursor.style.position = 'absolute';
		hueCursor.style.display = 'block';
		hueCursor.style.top = '2px';
		hueCursor.style.left = '134px';
		hueCursor.style.width = '18px';
		hueCursor.style.height = '2px';
		hueCursor.style.borderWidth = '1px';
		hueCursor.style.borderStyle = 'solid';
		hueCursor.style.borderColor = '#FFF';
		hueCursor.style.boxShadow = 'rgba(0, 0, 0, 0.6) 0 1px 3px 0';
		
		history = document.createElement('div');
		for(var i = 0; i < 8; i++) {
			var h = document.createElement('span');
			h.style.display = 'inline-block';
			h.style.width = '12px';
			h.style.height = '12px';
			h.style.marginRight = '4px';
			h.style.backgroundColor = '#000';
			h.index = i;
			h.addEventListener('mousedown', clickRecord);
			recordItems.push(h);
			history.appendChild(h);
		}
		
		container.style.backgroundColor = '#FFF';//rgba(255, 255, 255, 0.4);
		container.style.position = 'absolute';
		container.style.display = 'none';
		container.style.borderWidth = '1px';
		container.style.borderStyle = 'solid';
		container.style.borderColor = '#AAA';
		container.style.padding = '4px';
		container.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0 1px 3px 0';
		container.setAttribute('id', COLOR_SELECTOR_ID);
		
		container.appendChild(color);
		container.appendChild(colorCursor);
		container.appendChild(hue);
		container.appendChild(hueCursor);
		container.appendChild(history);
	//        container.appendChild(footer);
		
		var css = document.createElement('style'),
			style = '#' + COLOR_SELECTOR_ID + '{';
		style += 'absolute: position;';
		style += 'background-color: #FFF';
		style += '}';
		css.textContent = style;
		container.appendChild(css);
		
		console.log(css.sheet);
		
		return container;
	}
	
	var selector = null,
		color,
		hue,
		cursor,
		colorCursor,
		hueCursor,
		history,
		records = ['#000000', '#FFFFFF', '#FF0000', '#0F0', '#00F', '#FF0', '#F0F', '#0FF', '#888'],
		recordItems = [],
		h = 0,
		s = 0,
		v = 0,
		down = false,
		rect,
		text,
		callback = null;
	
	function ColorSelector(fn) {
		
		if(fn) fn();
	}
	
	function clickRecord(e) {
		var i = e.target.index;
		console.log(i);
		callback && callback(records[i]);
		e.stopPropagation();
	}
	
	function downColor(e) {
		var y = (e.offsetY || e.layerY) - 1,
			x = (e.offsetX || e.layerX) - 1;
		v = x / 127;
		s = y / 127;
		rect = e.target.getBoundingClientRect();
		colorCursor.style.left = x + 'px';
		colorCursor.style.top = y + 'px';
		down = true;
		
		document.addEventListener('mousemove', moveColor);
		document.addEventListener('mouseup', upColor);
		
		callback && callback(hsv2str(h, 1 - s, v));
		
		e.preventDefault();
	}
	
	function downHue(e) {
		rect = hue.getBoundingClientRect();
		var y = e.clientY - rect.top;
		hueCursor.style.top = y + 'px';
		h = (y - 1) / 128 * 360 ^ 0;
		if(h < 0) h = 0;
		if(h > 359) h = 359;
		down = true;
		color.style.backgroundColor = 'hsl(' + h + ',100%,50%)';
		document.addEventListener('mousemove', moveHue);
		document.addEventListener('mouseup', upHue);
		
		callback && callback(hsv2str(h, 1 - s, v));
	}
	
	function moveHue(e) {
		if(down) {
			var y = e.clientY - rect.top;
			hueCursor.style.top = range(y, 2, 130) + 'px';
			h = range((y - 2) / 128 * 360 ^ 0, 0, 359);
			console.log(h);
			color.style.backgroundColor = 'hsl(' + h + ',100%,50%)';
			callback && callback(hsv2str(h, 1 - s, v));
		}
		e.preventDefault();
	}
	
	function upHue(e) {
		down = false;
		document.removeEventListener('mousemove', moveHue);
		document.removeEventListener('mouseup', upHue);
	}
	
	function moveColor(e) {
		if(down) {
			var x = e.clientX - rect.left,
				y = e.clientY - rect.top;
			v = range(x / 127, 0, 1);
			s = range(y / 127, 0, 1);
			colorCursor.style.left = range(x, 2, 129) + 'px';
			colorCursor.style.top = range(y, 2, 129) + 'px';
			callback && callback(hsv2str(h, 1 - s, v));
		}
		e.preventDefault();
	}
	
	function upColor(e) {
		down = false;
		document.removeEventListener('mousemove', moveColor);
		document.removeEventListener('mouseup', upColor);
	}
	
	function mouseDownHandler(e) {
		var t = e.target;
		
		if(t === color) {
			downColor(e);
		} else if(t === hue) {
			downHue(e);
		} else if(t === selector) {
			
		} else if(t === colorCursor) {
			
		} else if(t === hueCursor) {
			downHue(e);
		} else {
			ColorSelector.hide();
			console.log('hide');
			e.stopPropagation();
		}
	}
	
	ColorSelector.show = function(fn, value, target) {
		if(!selector) {
			selector = create();
			document.body.appendChild(selector);
		}
		
		if(recordItems.length > 0) {
			for(var i = 0; i < history.children.length; i++) {
				recordItems[i].style.backgroundColor = records[i];
			}
		}
		
		selector.style.display = 'block';
		callback = fn;
		var rgb = str2rgb(value || '#FFFFFF'),
			hsv = rgb2hsv(rgb[0], rgb[1], rgb[2]);
		h = hsv[0];
		s = hsv[1];
		v = hsv[2];
		console.log(rgb, hsv);
		hueCursor.style.top = h / 360 * 128 + 2 + 'px';
		selector.style.left = target.offsetLeft + 'px';
		selector.style.top = target.offsetTop + target.clientHeight + 8 + 'px';
		color.style.backgroundColor = 'hsl(' + h + ',100%,50%)';
		document.addEventListener('mousedown', mouseDownHandler);
	};
	
	ColorSelector.hide = function() {
		if(!selector) return;
		selector.style.display = 'none';
		var c = hsv2str(h, s, v),
			i = records.indexOf(c);
		if(i < 0) {
			records.pop();
		} else {
			records.splice(i, 1);
		}
		records.unshift(c);
		document.removeEventListener('mousedown', mouseDownHandler);
	};
	
	global.ColorSelector = ColorSelector;

})(this, document);

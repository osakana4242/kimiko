(function () {
	/**
	 */
	enchant.Event.ADDED_TO_TIMELINE = "addedtotimeline";

	/**
	 * @type {String}
	 */
	enchant.Event.REMOVED_FROM_TIMELINE = "removedfromtimeline";

	/**
	 * @type {String}
	 */
	enchant.Event.ACTION_START = "actionstart";

	/**
	 * @type {String}
	 */
	enchant.Event.ACTION_END = "actionend";

	/**
	 * @type {String}
	 */
	enchant.Event.ACTION_TICK = "actiontick";

	/**
	 * @type {String}
	 */
	enchant.Event.ACTION_ADDED = "actionadded";

	/**
	 * @type {String}
	 */
	enchant.Event.ACTION_REMOVED = "actionremoved";

	/**
	 * ============================================================================================
	 * Easing Equations v2.0
	 * September 1, 2003
	 * (c) 2003 Robert Penner, all rights reserved.
	 * This work is subject to the terms in http://www.robertpenner.com/easing_terms_of_use.html.
	 * ============================================================================================
	 */

	/**
	 * Easing function library, from "Easing Equations" by Robert Penner.
	 * @type {Object}
	 * @namespace
	 * {@link enchant.Tween} クラスで用いるイージング関数のライブラリ名前空間.
	 */
	enchant.Easing = {
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    LINEAR: function(t, b, c, d) {
	        return c * t / d + b;
	    },
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    SWING: function(t, b, c, d) {
	        return c * (0.5 - Math.cos(((t / d) * Math.PI)) / 2) + b;
	    },
	    // quad
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    QUAD_EASEIN: function(t, b, c, d) {
	        return c * (t /= d) * t + b;
	    },
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    QUAD_EASEOUT: function(t, b, c, d) {
	        return -c * (t /= d) * (t - 2) + b;
	    },
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    QUAD_EASEINOUT: function(t, b, c, d) {
	        if ((t /= d / 2) < 1) {
	            return c / 2 * t * t + b;
	        }
	        return -c / 2 * ((--t) * (t - 2) - 1) + b;
	    },
	    // cubic
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    CUBIC_EASEIN: function(t, b, c, d) {
	        return c * (t /= d) * t * t + b;
	    },
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    CUBIC_EASEOUT: function(t, b, c, d) {
	        return c * ((t = t / d - 1) * t * t + 1) + b;
	    },
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    CUBIC_EASEINOUT: function(t, b, c, d) {
	        if ((t /= d / 2) < 1) {
	            return c / 2 * t * t * t + b;
	        }
	        return c / 2 * ((t -= 2) * t * t + 2) + b;
	    },
	    // quart
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    QUART_EASEIN: function(t, b, c, d) {
	        return c * (t /= d) * t * t * t + b;
	    },
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    QUART_EASEOUT: function(t, b, c, d) {
	        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	    },
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    QUART_EASEINOUT: function(t, b, c, d) {
	        if ((t /= d / 2) < 1) {
	            return c / 2 * t * t * t * t + b;
	        }
	        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
	    },
	    // quint
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    QUINT_EASEIN: function(t, b, c, d) {
	        return c * (t /= d) * t * t * t * t + b;
	    },
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    QUINT_EASEOUT: function(t, b, c, d) {
	        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
	    },
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    QUINT_EASEINOUT: function(t, b, c, d) {
	        if ((t /= d / 2) < 1) {
	            return c / 2 * t * t * t * t * t + b;
	        }
	        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
	    },
	    //sin
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    SIN_EASEIN: function(t, b, c, d) {
	        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
	    },
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    SIN_EASEOUT: function(t, b, c, d) {
	        return c * Math.sin(t / d * (Math.PI / 2)) + b;
	    },
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    SIN_EASEINOUT: function(t, b, c, d) {
	        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
	    },
	    // circ
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    CIRC_EASEIN: function(t, b, c, d) {
	        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
	    },
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    CIRC_EASEOUT: function(t, b, c, d) {
	        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
	    },
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    CIRC_EASEINOUT: function(t, b, c, d) {
	        if ((t /= d / 2) < 1) {
	            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
	        }
	        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
	    },
	    // elastic
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    ELASTIC_EASEIN: function(t, b, c, d, a, p) {
	        if (t === 0) {
	            return b;
	        }
	        if ((t /= d) === 1) {
	            return b + c;
	        }

	        if (!p) {
	            p = d * 0.3;
	        }

	        var s;
	        if (!a || a < Math.abs(c)) {
	            a = c;
	            s = p / 4;
	        } else {
	            s = p / (2 * Math.PI) * Math.asin(c / a);
	        }
	        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	    },
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    ELASTIC_EASEOUT: function(t, b, c, d, a, p) {
	        if (t === 0) {
	            return b;
	        }
	        if ((t /= d) === 1) {
	            return b + c;
	        }
	        if (!p) {
	            p = d * 0.3;
	        }
	        var s;
	        if (!a || a < Math.abs(c)) {
	            a = c;
	            s = p / 4;
	        } else {
	            s = p / (2 * Math.PI) * Math.asin(c / a);
	        }
	        return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
	    },
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    ELASTIC_EASEINOUT: function(t, b, c, d, a, p) {
	        if (t === 0) {
	            return b;
	        }
	        if ((t /= d / 2) === 2) {
	            return b + c;
	        }
	        if (!p) {
	            p = d * (0.3 * 1.5);
	        }
	        var s;
	        if (!a || a < Math.abs(c)) {
	            a = c;
	            s = p / 4;
	        } else {
	            s = p / (2 * Math.PI) * Math.asin(c / a);
	        }
	        if (t < 1) {
	            return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	        }
	        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
	    },
	    // bounce
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    BOUNCE_EASEOUT: function(t, b, c, d) {
	        if ((t /= d) < (1 / 2.75)) {
	            return c * (7.5625 * t * t) + b;
	        } else if (t < (2 / 2.75)) {
	            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
	        } else if (t < (2.5 / 2.75)) {
	            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
	        } else {
	            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
	        }
	    },
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    BOUNCE_EASEIN: function(t, b, c, d) {
	        return c - enchant.Easing.BOUNCE_EASEOUT(d - t, 0, c, d) + b;
	    },
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    BOUNCE_EASEINOUT: function(t, b, c, d) {
	        if (t < d / 2) {
	            return enchant.Easing.BOUNCE_EASEIN(t * 2, 0, c, d) * 0.5 + b;
	        } else {
	            return enchant.Easing.BOUNCE_EASEOUT(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
	        }

	    },
	    // back
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    BACK_EASEIN: function(t, b, c, d, s) {
	        if (s === undefined) {
	            s = 1.70158;
	        }
	        return c * (t /= d) * t * ((s + 1) * t - s) + b;
	    },
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    BACK_EASEOUT: function(t, b, c, d, s) {
	        if (s === undefined) {
	            s = 1.70158;
	        }
	        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	    },
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    BACK_EASEINOUT: function(t, b, c, d, s) {
	        if (s === undefined) {
	            s = 1.70158;
	        }
	        if ((t /= d / 2) < 1) {
	            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
	        }
	        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
	    },
	    // expo
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    EXPO_EASEIN: function(t, b, c, d) {
	        return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
	    },
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    EXPO_EASEOUT: function(t, b, c, d) {
	        return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
	    },
	    /**
	     * @param t
	     * @param b
	     * @param c
	     * @param d
	     * @return {Number}
	     */
	    EXPO_EASEINOUT: function(t, b, c, d) {
	        if (t === 0) {
	            return b;
	        }
	        if (t === d) {
	            return b + c;
	        }
	        if ((t /= d / 2) < 1) {
	            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
	        }
	        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	    }
	};

	/**
	 * Easing Equations v2.0
	 */

	/**
	 * @scope enchant.ActionEventTarget.prototype
	 * @type {*}
	 */
	enchant.ActionEventTarget = enchant.Class.create(enchant.EventTarget, {
	    /**
	     * @name enchant.ActionEventTarget
	     * @class
	     * EventTarget which can change the context of event listeners
	     * @constructs
	     * @extends enchant.EventTarget
	     */
	    initialize: function() {
	        enchant.EventTarget.apply(this, arguments);
	    },
	    /**
	     * Issue event.
	     * @param {enchant.Event} e Event issued.
	     */
	    dispatchEvent: function(e) {
	        var target;
	        if (this.node) {
	            target = this.node;
	            e.target = target;
	            e.localX = e.x - target._offsetX;
	            e.localY = e.y - target._offsetY;
	        } else {
	            this.node = null;
	        }

	        if (this['on' + e.type] != null) {
	            this['on' + e.type].call(target, e);
	        }
	        var listeners = this._listeners[e.type];
	        if (listeners != null) {
	            listeners = listeners.slice();
	            for (var i = 0, len = listeners.length; i < len; i++) {
	                listeners[i].call(target, e);
	            }
	        }
	    }
	});

	/**
	 * @scope enchant.Timeline.prototype
	 */
	enchant.Timeline = enchant.Class.create(enchant.EventTarget, {
	    /**
	     * @name enchant.Timeline
	     * @class
	     * Time-line class.
	     * Class for managing the action.
	     * For one node to manipulate the timeline of one must correspond.
	     *
	          * Reading a tl.enchant.js, all classes (Group, Scene, Entity, Label, Sprite) of the Node class that inherits
	          * Tlthe property, an instance of the Timeline class is generated.
	          * Time-line class has a method to add a variety of actions to himself,
	          * entities can be animated and various operations by using these briefly.
	          * You can choose time based and frame based(default) animation.
	     *
	     * @param node target node
	     * @param [unitialized] if this param is true, when add method called in the first time,
	     * enchant.Event.ENTER_FRAME event listener will be added to node (for reducing unused event listeners)
	     * @constructs
	     */
	    initialize: function(node) {
	        enchant.EventTarget.call(this);
	        this.node = node;
	        this.queue = [];
	        this.paused = false;
	        this.looped = false;
	        this.isFrameBased = true;
	        this._parallel = null;
	        this._activated = false;
	        this.addEventListener(enchant.Event.ENTER_FRAME, this.tick);
	    },
	    /**
	     * @private
	     */
	    _deactivateTimeline: function() {
	        if (this._activated) {
	            this._activated = false;
	            this.node.removeEventListener('enterframe', this._nodeEventListener);
	        }
	    },
	    /**
	     * @private
	     */
	    _activateTimeline: function() {
	        if (!this._activated && !this.paused) {
	            this.node.addEventListener("enterframe", this._nodeEventListener);
	            this._activated = true;
	        }
	    },
	    /**
	     */
	    setFrameBased: function() {
	        this.isFrameBased = true;
	    },
	    /**
	     */
	    setTimeBased: function() {
	        this.isFrameBased = false;
	    },
	    /**
	     */
	    next: function(remainingTime) {
	        var e, action = this.queue.shift();
	        e = new enchant.Event("actionend");
	        e.timeline = this;
	        action.dispatchEvent(e);

	        if (this.queue.length === 0) {
	            this._activated = false;
	            this.node.removeEventListener('enterframe', this._nodeEventListener);
	            return;
	        }

	        if (this.looped) {
	            e = new enchant.Event("removedfromtimeline");
	            e.timeline = this;
	            action.dispatchEvent(e);
	            action.frame = 0;

	            this.add(action);
	        } else {
	            // remove after dispatching removedfromtimeline event
	            e = new enchant.Event("removedfromtimeline");
	            e.timeline = this;
	            action.dispatchEvent(e);
	        }
	        if (remainingTime > 0 || (this.queue[0] && this.queue[0].time === 0)) {
	            var event = new enchant.Event("enterframe");
	            event.elapsed = remainingTime;
	            this.dispatchEvent(event);
	        }
	    },
	    /**
	     */
	    tick: function(enterFrameEvent) {
	        if (this.paused) {
	            return;
	        }
	        if (this.queue.length > 0) {
	            var action = this.queue[0];
	            if (action.frame === 0) {
	                var f;
	                f = new enchant.Event("actionstart");
	                f.timeline = this;
	                action.dispatchEvent(f);
	            }

	            var e = new enchant.Event("actiontick");
	            e.timeline = this;
	            if (this.isFrameBased) {
	                e.elapsed = 1;
	            } else {
	                e.elapsed = enterFrameEvent.elapsed;
	            }
	            action.dispatchEvent(e);
	        }
	    },
	    add: function(action) {
	        if (!this._activated) {
	            var tl = this;
	            this._nodeEventListener = function(e) {
	                tl.dispatchEvent(e);
	            };
	            this.node.addEventListener("enterframe", this._nodeEventListener);

	            this._activated = true;
	        }
	        if (this._parallel) {
	            this._parallel.actions.push(action);
	            this._parallel = null;
	        } else {
	            this.queue.push(action);
	        }
	        action.frame = 0;

	        var e = new enchant.Event("addedtotimeline");
	        e.timeline = this;
	        action.dispatchEvent(e);

	        e = new enchant.Event("actionadded");
	        e.action = action;
	        this.dispatchEvent(e);

	        return this;
	    },
	    /**
	     */
	    action: function(params) {
	        return this.add(new enchant.Action(params));
	    },
	    /**
	     */
	    tween: function(params) {
	        return this.add(new enchant.Tween(params));
	    },
	    /**
	     */
	    clear: function() {
	        var e = new enchant.Event("removedfromtimeline");
	        e.timeline = this;

	        for (var i = 0, len = this.queue.length; i < len; i++) {
	            this.queue[i].dispatchEvent(e);
	        }
	        this.queue = [];
	        this._deactivateTimeline();
	        return this;
	    },
	    /**
	     */
	    skip: function(frames) {
	        var event = new enchant.Event("enterframe");
	        if (this.isFrameBased) {
	            event.elapsed = 1;
	        } else {
	            event.elapsed = frames;
	            frames = 1;
	        }
	        while (frames--) {
	            this.dispatchEvent(event);
	        }
	        return this;
	    },
	    /**
	     */
	    pause: function() {
	        if (!this.paused) {
	            this.paused = true;
	            this._deactivateTimeline();
	        }
	        return this;
	    },
	    /**
	     */
	    resume: function() {
	        if (this.paused) {
	            this.paused = false;
	            this._activateTimeline();
	        }
	        return this;
	    },
	    /**
	     */
	    loop: function() {
	        this.looped = true;
	        return this;
	    },
	    /**
	     */
	    unloop: function() {
	        this.looped = false;
	        return this;
	    },
	    /**
	     */
	    delay: function(time) {
	        this.add(new enchant.Action({
	            time: time
	        }));
	        return this;
	    },
	    /**
	     */
	    wait: function(time) {
	        // reserved
	        return this;
	    },
	    /**
	     */
	    then: function(func) {
	        var timeline = this;
	        this.add(new enchant.Action({
	            onactiontick: function(evt) {
	                func.call(timeline.node);
	            },
	            // if time is 0, next action will be immediately executed
	            time: 0
	        }));
	        return this;
	    },
	    /**
	     */
	    exec: function(func) {
	        this.then(func);
	    },
	    /**
	     */
	    cue: function(cue) {
	        var ptr = 0;
	        for (var frame in cue) {
	            if (cue.hasOwnProperty(frame)) {
	                this.delay(frame - ptr);
	                this.then(cue[frame]);
	                ptr = frame;
	            }
	        }
	    },
	    /**
	     */
	    repeat: function(func, time) {
	        this.add(new enchant.Action({
	            onactiontick: function(evt) {
	                func.call(this);
	            },
	            time: time
	        }));
	        return this;
	    },
	    /**
	     */
	    and: function() {
	        var last = this.queue.pop();
	        if (last instanceof enchant.ParallelAction) {
	            this._parallel = last;
	            this.queue.push(last);
	        } else {
	            var parallel = new enchant.ParallelAction();
	            parallel.actions.push(last);
	            this.queue.push(parallel);
	            this._parallel = parallel;
	        }
	        return this;
	    },
	    /**
	     * @ignore
	     */
	    or: function() {
	        return this;
	    },
	    /**
	     * @ignore
	     */
	    doAll: function(children) {
	        return this;
	    },
	    /**
	     * @ignore
	     */
	    waitAll: function() {
	        return this;
	    },
	    /**
	     */
	    waitUntil: function(func) {
	        var timeline = this;
	        this.add(new enchant.Action({
	            onactionstart: func,
	            onactiontick: function(evt) {
	                if (func.call(this)) {
	                    timeline.next();
	                }
	            }
	        }));
	        return this;
	    },
	    /**
	     */
	    fadeTo: function(opacity, time, easing) {
	        this.tween({
	            opacity: opacity,
	            time: time,
	            easing: easing
	        });
	        return this;
	    },
	    /**
	     */
	    fadeIn: function(time, easing) {
	        return this.fadeTo(1, time, easing);
	    },
	    /**
	     */
	    fadeOut: function(time, easing) {
	        return this.fadeTo(0, time, easing);
	    },
	    /**
	     */
	    moveTo: function(x, y, time, easing) {
	        return this.tween({
	            x: x,
	            y: y,
	            time: time,
	            easing: easing
	        });
	    },
	    /**
	     */
	    moveX: function(x, time, easing) {
	        return this.tween({
	            x: x,
	            time: time,
	            easing: easing
	        });
	    },
	    /**
	     */
	    moveY: function(y, time, easing) {
	        return this.tween({
	            y: y,
	            time: time,
	            easing: easing
	        });
	    },
	    /**
	     */
	    moveBy: function(x, y, time, easing) {
	        return this.tween({
	            x: function() {
	                return this.x + x;
	            },
	            y: function() {
	                return this.y + y;
	            },
	            time: time,
	            easing: easing
	        });
	    },
	    /**
	     */
	    hide: function() {
	        return this.then(function() {
	            this.opacity = 0;
	        });
	    },
	    /**
	     */
	    show: function() {
	        return this.then(function() {
	            this.opacity = 1;
	        });
	    },
	    /**
	     */
	    removeFromScene: function() {
	        return this.then(function() {
	            this.scene.removeChild(this);
	        });
	    },
	    /**
	     */
	    scaleTo: function(scale, time, easing) {
	        if (typeof easing === "number") {
	            return this.tween({
	                scaleX: arguments[0],
	                scaleY: arguments[1],
	                time: arguments[2],
	                easing: arguments[3]
	            });
	        }
	        return this.tween({
	            scaleX: scale,
	            scaleY: scale,
	            time: time,
	            easing: easing
	        });
	    },
	    /**
	     */
	    scaleBy: function(scale, time, easing) {
	        if (typeof easing === "number") {
	            return this.tween({
	                scaleX: function() {
	                    return this.scaleX * arguments[0];
	                },
	                scaleY: function() {
	                    return this.scaleY * arguments[1];
	                },
	                time: arguments[2],
	                easing: arguments[3]
	            });
	        }
	        return this.tween({
	            scaleX: function() {
	                return this.scaleX * scale;
	            },
	            scaleY: function() {
	                return this.scaleY * scale;
	            },
	            time: time,
	            easing: easing
	        });
	    },
	    /**
	     */
	    rotateTo: function(deg, time, easing) {
	        return this.tween({
	            rotation: deg,
	            time: time,
	            easing: easing
	        });
	    },
	    /**
	     */
	    rotateBy: function(deg, time, easing) {
	        return this.tween({
	            rotation: function() {
	                return this.rotation + deg;
	            },
	            time: time,
	            easing: easing
	        });
	    }
	});

	/**
	 * @scope enchant.Action.prototype
	 * @type {*}
	 */

	enchant.Action = enchant.Class.create(enchant.ActionEventTarget, {
	    /**
	     * @name enchant.Action
	     * @class
	     * Action class.
	     * Actions are units that make up the time line,
	     * It is a unit used to specify the action you want to perform.
	     * Action has been added to the time line is performed in order.
	     *
	     * Actionstart, actiontick event is fired when the action is started and stopped,
	     * When one frame has elapsed actiontick event is also issued.
	     * Specify the action you want to perform as a listener for these events.
	     * The transition to the next action automatically the number of frames that are specified in the time has elapsed.
	     *
	     * @constructs
	     * @param param
	     * @config {integer} [time] The number of frames that will last action. infinite length is specified null
	     * @config {function} [onactionstart] Event listener for when the action is initiated
	     * @config {function} [onactiontick] Event listener for when the action has passed one frame
	     * @config {function} [onactionend] Event listener for when the action is finished
	     * @constructs
	     */
	    initialize: function(param) {
	        enchant.ActionEventTarget.call(this);
	        this.time = null;
	        this.frame = 0;
	        for (var key in param) {
	            if (param.hasOwnProperty(key)) {
	                if (param[key] != null) {
	                    this[key] = param[key];
	                }
	            }
	        }
	        var action = this;

	        this.timeline = null;
	        this.node = null;

	        this.addEventListener(enchant.Event.ADDED_TO_TIMELINE, function(evt) {
	            action.timeline = evt.timeline;
	            action.node = evt.timeline.node;
	            action.frame = 0;
	        });

	        this.addEventListener(enchant.Event.REMOVED_FROM_TIMELINE, function() {
	            action.timeline = null;
	            action.node = null;
	            action.frame = 0;
	        });

	        this.addEventListener(enchant.Event.ACTION_TICK, function(evt) {
	            var remaining = action.time - (action.frame + evt.elapsed);
	            if (action.time != null && remaining <= 0) {
	                action.frame = action.time;
	                evt.timeline.next(-remaining);
	            } else {
	                action.frame += evt.elapsed;
	            }
	        });

	    }
	});

	/**
	 * @scope enchant.ParallelAction.prototype
	 */
	enchant.ParallelAction = enchant.Class.create(enchant.Action, {
	    /**
	     * @name enchant.ParallelAction
	     * @class
	     * @constructs
	     * @extends enchant.Action
	     */
	    initialize: function(param) {
	        enchant.Action.call(this, param);
	        var timeline = this.timeline;
	        var node = this.node;
	        /**
	         * Children Actions
	         */
	        this.actions = [];
	        /**
	         * Removed actions
	         */
	        this.endedActions = [];
	        var that = this;

	        this.addEventListener(enchant.Event.ACTION_START, function(evt) {
	            for (var i = 0, len = that.actions.length; i < len; i++) {
	                that.actions[i].dispatchEvent(evt);
	            }
	        });

	        this.addEventListener(enchant.Event.ACTION_TICK, function(evt) {
	            var i, len, timeline = {
	                next: function(remaining) {
	                    var action = that.actions[i];
	                    that.actions.splice(i--, 1);
	                    len = that.actions.length;
	                    that.endedActions.push(action);

	                    var e = new enchant.Event("actionend");
	                    e.timeline = this;
	                    action.dispatchEvent(e);

	                    e = new enchant.Event("removedfromtimeline");
	                    e.timeline = this;
	                    action.dispatchEvent(e);
	                }
	            };

	            var e = new enchant.Event("actiontick");
	            e.timeline = timeline;
	            e.elapsed = evt.elapsed;
	            for (i = 0, len = that.actions.length; i < len; i++) {
	                that.actions[i].dispatchEvent(e);
	            }

	            if (that.actions.length === 0) {
	                evt.timeline.next();
	            }
	        });

	        this.addEventListener(enchant.Event.ADDED_TO_TIMELINE, function(evt) {
	            for (var i = 0, len = that.actions.length; i < len; i++) {
	                that.actions[i].dispatchEvent(evt);
	            }
	        });

	        this.addEventListener(enchant.Event.REMOVED_FROM_TIMELINE, function() {
	            this.actions = this.endedActions;
	            this.endedActions = [];
	        });

	    }
	});

	/**
	 * @scope enchant.Tween.prototype
	 */
	enchant.Tween = enchant.Class.create(enchant.Action, {
	    /**
	     * @name enchant.Tween
	     * @class
	     */
	    initialize: function(params) {
	        var origin = {};
	        var target = {};
	        enchant.Action.call(this, params);

	        if (this.easing == null) {
	            // linear
	            this.easing = function(t, b, c, d) {
	                return c * t / d + b;
	            };
	        }

	        var tween = this;
	        this.addEventListener(enchant.Event.ACTION_START, function() {
	            // excepted property
	            var excepted = ["frame", "time", "callback", "onactiontick", "onactionstart", "onactionend"];
	            for (var prop in params) {
	                if (params.hasOwnProperty(prop)) {
	                    // if function is used instead of numerical value, evaluate it
	                    var target_val;
	                    if (typeof params[prop] === "function") {
	                        target_val = params[prop].call(tween.node);
	                    } else {
	                        target_val = params[prop];
	                    }

	                    if (excepted.indexOf(prop) === -1) {
	                        origin[prop] = tween.node[prop];
	                        target[prop] = target_val;
	                    }
	                }
	            }
	        });

	        this.addEventListener(enchant.Event.ACTION_TICK, function(evt) {
	            // if time is 0, set property to target value immediately
	            var ratio = tween.time === 0 ? 1 : tween.easing(Math.min(tween.time,tween.frame + evt.elapsed), 0, 1, tween.time) - tween.easing(tween.frame, 0, 1, tween.time);

	            for (var prop in target){
	                if (target.hasOwnProperty(prop)) {
	                    if (typeof this[prop] === "undefined"){
	                        continue;
	                    }
	                    tween.node[prop] += (target[prop] - origin[prop]) * ratio;
	                    if (Math.abs(tween.node[prop]) < 10e-8){
	                        tween.node[prop] = 0;
	                    }
	                }
	            }
	        });
	    }
	});
}());

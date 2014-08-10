var oskn;
(function (oskn) {
    var AspectAnchorAdjuster = (function () {
        function AspectAnchorAdjuster() {
            this.anchors = [];
            this.baseSize = { width: 320, height: 480 };
            this.baseAspect = 320.0 / 480.0;
            this.onAdjust = function () {
            };
            this.curAspect = this.baseAspect;
            this.baseSize = oskn.conf.scdSize;
        }
        AspectAnchorAdjuster.prototype.addToScene = function (scene) {
            var _this = this;
            this.originNode = cc.Node.create();
            scene.addChild(this.originNode, 10);

            this.topNode = cc.Node.create();
            this.centerNode = cc.Node.create();
            this.bottomNode = cc.Node.create();

            this.originNode.addChild(this.topNode);
            this.originNode.addChild(this.centerNode);
            this.originNode.addChild(this.bottomNode);

            this.addAnchor(this.topNode, "top");
            this.addAnchor(this.centerNode, "center");
            this.addAnchor(this.bottomNode, "bottom");

            this.adjustAnchor();
            scene.schedule(function () {
                _this.checkAspect();
            });
        };

        AspectAnchorAdjuster.prototype.addAnchor = function (node, typ) {
            var anchor = {
                "typ": typ,
                "node": node,
                "baseY": 0
            };
            cc.log("baseSize: " + JSON.stringify(this.baseSize));
            switch (typ) {
                case "top":
                    anchor.baseY = this.baseSize.height * 0.5;
                    break;
                case "bottom":
                    anchor.baseY = -this.baseSize.height * 0.5;
                    break;
                case "center":
                default:
                    break;
            }
            this.anchors.push(anchor);
            this.adjustAnchor();
        };

        AspectAnchorAdjuster.prototype.checkAspect = function () {
            var size = cc.director.getWinSize();
            var aspect = size.width / size.height;
            if (this.curAspect === aspect) {
                return;
            }
            this.curAspect = aspect;
            this.adjustAnchor();
        };

        AspectAnchorAdjuster.prototype.adjustAnchor = function () {
            var size = cc.director.getWinSize();
            this.originNode.x = size.width * 0.5;
            this.originNode.y = size.height * 0.5;

            var scaleY = size.height / this.baseSize.height;
            cc.log("checkAspect, scaleY: " + scaleY);
            for (var i = this.anchors.length - 1; 0 <= i; --i) {
                var anchor = this.anchors[i];
                var diffY = (anchor.baseY * scaleY) - anchor.baseY;
                var p = this.originNode.parent.convertToWorldSpace(this.originNode.getPosition());
                p.x = this.originNode.x;
                p.y = this.originNode.y + diffY;
                if (anchor.node.parent) {
                    anchor.node.setPosition(anchor.node.parent.convertToNodeSpace(p));
                } else {
                    anchor.node.setPosition(anchor.node.convertToNodeSpace(p));
                }
            }
            this.onAdjust();
        };
        return AspectAnchorAdjuster;
    })();
    oskn.AspectAnchorAdjuster = AspectAnchorAdjuster;
})(oskn || (oskn = {}));
var oskn;
(function (oskn) {
    var DebugTool = (function () {
        function DebugTool(node) {
            this.node = node;
        }
        DebugTool.prototype.label = function (str) {
            if (!this.node.label) {
                var size = cc.view.getDesignResolutionSize();
                this.node.label = cc.LabelBMFont.create("debug", res.font_fnt);
                this.node.label.y = size.height * 0.5 - 30;
                this.node.addChild(this.node.label, 1);
            }
            this.node.label.setString(str);
        };
        return DebugTool;
    })();

    var DebugLayer = cc.Node.extend({
        ctor: function () {
            this._super();

            this.tool = new DebugTool(this);
            this.menus = {};

            this.addMenu("info", function (tool) {
                tool.label("unko");
            });

            return true;
        },
        addMenu: function (name, menu) {
            this.menus[name] = menu;
            this.curMenuName = name;
        },
        onEnter: function () {
            this._super();

            this.scheduleUpdate();
        },
        update: function (delta) {
            this.menus[this.curMenuName](this.tool);
        }
    });
})(oskn || (oskn = {}));
var oskn;
(function (oskn) {
    var Conf = (function () {
        function Conf() {
            this.scdSize = {
                width: 320,
                height: 480
            };
        }
        return Conf;
    })();
    oskn.Conf = Conf;
    oskn.conf = new Conf();

    var Plane = (function () {
        function Plane() {
        }
        Plane.create = function (color, width, height) {
            var self = cc.LayerColor.create(color, width, height);
            self.ignoreAnchorPointForPosition(false);
            return self;
        };
        return Plane;
    })();
    oskn.Plane = Plane;

    var LabelWithBg = (function () {
        function LabelWithBg() {
        }
        LabelWithBg.create = function (title, bgColor, width, height) {
            var bg = Plane.create(bgColor, width, height);
            var label = cc.LabelBMFont.create(title, res.font_fnt);
            label.x = bg.width / 2;
            label.y = bg.height / 2;
            bg.addChild(label);
            return bg;
        };
        return LabelWithBg;
    })();
    oskn.LabelWithBg = LabelWithBg;

    var MenuItem = (function () {
        function MenuItem() {
        }
        MenuItem.createByTitle = function (title, width, height, onClick, targetNode) {
            var btnIdle = oskn.LabelWithBg.create("[" + title + "]", cc.color(0x60, 0x60, 0x60, 0xff), width, height);
            var btnActive = oskn.LabelWithBg.create("[" + title + "]", cc.color(0x80, 0x80, 0x80, 0xff), width, height);
            var btnDisabled = oskn.LabelWithBg.create(title, cc.color(0x60, 0x60, 0x60, 0xff), width, height);

            btnActive.y = -2;

            var item = cc.MenuItemSprite.create(btnIdle, btnActive, btnDisabled, onClick, targetNode);

            item.attr({
                x: 0,
                y: 0,
                anchorX: 0.5,
                anchorY: 0.5
            });
            return item;
        };
        return MenuItem;
    })();
    oskn.MenuItem = MenuItem;

    (function (WaitUntil) {
        var funcs = {
            isDone: function () {
                return this._isWaitEnd;
            },
            execute: function () {
                if (this._callFunc != null)
                    this._isWaitEnd = this._callFunc.call(this._selectorTarget, this.target, this._data);
                else if (this._function)
                    this._isWaitEnd = this._function.call(null, this.target);
            }
        };

        function create(selector, selectorTarget, data) {
            var ret = cc.CallFunc.create(selector, selectorTarget, data);

            ret._isWaitEnd = false;
            for (var key in funcs) {
                ret[key] = funcs[key];
            }

            return ret;
        }
        WaitUntil.create = create;
    })(oskn.WaitUntil || (oskn.WaitUntil = {}));
    var WaitUntil = oskn.WaitUntil;
})(oskn || (oskn = {}));

var oskn;
(function (oskn) {
    (function (NodeUtils) {
        function visitNodes(node, visitor) {
            var children = node.children;
            for (var i = children.length - 1; 0 <= i; --i) {
                oskn.NodeUtils.visitNodes(children[i], visitor);
            }
            visitor(node);
        }
        NodeUtils.visitNodes = visitNodes;
    })(oskn.NodeUtils || (oskn.NodeUtils = {}));
    var NodeUtils = oskn.NodeUtils;
})(oskn || (oskn = {}));

var oskn;
(function (oskn) {
    (function (nodes) {
        function createRectClippingNode(x, y, w, h) {
            if (false) {
                var stencil = null;

                if (false) {
                    stencil = cc.LayerColor.create(cc.color(0xff, 0xff, 0xff, 0xff), w, h);
                    stencil.setAnchorPoint(0.0, 0.0);
                    stencil.x = x - w * 0.5;
                    stencil.y = y - h * 0.5;
                } else {
                    stencil = cc.Sprite.create(res.clip_png);
                    stencil.width = 128;
                    stencil.height = 128;
                    stencil.scaleX = w / stencil.width;
                    stencil.scaleY = h / stencil.height;
                }

                var clip = cc.ClippingNode.create(stencil);

                clip.setAlphaThreshold(0.1);

                return clip;
            } else {
                return cc.Node.create();
            }
        }
        nodes.createRectClippingNode = createRectClippingNode;
    })(oskn.nodes || (oskn.nodes = {}));
    var nodes = oskn.nodes;
})(oskn || (oskn = {}));

var hoge = {
    nodeLog: function (node, name) {
        var p = node.getPosition();
        cc.log(JSON.stringify({
            "name": name,
            "position": p,
            "world": node.parent ? node.parent.convertToWorldSpace(p) : node.convertToWorldSpace(p),
            "contentSize": node.getContentSize()
        }));
    }
};

var TestScene = cc.Scene.extend({
    onEnter: function () {
        var _this = this;
        this._super();
        var scene = this;

        var scdSize = oskn.conf.scdSize;

        var aaa = this.aaa = new oskn.AspectAnchorAdjuster();
        aaa.addToScene(scene);

        var clip = oskn.nodes.createRectClippingNode(0, 0, 32, 32);
        clip.inverted = true;
        aaa.topNode.addChild(clip);

        this.label1 = cc.LabelBMFont.create("TitleScene", res.font_fnt);
        this.label1.y = (scdSize.height - this.label1.height) / 2;
        clip.addChild(this.label1);

        this.designRect = cc.LayerColor.create();
        this.designRect.setContentSize(scdSize);
        this.designRect.ignoreAnchorPointForPosition(false);
        this.designRect.color = cc.color(0xff, 0x00, 0x00, 0xff);
        aaa.centerNode.addChild(this.designRect);

        this.designRect2 = cc.LayerColor.create();
        this.designRect2.setContentSize({ width: 240, height: 240 });
        this.designRect2.ignoreAnchorPointForPosition(false);
        this.designRect2.color = cc.color(0x00, 0xff, 0x00, 0x80);
        aaa.centerNode.addChild(this.designRect2);

        this.menu = (function () {
            var closeItem = oskn.MenuItem.createByTitle("next", 120, 48, function () {
                cc.log("Menu is clicked!");
                cc.director.runScene(new ActScene());
            }, _this);
            closeItem.y = (240 - closeItem.height) / 2;

            var menu = cc.Menu.create(closeItem);
            menu.x = 0;
            menu.y = 0;

            return menu;
        })();
        aaa.centerNode.addChild(this.menu);

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
            },
            onTouchMoved: function (touch, event) {
            },
            onTouchEnded: function (touch, event) {
            },
            onTouchCancelled: function (touch, event) {
            }
        });

        cc.eventManager.addListener(listener, scene);
        aaa.adjustAnchor();
        this.scheduleUpdate();
    },
    onExit: function () {
    },
    update: function () {
        this.aaa.checkAspect();
    }
});

var ActScene = cc.Scene.extend({
    onEnter: function () {
        var _this = this;
        this._super();
        var scene = this;

        var scdSize = oskn.conf.scdSize;

        this.centerNode2 = cc.Node.create();
        this.addChild(this.centerNode2);

        var aaa = this.aaa = new oskn.AspectAnchorAdjuster();
        aaa.addToScene(scene);
        aaa.addAnchor(this.centerNode2, "center");

        this.designRect = cc.LayerColor.create();
        this.designRect.setContentSize(scdSize);
        this.designRect.ignoreAnchorPointForPosition(false);
        this.designRect.color = cc.color(0xff, 0x00, 0x00);
        aaa.topNode.addChild(this.designRect);

        this.designRect2 = cc.LayerColor.create();
        this.designRect2.setContentSize({ width: 240, height: 240 });
        this.designRect2.ignoreAnchorPointForPosition(false);
        this.designRect2.color = cc.color(0x00, 0xff, 0x00, 0x80);
        this.centerNode2.addChild(this.designRect2);

        this.map = cc.TMXTiledMap.create(res.map101_tmx);
        aaa.topNode.addChild(this.map);

        this.label1 = cc.LabelBMFont.create("ActScene", res.font_fnt);
        this.label1.y = (scdSize.height - this.label1.height) / 2;
        aaa.topNode.addChild(this.label1);

        this.menu = (function () {
            var closeItem = oskn.MenuItem.createByTitle("next", 120, 48, function () {
                cc.log("Menu is clicked!");
                cc.director.runScene(new TestScene());
            }, _this);
            closeItem.y = (240 - closeItem.height) / 2;

            var menu = cc.Menu.create(closeItem);
            menu.x = 0;
            menu.y = 0;

            return menu;
        })();
        this.centerNode2.addChild(this.menu);

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
            },
            onTouchMoved: function (touch, event) {
            },
            onTouchEnded: function (touch, event) {
            },
            onTouchCancelled: function (touch, event) {
            }
        });

        cc.eventManager.addListener(listener, scene);
        aaa.adjustAnchor();
        this.scheduleUpdate();
    },
    onExit: function () {
    },
    update: function () {
        this.aaa.checkAspect();
    }
});

var HelloWorldLayer = cc.Layer.extend({
    sprite: null,
    ctor: function () {
        this._super();

        var size = cc.director.getWinSize();

        var closeItem = cc.MenuItemImage.create(res.CloseNormal_png, res.CloseSelected_png, function () {
            cc.log("Menu is clicked!");
        }, this);
        closeItem.attr({
            x: size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = cc.Menu.create(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        var helloLabel = cc.LabelTTF.create("Hello World", "Arial", 38);

        helloLabel.x = size.width / 2;
        helloLabel.y = 0;

        this.addChild(helloLabel, 5);

        this.sprite = cc.Sprite.create(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 0.5,
            rotation: 180
        });
        this.addChild(this.sprite, 0);

        var rotateToA = cc.RotateTo.create(2, 0);
        var scaleToA = cc.ScaleTo.create(2, 1, 1);

        this.sprite.runAction(cc.Sequence.create(rotateToA, scaleToA));
        helloLabel.runAction(cc.Spawn.create(cc.MoveBy.create(2.5, cc.p(0, size.height - 40)), cc.TintTo.create(2.5, 255, 125, 0)));
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        var wSize = cc.director.getWinSize();

        var clippingNode = oskn.nodes.createRectClippingNode(0, 0, 320, 160);
        clippingNode.setAnchorPoint(0.5, 0.5);
        clippingNode.x = wSize.width * 0.5;
        clippingNode.y = wSize.height * 0.5;

        var layer = new HelloWorldLayer();
        layer.x = -wSize.width * 0.5;
        layer.y = -wSize.height * 0.5;

        var node = cc.Node.create();
        node.addChild(layer);

        clippingNode.addChild(node);
        this.addChild(clippingNode);
    }
});
var jp;
(function (jp) {
    (function (osakana4242) {
        (function (utils) {
            (function (ObjectUtil) {
                function makeObjectListFromLabeledValues(list) {
                    var dest = [];
                    var keys = list[0];
                    for (var i = 1, iNum = list.length; i < iNum; ++i) {
                        var record = list[i];
                        var obj = {};
                        for (var j = 0, jNum = keys.length; j < jNum; ++j) {
                            obj[keys[j]] = record[j];
                        }
                        dest.push(obj);
                    }
                    return dest;
                }
                ObjectUtil.makeObjectListFromLabeledValues = makeObjectListFromLabeledValues;

                function makeObjectMapFromLabeldValues(list, keyGetter) {
                    return makeObjectMap(makeObjectListFromLabeledValues(list), keyGetter);
                }
                ObjectUtil.makeObjectMapFromLabeldValues = makeObjectMapFromLabeldValues;

                function makeObjectMap(list, keyGetter) {
                    var map = {};
                    for (var i = list.length - 1; 0 <= i; --i) {
                        var record = list[i];
                        var key = keyGetter(record);
                        map[key] = record;
                    }
                    return map;
                }
                ObjectUtil.makeObjectMap = makeObjectMap;
            })(utils.ObjectUtil || (utils.ObjectUtil = {}));
            var ObjectUtil = utils.ObjectUtil;

            (function (NumberUtil) {
                function trim(v, vMin, vMax) {
                    return (v <= vMin) ? vMin : (vMax <= v) ? vMax : v;
                }
                NumberUtil.trim = trim;

                function sign(v) {
                    return (0 <= v) ? 1 : -1;
                }
                NumberUtil.sign = sign;

                function toPaddingString(v, c, count) {
                    return StringUtil.addPadding(v.toString(), c, count);
                }
                NumberUtil.toPaddingString = toPaddingString;
            })(utils.NumberUtil || (utils.NumberUtil = {}));
            var NumberUtil = utils.NumberUtil;

            (function (StringUtil) {
                var _cacheThreshold = 16;
                var _mulCache = {};

                function mul(v, count) {
                    var ret = ((_cacheThreshold <= count) || !_mulCache[v]) ? null : _mulCache[v][count] || null;
                    if (ret) {
                        return ret;
                    }
                    ret = "";

                    for (var i = count - 1; 0 <= i; --i) {
                        ret += v;
                    }

                    if (count < _cacheThreshold) {
                        _mulCache[v] = _mulCache[v] || {};
                        _mulCache[v][count] = ret;
                    }
                    return ret;
                }
                StringUtil.mul = mul;

                function addPadding(v, c, count) {
                    var cc = StringUtil.mul(c, count);
                    return (cc + v).slice(-cc.length);
                }
                StringUtil.addPadding = addPadding;
            })(utils.StringUtil || (utils.StringUtil = {}));
            var StringUtil = utils.StringUtil;

            var Vector2D = (function () {
                function Vector2D(x, y) {
                    if (typeof x === "undefined") { x = 0; }
                    if (typeof y === "undefined") { y = 0; }
                    this.x = x;
                    this.y = y;
                }
                Vector2D.alloc = function (x, y) {
                    if (typeof x === "undefined") { x = 0; }
                    if (typeof y === "undefined") { y = 0; }
                    var v = Vector2D.pool.pop();
                    if (!v) {
                        throw "Vector2D pool empty!!";
                    }
                    v.reset(x, y);
                    return v;
                };

                Vector2D.free = function (r) {
                    Vector2D.pool.push(r);
                };

                Vector2D.prototype.reset = function (x, y) {
                    this.x = x;
                    this.y = y;
                };

                Vector2D.prototype.set = function (v) {
                    this.x = v.x;
                    this.y = v.y;
                };

                Vector2D.prototype.rotate = function (rad) {
                    var x = this.x;
                    var y = this.y;
                    this.x = x * Math.cos(rad) - (y * Math.sin(rad));
                    this.y = y * Math.cos(rad) + (x * Math.sin(rad));
                };

                Vector2D.copyFrom = function (dest, src) {
                    dest.x = src.x;
                    dest.y = src.y;
                };

                Vector2D.equals = function (a, b) {
                    return a.x === b.x && a.y === b.y;
                };

                Vector2D.add = function (dest, src) {
                    dest.x += src.x;
                    dest.y += src.y;
                };

                Vector2D.sqrMagnitude = function (a) {
                    return (a.x * a.x) + (a.y * a.y);
                };

                Vector2D.magnitude = function (a) {
                    return Math.sqrt(Vector2D.sqrMagnitude(a));
                };

                Vector2D.sqrDistance = function (a, b) {
                    var dx = b.x - a.x;
                    var dy = b.y - a.y;
                    return (dx * dx) + (dy * dy);
                };

                Vector2D.distance = function (a, b) {
                    return Math.sqrt(Vector2D.sqrDistance(a, b));
                };

                Vector2D.normalize = function (a) {
                    var m = Vector2D.magnitude(a);
                    if (m === 0) {
                        return;
                    }
                    a.x = a.x / m;
                    a.y = a.y / m;
                };
                Vector2D.zero = new Vector2D(0, 0);
                Vector2D.one = new Vector2D(1, 1);

                Vector2D.pool = (function () {
                    var pool = new Array();
                    for (var i = 0, iNum = 64; i < iNum; ++i) {
                        pool.push(new Vector2D());
                    }
                    return pool;
                })();
                return Vector2D;
            })();
            utils.Vector2D = Vector2D;

            var RectCenter = (function () {
                function RectCenter(rect) {
                    this.rect = rect;
                }
                Object.defineProperty(RectCenter.prototype, "x", {
                    get: function () {
                        return this.rect.x + (this.rect.width / 2);
                    },
                    set: function (v) {
                        this.rect.x = v - (this.rect.width / 2);
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(RectCenter.prototype, "y", {
                    get: function () {
                        return this.rect.y + (this.rect.height / 2);
                    },
                    set: function (v) {
                        this.rect.y = v - (this.rect.height / 2);
                    },
                    enumerable: true,
                    configurable: true
                });


                RectCenter.prototype.set = function (v) {
                    this.x = v.x;
                    this.y = v.y;
                };
                return RectCenter;
            })();
            utils.RectCenter = RectCenter;

            var Rect = (function () {
                function Rect(x, y, width, height) {
                    if (typeof x === "undefined") { x = 0; }
                    if (typeof y === "undefined") { y = 0; }
                    if (typeof width === "undefined") { width = 0; }
                    if (typeof height === "undefined") { height = 0; }
                    this.x = x;
                    this.y = y;
                    this.width = width;
                    this.height = height;
                    this.center = new RectCenter(this);
                }
                Rect.alloc = function (x, y, width, height) {
                    if (typeof x === "undefined") { x = 0; }
                    if (typeof y === "undefined") { y = 0; }
                    if (typeof width === "undefined") { width = 0; }
                    if (typeof height === "undefined") { height = 0; }
                    var v = Rect.pool.pop();
                    if (!v) {
                        throw "Rect pool empty!!";
                    }
                    v.reset(x, y, width, height);
                    return v;
                };

                Rect.free = function (r) {
                    Rect.pool.push(r);
                };

                Rect.prototype.reset = function (x, y, width, height) {
                    if (typeof x === "undefined") { x = 0; }
                    if (typeof y === "undefined") { y = 0; }
                    if (typeof width === "undefined") { width = 0; }
                    if (typeof height === "undefined") { height = 0; }
                    this.x = x;
                    this.y = y;
                    this.width = width;
                    this.height = height;
                };

                Rect.prototype.set = function (v) {
                    this.x = v.x;
                    this.y = v.y;
                    this.width = v.width;
                    this.height = v.height;
                };

                Rect.copyFrom = function (a, b) {
                    a.x = b.x;
                    a.y = b.y;
                    a.width = b.width;
                    a.height = b.height;
                };

                Rect.inside = function (a, b) {
                    return (a.x <= b.x) && (b.x + b.width < a.x + a.width) && (a.y <= b.y) && (b.y + b.height < a.y + a.height);
                };

                Rect.outside = function (a, b) {
                    return (b.x + b.width < a.x) || (a.x + a.width <= b.x) || (b.y + b.height < a.y) || (a.y + a.height <= b.y);
                };

                Rect.intersect = function (a, other) {
                    return (a.x < other.x + other.width) && (other.x < a.x + a.width) && (a.y < other.y + other.height) && (other.y < a.y + a.height);
                };

                Rect.distance = function (a, b) {
                    var dx = Math.max(b.x - (a.x + a.width), a.x - (b.x + b.width));
                    var dy = Math.max(b.y - (b.y + b.height), a.y - (b.y + b.height));

                    if (dx < 0) {
                        dx = 0;
                    }
                    if (dy < 0) {
                        dy = 0;
                    }

                    if (dx !== 0 && dy !== 0) {
                        return Math.sqrt((dx * dx) + (dy * dy));
                    } else if (dx !== 0) {
                        return dx;
                    } else {
                        return dy;
                    }
                };

                Rect.trimPos = function (ownRect, limitRect, onTrim) {
                    if (typeof onTrim === "undefined") { onTrim = null; }
                    if (ownRect.x < limitRect.x) {
                        ownRect.x = limitRect.x;
                        if (onTrim) {
                            onTrim.call(ownRect, -1, 0);
                        }
                    }
                    if (limitRect.x + limitRect.width < ownRect.x + ownRect.width) {
                        ownRect.x = limitRect.x + limitRect.width - ownRect.width;
                        if (onTrim) {
                            onTrim.call(ownRect, 1, 0);
                        }
                    }
                    if (ownRect.y < limitRect.y) {
                        ownRect.y = limitRect.y;
                        if (onTrim) {
                            onTrim.call(ownRect, 0, -1);
                        }
                    }
                    if (limitRect.y + limitRect.height < ownRect.y + ownRect.height) {
                        ownRect.y = limitRect.y + limitRect.height - ownRect.height;
                        if (onTrim) {
                            onTrim.call(ownRect, 0, 1);
                        }
                    }
                };
                Rect.pool = (function () {
                    var pool = new Array();
                    for (var i = 0, iNum = 64; i < iNum; ++i) {
                        pool.push(new Rect());
                    }
                    return pool;
                })();
                return Rect;
            })();
            utils.Rect = Rect;

            var NodeRect = (function () {
                function NodeRect(node) {
                    this._center = new utils.Vector2D();
                    this._node = node;
                }
                Object.defineProperty(NodeRect.prototype, "width", {
                    get: function () {
                        return this._node.width;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NodeRect.prototype, "height", {
                    get: function () {
                        return this._node.height;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NodeRect.prototype, "x", {
                    get: function () {
                        return this._node.x - this._node.width * this._node.getAnchorPoint().x;
                    },
                    set: function (value) {
                        this._node.x = value + this._node.width * this._node.getAnchorPoint().x;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NodeRect.prototype, "y", {
                    get: function () {
                        return this._node.y - this._node.getAnchorPoint().y * this._node.height;
                    },
                    set: function (value) {
                        this._node.y = value + this._node.height * this._node.getAnchorPoint().y;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NodeRect.prototype, "minX", {
                    get: function () {
                        return this.x;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NodeRect.prototype, "minY", {
                    get: function () {
                        return this.y;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NodeRect.prototype, "maxX", {
                    get: function () {
                        return this.minX + this.width;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NodeRect.prototype, "maxY", {
                    get: function () {
                        return this.minY + this.height;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NodeRect.prototype, "centerX", {
                    get: function () {
                        return this.minX + this.width * 0.5;
                    },
                    set: function (value) {
                        this.x = value - this.width * 0.5;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NodeRect.prototype, "centerY", {
                    get: function () {
                        return this.minY + this.height * 0.5;
                    },
                    set: function (value) {
                        this.y = value - this.height * 0.5;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(NodeRect.prototype, "center", {
                    get: function () {
                        this._center.x = this.centerX;
                        this._center.y = this.centerY;
                        return this._center;
                    },
                    enumerable: true,
                    configurable: true
                });
                return NodeRect;
            })();
            utils.NodeRect = NodeRect;

            var Collider = (function () {
                function Collider() {
                    var _this = this;
                    this.rect = new Rect();
                    this.relRect = new Rect();
                    this.workRect = new Rect();
                    if (false) {
                        this.sprite = oskn.Plane.create(cc.color(0xff, 0x00, 0x00), 8, 8);
                        this.sprite.setAnchorPoint(cc.p(0, 0));
                        this.sprite.schedule(function () {
                            _this.onRender();
                        });
                    }
                }
                Object.defineProperty(Collider.prototype, "parent", {
                    get: function () {
                        return this._parent;
                    },
                    set: function (value) {
                        this._parent = value;

                        if (this.sprite) {
                            var pSprite = value;
                            if (this.sprite.parent !== pSprite) {
                                this.sprite.removeFromParent(false);
                                pSprite.addChild(this.sprite);
                            }
                        }
                    },
                    enumerable: true,
                    configurable: true
                });


                Collider.prototype.getRelRect = function () {
                    var s = this.rect;
                    var d = this.relRect;
                    var x = s.x;
                    var y = s.y;
                    var p = this.parent;
                    if (p) {
                        var scaleX = p["scaleX"];
                        var scaleY = p["scaleY"];
                        var isFlipX = scaleX && (scaleX < 0);
                        var isFlipY = scaleY && (scaleY < 0);
                        if (isFlipX) {
                            var phw = p.width >> 1;
                            var shw = s.width >> 1;
                            x = (-1 * (s.x + shw - phw)) - shw + phw;
                        }
                        if (isFlipY) {
                            var phh = p.height >> 1;
                            var shh = s.height >> 1;
                            y = (-1 * (s.y + shh - phh)) - shh + phh;
                        }
                    }
                    d.x = x;
                    d.y = y;
                    d.width = s.width;
                    d.height = s.height;

                    return d;
                };

                Collider.prototype.getRect = function () {
                    var s = this.getRelRect();
                    var d = this.workRect;
                    var x = s.x;
                    var y = s.y;
                    var p = this.parent;
                    if (p) {
                        x += p.rect.x;
                        y += p.rect.y;
                    }
                    d.x = x;
                    d.y = y;
                    d.width = s.width;
                    d.height = s.height;

                    return d;
                };

                Collider.prototype.onRender = function () {
                    var sprite = this.sprite;
                    if (!sprite) {
                        return;
                    }
                    var rect = this.getRelRect();
                    sprite.x = rect.x;
                    sprite.y = rect.y;
                    sprite.width = rect.width;
                    sprite.height = rect.height;
                };

                Collider.prototype.intersect = function (collider) {
                    return Rect.intersect(this.getRect(), collider.getRect());
                };

                Collider.centerBottom = function (parent, width, height) {
                    var rect = new Rect();
                    rect.width = width;
                    rect.height = height;
                    rect.x = (parent.width - width) / 2;
                    rect.y = 0;
                    return rect;
                };

                Collider.centerMiddle = function (parent, width, height) {
                    var rect = new Rect();
                    rect.width = width;
                    rect.height = height;
                    rect.x = (parent.width - width) / 2;
                    rect.y = (parent.height - height) / 2;
                    return rect;
                };
                return Collider;
            })();
            utils.Collider = Collider;

            var Touch = (function () {
                function Touch() {
                    this.start = new Vector2D();
                    this.end = new Vector2D();
                    this.totalDiff = new Vector2D();
                    this.diff = new Vector2D();
                    this.isTouching = false;
                }
                Touch.prototype.saveTouchStart = function (pos) {
                    Vector2D.copyFrom(this.start, pos);
                    Vector2D.copyFrom(this.end, this.start);
                    this.startFrame = cc.director.getTotalFrames();
                    this.totalDiff.x = 0;
                    this.totalDiff.y = 0;
                    this.isTouching = true;
                };

                Touch.prototype.saveTouchMove = function (pos) {
                    this.diff.x = pos.x - this.end.x;
                    this.diff.y = pos.y - this.end.y;
                    Vector2D.copyFrom(this.end, pos);

                    this.totalDiff.x = this.end.x - this.start.x;
                    this.totalDiff.y = this.end.y - this.start.y;
                };

                Touch.prototype.saveTouchEnd = function (pos) {
                    Vector2D.copyFrom(this.end, pos);
                    this.endFrame = cc.director.getTotalFrames();
                    this.isTouching = false;

                    this.totalDiff.x = this.end.x - this.start.x;
                    this.totalDiff.y = this.end.y - this.start.y;
                };

                Touch.prototype.getTouchElapsedFrame = function () {
                    return cc.director.getTotalFrames() - this.startFrame;
                };
                return Touch;
            })();
            utils.Touch = Touch;

            var AnimSequence = (function () {
                function AnimSequence(imageName, frameWidth, frameHeight, frameTime, frameList) {
                    this.imageName = imageName;
                    this.frameTime = frameTime;
                    this.frameWidth = frameWidth;
                    this.frameHeight = frameHeight;
                    this.frameNum = frameList.length;
                    this.frameList = frameList;
                }
                return AnimSequence;
            })();
            utils.AnimSequence = AnimSequence;

            var AnimSequencer = (function () {
                function AnimSequencer(sprite) {
                    var _this = this;
                    this.sprite = sprite;
                    this.waitCnt = 0.0;
                    this.speed = 1.0;

                    this.frameIdx = 0;
                    this.sequence_ = null;
                    this.loopCnt = 0;

                    sprite.schedule(function () {
                        _this.step();
                        _this.updateTexture();
                    });
                }
                Object.defineProperty(AnimSequencer.prototype, "sequence", {
                    get: function () {
                        return this.sequence_;
                    },
                    set: function (v) {
                        if (!v) {
                            throw "sequcence is null";
                        }
                        this.sequence_ = v;
                        this.waitCnt = 0;
                        this.frameIdx = 0;
                        this.speed = 1.0;
                        this.loopCnt = 0;
                        this.sprite.width = v.frameWidth;
                        this.sprite.height = v.frameHeight;
                        this.sprite.setTexture(v.imageName);

                        this.updateTexture();
                    },
                    enumerable: true,
                    configurable: true
                });


                AnimSequencer.prototype.updateTexture = function () {
                    var sprite = this.sprite;
                    var r = sprite.getTextureRect();
                    var tex = sprite.getTexture();
                    var imgW = tex.getPixelsWide();
                    r.width = this.sequence_.frameWidth;
                    r.height = this.sequence_.frameHeight;

                    var hoge = this.curFrame * r.width;
                    r.x = Math.floor(hoge % imgW);
                    r.y = Math.floor(hoge / imgW) * r.height;
                    sprite.setTextureRect(r);
                };

                Object.defineProperty(AnimSequencer.prototype, "curFrame", {
                    get: function () {
                        if (this.sequence_) {
                            return this.sequence_.frameList[this.frameIdx];
                        } else {
                            return 0;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(AnimSequencer.prototype, "isOneLoopEnd", {
                    get: function () {
                        return 0 < this.loopCnt;
                    },
                    enumerable: true,
                    configurable: true
                });

                AnimSequencer.prototype.step = function () {
                    if (this.sequence_ == null) {
                        return;
                    }

                    this.waitCnt += 1;
                    if (osakana4242.kimiko.g_app.secToFrame(this.sequence_.frameTime) / this.speed <= this.waitCnt) {
                        this.frameIdx += 1;
                        if (this.sequence_.frameNum <= this.frameIdx) {
                            this.frameIdx = 0;
                            ++this.loopCnt;
                            if (this.loopListener) {
                                this.loopListener();
                            }
                        }
                        this.waitCnt = 0;
                    }
                };
                return AnimSequencer;
            })();
            utils.AnimSequencer = AnimSequencer;

            var SpriteFont = (function () {
                function SpriteFont() {
                }
                SpriteFont.prototype.getTextWidth = function (text) {
                    var ret = 0;
                    for (var i = 0, iNum = text.length; i < iNum; ++i) {
                        var code = text.charCodeAt(i);
                        var fc = this.getCharacter(code);
                        ret += fc.width;
                    }

                    ret -= (text.length - 1) * this.outlineSize;
                    return ret;
                };

                SpriteFont.prototype.getCharacter = function (code) {
                    var fc = this.characters[code];
                    if (!fc) {
                        if (0x61 <= code && code <= 0x7a) {
                            fc = this.characters[code - 0x20];
                        }
                        if (!fc) {
                            fc = this.characters[this.defaultCharCode];
                        }
                    }
                    return fc;
                };

                Object.defineProperty(SpriteFont.prototype, "lineHeight", {
                    get: function () {
                        return this.characters[this.defaultCharCode].height;
                    },
                    enumerable: true,
                    configurable: true
                });

                SpriteFont.makeFromFontSettings = function (assetName, defaultCharCode, imageWidth, imageHeight, fontSettings) {
                    var font = new SpriteFont();
                    font.assetName = assetName;
                    font.imageWidth = imageWidth;
                    font.imageHeight = imageHeight;
                    font.characters = SpriteFont.loadFontSettings(imageWidth, imageHeight, fontSettings);
                    font.defaultCharCode = defaultCharCode;
                    font.outlineSize = 1;
                    return font;
                };

                SpriteFont.loadFontSettings = function (textureWidth, textureHeight, arr) {
                    var colCnt = 9;
                    var rowCnt = arr.length / colCnt;
                    var map = {};
                    for (var rowI = 0; rowI < rowCnt; ++rowI) {
                        var arrOffs = colCnt * rowI;
                        var charCode = arr[arrOffs + 0];
                        var fontLeftRate = arr[arrOffs + 1];
                        var fontBottomRate = arr[arrOffs + 2];
                        var fontWidth = arr[arrOffs + 7];
                        var fontHeight = -arr[arrOffs + 8];
                        var fontLeft = textureWidth * fontLeftRate;
                        var fontBottom = textureHeight - (textureHeight * fontBottomRate);
                        var fontTop = fontBottom - fontHeight - 1;
                        var c = String.fromCharCode(charCode);
                        map[charCode] = {
                            "char": c,
                            "left": fontLeft,
                            "top": fontTop,
                            "width": fontWidth,
                            "height": fontHeight
                        };
                    }
                    return map;
                };
                return SpriteFont;
            })();
            utils.SpriteFont = SpriteFont;

            var SpritePool = (function () {
                function SpritePool(capacity, newSprite) {
                    this.sleeps = [];
                    this.actives = [];

                    for (var i = 0, iNum = capacity; i < iNum; ++i) {
                        var spr = newSprite(i);
                        spr.retain();
                        this.sleeps.push(spr);
                    }
                }
                SpritePool.prototype.destroy = function () {
                    this.freeAll();
                    for (var i = this.sleeps.length - 1; 0 <= i; --i) {
                        this.sleeps[i].release();
                    }
                };

                SpritePool.prototype.alloc = function () {
                    var spr = this.sleeps.shift();
                    if (spr) {
                        spr.stopAllActions();
                        spr.age = 0;
                        spr.scaleX = spr.scaleY = 1.0;
                        spr.backgroundColor = null;
                        spr.visible = true;
                        this.actives.push(spr);
                        return spr;
                    } else {
                        return null;
                    }
                };

                SpritePool.prototype.free = function (spr) {
                    spr.removeFromParent(false);
                    spr.x = spr.y = 0x7fffffff;
                    spr.visible = false;

                    var index = this.actives.indexOf(spr);
                    if (index !== -1) {
                        this.actives.splice(index, 1);
                    } else {
                        cc.log("warn can't free spr. '" + spr + "'");
                    }

                    this.sleeps.push(spr);
                };

                SpritePool.prototype.freeAll = function () {
                    for (var i = this.actives.length - 1; 0 <= i; --i) {
                        this.free(this.actives[i]);
                    }
                };
                return SpritePool;
            })();
            utils.SpritePool = SpritePool;
        })(osakana4242.utils || (osakana4242.utils = {}));
        var utils = osakana4242.utils;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));

var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (Assets) {
                Assets.IMAGE_FONT_S = "res/font_s.png";
                Assets.IMAGE_GAME_START_BG = "res/game_start_bg.png";
                Assets.IMAGE_COMMON_BG = "res/common_bg.png";
                Assets.IMAGE_MAP = "res/map.png";
                Assets.IMAGE_CHARA001 = "res/chara001.png";
                Assets.IMAGE_CHARA002 = "res/chara002.png";
                Assets.IMAGE_CHARA003 = "res/chara003.png";
                Assets.IMAGE_CHARA004 = "res/chara004.png";
                Assets.IMAGE_BULLET = "res/bullet.png";
                Assets.IMAGE_EFFECT = "res/bullet.png";
                Assets.IMAGE_COLLIDER = "res/collider.png";

                Assets.SOUND_BGM = "res/snd/bgm_02.mp3";
                Assets.SOUND_SE_OK = "res/snd/se_ok.mp3";
                Assets.SOUND_SE_CURSOR = "res/snd/se_cursor.mp3";
                Assets.SOUND_SE_HIT = "res/snd/se_hit.mp3";
                Assets.SOUND_SE_KILL = "res/snd/se_kill.mp3";
                Assets.SOUND_SE_SHOT = "res/snd/se_shot.mp3";
            })(kimiko.Assets || (kimiko.Assets = {}));
            var Assets = kimiko.Assets;

            (function (VecX) {
                VecX.L = -1;
                VecX.R = 1;
            })(kimiko.VecX || (kimiko.VecX = {}));
            var VecX = kimiko.VecX;

            (function (VecY) {
                VecY.U = 1;
                VecY.D = -1;
            })(kimiko.VecY || (kimiko.VecY = {}));
            var VecY = kimiko.VecY;

            (function (DF) {
                DF.IS_HIDDEN_DOOR = false;

                DF.BASE_FPS = 60;
                DF.SC_W = 320;
                DF.SC_H = 480;
                DF.SC_X1 = 0;
                DF.SC_Y1 = 0;
                DF.SC_X2 = DF.SC_X1 + DF.SC_W;
                DF.SC_Y2 = DF.SC_Y1 + DF.SC_H;
                DF.SC1_W = 320;
                DF.SC1_H = 240;
                DF.SC2_W = 320;
                DF.SC2_H = 80;
                DF.SC2_X1 = 0;
                DF.SC2_Y1 = 240;
                DF.SC2_X2 = DF.SC2_X1 + DF.SC2_W;
                DF.SC2_Y2 = DF.SC2_Y1 + DF.SC2_H;

                DF.UP = 1;
                DF.DOWN = -1;
                DF.LEFT = -1;
                DF.RIGHT = 1;

                DF.MAP_TILE_W = 32;
                DF.MAP_TILE_H = 32;
                DF.ENEMY_SPAWN_RECT_MARGIN = 8;
                DF.ENEMY_SLEEP_RECT_MARGIN = 320;
                DF.PLAYER_COLOR = "rgb(240, 240, 240)";
                DF.PLAYER_DAMAGE_COLOR = "rgb(240, 240, 120)";
                DF.PLAYER_ATTACK_COLOR = "rgb(160, 160, 240)";
                DF.ENEMY_COLOR = "rgb(120, 80, 120)";
                DF.ENEMY_DAMAGE_COLOR = "rgb(240, 16, 240)";
                DF.ENEMY_ATTACK_COLOR = "rgb(240, 16, 16)";
                DF.ENEMY_ID_BOSS = 0xf;

                DF.ANIM_ID_CHARA001_WALK = 10;
                DF.ANIM_ID_CHARA001_STAND = 11;
                DF.ANIM_ID_CHARA001_SQUAT = 12;
                DF.ANIM_ID_CHARA001_DEAD = 13;

                DF.ANIM_ID_CHARA002_WALK = 20;
                DF.ANIM_ID_CHARA003_WALK = 30;
                DF.ANIM_ID_CHARA004_WALK = 40;
                DF.ANIM_ID_CHARA005_WALK = 50;
                DF.ANIM_ID_CHARA006_WALK = 60;
                DF.ANIM_ID_CHARA007_WALK = 70;
                DF.ANIM_ID_CHARA008_WALK = 80;
                DF.ANIM_ID_CHARA009_WALK = 90;
                DF.ANIM_ID_CHARA010_WALK = 100;
                DF.ANIM_ID_CHARA011_WALK = 110;

                DF.ANIM_ID_BULLET001 = 300;
                DF.ANIM_ID_BULLET002 = 301;

                DF.ANIM_ID_DAMAGE = 400;
                DF.ANIM_ID_MISS = 401;
                DF.ANIM_ID_DEAD = 402;

                DF.ANIM_ID_COLLIDER = 500;

                DF.TOUCH_TO_CHARA_MOVE_LIMIT = 320;

                DF.PLAYER_MOVE_RESOLUTION = 8;
                DF.PLAYER_HP = 3;

                DF.PLAYER_BULLET_NUM = 1;

                DF.SCORE_LIFE = 300;

                DF.FONT_M = '12px Verdana,"ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","ＭＳ ゴシック","MS Gothic",monospace';
                DF.FONT_L = '24px Verdana,"ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","ＭＳ ゴシック","MS Gothic",monospace';

                DF.GRAVITY = 0.5 * 60;

                DF.GRAVITY_HOLD_SEC = 0.3;

                DF.PLAYER_TOUCH_ANCHOR_ENABLE = true;

                DF.MAP_TILE_EMPTY = 0;
                DF.MAP_TILE_COLLISION_MIN = 1;
                DF.MAP_TILE_COLLISION_MAX = 16;
                DF.MAP_TILE_GROUND_MAX = 40;
                DF.MAP_TILE_PLAYER_POS = 41;
                DF.MAP_TILE_DOOR_OPEN = 33;
                DF.MAP_TILE_DOOR_CLOSE = 0;
                DF.MAP_TILE_CHARA_MIN = 49;

                DF.MAP_ID_MIN = 101;
                DF.MAP_ID_MAX = 104;

                DF.MAP_OPTIONS = osakana4242.utils.ObjectUtil.makeObjectMapFromLabeldValues([
                    ["id", "resName", "title", "backgroundColor", "nextMapId", "exitType"],
                    [101, "map101_tmx", "tutorial", "rgb(196,196,196)", 102, "door"],
                    [102, "map102_tmx", "tutorial", "rgb(16,16,32)", 103, "door"],
                    [103, "map103_tmx", "tutorial", "rgb(196,196,196)", 201, "door"],
                    [201, "map201_tmx", "station", "rgb(32,196,255)", 202, "door"],
                    [202, "map202_tmx", "station", "rgb(32,196,255)", 203, "door"],
                    [203, "map203_tmx", "station", "rgb(196,128,32)", 204, "door"],
                    [204, "map204_tmx", "boss", "rgb(196,32,32)", 0, "enemy_zero"],
                    [900102, "map900102_tmx", "trace", "rgb(32,32,32)", 0, "door"],
                    [900103, "map900103_tmx", "jump up", "rgb(32,32,32)", 0, "door"],
                    [900104, "map900104_tmx", "jump down", "rgb(32,32,32)", 0, "door"],
                    [900105, "map900105_tmx", "front back", "rgb(32,32,32)", 0, "door"],
                    [900106, "map900106_tmx", "bunbun", "rgb(32,32,32)", 0, "door"],
                    [900107, "map900107_tmx", "hovering", "rgb(32,32,32)", 0, "door"],
                    [900108, "map900108_tmx", "horizontal move", "rgb(32,32,32)", 0, "door"],
                    [900109, "map900109_tmx", "horizontal trace", "rgb(32,32,32)", 0, "door"],
                    [900201, "map900201_tmx", "test", "rgb(32,32,32)", 0, "door"],
                    [900202, "map900202_tmx", "test", "rgb(32,32,32)", 0, "door"],
                    [900203, "map900203_tmx", "test", "rgb(32,32,32)", 0, "door"]
                ], function (record) {
                    return record.id;
                });

                DF.BIT_L = 1 << 0;
                DF.BIT_R = 1 << 1;
                DF.BIT_U = 1 << 2;
                DF.BIT_D = 1 << 3;

                DF.DIR_FLAG_TO_VECTOR2D = (function () {
                    var a = {};
                    var b = 1;
                    var c = 0.7;
                    a[DF.BIT_L] = { x: -b, y: 0 };
                    a[DF.BIT_R] = { x: b, y: 0 };
                    a[DF.BIT_U] = { x: 0, y: -b };
                    a[DF.BIT_D] = { x: 0, y: b };

                    a[DF.BIT_L | DF.BIT_U] = { x: -c, y: -c };
                    a[DF.BIT_L | DF.BIT_D] = { x: -c, y: c };
                    a[DF.BIT_L | DF.BIT_R] = { x: 0, y: 0 };

                    a[DF.BIT_R | DF.BIT_U] = { x: c, y: -c };
                    a[DF.BIT_R | DF.BIT_D] = { x: c, y: c };

                    a[DF.BIT_U | DF.BIT_D] = { x: 0, y: 0 };

                    a[DF.BIT_L | DF.BIT_R | DF.BIT_U] = { x: 0, y: -b };
                    a[DF.BIT_L | DF.BIT_R | DF.BIT_D] = { x: 0, y: b };
                    a[DF.BIT_L | DF.BIT_U | DF.BIT_D] = { x: -b, y: 0 };
                    a[DF.BIT_R | DF.BIT_U | DF.BIT_D] = { x: b, y: 0 };

                    a[DF.BIT_L | DF.BIT_R | DF.BIT_U | DF.BIT_D] = { x: 0, y: 0 };
                    return a;
                })();
            })(kimiko.DF || (kimiko.DF = {}));
            var DF = kimiko.DF;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));
var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            var Env = (function () {
                function Env() {
                    var ua = "";
                    this.userAgent = ua;
                    this.isIos = ((ua.indexOf('iPhone') > 0 && ua.indexOf('iPad') === -1) || ua.indexOf('iPod') > 0);
                    this.isAndroid = (ua.indexOf('Android') > 0);
                    this.isSp = this.isIos || this.isAndroid;
                    this.isPc = !this.isSp;
                    this.isTouchEnabled = this.isSp;
                    this.isSoundEnabled = this.isPc;
                    cc.log("Env: " + JSON.stringify(this));
                }
                return Env;
            })();
            kimiko.Env = Env;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));

var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            var DF = jp.osakana4242.kimiko.DF;

            var PlayerData = (function () {
                function PlayerData() {
                    this.reset();
                }
                PlayerData.prototype.reset = function () {
                    this.hpMax = DF.PLAYER_HP;
                    this.hp = this.hpMax;
                    this.score = 0;
                    this.restTimeMax = 0;
                    this.restTimeCounter = 0;
                    this.mapId = DF.MAP_ID_MIN;
                };

                PlayerData.prototype.timeToScore = function (time) {
                    return time;
                };

                Object.defineProperty(PlayerData.prototype, "resultText", {
                    get: function () {
                        return "SCORE: " + this.score;
                    },
                    enumerable: true,
                    configurable: true
                });
                return PlayerData;
            })();
            kimiko.PlayerData = PlayerData;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));

var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            var DF = jp.osakana4242.kimiko.DF;

            var Storage = (function () {
                function Storage() {
                    this.root = null;
                    this.defaultRoot = null;
                    this.defaultRoot = {
                        "version": Storage.storageVersion,
                        "userConfig": {
                            "isSeEnabled": kimiko.g_app.env.isPc,
                            "isBgmEnabled": kimiko.g_app.env.isPc,
                            "fps": kimiko.g_app.config.fps || kimiko.g_app.env.isPc ? 60 : 20,
                            "isFpsVisible": true,
                            "difficulty": 1,
                            "isUiRight": true
                        },
                        "userMaps": {
                            101: {
                                "mapId": 101,
                                "score": 0,
                                "playCount": 0
                            }
                        }
                    };
                    this.root = this.defaultRoot;
                }
                Storage.prototype.load = function () {
                    var fromStorage = null;

                    var isValid = false;
                    try  {
                        var jsonString = cc.sys.localStorage.getItem(Storage.storageKey);
                        cc.log("Storage.load: " + jsonString);
                        if (jsonString) {
                            var fromStorage = JSON.parse(jsonString);
                            isValid = this.isValid(fromStorage);
                        }
                    } catch (ex) {
                        cc.log("ex: " + ex);
                    }

                    if (isValid) {
                        this.root = fromStorage;
                    } else {
                        cc.log("load failed.");
                    }
                };

                Storage.prototype.save = function () {
                    var jsonString = JSON.stringify(this.root);
                    cc.log("Storage.save: " + jsonString);
                    cc.sys.localStorage.setItem(Storage.storageKey, jsonString);
                };

                Storage.prototype.clear = function () {
                    cc.sys.localStorage.setItem(Storage.storageKey, "");
                };

                Storage.prototype.getDifficultyName = function (difficulty) {
                    switch (difficulty) {
                        case 1:
                            return "NORMAL";
                        case 2:
                            return "HARD";
                        default:
                            return "?";
                    }
                };

                Storage.prototype.getUserMapForUpdate = function (mapId) {
                    var userMap = this.root.userMaps[mapId];
                    if (!userMap) {
                        userMap = {
                            "mapId": mapId,
                            "score": 0,
                            "playCount": 0
                        };
                        this.root.userMaps[mapId] = userMap;
                    }
                    return userMap;
                };

                Storage.prototype.isValid = function (fromStorage) {
                    if (fromStorage.version !== this.defaultRoot.version) {
                        return false;
                    }
                    for (var key in this.defaultRoot) {
                        if (!(key in fromStorage)) {
                            return false;
                        }
                    }
                    return true;
                };
                Storage.storageVersion = 2;
                Storage.storageKey = "jp.osakana4242.kimiko";
                return Storage;
            })();
            kimiko.Storage = Storage;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));
var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            var SoundChannel = (function () {
                function SoundChannel() {
                    var _this = this;
                    this.isPlaying = false;
                    this.timeoutId = null;
                    this._isEnabled = true;
                    this._onOneLoop = function () {
                        _this.onOneLoop();
                    };
                }
                Object.defineProperty(SoundChannel.prototype, "isEnabled", {
                    get: function () {
                        return this._isEnabled;
                    },
                    set: function (value) {
                        this._isEnabled = value;
                        if (!this._isEnabled) {
                            this.stop();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });


                SoundChannel.prototype.play = function (soundInfo, enchantSound) {
                    if (!this.isEnabled) {
                        return;
                    }
                    this.soundInfo = soundInfo;
                    this.enchantSound = enchantSound;
                    this.isPlaying = true;
                    this._play();
                };

                SoundChannel.prototype.clearTimeout = function () {
                    if (this.timeoutId != null) {
                        window.clearTimeout(this.timeoutId);
                        this.timeoutId = null;
                    }
                };

                SoundChannel.prototype.stop = function () {
                    this.isPlaying = false;
                    this.clearTimeout();
                    this._stop();
                };

                SoundChannel.prototype._play = function () {
                    this.timeoutId = null;
                    this.clearTimeout();
                    this._stop();
                    if (this.isPlaying) {
                        this.enchantSound.play();
                        var time = Math.floor(this.soundInfo.playTime * 1000);
                        this.timeoutId = window.setTimeout(this._onOneLoop, time);
                    }
                };

                SoundChannel.prototype.onOneLoop = function () {
                    if (this.soundInfo.isLoop) {
                        this._play();
                    } else {
                        this.isPlaying = false;
                    }
                };

                SoundChannel.prototype._stop = function () {
                    if (!this.enchantSound) {
                        return;
                    }
                    try  {
                        this.enchantSound.stop();
                    } catch (e) {
                        if (e.message == "DOM Exception: INVALID_STATE_ERR (11)") {
                        } else {
                            throw e;
                        }
                    }
                };
                return SoundChannel;
            })();
            kimiko.SoundChannel = SoundChannel;
            ;

            var Sound = (function () {
                function Sound() {
                    this.channels = {
                        "bgm": new SoundChannel(),
                        "se": new SoundChannel()
                    };
                    this.assetCache = {};
                    this.soundInfos = {};
                }
                Sound.prototype.playBgm = function (assetName, isReplay) {
                    if (!this.channels["bgm"].isEnabled) {
                        return;
                    }
                    cc.audioEngine.playMusic(assetName, true);
                    return;

                    var channel = this.channels["bgm"];
                    if (isReplay || !channel.isPlaying || channel.soundInfo.assetName !== assetName) {
                        this.play("bgm", assetName);
                    }
                };

                Sound.prototype.stopBgm = function () {
                    cc.audioEngine.stopMusic();
                };

                Sound.prototype.playSe = function (assetName) {
                    if (!this.channels["se"].isEnabled) {
                        return;
                    }

                    var soundId = cc.audioEngine.playEffect(assetName, false);
                };

                Sound.prototype.setBgmEnabled = function (value) {
                    this.channels["bgm"].isEnabled = value;
                };

                Sound.prototype.setSeEnabled = function (value) {
                    this.channels["se"].isEnabled = value;
                };

                Sound.prototype.play = function (channelName, assetName) {
                    return;
                    if (!kimiko.g_app.env.isSoundEnabled) {
                        return;
                    }

                    var soundInfo = this.soundInfos[assetName];
                    var asset = this.assetCache[soundInfo.assetName];
                    if (!asset) {
                    }

                    var channel = this.channels[channelName];

                    if (channel.isPlaying && soundInfo.priority < channel.soundInfo.priority) {
                        return;
                    }
                    this.stop(channelName);
                    channel.play(soundInfo, asset);
                };

                Sound.prototype.stop = function (channelName) {
                    if (!kimiko.g_app.env.isSoundEnabled) {
                        return;
                    }

                    var channel = this.channels[channelName];
                    channel.stop();
                };
                Sound.prototype.add = function (soundInfo) {
                    this.soundInfos[soundInfo.assetName] = soundInfo;
                };
                return Sound;
            })();
            kimiko.Sound = Sound;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));
var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            var DF = jp.osakana4242.kimiko.DF;
            var Assets = jp.osakana4242.kimiko.Assets;

            var App = (function () {
                function App() {
                    this.numberUtil = osakana4242.utils.NumberUtil;
                    this.stringUtil = osakana4242.utils.StringUtil;
                    this.isInited = false;
                    this.animFrames = {};
                    this.env = new kimiko.Env();
                }
                App.prototype.init = function (config) {
                    if (kimiko.g_app.isInited) {
                        return;
                    }
                    kimiko.g_app.isInited = true;
                    kimiko.g_app.config = config;
                    kimiko.g_app.storage = new kimiko.Storage();
                    if (kimiko.g_app.config.isClearStorage) {
                        kimiko.g_app.storage.clear();
                    }
                    kimiko.g_app.storage.load();
                    kimiko.g_app.storage.save();
                    kimiko.g_app.sound = new kimiko.Sound();
                    kimiko.g_app.sound.setBgmEnabled(kimiko.g_app.storage.root.userConfig.isBgmEnabled);
                    kimiko.g_app.sound.setSeEnabled(kimiko.g_app.storage.root.userConfig.isSeEnabled);

                    (function () {
                        var SOUND_INFOS = [
                            {
                                "assetName": Assets.SOUND_BGM,
                                "playTime": 27.5,
                                "isLoop": true,
                                "priority": 0
                            },
                            {
                                "assetName": Assets.SOUND_SE_OK,
                                "playTime": 1,
                                "isLoop": false,
                                "priority": 10
                            },
                            {
                                "assetName": Assets.SOUND_SE_CURSOR,
                                "playTime": 0.5,
                                "isLoop": false,
                                "priority": 10
                            },
                            {
                                "assetName": Assets.SOUND_SE_HIT,
                                "playTime": 0.5,
                                "isLoop": false,
                                "priority": 2
                            },
                            {
                                "assetName": Assets.SOUND_SE_KILL,
                                "playTime": 1.0,
                                "isLoop": false,
                                "priority": 3
                            },
                            {
                                "assetName": Assets.SOUND_SE_SHOT,
                                "playTime": 0.3,
                                "isLoop": false,
                                "priority": 1
                            }
                        ];
                        for (var i = 0, iNum = SOUND_INFOS.length; i < iNum; ++i) {
                            kimiko.g_app.sound.add(SOUND_INFOS[i]);
                        }
                    })();

                    (function () {
                        var r = function (animId, imageName, frameWidth, frameHeight, frameSec, frames) {
                            var seq = new osakana4242.utils.AnimSequence(imageName, frameWidth, frameHeight, frameSec, frames);
                            kimiko.g_app.registerAnimFrames(animId, seq);
                        };
                        r(DF.ANIM_ID_CHARA001_WALK, res.chara001_png, 32, 32, 0.1, [0, 1, 0, 2]);
                        r(DF.ANIM_ID_CHARA001_STAND, res.chara001_png, 32, 32, 0.1, [0]);
                        r(DF.ANIM_ID_CHARA001_SQUAT, res.chara001_png, 32, 32, 0.1, [4]);
                        r(DF.ANIM_ID_CHARA001_DEAD, res.chara001_png, 32, 32, 0.1, [0, 1, 0, 2]);

                        r(DF.ANIM_ID_CHARA002_WALK, res.chara002_png, 32, 32, 0.1, [0, 1, 2, 3]);
                        r(DF.ANIM_ID_CHARA003_WALK, res.chara003_png, 64, 64, 0.1, [0, 1, 2, 3]);
                        r(DF.ANIM_ID_CHARA004_WALK, res.chara002_png, 32, 32, 0.1, [4]);
                        r(DF.ANIM_ID_CHARA005_WALK, res.chara002_png, 32, 32, 0.1, [8]);
                        r(DF.ANIM_ID_CHARA006_WALK, res.chara002_png, 32, 32, 0.1, [12]);
                        r(DF.ANIM_ID_CHARA007_WALK, res.chara002_png, 32, 32, 0.1, [16]);
                        r(DF.ANIM_ID_CHARA008_WALK, res.chara002_png, 32, 32, 0.1, [20]);
                        r(DF.ANIM_ID_CHARA009_WALK, res.chara002_png, 32, 32, 0.1, [24]);
                        r(DF.ANIM_ID_CHARA010_WALK, res.chara002_png, 32, 32, 0.1, [28]);
                        r(DF.ANIM_ID_CHARA011_WALK, res.chara004_png, 48, 48, 0.1, [0]);

                        r(DF.ANIM_ID_BULLET001, res.bullet_png, 16, 16, 0.1, [0, 1, 2, 3]);
                        r(DF.ANIM_ID_BULLET002, res.bullet_png, 16, 16, 0.1, [4, 5, 6, 7]);

                        r(DF.ANIM_ID_DAMAGE, res.effect_png, 16, 16, 0.1, [8, 9, 10, 11]);
                        r(DF.ANIM_ID_MISS, res.effect_png, 16, 16, 0.1, [12, 13, 14, 15]);
                        r(DF.ANIM_ID_DEAD, res.effect_png, 16, 16, 0.1, [8, 9, 10, 11]);

                        r(DF.ANIM_ID_COLLIDER, res.collider_png, 16, 16, 0.1, [0]);
                    })();
                };

                App.prototype.destroy = function () {
                    if (kimiko.g_app.testHud) {
                        kimiko.g_app.testHud.release();
                    }
                };

                App.prototype.addTestHudTo = function (scene) {
                    kimiko.g_app.testHud.removeFromParent(true);
                    if (kimiko.g_app.storage.root.userConfig.isFpsVisible) {
                        scene.addChild(kimiko.g_app.testHud);
                        if (scene.aaa) {
                            cc.log("addTestHud to aaa");
                            scene.aaa.addAnchor(kimiko.g_app.testHud, "top");
                        }
                    }
                };

                App.prototype.registerAnimFrames = function (animId, seq) {
                    kimiko.g_app.animFrames[animId] = seq;
                };

                App.prototype.getAnimFrames = function (animId) {
                    return kimiko.g_app.animFrames[animId];
                };

                Object.defineProperty(App.prototype, "core", {
                    get: function () {
                        throw "not support";
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(App.prototype, "fps", {
                    get: function () {
                        return this.config.fps;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(App.prototype, "input", {
                    get: function () {
                        return null;
                    },
                    enumerable: true,
                    configurable: true
                });

                App.prototype.secToFrame = function (sec) {
                    return kimiko.g_app.fps * sec;
                };

                App.prototype.frameToSec = function (frame) {
                    return frame / kimiko.g_app.fps;
                };

                App.prototype.dpsToDpf = function (dotPerSec) {
                    return dotPerSec ? dotPerSec / kimiko.g_app.fps : 0;
                };

                App.prototype.getFrameCountByHoge = function (distance, dps) {
                    return distance / kimiko.g_app.dpsToDpf(dps);
                };

                App.prototype.labeledValuesToObjects = function (list) {
                    var dest = [];
                    var keys = list[0];
                    for (var i = 1, iNum = list.length; i < iNum; ++i) {
                        var record = list[i];
                        var obj = {};
                        for (var j = 0, jNum = keys.length; j < jNum; ++j) {
                            obj[keys[j]] = record[j];
                        }
                        dest.push(obj);
                    }
                    return dest;
                };
                return App;
            })();
            kimiko.App = App;

            kimiko.TestHud = cc.Node.extend({
                ctor: function () {
                    var _this = this;
                    this._super();

                    var group = this;

                    function originLeft(spr) {
                        spr.x += -label.width * (1.0 - label.scaleX) / 2;
                        spr.y += -label.height * (1.0 - label.scaleY) / 2;
                    }

                    this.labels = [];
                    var labelNum = 4;

                    var top = DF.SC_H / 2;
                    var left = -DF.SC_W / 2;

                    for (var i = 0; i < labelNum; ++i) {
                        var label = cc.LabelBMFont.create(" ", res.font_fnt);
                        label.textAlign = cc.TEXT_ALIGNMENT_LEFT;
                        label.width = DF.SC_W / labelNum;
                        label.scaleX = 0.75;
                        label.scaleY = 0.75;
                        label.x = left + (DF.SC_W / labelNum * i);
                        label.y = top - (label.height / 2);

                        this.labels.push(label);
                    }

                    var fpsLabel = (function () {
                        function getTime() {
                            return new Date().getTime();
                        }
                        var label = _this.labels[0];

                        var diffSum = 0;
                        var prevTime = getTime();

                        var sampleCountMax = kimiko.g_app.fps * 3;
                        var sampleCount = 0;
                        var samples = [];
                        for (var i = 0; i < sampleCountMax - 1; ++i) {
                            samples.push(0);
                        }
                        var renderCounter = 0;

                        label.schedule(function () {
                            var nowTime = getTime();
                            var diffTime = Math.floor(nowTime - prevTime);
                            var realFps = 1000 * sampleCountMax / (diffSum + diffTime);
                            diffSum += -samples.shift() + diffTime;
                            samples.push(diffTime);
                            prevTime = nowTime;
                            if (--renderCounter <= 0) {
                                label.setString("FPS " + Math.floor(realFps));
                                renderCounter = kimiko.g_app.secToFrame(1.0);
                            }
                        });
                        return label;
                    })();

                    for (var i = 0; i < labelNum; ++i) {
                        group.addChild(this.labels[i]);
                    }

                    this.scheduleUpdate();
                },
                update: function (deltaTime) {
                    this.labels[1].setString("N:" + this.countNodes(cc.director.getRunningScene().getChildren()));
                },
                countNodes: function (nodes) {
                    if (!nodes) {
                        return 0;
                    }
                    var cnt = 0;
                    for (var i = nodes.length - 1; 0 <= i; --i) {
                        var node = nodes[i];
                        if (node.getChildren() && 1 <= node.getChildren().length) {
                            cnt += this.countNodes(node.getChildren());
                        } else {
                            ++cnt;
                        }
                    }
                    return cnt;
                }
            });

            kimiko.g_app = new App();
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));
var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (scenes) {
                var Fader = (function () {
                    function Fader(targetNode, scSize) {
                        var _this = this;
                        this.targetNode = targetNode;
                        this.color = cc.color(0x80, 0x80, 0x00, 0xff);

                        if (scSize) {
                            this.scSize = scSize;
                        } else {
                            this.scSize = cc.director.getWinSize();
                        }

                        this.film = (function () {
                            var spr = oskn.Plane.create(_this.color, _this.scSize.width, _this.scSize.height);
                            spr.retain();
                            spr.touchEnabled = true;
                            return spr;
                        })();
                    }
                    Fader.prototype.destroy = function () {
                        if (this.film) {
                            this.film.release();
                            this.film = null;
                        }
                    };

                    Fader.prototype.addFilm = function () {
                        this.removeFilm();
                        this.targetNode.addChild(this.film);
                        return this.film;
                    };

                    Fader.prototype.removeFilm = function () {
                        var film = this.film;
                        film.removeFromParent(false);
                        return film;
                    };

                    Object.defineProperty(Fader.prototype, "isOpend", {
                        get: function () {
                            return this.film.getOpacity() === 0.0 && this.film.getNumberOfRunningActions() === 0;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    Fader.prototype.setBlack = function (isBlack) {
                        if (isBlack) {
                            var film = this.addFilm();
                            film.setOpacity(0xff);
                        } else {
                            var film = this.removeFilm();
                            film.setOpacity(0x00);
                        }
                    };

                    Fader.prototype.fadeIn = function (fadeFrame, callback) {
                        if (typeof callback === "undefined") { callback = null; }
                        var film = this.addFilm();
                        film.stopAllActions();
                        film.runAction(cc.Sequence.create(cc.FadeTo.create(fadeFrame, 0.0), cc.CallFunc.create(function () {
                            if (callback) {
                                callback();
                            }
                            film.removeFromParent(false);
                        })));
                    };

                    Fader.prototype.fadeOut = function (fadeFrame, callback) {
                        if (typeof callback === "undefined") { callback = null; }
                        var film = this.addFilm();
                        film.stopAllActions();
                        film.runAction(cc.Sequence.create(cc.FadeTo.create(fadeFrame, 0xff), cc.CallFunc.create(function () {
                            if (callback) {
                                callback();
                            }
                        })));
                    };

                    Fader.prototype.fadeIn2 = function (fadeFrame, target, callback) {
                        var _this = this;
                        if (typeof callback === "undefined") { callback = null; }
                        var films = [];
                        var sideLength = Math.max(this.scSize.width, this.scSize.height);
                        var scW = sideLength;
                        var scH = sideLength;
                        var scLeft = -scW;
                        var scTop = scH;
                        var scRight = scW;
                        var scBottom = -scH;
                        var scCenterX = 0;
                        var scCenterY = 0;

                        var frame = fadeFrame * 0.9;
                        for (var i = 0, iNum = 4; i < iNum; ++i) {
                            var film = oskn.Plane.create(this.color, scW * 2, scH * 2);
                            var mx = 0;
                            var my = 0;
                            switch (i) {
                                case 0:
                                    film.x = scCenterX + film.width / 2 * kimiko.DF.LEFT;
                                    film.y = scCenterY;
                                    mx = (scLeft + film.width / 2 * kimiko.DF.LEFT) - film.x;
                                    my = 0;
                                    break;
                                case 1:
                                    film.x = scCenterX + film.width / 2 * kimiko.DF.RIGHT;
                                    film.y = scCenterY;
                                    mx = (scRight + film.width / 2 * kimiko.DF.RIGHT) - film.x;
                                    my = 0;
                                    break;
                                case 2:
                                    film.x = scCenterX;
                                    film.y = scCenterY + film.height / 2 * kimiko.DF.UP;
                                    mx = 0;
                                    my = (scTop + film.height / 2 * kimiko.DF.UP) - film.y;
                                    break;
                                case 3:
                                    film.x = scCenterX;
                                    film.y = scCenterY + film.height / 2 * kimiko.DF.DOWN;
                                    mx = 0;
                                    my = (scBottom + film.height / 2 * kimiko.DF.DOWN) - film.y;
                                    break;
                            }
                            film.runAction(cc.Sequence.create(cc.EaseSineOut.create(cc.MoveBy.create(frame * 0.4, cc.p(mx * 0.1, my * 0.1))), cc.EaseSineIn.create(cc.MoveBy.create(frame * 0.6, cc.p(mx * 0.9, my * 0.9)))));
                            films.push(film);
                        }

                        var group = cc.Node.create();
                        group.schedule(function () {
                            group.x = target.x;
                            group.y = target.y;
                        });

                        group.runAction(cc.Sequence.create(cc.DelayTime.create(fadeFrame * 0.1), cc.CallFunc.create(function () {
                            for (var i = 0, iNum = films.length; i < iNum; ++i) {
                                group.addChild(films[i]);
                            }
                            _this.setBlack(false);
                        }), cc.DelayTime.create(fadeFrame * 0.9), cc.CallFunc.create(function () {
                            group.removeFromParent(false);
                            if (callback) {
                                callback();
                            }
                        })));
                        this.setBlack(true);
                        this.targetNode.addChild(group);
                    };

                    Fader.prototype.fadeOut2 = function (fadeFrame, target, callback) {
                        var _this = this;
                        if (typeof callback === "undefined") { callback = null; }
                        var films = [];
                        var sideLength = Math.max(this.scSize.width, this.scSize.height);
                        var scW = sideLength;
                        var scH = sideLength;
                        var scLeft = -scW;
                        var scTop = scH;
                        var scRight = scW;
                        var scBottom = -scH;
                        var scCenterX = 0;
                        var scCenterY = 0;

                        var frame = fadeFrame * 0.9;
                        for (var i = 0, iNum = 4; i < iNum; ++i) {
                            var film = oskn.Plane.create(this.color, scW * 2, scH * 2);
                            var mx = 0;
                            var my = 0;
                            switch (i) {
                                case 0:
                                    film.x = scLeft - film.width / 2;
                                    film.y = scCenterY;
                                    mx = (scCenterX - film.width / 2) - film.x;
                                    my = 0;
                                    break;
                                case 1:
                                    film.x = scRight + film.width / 2;
                                    film.y = scCenterY;
                                    mx = (scCenterX + film.width / 2) - film.x;
                                    my = 0;
                                    break;
                                case 2:
                                    film.x = scCenterX;
                                    film.y = scTop + film.height / 2;
                                    mx = 0;
                                    my = (scCenterY + film.height / 2) - film.y;
                                    break;
                                case 3:
                                    film.x = scCenterX;
                                    film.y = scBottom - film.height / 2;
                                    mx = 0;
                                    my = (scCenterY - film.height / 2) - film.y;
                                    break;
                            }
                            film.runAction(cc.Sequence.create(cc.EaseSineOut.create(cc.MoveBy.create(frame * 0.6, cc.p(mx * 0.9, my * 0.9))), cc.EaseSineIn.create(cc.MoveBy.create(frame * 0.4, cc.p(mx * 0.1, my * 0.1)))));

                            films.push(film);
                        }

                        var group = cc.Node.create();
                        group.schedule(function () {
                            group.x = target.x;
                            group.y = target.y;
                        });

                        group.runAction(cc.Sequence.create(cc.DelayTime.create(fadeFrame * 0.9), cc.CallFunc.create(function () {
                            _this.setBlack(true);
                        }), cc.DelayTime.create(fadeFrame * 0.1), cc.CallFunc.create(function () {
                            _this.setBlack(true);
                            group.removeFromParent(false);
                            for (var i = 0, iNum = films.length; i < iNum; ++i) {
                                var film = films[i];
                                film.removeFromParent(false);
                            }
                            if (callback) {
                                callback();
                            }
                        })));

                        for (var i = 0, iNum = films.length; i < iNum; ++i) {
                            group.addChild(films[i]);
                        }

                        this.targetNode.addChild(group);
                    };
                    return Fader;
                })();
                scenes.Fader = Fader;
            })(kimiko.scenes || (kimiko.scenes = {}));
            var scenes = kimiko.scenes;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));
var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (scenes) {
                var g_app = jp.osakana4242.kimiko.g_app;

                scenes.Camera = cc.Node.extend({
                    ctor: function () {
                        this._super();

                        this.width = kimiko.DF.SC1_W;
                        this.height = kimiko.DF.SC1_H;
                        this.setAnchorPoint(cc.p(0.5, 0.5));
                        this.rect = new osakana4242.utils.NodeRect(this);

                        this.guide = oskn.Plane.create(cc.color(0xff, 0x00, 0xff), 8, 8);
                        this.addChild(this.guide);

                        this.limitRect = new osakana4242.utils.Rect(0, 0, 320, 320);
                        this.sleepRect = new osakana4242.utils.Rect(0, 0, this.width + kimiko.DF.ENEMY_SLEEP_RECT_MARGIN, this.height + kimiko.DF.ENEMY_SLEEP_RECT_MARGIN);
                        this.spawnRect = new osakana4242.utils.Rect(0, 0, this.width + kimiko.DF.ENEMY_SPAWN_RECT_MARGIN, this.height + kimiko.DF.ENEMY_SPAWN_RECT_MARGIN);
                        this._targetPos = new osakana4242.utils.Vector2D();
                        this.targetGroup = null;
                        this.targetNode = this;

                        this.scheduleUpdate();
                    },
                    getTargetPosOnCamera: function () {
                        var camera = this;
                        var pos = this.targetNode;
                        var o = {};
                        Object.defineProperty(o, "x", {
                            get: function () {
                                return pos.x - camera.x;
                            },
                            enumerable: true,
                            configurable: true
                        });
                        Object.defineProperty(o, "y", {
                            get: function () {
                                return pos.y - camera.y;
                            },
                            enumerable: true,
                            configurable: true
                        });
                        return o;
                    },
                    moveToTarget: function () {
                        osakana4242.utils.Vector2D.copyFrom(this, this.calcTargetPos());
                    },
                    calcTargetPos: function () {
                        var node = this.targetNode;
                        var camera = this;
                        this._targetPos.x = node.x;
                        this._targetPos.y = node.y;
                        return this._targetPos;
                    },
                    update: function (deltaTime) {
                        var camera = this;
                        var tp = this.calcTargetPos();
                        var speed = g_app.dpsToDpf(3 * 60);
                        var dv = osakana4242.utils.Vector2D.alloc(tp.x - camera.x, tp.y - camera.y);
                        var mv = osakana4242.utils.Vector2D.alloc();
                        var distance = osakana4242.utils.Vector2D.magnitude(dv);

                        if (speed < distance) {
                            mv.x = dv.x * speed / distance;
                            mv.y = dv.y * speed / distance;
                        } else {
                            mv.x = dv.x;
                            mv.y = dv.y;
                        }
                        camera.x = camera.x + mv.x;
                        camera.y = camera.y + mv.y;

                        var marginX = camera.width * 0.25;
                        var marginY = camera.height * 0.25;
                        var limitRect = osakana4242.utils.Rect.alloc(tp.x - (camera.width + marginX) * 0.5, tp.y - (camera.height + marginY) * 0.5, camera.width + marginX, camera.height + marginY);

                        osakana4242.utils.Rect.trimPos(camera.rect, limitRect);

                        osakana4242.utils.Rect.trimPos(camera.rect, camera.limitRect);

                        this.updateGroup();
                        this.updateGuide();

                        osakana4242.utils.Vector2D.free(dv);
                        osakana4242.utils.Vector2D.free(mv);
                        osakana4242.utils.Rect.free(limitRect);
                    },
                    updateGroup: function () {
                        var group = this.targetGroup;
                        if (group) {
                            group.x = Math.round(-this.x);
                            group.y = Math.round(-this.y);
                        }
                    },
                    updateGuide: function () {
                        var guide = this.guide;
                        guide.x = this.width * 0.5;
                        guide.y = this.height * 0.5;
                    },
                    isIntersectSpawnRect: function (entity) {
                        var rect = this.spawnRect;
                        rect.x = this.x - ((rect.width - this.width) / 2);
                        rect.y = this.y - ((rect.height - this.height) / 2);
                        return osakana4242.utils.Rect.intersect(rect, entity);
                    },
                    isOutsideSleepRect: function (entity) {
                        var rect = this.sleepRect;
                        rect.x = this.x - ((rect.width - this.width) / 2);
                        rect.y = this.y - ((rect.height - this.height) / 2);
                        return osakana4242.utils.Rect.outside(rect, entity);
                    }
                });
            })(kimiko.scenes || (kimiko.scenes = {}));
            var scenes = kimiko.scenes;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));

var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (game) {
                var Easing = {};

                (function (EnemyBodys) {
                    function body1(sprite) {
                        sprite.width = 32;
                        sprite.height = 32;
                        sprite.anim.sequence = kimiko.g_app.getAnimFrames(kimiko.DF.ANIM_ID_CHARA002_WALK);
                        osakana4242.utils.Rect.copyFrom(sprite.collider.rect, osakana4242.utils.Collider.centerBottom(sprite, 28, 28));
                    }
                    EnemyBodys.body1 = body1;

                    function body2(sprite) {
                        sprite.width = 64;
                        sprite.height = 64;
                        sprite.anim.sequence = kimiko.g_app.getAnimFrames(kimiko.DF.ANIM_ID_CHARA003_WALK);
                        osakana4242.utils.Rect.copyFrom(sprite.collider.rect, osakana4242.utils.Collider.centerMiddle(sprite, 56, 56));
                        sprite.weaponNum = 3;
                    }
                    EnemyBodys.body2 = body2;

                    function body4(sprite) {
                        sprite.width = 32;
                        sprite.height = 32;
                        sprite.anim.sequence = kimiko.g_app.getAnimFrames(kimiko.DF.ANIM_ID_CHARA004_WALK);
                        osakana4242.utils.Rect.copyFrom(sprite.collider.rect, osakana4242.utils.Collider.centerBottom(sprite, 28, 28));
                    }
                    EnemyBodys.body4 = body4;

                    function body5(sprite) {
                        sprite.width = 32;
                        sprite.height = 32;
                        sprite.anim.sequence = kimiko.g_app.getAnimFrames(kimiko.DF.ANIM_ID_CHARA005_WALK);
                        osakana4242.utils.Rect.copyFrom(sprite.collider.rect, osakana4242.utils.Collider.centerBottom(sprite, 28, 28));
                    }
                    EnemyBodys.body5 = body5;

                    function body6(sprite) {
                        sprite.width = 32;
                        sprite.height = 32;
                        sprite.anim.sequence = kimiko.g_app.getAnimFrames(kimiko.DF.ANIM_ID_CHARA006_WALK);
                        osakana4242.utils.Rect.copyFrom(sprite.collider.rect, osakana4242.utils.Collider.centerBottom(sprite, 28, 28));
                    }
                    EnemyBodys.body6 = body6;

                    function body7(sprite) {
                        sprite.width = 32;
                        sprite.height = 32;
                        sprite.anim.sequence = kimiko.g_app.getAnimFrames(kimiko.DF.ANIM_ID_CHARA007_WALK);
                        osakana4242.utils.Rect.copyFrom(sprite.collider.rect, osakana4242.utils.Collider.centerBottom(sprite, 28, 28));
                    }
                    EnemyBodys.body7 = body7;

                    function body8(sprite) {
                        sprite.width = 32;
                        sprite.height = 32;
                        sprite.anim.sequence = kimiko.g_app.getAnimFrames(kimiko.DF.ANIM_ID_CHARA008_WALK);
                        osakana4242.utils.Rect.copyFrom(sprite.collider.rect, osakana4242.utils.Collider.centerBottom(sprite, 28, 28));
                    }
                    EnemyBodys.body8 = body8;

                    function body9(sprite) {
                        sprite.width = 32;
                        sprite.height = 32;
                        sprite.anim.sequence = kimiko.g_app.getAnimFrames(kimiko.DF.ANIM_ID_CHARA009_WALK);
                        osakana4242.utils.Rect.copyFrom(sprite.collider.rect, osakana4242.utils.Collider.centerBottom(sprite, 28, 28));
                    }
                    EnemyBodys.body9 = body9;

                    function body10(sprite) {
                        sprite.width = 32;
                        sprite.height = 32;
                        sprite.anim.sequence = kimiko.g_app.getAnimFrames(kimiko.DF.ANIM_ID_CHARA010_WALK);
                        osakana4242.utils.Rect.copyFrom(sprite.collider.rect, osakana4242.utils.Collider.centerBottom(sprite, 28, 28));
                    }
                    EnemyBodys.body10 = body10;

                    function body11(sprite) {
                        sprite.width = 48;
                        sprite.height = 48;
                        sprite.anim.sequence = kimiko.g_app.getAnimFrames(kimiko.DF.ANIM_ID_CHARA011_WALK);
                        osakana4242.utils.Rect.copyFrom(sprite.collider.rect, osakana4242.utils.Collider.centerBottom(sprite, 32, 40));
                    }
                    EnemyBodys.body11 = body11;
                })(game.EnemyBodys || (game.EnemyBodys = {}));
                var EnemyBodys = game.EnemyBodys;

                (function (EnemyBrains) {
                    function brain1(sprite) {
                        var anchor = sprite.anchor;

                        sprite.runAction(cc.Sequence.create(cc.CallFunc.create(sprite.lookAtPlayer, sprite), cc.DelayTime.create(0.5), cc.CallFunc.create(function () {
                            var scene = cc.director.getRunningScene();
                            var player = scene.player;
                            var dir = osakana4242.utils.Vector2D.alloc(player.rect.center.x - sprite.rect.center.x, player.rect.center.y - sprite.rect.center.y);
                            var mag = osakana4242.utils.Vector2D.magnitude(dir);
                            var dist = 480;
                            var speed = kimiko.g_app.dpsToDpf(2 * kimiko.DF.BASE_FPS);
                            dir.x = dir.x * dist / mag;
                            dir.y = dir.y * dist / mag;
                            var frame = Math.floor(dist / speed);

                            sprite.lookAtPlayer();

                            sprite.runAction(cc.Sequence.create(cc.MoveBy.create(kimiko.g_app.frameToSec(frame), cc.p(dir.x, dir.y)), cc.CallFunc.create(function () {
                                sprite.life.kill();
                            }, sprite)));

                            osakana4242.utils.Vector2D.free(dir);
                        }, sprite)));
                    }
                    EnemyBrains.brain1 = brain1;

                    function brain2(sprite) {
                        var anchor = sprite.anchor;
                        sprite.weapon.fireFunc = game.WeaponA.fireA;

                        var xMin = anchor.x + (32 * -8);
                        var xMax = anchor.x + (32 * 8);
                        var yMin = anchor.y + (32 * -8);
                        var yMax = anchor.y + (32 * 8);
                        var cnt = 0;
                        function f1() {
                            var isNext = false;
                            var scene = cc.director.getRunningScene();
                            var player = scene.player;
                            var dir = osakana4242.utils.Vector2D.alloc(kimiko.g_app.numberUtil.trim(player.rect.center.x, xMin, xMax) - sprite.rect.center.x, kimiko.g_app.numberUtil.trim(player.rect.center.y, yMin, yMax) - sprite.rect.center.y);
                            var mag = osakana4242.utils.Vector2D.magnitude(dir);

                            var dist = 32 * 4;
                            if (dist < 4) {
                                isNext = false;
                            } else {
                                var speed = kimiko.g_app.dpsToDpf(2 * kimiko.DF.BASE_FPS);
                                dir.x = dir.x * dist / mag;
                                dir.y = dir.y * dist / mag;
                                var frame = (speed === 0) ? 1 : Math.max(Math.floor(dist / speed), 1);

                                sprite.lookAtPlayer();

                                sprite.runAction(cc.Sequence.create(cc.MoveTo.create(kimiko.g_app.frameToSec(frame), cc.p(sprite.x + dir.x, sprite.y + dir.y)), cc.CallFunc.create(function () {
                                    if (2 <= sprite.enemyData.level) {
                                        sprite.weapon.lookAtPlayer();
                                        sprite.weapon.startFire();
                                    }
                                }), cc.DelayTime.create(0.5), oskn.WaitUntil.create(f1)));
                                isNext = true;
                            }
                            osakana4242.utils.Vector2D.free(dir);
                            return isNext;
                        }
                        sprite.runAction(cc.Sequence.create(oskn.WaitUntil.create(f1)));
                    }
                    EnemyBrains.brain2 = brain2;

                    function brain3(sprite) {
                        var anchor = sprite.anchor;
                        sprite.weapon.fireFunc = game.WeaponA.fireA;

                        sprite.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.CallFunc.create(function () {
                            sprite.scaleX = -1;
                        }), cc.MoveBy.create(0.5, cc.p(kimiko.VecX.L * 32 * 4 * 0.5, kimiko.VecY.U * 32 * 3)), cc.MoveBy.create(0.5, cc.p(kimiko.VecX.L * 32 * 4 * 0.5, kimiko.VecY.D * 32 * 3)), cc.DelayTime.create(0.25), cc.CallFunc.create(function () {
                            if (2 <= sprite.enemyData.level) {
                                sprite.weapon.lookAtPlayer();
                                sprite.weapon.startFire();
                            }
                        }), cc.CallFunc.create(function () {
                            sprite.scaleX = 1;
                        }), cc.MoveBy.create(0.5, cc.p(kimiko.VecX.R * 32 * 4 * 0.5, kimiko.VecY.U * 32 * 3)), cc.MoveBy.create(0.5, cc.p(kimiko.VecX.R * 32 * 4 * 0.5, kimiko.VecY.D * 32 * 3)), cc.DelayTime.create(0.25))));
                    }
                    EnemyBrains.brain3 = brain3;

                    function brain4(sprite) {
                        sprite.scaleY = -1;
                        var anchor = sprite.anchor;
                        sprite.weapon.fireFunc = game.WeaponA.fireA;

                        sprite.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.CallFunc.create(function () {
                            sprite.scaleX = -1;
                        }), cc.MoveBy.create(0.5, cc.p(kimiko.VecX.L * 32 * 4 * 0.5, kimiko.VecY.D * 32 * 3)), cc.MoveBy.create(0.5, cc.p(kimiko.VecX.L * 32 * 4 * 0.5, kimiko.VecY.U * 32 * 3)), cc.DelayTime.create(0.25), cc.CallFunc.create(function () {
                            if (2 <= sprite.enemyData.level) {
                                sprite.weapon.lookAtPlayer();
                                sprite.weapon.startFire();
                            }
                        }), cc.CallFunc.create(function () {
                            sprite.scaleX = 1;
                        }), cc.MoveBy.create(0.5, cc.p(kimiko.VecX.R * 32 * 4 * 0.5, kimiko.VecY.D * 32 * 3)), cc.MoveBy.create(0.5, cc.p(kimiko.VecX.R * 32 * 4 * 0.5, kimiko.VecY.U * 32 * 3)), cc.DelayTime.create(0.25))));
                    }
                    EnemyBrains.brain4 = brain4;

                    function brain5(sprite) {
                        var anchor = sprite.anchor;
                        var totalFrame = kimiko.g_app.secToFrame(8.0);
                        sprite.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.MoveTo.create(0.5, cc.p(anchor.x + kimiko.VecX.L * 32 * 3 + sprite.width / 2, anchor.y)), cc.MoveTo.create(0.5, cc.p(anchor.x + 0 + sprite.width / 2, anchor.y)))));
                    }
                    EnemyBrains.brain5 = brain5;

                    function brain6(sprite) {
                        var anchor = sprite.anchor;
                        sprite.weapon.fireFunc = game.WeaponA.fireA;

                        var fire = function () {
                            sprite.lookAtPlayer();
                            if (2 <= sprite.enemyData.level) {
                                sprite.weapon.lookAtPlayer();
                                sprite.weapon.startFire();
                            }
                        };

                        sprite.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.MoveTo.create(0.5, cc.p(anchor.x + kimiko.VecX.L * 32 * 0.5, anchor.y + kimiko.VecY.U * 32 * 0.5)), cc.MoveTo.create(0.5, cc.p(anchor.x + kimiko.VecX.R * 32 * 0.5, anchor.y + kimiko.VecY.U * 32 * 0.5)), cc.MoveTo.create(0.5, cc.p(anchor.x + kimiko.VecX.L * 32 * 0.5, anchor.y + kimiko.VecY.D * 32 * 0.5)), cc.MoveTo.create(0.5, cc.p(anchor.x + kimiko.VecX.R * 32 * 0.0, anchor.y + kimiko.VecY.D * 32 * 0.0)), cc.CallFunc.create(fire), cc.MoveTo.create(0.5, cc.p(anchor.x + kimiko.VecX.R * 32 * 0.5, anchor.y + kimiko.VecY.D * 32 * 0.5)))));
                    }
                    EnemyBrains.brain6 = brain6;

                    function brain7(sprite) {
                        var anchor = sprite.anchor;
                        sprite.weapon.fireFunc = game.WeaponA.fireA;

                        var fire = function () {
                            sprite.lookAtPlayer();
                            if (2 <= sprite.enemyData.level) {
                                sprite.weapon.lookAtPlayer();
                                sprite.weapon.startFire();
                            }
                        };

                        var totalFrame = kimiko.g_app.secToFrame(2.0);
                        sprite.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.CallFunc.create(sprite.lookAtPlayer, sprite), cc.MoveTo.create(0.5, cc.p(anchor.x, anchor.y + 32 * kimiko.VecY.D)), cc.CallFunc.create(fire), cc.MoveTo.create(0.5, cc.p(anchor.x, anchor.y + 32 * kimiko.VecY.U)), cc.CallFunc.create(fire))));
                    }
                    EnemyBrains.brain7 = brain7;

                    function brain8(sprite) {
                        var anchor = sprite.anchor;

                        sprite.runAction(cc.Sequence.create(cc.CallFunc.create(sprite.lookAtPlayer, sprite), cc.DelayTime.create(0.5), cc.CallFunc.create(function () {
                            var scene = cc.director.getRunningScene();
                            var player = scene.player;
                            var dir = osakana4242.utils.Vector2D.alloc(player.rect.center.x - sprite.rect.center.x, player.rect.center.y - sprite.rect.center.y);
                            var mag = osakana4242.utils.Vector2D.magnitude(dir);
                            var dist = 480;
                            var speed = kimiko.g_app.dpsToDpf(2 * kimiko.DF.BASE_FPS);
                            dir.x = dir.x * dist / mag;
                            dir.y = 0;
                            var frame = Math.floor(dist / speed);

                            sprite.lookAtPlayer();

                            sprite.runAction(cc.Sequence.create(cc.MoveBy.create(kimiko.g_app.frameToSec(frame), cc.p(dir.x, dir.y)), cc.CallFunc.create(function () {
                                sprite.life.kill();
                            })));

                            osakana4242.utils.Vector2D.free(dir);
                        })));
                    }
                    EnemyBrains.brain8 = brain8;

                    function brain9(sprite) {
                        var anchor = sprite.anchor;
                        var xMin = anchor.x + (32 * -2) + sprite.width / 2;
                        var xMax = anchor.x + (32 * 2) + sprite.width / 2;
                        var cnt = 0;
                        function f1(e) {
                            if (e) {
                                return false;
                            }
                            var isNext = false;
                            var scene = cc.director.getRunningScene();
                            var player = scene.player;
                            var dir = osakana4242.utils.Vector2D.alloc(kimiko.g_app.numberUtil.trim(player.rect.center.x, xMin, xMax) - sprite.rect.center.x, 0);
                            var mag = osakana4242.utils.Vector2D.magnitude(dir);
                            if (mag < 4) {
                                isNext = false;
                            } else {
                                var dist = mag;
                                var speed = kimiko.g_app.dpsToDpf(1 * kimiko.DF.BASE_FPS);
                                dir.x = dir.x * dist / mag;
                                dir.y = dir.y * dist / mag;
                                var frame = (speed === 0) ? 1 : Math.max(Math.floor(dist / speed), 1);
                                sprite.lookAtPlayer();
                                sprite.runAction(cc.Sequence.create(cc.MoveBy.create(kimiko.g_app.frameToSec(frame), cc.p(sprite.x + dir.x, sprite.y + dir.y)), cc.DelayTime.create(0.2), oskn.WaitUntil.create(f1)));
                                isNext = true;
                            }
                            osakana4242.utils.Vector2D.free(dir);
                            return isNext;
                        }
                        sprite.runAction(oskn.WaitUntil.create(f1));
                    }
                    EnemyBrains.brain9 = brain9;

                    function brainBoss(sprite) {
                        var anchor = sprite.anchor;

                        var waitFire = function () {
                            return !sprite.weapon.isStateFire();
                        };

                        function runup() {
                            return sprite.tl.delay(kimiko.g_app.secToFrame(1.0)).moveBy(0, -24, kimiko.g_app.secToFrame(0.2), Easing.CUBIC_EASEOUT).moveBy(0, 24, kimiko.g_app.secToFrame(0.2), Easing.CUBIC_EASEOUT).moveBy(0, -8, kimiko.g_app.secToFrame(0.1), Easing.CUBIC_EASEOUT).moveBy(0, 8, kimiko.g_app.secToFrame(0.1), Easing.CUBIC_EASEOUT);
                        }

                        function fireToPlayer() {
                            var wp = sprite.weapons[0];
                            wp.fireCount = 5;
                            wp.wayNum = 2;
                            wp.fireInterval = kimiko.g_app.secToFrame(0.5);
                            wp.speed = kimiko.g_app.dpsToDpf(3 * kimiko.DF.BASE_FPS);
                            wp.fireFunc = game.WeaponA.fireC;
                            wp.isTracePlayer = true;
                            wp.lookAtPlayer();
                            wp.startFire();

                            wp = sprite.weapons[1];
                            wp.fireCount = 3;
                            wp.wayNum = 1;
                            wp.fireInterval = kimiko.g_app.secToFrame(0.75);
                            wp.speed = kimiko.g_app.dpsToDpf(2 * kimiko.DF.BASE_FPS);
                            wp.fireFunc = game.WeaponA.fireA;
                            wp.isTracePlayer = true;
                            wp.startFire();
                        }

                        function fireToPlayer2() {
                            var wp = sprite.weapon;
                            wp.fireCount = 9;
                            wp.wayNum = 1;
                            wp.fireInterval = kimiko.g_app.secToFrame(0.5);
                            wp.speed = kimiko.g_app.dpsToDpf(3 * kimiko.DF.BASE_FPS);
                            wp.fireFunc = game.WeaponA.fireB;
                            wp.isTracePlayer = true;
                            wp.lookAtPlayer();
                            wp.startFire();

                            wp = sprite.weapons[1];
                            wp.fireCount = 1;
                            wp.wayNum = 1;
                            wp.fireInterval = kimiko.g_app.secToFrame(1.5);
                            wp.speed = kimiko.g_app.dpsToDpf(1 * kimiko.DF.BASE_FPS);
                            wp.fireFunc = game.WeaponA.fireA;
                            wp.isTracePlayer = true;
                            wp.startFire();
                        }

                        function fireToPlayer3() {
                            var wp = sprite.weapons[0];
                            wp.fireCount = 1;
                            wp.wayNum = 4;
                            wp.fireInterval = kimiko.g_app.secToFrame(0.5);
                            wp.speed = kimiko.g_app.dpsToDpf(1 * kimiko.DF.BASE_FPS);
                            wp.fireFunc = game.WeaponA.fireA;
                            wp.isTracePlayer = false;
                            wp.lookAtPlayer();
                            wp.startFire();

                            wp = sprite.weapons[1];
                            wp.fireCount = 2;
                            wp.wayNum = 1;
                            wp.fireInterval = kimiko.g_app.secToFrame(0.2);
                            wp.speed = kimiko.g_app.dpsToDpf(3 * kimiko.DF.BASE_FPS);
                            wp.fireFunc = game.WeaponA.fireA;
                            wp.isTracePlayer = true;
                            wp.startFire();
                        }

                        function fire1() {
                            return runup().then(fireToPlayer).delay(kimiko.g_app.secToFrame(0.5)).waitUntil(waitFire);
                        }

                        function fire2() {
                            return runup().then(fireToPlayer2).waitUntil(waitFire);
                        }

                        function fire3() {
                            return runup().then(fireToPlayer3).delay(kimiko.g_app.secToFrame(0.5)).waitUntil(waitFire);
                        }

                        var top = sprite.anchor.y - 96;
                        var bottom = sprite.anchor.y;
                        var left = sprite.anchor.x - 224;
                        var right = sprite.anchor.x + 0;
                        sprite.x = right;
                        sprite.y = top;
                        sprite.tl.then(sprite.lookAtPlayer).delay(kimiko.g_app.secToFrame(1.0)).moveTo(right, bottom, kimiko.g_app.secToFrame(2.0)).scaleTo(-1.0, 1.0, 1).delay(kimiko.g_app.secToFrame(0.5)).then(function () {
                            sprite.tl.moveBy(32, 0, kimiko.g_app.secToFrame(1.0), Easing.CUBIC_EASEIN).moveTo(left, bottom, kimiko.g_app.secToFrame(0.5), Easing.CUBIC_EASEIN).scaleTo(1.0, 1.0, 1);
                            fire2().moveTo(left, top, kimiko.g_app.secToFrame(1.0));
                            fire1().moveBy(-32, 0, kimiko.g_app.secToFrame(1.0), Easing.CUBIC_EASEIN).moveTo(right, top, kimiko.g_app.secToFrame(0.5), Easing.CUBIC_EASEIN).scaleTo(-1.0, 1.0, 1);
                            fire2().moveTo(right, bottom, kimiko.g_app.secToFrame(1.0));
                            fire1().moveTo(left, top, kimiko.g_app.secToFrame(2.0)).then(sprite.lookAtRight);
                            fire3().moveBy(-32, 0, kimiko.g_app.secToFrame(1.0), Easing.CUBIC_EASEIN).moveTo(right, top, kimiko.g_app.secToFrame(0.5), Easing.CUBIC_EASEIN).then(sprite.lookAtLeft);
                            fire3().moveBy(32, 0, kimiko.g_app.secToFrame(1.0), Easing.CUBIC_EASEIN).moveTo(left, top, kimiko.g_app.secToFrame(0.5), Easing.CUBIC_EASEIN).then(sprite.lookAtRight);
                            fire3().moveBy(-32, 0, kimiko.g_app.secToFrame(1.0), Easing.CUBIC_EASEIN).moveTo(right, top, kimiko.g_app.secToFrame(0.5)).then(sprite.lookAtLeft);
                            fire3().delay(kimiko.g_app.secToFrame(1.0)).moveTo(right, bottom, kimiko.g_app.secToFrame(2.0)).loop();
                        });
                    }
                    EnemyBrains.brainBoss = brainBoss;
                })(game.EnemyBrains || (game.EnemyBrains = {}));
                var EnemyBrains = game.EnemyBrains;

                game.EnemyData = {
                    0x0: {
                        hpMax: 2,
                        level: 1,
                        body: EnemyBodys.body9,
                        brain: EnemyBrains.brain1,
                        score: 100,
                        align: "center middle"
                    },
                    0x1: {
                        hpMax: 2,
                        level: 1,
                        body: EnemyBodys.body9,
                        brain: EnemyBrains.brain1,
                        score: 100,
                        align: "center middle"
                    },
                    0x2: {
                        hpMax: 2,
                        level: 1,
                        body: EnemyBodys.body10,
                        brain: EnemyBrains.brain2,
                        score: 100,
                        align: "center middle"
                    },
                    0x3: {
                        hpMax: 2,
                        level: 1,
                        body: EnemyBodys.body6,
                        brain: EnemyBrains.brain3,
                        score: 100,
                        align: "center bottom"
                    },
                    0x4: {
                        hpMax: 2,
                        level: 1,
                        body: EnemyBodys.body6,
                        brain: EnemyBrains.brain4,
                        score: 100,
                        align: "center top"
                    },
                    0x5: {
                        hpMax: 16,
                        level: 1,
                        body: EnemyBodys.body11,
                        brain: EnemyBrains.brain5,
                        score: 100,
                        align: "center bottom"
                    },
                    0x6: {
                        hpMax: 2,
                        level: 1,
                        body: EnemyBodys.body4,
                        brain: EnemyBrains.brain6,
                        score: 100,
                        align: "center middle"
                    },
                    0x7: {
                        hpMax: 2,
                        level: 1,
                        body: EnemyBodys.body5,
                        brain: EnemyBrains.brain7,
                        score: 100,
                        align: "center middle"
                    },
                    0x8: {
                        hpMax: 2,
                        level: 1,
                        body: EnemyBodys.body7,
                        brain: EnemyBrains.brain8,
                        score: 100,
                        align: "center middle"
                    },
                    0x9: {
                        hpMax: 2,
                        level: 1,
                        body: EnemyBodys.body8,
                        brain: EnemyBrains.brain9,
                        score: 100,
                        align: "center bottom"
                    },
                    0xa: {
                        hpMax: 2,
                        level: 2,
                        body: EnemyBodys.body4,
                        brain: EnemyBrains.brain6,
                        score: 100,
                        align: "center middle"
                    },
                    0xb: {
                        hpMax: 2,
                        level: 2,
                        body: EnemyBodys.body5,
                        brain: EnemyBrains.brain7,
                        score: 100,
                        align: "center middle"
                    },
                    0xf: {
                        hpMax: 100,
                        level: 1,
                        body: EnemyBodys.body2,
                        brain: EnemyBrains.brainBoss,
                        score: 1000,
                        align: "center bottom"
                    }
                };

                game.Enemy = cc.Sprite.extend({
                    rect: null,
                    anim: null,
                    enemyId: -1,
                    score: 0,
                    ctor: function () {
                        this._super();

                        this.rect = new osakana4242.utils.NodeRect(this);
                        this.anim = new osakana4242.utils.AnimSequencer(this);
                        this.weapons = [];
                        for (var i = 0, iNum = 8; i < iNum; ++i) {
                            this.weapons[i] = new jp.osakana4242.kimiko.game.WeaponA(this);
                        }
                        this.weaponNum = 1;
                        this.anchor = new osakana4242.utils.Vector2D();
                        this.collider = new osakana4242.utils.Collider();
                        this.collider.parent = this;
                        this.life = new game.Life(this);

                        this.life.setGhostFrameMax(kimiko.g_app.secToFrame(0.0));

                        this.scheduleUpdate();
                    },
                    update: function (deltaTime) {
                        this.life.step();
                        for (var i = this.weaponNum - 1; 0 <= i; --i) {
                            this.weapons[i].step();
                        }
                    },
                    weapon: { get: function () {
                            return this.weapons[0];
                        } },
                    enemyData: { get: function () {
                            return game.EnemyData[this.enemyId];
                        } },
                    isBoss: function () {
                        return this.enemyId === kimiko.DF.ENEMY_ID_BOSS;
                    },
                    onDead: function () {
                        var scene = cc.director.getRunningScene();
                        var effect = scene.addEffect(kimiko.DF.ANIM_ID_DEAD, this.rect.center);
                        effect.scaleX = 2.0;
                        effect.scaleY = 2.0;

                        this.visible = false;
                    },
                    lookAtPlayer: function () {
                        var scene = cc.director.getRunningScene();
                        var player = scene.player;
                        this.lookAtPosition(player.rect.center);
                    },
                    lookAtPosition: function (pos) {
                        var distX = pos.x - this.rect.center.x;
                        this.scaleX = distX < 0 ? -1 : 1;
                    },
                    lookAtLeft: function () {
                        this.scaleX = -1;
                    },
                    lookAtRight: function () {
                        this.scaleX = 1;
                    }
                });
            })(kimiko.game || (kimiko.game = {}));
            var game = kimiko.game;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));
var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (game) {
                var g_app = jp.osakana4242.kimiko.g_app;
                var DF = jp.osakana4242.kimiko.DF;

                game.EnemyBullet = cc.Sprite.extend({
                    ctor: function () {
                        var _this = this;
                        this._super();
                        this.width = 16;
                        this.height = 16;

                        this.anim = new osakana4242.utils.AnimSequencer(this);
                        this.anim.sequence = g_app.getAnimFrames(DF.ANIM_ID_BULLET002);
                        this.ageMax = 0;
                        this.force = new osakana4242.utils.Vector2D();
                        this.force.x = 0;
                        this.force.y = 0;
                        this.oldPos = new osakana4242.utils.Vector2D();
                        this.collider = (function () {
                            var c = new osakana4242.utils.Collider();
                            c.parent = _this;
                            osakana4242.utils.Rect.copyFrom(c.rect, osakana4242.utils.Collider.centerMiddle(_this, 4, 4));
                            return c;
                        })();
                    },
                    onenterframe: function () {
                        this.force.x = this.x - this.oldPos.x;
                        this.force.y = this.y - this.oldPos.y;
                        osakana4242.utils.Vector2D.copyFrom(this.oldPos, this);

                        var camera = this.scene.camera;

                        if (this.ageMax < this.age) {
                            this.miss();
                            return;
                        }

                        if (camera.isOutsideSleepRect(this)) {
                            this.miss();
                            return;
                        }

                        if (!this.scene.intersectActiveArea(this)) {
                            this.miss();
                            return;
                        }

                        this.scene.checkMapCollision(this, this.miss);
                    },
                    miss: function () {
                        this.scene.addEffect(DF.ANIM_ID_MISS, this.center);
                        this.free();
                    },
                    free: function () {
                        this.scene.enemyBulletPool.free(this);
                    }
                });
            })(kimiko.game || (kimiko.game = {}));
            var game = kimiko.game;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));
var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (game) {
                var GameMap = (function () {
                    function GameMap() {
                        this.layers = {};
                    }
                    GameMap.prototype.load = function (name) {
                        this.layers = {};
                        this.map.removeAllChildren(true);
                        this.map.initWithTMXFile(name);
                    };

                    GameMap.prototype.getLayer = function (name) {
                        var la = this.layers[name];
                        if (!la) {
                            var layer = this.map.getLayer(name);
                            if (!layer) {
                                throw "layer not found. name:" + name;
                            }
                            la = this.layers[name] = new GameMapLayer(layer);
                        }
                        return la;
                    };

                    GameMap.create = function () {
                        cc.log("GameMap.create");
                        var self = new GameMap();
                        self.map = cc.TMXTiledMap.create(res.map101_tmx);
                        if (!self.map) {
                            throw "map create failed?";
                        }
                        return self;
                    };
                    return GameMap;
                })();
                game.GameMap = GameMap;

                var GameMapLayer = (function () {
                    function GameMapLayer(layer) {
                        this.layer = layer;
                    }
                    GameMapLayer.prototype.getTileGIDByWorldPos = function (wldPos) {
                        var layer = this.layer;
                        var size = layer.getLayerSize();
                        var gridPos = this.worldToGridPos(wldPos);
                        if (gridPos.x < 0 || size.width <= gridPos.x || gridPos.y < 0 || size.height <= gridPos.y) {
                            return 0;
                        }
                        var gid = layer.getTileGIDAt(gridPos);
                        return gid;
                    };

                    GameMapLayer.prototype.worldToGridPos = function (wldPos) {
                        var layer = this.layer;
                        var size = layer.getLayerSize();
                        return cc.p(Math.floor(wldPos.x / layer.tileWidth), Math.floor((layer.height - wldPos.y) / layer.tileHeight));
                    };

                    GameMapLayer.prototype.gridToWorldPos = function (gridPos) {
                        var layer = this.layer;
                        return cc.p(gridPos.x * layer.tileWidth, layer.height - gridPos.y * layer.tileHeight);
                    };

                    GameMapLayer.prototype.eachTileGIDs = function (func) {
                        var layer = this.layer;
                        var size = layer.getLayerSize();
                        var p = cc.p(0, 0);
                        for (var y = 0, yNum = size.height; y < yNum; ++y) {
                            for (var x = 0, xNum = size.width; x < xNum; ++x) {
                                p.x = x;
                                p.y = y;
                                func(layer.getTileGIDAt(p), p, this);
                            }
                        }
                    };

                    GameMapLayer.prototype.getGID = function (wldX, wldY) {
                        var layer = this.layer;
                        var size = layer.getLayerSize();
                        var x = Math.floor(wldX / layer.tileWidth);
                        var y = Math.floor((layer.height - wldY) / layer.tileHeight);
                        if (x < 0 || size.width <= x || y < 0 || size.height <= y) {
                            return 0;
                        }
                        var gid = layer.getTileGIDAt(cc.p(x, y));
                        return gid;
                    };
                    return GameMapLayer;
                })();
                game.GameMapLayer = GameMapLayer;
            })(kimiko.game || (kimiko.game = {}));
            var game = kimiko.game;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));
var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (game) {
                var g_app = jp.osakana4242.kimiko.g_app;

                var Life = (function () {
                    function Life(sprite) {
                        this.sprite = sprite;
                        this.hpMax = 100;
                        this.hp = this.hpMax;
                        this.ghostFrameMax = g_app.secToFrame(1.0);
                        this.ghostFrameCounter = 0;
                        this.damageFrameMax = g_app.secToFrame(0.2);

                        this.damageFrameCounter = 0;
                    }
                    Life.prototype.setGhostFrameMax = function (frameMax) {
                        this.ghostFrameMax = frameMax;
                        this.ghostFrameCounter = 0;
                    };

                    Life.prototype.step = function () {
                        if (this.isDamageTime || this.isGhostTime) {
                            if (this.isDamageTime) {
                                --this.damageFrameCounter;
                            }
                            if (this.isGhostTime) {
                                --this.ghostFrameCounter;
                            }

                            if (this.isDamageTime) {
                                this.sprite.visible = (this.damageFrameCounter & 0x1) === 0;
                            } else if (this.isGhostTime) {
                                this.sprite.visible = (this.ghostFrameCounter & 0x1) === 0;
                            } else {
                                this.sprite.visible = true;
                            }
                        }
                    };

                    Object.defineProperty(Life.prototype, "isAlive", {
                        get: function () {
                            return 0 < this.hp;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(Life.prototype, "isDead", {
                        get: function () {
                            return !this.isAlive;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    Object.defineProperty(Life.prototype, "isGhostTime", {
                        get: function () {
                            return 0 < this.ghostFrameCounter;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(Life.prototype, "isDamageTime", {
                        get: function () {
                            return 0 < this.damageFrameCounter;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    Object.defineProperty(Life.prototype, "canAddDamage", {
                        get: function () {
                            return this.isAlive && !this.isGhostTime;
                        },
                        enumerable: true,
                        configurable: true
                    });

                    Life.prototype.addDamage = function (v) {
                        if (!g_app.config.isDamageEnabled) {
                            v = 0;
                        }

                        this.hp -= v;
                        this.ghostFrameCounter = this.ghostFrameMax;
                        this.damageFrameCounter = this.damageFrameMax;

                        if (0 < this.hp) {
                        } else {
                            this.kill();
                        }
                    };

                    Life.prototype.recover = function () {
                        this.hp = this.hpMax;
                        this.ghostFrameCounter = 0;
                        this.damageFrameCounter = 0;
                    };

                    Life.prototype.kill = function () {
                        this.hp = 0;
                        var onDead = this.sprite["onDead"];
                        if (onDead) {
                            onDead.call(this.sprite);
                        }
                    };

                    Life.prototype.resetCounter = function () {
                        this.ghostFrameCounter = 0;
                        this.damageFrameCounter = 0;
                    };
                    return Life;
                })();
                game.Life = Life;
            })(kimiko.game || (kimiko.game = {}));
            var game = kimiko.game;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));
var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (game) {
                var g_app = jp.osakana4242.kimiko.g_app;

                var MapCharaManager = (function () {
                    function MapCharaManager(scene) {
                        this.sleeps = [];
                        this.actives = [];
                        this.deads = [];
                        this.scene = scene;
                    }
                    MapCharaManager.prototype.isAllDead = function () {
                        if (0 < this.sleeps.length) {
                            return false;
                        }
                        return this.getAliveCount() === 0;
                    };

                    MapCharaManager.prototype.clear = function () {
                        var arr = this.actives;
                        for (var i = arr.length - 1; 0 <= i; --i) {
                            var chara = arr.pop();
                            if (chara.parentNode) {
                                chara.parentNode.removeChild(chara);
                            }
                        }
                        this.actives.length = 0;
                        this.deads.length = 0;
                        this.sleeps.length = 0;
                    };

                    MapCharaManager.prototype.addSleep = function (sleep) {
                        this.sleeps.push(sleep);
                    };

                    MapCharaManager.prototype.step = function () {
                        this.checkSpawn();
                        this.checkSleep();
                    };

                    MapCharaManager.prototype.getAliveCount = function () {
                        var count = this.sleeps.length;
                        for (var i = this.actives.length - 1; 0 <= i; --i) {
                            if (this.actives[i].life.isAlive) {
                                ++count;
                            }
                        }
                        return count;
                    };

                    MapCharaManager.prototype.checkSpawn = function () {
                        var scene = this.scene;
                        var camera = this.scene.camera;
                        var arr = this.sleeps;
                        for (var i = arr.length - 1; 0 <= i; --i) {
                            var chara = arr[i];
                            if (!camera.isIntersectSpawnRect(chara)) {
                                continue;
                            }
                            arr.splice(i, 1);
                            this.actives.push(chara);

                            scene.world.addChild(chara);
                        }
                    };

                    MapCharaManager.prototype.checkSleep = function () {
                        var scene = this.scene;
                        var camera = this.scene.camera;
                        var arr = this.actives;
                        for (var i = arr.length - 1; 0 <= i; --i) {
                            var chara = arr[i];

                            if (chara.life.isDead) {
                                arr.splice(i, 1);
                                this.deads.push(chara);
                                chara.removeFromParent(false);
                                continue;
                            }

                            if (!camera.isOutsideSleepRect(chara)) {
                                continue;
                            }
                            arr.splice(i, 1);
                            this.sleeps.push(chara);
                            if (chara.parentNode) {
                                chara.parentNode.removeChild(chara);
                            }
                        }
                    };
                    return MapCharaManager;
                })();
                game.MapCharaManager = MapCharaManager;
            })(kimiko.game || (kimiko.game = {}));
            var game = kimiko.game;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));
var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (game) {
                var g_app = jp.osakana4242.kimiko.g_app;
                var DF = jp.osakana4242.kimiko.DF;

                game.OwnBullet = cc.Sprite.extend({
                    ctor: function () {
                        var _this = this;
                        this._super();

                        this.width = 16;
                        this.height = 16;
                        this.rect = new osakana4242.utils.NodeRect(this);
                        this.anim = new osakana4242.utils.AnimSequencer(this);
                        this.anim.sequence = g_app.getAnimFrames(DF.ANIM_ID_BULLET001);
                        this.ageMax = 0;
                        this.force = new osakana4242.utils.Vector2D();
                        this.force.x = 0;
                        this.force.y = 0;
                        this.collider = (function () {
                            var c = new osakana4242.utils.Collider();
                            c.parent = _this;
                            osakana4242.utils.Rect.copyFrom(c.rect, new osakana4242.utils.Rect(-24, 4, 32, 8));
                            return c;
                        })();
                        this._miss = function () {
                            _this.miss();
                        };
                        this.scheduleUpdate();
                    },
                    onEnter: function () {
                        this._super();
                    },
                    update: function (deltaTime) {
                        ++this.age;

                        this.oldX = this.x;
                        this.oldY = this.y;
                        this.x += this.force.x;
                        this.y += this.force.y;
                        var scene = cc.director.getRunningScene();
                        var camera = scene.camera;

                        if (this.ageMax <= this.age) {
                            this.miss();
                            return;
                        }

                        if (camera.isOutsideSleepRect(this)) {
                            this.miss();
                            return;
                        }

                        if (!scene.intersectActiveArea(this)) {
                            this.miss();
                            return;
                        }

                        scene.checkMapCollision(this, this._miss);
                    },
                    miss: function () {
                        var scene = cc.director.getRunningScene();
                        scene.addEffect(DF.ANIM_ID_MISS, this.rect.center);
                        this.free();
                    },
                    free: function () {
                        var scene = cc.director.getRunningScene();
                        scene.ownBulletPool.free(this);
                    }
                });
            })(kimiko.game || (kimiko.game = {}));
            var game = kimiko.game;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));
var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (game) {
                var g_app = jp.osakana4242.kimiko.g_app;
                var DF = jp.osakana4242.kimiko.DF;

                game.PauseMenu = cc.Node.extend({
                    ctor: function (exitListener) {
                        this._super();

                        this.exitListener = exitListener;

                        var scene = this;

                        this.layouter = new kimiko.SpriteLayouter(this);
                        this.layouter.layout = (function () {
                            var list = [
                                ["spriteName", "layoutName", "visible", "delay", "x", "y"],
                                ["resumeBtn", "hide", false, 0.1 * 0, 0, -0 - 0 + 10],
                                ["toTitleBtn", "hide", false, 0.1 * 1, 0, -0 - 52 + 10],
                                ["resumeBtn", "normal", true, 0.1 * 0, 0, -0 - 0],
                                ["toTitleBtn", "normal", true, 0.1 * 1, 0, -0 - 52]
                            ];
                            return g_app.labeledValuesToObjects(list);
                        })();

                        var bg = (function () {
                            var winSize = cc.director.getWinSize();
                            var spr = oskn.Plane.create(cc.color(0x00, 0x00, 0x00, 0x80), winSize.width, winSize.height);
                            return spr;
                        })();

                        var pauseLabel = (function () {
                            var label = cc.LabelBMFont.create("PAUSE", res.font_fnt);
                            label.x = 0;
                            label.y = 80;
                            label.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.EaseSineInOut.create(cc.MoveBy.create(1.0, cc.p(0, 8))), cc.EaseSineInOut.create(cc.MoveBy.create(1.0, cc.p(0, -8))))));
                            return label;
                        })();

                        var toTitleBtn = this.layouter.sprites["toTitleBtn"] = (function () {
                            var label = oskn.MenuItem.createByTitle("TO TITLE", 160, 48, function () {
                                g_app.sound.playSe(kimiko.Assets.SOUND_SE_OK);
                                cc.director.runScene(new kimiko.scenes.TitleScene());
                            });
                            return label;
                        })();

                        var resumeBtn = this.layouter.sprites["resumeBtn"] = (function () {
                            var label = oskn.MenuItem.createByTitle("RESUME", 160, 48, function () {
                                scene.removeFromParent();
                            });
                            return label;
                        })();

                        var menu = cc.Menu.create(toTitleBtn, resumeBtn);
                        menu.x = 0;
                        menu.y = 0;

                        this.addChild(bg);
                        this.addChild(pauseLabel);
                        this.addChild(menu);

                        this.layouter.transition("hide", false);
                    },
                    onEnter: function () {
                        this._super();
                        this.layouter.transition("normal", true);
                    },
                    onExit: function () {
                        this._super();
                        this.layouter.transition("hide", false);
                        if (this.exitListener) {
                            this.exitListener();
                        }
                    }
                });
            })(kimiko.game || (kimiko.game = {}));
            var game = kimiko.game;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));
var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (game) {
                var g_app = jp.osakana4242.kimiko.g_app;

                game.Player = cc.Sprite.extend({
                    ctor: function () {
                        var _this = this;
                        this._super();

                        this.age = 0;
                        this.rect = new osakana4242.utils.NodeRect(this);
                        this.force = new osakana4242.utils.Vector2D();
                        this.dirX = 1;

                        this.bodyStyles = (function () {
                            var animWalk = g_app.getAnimFrames(kimiko.DF.ANIM_ID_CHARA001_WALK);
                            var animStand = g_app.getAnimFrames(kimiko.DF.ANIM_ID_CHARA001_STAND);
                            var animSquat = g_app.getAnimFrames(kimiko.DF.ANIM_ID_CHARA001_SQUAT);
                            var animDead = g_app.getAnimFrames(kimiko.DF.ANIM_ID_CHARA001_DEAD);
                            _this.anim = new osakana4242.utils.AnimSequencer(_this);
                            _this.anim.sequence = animWalk;

                            var oldX = 0;
                            var oldY = 0;

                            var colliderA = osakana4242.utils.Collider.centerBottom(_this, 12, 28);
                            var colliderB = osakana4242.utils.Collider.centerBottom(_this, 12, 14);
                            var muzzlePosUp = new osakana4242.utils.Vector2D(36, 12);
                            var muzzlePosDown = new osakana4242.utils.Vector2D(36, 24);

                            return {
                                "stand": {
                                    "anim": animStand,
                                    "collider": colliderA,
                                    "muzzlePos": muzzlePosUp
                                },
                                "walk": {
                                    "anim": animWalk,
                                    "collider": colliderA,
                                    "muzzlePos": muzzlePosUp
                                },
                                "squat": {
                                    "anim": animSquat,
                                    "collider": colliderB,
                                    "muzzlePos": muzzlePosDown
                                },
                                "dead": {
                                    "anim": animDead,
                                    "collider": colliderB,
                                    "muzzlePos": muzzlePosUp
                                }
                            };
                        })();

                        this.collider = (function () {
                            var c = new osakana4242.utils.Collider();
                            c.parent = _this;
                            return c;
                        })();

                        this.viewpoint = (function () {
                            var sprite = oskn.Plane.create(cc.color(0xff, 0xff, 0x00), 8, 8);
                            sprite.retain();
                            return sprite;
                        })();

                        this.bodyStyle = this.bodyStyles.stand;

                        this.life = new game.Life(this);
                        this.life.hpMax = kimiko.DF.PLAYER_HP;
                        this.life.hp = this.life.hpMax;
                        this.life.setGhostFrameMax(g_app.secToFrame(1.5));

                        this.gravityHoldCounter = 0;
                        this.touchStartAnchor = new osakana4242.utils.Vector2D();
                        this.isPause = false;
                        this.isSlowMove = false;
                        this.isOnMap = false;
                        this.targetEnemy = null;
                        this.limitRect = new osakana4242.utils.Rect(0, 0, kimiko.DF.SC_W, kimiko.DF.SC_H);

                        this.wallPushDir = new osakana4242.utils.Vector2D();

                        this.inputForce = new osakana4242.utils.Vector2D();

                        this.scheduleUpdate();
                        this._onTrim = function (x, y) {
                            _this.onTrim(x, y);
                        };
                    },
                    reset: function (pd) {
                        this.life.resetCounter();
                        this.life.hpMax = pd.hpMax;
                        this.life.hp = pd.hp;

                        this.bodyStyle = this.bodyStyles.stand;
                        this.targetEnemy = null;
                        this.gravityHoldCounter = 0;
                        this.dirX = 1;
                        this.scaleX = 1.0;
                        this.scaleY = 1.0;
                        this.opacity = 0xff;
                        this.visible = true;
                    },
                    update: function (deltaTime) {
                        ++this.age;
                        var scene = cc.director.getRunningScene();
                        if (this.isPause) {
                            return;
                        }
                        this.life.step();

                        var isAlive = this.life.isAlive;
                        if (isAlive) {
                            this.checkInput();
                        }
                        this.updateBodyStyle();
                        if (isAlive) {
                            this.stepMove();
                            this.searchEnemy();
                        }

                        var viewpoint = this.viewpoint;
                        viewpoint.x = this.x;
                        viewpoint.y = this.y;
                        viewpoint.x += (this.dirX * 16);

                        viewpoint.y += 24 * kimiko.DF.DOWN;
                        if (this.isBodyStyleSquat) {
                            if (this.scaleY < 0) {
                                viewpoint.y += 16 * kimiko.DF.UP;
                            } else {
                                viewpoint.y += 16 * kimiko.DF.DOWN;
                            }
                        }

                        Object.defineProperty(this, "bodyStyle", {
                            get: function () {
                                return this._bodyStyle;
                            },
                            set: function (v) {
                                this._bodyStyle = v;
                                this.anim.sequence = v.anim;
                                osakana4242.utils.Rect.copyFrom(this.collider.rect, v.collider);
                            },
                            enumerable: true,
                            configurable: true
                        });
                        Object.defineProperty(this, "isBodyStyleSquat", {
                            get: function () {
                                return this.bodyStyle === this.bodyStyles.squat;
                            },
                            enumerable: true,
                            configurable: true
                        });
                    },
                    searchEnemy: function () {
                        var scene = cc.director.getRunningScene();
                        if ((this.age % g_app.secToFrame(0.2)) === 0) {
                            var srect = osakana4242.utils.Rect.alloc();
                            srect.width = 256;
                            srect.height = this.height * 2;
                            srect.x = this.x + ((this.width - srect.width) / 2);
                            srect.y = this.y + ((this.height - srect.height) / 2);
                            var enemy = scene.getNearEnemy(this, srect);
                            if (enemy) {
                                this.targetEnemy = enemy;
                            }
                            osakana4242.utils.Rect.free(srect);
                        }

                        if (this.targetEnemy === null) {
                        } else {
                            if (this.targetEnemy.life.isDead) {
                                this.targetEnemy = null;
                            }
                            if (this.targetEnemy !== null) {
                                var distance = osakana4242.utils.Rect.distance(this, this.targetEnemy);
                                var threshold = kimiko.DF.SC1_W;
                                if (threshold < distance) {
                                    this.targetEnemy = null;
                                } else {
                                    this.dirX = g_app.numberUtil.sign(this.targetEnemy.x - this.x);
                                    this.scaleX = this.dirX;
                                    if ((this.age % g_app.secToFrame(0.2)) === 0) {
                                        var srect = osakana4242.utils.Rect.alloc();
                                        srect.width = kimiko.DF.SC1_W;
                                        srect.height = this.height * 2;
                                        srect.x = this.x + (this.dirX < 0 ? -srect.width : 0);
                                        srect.y = this.y + ((this.height - srect.height) / 2);
                                        if (osakana4242.utils.Rect.intersect(srect, this.targetEnemy)) {
                                            this.attack();
                                        }
                                        osakana4242.utils.Rect.free(srect);
                                    }
                                }
                            }
                        }
                    },
                    stateToString: function () {
                        var str = " hp:" + this.life.hp + " L:" + (this.targetEnemy !== null ? "o" : "x");
                        return str;
                    },
                    attack: function () {
                        if (!g_app.config.isFireEnabled) {
                            return;
                        }
                        var bullet = cc.director.getRunningScene().newOwnBullet();
                        if (bullet === null) {
                            return;
                        }
                        g_app.sound.playSe(kimiko.Assets.SOUND_SE_SHOT);
                        bullet.scaleX = this.scaleX;
                        bullet.force.x = this.dirX * g_app.dpsToDpf(6 * 60);
                        bullet.force.y = 0;
                        bullet.x = this.x + this.scaleX * (this.bodyStyle.muzzlePos.x - (this.width / 2));
                        bullet.y = this.y + this.scaleY * (this.bodyStyle.muzzlePos.y - (this.height / 2));
                    },
                    updateBodyStyle: function () {
                        var nextBodyStyle = this.bodyStyle;
                        if (this.life.isDead) {
                            nextBodyStyle = this.bodyStyles.dead;
                        } else if (0 < this.wallPushDir.y) {
                            nextBodyStyle = this.bodyStyles.squat;
                        } else if (this.wallPushDir.y < 0) {
                            nextBodyStyle = this.bodyStyles.squat;
                        } else if (!osakana4242.utils.Vector2D.equals(this.inputForce, osakana4242.utils.Vector2D.zero)) {
                            if (this.bodyStyle === this.bodyStyles.squat) {
                                if (this.inputForce.y * this.scaleY < 0) {
                                    nextBodyStyle = this.bodyStyles.walk;
                                } else {
                                    nextBodyStyle = this.bodyStyles.squat;
                                }
                            } else {
                                nextBodyStyle = this.bodyStyles.walk;
                            }
                            nextBodyStyle = this.bodyStyles.walk;
                        } else {
                            if (this.bodyStyle === this.bodyStyles.squat) {
                                nextBodyStyle = this.bodyStyles.stand;
                            } else {
                                nextBodyStyle = this.bodyStyles.stand;
                            }
                        }
                        if (this.wallPushDir.y !== 0) {
                            this.scaleY = this.wallPushDir.y < 0 ? 1 : -1;
                        }

                        if (this.bodyStyle !== nextBodyStyle) {
                            this.bodyStyle = nextBodyStyle;
                        }
                    },
                    stepMove: function () {
                        var scene = cc.director.getRunningScene();
                        this.oldX = this.x;
                        this.oldY = this.y;

                        if (!this.targetEnemy) {
                            if (0 !== this.inputForce.x) {
                                this.dirX = g_app.numberUtil.sign(this.inputForce.x);
                                this.scaleX = this.dirX;
                            }
                        }

                        if (this.isSlowMove || !osakana4242.utils.Vector2D.equals(this.inputForce, osakana4242.utils.Vector2D.zero)) {
                            this.force.x = this.inputForce.x;
                            this.force.y = this.inputForce.y;
                        } else {
                        }
                        if (0 < this.gravityHoldCounter) {
                            --this.gravityHoldCounter;
                        } else {
                            if (0 < this.scaleY) {
                                var gravityMin = -g_app.dpsToDpf(60 * 10);
                                this.force.y = Math.max(this.force.y - g_app.dpsToDpf(kimiko.DF.GRAVITY), gravityMin);
                            } else {
                                var gravityMax = g_app.dpsToDpf(60 * 10);
                                this.force.y = Math.min(this.force.y + g_app.dpsToDpf(kimiko.DF.GRAVITY), gravityMax);
                            }
                        }

                        var totalMx = this.force.x;
                        var totalMy = this.force.y;
                        var oldForceX = this.force.x;
                        var oldForceY = this.force.y;

                        osakana4242.utils.Vector2D.copyFrom(this.wallPushDir, osakana4242.utils.Vector2D.zero);

                        var loopCnt = Math.floor(Math.max(Math.abs(totalMx), Math.abs(totalMy)) / kimiko.DF.PLAYER_MOVE_RESOLUTION);

                        var mx = totalMx / loopCnt;
                        var my = totalMy / loopCnt;

                        for (var i = 0; i <= loopCnt; ++i) {
                            if (i < loopCnt) {
                                this.x += mx;
                                this.y += my;
                                totalMx -= mx;
                                totalMy -= my;
                            } else {
                                this.x += totalMx;
                                this.y += totalMy;
                            }
                            osakana4242.utils.Rect.trimPos(this.rect, this.limitRect, this._onTrim);
                            scene.checkMapCollision(this, this._onTrim, this.onIntersect);
                            if (this.force.x === 0) {
                                mx = 0;
                                totalMx = 0;
                            }
                            if (this.force.y === 0) {
                                my = 0;
                                totalMy = 0;
                            }
                        }

                        if (false) {
                            if (oldForceX !== this.force.x) {
                                this.touchStartAnchor.x += this.force.x - oldForceX + g_app.numberUtil.sign(oldForceX);
                            }
                            if (oldForceY !== this.force.y) {
                                this.touchStartAnchor.y += this.force.y - oldForceY + g_app.numberUtil.sign(oldForceY);
                            }
                        }

                        if (!osakana4242.utils.Vector2D.equals(this.inputForce, osakana4242.utils.Vector2D.zero)) {
                            this.force.x = 0;
                            this.force.y = 0;
                        }
                    },
                    startMap: function () {
                        cc.log("player startMap");
                        this.isPause = false;
                    },
                    endMap: function () {
                        cc.log("player endMap");
                        this.isPause = true;
                    },
                    onIntersect: function (tile, x, y) {
                        if (tile !== kimiko.DF.MAP_TILE_DOOR_OPEN) {
                            return;
                        }

                        var scene = cc.director.getRunningScene();
                        scene.state = scene.stateGameClear;
                        this.endMap();
                    },
                    onTrim: function (x, y) {
                        if (x !== 0) {
                            if (1 < Math.abs(this.inputForce.x)) {
                                this.wallPushDir.x = x;
                            }
                            this.force.x = 0;
                        }

                        if (y !== 0) {
                            if (1 < Math.abs(this.inputForce.y)) {
                                this.wallPushDir.y = y;
                            }
                            this.force.y = 0;
                        }
                    },
                    checkInput: function () {
                        osakana4242.utils.Vector2D.copyFrom(this.inputForce, osakana4242.utils.Vector2D.zero);
                        if (this.life.isDead) {
                            return;
                        }
                        this.checkKeyInput();
                        this.checkTouchInput();
                    },
                    checkKeyInput: function () {
                    },
                    checkTouchInput: function () {
                        var scene = cc.director.getRunningScene();
                        var player = this;
                        var touch = scene.touch;
                        if (touch.isTouching) {
                            var moveLimit = kimiko.DF.TOUCH_TO_CHARA_MOVE_LIMIT;
                            var moveRate = g_app.config.swipeToMoveRate;
                            if (kimiko.DF.PLAYER_TOUCH_ANCHOR_ENABLE) {
                                var tv = osakana4242.utils.Vector2D.alloc(player.touchStartAnchor.x + touch.totalDiff.x * moveRate.x, player.touchStartAnchor.y + touch.totalDiff.y * moveRate.y);
                                var v = osakana4242.utils.Vector2D.alloc(tv.x - player.x, tv.y - player.y);
                                var vm = Math.min(osakana4242.utils.Vector2D.magnitude(v), moveLimit);
                                osakana4242.utils.Vector2D.normalize(v);
                                v.x *= vm;
                                v.y *= vm;
                                player.inputForce.x = v.x;
                                player.inputForce.y = v.y;
                                osakana4242.utils.Vector2D.free(tv);
                                osakana4242.utils.Vector2D.free(v);
                            } else {
                                player.inputForce.x = g_app.numberUtil.trim(touch.diff.x * moveRate.x, -moveLimit, moveLimit);
                                player.inputForce.y = g_app.numberUtil.trim(touch.diff.y * moveRate.y, -moveLimit, moveLimit);
                            }
                            this.gravityHoldCounter = g_app.secToFrame(kimiko.DF.GRAVITY_HOLD_SEC);
                        }
                    },
                    onDead: function () {
                        var player = this;
                        var sx = player.x;
                        var sy = player.y;
                        var t1x = sx + (-player.dirX * 96);
                        var t1y = sy - 64;
                        var dx = -player.dirX;
                        player.runAction(cc.Sequence.create(cc.MoveBy.create(0.2, cc.p(dx * 96 * 0.25, -96 * 0.8)), cc.MoveBy.create(0.2, cc.p(dx * 96 * 0.25, -96 * 0.2)), cc.MoveBy.create(0.3, cc.p(dx * 96 * 0.25, 32 * 0.2)), cc.MoveBy.create(0.3, cc.p(dx * 96 * 0.25, 32 * 0.8)), cc.Hide.create()));
                    }
                });
            })(kimiko.game || (kimiko.game = {}));
            var game = kimiko.game;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));

var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (game) {
                var WeaponA = (function () {
                    function WeaponA(sprite) {
                        this.parent = sprite;
                        this.state = this.stateNeutral;
                        this.wayNum = 1;
                        this.fireCount = 1;
                        this.fireInterval = kimiko.g_app.secToFrame(0.2);
                        this.reloadFrameCount = kimiko.g_app.secToFrame(3.0);
                        this.dir = new osakana4242.utils.Vector2D(1, 0);
                        this.targetPos = new osakana4242.utils.Vector2D();
                        this.speed = kimiko.g_app.dpsToDpf(60 * 1.0);
                        this.fireFunc = WeaponA.fireC;
                        this.isTracePlayer = false;
                    }
                    WeaponA.prototype.step = function () {
                        this.state();
                    };

                    WeaponA.prototype.stateNeutral = function () {
                    };

                    WeaponA.prototype.stateFire = function () {
                        if (this.fireIntervalCounter < this.fireInterval) {
                            ++this.fireIntervalCounter;
                            return;
                        }
                        this.fireIntervalCounter = 0;
                        if (this.fireCounter < this.fireCount) {
                            this.fire();
                            ++this.fireCounter;
                            return;
                        }
                        this.fireCounter = 0;
                        this.reloadFrameCounter = 0;
                        this.state = this.stateNeutral;
                    };

                    WeaponA.prototype.fire = function () {
                        if (this.isTracePlayer) {
                            this.lookAtPlayer();
                        }
                        var parent = this.parent;
                        var wayNum = this.wayNum;
                        var degToRad = Math.PI / 180;
                        var degInterval = 90 / wayNum;
                        var startDeg = -degInterval * ((wayNum - 1) / 2);
                        for (var i = 0, iNum = wayNum; i < iNum; ++i) {
                            var bullet = parent.scene.newEnemyBullet();
                            if (!bullet) {
                                continue;
                            }
                            var deg = startDeg + (degInterval * i);
                            var rad = deg * degToRad;
                            var speed = this.speed;
                            bullet.force.x = (this.dir.x * Math.cos(rad) - (this.dir.y * Math.sin(rad))) * speed;
                            bullet.force.y = (this.dir.y * Math.cos(rad) + (this.dir.x * Math.sin(rad))) * speed;
                            bullet.center.set(parent.center);
                            if (true) {
                                var v1 = osakana4242.utils.Vector2D.alloc();
                                var v2 = osakana4242.utils.Vector2D.alloc();

                                v1.set(this.targetPos);
                                v1.x -= parent.center.x;
                                v1.y -= parent.center.y;
                                v1.rotate(rad);
                                v1.x += parent.center.x;
                                v1.y += parent.center.y;
                                this.fireFunc(bullet, v1, speed);

                                osakana4242.utils.Vector2D.free(v1);
                                osakana4242.utils.Vector2D.free(v2);
                            }
                        }
                    };

                    WeaponA.fireA = function (bullet, tpos, speed) {
                        bullet.force.x = 0;
                        bullet.force.y = 0;
                        var d = osakana4242.utils.Vector2D.alloc();
                        d.x = tpos.x - bullet.center.x;
                        d.y = tpos.y - bullet.center.y;
                        var mag = osakana4242.utils.Vector2D.magnitude(d);
                        var d2 = 480;
                        d.x = d.x * d2 / mag;
                        d.y = d.y * d2 / mag;
                        var frame = Math.floor(d2 / speed);

                        bullet.tl.moveBy(d.x, d.y, frame).then(function () {
                            this.miss();
                        });
                        osakana4242.utils.Vector2D.free(d);
                    };

                    WeaponA.fireC = function (bullet, tpos, speed) {
                        bullet.force.x = 0;
                        bullet.force.y = 0;
                        var d = osakana4242.utils.Vector2D.alloc();
                        d.x = tpos.x - bullet.center.x;
                        d.y = tpos.y - bullet.center.y;
                        var m = osakana4242.utils.Vector2D.magnitude(d);
                        var d2 = 480;
                        var dx = d.x * d2 / m;
                        var dy = d.y * d2 / m;
                        var frame1 = Math.floor(d2 * 0.2 / kimiko.g_app.dpsToDpf(4 * 60));
                        var frame2 = Math.floor(d2 * 0.8 / kimiko.g_app.dpsToDpf(1 * 60));

                        bullet.tl.moveBy(dx * 0.2, dy * 0.2, frame1).moveBy(dx * 0.8, dy * 0.8, frame2).then(function () {
                            this.miss();
                        });
                        osakana4242.utils.Vector2D.free(d);
                    };

                    WeaponA.fireB = function (bullet, tpos, speed) {
                        bullet.force.x = 0;
                        bullet.force.y = 0;
                        var dx = tpos.x - bullet.center.x;
                        var dy = tpos.y - bullet.center.y;
                        var frameNum = kimiko.g_app.secToFrame(1.0);
                        bullet.tl.moveBy(dx * 0.25, dy * 0.25 - 64 * 0.7, frameNum * 0.25).moveBy(dx * 0.25, dy * 0.25 - 64 * 0.3, frameNum * 0.25).moveBy(dx * 0.25, dy * 0.25 + 64 * 0.3, frameNum * 0.25).moveBy(dx * 0.25, dy * 0.25 + 64 * 0.7, frameNum * 0.25).moveBy(dx, 320, frameNum).then(function () {
                            this.miss();
                        });
                    };

                    WeaponA.prototype.lookAtPlayer = function () {
                        var player = this.parent.scene.player;
                        this.dir.x = player.center.x - this.parent.center.x;
                        this.dir.y = player.center.y - this.parent.center.y;
                        this.targetPos.set(player.center);
                        osakana4242.utils.Vector2D.normalize(this.dir);
                    };

                    WeaponA.prototype.lookAtFront = function () {
                        this.targetPos.x = this.parent.center.x + this.dir.x * 320;
                        this.targetPos.y = this.parent.center.y + this.dir.y * 320;
                    };

                    WeaponA.prototype.startFire = function () {
                        this.fireCounter = 0;
                        this.fireIntervalCounter = this.fireInterval;
                        this.reloadFrameCounter = this.reloadFrameCount;
                        this.state = this.stateFire;
                    };

                    WeaponA.prototype.isStateFire = function () {
                        return this.state === this.stateFire;
                    };
                    return WeaponA;
                })();
                game.WeaponA = WeaponA;
            })(kimiko.game || (kimiko.game = {}));
            var game = kimiko.game;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));
var res = {
    HelloWorld_png: "res/HelloWorld.png",
    CloseNormal_png: "res/CloseNormal.png",
    CloseSelected_png: "res/CloseSelected.png",
    map101_tmx: "res/map101.tmx",
    map102_tmx: "res/map102.tmx",
    map103_tmx: "res/map103.tmx",
    map201_tmx: "res/map201.tmx",
    map202_tmx: "res/map202.tmx",
    map203_tmx: "res/map203.tmx",
    map204_tmx: "res/map204.tmx",
    map900102_tmx: "res/map900102.tmx",
    map900103_tmx: "res/map900103.tmx",
    map900104_tmx: "res/map900104.tmx",
    map900105_tmx: "res/map900105.tmx",
    map900106_tmx: "res/map900106.tmx",
    map900107_tmx: "res/map900107.tmx",
    map900108_tmx: "res/map900108.tmx",
    map900109_tmx: "res/map900109.tmx",
    map900201_tmx: "res/map900201.tmx",
    map900202_tmx: "res/map900202.tmx",
    map900203_tmx: "res/map900203.tmx",
    font_png: "res/font.png",
    font_fnt: "res/font.fnt",
    game_start_bg_png: "res/game_start_bg.png",
    bullet_png: "res/bullet.png",
    effect_png: "res/bullet.png",
    chara001_png: "res/chara001.png",
    chara002_png: "res/chara002.png",
    chara003_png: "res/chara003.png",
    chara004_png: "res/chara004.png",
    clip_png: "res/clip.png",
    collider_png: "res/collider.png",
    common_bg_png: "res/common_bg.png",
    map_png: "res/map.png",
    SND_BGM_02: "res/snd/bgm_02.mp3",
    SND_SE_OK: "res/snd/se_ok.mp3",
    SND_SE_CURSOR: "res/snd/se_cursor.mp3",
    SND_SE_HIT: "res/snd/se_hit.mp3",
    SND_SE_KILL: "res/snd/se_kill.mp3",
    SND_SE_SHOT: "res/snd/se_shot.mp3"
};

var g_resources = (function () {
    var list = [];
    for (var key in res) {
        list.push(res[key]);
    }
    return list;
})();
var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (scenes) {
                var g_app = jp.osakana4242.kimiko.g_app;
                var DF = jp.osakana4242.kimiko.DF;

                scenes.Config = cc.Scene.extend({
                    ctor: function () {
                        this._super();

                        g_app.sound.stopBgm();

                        var scene = this;

                        var scdSize = oskn.conf.scdSize;

                        var aaa = this.aaa = new oskn.AspectAnchorAdjuster();
                        aaa.addToScene(this);

                        var btnHeight = 48;
                        var margin = 4;
                        var itemSelectedIdx = 0;

                        var userConfig = g_app.storage.root.userConfig;

                        var layouter = new kimiko.SpriteLayouter(this);

                        var itemDataList = [
                            {
                                "title": "DIFFICULTY",
                                "func": function (item, diff) {
                                    userConfig.difficulty = g_app.numberUtil.trim(userConfig.difficulty + diff, 1, 2);
                                    item.valueLabel.setString(g_app.storage.getDifficultyName(userConfig.difficulty));
                                }
                            },
                            {
                                "title": "BGM",
                                "func": function (item, diff) {
                                    if (diff !== 0) {
                                        userConfig.isBgmEnabled = !userConfig.isBgmEnabled;
                                        g_app.sound.setBgmEnabled(userConfig.isBgmEnabled);
                                        g_app.sound.playBgm(kimiko.Assets.SOUND_BGM, false);
                                    }
                                    item.valueLabel.setString(userConfig.isBgmEnabled ? "ON" : "OFF");
                                }
                            },
                            {
                                "title": "SE",
                                "func": function (item, diff) {
                                    if (diff !== 0) {
                                        userConfig.isSeEnabled = !userConfig.isSeEnabled;
                                        g_app.sound.setSeEnabled(userConfig.isSeEnabled);
                                    }
                                    item.valueLabel.setString(userConfig.isSeEnabled ? "ON" : "OFF");
                                }
                            },
                            {
                                "title": "UI LAYOUT",
                                "func": function (item, diff) {
                                    if (diff !== 0) {
                                        layouter.transition("none", true);
                                        userConfig.isUiRight = !userConfig.isUiRight;
                                        g_app.addTestHudTo(scene);
                                    }
                                    item.valueLabel.setString(userConfig.isUiRight ? "RIGHTY" : "LEFTY");
                                    layouter.transition("none", false);
                                    layouter.transition("right", true);
                                }
                            },
                            {
                                "title": "FPS",
                                "func": function (item, diff) {
                                    userConfig.fps = g_app.numberUtil.trim(userConfig.fps + (diff * 20), 20, 60);
                                    cc.director.setAnimationInterval(1.0 / userConfig.fps);
                                    item.valueLabel.setString(userConfig.fps);
                                }
                            },
                            {
                                "title": "FPS VISIBLE",
                                "func": function (item, diff) {
                                    if (diff !== 0) {
                                        userConfig.isFpsVisible = !userConfig.isFpsVisible;
                                        g_app.addTestHudTo(scene);
                                    }
                                    item.valueLabel.setString(userConfig.isFpsVisible ? "ON" : "OFF");
                                }
                            }
                        ];

                        var items = [];

                        for (var i = 0, iNum = itemDataList.length; i < iNum; ++i) {
                            var itemData = itemDataList[i];
                            var isAdd = true;
                            switch (itemData.title) {
                                case "BGM":
                                case "SE":
                                    if (!g_app.env.isSoundEnabled) {
                                        isAdd = false;
                                    }
                                    break;
                            }
                            if (isAdd) {
                                addItem(itemData.title, itemData);
                            }
                        }

                        function addItem(title, itemData) {
                            var idx = items.length;
                            var tmpY = 120 - 36 * idx;
                            var item = {
                                "titleLabel": (function () {
                                    var spr = cc.LabelBMFont.create(title, res.font_fnt);
                                    spr.width = 160;
                                    spr.x = 0;
                                    spr.y = tmpY;
                                    spr.touchEnabled = false;
                                    return spr;
                                })(),
                                "valueLabel": (function () {
                                    var spr = cc.LabelBMFont.create(" ", res.font_fnt);
                                    spr.width = 160;
                                    spr.x = 24;
                                    spr.y = tmpY - spr.height;
                                    spr.touchEnabled = false;
                                    return spr;
                                })(),
                                "itemData": itemData
                            };
                            items.push(item);
                            return item;
                        }

                        layouter.layout = (function () {
                            var list = [
                                ["spriteName", "layoutName", "visible", "delay", "x", "y"],
                                ["titleLabel", "none", false, 0.05 * 0, 0, 160],
                                ["backBtn", "none", false, 0.05 * 0, 160, 140 - 52 * 0],
                                ["upBtn", "none", false, 0.05 * 1, 160, 140 - 52 * 1],
                                ["downBtn", "none", false, 0.05 * 2, 160, 140 - 52 * 2],
                                ["leftBtn", "none", false, 0.05 * 3, 160, 140 - 52 * 3],
                                ["rightBtn", "none", false, 0.05 * 4, 160, 140 - 52 * 4],
                                ["titleLabel", "right", true, 0.05 * 0, 0, 140],
                                ["backBtn", "right", true, 0.05 * 0, 136, 140 - 52 * 0],
                                ["upBtn", "right", true, 0.05 * 1, 136, 140 - 52 * 1],
                                ["downBtn", "right", true, 0.05 * 2, 136, 140 - 52 * 2],
                                ["leftBtn", "right", true, 0.05 * 3, 136, 140 - 52 * 3],
                                ["rightBtn", "right", true, 0.05 * 4, 136, 140 - 52 * 4]
                            ];
                            return g_app.labeledValuesToObjects(list);
                        })();

                        this.bg = (function () {
                            var spr = cc.Sprite.create(res.common_bg_png);
                            spr.setScaleY(cc.director.getWinSize().height / DF.SC_H);
                            return spr;
                        })();

                        layouter.sprites["titleLabel"] = (function () {
                            var spr = cc.LabelBMFont.create("CONFIG", res.font_fnt);
                            return spr;
                        })();

                        layouter.sprites["backBtn"] = (function () {
                            var spr = oskn.MenuItem.createByTitle("X", 48, 48, gotoTitle, scene);
                            return spr;
                        })();

                        layouter.sprites["upBtn"] = (function () {
                            var spr = oskn.MenuItem.createByTitle("^", 48, 48, function () {
                                onButtonEvent("up");
                            }, scene);
                            return spr;
                        })();

                        layouter.sprites["downBtn"] = (function () {
                            var spr = oskn.MenuItem.createByTitle("v", 48, 48, function () {
                                onButtonEvent("down");
                            }, scene);
                            return spr;
                        })();

                        layouter.sprites["leftBtn"] = (function () {
                            var spr = oskn.MenuItem.createByTitle("<", 48, 48, function () {
                                onButtonEvent("left");
                            }, scene);
                            return spr;
                        })();

                        layouter.sprites["rightBtn"] = (function () {
                            var spr = oskn.MenuItem.createByTitle(">", 48, 48, function () {
                                onButtonEvent("right");
                            }, scene);
                            return spr;
                        })();

                        var menu = cc.Menu.create(layouter.sprites["backBtn"], layouter.sprites["upBtn"], layouter.sprites["downBtn"], layouter.sprites["leftBtn"], layouter.sprites["rightBtn"]);
                        menu.x = 0;
                        menu.y = 0;

                        var cursor = (function () {
                            var spr = cc.LabelBMFont.create(" ", res.font_fnt);
                            spr.x = 0;
                            spr.y = 0;
                            var ptns = [
                                "v",
                                "-",
                                "^",
                                "-"
                            ];
                            spr.update = function (deltaTime) {
                                var ptnIdx = Math.floor(cc.director.getTotalFrames() / g_app.secToFrame(0.2)) % ptns.length;
                                spr.setString(ptns[ptnIdx]);
                            };
                            spr.scheduleUpdate();
                            return spr;
                        })();

                        aaa.centerNode.addChild(this.bg);

                        var menuGroup = cc.Node.create();
                        menuGroup.x = 0;
                        menuGroup.y = 0;

                        for (var i = 0, iNum = items.length; i < iNum; ++i) {
                            var item = items[i];
                            menuGroup.addChild(item.titleLabel);
                            menuGroup.addChild(item.valueLabel);
                        }
                        menuGroup.addChild(cursor);

                        aaa.centerNode.addChild(menuGroup);
                        aaa.centerNode.addChild(menu);
                        aaa.centerNode.addChild(layouter.sprites["titleLabel"]);

                        g_app.addTestHudTo(this);

                        layouter.transition("none", false);

                        var fader = new scenes.Fader(aaa.centerNode);
                        fader.setBlack(true);
                        fader.fadeIn(0.1);

                        var oldUserConfig = {};
                        for (var key in userConfig) {
                            oldUserConfig[key] = userConfig[key];
                        }

                        for (var i = items.length - 1; 0 <= i; --i) {
                            var item = items[i];
                            item.itemData.func(item, 0);
                        }

                        function updateCursorPosition() {
                            var item = items[itemSelectedIdx];
                            cursor.x = item.titleLabel.x - (item.titleLabel.width + cursor.width) / 2 - 6;
                            cursor.y = item.titleLabel.y;
                        }

                        function onButtonEvent(eventName) {
                            switch (eventName) {
                                case "up":
                                case "down":
                                    var diff = (eventName === "up") ? -1 : 1;
                                    itemSelectedIdx = g_app.numberUtil.trim(itemSelectedIdx + diff, 0, items.length - 1);
                                    g_app.sound.playSe(kimiko.Assets.SOUND_SE_CURSOR);
                                    updateCursorPosition();
                                    break;
                                case "left":
                                case "right":
                                    var diff = (eventName === "left") ? -1 : 1;
                                    items[itemSelectedIdx].itemData.func(items[itemSelectedIdx], diff);
                                    g_app.sound.playSe(kimiko.Assets.SOUND_SE_CURSOR);
                                    break;
                            }
                        }

                        updateCursorPosition();

                        function gotoTitle() {
                            g_app.sound.playSe(kimiko.Assets.SOUND_SE_OK);
                            g_app.storage.save();

                            var isReload = false;
                            for (var key in userConfig) {
                                switch (key) {
                                    case "fps":
                                        if (userConfig[key] !== oldUserConfig[key]) {
                                            isReload = true;
                                        }
                                }
                            }

                            layouter.transition("none", true);

                            if (isReload) {
                                fader.fadeOut(1.0, function () {
                                    cc.director.runScene(new scenes.TitleScene());
                                });
                            } else {
                                fader.fadeOut(0.1, function () {
                                    cc.director.runScene(new scenes.TitleScene());
                                });
                            }
                        }
                        ;
                        aaa.checkAspect();
                    }
                });
            })(kimiko.scenes || (kimiko.scenes = {}));
            var scenes = kimiko.scenes;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));
var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (scenes) {
                var g_app = jp.osakana4242.kimiko.g_app;
                var DF = jp.osakana4242.kimiko.DF;

                scenes.GameScene = cc.Scene.extend({
                    ctor: function () {
                        var _this = this;
                        this._super();

                        var scene = this;

                        var aaa = this.aaa = new oskn.AspectAnchorAdjuster();

                        aaa.addToScene(this);

                        var mainNode = this.mainNode = cc.Node.create();
                        var mainTopNode = this.mainTopNode = cc.Node.create();
                        scene.addChild(mainNode);
                        mainNode.addChild(mainTopNode, 1);
                        aaa.addAnchor(mainTopNode, "top");

                        this.state = this.stateGameStart;

                        this.gameOverFrameMax = 0;
                        this.gameOverFrameCounter = this.gameOverFrameMax;

                        this.celarFrameMax = 0;
                        this.clearFrameCounter = this.clearFrameMax;
                        this.statusTexts = [
                            [], [], [], []
                        ];

                        this.layouter = new kimiko.SpriteLayouter(this);
                        this.layouter.layout = (function () {
                            var list = [
                                ["spriteName", "layoutName", "visible", "delay", "x", "y"],
                                ["pauseBtn", "normal", true, 0.05 * 0, 120 + 0, 4],
                                ["statusLabels_0", "normal", true, 0.05 * 0, -160 + 4, 4 + 12 * -0],
                                ["statusLabels_1", "normal", true, 0.05 * 0, -160 + 4, 4 + 12 * -1],
                                ["statusLabels_2", "normal", true, 0.05 * 0, -160 + 4, 4 + 12 * -2],
                                ["statusLabels_3", "normal", true, 0.05 * 0, -160 + 4, 4 + 12 * -3]
                            ];
                            return g_app.labeledValuesToObjects(list);
                        })();

                        var bg1 = this.bg1 = (function () {
                            var spr = oskn.Plane.create(cc.color(0xff, 0xff, 64, 0xff), DF.SC_W, DF.SC_H);
                            return spr;
                        })();
                        var bg2 = this.bg2 = (function () {
                            var spr = oskn.Plane.create(cc.color(32, 32, 64, 0xff), DF.SC_W, DF.SC_H);
                            return spr;
                        })();
                        var bg3 = this.bg3 = (function () {
                            var spr = oskn.Plane.create(cc.color(64, 32, 64, 0xff), DF.SC1_W, DF.SC1_H);
                            return spr;
                        })();

                        var sprite;

                        var world = this.world = cc.Node.create();
                        world.name = "world";

                        var gameLayer = this.gameLayer = oskn.nodes.createRectClippingNode(0, 0, DF.SC1_W, DF.SC1_H);

                        if (false) {
                        } else {
                            mainTopNode.addChild(bg1);
                            bg1.y = (DF.SC_H - DF.SC1_H) * 0.5 * DF.UP;
                            gameLayer.addChild(bg2);
                            gameLayer.addChild(bg3);
                            gameLayer.addChild(world);
                            gameLayer.x = 0;
                            gameLayer.y = (DF.SC_H - DF.SC1_H) * 0.5 * DF.UP;
                            mainTopNode.addChild(gameLayer);
                        }
                        this.fader = new scenes.Fader(gameLayer);

                        var map = this.map = kimiko.game.GameMap.create();
                        this.mapOption = {};

                        map.map.x = 0;
                        map.map.y = 0;
                        world.addChild(map.map);

                        var camera = new scenes.Camera();
                        this.camera = camera;
                        camera.name = "camera";
                        camera.targetGroup = world;
                        world.addChild(camera);

                        this.player = (function () {
                            var sprite = new kimiko.game.Player();
                            sprite.retain();
                            sprite.name = "player";
                            sprite.x = 0;
                            sprite.y = _this.map.map.height - sprite.height;
                            return sprite;
                        })();

                        var hudGroup = (function () {
                            var bg = (function () {
                                var spr = oskn.Plane.create(cc.color(60, 60, 40, 0xff), DF.SC2_W, cc.director.getWinSize().height);
                                _this.controllArea = spr;
                                spr.x = 0;
                                spr.y = (DF.SC2_H - spr.height) * 0.5 * DF.UP;
                                return spr;
                            })();

                            _this.labels = [];
                            var texts = _this.statusTexts;
                            for (var i = 0, iNum = texts.length; i < iNum; ++i) {
                                sprite = cc.LabelBMFont.create("label", res.font_fnt);
                                sprite.width = 160;
                                sprite.textAlign = cc.TEXT_ALIGNMENT_LEFT;
                                sprite.setAnchorPoint(cc.p(0.0, 0.5));
                                _this.labels.push(sprite);
                                _this.layouter.sprites["statusLabels_" + i] = sprite;
                            }

                            var pauseBtn = _this.layouter.sprites["pauseBtn"] = (function () {
                                var spr = oskn.MenuItem.createByTitle("P", 48, 48, function () {
                                    g_app.sound.playSe(kimiko.Assets.SOUND_SE_OK);

                                    oskn.NodeUtils.visitNodes(_this.mainNode, function (n) {
                                        cc.log("pause:" + n["name"]);
                                        n.pause();
                                    });
                                    _this.pauseMenu = new kimiko.game.PauseMenu(function () {
                                        oskn.NodeUtils.visitNodes(_this.mainNode, function (n) {
                                            n.resume();
                                        });

                                        _this.pauseMenu = null;
                                    });
                                    scene.aaa.centerNode.addChild(_this.pauseMenu);
                                }, scene);
                                return spr;
                            })();

                            var menu = cc.Menu.create(pauseBtn);
                            menu.x = 0;
                            menu.y = 0;

                            var group = cc.Node.create();
                            _this.statusGroup = group;
                            group.x = 0;
                            group.y = (DF.SC_H - DF.SC1_H) * 0.5 * DF.UP + (DF.SC1_H + DF.SC2_H) * 0.5 * DF.DOWN;

                            group.addChild(bg);
                            for (var i = 0, iNum = _this.labels.length; i < iNum; ++i) {
                                group.addChild(_this.labels[i]);
                            }
                            group.addChild(menu);
                            return group;
                        })();
                        mainTopNode.addChild(hudGroup);

                        this.ownBulletPool = new osakana4242.utils.SpritePool(DF.PLAYER_BULLET_NUM, function (idx) {
                            var spr = new kimiko.game.OwnBullet();
                            spr.name = "OwnBullet" + idx;
                            return spr;
                        });

                        this.enemyBulletPool = new osakana4242.utils.SpritePool(32, function (idx) {
                            var spr = new kimiko.game.EnemyBullet();
                            spr.name = "EnemyBullet" + idx;
                            return spr;
                        });

                        this.effectPool = new osakana4242.utils.SpritePool(16, function (idx) {
                            var spr = cc.Sprite.create();
                            spr.width = 16;
                            spr.height = 16;
                            spr.rect = new osakana4242.utils.NodeRect(spr);
                            spr.anim = new osakana4242.utils.AnimSequencer(spr);
                            spr.name = "effect" + idx;
                            spr.ageMax = 0;
                            spr.anim.loopListener = function () {
                                _this.effectPool.free(spr);
                            };
                            return spr;
                        });

                        this.mapCharaMgr = new kimiko.game.MapCharaManager(this);
                        this.touch = new osakana4242.utils.Touch();
                        this.pauseMenu = null;

                        var listener = cc.EventListener.create({
                            event: cc.EventListener.TOUCH_ONE_BY_ONE,
                            swallowTouches: true,
                            onTouchBegan: function (t, evt) {
                                return scene.onTouchBegan(t, evt);
                            },
                            onTouchMoved: function (t, evt) {
                                return scene.onTouchMoved(t, evt);
                            },
                            onTouchEnded: function (t, evt) {
                                return scene.onTouchEnded(t, evt);
                            },
                            onTouchCancelled: function (t, evt) {
                                return scene.onTouchEnded(t, evt);
                            }
                        });
                        cc.eventManager.addListener(listener, scene);
                        this.scheduleUpdate();
                        this.isExitByPush = false;

                        this.fader.setBlack(true);
                        this.fader.fadeOut(0);
                    },
                    initPlayerStatus: function () {
                        var scene = this;
                        var pd = g_app.playerData;
                        pd.restTimeMax = g_app.secToFrame(180);
                        pd.restTimeCounter = pd.restTimeMax;
                        var player = this.player;
                        player.reset(pd);
                    },
                    clear: function () {
                        this.ownBulletPool.freeAll();
                        this.enemyBulletPool.freeAll();
                        this.effectPool.freeAll();
                        this.mapCharaMgr.clear();
                        this.player.removeFromParent(false);
                    },
                    onTouchBegan: function (t, evt) {
                        var touch = this.touch;
                        touch.saveTouchStart(t.getLocation());
                        var player = this.player;
                        player.touchStartAnchor.x = player.x;
                        player.touchStartAnchor.y = player.y;
                        player.force.x = 0;
                        player.force.y = 0;
                        player.useGravity = false;
                        player.isOnMap = false;
                        return true;
                    },
                    onTouchMoved: function (t, evt) {
                        var touch = this.touch;
                        touch.saveTouchMove(t.getLocation());
                        return true;
                    },
                    onTouchEnded: function (t, evt) {
                        var touch = this.touch;
                        touch.saveTouchEnd(t.getLocation());

                        var player = this.player;
                        player.force.x = 0;
                        player.force.y = 0;

                        if (Math.abs(touch.totalDiff.x) + Math.abs(touch.totalDiff.y) < 16) {
                        }
                        player.useGravity = true;
                        return true;
                    },
                    onEnter: function () {
                        this._super();
                        cc.log("game onEnter");
                        if (this.isExitByPush) {
                            this.isExitByPush = false;
                            return;
                        }

                        g_app.addTestHudTo(this);
                    },
                    onExit: function () {
                        this._super();
                        cc.log("game onExit");
                        if (this.isExitByPush) {
                            return;
                        }
                        this.fader.destroy();
                        this.player.release();
                        this.ownBulletPool.destroy();
                        this.enemyBulletPool.destroy();
                        this.effectPool.destroy();
                    },
                    update: function (deltTime) {
                        this.state();
                        this.updateStatusText();
                    },
                    stateWait: function () {
                    },
                    stateGameStart: function () {
                        var scene = this;

                        this.clear();
                        this.initPlayerStatus();
                        this.world.addChild(this.player);
                        this.loadMapData(jp.osakana4242.kimiko["mapData" + g_app.playerData.mapId]);

                        scene.fader.setBlack(true);
                        var player = scene.player;
                        var camera = scene.camera;
                        scene.fader.fadeIn2(0.2, camera.getTargetPosOnCamera());

                        scene.layouter.transition("normal", false);

                        scene.state = scene.stateNormal;

                        g_app.sound.playBgm(kimiko.Assets.SOUND_BGM, false);
                    },
                    stateNormal: function () {
                        var player = this.player;

                        var mapCharaMgr = this.mapCharaMgr;
                        mapCharaMgr.step();

                        this.checkCollision();

                        if (this.gameOverFrameCounter < this.gameOverFrameMax) {
                            ++this.gameOverFrameCounter;
                            if (this.gameOverFrameMax <= this.gameOverFrameCounter) {
                                this.state = this.stateGameOver;
                            }
                        } else if (this.clearFrameCounter < this.clearFrameMax) {
                            ++this.clearFrameCounter;
                            if (this.clearFrameMax <= this.clearFrameCounter) {
                                this.state = this.stateGameClear;
                            }
                        } else {
                            this.countTimeLimit();
                        }
                    },
                    stateGameOver: function () {
                        var pd = g_app.playerData;

                        var userMap = g_app.storage.getUserMapForUpdate(pd.mapId);
                        userMap.playCount += 1;
                        g_app.storage.save();

                        this.state = this.stateGameStart;
                    },
                    stateGameClear: function () {
                        var _this = this;
                        var player = this.player;

                        var pd = g_app.playerData;

                        pd.score += pd.timeToScore(Math.floor(g_app.frameToSec(pd.restTimeCounter)) * 10);
                        pd.restTimeCounter = 0;

                        var mapOption = this.mapOption;
                        var userMap = g_app.storage.getUserMapForUpdate(pd.mapId);
                        userMap.playCount += 1;
                        if (mapOption.nextMapId !== 0) {
                            g_app.storage.getUserMapForUpdate(mapOption.nextMapId);
                        }
                        g_app.storage.save();

                        pd.hp = this.player.life.hp;
                        if (mapOption.nextMapId === 0) {
                            this.state = this.stateGameStart;
                        } else {
                            pd.mapId = mapOption.nextMapId;

                            this.state = this.stateWait;

                            var camera = this.camera;
                            this.fader.fadeOut2(0.5, camera.getTargetPosOnCamera(), function () {
                                player.removeFromParent(false);
                                player.viewpoint.removeFromParent(false);
                                _this.state = _this.stateGameStart;
                            });
                        }
                    },
                    loadMapData: function (mapData) {
                        cc.log("loadMapData");
                        var scene = this;
                        var map = scene.map;
                        var mapOption = DF.MAP_OPTIONS[g_app.playerData.mapId];
                        for (var key in mapOption) {
                            scene.mapOption[key] = mapOption[key];
                        }
                        map.load(res[mapOption.resName]);

                        (function () {
                            var mapCharaMgr = scene.mapCharaMgr;
                            var enemyIdx = 0;
                            var layer = map.getLayer("chara");
                            layer.layer.visible = false;
                            layer.eachTileGIDs(loadChara);
                            function loadChara(charaId, gridPos, la) {
                                if (charaId === 0) {
                                    return;
                                }
                                var tileWldPos = layer.gridToWorldPos(gridPos);
                                var left = tileWldPos.x;
                                var center = tileWldPos.x + DF.MAP_TILE_W * 0.5;
                                var top = tileWldPos.y + DF.MAP_TILE_H;
                                var middle = tileWldPos.y + DF.MAP_TILE_H * 0.5;
                                var bottom = tileWldPos.y;

                                if (charaId === DF.MAP_TILE_PLAYER_POS) {
                                    var player = scene.player;
                                    player.x = center;
                                    player.y = bottom + player.height * 0.5;
                                } else if (DF.MAP_TILE_CHARA_MIN <= charaId) {
                                    var enemyId = charaId - DF.MAP_TILE_CHARA_MIN;
                                    var data = kimiko.game.EnemyData[enemyId];
                                    var enemy = new kimiko.game.Enemy();
                                    enemy.stopAllActions();
                                    enemy.enemyId = enemyId;
                                    var isEasy = g_app.storage.root.userConfig.difficulty <= 1;
                                    if (isEasy) {
                                        enemy.life.hpMax = Math.ceil(data.hpMax / 2);
                                    } else {
                                        enemy.life.hpMax = data.hpMax;
                                    }
                                    enemy.life.hp = enemy.life.hpMax;
                                    data.body(enemy);

                                    var anchorX = left;
                                    var anchorY = top;

                                    var aligns = data.align.split(" ");
                                    var alignH = aligns[0];
                                    var alignV = aligns[1];
                                    switch (alignH) {
                                        case "left":
                                            anchorX = left;
                                            break;
                                        case "center":
                                            anchorX = left + (DF.MAP_TILE_W - enemy.width) / 2;
                                            break;
                                        case "right":
                                            anchorX = left + DF.MAP_TILE_W - enemy.width;
                                            break;
                                        default:
                                            cc.log("unknown case:" + alignH);
                                            break;
                                    }
                                    switch (alignV) {
                                        case "top":
                                            anchorY = top;
                                            break;
                                        case "middle":
                                            anchorY = top + (DF.MAP_TILE_H - enemy.height) / 2;
                                            break;
                                        case "bottom":
                                            anchorY = top + DF.MAP_TILE_H - enemy.height;
                                            break;
                                        default:
                                            cc.log("unknown case:" + alignV);
                                            break;
                                    }

                                    enemy.x = enemy.anchor.x = anchorX;
                                    enemy.y = enemy.anchor.y = anchorY;
                                    data.brain(enemy);
                                    enemy.name = "enemy" + (++enemyIdx);
                                    mapCharaMgr.addSleep(enemy);
                                }
                            }
                            ;
                        })();
                        var camera = scene.camera;
                        camera.limitRect.x = 0;
                        camera.limitRect.y = 0;
                        camera.limitRect.width = map.map.width;
                        camera.limitRect.height = map.map.height;

                        cc.log("map.wh: " + map.map.width + ", " + map.map.height + ", " + "layer.wh: " + map.getLayer("ground").layer.width + ", " + map.getLayer("ground").layer.height + ", " + "");

                        var player = scene.player;
                        player.removeFromParent(false);
                        player.viewpoint.removeFromParent(false);
                        this.world.addChild(player);
                        this.world.addChild(player.viewpoint);
                        osakana4242.utils.Rect.copyFrom(player.limitRect, camera.limitRect);
                        player.touchStartAnchor.x = player.x;
                        player.touchStartAnchor.y = player.y;
                        player.startMap();

                        camera.targetNode = player.viewpoint;
                        camera.moveToTarget();
                    },
                    addEffect: function (animId, pos) {
                        var scene = cc.director.getRunningScene();
                        var effect = scene.effectPool.alloc();
                        if (effect === null) {
                            return;
                        }
                        effect.anim.sequence = g_app.getAnimFrames(animId);
                        effect.rect.centerX = pos.x;
                        effect.rect.centerY = pos.y;
                        effect.x += -1 + Math.random() * 3;
                        effect.y += -1 + Math.random() * 3;
                        this.world.addChild(effect);
                        return effect;
                    },
                    onPlayerDead: function () {
                        var scene = this;

                        scene.gameOverFrameMax = g_app.secToFrame(1.0);
                        scene.gameOverFrameCounter = 0;
                    },
                    onAllEnemyDead: function () {
                        var scene = this;
                        var mapOption = scene.mapOption;
                        switch (mapOption.exitType) {
                            case "door":
                                if (DF.IS_HIDDEN_DOOR) {
                                    scene.map.loadData(scene.mapWork.groundTilesOrig);
                                }
                                break;
                            case "enemy_zero":
                                scene.clearFrameMax = g_app.secToFrame(3.0);
                                scene.clearFrameCounter = 0;
                                break;
                            default:
                                cc.log("unkown exitType:" + mapOption.exitType);
                                break;
                        }
                    },
                    getNearEnemy: function (sprite, searchRect) {
                        var mapCharaMgr = this.mapCharaMgr;
                        var enemys = mapCharaMgr.actives;

                        var near = null;
                        var nearSqrDistance = 0;
                        for (var i = 0, iNum = enemys.length; i < iNum; ++i) {
                            var enemy = enemys[i];
                            if (enemy.life.isDead) {
                                continue;
                            }
                            if (!osakana4242.utils.Rect.intersect(searchRect, enemy)) {
                                continue;
                            }
                            var sqrDistance = osakana4242.utils.Rect.distance(sprite, enemy);
                            if (near === null) {
                                near = enemy;
                                nearSqrDistance = sqrDistance;
                            } else if (sqrDistance < nearSqrDistance) {
                                near = enemy;
                                nearSqrDistance = sqrDistance;
                            }
                        }
                        return near;
                    },
                    newEnemyBullet: function () {
                        var bullet = this.enemyBulletPool.alloc();
                        if (!bullet) {
                            return null;
                        }
                        bullet.ageMax = g_app.secToFrame(5);
                        this.world.addChild(bullet);
                        return bullet;
                    },
                    newOwnBullet: function () {
                        var bullet = this.ownBulletPool.alloc();
                        if (!bullet) {
                            return null;
                        }
                        bullet.ageMax = g_app.secToFrame(0.4);
                        this.world.addChild(bullet);
                        return bullet;
                    },
                    intersectActiveArea: function (sprite) {
                        var player = this.player;
                        var minX = player.rect.centerX - DF.SC1_W;
                        var maxX = player.rect.centerX + DF.SC1_W;
                        if (minX <= sprite.rect.centerX && sprite.rect.centerX <= maxX) {
                            return true;
                        }
                        return false;
                    },
                    countTimeLimit: function () {
                        var pd = g_app.playerData;
                        if (pd.restTimeCounter <= 0) {
                            return;
                        }
                        --pd.restTimeCounter;
                    },
                    updateStatusText: function () {
                        var scene = this;
                        var player = this.player;
                        var pd = g_app.playerData;
                        var mapCharaMgr = this.mapCharaMgr;
                        var texts = this.statusTexts;
                        var lifeText = g_app.stringUtil.mul("[@]", player.life.hp) + osakana4242.utils.StringUtil.mul("[ ]", player.life.hpMax - player.life.hp);
                        texts[0][0] = "LIFE  " + lifeText;
                        texts[1][0] = "SCORE " + g_app.playerData.score;
                        texts[2][0] = "TIME  " + Math.floor(g_app.frameToSec(pd.restTimeCounter));

                        if (g_app.testHud.parent) {
                            g_app.testHud.labels[2].setString("V:" + Math.floor(player.viewpoint.x) + "x" + Math.floor(player.viewpoint.y) + " " + "C:" + Math.floor(this.camera.x) + "x" + Math.floor(this.camera.y) + " " + "G:" + player.tileGid + " " + (player.targetEnemy ? "L" : " ") + " " + "");
                        }

                        for (var i = 0, iNum = texts.length; i < iNum; ++i) {
                            var line = texts[i].join(" ");
                            this.labels[i].setString(line);
                        }
                    },
                    mapGridToWorldPos: function (layer, gridPos) {
                        return cc.p(gridPos.x * DF.MAP_TILE_W, gridPos.y * DF.MAP_TILE_H);
                    },
                    hitTest: function (layer, x, y) {
                        var gid = layer.getGID(x, y);
                        return DF.MAP_TILE_COLLISION_MIN <= gid && gid <= DF.MAP_TILE_COLLISION_MAX;
                    },
                    checkMapCollision: function (spr, onTrim, onIntersect) {
                        var sprRect = spr.collider.getRect();
                        var sprForceX = spr.force.x;
                        var sprForceY = spr.force.y;

                        var map = this.map;
                        var tileSize = map.map.getTileSize();
                        var layer = map.getLayer("ground");
                        var xDiff = tileSize.width;
                        var yDiff = tileSize.height;

                        var xMin = sprRect.x;
                        var yMin = sprRect.y;
                        var xMax = sprRect.x + sprRect.width + (xDiff - 1);
                        var yMax = sprRect.y + sprRect.height + (yDiff - 1);

                        var tileRect = osakana4242.utils.Rect.alloc();
                        tileRect.width = tileSize.width;
                        tileRect.height = tileSize.height;
                        spr.tileGid = layer.getGID(spr.x, spr.y);
                        try  {
                            for (var y = yMin; y < yMax; y += yDiff) {
                                for (var x = xMin; x < xMax; x += xDiff) {
                                    tileRect.x = Math.floor(x / tileSize.width) * tileSize.width;
                                    tileRect.y = Math.floor(y / tileSize.height) * tileSize.height;
                                    if (!osakana4242.utils.Rect.intersect(sprRect, tileRect)) {
                                        continue;
                                    }
                                    var gid = layer.getGID(x, y);
                                    if (onIntersect) {
                                        onIntersect.call(spr, gid, x, y);
                                    }
                                    if (!this.hitTest(layer, x, y)) {
                                        continue;
                                    }

                                    var addX = 0;
                                    var addY = 0;

                                    var isTrimX = false;
                                    var isTrimY = false;

                                    if (0 < sprForceX) {
                                        if (this.hitTest(layer, x - xDiff, y)) {
                                        } else {
                                            addX = (tileRect.x - sprRect.width) - sprRect.x;
                                            isTrimX = true;
                                        }
                                    } else if (sprForceX < 0) {
                                        if (this.hitTest(layer, x + xDiff, y)) {
                                        } else {
                                            addX = (tileRect.x + tileRect.width) - sprRect.x;
                                            isTrimX = true;
                                        }
                                    }

                                    if (0 < sprForceY) {
                                        if (this.hitTest(layer, x, y - yDiff)) {
                                        } else {
                                            addY = (tileRect.y - sprRect.height) - sprRect.y;
                                            isTrimY = true;
                                        }
                                    } else if (sprForceY < 0) {
                                        if (this.hitTest(layer, x, y + yDiff)) {
                                        } else {
                                            addY = (tileRect.y + tileRect.height) - sprRect.y;
                                            isTrimY = true;
                                        }
                                    }

                                    var cmp = addX * addX - addY * addY;
                                    if (isTrimX && (!isTrimY || cmp < 0)) {
                                        spr.x += addX;
                                        sprRect.x += addX;
                                        onTrim.call(spr, g_app.numberUtil.sign(-addX), 0);
                                    } else if (isTrimY) {
                                        spr.y += addY;
                                        sprRect.y += addY;
                                        onTrim.call(spr, 0, g_app.numberUtil.sign(-addY));
                                    }

                                    if (!spr.parent) {
                                        return;
                                    }
                                }
                            }
                        } finally {
                            osakana4242.utils.Rect.free(tileRect);
                        }
                    },
                    checkCollision: function () {
                        var scene = this;
                        var mapCharaMgr = this.mapCharaMgr;
                        var player = this.player;
                        var enemys = mapCharaMgr.actives;

                        var bullets = this.enemyBulletPool.actives;
                        for (var i = bullets.length - 1; 0 <= i; --i) {
                            var bullet = bullets[i];
                            if (bullet.visible && player.life.canAddDamage && player.collider.intersect(bullet.collider)) {
                                player.life.addDamage(1);
                                if (player.life.isDead) {
                                    this.onPlayerDead();
                                }
                                g_app.sound.playSe(kimiko.Assets.SOUND_SE_HIT);
                                this.addEffect(DF.ANIM_ID_DAMAGE, bullet.rect.center);
                                bullet.free();
                            }
                        }

                        for (var i = enemys.length - 1; 0 <= i; --i) {
                            var enemy = enemys[i];
                            if (player.life.canAddDamage && player.collider.intersect(enemy.collider)) {
                                player.life.addDamage(1);
                                if (player.life.isDead) {
                                    this.onPlayerDead();
                                }
                                g_app.sound.playSe(kimiko.Assets.SOUND_SE_HIT);
                                this.addEffect(DF.ANIM_ID_DAMAGE, player.rect.center);
                            }
                        }

                        for (var i = enemys.length - 1; 0 <= i; --i) {
                            var enemy = enemys[i];
                            var bullets = this.ownBulletPool.actives;
                            for (var j = bullets.length - 1; 0 <= j; --j) {
                                var bullet = bullets[j];
                                if (bullet.visible && enemy.life.canAddDamage && enemy.collider.intersect(bullet.collider)) {
                                    enemy.life.addDamage(1);
                                    g_app.playerData.score += 10;
                                    if (enemy.life.isDead) {
                                        var ed = enemy.enemyData;
                                        g_app.playerData.score += ed.score;
                                        if (mapCharaMgr.isAllDead()) {
                                            scene.onAllEnemyDead();
                                        }
                                    }
                                    if (!enemy.life.isDead) {
                                        g_app.sound.playSe(kimiko.Assets.SOUND_SE_HIT);
                                        this.addEffect(DF.ANIM_ID_DAMAGE, bullet.rect.center);
                                    } else {
                                        g_app.sound.playSe(kimiko.Assets.SOUND_SE_KILL);
                                    }
                                    bullet.free();
                                }
                            }
                        }
                    }
                });
            })(kimiko.scenes || (kimiko.scenes = {}));
            var scenes = kimiko.scenes;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));

var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (scenes) {
                var g_app = jp.osakana4242.kimiko.g_app;

                scenes.GameClear = cc.Scene.extend({});
            })(kimiko.scenes || (kimiko.scenes = {}));
            var scenes = kimiko.scenes;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));

var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (scenes) {
                var g_app = jp.osakana4242.kimiko.g_app;

                scenes.GameEndMenu = cc.Scene.extend({});
            })(kimiko.scenes || (kimiko.scenes = {}));
            var scenes = kimiko.scenes;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));

var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (scenes) {
                var g_app = jp.osakana4242.kimiko.g_app;

                scenes.GameOver = cc.Scene.extend({});
            })(kimiko.scenes || (kimiko.scenes = {}));
            var scenes = kimiko.scenes;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));

var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (scenes) {
                var g_app = jp.osakana4242.kimiko.g_app;

                scenes.GameStart = cc.Scene.extend({
                    ctor: function () {
                        this._super();
                    },
                    onEnter: function () {
                        this._super();

                        var scene = this;

                        var scdSize = oskn.conf.scdSize;

                        var aaa = this.aaa = new oskn.AspectAnchorAdjuster();
                        aaa.addToScene(this);

                        var bg1 = (function () {
                            var spr = cc.Sprite.create(res.game_start_bg_png);
                            spr.x = 0;
                            spr.y = 0;
                            return spr;
                        })();

                        var label1 = (function () {
                            var spr = cc.LabelBMFont.create("GOOD NIGHT...", res.font_fnt);
                            var ax = 0;
                            var ay = 0;
                            spr.x = ax;
                            spr.y = ay;
                            spr.runAction(cc.RepeatForever.create(cc.Sequence.create(cc.EaseSineInOut.create(cc.MoveTo.create(1.0, cc.p(ax + 0, ay + 8 * kimiko.DF.DOWN))), cc.EaseSineInOut.create(cc.MoveTo.create(1.0, cc.p(ax + 0, ay + 8 * kimiko.DF.UP))))));
                            return spr;
                        })();

                        var fader = this.fader = new scenes.Fader(aaa.topNode, oskn.conf.scdSize);

                        aaa.topNode.addChild(bg1);
                        aaa.topNode.addChild(label1);

                        (function () {
                            fader.setBlack(true);
                            scene.runAction(cc.Sequence.create(cc.CallFunc.create(function () {
                                fader.fadeIn(0.5);
                            }), cc.DelayTime.create(0.5), cc.DelayTime.create(2.0), cc.CallFunc.create(scene.next, scene)));
                        })();

                        var listener = cc.EventListener.create({
                            event: cc.EventListener.TOUCH_ONE_BY_ONE,
                            swallowTouches: true,
                            onTouchBegan: function (t, evt) {
                                return true;
                            },
                            onTouchMoved: function (t, evt) {
                                return true;
                            },
                            onTouchEnded: function (t, evt) {
                                return scene.onTouchEnded(t, evt);
                            },
                            onTouchCancelled: function (t, evt) {
                                return scene.onTouchEnded(t, evt);
                            }
                        });
                        cc.eventManager.addListener(listener, scene);
                    },
                    onExit: function () {
                        this._super();
                    },
                    onTouchEnded: function (t, evt) {
                        cc.log("onTouchEnded");
                        this.next();
                        return true;
                    },
                    next: function () {
                        this.fader.fadeOut2(1.0, new osakana4242.utils.Vector2D(32, 32), function () {
                            cc.log("goto gameScene");
                            cc.director.runScene(new jp.osakana4242.kimiko.scenes.GameScene());
                        });
                    }
                });
            })(kimiko.scenes || (kimiko.scenes = {}));
            var scenes = kimiko.scenes;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));

var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (scenes) {
                var g_app = jp.osakana4242.kimiko.g_app;

                scenes.SendResult = cc.Scene.extend({});
            })(kimiko.scenes || (kimiko.scenes = {}));
            var scenes = kimiko.scenes;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));
var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (scenes) {
                var g_app = jp.osakana4242.kimiko.g_app;
                var DF = jp.osakana4242.kimiko.DF;

                scenes.TitleScene = cc.Scene.extend({
                    ctor: function () {
                        this._super();
                    },
                    onEnter: function () {
                        this._super();

                        var scdSize = oskn.conf.scdSize;

                        var aaa = this.aaa = new oskn.AspectAnchorAdjuster();
                        aaa.addToScene(this);

                        g_app.sound.stopBgm();

                        var scene = this;
                        var mapIds = [];

                        cc.log("isTestMapEnabled: " + g_app.config.isTestMapEnabled);
                        if (g_app.config.isTestMapEnabled) {
                            for (var key in DF.MAP_OPTIONS) {
                                cc.log("map:" + key);
                                mapIds.push(parseInt(key));
                            }
                        } else {
                            for (var key in g_app.storage.root.userMaps) {
                                cc.log("map:" + key);
                                if (DF.MAP_OPTIONS[key]) {
                                    mapIds.push(parseInt(key));
                                }
                            }
                        }
                        mapIds.sort(function (a, b) {
                            return a - b;
                        });

                        var mapIdsIdx = 0;

                        var title = (function () {
                            var spr = cc.LabelBMFont.create("KIMIKO'S NIGHTMARE", res.font_fnt);
                            spr.x = 0;
                            spr.y = (scdSize.height - spr.height) / 2 - spr.height;
                            return spr;
                        })();

                        var player = (function () {
                            var spr = cc.Sprite.create(res.chara001_png);
                            spr.anim = new osakana4242.utils.AnimSequencer(spr);
                            spr.anim.sequence = g_app.getAnimFrames(DF.ANIM_ID_CHARA001_WALK);
                            spr.x = 0;
                            spr.y = -(scdSize.height - spr.height) / 2 + spr.height;

                            return spr;

                            return spr;
                        })();

                        var author = (function () {
                            var spr = cc.LabelBMFont.create("created by @osakana4242", res.font_fnt);
                            spr.x = 0;
                            spr.y = -(scdSize.height - spr.height) / 2;
                            return spr;
                        })();

                        var mapLabel = (function () {
                            var spr = cc.LabelBMFont.create(" ", res.font_fnt);
                            spr.x = 0;
                            spr.y = spr.height * 1 * DF.UP;
                            spr.textAlign = cc.TEXT_ALIGNMENT_CENTER;
                            return spr;
                        })();

                        var mapLabel2 = (function () {
                            var spr = cc.LabelBMFont.create(" ", res.font_fnt);
                            spr.x = 0;
                            spr.y = spr.height * 0 * DF.UP;
                            spr.textAlign = cc.TEXT_ALIGNMENT_CENTER;
                            return spr;
                        })();

                        function getMapTitle(mapId) {
                            return "STAGE " + Math.floor(mapId / 100) + "-" + (mapId % 100);
                        }

                        function updateMapLabel() {
                            var mapId = mapIds[mapIdsIdx];
                            mapLabel2.setString(getMapTitle(mapId));
                        }
                        updateMapLabel();

                        var leftBtn = (function () {
                            var spr = oskn.MenuItem.createByTitle("<", 48, 48, prevMap, scene);
                            spr.x = -1 * scdSize.width / 3;
                            spr.y = spr.height * 0;
                            return spr;
                        })();

                        var rightBtn = (function () {
                            var spr = oskn.MenuItem.createByTitle(">", 48, 48, nextMap, scene);
                            spr.x = 1 * scdSize.width / 3;
                            spr.y = spr.height * 0;
                            return spr;
                        })();

                        var startBtn = (function () {
                            var spr = oskn.MenuItem.createByTitle("START", 160, 48, gotoGameStart, scene);
                            spr.x = 0;
                            spr.y = spr.height * -1;
                            return spr;
                        })();

                        var configBtn = (function () {
                            var spr = oskn.MenuItem.createByTitle("CONFIG", 160, 48, gotoConfig, scene);
                            spr.x = 0;
                            spr.y = spr.height * -2;
                            return spr;
                        })();

                        var menu = cc.Menu.create(leftBtn, rightBtn, startBtn, configBtn);
                        menu.x = 0;
                        menu.y = 0;

                        scene.backgroundColor = "rgb( 16, 16, 16)";
                        aaa.topNode.addChild(title);
                        aaa.centerNode.addChild(player);
                        aaa.centerNode.addChild(mapLabel);
                        aaa.centerNode.addChild(mapLabel2);
                        aaa.centerNode.addChild(menu);
                        aaa.bottomNode.addChild(author);
                        g_app.addTestHudTo(this);

                        var fader = this.fader = new scenes.Fader(aaa.centerNode);
                        fader.setBlack(true);
                        fader.fadeIn(0.2);

                        function nextMap() {
                            g_app.sound.playSe(res.SND_SE_CURSOR);
                            mapIdsIdx = (mapIdsIdx + mapIds.length + 1) % mapIds.length;
                            updateMapLabel();
                        }

                        function prevMap() {
                            g_app.sound.playSe(res.SND_SE_CURSOR);
                            mapIdsIdx = (mapIdsIdx + mapIds.length - 1) % mapIds.length;
                            updateMapLabel();
                        }

                        function gotoConfig() {
                            cc.log("gotoConfig");
                            g_app.sound.playSe(res.SND_SE_OK);
                            fader.fadeOut(0.1, function () {
                                cc.log("fadeOut end");
                                cc.director.runScene(new scenes.Config());
                            });
                        }
                        ;

                        function gotoGameStart() {
                            cc.log("gotoGameStart");
                            scene.touchEnabled = true;
                            g_app.sound.playSe(res.SND_SE_OK);
                            var pd = g_app.playerData;
                            pd.reset();
                            pd.mapId = mapIds[mapIdsIdx];
                            fader.fadeOut(0.3, function () {
                                cc.director.runScene(new scenes.GameStart());
                            });
                        }
                        ;

                        mapLabel.visible = 2 <= mapIds.length;
                        mapLabel2.visible = 2 <= mapIds.length;
                        leftBtn.visible = 2 <= mapIds.length;
                        rightBtn.visible = 2 <= mapIds.length;
                    },
                    onExit: function () {
                        this._super();
                        this.fader.destroy();
                    }
                });
            })(kimiko.scenes || (kimiko.scenes = {}));
            var scenes = kimiko.scenes;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));
var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            var g_app = jp.osakana4242.kimiko.g_app;
            var DF = jp.osakana4242.kimiko.DF;

            var SpriteLayouter = (function () {
                function SpriteLayouter(parentNode) {
                    this.sprites = {};
                    this.scale = new osakana4242.utils.Vector2D(1.0, 1.0);
                    this.node = cc.Node.create();
                    parentNode.addChild(this.node);
                }
                SpriteLayouter.prototype.scalePosition = function (rect, origin, scale) {
                    return rect;
                };

                SpriteLayouter.prototype.flipPosition = function (rect, origin, isFlipX, isFlipY) {
                    return rect;
                };

                SpriteLayouter.prototype._transition = function (layoutName, isUseTl, scale) {
                    cc.log("transition: " + layoutName);

                    var rect = osakana4242.utils.Rect.alloc(0, 0, 320, 320);
                    var sprRect = osakana4242.utils.Rect.alloc();

                    var origin = rect.center;

                    for (var i = 0, iNum = this.layout.length; i < iNum; ++i) {
                        var l = this.layout[i];
                        if (l.layoutName !== layoutName) {
                            continue;
                        }
                        var spr = this.sprites[l.spriteName];
                        if (!spr) {
                            continue;
                        }
                        cc.log("spr:" + l.spriteName);

                        sprRect.x = l.x;
                        sprRect.y = l.y;
                        sprRect.width = spr.width;
                        sprRect.height = spr.height;
                        this.scalePosition(sprRect, origin, scale);

                        if (isUseTl) {
                            var tl = [];
                            if (0 < l.delay) {
                                tl.push(cc.DelayTime.create(l.delay));
                            }
                            if (l.visible) {
                                tl.push(cc.CallFunc.create(function () {
                                    cc.log("move start. " + this.x + " " + this.y);
                                    this.visible = true;
                                }, spr));
                            }
                            tl.push(cc.MoveTo.create(0.2, sprRect));
                            if (!l.visible) {
                                tl.push(cc.CallFunc.create(function () {
                                    this.visible = false;
                                }, spr));
                            }
                            tl.push(cc.CallFunc.create(function () {
                                cc.log("move ok. " + this.x + " " + this.y);
                            }, spr));
                            spr.runAction(cc.Sequence.create(tl));
                        } else {
                            spr.x = sprRect.x;
                            spr.y = sprRect.y;
                            spr.visible = l.visible;
                        }
                    }

                    osakana4242.utils.Rect.free(rect);
                    osakana4242.utils.Rect.free(sprRect);
                };

                SpriteLayouter.prototype.transition = function (layoutName, isUseTl) {
                    var _this = this;
                    var scale = new osakana4242.utils.Vector2D(this.scale.x, this.scale.y);
                    if (!g_app.storage.root.userConfig.isUiRight) {
                    }

                    if (!isUseTl && this.node.getNumberOfRunningActions() <= 0) {
                        this._transition(layoutName, isUseTl, scale);
                        return;
                    }

                    this.node.runAction(cc.Sequence.create(cc.CallFunc.create(function () {
                        _this._transition(layoutName, isUseTl, scale);
                    }), oskn.WaitUntil.create(function () {
                        for (var key in _this.sprites) {
                            var spr = _this.sprites[key];
                            if (0 < spr.getNumberOfRunningActions()) {
                                return false;
                            }
                        }
                        return true;
                    })));
                };
                return SpriteLayouter;
            })();
            kimiko.SpriteLayouter = SpriteLayouter;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));

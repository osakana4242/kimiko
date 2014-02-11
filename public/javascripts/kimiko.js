var jp;
(function (jp) {
    (function (osakana4242) {
        (function (utils) {
            (function (StringUtil) {
                /** 文字列を指定回数繰り返す.文字列に数値を掛け算. */
                function mul(v, count) {
                    var ret = "";
                    while (count !== 0) {
                        ret += v;
                        --count;
                    }
                    return ret;
                }
                StringUtil.mul = mul;
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

                // a の外側に b がいるか.
                Rect.outside = function (a, b) {
                    return (b.x + b.width < a.x) || (a.x + a.width <= b.x) || (b.y + b.height < a.y) || (a.y + a.height <= b.y);
                };

                Rect.intersect = function (a, other) {
                    return (a.x < other.x + other.width) && (other.x < a.x + a.width) && (a.y < other.y + other.height) && (other.y < a.y + a.height);
                };

                Rect.distance = function (a, b) {
                    var dx = Math.max(b.x - (a.x + a.width), a.x - (b.x + b.width));
                    var dy = Math.max(b.y - (b.y + b.height), a.y - (b.y + b.height));

                    // 食い込んでるのは距離0とする.
                    if (dx < 0) {
                        dx = 0;
                    }
                    if (dy < 0) {
                        dy = 0;
                    }

                    //
                    if (dx !== 0 && dy !== 0) {
                        return Math.sqrt((dx * dx) + (dy * dy));
                    } else if (dx !== 0) {
                        return dx;
                    } else {
                        return dy;
                    }
                };

                // own を limitRect の中に収める.
                Rect.trimPos = function (ownRect, limitRect, onTrim) {
                    if (typeof onTrim === "undefined") { onTrim = null; }
                    // 移動制限.
                    if (ownRect.x < limitRect.x) {
                        // <
                        ownRect.x = limitRect.x;
                        if (onTrim) {
                            onTrim.call(ownRect, -1, 0);
                        }
                    }
                    if (limitRect.x + limitRect.width < ownRect.x + ownRect.width) {
                        // >
                        ownRect.x = limitRect.x + limitRect.width - ownRect.width;
                        if (onTrim) {
                            onTrim.call(ownRect, 1, 0);
                        }
                    }
                    if (ownRect.y < limitRect.y) {
                        // ^
                        ownRect.y = limitRect.y;
                        if (onTrim) {
                            onTrim.call(ownRect, 0, -1);
                        }
                    }
                    if (limitRect.y + limitRect.height < ownRect.y + ownRect.height) {
                        // v
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

            /** 矩形の当たり判定 */
            var Collider = (function () {
                function Collider() {
                    var _this = this;
                    this.rect = new Rect();
                    this.relRect = new Rect();
                    this.workRect = new Rect();
                    this.onAdded = function () {
                        _this.parent.parentNode.addChild(_this.sprite);
                    };
                    this.onRemoved = function () {
                        if (_this.sprite.parentNode) {
                            _this.sprite.parentNode.removeChild(_this.sprite);
                        }
                    };
                    if (false) {
                        // コリジョンの表示.
                        this.sprite = new enchant.Sprite();
                        this.sprite.backgroundColor = "rgb(255,0,0)";
                        this.sprite.addEventListener(enchant.Event.RENDER, function () {
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

                        if (this.sprite && value["addEventListener"]) {
                            var pSprite = value;
                            if (pSprite.parentNode) {
                                this.onAdded();
                            }
                            pSprite.addEventListener(enchant.Event.ADDED, this.onAdded);
                            pSprite.addEventListener(enchant.Event.REMOVED, this.onRemoved);
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
                            var shh = s.width >> 1;
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
                        x += p.x;
                        y += p.y;
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
                    var rect = this.getRect();
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
                    rect.y = parent.height - height;
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
                    this.startFrame = enchant.Core.instance.frame;
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
                    this.endFrame = enchant.Core.instance.frame;
                    this.isTouching = false;

                    this.totalDiff.x = this.end.x - this.start.x;
                    this.totalDiff.y = this.end.y - this.start.y;
                };

                Touch.prototype.getTouchElapsedFrame = function () {
                    return enchant.Core.instance.frame - this.startFrame;
                };
                return Touch;
            })();
            utils.Touch = Touch;

            var AnimSequence = (function () {
                function AnimSequence(imageName, frameWidth, frameHeight, frameTime, frameList) {
                    this.imageName = imageName;
                    this.frameTime = frameTime; // 1フレームにかける秒数。
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

                    sprite.addEventListener(enchant.Event.ENTER_FRAME, function () {
                        _this.step();
                        _this.sprite.frame = _this.curFrame;
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
                        this.sprite.image = jp.osakana4242.kimiko.kimiko.core.assets[v.imageName];
                    },
                    enumerable: true,
                    configurable: true
                });


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
                    if (jp.osakana4242.kimiko.kimiko.secToFrame(this.sequence_.frameTime) / this.speed <= this.waitCnt) {
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

            /** enchant.tl.Timeline拡張. */
            (function () {
                var Timeline = enchant.Timeline || enchant.tl.Timeline;
                Timeline.prototype.removeFromParentNode = function () {
                    return this.then(function () {
                        this.parentNode.removeChild(this);
                    });
                };
            })();

            /** enchant.Sprite拡張. */
            (function () {
                var orig = enchant.Sprite.prototype.initialize;
                enchant.Sprite.prototype.initialize = function () {
                    orig.apply(this, arguments);
                    this.center = new utils.RectCenter(this);
                    this.anim = new utils.AnimSequencer(this);
                };
            })();

            var SpritePool = (function () {
                function SpritePool(capacity, newSprite) {
                    this.sleeps = [];
                    this.actives = [];

                    for (var i = 0, iNum = capacity; i < iNum; ++i) {
                        var spr = newSprite(i);
                        this.sleeps.push(spr);
                    }
                }
                /** シーンに自前で追加する必要あり. 取得出来ない場合は null を返す.  */
                SpritePool.prototype.alloc = function () {
                    var spr = this.sleeps.shift();
                    if (spr) {
                        spr.tl.clear();
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

                /** 未使用状態にする. シーンから取り除く. */
                SpritePool.prototype.free = function (spr) {
                    if (spr.parentNode) {
                        spr.parentNode.removeChild(spr);
                    } else {
                        var a = 0;
                    }
                    spr.x = spr.y = 0x7fffffff;
                    spr.visible = false;

                    //
                    var index = this.actives.indexOf(spr);
                    if (index !== -1) {
                        this.actives.splice(index, 1);
                    } else {
                        console.log("warn can't free spr. '" + spr + "'");
                    }

                    //
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
        (function (_kimiko) {
            var Class = enchant.Class;
            var Core = enchant.Core;
            var Scene = enchant.Scene;
            var Label = enchant.Label;
            var Event = enchant.Event;

            _kimiko.kimiko = null;

            (function (Assets) {
                Assets.IMAGE_GAME_START_BG = "./images/game_start_bg.png";
                Assets.IMAGE_MAP = "./images/map.png";
                Assets.IMAGE_CHARA001 = "./images/chara001.png";
                Assets.IMAGE_CHARA002 = "./images/chara002.png";
                Assets.IMAGE_CHARA003 = "./images/chara003.png";
                Assets.IMAGE_BULLET = "./images/bullet.png";
                Assets.IMAGE_EFFECT = "./images/bullet.png";
                Assets.IMAGE_COLLIDER = "./images/collider.png";
                Assets.SOUND_BGM = "./sounds/bgm.mp3";
            })(_kimiko.Assets || (_kimiko.Assets = {}));
            var Assets = _kimiko.Assets;

            (function (DF) {
                /** ドアを隠すか. */
                DF.IS_HIDDEN_DOOR = false;

                DF.BASE_FPS = 60;
                DF.SC_W = 320;
                DF.SC_H = 320;
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

                DF.ANIM_ID_BULLET001 = 300;
                DF.ANIM_ID_BULLET002 = 301;

                DF.ANIM_ID_DAMAGE = 400;
                DF.ANIM_ID_MISS = 401;
                DF.ANIM_ID_DEAD = 402;

                DF.ANIM_ID_COLLIDER = 500;

                // スワイプで1フレームにキャラが移動できる最大距離.
                DF.TOUCH_TO_CHARA_MOVE_LIMIT = 320;

                // 一度に移動できる最大ドット数.
                DF.PLAYER_MOVE_RESOLUTION = 8;
                DF.PLAYER_HP = 3;

                // 最大連射数.
                DF.PLAYER_BULLET_NUM = 1;

                DF.FONT_M = '12px Verdana,"ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","ＭＳ ゴシック","MS Gothic",monospace';
                DF.FONT_L = '24px Verdana,"ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","ＭＳ ゴシック","MS Gothic",monospace';

                DF.GRAVITY = 0.25 * 60;

                DF.PLAYER_TOUCH_ANCHOR_ENABLE = true;

                DF.MAP_TILE_EMPTY = -1;
                DF.MAP_TILE_COLLISION_MIN = 0;
                DF.MAP_TILE_COLLISION_MAX = 15;
                DF.MAP_TILE_PLAYER_POS = 40;
                DF.MAP_TILE_DOOR_OPEN = 41;
                DF.MAP_TILE_DOOR_CLOSE = -1;
                DF.MAP_TILE_CHARA_MIN = 48;

                DF.MAP_ID_MIN = 101;
                DF.MAP_ID_MAX = 104;

                DF.MAP_OPTIONS = {
                    101: {
                        "title": "tutorial",
                        "backgroundColor": "rgb(196,196,196)",
                        //"backgroundColor": "rgb(8,8,16)",
                        // ドアあり.
                        "nextMapId": 102,
                        "exitType": "door"
                    },
                    102: {
                        "title": "tutorial",
                        "backgroundColor": "rgb(16,16,32)",
                        // ドアなし.
                        "nextMapId": 103,
                        "exitType": "door"
                    },
                    103: {
                        "title": "tutorial",
                        "backgroundColor": "rgb(32,196,255)",
                        // ドアなし.
                        "nextMapId": 104,
                        "exitType": "door"
                    },
                    104: {
                        "title": "station",
                        "backgroundColor": "rgb(32,196,255)",
                        // ドアなし.
                        "nextMapId": 105,
                        "exitType": "door"
                    },
                    105: {
                        "title": "station",
                        "backgroundColor": "rgb(32,196,255)",
                        // ドアなし.
                        "nextMapId": 106,
                        "exitType": "door"
                    },
                    106: {
                        "title": "station",
                        "backgroundColor": "rgb(32,196,255)",
                        // ドアなし.
                        "nextMapId": 107,
                        "exitType": "door"
                    },
                    107: {
                        "title": "boss",
                        "backgroundColor": "rgb(196,32,32)",
                        // ドアなし
                        // ラスト.
                        "nextMapId": 0,
                        "exitType": "enemy_zero"
                    },
                    202: {
                        "title": "trace",
                        "backgroundColor": "rgb(32,32,32)",
                        "nextMapId": 0,
                        "exitType": "door"
                    },
                    206: {
                        "title": "bunbun",
                        "backgroundColor": "rgb(32,32,32)",
                        "nextMapId": 0,
                        "exitType": "door"
                    },
                    207: {
                        "title": "hovering",
                        "backgroundColor": "rgb(32,32,32)",
                        "nextMapId": 0,
                        "exitType": "door"
                    },
                    208: {
                        "title": "horizontal move",
                        "backgroundColor": "rgb(32,32,32)",
                        "nextMapId": 0,
                        "exitType": "door"
                    },
                    209: {
                        "title": "horizontal trace",
                        "backgroundColor": "rgb(32,32,32)",
                        "nextMapId": 0,
                        "exitType": "door"
                    },
                    301: {
                        "title": "test",
                        "backgroundColor": "rgb(32,32,32)",
                        "nextMapId": 0,
                        "exitType": "door"
                    }
                };

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
            })(_kimiko.DF || (_kimiko.DF = {}));
            var DF = _kimiko.DF;

            var NumberUtil = (function () {
                function NumberUtil() {
                }
                NumberUtil.prototype.trim = function (v, vMin, vMax) {
                    return Math.max(vMin, Math.min(vMax, v));
                };

                NumberUtil.prototype.sign = function (v) {
                    if (0 <= v) {
                        return 1;
                    } else {
                        return -1;
                    }
                };
                return NumberUtil;
            })();
            _kimiko.NumberUtil = NumberUtil;

            var PlayerData = (function () {
                function PlayerData() {
                    this.reset();
                }
                PlayerData.prototype.reset = function () {
                    this.hpMax = DF.PLAYER_HP;
                    this.hp = this.hpMax;
                    this.score = 0;
                    this.restTimeCounter = 0;
                    this.restTimeMax = 0;
                    this.restTimeMax = _kimiko.kimiko.secToFrame(180);
                    this.restTimeCounter = this.restTimeMax;
                    this.mapId = DF.MAP_ID_MIN;
                };
                return PlayerData;
            })();
            _kimiko.PlayerData = PlayerData;

            var Kimiko = (function () {
                function Kimiko(config) {
                    var _this = this;
                    this.numberUtil = new NumberUtil();
                    this.animFrames = {};
                    if (Kimiko.instance) {
                        return;
                    }
                    Kimiko.instance = this;
                    this.config = config;

                    var core = new enchant.Core(DF.SC_W, DF.SC_H);
                    core.fps = config.fps || DF.BASE_FPS;

                    for (var key in Assets) {
                        if (!Assets.hasOwnProperty(key)) {
                            continue;
                        }
                        var path = Assets[key];
                        var pathSplited = path.split(".");
                        var ext = pathSplited.length <= 0 ? "" : "." + pathSplited[pathSplited.length - 1];

                        // パスにバージョンを付加.
                        var newPath = path + "?v=" + config.version + ext;
                        Assets[key] = newPath;

                        //
                        var isSound = ext === ".mp3";
                        if (!config.isSoundEnabled && isSound) {
                            continue;
                        }
                        core.preload(newPath);
                    }

                    // anim
                    (function () {
                        var r = function (animId, imageName, frameWidth, frameHeight, frameSec, frames) {
                            var seq = new jp.osakana4242.utils.AnimSequence(imageName, frameWidth, frameHeight, frameSec, frames);
                            _this.registerAnimFrames(animId, seq);
                        };
                        r(DF.ANIM_ID_CHARA001_WALK, Assets.IMAGE_CHARA001, 32, 32, 0.1, [0, 1, 0, 2]);
                        r(DF.ANIM_ID_CHARA001_STAND, Assets.IMAGE_CHARA001, 32, 32, 0.1, [0]);
                        r(DF.ANIM_ID_CHARA001_SQUAT, Assets.IMAGE_CHARA001, 32, 32, 0.1, [4]);
                        r(DF.ANIM_ID_CHARA001_DEAD, Assets.IMAGE_CHARA001, 32, 32, 0.1, [0, 1, 0, 2]);

                        r(DF.ANIM_ID_CHARA002_WALK, Assets.IMAGE_CHARA002, 32, 32, 0.1, [0, 1, 2, 3]);
                        r(DF.ANIM_ID_CHARA003_WALK, Assets.IMAGE_CHARA003, 64, 64, 0.1, [0, 1, 2, 3]);

                        r(DF.ANIM_ID_BULLET001, Assets.IMAGE_BULLET, 16, 16, 0.1, [0, 1, 2, 3]);
                        r(DF.ANIM_ID_BULLET002, Assets.IMAGE_BULLET, 16, 16, 0.1, [4, 5, 6, 7]);

                        r(DF.ANIM_ID_DAMAGE, Assets.IMAGE_EFFECT, 16, 16, 0.1, [8, 9, 10, 11]);
                        r(DF.ANIM_ID_MISS, Assets.IMAGE_EFFECT, 16, 16, 0.1, [12, 13, 14, 15]);
                        r(DF.ANIM_ID_DEAD, Assets.IMAGE_EFFECT, 16, 16, 0.1, [8, 9, 10, 11]);

                        r(DF.ANIM_ID_COLLIDER, Assets.IMAGE_COLLIDER, 16, 16, 0.1, [0]);
                    })();

                    // key bind
                    core.keybind(" ".charCodeAt(0), "a");
                    core.keybind("A".charCodeAt(0), "left");
                    core.keybind("D".charCodeAt(0), "right");
                    core.keybind("W".charCodeAt(0), "up");
                    core.keybind("S".charCodeAt(0), "down");

                    //
                    core.onload = (function () {
                        _this.gameScene = new jp.osakana4242.kimiko.scenes.Act();
                        _this.pauseScene = new jp.osakana4242.kimiko.scenes.Pause();
                        _kimiko.kimiko.playerData = new PlayerData();
                        if (true) {
                            var scene = new jp.osakana4242.kimiko.scenes.Title();
                            core.replaceScene(scene);
                        } else {
                            _kimiko.kimiko.playerData.reset();
                            _kimiko.kimiko.playerData.mapId = DF.MAP_ID_MAX;
                            core.replaceScene(_this.gameScene);
                        }
                    });
                }
                Kimiko.prototype.registerAnimFrames = function (animId, seq) {
                    this.animFrames[animId] = seq;
                };

                Kimiko.prototype.getAnimFrames = function (animId) {
                    return this.animFrames[animId];
                };

                Object.defineProperty(Kimiko.prototype, "core", {
                    get: function () {
                        return enchant.Core.instance;
                    },
                    enumerable: true,
                    configurable: true
                });

                Kimiko.prototype.secToFrame = function (sec) {
                    return this.core.fps * sec;
                };

                Kimiko.prototype.frameToSec = function (frame) {
                    return frame / this.core.fps;
                };

                /**
                毎秒Xドット(DotPerSec) を 毎フレームXドット(DotPerFrame) に変換。
                
                60FPSで1フレームに1dot → 1 x 60 = 1秒間に60dot = 60dps
                20FPSで1フレームに1dot → 1 x 20 = 1秒間に20dot = 20dps
                */
                Kimiko.prototype.dpsToDpf = function (dotPerSec) {
                    return dotPerSec ? dotPerSec / this.core.fps : 0;
                };

                /** 指定距離を指定dpsで通過できる時間(frame)
                関数名が決まらない. ('A`)
                */
                Kimiko.prototype.getFrameCountByHoge = function (distance, dps) {
                    return distance / this.dpsToDpf(dps);
                };
                Kimiko.instance = null;
                return Kimiko;
            })();
            _kimiko.Kimiko = Kimiko;

            function start(params) {
                _kimiko.kimiko = new Kimiko(params);
                _kimiko.kimiko.core.start();
            }
            _kimiko.start = start;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));
// references
/// <reference path="kimiko.ts" />
//

var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (scenes) {
                var Class = enchant.Class;
                var Core = enchant.Core;
                var Scene = enchant.Scene;
                var Label = enchant.Label;
                var Event = enchant.Event;
                var Easing = enchant.Easing;

                var Fader = (function () {
                    function Fader(scene) {
                        this.scene = scene;
                        this.film = (function () {
                            var spr = new enchant.Sprite(jp.osakana4242.kimiko.DF.SC_W, jp.osakana4242.kimiko.DF.SC_H);
                            spr.backgroundColor = "rgb(0, 0, 0)";
                            return spr;
                        })();
                    }
                    Fader.prototype.addFilm = function () {
                        this.removeFilm();
                        this.scene.addChild(this.film);
                        return this.film;
                    };

                    Fader.prototype.removeFilm = function () {
                        var film = this.film;
                        if (film.parentNode) {
                            film.parentNode.removeChild(film);
                        }
                        return film;
                    };

                    Fader.prototype.setBlack = function (isBlack) {
                        if (isBlack) {
                            var film = this.addFilm();
                            film.opacity = 1.0;
                        } else {
                            var film = this.removeFilm();
                            film.opacity = 0.0;
                        }
                    };

                    Fader.prototype.fadeIn = function (fadeFrame, callback) {
                        if (typeof callback === "undefined") { callback = null; }
                        var film = this.addFilm();
                        film.tl.clear().fadeTo(0.0, fadeFrame);
                        if (callback) {
                            film.tl.then(callback);
                        }
                        film.tl.removeFromParentNode();
                    };

                    Fader.prototype.fadeOut = function (fadeFrame, callback) {
                        if (typeof callback === "undefined") { callback = null; }
                        var film = this.addFilm();
                        film.tl.clear().fadeTo(1.0, fadeFrame);
                        if (callback) {
                            film.tl.then(callback);
                        }
                    };

                    /** キャラにスポット */
                    Fader.prototype.fadeIn2 = function (fadeFrame, target, callback) {
                        if (typeof callback === "undefined") { callback = null; }
                        var _this = this;
                        var films = [];

                        var scLeft = -jp.osakana4242.kimiko.DF.SC_W;
                        var scTop = -jp.osakana4242.kimiko.DF.SC_H;
                        var scRight = jp.osakana4242.kimiko.DF.SC_W;
                        var scBottom = jp.osakana4242.kimiko.DF.SC_H;
                        var scCenterX = 0;
                        var scCenterY = 0;

                        var frame = fadeFrame * 0.9;
                        for (var i = 0, iNum = 4; i < iNum; ++i) {
                            var film = new enchant.Sprite(jp.osakana4242.kimiko.DF.SC_W * 2, jp.osakana4242.kimiko.DF.SC_H * 2);
                            film.backgroundColor = "rgb(0, 0, 0)";
                            var mx = 0;
                            var my = 0;
                            switch (i) {
                                case 0:
                                    film.x = scCenterX - film.width;
                                    film.y = scCenterY - film.height / 2;
                                    mx = (scLeft - film.width) - film.x;
                                    my = 0;
                                    break;
                                case 1:
                                    film.x = scCenterX;
                                    film.y = scCenterY - film.height / 2;
                                    mx = scRight - film.x;
                                    my = 0;
                                    break;
                                case 2:
                                    film.x = scCenterX - film.width / 2;
                                    film.y = scCenterY - film.height;
                                    mx = 0;
                                    my = (scTop - film.height) - film.y;
                                    break;
                                case 3:
                                    film.x = scCenterX - film.width / 2;
                                    film.y = scCenterY;
                                    mx = 0;
                                    my = scBottom - film.y;
                                    break;
                            }
                            film.tl.moveBy(mx * 0.1, my * 0.1, frame * 0.4, Easing.CUBIC_EASEOUT).moveBy(mx * 0.9, my * 0.9, frame * 0.6, Easing.CUBIC_EASEIN);
                            films.push(film);
                        }

                        var group = new enchant.Group();
                        group.addEventListener(Event.ENTER_FRAME, function () {
                            // ターゲットを追う.
                            group.x = target.x;
                            group.y = target.y;
                        });

                        group.tl.delay(fadeFrame * 0.1).then(function () {
                            for (var i = 0, iNum = films.length; i < iNum; ++i) {
                                group.addChild(films[i]);
                            }
                            _this.setBlack(false);
                        }).delay(fadeFrame * 0.9).then(function () {
                            group.parentNode.removeChild(group);
                            if (callback) {
                                callback();
                            }
                        });

                        this.setBlack(true);
                        this.scene.addChild(group);
                    };

                    /** キャラにスポット */
                    Fader.prototype.fadeOut2 = function (fadeFrame, target, callback) {
                        if (typeof callback === "undefined") { callback = null; }
                        var _this = this;
                        var films = [];

                        var scLeft = -jp.osakana4242.kimiko.DF.SC_W;
                        var scTop = -jp.osakana4242.kimiko.DF.SC_H;
                        var scRight = jp.osakana4242.kimiko.DF.SC_W;
                        var scBottom = jp.osakana4242.kimiko.DF.SC_H;
                        var scCenterX = 0;
                        var scCenterY = 0;

                        var frame = fadeFrame * 0.9;
                        for (var i = 0, iNum = 4; i < iNum; ++i) {
                            var film = new enchant.Sprite(jp.osakana4242.kimiko.DF.SC_W * 2, jp.osakana4242.kimiko.DF.SC_H * 2);
                            film.backgroundColor = "rgb(0, 0, 0)";
                            var mx = 0;
                            var my = 0;
                            switch (i) {
                                case 0:
                                    film.x = scLeft - film.width;
                                    film.y = scCenterY - film.height / 2;
                                    mx = (scCenterX - film.width) - film.x;
                                    my = 0;
                                    break;
                                case 1:
                                    film.x = scRight;
                                    film.y = scCenterY - film.height / 2;
                                    mx = scCenterX - film.x;
                                    my = 0;
                                    break;
                                case 2:
                                    film.x = scCenterX - film.width / 2;
                                    film.y = scTop - film.height;
                                    mx = 0;
                                    my = (scCenterY - film.height) - film.y;
                                    break;
                                case 3:
                                    film.x = scCenterX - film.width / 2;
                                    film.y = scBottom;
                                    mx = 0;
                                    my = scCenterY - film.y;
                                    break;
                            }
                            film.tl.moveBy(mx * 0.9, my * 0.9, frame * 0.6, Easing.CUBIC_EASEOUT).moveBy(mx * 0.1, my * 0.1, frame * 0.4, Easing.CUBIC_EASEIN);
                            films.push(film);
                        }

                        var group = new enchant.Group();
                        group.addEventListener(Event.ENTER_FRAME, function () {
                            group.x = target.x;
                            group.y = target.y;
                        });

                        group.tl.delay(fadeFrame * 0.9).then(function () {
                            _this.setBlack(true);
                        }).delay(fadeFrame * 0.1).then(function () {
                            _this.setBlack(true);
                            group.parentNode.removeChild(group);
                            for (var i = 0, iNum = films.length; i < iNum; ++i) {
                                var film = films[i];
                                film.parentNode.removeChild(film);
                            }
                            if (callback) {
                                callback();
                            }
                        });
                        for (var i = 0, iNum = films.length; i < iNum; ++i) {
                            group.addChild(films[i]);
                        }
                        this.scene.addChild(group);
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
/// <reference path="act.ts" />

var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (scenes) {
                var Class = enchant.Class;
                var Core = enchant.Core;
                var Scene = enchant.Scene;
                var Label = enchant.Label;
                var Event = enchant.Event;
                var Easing = enchant.Easing;

                var WeaponA = (function () {
                    function WeaponA(sprite) {
                        this.parent = sprite;
                        this.state = this.stateNeutral;
                        this.wayNum = 1;
                        this.fireCount = 1;
                        this.fireInterval = jp.osakana4242.kimiko.kimiko.secToFrame(0.2);
                        this.reloadFrameCount = jp.osakana4242.kimiko.kimiko.secToFrame(3.0);
                        this.dir = new jp.osakana4242.utils.Vector2D(1, 0);
                        this.targetPos = new jp.osakana4242.utils.Vector2D();
                        this.speed = jp.osakana4242.kimiko.kimiko.dpsToDpf(60 * 1.0);
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
                                var v1 = jp.osakana4242.utils.Vector2D.alloc();
                                var v2 = jp.osakana4242.utils.Vector2D.alloc();

                                v1.set(this.targetPos);
                                v1.x -= parent.center.x;
                                v1.y -= parent.center.y;
                                v1.rotate(rad);
                                v1.x += parent.center.x;
                                v1.y += parent.center.y;
                                this.fireFunc(bullet, v1, speed);

                                jp.osakana4242.utils.Vector2D.free(v1);
                                jp.osakana4242.utils.Vector2D.free(v2);
                            }
                        }
                    };

                    // 直進.
                    WeaponA.fireA = function (bullet, tpos, speed) {
                        bullet.force.x = 0;
                        bullet.force.y = 0;
                        var d = jp.osakana4242.utils.Vector2D.alloc();
                        d.x = tpos.x - bullet.center.x;
                        d.y = tpos.y - bullet.center.y;
                        var mag = jp.osakana4242.utils.Vector2D.magnitude(d);
                        var d2 = 480;
                        d.x = d.x * d2 / mag;
                        d.y = d.y * d2 / mag;
                        var frame = Math.floor(d2 / speed);

                        bullet.tl.moveBy(d.x, d.y, frame).then(function () {
                            this.miss();
                        });
                        jp.osakana4242.utils.Vector2D.free(d);
                    };

                    // 直進. 最初早い.
                    WeaponA.fireC = function (bullet, tpos, speed) {
                        bullet.force.x = 0;
                        bullet.force.y = 0;
                        var d = jp.osakana4242.utils.Vector2D.alloc();
                        d.x = tpos.x - bullet.center.x;
                        d.y = tpos.y - bullet.center.y;
                        var m = jp.osakana4242.utils.Vector2D.magnitude(d);
                        var d2 = 480;
                        var dx = d.x * d2 / m;
                        var dy = d.y * d2 / m;
                        var frame1 = Math.floor(d2 * 0.2 / jp.osakana4242.kimiko.kimiko.dpsToDpf(4 * 60));
                        var frame2 = Math.floor(d2 * 0.8 / jp.osakana4242.kimiko.kimiko.dpsToDpf(1 * 60));

                        bullet.tl.moveBy(dx * 0.2, dy * 0.2, frame1).moveBy(dx * 0.8, dy * 0.8, frame2).then(function () {
                            this.miss();
                        });
                        jp.osakana4242.utils.Vector2D.free(d);
                    };

                    // なんちゃって放物線.
                    WeaponA.fireB = function (bullet, tpos, speed) {
                        bullet.force.x = 0;
                        bullet.force.y = 0;
                        var dx = tpos.x - bullet.center.x;
                        var dy = tpos.y - bullet.center.y;
                        var frameNum = jp.osakana4242.kimiko.kimiko.secToFrame(1.0);
                        bullet.tl.moveBy(dx * 0.25, dy * 0.25 - 64 * 0.7, frameNum * 0.25).moveBy(dx * 0.25, dy * 0.25 - 64 * 0.3, frameNum * 0.25).moveBy(dx * 0.25, dy * 0.25 + 64 * 0.3, frameNum * 0.25).moveBy(dx * 0.25, dy * 0.25 + 64 * 0.7, frameNum * 0.25).moveBy(dx, 320, frameNum).then(function () {
                            this.miss();
                        });
                    };

                    WeaponA.prototype.lookAtPlayer = function () {
                        var player = this.parent.scene.player;
                        this.dir.x = player.center.x - this.parent.center.x;
                        this.dir.y = player.center.y - this.parent.center.y;
                        this.targetPos.set(player.center);
                        jp.osakana4242.utils.Vector2D.normalize(this.dir);
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
                scenes.WeaponA = WeaponA;
            })(kimiko.scenes || (kimiko.scenes = {}));
            var scenes = kimiko.scenes;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));
/// <reference path="act.ts" />
var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (scenes) {
                var Class = enchant.Class;
                var Event = enchant.Event;
                var Easing = enchant.Easing;

                /** 敵弾 */
                scenes.EnemyBullet = Class.create(enchant.Sprite, {
                    initialize: function () {
                        var _this = this;
                        enchant.Sprite.call(this, 16, 16);
                        this.anim.sequence = jp.osakana4242.kimiko.kimiko.getAnimFrames(jp.osakana4242.kimiko.DF.ANIM_ID_BULLET002);
                        this.ageMax = 0;
                        this.force = new jp.osakana4242.utils.Vector2D();
                        this.force.x = 0;
                        this.force.y = 0;
                        this.collider = (function () {
                            var c = new jp.osakana4242.utils.Collider();
                            c.parent = _this;
                            jp.osakana4242.utils.Rect.copyFrom(c.rect, jp.osakana4242.utils.Collider.centerMiddle(_this, 4, 4));
                            return c;
                        })();
                    },
                    onenterframe: function () {
                        this.x += this.force.x;
                        this.y += this.force.y;

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
                        this.scene.addEffect(jp.osakana4242.kimiko.DF.ANIM_ID_MISS, this.center);
                        this.free();
                    },
                    free: function () {
                        this.scene.enemyBulletPool.free(this);
                    }
                });

                /** 自弾 */
                scenes.OwnBullet = Class.create(enchant.Sprite, {
                    initialize: function () {
                        var _this = this;
                        enchant.Sprite.call(this, 16, 16);
                        this.anim.sequence = jp.osakana4242.kimiko.kimiko.getAnimFrames(jp.osakana4242.kimiko.DF.ANIM_ID_BULLET001);
                        this.ageMax = 0;
                        this.force = new jp.osakana4242.utils.Vector2D();
                        this.force.x = 0;
                        this.force.y = 0;
                        this.collider = (function () {
                            var c = new jp.osakana4242.utils.Collider();
                            c.parent = _this;
                            jp.osakana4242.utils.Rect.copyFrom(c.rect, new jp.osakana4242.utils.Rect(-24, 4, 32, 8));
                            return c;
                        })();
                    },
                    onenterframe: function () {
                        this.x += this.force.x;
                        this.y += this.force.y;
                        var scene = this.scene;
                        var camera = this.scene.camera;

                        if (this.ageMax <= this.age) {
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

                        scene.checkMapCollision(this, this.miss);
                    },
                    miss: function () {
                        this.scene.addEffect(jp.osakana4242.kimiko.DF.ANIM_ID_MISS, this.center);
                        this.free();
                    },
                    free: function () {
                        this.scene.ownBulletPool.free(this);
                    }
                });

                /** とりあえず攻撃できるひと */
                scenes.Attacker = Class.create(enchant.Sprite, {
                    initialize: function () {
                        enchant.Sprite.call(this);
                        this.dirX = 1;
                        this.force = new jp.osakana4242.utils.Vector2D();
                        this.force.x = 0;
                        this.force.y = 0;
                        this.attackCnt = 0;
                        this.useGravity = true;
                        this.life = new jp.osakana4242.kimiko.scenes.Life();

                        this.stateNeutral.stateName = "neutral";
                        this.state = this.stateNeutral;

                        this.rectCollider_ = new jp.osakana4242.utils.Rect();
                        this.workRect_ = new jp.osakana4242.utils.Rect();

                        function onEnterFrame() {
                            this.state();
                            this.life.step();

                            var visible = true;
                            if (this.life.isGhostTime()) {
                                visible = (this.life.ghostFrameCounter & 0x1) === 0;
                            }
                            this.visible = visible;
                        }

                        this.addEventListener(Event.ENTER_FRAME, onEnterFrame);
                    },
                    stateToString: function () {
                        var dir = 0 <= this.dirX ? '>' : '<';
                        return [dir, this.state.stateName, 'cx', Math.round(this.center.x), 'cy', Math.round(this.center.y)].join();
                    },
                    stateNeutral: function () {
                    },
                    stateDamage: function () {
                        if (!this.life.isGhostTime()) {
                            this.neutral();
                        }
                    },
                    stateDead: function () {
                    },
                    neutral: function () {
                        this.state = this.stateNeutral;
                    },
                    damage: function (attacker) {
                        var damageValue = jp.osakana4242.kimiko.kimiko.config.isDamageEnabled ? 1 : 0;
                        this.life.damage(damageValue);
                        if (this.life.isAlive()) {
                            this.state = this.stateDamage;
                        } else {
                            // シボンヌ.
                            this.dead();
                        }
                    },
                    makeDeadEffect: function (spr, delay) {
                        var effect = this.scene.effectPool.alloc();
                        effect.width = spr.width;
                        effect.height = spr.height;
                        effect.backgroundColor = "rgb(196,64,64)";
                        var effectTime = jp.osakana4242.kimiko.kimiko.secToFrame(0.3);
                        effect.visible = false;

                        return effect;
                    },
                    dead: function () {
                        this.visible = false;
                        this.state = this.stateDead;

                        // 死亡エフェクト追加.
                        var effect = this.scene.addEffect(jp.osakana4242.kimiko.DF.ANIM_ID_DEAD, this.center);
                        effect.scaleX = 2.0;
                        effect.scaleY = 2.0;
                    },
                    isDead: function () {
                        return this.state === this.stateDead;
                    },
                    isDamage: function () {
                        return this.state === this.stateDamage;
                    },
                    isAttack: function () {
                        return this.state === this.stateAttack;
                    },
                    isNeutral: function () {
                        return this.state === this.stateNeutral;
                    }
                });

                // 敵はしかれたレールをなぞるだけ。
                scenes.EnemyA = Class.create(scenes.Attacker, {
                    initialize: function () {
                        scenes.Attacker.call(this);

                        this.enemyId = -1;
                        this.weapons = [];
                        for (var i = 0, iNum = 8; i < iNum; ++i) {
                            this.weapons[i] = new jp.osakana4242.kimiko.scenes.WeaponA(this);
                        }
                        this.weaponNum = 1;
                        this.anchor = new jp.osakana4242.utils.Vector2D();
                        this.collider = new jp.osakana4242.utils.Collider();
                        this.collider.parent = this;
                        this.life.setGhostFrameMax(jp.osakana4242.kimiko.kimiko.secToFrame(0.2));

                        function stepWeapons() {
                            for (var i = 0, iNum = this.weaponNum; i < iNum; ++i) {
                                this.weapons[i].step();
                            }
                        }

                        this.addEventListener(Event.ENTER_FRAME, stepWeapons);
                    },
                    weapon: { get: function () {
                            return this.weapons[0];
                        } },
                    enemyData: { get: function () {
                            return jp.osakana4242.kimiko.scenes.EnemyData[this.enemyId];
                        } },
                    isBoss: function () {
                        return this.enemyId === jp.osakana4242.kimiko.DF.ENEMY_ID_BOSS;
                    }
                });

                /** 死亡エフェクト */
                scenes.DeadEffect = Class.create(enchant.Sprite, {
                    initialize: function (attacker, delay) {
                        var _this = this;
                        enchant.Sprite.call(this);

                        this.name = "deadEffect";
                        this.width = attacker.width;
                        this.height = attacker.height;
                        this.center.x = attacker.center.x;
                        this.center.y = attacker.center.y;
                        this.backgroundColor = "rgb(196,64,64)";
                        var effectTime = jp.osakana4242.kimiko.kimiko.secToFrame(0.3);
                        this.visible = false;
                        this.scaleX = this.scaleY = 0.1;
                        this.tl.delay(delay).then(function () {
                            _this.visible = true;
                        }).scaleTo(1.0, effectTime * 0.3, enchant.Easing.SIN_EASEOUT).scaleTo(0.0, effectTime * 0.7, enchant.Easing.SIN_EASEOUT).removeFromParentNode();
                    }
                });
            })(kimiko.scenes || (kimiko.scenes = {}));
            var scenes = kimiko.scenes;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));
/// <reference path="act.ts" />

var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (scenes) {
                var Class = enchant.Class;
                var Core = enchant.Core;
                var Scene = enchant.Scene;
                var Label = enchant.Label;
                var Event = enchant.Event;
                var Easing = enchant.Easing;

                (function (EnemyBodys) {
                    function body1(sprite) {
                        sprite.width = 32;
                        sprite.height = 32;
                        sprite.anim.sequence = jp.osakana4242.kimiko.kimiko.getAnimFrames(jp.osakana4242.kimiko.DF.ANIM_ID_CHARA002_WALK);
                        jp.osakana4242.utils.Rect.copyFrom(sprite.collider.rect, jp.osakana4242.utils.Collider.centerBottom(sprite, 28, 28));
                    }
                    EnemyBodys.body1 = body1;

                    /** クネクネカラス */
                    function body2(sprite) {
                        sprite.width = 64;
                        sprite.height = 64;
                        sprite.anim.sequence = jp.osakana4242.kimiko.kimiko.getAnimFrames(jp.osakana4242.kimiko.DF.ANIM_ID_CHARA003_WALK);
                        jp.osakana4242.utils.Rect.copyFrom(sprite.collider.rect, jp.osakana4242.utils.Collider.centerMiddle(sprite, 56, 56));
                        sprite.weaponNum = 3;
                    }
                    EnemyBodys.body2 = body2;

                    /** 飛行キャラ:小 */
                    function body3(sprite) {
                        sprite.width = 32;
                        sprite.height = 16;

                        //sprite.anim.sequence = kimiko.getAnimFrames(DF.ANIM_ID_CHARA002_WALK);
                        sprite.backgroundColor = "rgb(255,48,48)";
                        jp.osakana4242.utils.Rect.copyFrom(sprite.collider.rect, jp.osakana4242.utils.Collider.centerMiddle(sprite, 28, 12));
                    }
                    EnemyBodys.body3 = body3;

                    /** 中キャラ */
                    function body4(sprite) {
                        sprite.width = 48;
                        sprite.height = 48;

                        //sprite.anim.sequence = kimiko.getAnimFrames(DF.ANIM_ID_CHARA002_WALK);
                        sprite.backgroundColor = "rgb(255,48,48)";
                        jp.osakana4242.utils.Rect.copyFrom(sprite.collider.rect, jp.osakana4242.utils.Collider.centerBottom(sprite, 32, 40));
                    }
                    EnemyBodys.body4 = body4;
                })(scenes.EnemyBodys || (scenes.EnemyBodys = {}));
                var EnemyBodys = scenes.EnemyBodys;

                (function (EnemyBrains) {
                    /** 突進. */
                    function brain1(sprite) {
                        var anchor = sprite.anchor;

                        sprite.tl.delay(jp.osakana4242.kimiko.kimiko.secToFrame(0.5)).then(function () {
                            var player = sprite.scene.player;
                            var dir = jp.osakana4242.utils.Vector2D.alloc(player.center.x - sprite.center.x, player.center.y - sprite.center.y);
                            var mag = jp.osakana4242.utils.Vector2D.magnitude(dir);
                            var dist = 480;
                            var speed = jp.osakana4242.kimiko.kimiko.dpsToDpf(2 * jp.osakana4242.kimiko.DF.BASE_FPS);
                            dir.x = dir.x * dist / mag;
                            dir.y = dir.y * dist / mag;
                            var frame = Math.floor(dist / speed);

                            sprite.tl.moveBy(dir.x, dir.y, frame).then(function () {
                                sprite.dead();
                            });

                            jp.osakana4242.utils.Vector2D.free(dir);
                        });
                    }
                    EnemyBrains.brain1 = brain1;

                    /** 追跡. */
                    function brain2(sprite) {
                        var anchor = sprite.anchor;
                        sprite.weapon.fireFunc = jp.osakana4242.kimiko.scenes.WeaponA.fireA;

                        var xMin = anchor.x + (32 * -8);
                        var xMax = anchor.x + (32 * 8);
                        var yMin = anchor.y + (32 * -8);
                        var yMax = anchor.y + (32 * 8);
                        var cnt = 0;
                        function f1(e) {
                            if (e) {
                                return false;
                            }
                            var isNext = false;
                            var player = sprite.scene.player;
                            var dir = jp.osakana4242.utils.Vector2D.alloc(jp.osakana4242.kimiko.kimiko.numberUtil.trim(player.center.x, xMin, xMax) - sprite.center.x, jp.osakana4242.kimiko.kimiko.numberUtil.trim(player.center.y, yMin, yMax) - sprite.center.y);
                            var mag = jp.osakana4242.utils.Vector2D.magnitude(dir);

                            // var dist = mag;
                            var dist = 32 * 4;
                            if (dist < 4) {
                                // 移動の必要ナシ.
                                isNext = false;
                            } else {
                                var speed = jp.osakana4242.kimiko.kimiko.dpsToDpf(2 * jp.osakana4242.kimiko.DF.BASE_FPS);
                                dir.x = dir.x * dist / mag;
                                dir.y = dir.y * dist / mag;
                                var frame = (speed === 0) ? 1 : Math.max(Math.floor(dist / speed), 1);

                                sprite.tl.moveTo(sprite.x + dir.x, sprite.y + dir.y, frame).then(function () {
                                    if (2 <= sprite.enemyData.level) {
                                        sprite.weapon.lookAtPlayer();
                                        sprite.weapon.startFire();
                                    }
                                }).delay(jp.osakana4242.kimiko.kimiko.secToFrame(0.5)).waitUntil(f1);
                                isNext = true;
                            }
                            jp.osakana4242.utils.Vector2D.free(dir);
                            return isNext;
                        }
                        sprite.tl.waitUntil(f1);
                    }
                    EnemyBrains.brain2 = brain2;

                    /** 地上ジャンプ.*/
                    function brain3(sprite) {
                        var anchor = sprite.anchor;
                        sprite.weapon.fireFunc = jp.osakana4242.kimiko.scenes.WeaponA.fireA;

                        sprite.tl.moveBy(-32 * 4 * 0.5, -32 * 3, jp.osakana4242.kimiko.kimiko.secToFrame(0.5)).moveBy(-32 * 4 * 0.5, 32 * 3, jp.osakana4242.kimiko.kimiko.secToFrame(0.5)).delay(jp.osakana4242.kimiko.kimiko.secToFrame(0.25)).then(function () {
                            if (2 <= sprite.enemyData.level) {
                                sprite.weapon.lookAtPlayer();
                                sprite.weapon.startFire();
                            }
                        }).moveBy(32 * 4 * 0.5, -32 * 3, jp.osakana4242.kimiko.kimiko.secToFrame(0.5)).moveBy(32 * 4 * 0.5, 32 * 3, jp.osakana4242.kimiko.kimiko.secToFrame(0.5)).delay(jp.osakana4242.kimiko.kimiko.secToFrame(0.25)).loop();
                    }
                    EnemyBrains.brain3 = brain3;

                    /** 天井ジャンプ. */
                    function brain4(sprite) {
                        sprite.scaleY = -1;
                        var anchor = sprite.anchor;
                        sprite.weapon.fireFunc = jp.osakana4242.kimiko.scenes.WeaponA.fireA;

                        sprite.tl.moveBy(-32 * 4 * 0.5, 32 * 3, jp.osakana4242.kimiko.kimiko.secToFrame(0.5)).moveBy(-32 * 4 * 0.5, -32 * 3, jp.osakana4242.kimiko.kimiko.secToFrame(0.5)).delay(jp.osakana4242.kimiko.kimiko.secToFrame(0.25)).then(function () {
                            if (2 <= sprite.enemyData.level) {
                                sprite.weapon.lookAtPlayer();
                                sprite.weapon.startFire();
                            }
                        }).moveBy(32 * 4 * 0.5, 32 * 3, jp.osakana4242.kimiko.kimiko.secToFrame(0.5)).moveBy(32 * 4 * 0.5, -32 * 3, jp.osakana4242.kimiko.kimiko.secToFrame(0.5)).delay(jp.osakana4242.kimiko.kimiko.secToFrame(0.25)).loop();
                    }
                    EnemyBrains.brain4 = brain4;

                    /** うろつき. */
                    function brain5(sprite) {
                        var anchor = sprite.anchor;
                        var totalFrame = jp.osakana4242.kimiko.kimiko.secToFrame(8.0);
                        sprite.tl.moveTo(anchor.x - 32 * 3 + sprite.width / 2, anchor.y, totalFrame * 0.5, Easing.LINEAR).moveTo(anchor.x + 0 + sprite.width / 2, anchor.y, totalFrame * 0.5, Easing.LINEAR).loop();
                    }
                    EnemyBrains.brain5 = brain5;

                    /** ブンブン.*/
                    function brain6(sprite) {
                        var anchor = sprite.anchor;
                        sprite.weapon.fireFunc = jp.osakana4242.kimiko.scenes.WeaponA.fireA;

                        var fire = function () {
                            if (2 <= sprite.enemyData.level) {
                                sprite.weapon.lookAtPlayer();
                                sprite.weapon.startFire();
                            }
                        };

                        sprite.tl.moveTo(anchor.x + 32 * -0.5, anchor.y + 32 * -0.5, jp.osakana4242.kimiko.kimiko.secToFrame(0.5)).moveTo(anchor.x + 32 * 0.5, anchor.y + 32 * -0.5, jp.osakana4242.kimiko.kimiko.secToFrame(0.5)).moveTo(anchor.x + 32 * -0.5, anchor.y + 32 * 0.5, jp.osakana4242.kimiko.kimiko.secToFrame(0.5)).moveTo(anchor.x + 32 * 0.0, anchor.y + 32 * 0.0, jp.osakana4242.kimiko.kimiko.secToFrame(0.5)).then(fire).moveTo(anchor.x + 32 * 0.5, anchor.y + 32 * 0.5, jp.osakana4242.kimiko.kimiko.secToFrame(0.5)).loop();
                    }
                    EnemyBrains.brain6 = brain6;

                    /** ホバリング.*/
                    function brain7(sprite) {
                        var anchor = sprite.anchor;
                        sprite.weapon.fireFunc = jp.osakana4242.kimiko.scenes.WeaponA.fireA;

                        var fire = function () {
                            if (2 <= sprite.enemyData.level) {
                                sprite.weapon.lookAtPlayer();
                                sprite.weapon.startFire();
                            }
                        };

                        var totalFrame = jp.osakana4242.kimiko.kimiko.secToFrame(2.0);
                        sprite.tl.moveTo(anchor.x, anchor.y + 32 * 1, totalFrame * 0.5, Easing.LINEAR).then(fire).moveTo(anchor.x, anchor.y + 32 * -1, totalFrame * 0.5, Easing.LINEAR).then(fire).loop();
                    }
                    EnemyBrains.brain7 = brain7;

                    /** 水平突進.*/
                    function brain8(sprite) {
                        var anchor = sprite.anchor;

                        sprite.tl.delay(jp.osakana4242.kimiko.kimiko.secToFrame(0.5)).then(function () {
                            var player = sprite.scene.player;
                            var dir = jp.osakana4242.utils.Vector2D.alloc(player.center.x - sprite.center.x, player.center.y - sprite.center.y);
                            var mag = jp.osakana4242.utils.Vector2D.magnitude(dir);
                            var dist = 480;
                            var speed = jp.osakana4242.kimiko.kimiko.dpsToDpf(2 * jp.osakana4242.kimiko.DF.BASE_FPS);
                            dir.x = dir.x * dist / mag;
                            dir.y = 0;
                            var frame = Math.floor(dist / speed);

                            sprite.tl.moveBy(dir.x, dir.y, frame).then(function () {
                                sprite.dead();
                            });

                            jp.osakana4242.utils.Vector2D.free(dir);
                        });
                    }
                    EnemyBrains.brain8 = brain8;

                    /** 水平追跡.*/
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
                            var player = sprite.scene.player;
                            var dir = jp.osakana4242.utils.Vector2D.alloc(jp.osakana4242.kimiko.kimiko.numberUtil.trim(player.center.x, xMin, xMax) - sprite.center.x, 0);
                            var mag = jp.osakana4242.utils.Vector2D.magnitude(dir);
                            if (mag < 4) {
                                // 移動の必要ナシ.
                                isNext = false;
                            } else {
                                var dist = mag;
                                var speed = jp.osakana4242.kimiko.kimiko.dpsToDpf(1 * jp.osakana4242.kimiko.DF.BASE_FPS);
                                dir.x = dir.x * dist / mag;
                                dir.y = dir.y * dist / mag;
                                var frame = (speed === 0) ? 1 : Math.max(Math.floor(dist / speed), 1);
                                sprite.tl.moveTo(sprite.x + dir.x, sprite.y + dir.y, frame).delay(jp.osakana4242.kimiko.kimiko.secToFrame(0.2)).waitUntil(f1);
                                isNext = true;
                            }
                            jp.osakana4242.utils.Vector2D.free(dir);
                            return isNext;
                        }
                        sprite.tl.waitUntil(f1);
                    }
                    EnemyBrains.brain9 = brain9;

                    // BOSS.
                    function brainBoss(sprite) {
                        var anchor = sprite.anchor;

                        var waitFire = function () {
                            return !sprite.weapon.isStateFire();
                        };

                        // 発砲の予備動作.
                        function runup() {
                            return sprite.tl.moveBy(0, -24, jp.osakana4242.kimiko.kimiko.secToFrame(0.2), Easing.CUBIC_EASEOUT).moveBy(0, 24, jp.osakana4242.kimiko.kimiko.secToFrame(0.2), Easing.CUBIC_EASEOUT).moveBy(0, -8, jp.osakana4242.kimiko.kimiko.secToFrame(0.1), Easing.CUBIC_EASEOUT).moveBy(0, 8, jp.osakana4242.kimiko.kimiko.secToFrame(0.1), Easing.CUBIC_EASEOUT).delay(jp.osakana4242.kimiko.kimiko.secToFrame(0.5));
                        }

                        function fireToPlayer() {
                            var wp = sprite.weapons[0];
                            wp.fireCount = 5;
                            wp.wayNum = 4;
                            wp.fireInterval = jp.osakana4242.kimiko.kimiko.secToFrame(0.5);
                            wp.speed = jp.osakana4242.kimiko.kimiko.dpsToDpf(3 * jp.osakana4242.kimiko.DF.BASE_FPS);
                            wp.fireFunc = jp.osakana4242.kimiko.scenes.WeaponA.fireC;
                            wp.isTracePlayer = true;
                            wp.lookAtPlayer();
                            wp.startFire();

                            wp = sprite.weapons[1];
                            wp.fireCount = 3;
                            wp.wayNum = 1;
                            wp.fireInterval = jp.osakana4242.kimiko.kimiko.secToFrame(0.75);
                            wp.speed = jp.osakana4242.kimiko.kimiko.dpsToDpf(2 * jp.osakana4242.kimiko.DF.BASE_FPS);
                            wp.fireFunc = jp.osakana4242.kimiko.scenes.WeaponA.fireA;
                            wp.isTracePlayer = true;
                            wp.startFire();
                        }

                        function fireToPlayer2() {
                            var wp = sprite.weapon;
                            wp.fireCount = 9;
                            wp.wayNum = 1;
                            wp.fireInterval = jp.osakana4242.kimiko.kimiko.secToFrame(0.5);
                            wp.speed = jp.osakana4242.kimiko.kimiko.dpsToDpf(3 * jp.osakana4242.kimiko.DF.BASE_FPS);
                            wp.fireFunc = jp.osakana4242.kimiko.scenes.WeaponA.fireB;
                            wp.isTracePlayer = true;
                            wp.lookAtPlayer();
                            wp.startFire();

                            wp = sprite.weapons[1];
                            wp.fireCount = 1;
                            wp.wayNum = 1;
                            wp.fireInterval = jp.osakana4242.kimiko.kimiko.secToFrame(1.5);
                            wp.speed = jp.osakana4242.kimiko.kimiko.dpsToDpf(1 * jp.osakana4242.kimiko.DF.BASE_FPS);
                            wp.fireFunc = jp.osakana4242.kimiko.scenes.WeaponA.fireA;
                            wp.isTracePlayer = true;
                            wp.startFire();
                        }

                        function fireToPlayer3() {
                            var wp = sprite.weapons[0];
                            wp.fireCount = 1;
                            wp.wayNum = 6;
                            wp.fireInterval = jp.osakana4242.kimiko.kimiko.secToFrame(0.5);
                            wp.speed = jp.osakana4242.kimiko.kimiko.dpsToDpf(1 * jp.osakana4242.kimiko.DF.BASE_FPS);
                            wp.fireFunc = jp.osakana4242.kimiko.scenes.WeaponA.fireA;
                            wp.isTracePlayer = false;
                            wp.lookAtPlayer();
                            wp.startFire();

                            wp = sprite.weapons[1];
                            wp.fireCount = 2;
                            wp.wayNum = 1;
                            wp.fireInterval = jp.osakana4242.kimiko.kimiko.secToFrame(0.2);
                            wp.speed = jp.osakana4242.kimiko.kimiko.dpsToDpf(3 * jp.osakana4242.kimiko.DF.BASE_FPS);
                            wp.fireFunc = jp.osakana4242.kimiko.scenes.WeaponA.fireA;
                            wp.isTracePlayer = true;
                            wp.startFire();
                        }

                        function fire1() {
                            return runup().then(fireToPlayer).moveBy(8, 0, jp.osakana4242.kimiko.kimiko.secToFrame(0.5), Easing.CUBIC_EASEOUT).delay(jp.osakana4242.kimiko.kimiko.secToFrame(0.5)).waitUntil(waitFire);
                        }

                        function fire2() {
                            return runup().then(fireToPlayer2).waitUntil(waitFire);
                        }

                        function fire3() {
                            return runup().then(fireToPlayer3).moveBy(8, 0, jp.osakana4242.kimiko.kimiko.secToFrame(0.5), Easing.CUBIC_EASEOUT).delay(jp.osakana4242.kimiko.kimiko.secToFrame(0.5)).waitUntil(waitFire);
                        }

                        var top = sprite.anchor.y - 96;
                        var bottom = sprite.anchor.y;
                        var left = sprite.anchor.x - 200;
                        var right = sprite.anchor.x + 0;
                        sprite.x = right;
                        sprite.y = top;
                        sprite.tl.delay(jp.osakana4242.kimiko.kimiko.secToFrame(1.0)).moveTo(right, bottom, jp.osakana4242.kimiko.kimiko.secToFrame(2.0)).scaleTo(-1.0, 1.0, 1).delay(jp.osakana4242.kimiko.kimiko.secToFrame(0.5)).then(function () {
                            sprite.tl.moveTo(left, bottom, jp.osakana4242.kimiko.kimiko.secToFrame(0.5), Easing.CUBIC_EASEIN).scaleTo(1.0, 1.0, 1);
                            fire2().moveTo(left, top, jp.osakana4242.kimiko.kimiko.secToFrame(1.0));
                            fire1().moveTo(right, top, jp.osakana4242.kimiko.kimiko.secToFrame(0.5), Easing.CUBIC_EASEIN).scaleTo(-1.0, 1.0, 1);
                            fire2().moveTo(right, bottom, jp.osakana4242.kimiko.kimiko.secToFrame(1.0));
                            fire1().moveTo(left, top, jp.osakana4242.kimiko.kimiko.secToFrame(2.0));
                            fire3().moveTo(right, top, jp.osakana4242.kimiko.kimiko.secToFrame(0.5), Easing.CUBIC_EASEIN);
                            fire3().moveTo(left, top, jp.osakana4242.kimiko.kimiko.secToFrame(0.5), Easing.CUBIC_EASEIN);
                            fire3().moveTo(right, top, jp.osakana4242.kimiko.kimiko.secToFrame(0.5));
                            fire3().delay(jp.osakana4242.kimiko.kimiko.secToFrame(1.0)).moveTo(right, bottom, jp.osakana4242.kimiko.kimiko.secToFrame(2.0)).loop();
                        });
                    }
                    EnemyBrains.brainBoss = brainBoss;
                })(scenes.EnemyBrains || (scenes.EnemyBrains = {}));
                var EnemyBrains = scenes.EnemyBrains;

                scenes.EnemyData = {
                    0x0: {
                        hpMax: 2,
                        level: 1,
                        body: EnemyBodys.body1,
                        brain: EnemyBrains.brain1,
                        score: 100,
                        align: "center middle"
                    },
                    0x1: {
                        hpMax: 2,
                        level: 1,
                        body: EnemyBodys.body1,
                        brain: EnemyBrains.brain1,
                        score: 100,
                        align: "center middle"
                    },
                    0x2: {
                        hpMax: 2,
                        level: 1,
                        body: EnemyBodys.body1,
                        brain: EnemyBrains.brain2,
                        score: 100,
                        align: "center middle"
                    },
                    0x3: {
                        hpMax: 2,
                        level: 1,
                        body: EnemyBodys.body1,
                        brain: EnemyBrains.brain3,
                        score: 100,
                        align: "center bottom"
                    },
                    0x4: {
                        hpMax: 2,
                        level: 1,
                        body: EnemyBodys.body1,
                        brain: EnemyBrains.brain4,
                        score: 100,
                        align: "center top"
                    },
                    0x5: {
                        hpMax: 16,
                        level: 1,
                        body: EnemyBodys.body4,
                        brain: EnemyBrains.brain5,
                        score: 100,
                        align: "center bottom"
                    },
                    0x6: {
                        hpMax: 2,
                        level: 1,
                        body: EnemyBodys.body1,
                        brain: EnemyBrains.brain6,
                        score: 100,
                        align: "center middle"
                    },
                    0x7: {
                        hpMax: 2,
                        level: 1,
                        body: EnemyBodys.body1,
                        brain: EnemyBrains.brain7,
                        score: 100,
                        align: "center middle"
                    },
                    0x8: {
                        hpMax: 2,
                        level: 1,
                        body: EnemyBodys.body1,
                        brain: EnemyBrains.brain8,
                        score: 100,
                        align: "center middle"
                    },
                    0x9: {
                        hpMax: 2,
                        level: 1,
                        body: EnemyBodys.body1,
                        brain: EnemyBrains.brain9,
                        score: 100,
                        align: "center middle"
                    },
                    0xa: {
                        hpMax: 2,
                        level: 2,
                        body: EnemyBodys.body1,
                        brain: EnemyBrains.brain6,
                        score: 100,
                        align: "center middle"
                    },
                    0xb: {
                        hpMax: 2,
                        level: 2,
                        body: EnemyBodys.body1,
                        brain: EnemyBrains.brain7,
                        score: 100,
                        align: "center middle"
                    },
                    // boss.
                    // boss.
                    0xf: {
                        hpMax: 100,
                        level: 1,
                        body: EnemyBodys.body2,
                        brain: EnemyBrains.brainBoss,
                        score: 1000,
                        align: "center bottom"
                    }
                };
            })(kimiko.scenes || (kimiko.scenes = {}));
            var scenes = kimiko.scenes;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));
/// <reference path="../kimiko.ts" />
var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (scenes) {
                var Class = enchant.Class;
                var Event = enchant.Event;
                var Easing = enchant.Easing;

                /*
                
                force 自然な力
                ctrlForce 意図的な力
                
                */
                scenes.Player = Class.create(jp.osakana4242.kimiko.scenes.Attacker, {
                    initialize: function () {
                        var _this = this;
                        jp.osakana4242.kimiko.scenes.Attacker.call(this);

                        this.bodyStyles = (function () {
                            var animWalk = jp.osakana4242.kimiko.kimiko.getAnimFrames(jp.osakana4242.kimiko.DF.ANIM_ID_CHARA001_WALK);
                            var animStand = jp.osakana4242.kimiko.kimiko.getAnimFrames(jp.osakana4242.kimiko.DF.ANIM_ID_CHARA001_STAND);
                            var animSquat = jp.osakana4242.kimiko.kimiko.getAnimFrames(jp.osakana4242.kimiko.DF.ANIM_ID_CHARA001_SQUAT);
                            var animDead = jp.osakana4242.kimiko.kimiko.getAnimFrames(jp.osakana4242.kimiko.DF.ANIM_ID_CHARA001_DEAD);
                            _this.anim.sequence = animWalk;

                            var colliderA = jp.osakana4242.utils.Collider.centerBottom(_this, 12, 28);
                            var colliderB = jp.osakana4242.utils.Collider.centerBottom(_this, 12, 14);
                            var muzzlePosUp = new jp.osakana4242.utils.Vector2D(32, 12);
                            var muzzlePosDown = new jp.osakana4242.utils.Vector2D(32, 24);

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
                            var c = new jp.osakana4242.utils.Collider();
                            c.parent = _this;
                            return c;
                        })();
                        this.bodyStyle = this.bodyStyles.stand;

                        this.life.hpMax = jp.osakana4242.kimiko.DF.PLAYER_HP;
                        this.life.hp = this.life.hpMax;
                        this.life.setGhostFrameMax(jp.osakana4242.kimiko.kimiko.secToFrame(1.5));
                        this.life.damageListener = function () {
                            if (_this.life.isDead()) {
                            }
                        };

                        this.touchStartAnchor = new jp.osakana4242.utils.Vector2D();
                        this.isPause = false;
                        this.isSlowMove = false;
                        this.isOnMap = false;
                        this.targetEnemy = null;
                        this.limitRect = new jp.osakana4242.utils.Rect(0, 0, jp.osakana4242.kimiko.DF.SC_W, jp.osakana4242.kimiko.DF.SC_H);

                        /** 壁を押している方向. */
                        this.wallPushDir = new jp.osakana4242.utils.Vector2D();

                        /** 入力された移動距離. */
                        this.inputForce = new jp.osakana4242.utils.Vector2D();

                        this.addEventListener(Event.ENTER_FRAME, function () {
                            var scene = _this.scene;
                            if (_this.isPause) {
                                return;
                            }
                            var isAlive = !_this.life.isDead();
                            if (isAlive) {
                                _this.checkInput();
                            }
                            _this.updateBodyStyle();
                            if (isAlive) {
                                _this.stepMove();
                                _this.searchEnemy();
                            }
                        });
                    },
                    bodyStyle: {
                        get: function () {
                            return this._bodyStyle;
                        },
                        set: function (v) {
                            this._bodyStyle = v;
                            this.anim.sequence = v.anim;
                            jp.osakana4242.utils.Rect.copyFrom(this.collider.rect, v.collider);
                        }
                    },
                    searchEnemy: function () {
                        var scene = this.scene;
                        if ((this.age % jp.osakana4242.kimiko.kimiko.secToFrame(0.2)) === 0) {
                            // TODO: ロックオン済みの敵がいる場合は索敵間隔を遅らせたほうがいいかも.
                            // 近い敵を探す.
                            var srect = jp.osakana4242.utils.Rect.alloc();
                            srect.width = 256;
                            srect.height = this.height * 2;
                            srect.x = this.x + ((this.width - srect.width) / 2);
                            srect.y = this.y + ((this.height - srect.height) / 2);
                            var enemy = scene.getNearEnemy(this, srect);
                            if (enemy) {
                                this.targetEnemy = enemy;
                            }
                            jp.osakana4242.utils.Rect.free(srect);
                        }

                        if (this.targetEnemy === null) {
                            //
                        } else {
                            if (this.targetEnemy.life.isDead()) {
                                // 敵が死んでたら解除.
                                this.targetEnemy = null;
                            }
                            if (this.targetEnemy !== null) {
                                var distance = jp.osakana4242.utils.Rect.distance(this, this.targetEnemy);
                                var threshold = jp.osakana4242.kimiko.DF.SC1_W;
                                if (threshold < distance) {
                                    // 敵が離れたら解除.
                                    this.targetEnemy = null;
                                } else {
                                    // ロックオン状態. 常に敵を見る.
                                    this.dirX = jp.osakana4242.kimiko.kimiko.numberUtil.sign(this.targetEnemy.x - this.x);
                                    this.scaleX = this.dirX;
                                    if ((this.age % jp.osakana4242.kimiko.kimiko.secToFrame(0.2)) === 0) {
                                        // TODO: 敵同様にweaponクラス化.
                                        var srect = jp.osakana4242.utils.Rect.alloc();
                                        srect.width = jp.osakana4242.kimiko.DF.SC1_W;
                                        srect.height = this.height * 2;
                                        srect.x = this.center.x + (this.dirX < 0 ? -srect.width : 0);
                                        srect.y = this.y + ((this.height - srect.height) / 2);
                                        if (jp.osakana4242.utils.Rect.intersect(srect, this.targetEnemy)) {
                                            this.attack();
                                        }
                                        jp.osakana4242.utils.Rect.free(srect);
                                    }
                                }
                            }
                        }
                    },
                    stateToString: function () {
                        var str = jp.osakana4242.kimiko.scenes.Attacker.prototype.stateToString.call(this);
                        str += " hp:" + this.life.hp + " L:" + (this.targetEnemy !== null ? "o" : "x");
                        return str;
                    },
                    attack: function () {
                        if (!jp.osakana4242.kimiko.kimiko.config.isFireEnabled) {
                            return;
                        }
                        var bullet = this.scene.newOwnBullet();
                        if (bullet === null) {
                            return;
                        }
                        bullet.scaleX = this.scaleX;
                        bullet.force.x = this.dirX * jp.osakana4242.kimiko.kimiko.dpsToDpf(6 * 60);
                        bullet.force.y = 0;
                        bullet.center.x = this.center.x + this.scaleX * (this.bodyStyle.muzzlePos.x - (this.width / 2));
                        bullet.center.y = this.y + this.bodyStyle.muzzlePos.y;
                    },
                    updateBodyStyle: function () {
                        // body style
                        var nextBodyStyle = this.bodyStyle;
                        if (this.life.isDead()) {
                            nextBodyStyle = this.bodyStyles.dead;
                        } else if (0 < this.wallPushDir.y) {
                            // しゃがみ判定.
                            // 横の移動量が規定範囲内 + 接地した状態で地面方向に力がかかってる状態.
                            nextBodyStyle = this.bodyStyles.squat;
                        } else if (!jp.osakana4242.utils.Vector2D.equals(this.inputForce, jp.osakana4242.utils.Vector2D.zero)) {
                            nextBodyStyle = this.bodyStyles.walk;
                        } else {
                            nextBodyStyle = this.bodyStyles.stand;
                        }

                        if (this.bodyStyle !== nextBodyStyle) {
                            this.bodyStyle = nextBodyStyle;
                        }
                    },
                    stepMove: function () {
                        var scene = this.scene;

                        if (!this.targetEnemy) {
                            if (0 !== this.inputForce.x) {
                                this.dirX = jp.osakana4242.kimiko.kimiko.numberUtil.sign(this.inputForce.x);
                                this.scaleX = this.dirX;
                            }
                        }

                        //
                        if (this.isSlowMove || !jp.osakana4242.utils.Vector2D.equals(this.inputForce, jp.osakana4242.utils.Vector2D.zero)) {
                            this.force.x = this.inputForce.x;
                            this.force.y = this.inputForce.y;
                        } else {
                            //
                        }
                        this.force.y += jp.osakana4242.kimiko.kimiko.dpsToDpf(jp.osakana4242.kimiko.DF.GRAVITY);

                        var totalMx = this.force.x;
                        var totalMy = this.force.y;

                        // 壁衝突状態リセット.
                        jp.osakana4242.utils.Vector2D.copyFrom(this.wallPushDir, jp.osakana4242.utils.Vector2D.zero);

                        // 壁突き抜け防止のため、移動を数回に分ける.
                        var loopCnt = Math.floor(Math.max(Math.abs(totalMx), Math.abs(totalMy)) / jp.osakana4242.kimiko.DF.PLAYER_MOVE_RESOLUTION);

                        //
                        // 1回の移動量. 移動するごとに地形との当たり判定を行う.
                        var mx = totalMx / loopCnt;
                        var my = totalMy / loopCnt;

                        for (var i = 0; i <= loopCnt; ++i) {
                            if (i < loopCnt) {
                                this.x += mx;
                                this.y += my;
                                totalMx -= mx;
                                totalMy -= my;
                            } else {
                                // 最後のひと押し.
                                this.x += totalMx;
                                this.y += totalMy;
                            }
                            jp.osakana4242.utils.Rect.trimPos(this, this.limitRect, this.onTrim);
                            scene.checkMapCollision(this, this.onTrim, this.onIntersect);
                            if (this.force.x === 0) {
                                mx = 0;
                                totalMx = 0;
                            }
                            if (this.force.y === 0) {
                                my = 0;
                                totalMy = 0;
                            }
                        }

                        //
                        if (!jp.osakana4242.utils.Vector2D.equals(this.inputForce, jp.osakana4242.utils.Vector2D.zero)) {
                            this.force.x = 0;
                            this.force.y = 0;
                        }
                    },
                    startMap: function () {
                        this.isPause = false;
                    },
                    endMap: function () {
                        this.isPause = true;
                    },
                    onIntersect: function (tile, x, y) {
                        if (tile !== jp.osakana4242.kimiko.DF.MAP_TILE_DOOR_OPEN) {
                            return;
                        }

                        // クリア.
                        var scene = this.scene;
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
                        jp.osakana4242.utils.Vector2D.copyFrom(this.inputForce, jp.osakana4242.utils.Vector2D.zero);
                        if (this.life.isDead()) {
                            return;
                        }
                        this.checkKeyInput();
                        this.checkTouchInput();
                    },
                    checkKeyInput: function () {
                        var input = jp.osakana4242.kimiko.kimiko.core.input;
                        var flag = ((input.left ? 1 : 0) << 0) | ((input.right ? 1 : 0) << 1) | ((input.up ? 1 : 0) << 2) | ((input.down ? 1 : 0) << 3);
                        this.isSlowMove = jp.osakana4242.kimiko.kimiko.core.input.a;
                        if (flag !== 0) {
                            if (this.isSlowMove) {
                                this.inputForce.x = jp.osakana4242.kimiko.DF.DIR_FLAG_TO_VECTOR2D[flag].x * jp.osakana4242.kimiko.kimiko.dpsToDpf(2 * 60);
                                this.inputForce.y = jp.osakana4242.kimiko.DF.DIR_FLAG_TO_VECTOR2D[flag].y * jp.osakana4242.kimiko.kimiko.dpsToDpf(2 * 60);
                            } else {
                                this.inputForce.x = jp.osakana4242.kimiko.DF.DIR_FLAG_TO_VECTOR2D[flag].x * jp.osakana4242.kimiko.kimiko.dpsToDpf(4 * 60);
                                this.inputForce.y = jp.osakana4242.kimiko.DF.DIR_FLAG_TO_VECTOR2D[flag].y * jp.osakana4242.kimiko.kimiko.dpsToDpf(4 * 60);
                            }
                        }
                    },
                    checkTouchInput: function () {
                        var scene = this.scene;
                        var player = this;
                        var touch = scene.touch;
                        if (touch.isTouching) {
                            var moveLimit = jp.osakana4242.kimiko.DF.TOUCH_TO_CHARA_MOVE_LIMIT;
                            var moveRate = jp.osakana4242.kimiko.kimiko.config.swipeToMoveRate;
                            if (jp.osakana4242.kimiko.DF.PLAYER_TOUCH_ANCHOR_ENABLE) {
                                var tv = jp.osakana4242.utils.Vector2D.alloc(player.touchStartAnchor.x + touch.totalDiff.x * moveRate.x, player.touchStartAnchor.y + touch.totalDiff.y * moveRate.y);
                                var v = jp.osakana4242.utils.Vector2D.alloc(tv.x - player.x, tv.y - player.y);
                                var vm = Math.min(jp.osakana4242.utils.Vector2D.magnitude(v), moveLimit);
                                jp.osakana4242.utils.Vector2D.normalize(v);
                                v.x *= vm;
                                v.y *= vm;
                                player.inputForce.x = v.x;
                                player.inputForce.y = v.y;
                                jp.osakana4242.utils.Vector2D.free(tv);
                                jp.osakana4242.utils.Vector2D.free(v);
                            } else {
                                player.inputForce.x = jp.osakana4242.kimiko.kimiko.numberUtil.trim(touch.diff.x * moveRate.x, -moveLimit, moveLimit);
                                player.inputForce.y = jp.osakana4242.kimiko.kimiko.numberUtil.trim(touch.diff.y * moveRate.y, -moveLimit, moveLimit);
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
/// <reference path="../kimiko.ts" />
var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (scenes) {
                var Class = enchant.Class;
                var Core = enchant.Core;
                var Scene = enchant.Scene;
                var Label = enchant.Label;
                var Event = enchant.Event;
                var Easing = enchant.Easing;

                scenes.Camera = Class.create(enchant.Node, {
                    initialize: function () {
                        enchant.Node.call(this);

                        this.width = jp.osakana4242.kimiko.DF.SC1_W;
                        this.height = jp.osakana4242.kimiko.DF.SC1_H;
                        this.center = new jp.osakana4242.utils.RectCenter(this);

                        this.limitRect = new jp.osakana4242.utils.Rect(0, 0, 320, 320);
                        this.sleepRect = new jp.osakana4242.utils.Rect(0, 0, this.width + jp.osakana4242.kimiko.DF.ENEMY_SLEEP_RECT_MARGIN, this.height + jp.osakana4242.kimiko.DF.ENEMY_SLEEP_RECT_MARGIN);
                        this.spawnRect = new jp.osakana4242.utils.Rect(0, 0, this.width + jp.osakana4242.kimiko.DF.ENEMY_SPAWN_RECT_MARGIN, this.height + jp.osakana4242.kimiko.DF.ENEMY_SPAWN_RECT_MARGIN);
                        this._targetPos = new jp.osakana4242.utils.Vector2D();
                        this.targetGroup = null;
                        this.targetNode = this;
                    },
                    getTargetPosOnCamera: function () {
                        var camera = this;
                        var pos = this.targetNode.center;
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
                    /** 目的地に瞬時にたどり着く。 */
                    moveToTarget: function () {
                        jp.osakana4242.utils.Vector2D.copyFrom(this, this.calcTargetPos());
                    },
                    calcTargetPos: function () {
                        var node = this.targetNode;
                        var camera = this;

                        // カメラ移動.
                        // プレイヤーからどれだけずらすか。
                        // 前方は後方より少しだけ先が見えるようにする。
                        this._targetPos.x = node.center.x - (camera.width / 2) + (node.dirX * 16);

                        // 指で操作する関係で下方向に余裕を持たせる.
                        this._targetPos.y = node.center.y - (camera.height / 2) + 24;
                        return this._targetPos;
                    },
                    onenterframe: function () {
                        var camera = this;
                        var tp = this.calcTargetPos();
                        var speed = jp.osakana4242.kimiko.kimiko.dpsToDpf(5 * 60);
                        var dv = jp.osakana4242.utils.Vector2D.alloc(tp.x - camera.x, tp.y - camera.y);
                        var mv = jp.osakana4242.utils.Vector2D.alloc();
                        var distance = jp.osakana4242.utils.Vector2D.magnitude(dv);

                        if (speed < distance) {
                            mv.x = dv.x * speed / distance;
                            mv.y = dv.y * speed / distance;
                        } else {
                            mv.x = dv.x;
                            mv.y = dv.y;
                        }
                        camera.x = Math.floor(camera.x + mv.x);
                        camera.y = Math.floor(camera.y + mv.y);

                        var marginX = camera.width * 0.9;
                        var marginY = camera.height * 0.9;
                        var limitRect = jp.osakana4242.utils.Rect.alloc(Math.floor(tp.x - marginX / 2), Math.floor(tp.y - marginY / 2), Math.floor(camera.width + marginX), Math.floor(camera.height + marginY));

                        jp.osakana4242.utils.Rect.trimPos(camera, limitRect);

                        //			console.log("" +
                        //				"(" +
                        //				limitRect.x + ", " +
                        //				limitRect.y + ", " +
                        //				limitRect.width + ", " +
                        //				limitRect.height + ", " +
                        //				")" +
                        //				camera.x + ", " +
                        //				camera.y + "" +
                        //				"");
                        jp.osakana4242.utils.Rect.trimPos(camera, camera.limitRect);

                        //
                        this.updateGroup();

                        //
                        jp.osakana4242.utils.Vector2D.free(dv);
                        jp.osakana4242.utils.Vector2D.free(mv);
                        jp.osakana4242.utils.Rect.free(limitRect);
                    },
                    updateGroup: function () {
                        var group = this.targetGroup;
                        if (group) {
                            group.x = -this.x;
                            group.y = -this.y;
                        }
                    },
                    isIntersectSpawnRect: function (entity) {
                        var rect = this.spawnRect;
                        rect.x = this.x - ((rect.width - this.width) / 2);
                        rect.y = this.y - ((rect.height - this.height) / 2);
                        return jp.osakana4242.utils.Rect.intersect(rect, entity);
                    },
                    isOutsideSleepRect: function (entity) {
                        var rect = this.sleepRect;
                        rect.x = this.x - ((rect.width - this.width) / 2);
                        rect.y = this.y - ((rect.height - this.height) / 2);
                        return jp.osakana4242.utils.Rect.outside(rect, entity);
                    }
                });
            })(kimiko.scenes || (kimiko.scenes = {}));
            var scenes = kimiko.scenes;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));
// references
/// <reference path="../kimiko.ts" />
/// <reference path="../fader.ts" />
/// <reference path="weapon.ts" />
/// <reference path="mapCharas.ts" />
/// <reference path="enemyBrains.ts" />
/// <reference path="player.ts" />
/// <reference path="camera.ts" />
//

var jp;
(function (jp) {
    (function (osakana4242) {
        (function (kimiko) {
            (function (scenes) {
                var Class = enchant.Class;
                var Core = enchant.Core;
                var Scene = enchant.Scene;
                var Label = enchant.Label;
                var Event = enchant.Event;
                var Easing = enchant.Easing;

                var Life = (function () {
                    function Life() {
                        this.hpMax = 100;
                        this.hp = this.hpMax;
                        this.ghostFrameMax = jp.osakana4242.kimiko.kimiko.secToFrame(1.0);
                        this.ghostFrameCounter = this.ghostFrameMax;
                    }
                    Life.prototype.setGhostFrameMax = function (frameMax) {
                        this.ghostFrameMax = frameMax;
                        this.ghostFrameCounter = frameMax;
                    };

                    Life.prototype.step = function () {
                        if (this.isGhostTime()) {
                            ++this.ghostFrameCounter;
                        }
                    };

                    Life.prototype.isAlive = function () {
                        return 0 < this.hp;
                    };
                    Life.prototype.isDead = function () {
                        return !this.isAlive();
                    };

                    /** 無敵時間. */
                    Life.prototype.isGhostTime = function () {
                        return this.ghostFrameCounter < this.ghostFrameMax;
                    };
                    Life.prototype.canAddDamage = function () {
                        return this.isAlive() && !this.isGhostTime();
                    };

                    Life.prototype.damage = function (v) {
                        this.hp -= v;
                        this.ghostFrameCounter = 0;
                        if (this.damageListener) {
                            this.damageListener();
                        }
                    };

                    Life.prototype.recover = function () {
                        this.hp = this.hpMax;
                        this.ghostFrameCounter = this.ghostFrameMax;
                    };
                    return Life;
                })();
                scenes.Life = Life;

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
                            if (this.actives[i].life.isAlive()) {
                                ++count;
                            }
                        }
                        return count;
                    };

                    // 画面内に入ったキャラを発生させる。
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

                    // 画面外に出たキャラを休ませるか棺送りにする。
                    MapCharaManager.prototype.checkSleep = function () {
                        var scene = this.scene;
                        var camera = this.scene.camera;
                        var arr = this.actives;
                        for (var i = arr.length - 1; 0 <= i; --i) {
                            var chara = arr[i];

                            if (chara.isDead()) {
                                arr.splice(i, 1);
                                this.deads.push(chara);
                                scene.world.removeChild(chara);
                                continue;
                            }

                            if (!camera.isOutsideSleepRect(chara)) {
                                continue;
                            }
                            arr.splice(i, 1);
                            this.sleeps.push(chara);
                            scene.world.removeChild(chara);
                        }
                    };
                    return MapCharaManager;
                })();
                scenes.MapCharaManager = MapCharaManager;

                scenes.Title = Class.create(Scene, {
                    initialize: function () {
                        Scene.call(this);

                        var scene = this;
                        var mapIds = [];
                        for (var key in jp.osakana4242.kimiko.DF.MAP_OPTIONS) {
                            mapIds.push(parseInt(key));
                        }

                        var mapIdsIdx = 0;

                        //
                        var title = (function () {
                            var spr = new enchant.Label("KIMIKO'S NIGHTMARE");
                            spr.font = jp.osakana4242.kimiko.DF.FONT_L;
                            spr.color = "rgb(255, 255, 255)";
                            spr.width = jp.osakana4242.kimiko.DF.SC_W;
                            spr.height = 24;
                            spr.textAlign = "center";
                            spr.x = 0;
                            spr.y = 8;
                            return spr;
                        })();

                        var player = (function () {
                            var spr = new enchant.Sprite();
                            spr.anim.sequence = jp.osakana4242.kimiko.kimiko.getAnimFrames(jp.osakana4242.kimiko.DF.ANIM_ID_CHARA001_WALK);
                            spr.center.x = jp.osakana4242.kimiko.DF.SC_W / 2;
                            spr.y = 240;
                            var ax = spr.x;
                            var ay = spr.y;
                            spr.addEventListener(Event.TOUCH_END, function () {
                                if (0 < spr.tl.queue.length) {
                                    // 演出終わってないのでカエル.
                                    return;
                                }
                                spr.tl.clear().moveTo(ax, ay - 32, jp.osakana4242.kimiko.kimiko.secToFrame(0.1), Easing.CUBIC_EASEOUT).moveTo(ax, ay, jp.osakana4242.kimiko.kimiko.secToFrame(0.1), Easing.CUBIC_EASEIN);
                            });
                            return spr;
                        })();

                        var author = (function () {
                            var spr = new enchant.Label("created by @osakana4242");
                            spr.font = jp.osakana4242.kimiko.DF.FONT_M;
                            spr.color = "rgb(255, 255, 255)";
                            spr.width = jp.osakana4242.kimiko.DF.SC_W;
                            spr.height = 12;
                            spr.textAlign = "center";
                            spr.x = 0;
                            spr.y = 300;
                            return spr;
                        })();

                        var mapLabel = (function () {
                            var spr = new enchant.Label();
                            spr.font = jp.osakana4242.kimiko.DF.FONT_L;
                            spr.color = "rgb(255, 255, 255)";
                            spr.width = jp.osakana4242.kimiko.DF.SC_W;
                            spr.height = 24;
                            spr.textAlign = "center";
                            spr.x = 0;
                            spr.y = 70;
                            return spr;
                        })();

                        var mapLabel2 = (function () {
                            var spr = new enchant.Label();
                            spr.font = jp.osakana4242.kimiko.DF.FONT_L;
                            spr.color = "rgb(255, 255, 255)";
                            spr.width = jp.osakana4242.kimiko.DF.SC_W;
                            spr.height = 24;
                            spr.textAlign = "center";
                            spr.x = 0;
                            spr.y = 94;
                            return spr;
                        })();

                        function updateMapLabel() {
                            var mapId = mapIds[mapIdsIdx];
                            mapLabel.text = "MAP " + mapId;
                            mapLabel2.text = jp.osakana4242.kimiko.DF.MAP_OPTIONS[mapId].title;
                        }
                        updateMapLabel();

                        var leftBtn = (function () {
                            var spr = new enchant.Label("<-");
                            spr.font = jp.osakana4242.kimiko.DF.FONT_L;
                            spr.backgroundColor = "rgb(64, 64, 64)";
                            spr.color = "rgb(255, 255, 0)";
                            spr.textAlign = "center";
                            spr.width = 56;
                            spr.height = 48;
                            spr.x = jp.osakana4242.kimiko.DF.SC_W / 3 * 0 + (spr.width / 2);
                            spr.y = 80;
                            spr.addEventListener(Event.TOUCH_END, prevMap);
                            return spr;
                        })();

                        var rightBtn = (function () {
                            var spr = new enchant.Label("->");
                            spr.font = jp.osakana4242.kimiko.DF.FONT_L;
                            spr.backgroundColor = "rgb(64, 64, 64)";
                            spr.color = "rgb(255, 255, 0)";
                            spr.textAlign = "center";
                            spr.width = 56;
                            spr.height = 48;
                            spr.x = jp.osakana4242.kimiko.DF.SC_W / 3 * 2 + (spr.width / 2);
                            spr.y = 80;
                            spr.addEventListener(Event.TOUCH_END, nextMap);
                            return spr;
                        })();

                        var startBtn = (function () {
                            var spr = new enchant.Label("START");
                            spr.font = jp.osakana4242.kimiko.DF.FONT_L;
                            spr.color = "rgb(255, 255, 0)";
                            spr.backgroundColor = "rgb(64, 64, 64)";
                            spr.width = jp.osakana4242.kimiko.DF.SC_W / 2;
                            spr.height = 48;
                            spr.textAlign = "center";
                            spr.x = (jp.osakana4242.kimiko.DF.SC_W - spr.width) / 2;
                            spr.y = 140;
                            spr.addEventListener(Event.TOUCH_END, gotoGameStart);
                            return spr;
                        })();

                        //
                        scene.backgroundColor = "rgb( 32, 32, 32)";
                        scene.addChild(player);
                        scene.addChild(title);
                        scene.addChild(author);
                        scene.addChild(mapLabel);
                        scene.addChild(mapLabel2);
                        scene.addChild(leftBtn);
                        scene.addChild(rightBtn);
                        scene.addChild(startBtn);

                        //
                        scene.addEventListener(Event.A_BUTTON_UP, gotoGameStart);
                        scene.addEventListener(Event.LEFT_BUTTON_UP, prevMap);
                        scene.addEventListener(Event.RIGHT_BUTTON_UP, nextMap);

                        //
                        var fader = new jp.osakana4242.kimiko.scenes.Fader(this);
                        fader.setBlack(true);
                        fader.fadeIn(jp.osakana4242.kimiko.kimiko.secToFrame(0.5));

                        function nextMap() {
                            mapIdsIdx = (mapIdsIdx + mapIds.length + 1) % mapIds.length;
                            updateMapLabel();
                        }

                        function prevMap() {
                            mapIdsIdx = (mapIdsIdx + mapIds.length - 1) % mapIds.length;
                            updateMapLabel();
                        }

                        function gotoGameStart() {
                            var pd = jp.osakana4242.kimiko.kimiko.playerData;
                            pd.reset();
                            pd.mapId = mapIds[mapIdsIdx];
                            fader.fadeOut(jp.osakana4242.kimiko.kimiko.secToFrame(0.3), function () {
                                jp.osakana4242.kimiko.kimiko.core.replaceScene(new scenes.GameStart());
                            });
                        }
                        ;
                    }
                });

                scenes.GameStart = Class.create(Scene, {
                    initialize: function () {
                        Scene.call(this);

                        var scene = this;

                        //
                        var bg1 = new enchant.Sprite(jp.osakana4242.kimiko.DF.SC1_W, jp.osakana4242.kimiko.DF.SC1_H);
                        (function (sprite) {
                            sprite.x = 0;
                            sprite.y = 0;
                            sprite.image = jp.osakana4242.kimiko.kimiko.core.assets[jp.osakana4242.kimiko.Assets.IMAGE_GAME_START_BG];
                        })(bg1);

                        //
                        var label1 = new enchant.Label("GOOD NIGHT...");
                        (function (label) {
                            label.font = jp.osakana4242.kimiko.DF.FONT_M;
                            label.width = jp.osakana4242.kimiko.DF.SC_W;
                            label.height = 12;
                            label.color = "rgb(255, 255, 255)";
                            label.textAlign = "center";
                            var ax = (jp.osakana4242.kimiko.DF.SC1_W - label.width) / 2;
                            var ay = (jp.osakana4242.kimiko.DF.SC1_H - label.height) / 2;
                            label.x = ax;
                            label.y = ay;
                            label.tl.moveTo(ax + 0, ay + 8, jp.osakana4242.kimiko.kimiko.secToFrame(1.0), Easing.SIN_EASEINOUT).moveTo(ax + 0, ay - 8, jp.osakana4242.kimiko.kimiko.secToFrame(1.0), Easing.SIN_EASEINOUT).loop();
                        })(label1);

                        //
                        var fader = new jp.osakana4242.kimiko.scenes.Fader(this);

                        //
                        var layer1 = new enchant.Group();
                        layer1.addChild(bg1);
                        layer1.addChild(label1);

                        //
                        scene.backgroundColor = "rgb(0, 0, 0)";
                        scene.addChild(layer1);
                        (function () {
                            var next = function () {
                                fader.fadeOut2(jp.osakana4242.kimiko.kimiko.secToFrame(1.0), new jp.osakana4242.utils.Vector2D(242, 156), function () {
                                    jp.osakana4242.kimiko.kimiko.core.replaceScene(jp.osakana4242.kimiko.kimiko.gameScene);
                                });
                            };
                            fader.setBlack(true);
                            scene.tl.then(function () {
                                fader.fadeIn(jp.osakana4242.kimiko.kimiko.secToFrame(0.5));
                            }).delay(jp.osakana4242.kimiko.kimiko.secToFrame(0.5)).delay(jp.osakana4242.kimiko.kimiko.secToFrame(2.0)).then(next);
                            scene.addEventListener(Event.TOUCH_END, next);
                            scene.addEventListener(Event.A_BUTTON_UP, next);
                        })();
                    }
                });

                scenes.Pause = Class.create(Scene, {
                    initialize: function () {
                        Scene.call(this);

                        var scene = this;

                        //
                        var bg = (function () {
                            var spr = new enchant.Sprite(jp.osakana4242.kimiko.DF.SC_W, jp.osakana4242.kimiko.DF.SC_H);
                            spr.backgroundColor = "#000";
                            spr.opacity = 0.5;
                            return spr;
                        })();

                        var label1 = (function () {
                            var label = new enchant.Label("PAUSE");
                            label.font = jp.osakana4242.kimiko.DF.FONT_M;
                            label.width = jp.osakana4242.kimiko.DF.SC_W;
                            label.height = 12;
                            label.color = "rgb(255, 255, 255)";
                            label.textAlign = "center";
                            label.x = 0;
                            label.y = 60;
                            label.tl.moveBy(0, -8, jp.osakana4242.kimiko.kimiko.secToFrame(1.0), Easing.SIN_EASEINOUT).moveBy(0, 8, jp.osakana4242.kimiko.kimiko.secToFrame(1.0), Easing.SIN_EASEINOUT).loop();
                            return label;
                        })();

                        //
                        var label2 = (function () {
                            var label = new enchant.Label("GOTO TITLE");
                            label.font = jp.osakana4242.kimiko.DF.FONT_M;
                            label.width = jp.osakana4242.kimiko.DF.SC_W / 2;
                            label.height = 48;
                            label.backgroundColor = "#444";
                            label.color = "#ff0";
                            label.textAlign = "center";
                            label.x = (jp.osakana4242.kimiko.DF.SC_W - label.width) / 2;
                            label.y = 90;
                            label.addEventListener(Event.TOUCH_END, function () {
                                jp.osakana4242.kimiko.kimiko.gameScene.state = jp.osakana4242.kimiko.kimiko.gameScene.stateGameStart;
                                jp.osakana4242.kimiko.kimiko.core.replaceScene(new scenes.Title());
                            });
                            return label;
                        })();

                        var label3 = (function () {
                            var label = new enchant.Label("CONTINUE");
                            label.font = jp.osakana4242.kimiko.DF.FONT_M;
                            label.width = jp.osakana4242.kimiko.DF.SC_W / 2;
                            label.height = 48;
                            label.backgroundColor = "#444";
                            label.color = "#ff0";
                            label.textAlign = "center";
                            label.x = (jp.osakana4242.kimiko.DF.SC_W - label.width) / 2;
                            label.y = 180;
                            label.addEventListener(Event.TOUCH_END, function () {
                                jp.osakana4242.kimiko.kimiko.core.popScene();
                            });
                            return label;
                        })();

                        scene.addChild(bg);
                        scene.addChild(label1);
                        scene.addChild(label2);
                        scene.addChild(label3);
                    }
                });

                scenes.GameOver = Class.create(Scene, {
                    initialize: function () {
                        Scene.call(this);

                        var scene = this;

                        //
                        var label1 = new enchant.Label("GAME OVER");
                        (function (label) {
                            label.font = jp.osakana4242.kimiko.DF.FONT_M;
                            label.width = jp.osakana4242.kimiko.DF.SC_W;
                            label.height = 12;
                            label.color = "rgb(255, 255, 255)";
                            label.textAlign = "center";
                            var ax = (jp.osakana4242.kimiko.DF.SC1_W - label.width) / 2;
                            var ay = (jp.osakana4242.kimiko.DF.SC1_H - label.height) / 2;
                            label.x = ax;
                            label.y = ay;
                            label.tl.moveTo(ax + 0, ay + 8, jp.osakana4242.kimiko.kimiko.secToFrame(1.0), Easing.SIN_EASEINOUT).moveTo(ax + 0, ay - 8, jp.osakana4242.kimiko.kimiko.secToFrame(1.0), Easing.SIN_EASEINOUT).loop();
                        })(label1);

                        //
                        var layer1 = new enchant.Group();
                        layer1.addChild(label1);

                        //
                        scene.addChild(layer1);

                        //
                        scene.addEventListener(Event.TOUCH_END, function () {
                            jp.osakana4242.kimiko.kimiko.core.popScene();
                        });
                    }
                });

                /**
                GAME CLEAR!
                REST TIME 999
                SCORE 999
                [SEND] | [RETRY]
                
                残り時間はスコアに換算する.
                残りライフもスコアに換算する.
                */
                scenes.GameClear = Class.create(Scene, {
                    initialize: function () {
                        Scene.call(this);

                        var scene = this;
                        var pd = jp.osakana4242.kimiko.kimiko.playerData;

                        //
                        var label1 = new enchant.Label("GAME CLEAR!");
                        (function (label) {
                            label.font = jp.osakana4242.kimiko.DF.FONT_M;
                            label.width = jp.osakana4242.kimiko.DF.SC_W;
                            label.height = 12;
                            label.color = "rgb(255, 255, 255)";
                            label.textAlign = "center";
                            var ax = (jp.osakana4242.kimiko.DF.SC1_W - label.width) / 2;
                            var ay = 32 + 24 * 1;
                            label.x = ax;
                            label.y = ay - 8;
                            label.tl.hide().delay(jp.osakana4242.kimiko.kimiko.secToFrame(0.5)).show().moveTo(ax, ay, jp.osakana4242.kimiko.kimiko.secToFrame(0.5), Easing.SIN_EASEOUT);
                        })(label1);

                        //
                        var label2 = new enchant.Label("REST TIME " + Math.floor(jp.osakana4242.kimiko.kimiko.frameToSec(pd.restTimeCounter)));
                        (function (label) {
                            label.font = jp.osakana4242.kimiko.DF.FONT_M;
                            label.width = jp.osakana4242.kimiko.DF.SC_W;
                            label.height = 12;
                            label.color = "rgb(255, 255, 255)";
                            label.textAlign = "center";
                            var ax = (jp.osakana4242.kimiko.DF.SC1_W - label.width) / 2;
                            var ay = 32 + 24 * 2;
                            label.x = ax;
                            label.y = ay - 8;
                            label.tl.hide().delay(jp.osakana4242.kimiko.kimiko.secToFrame(1.0)).show().moveTo(ax, ay, jp.osakana4242.kimiko.kimiko.secToFrame(0.5), Easing.SIN_EASEOUT);
                        })(label2);

                        var label3 = new enchant.Label("SCORE " + pd.score);
                        (function (label) {
                            label.font = jp.osakana4242.kimiko.DF.FONT_M;
                            label.width = jp.osakana4242.kimiko.DF.SC_W;
                            label.height = 12;
                            label.color = "rgb(255, 255, 255)";
                            label.textAlign = "center";
                            var ax = (jp.osakana4242.kimiko.DF.SC1_W - label.width) / 2;
                            var ay = 32 + 24 * 3;
                            label.x = ax;
                            label.y = ay - 8;
                            label.tl.hide().delay(jp.osakana4242.kimiko.kimiko.secToFrame(1.5)).show().moveTo(ax, ay, jp.osakana4242.kimiko.kimiko.secToFrame(0.5), Easing.SIN_EASEOUT);
                        })(label3);

                        //
                        var layer1 = new enchant.Group();
                        layer1.addChild(label1);
                        layer1.addChild(label2);
                        layer1.addChild(label3);

                        //
                        scene.addChild(layer1);

                        //
                        scene.tl.delay(jp.osakana4242.kimiko.kimiko.secToFrame(3.0)).waitUntil(function () {
                            if (pd.restTimeCounter < jp.osakana4242.kimiko.kimiko.secToFrame(1)) {
                                return true;
                            }
                            pd.restTimeCounter -= jp.osakana4242.kimiko.kimiko.secToFrame(1);
                            pd.score += Math.floor(10);
                            label2.text = "REST TIME " + Math.floor(jp.osakana4242.kimiko.kimiko.frameToSec(pd.restTimeCounter));
                            label3.text = "SCORE " + pd.score;
                            return false;
                        });

                        //
                        scene.addEventListener(Event.TOUCH_END, function () {
                            jp.osakana4242.kimiko.kimiko.core.popScene();
                            jp.osakana4242.kimiko.kimiko.core.replaceScene(new scenes.Title());
                        });
                    }
                });

                scenes.Act = Class.create(Scene, {
                    initialize: function () {
                        var _this = this;
                        Scene.call(this);

                        var scene = this;

                        // systems
                        this.state = this.stateGameStart;

                        /** 条件を満たしてからゲームオーバーに移るまでの間隔 */
                        this.gameOverFrameMax = 0;
                        this.gameOverFrameCounter = this.gameOverFrameMax;

                        /** 条件を満たしてからゲームクリアに移るまでの間隔 */
                        this.celarFrameMax = 0;
                        this.clearFrameCounter = this.clearFrameMax;
                        this.statusTexts = [
                            [], [], [], []
                        ];

                        //
                        this.backgroundColor = "rgb(32, 32, 64)";
                        var sprite;

                        var world = new enchant.Group();
                        world.name = "world";
                        this.world = world;
                        scene.addChild(world);

                        var map = new enchant.Map(jp.osakana4242.kimiko.DF.MAP_TILE_W, jp.osakana4242.kimiko.DF.MAP_TILE_H);
                        this.map = map;
                        this.mapOption = {};
                        map.name = "map";
                        map.image = jp.osakana4242.kimiko.kimiko.core.assets[jp.osakana4242.kimiko.Assets.IMAGE_MAP];
                        map.x = 0;
                        map.y = 0;
                        if (map._style) {
                            // for enchant-0.5.x
                            // マップがなぜか手前に来てしまうので、zIndex指定しちゃう。
                            map._style.zIndex = -1;
                        }
                        world.addChild(map);

                        // 1カメ.
                        var camera = new jp.osakana4242.kimiko.scenes.Camera();
                        this.camera = camera;
                        camera.name = "camera";
                        camera.targetGroup = world;
                        world.addChild(camera);

                        this.player = (function () {
                            var sprite = new jp.osakana4242.kimiko.scenes.Player();
                            sprite.name = "player";
                            sprite.x = 0;
                            sprite.y = _this.map.height - sprite.height;
                            return sprite;
                        })();
                        world.addChild(this.player);

                        (function () {
                            // 操作エリア.
                            // 背景.
                            var bg = (function () {
                                var spr = new enchant.Sprite(jp.osakana4242.kimiko.DF.SC2_W, jp.osakana4242.kimiko.DF.SC2_H);
                                _this.controllArea = spr;
                                spr.x = 0;
                                spr.y = 0;
                                spr.backgroundColor = "rgb(64, 64, 64)";
                                return spr;
                            })();

                            // labels
                            _this.labels = [];
                            var texts = _this.statusTexts;
                            for (var i = 0, iNum = texts.length; i < iNum; ++i) {
                                sprite = new Label("");
                                _this.labels.push(sprite);
                                sprite.font = jp.osakana4242.kimiko.DF.FONT_M;
                                sprite.color = "#fff";
                                sprite.y = 12 * i;
                            }

                            var btnPause = (function () {
                                var spr = new enchant.Label("P");
                                spr.font = jp.osakana4242.kimiko.DF.FONT_M;
                                spr.color = "#ff0";
                                spr.backgroundColor = "#000";
                                spr.width = 48;
                                spr.height = 48;
                                spr.textAlign = "center";
                                spr.x = jp.osakana4242.kimiko.DF.SC2_W - 56;
                                spr.y = jp.osakana4242.kimiko.DF.SC2_H - 56;
                                spr.addEventListener(Event.TOUCH_END, function () {
                                    jp.osakana4242.kimiko.kimiko.core.pushScene(jp.osakana4242.kimiko.kimiko.pauseScene);
                                });
                                return spr;
                            })();

                            var group = new enchant.Group();
                            _this.statusGroup = group;
                            group.x = jp.osakana4242.kimiko.DF.SC2_X1;
                            group.y = jp.osakana4242.kimiko.DF.SC2_Y1;

                            group.addChild(bg);
                            for (var i = 0, iNum = _this.labels.length; i < iNum; ++i) {
                                group.addChild(_this.labels[i]);
                            }
                            group.addChild(btnPause);
                            _this.addChild(group);
                        })();

                        this.ownBulletPool = new jp.osakana4242.utils.SpritePool(jp.osakana4242.kimiko.DF.PLAYER_BULLET_NUM, function (idx) {
                            var spr = new jp.osakana4242.kimiko.scenes.OwnBullet();
                            spr.name = "OwnBullet" + idx;
                            return spr;
                        });

                        this.enemyBulletPool = new jp.osakana4242.utils.SpritePool(32, function (idx) {
                            var spr = new jp.osakana4242.kimiko.scenes.EnemyBullet();
                            spr.name = "EnemyBullet" + idx;
                            return spr;
                        });

                        this.effectPool = new jp.osakana4242.utils.SpritePool(16, function (idx) {
                            var spr = new enchant.Sprite(16, 16);
                            spr.name = "effect" + idx;
                            spr.ageMax = 0;
                            spr.anim.loopListener = function () {
                                _this.effectPool.free(spr);
                            };
                            return spr;
                        });

                        this.mapCharaMgr = new MapCharaManager(this);
                        this.touch = new jp.osakana4242.utils.Touch();

                        this.fader = new jp.osakana4242.kimiko.scenes.Fader(this);
                        this.fader.setBlack(true);
                        this.fader.fadeOut(0);
                    },
                    // はじめから。
                    // スコアリセット、プレイヤーHP回復。
                    initPlayerStatus: function () {
                        var scene = this;
                        var pd = jp.osakana4242.kimiko.kimiko.playerData;
                        var player = this.player;
                        player.life.recover();
                        player.life.hpMax = pd.hpMax;
                        player.life.hp = pd.hp;
                        player.visible = true;
                        player.opacity = 1.0;
                    },
                    clear: function () {
                        this.ownBulletPool.freeAll();
                        this.enemyBulletPool.freeAll();
                        this.effectPool.freeAll();
                        this.mapCharaMgr.clear();
                        if (this.player.parentNode) {
                            this.player.parentNode.removeChild(this.player);
                        }
                    },
                    //---------------------------------------------------------------------------
                    ontouchstart: function (event) {
                        var touch = this.touch;
                        touch.saveTouchStart(event);
                        var player = this.player;
                        player.touchStartAnchor.x = player.x;
                        player.touchStartAnchor.y = player.y;
                        player.force.x = 0;
                        player.force.y = 0;
                        player.useGravity = false;
                        player.isOnMap = false;
                    },
                    ontouchmove: function (event) {
                        var touch = this.touch;
                        touch.saveTouchMove(event);
                    },
                    ontouchend: function (event) {
                        var touch = this.touch;
                        touch.saveTouchEnd(event);

                        // this.statusTexts[0][1] = (<any[]>["touch end diff", Math.floor(touch.totalDiff.x), Math.floor(touch.totalDiff.y)]).join();
                        var player = this.player;
                        player.force.x = 0;
                        player.force.y = 0;

                        if (Math.abs(touch.totalDiff.x) + Math.abs(touch.totalDiff.y) < 16) {
                            player.attack();
                        }
                        player.useGravity = true;
                    },
                    onenterframe: function () {
                        this.state();
                        this.updateStatusText();
                    },
                    //---------------------------------------------------------------------------
                    // states..
                    stateWait: function () {
                    },
                    stateGameStart: function () {
                        var scene = this;

                        //
                        this.clear();
                        this.initPlayerStatus();
                        this.world.addChild(this.player);
                        this.loadMapData(jp.osakana4242.kimiko["mapData" + jp.osakana4242.kimiko.kimiko.playerData.mapId]);

                        scene.fader.setBlack(true);

                        //scene.fader.fadeIn(kimiko.secToFrame(0.2));
                        var player = scene.player;
                        var camera = scene.camera;
                        scene.fader.fadeIn2(jp.osakana4242.kimiko.kimiko.secToFrame(0.2), camera.getTargetPosOnCamera());

                        scene.state = scene.stateNormal;

                        // scene.state = scene.stateGameClear;
                        if (jp.osakana4242.kimiko.kimiko.config.isSoundEnabled) {
                            var sound = jp.osakana4242.kimiko.kimiko.core.assets[jp.osakana4242.kimiko.Assets.SOUND_BGM];
                            var soundSec = 15.922 + 0.5;
                            var replay = function () {
                                sound.play();
                                if (!scene.state === scene.stateNormal) {
                                    return;
                                }
                                window.setTimeout(replay, Math.floor(soundSec * 1000));
                            };
                            replay();
                        }
                    },
                    stateNormal: function () {
                        var player = this.player;

                        //
                        var mapCharaMgr = this.mapCharaMgr;
                        mapCharaMgr.step();

                        //
                        this.checkCollision();

                        //
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
                        } else if (this.countTimeLimit()) {
                            // タイムオーバー.
                            this.state = this.stateGameOver;
                        }
                    },
                    stateGameOver: function () {
                        //
                        var pd = jp.osakana4242.kimiko.kimiko.playerData;
                        pd.reset();

                        //
                        jp.osakana4242.kimiko.kimiko.core.pushScene(new scenes.GameOver());
                        this.state = this.stateGameStart;
                    },
                    stateGameClear: function () {
                        var _this = this;
                        var pd = jp.osakana4242.kimiko.kimiko.playerData;
                        pd.hp = this.player.life.hp;
                        var mapOption = this.mapOption;
                        if (mapOption.nextMapId === 0) {
                            jp.osakana4242.kimiko.kimiko.core.pushScene(new scenes.GameClear());
                            this.state = this.stateGameStart;
                        } else {
                            pd.mapId = mapOption.nextMapId;

                            //
                            pd.restTimeCounter += pd.restTimeMax;
                            this.state = this.stateWait;

                            var player = this.player;
                            var camera = this.camera;
                            this.fader.fadeOut2(jp.osakana4242.kimiko.kimiko.secToFrame(0.5), camera.getTargetPosOnCamera(), function () {
                                _this.state = _this.stateGameStart;
                            });
                        }
                    },
                    //---------------------------------------------------------------------------
                    loadMapData: function (mapData) {
                        var _this = this;
                        var map = this.map;
                        var mapOption = jp.osakana4242.kimiko.DF.MAP_OPTIONS[jp.osakana4242.kimiko.kimiko.playerData.mapId];
                        for (var key in mapOption) {
                            this.mapOption[key] = mapOption[key];
                        }
                        this.backgroundColor = mapOption.backgroundColor;

                        function cloneTiles(tiles) {
                            var a = [];
                            for (var y = 0, yNum = tiles.length; y < yNum; ++y) {
                                a.push(tiles[y].slice(0));
                            }
                            return a;
                        }

                        function eachTiles(tiles, func) {
                            for (var y = 0, yNum = tiles.length; y < yNum; ++y) {
                                for (var x = 0, xNum = tiles[y].length; x < xNum; ++x) {
                                    func(tiles[y][x], x, y, tiles);
                                }
                            }
                        }

                        (function () {
                            // 1: レイヤーをクローンしてトビラを削除する.
                            // 2: 条件をみたしたらクローンしたレイヤーのトビラを復活させる.
                            var mapWork = {};
                            mapWork.groundTilesOrig = mapData.layers[0].tiles;
                            mapWork.groundTiles = cloneTiles(mapWork.groundTilesOrig);
                            _this.mapWork = mapWork;

                            var tiles = mapWork.groundTiles;

                            if (jp.osakana4242.kimiko.DF.IS_HIDDEN_DOOR) {
                                eachTiles(tiles, function (tile, x, y, tiles) {
                                    if (tile === jp.osakana4242.kimiko.DF.MAP_TILE_DOOR_OPEN) {
                                        // ドアを消す
                                        tiles[y][x] = jp.osakana4242.kimiko.DF.MAP_TILE_DOOR_CLOSE;
                                    }
                                });
                            }

                            // コリジョン自動生成.
                            var collisionData = [];
                            for (var y = 0, yNum = tiles.length; y < yNum; ++y) {
                                var line = [];
                                for (var x = 0, xNum = tiles[y].length; x < xNum; ++x) {
                                    var tile = tiles[y][x];
                                    line.push(jp.osakana4242.kimiko.DF.MAP_TILE_COLLISION_MIN <= tile && tile <= jp.osakana4242.kimiko.DF.MAP_TILE_COLLISION_MAX);
                                }
                                collisionData.push(line);
                            }

                            map.loadData(tiles);
                            map.collisionData = collisionData;
                        })();

                        // 敵, スタート地点.
                        (function () {
                            var mapCharaMgr = _this.mapCharaMgr;
                            var layer = mapData.layers[1];
                            var enemyIdx = 0;
                            eachTiles(layer.tiles, function (charaId, x, y, tiles) {
                                if (charaId === -1) {
                                    return;
                                }
                                var left = x * jp.osakana4242.kimiko.DF.MAP_TILE_W;
                                var top = y * jp.osakana4242.kimiko.DF.MAP_TILE_H;

                                if (charaId === jp.osakana4242.kimiko.DF.MAP_TILE_PLAYER_POS) {
                                    var player = _this.player;
                                    player.x = left + (jp.osakana4242.kimiko.DF.MAP_TILE_W - player.width) / 2;
                                    player.y = top + (jp.osakana4242.kimiko.DF.MAP_TILE_H - player.height);
                                } else if (jp.osakana4242.kimiko.DF.MAP_TILE_CHARA_MIN <= charaId) {
                                    var enemyId = charaId - jp.osakana4242.kimiko.DF.MAP_TILE_CHARA_MIN;
                                    var data = jp.osakana4242.kimiko.scenes.EnemyData[enemyId];
                                    var enemy = new jp.osakana4242.kimiko.scenes.EnemyA();
                                    enemy.tl.unloop().clear();
                                    enemy.enemyId = enemyId;
                                    enemy.life.hpMax = data.hpMax;
                                    enemy.life.hp = enemy.life.hpMax;
                                    data.body(enemy);

                                    // セルのどこに吸着させるか.
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
                                            anchorX = left + (jp.osakana4242.kimiko.DF.MAP_TILE_W - enemy.width) / 2;
                                            break;
                                        case "right":
                                            anchorX = left + jp.osakana4242.kimiko.DF.MAP_TILE_W - enemy.width;
                                            break;
                                        default:
                                            console.log("unknown case:" + alignH);
                                            break;
                                    }
                                    switch (alignV) {
                                        case "top":
                                            anchorY = top;
                                            break;
                                        case "middle":
                                            anchorY = top + (jp.osakana4242.kimiko.DF.MAP_TILE_H - enemy.height) / 2;
                                            break;
                                        case "bottom":
                                            anchorY = top + jp.osakana4242.kimiko.DF.MAP_TILE_H - enemy.height;
                                            break;
                                        default:
                                            console.log("unknown case:" + alignV);
                                            break;
                                    }

                                    enemy.x = enemy.anchor.x = anchorX;
                                    enemy.y = enemy.anchor.y = anchorY;
                                    data.brain(enemy);
                                    enemy.name = "enemy" + (++enemyIdx);
                                    mapCharaMgr.addSleep(enemy);
                                }
                            });
                        })();
                        var camera = this.camera;
                        camera.limitRect.x = 0;
                        camera.limitRect.y = 0;
                        camera.limitRect.width = map.width;
                        camera.limitRect.height = map.height + (jp.osakana4242.kimiko.DF.SC1_H / 2);

                        var player = this.player;
                        jp.osakana4242.utils.Rect.copyFrom(player.limitRect, camera.limitRect);
                        player.startMap();

                        // カメラの追跡対象をプレイヤーにする.
                        camera.targetNode = player;
                        camera.moveToTarget();
                    },
                    addEffect: function (animId, pos) {
                        var effect = this.scene.effectPool.alloc();
                        if (effect === null) {
                            return;
                        }
                        effect.anim.sequence = jp.osakana4242.kimiko.kimiko.getAnimFrames(animId);
                        effect.center.set(pos);
                        effect.x += -1 + Math.random() * 3;
                        effect.y += -1 + Math.random() * 3;
                        this.world.addChild(effect);
                        return effect;
                    },
                    onPlayerDead: function () {
                        var scene = this;
                        var player = this.player;
                        var sx = player.x;
                        var sy = player.y;
                        var t1x = sx + (-player.dirX * 96);
                        var t1y = sy - 64;
                        var dx = -player.dirX;
                        player.tl.moveBy(dx * 96 * 0.25, -96 * 0.8, jp.osakana4242.kimiko.kimiko.secToFrame(0.2), Easing.LINEAR).moveBy(dx * 96 * 0.25, -96 * 0.2, jp.osakana4242.kimiko.kimiko.secToFrame(0.2), Easing.LINEAR).moveBy(dx * 96 * 0.25, 32 * 0.2, jp.osakana4242.kimiko.kimiko.secToFrame(0.3), Easing.LINEAR).moveBy(dx * 96 * 0.25, 32 * 0.8, jp.osakana4242.kimiko.kimiko.secToFrame(0.3), Easing.LINEAR).hide();

                        /*
                        player.tl.
                        moveTo(sx + (t1x - sx) * 0.5, sy + (t1y - sy) * 0.5 - 8, kimiko.secToFrame(0.2), Easing.LINEAR).
                        moveTo(sx + (t1x - sx) * 1.0, sy + (t1y - sy) * 1.0,     kimiko.secToFrame(0.3), Easing.LINEAR).
                        moveBy(- player.dirX * 48,   32,  kimiko.secToFrame(0.5), Easing.LINEAR).
                        hide();
                        */
                        // ゲームオーバーカウント開始.
                        scene.gameOverFrameMax = jp.osakana4242.kimiko.kimiko.secToFrame(1.0);
                        scene.gameOverFrameCounter = 0;
                    },
                    onAllEnemyDead: function () {
                        var scene = this;
                        var mapOption = scene.mapOption;
                        switch (mapOption.exitType) {
                            case "door":
                                if (jp.osakana4242.kimiko.DF.IS_HIDDEN_DOOR) {
                                    scene.map.loadData(scene.mapWork.groundTilesOrig);
                                }
                                break;
                            case "enemy_zero":
                                // ゲームクリアカウント開始.
                                scene.clearFrameMax = jp.osakana4242.kimiko.kimiko.secToFrame(3.0);
                                scene.clearFrameCounter = 0;
                                break;
                            default:
                                console.log("unkown exitType:" + mapOption.exitType);
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
                            if (enemy.isDead()) {
                                continue;
                            }
                            if (!jp.osakana4242.utils.Rect.intersect(searchRect, enemy)) {
                                continue;
                            }
                            var sqrDistance = jp.osakana4242.utils.Rect.distance(sprite, enemy);
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
                        bullet.ageMax = jp.osakana4242.kimiko.kimiko.secToFrame(5);
                        this.world.addChild(bullet);
                        return bullet;
                    },
                    newOwnBullet: function () {
                        var bullet = this.ownBulletPool.alloc();
                        if (!bullet) {
                            return null;
                        }
                        bullet.ageMax = jp.osakana4242.kimiko.kimiko.secToFrame(0.4);
                        this.world.addChild(bullet);
                        return bullet;
                    },
                    intersectActiveArea: function (sprite) {
                        var player = this.player;
                        var minX = player.center.x - jp.osakana4242.kimiko.DF.SC1_W;
                        var maxX = player.center.x + jp.osakana4242.kimiko.DF.SC1_W;
                        if (minX <= sprite.center.x && sprite.center.x <= maxX) {
                            return true;
                        }
                        return false;
                    },
                    /** タイムオーバーになったらtrue. */
                    countTimeLimit: function () {
                        var pd = jp.osakana4242.kimiko.kimiko.playerData;
                        if (pd.restTimeCounter <= 0) {
                            return true;
                        }
                        --pd.restTimeCounter;
                        return pd.restTimeCounter <= 0;
                    },
                    updateStatusText: function () {
                        var scene = this;
                        var player = this.player;
                        var pd = jp.osakana4242.kimiko.kimiko.playerData;
                        var mapCharaMgr = this.mapCharaMgr;
                        var texts = this.statusTexts;
                        var lifeText = jp.osakana4242.utils.StringUtil.mul("o", player.life.hp) + jp.osakana4242.utils.StringUtil.mul("_", player.life.hpMax - player.life.hp);
                        texts[0][0] = "SC " + jp.osakana4242.kimiko.kimiko.playerData.score + " " + "TIME " + Math.floor(jp.osakana4242.kimiko.kimiko.frameToSec(pd.restTimeCounter));
                        texts[1][0] = "LIFE " + lifeText + " " + "WALL " + player.wallPushDir.x + "," + player.wallPushDir.y + " " + (player.targetEnemy ? "LOCK" : "    ") + " " + "";

                        texts[2][0] = "nodes " + scene.world.childNodes.length;

                        for (var i = 0, iNum = texts.length; i < iNum; ++i) {
                            var line = texts[i].join(" ");
                            this.labels[i].text = line;
                        }
                    },
                    checkMapCollision: function (player, onTrim, onIntersect) {
                        // 地形とプレイヤーの衝突判定.
                        // 自分の周囲の地形を調べる.
                        var collider = player.collider;
                        var pRelRect = collider.getRelRect();
                        var prect = collider.getRect();
                        var map = this.map;
                        var xDiff = map.tileWidth;
                        var yDiff = map.tileHeight;
                        var xMin = prect.x;
                        var yMin = prect.y;
                        var xMax = prect.x + prect.width + (xDiff - 1);
                        var yMax = prect.y + prect.height + (yDiff - 1);
                        var hoge = 8;
                        var rect = jp.osakana4242.utils.Rect.alloc();
                        try  {
                            for (var y = yMin; y < yMax; y += yDiff) {
                                for (var x = xMin; x < xMax; x += xDiff) {
                                    rect.reset(Math.floor(x / map.tileWidth) * map.tileWidth, Math.floor(y / map.tileHeight) * map.tileHeight, map.tileWidth, map.tileHeight);
                                    if (!jp.osakana4242.utils.Rect.intersect(prect, rect)) {
                                        continue;
                                    }
                                    if (onIntersect) {
                                        onIntersect.call(player, map.checkTile(x, y), x, y);
                                    }
                                    if (!map.hitTest(x, y)) {
                                        continue;
                                    }

                                    // TODO: たま消しのときは無駄になってしまうので省略したい
                                    if (!map.hitTest(x, y - yDiff) && 0 <= player.force.y && prect.y <= rect.y + hoge) {
                                        // top
                                        player.y = rect.y - prect.height - pRelRect.y;
                                        onTrim.call(player, 0, 1);
                                        player.force.y = 0;
                                        //player.isOnMap = true;
                                    } else if (!map.hitTest(x, y + yDiff) && player.force.y <= 0 && rect.y + rect.height - hoge < prect.y + prect.height) {
                                        // bottom
                                        player.y = rect.y + rect.height - pRelRect.y;
                                        onTrim.call(player, 0, -1);
                                        player.force.y = 0;
                                    } else if (!map.hitTest(x - xDiff, y) && 0 <= player.force.x && prect.x <= rect.x + hoge) {
                                        // left
                                        player.x = rect.x - prect.width - pRelRect.x;
                                        onTrim.call(player, 1, 0);
                                    } else if (!map.hitTest(x + xDiff, y) && player.force.x <= 0 && rect.x + rect.width - hoge < prect.x + prect.width) {
                                        // right
                                        player.x = rect.x + rect.width - pRelRect.x;
                                        onTrim.call(player, -1, 0);
                                    }
                                    if (!player.parentNode) {
                                        // 死んでたら帰る.
                                        return;
                                    }
                                }
                            }
                        } finally {
                            jp.osakana4242.utils.Rect.free(rect);
                        }
                    },
                    checkCollision: function () {
                        var scene = this;
                        var mapCharaMgr = this.mapCharaMgr;
                        var player = this.player;
                        var enemys = mapCharaMgr.actives;

                        // プレイヤーと敵弾の衝突判定.
                        var bullets = this.enemyBulletPool.actives;
                        for (var i = bullets.length - 1; 0 <= i; --i) {
                            var bullet = bullets[i];
                            if (bullet.visible && player.life.canAddDamage() && player.collider.intersect(bullet.collider)) {
                                //
                                player.damage(bullet);
                                if (player.life.isDead()) {
                                    this.onPlayerDead();
                                }
                                this.addEffect(jp.osakana4242.kimiko.DF.ANIM_ID_DAMAGE, bullet.center);
                                bullet.free();
                            }
                        }

                        for (var i = enemys.length - 1; 0 <= i; --i) {
                            var enemy = enemys[i];
                            if (player.life.canAddDamage() && player.collider.intersect(enemy.collider)) {
                                //
                                player.damage(enemy);
                                if (player.life.isDead()) {
                                    this.onPlayerDead();
                                }
                                this.addEffect(jp.osakana4242.kimiko.DF.ANIM_ID_DAMAGE, player.center);
                            }
                        }

                        for (var i = enemys.length - 1; 0 <= i; --i) {
                            var enemy = enemys[i];
                            var bullets = this.ownBulletPool.actives;
                            for (var j = bullets.length - 1; 0 <= j; --j) {
                                var bullet = bullets[j];
                                if (bullet.visible && enemy.life.canAddDamage() && enemy.collider.intersect(bullet.collider)) {
                                    enemy.damage(bullet);
                                    jp.osakana4242.kimiko.kimiko.playerData.score += 10;
                                    if (enemy.life.isDead()) {
                                        var ed = enemy.enemyData;
                                        jp.osakana4242.kimiko.kimiko.playerData.score += ed.score;
                                        if (mapCharaMgr.isAllDead()) {
                                            scene.onAllEnemyDead();
                                        }
                                    }
                                    if (!enemy.life.isDead()) {
                                        this.addEffect(jp.osakana4242.kimiko.DF.ANIM_ID_DAMAGE, bullet.center);
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

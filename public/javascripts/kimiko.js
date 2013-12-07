var jp;
(function (jp) {
    (function (osakana4242) {
        (function (utils) {
            (function (StringUtil) {
                function mul(v, count) {
                    var ret = "";
                    while(count !== 0) {
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
                Vector2D.zero = new Vector2D(0, 0);
                Vector2D.one = new Vector2D(1, 1);
                Vector2D.pool = ((function () {
                    var pool = new Array();
                    for(var i = 0, iNum = 64; i < iNum; ++i) {
                        pool.push(new Vector2D());
                    }
                    return pool;
                })());
                Vector2D.alloc = function alloc(x, y) {
                    if (typeof x === "undefined") { x = 0; }
                    if (typeof y === "undefined") { y = 0; }
                    var v = Vector2D.pool.pop();
                    if(!v) {
                        throw "Vector2D pool empty!!";
                    }
                    v.reset(x, y);
                    return v;
                };
                Vector2D.free = function free(r) {
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
                Vector2D.copyFrom = function copyFrom(dest, src) {
                    dest.x = src.x;
                    dest.y = src.y;
                };
                Vector2D.equals = function equals(a, b) {
                    return a.x === b.x && a.y === b.y;
                };
                Vector2D.add = function add(dest, src) {
                    dest.x += src.x;
                    dest.y += src.y;
                };
                Vector2D.sqrMagnitude = function sqrMagnitude(a) {
                    return (a.x * a.x) + (a.y * a.y);
                };
                Vector2D.magnitude = function magnitude(a) {
                    return Math.sqrt(Vector2D.sqrMagnitude(a));
                };
                Vector2D.sqrDistance = function sqrDistance(a, b) {
                    var dx = b.x - a.x;
                    var dy = b.y - a.y;
                    return (dx * dx) + (dy * dy);
                };
                Vector2D.distance = function distance(a, b) {
                    return Math.sqrt(Vector2D.sqrDistance(a, b));
                };
                Vector2D.normalize = function normalize(a) {
                    var m = Vector2D.magnitude(a);
                    if(m === 0) {
                        return;
                    }
                    a.x = a.x / m;
                    a.y = a.y / m;
                };
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
                Rect.pool = ((function () {
                    var pool = new Array();
                    for(var i = 0, iNum = 64; i < iNum; ++i) {
                        pool.push(new Rect());
                    }
                    return pool;
                })());
                Rect.alloc = function alloc(x, y, width, height) {
                    if (typeof x === "undefined") { x = 0; }
                    if (typeof y === "undefined") { y = 0; }
                    if (typeof width === "undefined") { width = 0; }
                    if (typeof height === "undefined") { height = 0; }
                    var v = Rect.pool.pop();
                    if(!v) {
                        throw "Rect pool empty!!";
                    }
                    v.reset(x, y, width, height);
                    return v;
                };
                Rect.free = function free(r) {
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
                Rect.copyFrom = function copyFrom(a, b) {
                    a.x = b.x;
                    a.y = b.y;
                    a.width = b.width;
                    a.height = b.height;
                };
                Rect.inside = function inside(a, b) {
                    return (a.x <= b.x) && (b.x + b.width < a.x + a.width) && (a.y <= b.y) && (b.y + b.height < a.y + a.height);
                };
                Rect.outside = function outside(a, b) {
                    return (b.x + b.width < a.x) || (a.x + a.width <= b.x) || (b.y + b.height < a.y) || (a.y + a.height <= b.y);
                };
                Rect.intersect = function intersect(a, other) {
                    return (a.x < other.x + other.width) && (other.x < a.x + a.width) && (a.y < other.y + other.height) && (other.y < a.y + a.height);
                };
                Rect.distance = function distance(a, b) {
                    var dx = Math.max(b.x - (a.x + a.width), a.x - (b.x + b.width));
                    var dy = Math.max(b.y - (b.y + b.height), a.y - (b.y + b.height));
                    if(dx < 0) {
                        dx = 0;
                    }
                    if(dy < 0) {
                        dy = 0;
                    }
                    if(dx !== 0 && dy !== 0) {
                        return Math.sqrt((dx * dx) + (dy * dy));
                    } else if(dx !== 0) {
                        return dx;
                    } else {
                        return dy;
                    }
                };
                Rect.trimPos = function trimPos(ownRect, limitRect, onTrim) {
                    if (typeof onTrim === "undefined") { onTrim = null; }
                    if(ownRect.x < limitRect.x) {
                        ownRect.x = limitRect.x;
                        if(onTrim) {
                            onTrim.call(ownRect, -1, 0);
                        }
                    }
                    if(limitRect.x + limitRect.width < ownRect.x + ownRect.width) {
                        ownRect.x = limitRect.x + limitRect.width - ownRect.width;
                        if(onTrim) {
                            onTrim.call(ownRect, 1, 0);
                        }
                    }
                    if(ownRect.y < limitRect.y) {
                        ownRect.y = limitRect.y;
                        if(onTrim) {
                            onTrim.call(ownRect, 0, -1);
                        }
                    }
                    if(limitRect.y + limitRect.height < ownRect.y + ownRect.height) {
                        ownRect.y = limitRect.y + limitRect.height - ownRect.height;
                        if(onTrim) {
                            onTrim.call(ownRect, 0, 1);
                        }
                    }
                };
                return Rect;
            })();
            utils.Rect = Rect;            
            var Collider = (function () {
                function Collider() {
                    this.rect = new Rect();
                    this.workRect = new Rect();
                }
                Collider.prototype.getRect = function () {
                    var s = this.rect;
                    var d = this.workRect;
                    d.width = s.width;
                    d.height = s.height;
                    var x = s.x;
                    var y = s.y;
                    var p = this.parent;
                    if(p) {
                        x += p.x;
                        y += p.y;
                    }
                    d.x = x;
                    d.y = y;
                    return d;
                };
                Collider.prototype.centerBottom = function (width, height) {
                    var rect = this.rect;
                    rect.width = width;
                    rect.height = height;
                    rect.x = (this.parent.width - width) / 2;
                    rect.y = this.parent.height - height;
                };
                Collider.prototype.centerMiddle = function (width, height) {
                    var rect = this.rect;
                    rect.width = width;
                    rect.height = height;
                    rect.x = (this.parent.width - width) / 2;
                    rect.y = (this.parent.height - height) / 2;
                };
                Collider.prototype.intersect = function (collider) {
                    return Rect.intersect(this.getRect(), collider.getRect());
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
                        if(!v) {
                            throw "sequcence is null";
                        }
                        this.sequence_ = v;
                        this.waitCnt = 0;
                        this.frameIdx = 0;
                        this.speed = 1.0;
                        this.loopCnt = 0;
                        this.sprite.width = v.frameWidth;
                        this.sprite.height = v.frameHeight;
                        this.sprite.image = osakana4242.kimiko.kimiko.core.assets[v.imageName];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnimSequencer.prototype, "curFrame", {
                    get: function () {
                        if(this.sequence_) {
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
                    if(this.sequence_ == null) {
                        return;
                    }
                    this.waitCnt += 1;
                    if(osakana4242.kimiko.kimiko.secToFrame(this.sequence_.frameTime) / this.speed <= this.waitCnt) {
                        this.frameIdx += 1;
                        if(this.sequence_.frameNum <= this.frameIdx) {
                            this.frameIdx = 0;
                            ++this.loopCnt;
                            if(this.loopListener) {
                                this.loopListener();
                            }
                        }
                        this.waitCnt = 0;
                    }
                };
                return AnimSequencer;
            })();
            utils.AnimSequencer = AnimSequencer;            
            ((function () {
                var orig = enchant.Sprite.prototype.initialize;
                enchant.Sprite.prototype.initialize = function () {
                    orig.apply(this, arguments);
                    this.center = new utils.RectCenter(this);
                    this.anim = new utils.AnimSequencer(this);
                };
            })());
            var SpritePool = (function () {
                function SpritePool(capacity, makeSprite) {
                    this.sleeps = [];
                    this.actives = [];
                    for(var i = 0, iNum = capacity; i < iNum; ++i) {
                        var spr = makeSprite();
                        this.sleeps.push(spr);
                    }
                }
                SpritePool.prototype.alloc = function () {
                    var spr = this.sleeps.shift();
                    if(spr) {
                        spr.tl.clear();
                        spr.age = 0;
                        spr.visible = true;
                        this.actives.push(spr);
                        return spr;
                    } else {
                        return null;
                    }
                };
                SpritePool.prototype.free = function (spr) {
                    if(spr.parentNode) {
                        spr.parentNode.removeChild(spr);
                    } else {
                        var a = 0;
                    }
                    spr.x = 0x7fffffff;
                    spr.y = 0x7fffffff;
                    spr.visible = false;
                    var index = this.actives.indexOf(spr);
                    if(index !== -1) {
                        this.actives.splice(index, 1);
                    } else {
                        console.log("warn can't free spr. '" + spr + "'");
                    }
                    this.sleeps.push(spr);
                };
                SpritePool.prototype.freeAll = function () {
                    for(var i = this.actives.length - 1; 0 <= i; --i) {
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
            var Class = enchant.Class;
            var Core = enchant.Core;
            var Scene = enchant.Scene;
            var Label = enchant.Label;
            var Event = enchant.Event;
            kimiko.kimiko = null;
            (function (Assets) {
                Assets.IMAGE_GAME_START_BG = "./images/game_start_bg.png";
                Assets.IMAGE_MAP = "./images/map.png";
                Assets.IMAGE_CHARA001 = "./images/chara001.png";
                Assets.IMAGE_CHARA002 = "./images/chara002.png";
                Assets.IMAGE_CHARA003 = "./images/chara003.png";
                Assets.IMAGE_BULLET = "./images/bullet.png";
                Assets.IMAGE_EFFECT = "./images/bullet.png";
                Assets.SOUND_BGM = "./sounds/bgm.mp3";
            })(kimiko.Assets || (kimiko.Assets = {}));
            var Assets = kimiko.Assets;
            (function (DF) {
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
                DF.ENEMY_SPAWN_RECT_MARGIN = 64;
                DF.ENEMY_SLEEP_RECT_MARGIN = 128;
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
                DF.TOUCH_TO_CHARA_MOVE_LIMIT = 320;
                DF.PLAYER_MOVE_RESOLUTION = 8;
                DF.PLAYER_HP = 3;
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
                DF.MAP_ID_MIN = 1;
                DF.MAP_ID_MAX = 4;
                DF.MAP_OPTIONS = {
                    1: {
                        "title": "tutorial",
                        "backgroundColor": "rgb(196,196,196)",
                        "nextMapId": 2,
                        "exitType": "door"
                    },
                    2: {
                        "title": "hospital",
                        "backgroundColor": "rgb(16,16,32)",
                        "nextMapId": 3,
                        "exitType": "door"
                    },
                    3: {
                        "title": "station",
                        "backgroundColor": "rgb(32,196,255)",
                        "nextMapId": 4,
                        "exitType": "door"
                    },
                    4: {
                        "title": "boss",
                        "backgroundColor": "rgb(196,32,32)",
                        "nextMapId": 0,
                        "exitType": "enemy_zero"
                    },
                    101: {
                        "title": "test",
                        "backgroundColor": "rgb(32,32,32)",
                        "nextMapId": 0,
                        "exitType": "enemy_zero"
                    }
                };
                DF.BIT_L = 1 << 0;
                DF.BIT_R = 1 << 1;
                DF.BIT_U = 1 << 2;
                DF.BIT_D = 1 << 3;
                DF.DIR_FLAG_TO_VECTOR2D = ((function () {
                    var a = {
                    };
                    var b = 1;
                    var c = 0.7;
                    a[DF.BIT_L] = {
                        x: -b,
                        y: 0
                    };
                    a[DF.BIT_R] = {
                        x: b,
                        y: 0
                    };
                    a[DF.BIT_U] = {
                        x: 0,
                        y: -b
                    };
                    a[DF.BIT_D] = {
                        x: 0,
                        y: b
                    };
                    a[DF.BIT_L | DF.BIT_U] = {
                        x: -c,
                        y: -c
                    };
                    a[DF.BIT_L | DF.BIT_D] = {
                        x: -c,
                        y: c
                    };
                    a[DF.BIT_L | DF.BIT_R] = {
                        x: 0,
                        y: 0
                    };
                    a[DF.BIT_R | DF.BIT_U] = {
                        x: c,
                        y: -c
                    };
                    a[DF.BIT_R | DF.BIT_D] = {
                        x: c,
                        y: c
                    };
                    a[DF.BIT_U | DF.BIT_D] = {
                        x: 0,
                        y: 0
                    };
                    a[DF.BIT_L | DF.BIT_R | DF.BIT_U] = {
                        x: 0,
                        y: -b
                    };
                    a[DF.BIT_L | DF.BIT_R | DF.BIT_D] = {
                        x: 0,
                        y: b
                    };
                    a[DF.BIT_L | DF.BIT_U | DF.BIT_D] = {
                        x: -b,
                        y: 0
                    };
                    a[DF.BIT_R | DF.BIT_U | DF.BIT_D] = {
                        x: b,
                        y: 0
                    };
                    a[DF.BIT_L | DF.BIT_R | DF.BIT_U | DF.BIT_D] = {
                        x: 0,
                        y: 0
                    };
                    return a;
                })());
            })(kimiko.DF || (kimiko.DF = {}));
            var DF = kimiko.DF;
            var NumberUtil = (function () {
                function NumberUtil() { }
                NumberUtil.prototype.trim = function (v, vMin, vMax) {
                    return Math.max(vMin, Math.min(vMax, v));
                };
                NumberUtil.prototype.sign = function (v) {
                    if(0 <= v) {
                        return 1;
                    } else {
                        return -1;
                    }
                };
                return NumberUtil;
            })();
            kimiko.NumberUtil = NumberUtil;            
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
                    this.restTimeMax = kimiko.kimiko.secToFrame(180);
                    this.restTimeCounter = this.restTimeMax;
                    this.mapId = DF.MAP_ID_MIN;
                };
                return PlayerData;
            })();
            kimiko.PlayerData = PlayerData;            
            var Kimiko = (function () {
                function Kimiko(config) {
                    var _this = this;
                    this.numberUtil = new NumberUtil();
                    this.animFrames = {
                    };
                    if(Kimiko.instance) {
                        return;
                    }
                    Kimiko.instance = this;
                    this.config = config;
                    var core = new enchant.Core(DF.SC_W, DF.SC_H);
                    core.fps = config.fps || DF.BASE_FPS;
                    for(var key in Assets) {
                        if(!Assets.hasOwnProperty(key)) {
                            continue;
                        }
                        var path = Assets[key];
                        var pathSplited = path.split(".");
                        var ext = pathSplited.length <= 0 ? "" : "." + pathSplited[pathSplited.length - 1];
                        var newPath = path + "?v=" + config.version + ext;
                        Assets[key] = newPath;
                        var isSound = ext === ".mp3";
                        if(!config.isSoundEnabled && isSound) {
                            continue;
                        }
                        core.preload(newPath);
                    }
                    ((function () {
                        var r = function (animId, imageName, frameWidth, frameHeight, frameSec, frames) {
                            var seq = new osakana4242.utils.AnimSequence(imageName, frameWidth, frameHeight, frameSec, frames);
                            _this.registerAnimFrames(animId, seq);
                        };
                        r(DF.ANIM_ID_CHARA001_WALK, Assets.IMAGE_CHARA001, 32, 32, 0.1, [
                            0, 
                            1, 
                            0, 
                            2
                        ]);
                        r(DF.ANIM_ID_CHARA001_STAND, Assets.IMAGE_CHARA001, 32, 32, 0.1, [
                            0
                        ]);
                        r(DF.ANIM_ID_CHARA001_SQUAT, Assets.IMAGE_CHARA001, 32, 32, 0.1, [
                            4
                        ]);
                        r(DF.ANIM_ID_CHARA001_DEAD, Assets.IMAGE_CHARA001, 32, 32, 0.1, [
                            0, 
                            1, 
                            0, 
                            2
                        ]);
                        r(DF.ANIM_ID_CHARA002_WALK, Assets.IMAGE_CHARA002, 32, 32, 0.1, [
                            0, 
                            1, 
                            2, 
                            3
                        ]);
                        r(DF.ANIM_ID_CHARA003_WALK, Assets.IMAGE_CHARA003, 64, 64, 0.1, [
                            0, 
                            1, 
                            2, 
                            3
                        ]);
                        r(DF.ANIM_ID_BULLET001, Assets.IMAGE_BULLET, 16, 16, 0.1, [
                            0, 
                            1, 
                            2, 
                            3
                        ]);
                        r(DF.ANIM_ID_BULLET002, Assets.IMAGE_BULLET, 16, 16, 0.1, [
                            4, 
                            5, 
                            6, 
                            7
                        ]);
                        r(DF.ANIM_ID_DAMAGE, Assets.IMAGE_EFFECT, 16, 16, 0.1, [
                            8, 
                            9, 
                            10, 
                            11
                        ]);
                        r(DF.ANIM_ID_MISS, Assets.IMAGE_EFFECT, 16, 16, 0.1, [
                            12, 
                            13, 
                            14, 
                            15
                        ]);
                    })());
                    core.keybind(" ".charCodeAt(0), "a");
                    core.keybind("A".charCodeAt(0), "left");
                    core.keybind("D".charCodeAt(0), "right");
                    core.keybind("W".charCodeAt(0), "up");
                    core.keybind("S".charCodeAt(0), "down");
                    core.onload = (function () {
                        _this.gameScene = new jp.osakana4242.kimiko.scenes.Act();
                        _this.pauseScene = new jp.osakana4242.kimiko.scenes.Pause();
                        kimiko.kimiko.playerData = new PlayerData();
                        if(true) {
                            var scene = new jp.osakana4242.kimiko.scenes.Title();
                            core.replaceScene(scene);
                        } else {
                            kimiko.kimiko.playerData.reset();
                            kimiko.kimiko.playerData.mapId = DF.MAP_ID_MAX;
                            core.replaceScene(_this.gameScene);
                        }
                    });
                }
                Kimiko.instance = null;
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
                Kimiko.prototype.dpsToDpf = function (dotPerSec) {
                    return dotPerSec ? dotPerSec / this.core.fps : 0;
                };
                Kimiko.prototype.getFrameCountByHoge = function (distance, dps) {
                    return distance / this.dpsToDpf(dps);
                };
                return Kimiko;
            })();
            kimiko.Kimiko = Kimiko;            
            function start(params) {
                kimiko.kimiko = new Kimiko(params);
                kimiko.kimiko.core.start();
            }
            kimiko.start = start;
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
                var Class = enchant.Class;
                var Core = enchant.Core;
                var Scene = enchant.Scene;
                var Label = enchant.Label;
                var Event = enchant.Event;
                var Easing = enchant.Easing;
                var Fader = (function () {
                    function Fader(scene) {
                        this.scene = scene;
                        this.film = ((function () {
                            var spr = new enchant.Sprite(kimiko.DF.SC_W, kimiko.DF.SC_H);
                            spr.backgroundColor = "rgb(0, 0, 0)";
                            return spr;
                        })());
                    }
                    Fader.prototype.addFilm = function () {
                        this.removeFilm();
                        this.scene.addChild(this.film);
                        return this.film;
                    };
                    Fader.prototype.removeFilm = function () {
                        var film = this.film;
                        if(film.parentNode) {
                            film.parentNode.removeChild(film);
                        }
                        return film;
                    };
                    Fader.prototype.setBlack = function (isBlack) {
                        if(isBlack) {
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
                        if(callback) {
                            film.tl.then(callback);
                        }
                        film.tl.removeFromScene();
                    };
                    Fader.prototype.fadeOut = function (fadeFrame, callback) {
                        if (typeof callback === "undefined") { callback = null; }
                        var film = this.addFilm();
                        film.tl.clear().fadeTo(1.0, fadeFrame);
                        if(callback) {
                            film.tl.then(callback);
                        }
                    };
                    Fader.prototype.fadeIn2 = function (fadeFrame, target, callback) {
                        if (typeof callback === "undefined") { callback = null; }
                        var _this = this;
                        var films = [];
                        var scLeft = -kimiko.DF.SC_W;
                        var scTop = -kimiko.DF.SC_H;
                        var scRight = kimiko.DF.SC_W;
                        var scBottom = kimiko.DF.SC_H;
                        var scCenterX = 0;
                        var scCenterY = 0;
                        var frame = fadeFrame * 0.9;
                        for(var i = 0, iNum = 4; i < iNum; ++i) {
                            var film = new enchant.Sprite(kimiko.DF.SC_W * 2, kimiko.DF.SC_H * 2);
                            film.backgroundColor = "rgb(0, 0, 0)";
                            var mx = 0;
                            var my = 0;
                            switch(i) {
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
                            group.x = target.x;
                            group.y = target.y;
                        });
                        group.tl.delay(fadeFrame * 0.1).then(function () {
                            for(var i = 0, iNum = films.length; i < iNum; ++i) {
                                group.addChild(films[i]);
                            }
                            _this.setBlack(false);
                        }).delay(fadeFrame * 0.9).then(function () {
                            group.parentNode.removeChild(group);
                            if(callback) {
                                callback();
                            }
                        });
                        this.setBlack(true);
                        this.scene.addChild(group);
                    };
                    Fader.prototype.fadeOut2 = function (fadeFrame, target, callback) {
                        if (typeof callback === "undefined") { callback = null; }
                        var _this = this;
                        var films = [];
                        var scLeft = -kimiko.DF.SC_W;
                        var scTop = -kimiko.DF.SC_H;
                        var scRight = kimiko.DF.SC_W;
                        var scBottom = kimiko.DF.SC_H;
                        var scCenterX = 0;
                        var scCenterY = 0;
                        var frame = fadeFrame * 0.9;
                        for(var i = 0, iNum = 4; i < iNum; ++i) {
                            var film = new enchant.Sprite(kimiko.DF.SC_W * 2, kimiko.DF.SC_H * 2);
                            film.backgroundColor = "rgb(0, 0, 0)";
                            var mx = 0;
                            var my = 0;
                            switch(i) {
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
                            for(var i = 0, iNum = films.length; i < iNum; ++i) {
                                var film = films[i];
                                film.parentNode.removeChild(film);
                            }
                            if(callback) {
                                callback();
                            }
                        });
                        for(var i = 0, iNum = films.length; i < iNum; ++i) {
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
                        this.fireInterval = kimiko.kimiko.secToFrame(0.2);
                        this.reloadFrameCount = kimiko.kimiko.secToFrame(3.0);
                        this.dir = new osakana4242.utils.Vector2D(1, 0);
                        this.targetPos = new osakana4242.utils.Vector2D();
                        this.speed = kimiko.kimiko.dpsToDpf(60 * 1.0);
                        this.fireFunc = WeaponA.fireC;
                        this.isTracePlayer = false;
                    }
                    WeaponA.prototype.step = function () {
                        this.state();
                    };
                    WeaponA.prototype.stateNeutral = function () {
                    };
                    WeaponA.prototype.stateFire = function () {
                        if(this.fireIntervalCounter < this.fireInterval) {
                            ++this.fireIntervalCounter;
                            return;
                        }
                        this.fireIntervalCounter = 0;
                        if(this.fireCounter < this.fireCount) {
                            this.fire();
                            ++this.fireCounter;
                            return;
                        }
                        this.fireCounter = 0;
                        this.reloadFrameCounter = 0;
                        this.state = this.stateNeutral;
                    };
                    WeaponA.prototype.fire = function () {
                        if(this.isTracePlayer) {
                            this.lookAtPlayer();
                        }
                        var parent = this.parent;
                        var wayNum = this.wayNum;
                        var degToRad = Math.PI / 180;
                        var degInterval = 90 / wayNum;
                        var startDeg = -degInterval * ((wayNum - 1) / 2);
                        for(var i = 0, iNum = wayNum; i < iNum; ++i) {
                            var bullet = parent.scene.newEnemyBullet();
                            if(!bullet) {
                                continue;
                            }
                            var deg = startDeg + (degInterval * i);
                            var rad = deg * degToRad;
                            var speed = this.speed;
                            bullet.force.x = (this.dir.x * Math.cos(rad) - (this.dir.y * Math.sin(rad))) * speed;
                            bullet.force.y = (this.dir.y * Math.cos(rad) + (this.dir.x * Math.sin(rad))) * speed;
                            bullet.center.set(parent.center);
                            if(true) {
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
                    WeaponA.fireA = function fireA(bullet, tpos, speed) {
                        bullet.force.x = 0;
                        bullet.force.y = 0;
                        var d = osakana4242.utils.Vector2D.alloc();
                        d.x = tpos.x - bullet.center.x;
                        d.y = tpos.y - bullet.center.y;
                        var m = osakana4242.utils.Vector2D.magnitude(d);
                        var d2 = 480;
                        d.x = d.x * d2 / m;
                        d.y = d.y * d2 / m;
                        var frame = Math.floor(d2 / speed);
                        bullet.tl.moveBy(d.x, d.y, frame).then(function () {
                            this.miss();
                        });
                        osakana4242.utils.Vector2D.free(d);
                    };
                    WeaponA.fireC = function fireC(bullet, tpos, speed) {
                        bullet.force.x = 0;
                        bullet.force.y = 0;
                        var d = osakana4242.utils.Vector2D.alloc();
                        d.x = tpos.x - bullet.center.x;
                        d.y = tpos.y - bullet.center.y;
                        var m = osakana4242.utils.Vector2D.magnitude(d);
                        var d2 = 480;
                        var dx = d.x * d2 / m;
                        var dy = d.y * d2 / m;
                        var frame1 = Math.floor(d2 * 0.2 / kimiko.kimiko.dpsToDpf(4 * 60));
                        var frame2 = Math.floor(d2 * 0.8 / kimiko.kimiko.dpsToDpf(1 * 60));
                        bullet.tl.moveBy(dx * 0.2, dy * 0.2, frame1).moveBy(dx * 0.8, dy * 0.8, frame2).then(function () {
                            this.miss();
                        });
                        osakana4242.utils.Vector2D.free(d);
                    };
                    WeaponA.fireB = function fireB(bullet, tpos, speed) {
                        bullet.force.x = 0;
                        bullet.force.y = 0;
                        var dx = tpos.x - bullet.center.x;
                        var dy = tpos.y - bullet.center.y;
                        var frameNum = kimiko.kimiko.secToFrame(1.0);
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
                scenes.WeaponA = WeaponA;                
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
                var Class = enchant.Class;
                var Event = enchant.Event;
                var Easing = enchant.Easing;
                scenes.EnemyBullet = Class.create(enchant.Sprite, {
                    initialize: function () {
                        var _this = this;
                        enchant.Sprite.call(this, 16, 16);
                        this.anim.sequence = kimiko.kimiko.getAnimFrames(kimiko.DF.ANIM_ID_BULLET002);
                        this.ageMax = 0;
                        this.force = new osakana4242.utils.Vector2D();
                        this.force.x = 0;
                        this.force.y = 0;
                        this.collider = ((function () {
                            var c = new osakana4242.utils.Collider();
                            c.parent = _this;
                            c.centerMiddle(4, 4);
                            return c;
                        })());
                    },
                    onenterframe: function () {
                        this.x += this.force.x;
                        this.y += this.force.y;
                        var camera = this.scene.camera;
                        if(this.ageMax < this.age) {
                            this.miss();
                            return;
                        }
                        if(camera.isOutsideSleepRect(this)) {
                            this.miss();
                            return;
                        }
                        if(!this.scene.intersectActiveArea(this)) {
                            this.miss();
                            return;
                        }
                        this.scene.checkMapCollision(this, this.miss);
                    },
                    miss: function () {
                        this.scene.addEffect(kimiko.DF.ANIM_ID_MISS, this.center);
                        this.free();
                    },
                    free: function () {
                        this.scene.enemyBulletPool.free(this);
                    }
                });
                scenes.OwnBullet = Class.create(enchant.Sprite, {
                    initialize: function () {
                        var _this = this;
                        enchant.Sprite.call(this, 16, 16);
                        this.anim.sequence = kimiko.kimiko.getAnimFrames(kimiko.DF.ANIM_ID_BULLET001);
                        this.ageMax = 0;
                        this.force = new osakana4242.utils.Vector2D();
                        this.force.x = 0;
                        this.force.y = 0;
                        this.collider = ((function () {
                            var c = new osakana4242.utils.Collider();
                            c.parent = _this;
                            c.centerMiddle(8, 8);
                            return c;
                        })());
                    },
                    onenterframe: function () {
                        this.x += this.force.x;
                        this.y += this.force.y;
                        var scene = this.scene;
                        var camera = this.scene.camera;
                        if(this.ageMax <= this.age) {
                            this.miss();
                            return;
                        }
                        if(camera.isOutsideSleepRect(this)) {
                            this.miss();
                            return;
                        }
                        if(!this.scene.intersectActiveArea(this)) {
                            this.miss();
                            return;
                        }
                        scene.checkMapCollision(this, this.miss);
                    },
                    miss: function () {
                        this.scene.addEffect(kimiko.DF.ANIM_ID_MISS, this.center);
                        this.free();
                    },
                    free: function () {
                        this.scene.ownBulletPool.free(this);
                    }
                });
                scenes.Attacker = Class.create(enchant.Sprite, {
                    initialize: function () {
                        var _this = this;
                        enchant.Sprite.call(this);
                        this.dirX = 1;
                        this.force = new osakana4242.utils.Vector2D();
                        this.force.x = 0;
                        this.force.y = 0;
                        this.attackCnt = 0;
                        this.useGravity = true;
                        this.life = new scenes.Life();
                        this.stateNeutral.stateName = "neutral";
                        this.state = this.stateNeutral;
                        this.rectCollider_ = new osakana4242.utils.Rect();
                        this.workRect_ = new osakana4242.utils.Rect();
                        this.addEventListener(Event.ENTER_FRAME, function () {
                            _this.state();
                            _this.life.step();
                            var visible = true;
                            if(_this.life.isGhostTime()) {
                                visible = (_this.life.ghostFrameCounter & 0x1) === 0;
                            }
                            _this.visible = visible;
                        });
                    },
                    stateToString: function () {
                        var dir = 0 <= this.dirX ? '>' : '<';
                        return ([
                            dir, 
                            this.state.stateName, 
                            'cx', 
                            Math.round(this.center.x), 
                            'cy', 
                            Math.round(this.center.y)
                        ]).join();
                    },
                    stateNeutral: function () {
                    },
                    stateDamage: function () {
                        if(!this.life.isGhostTime()) {
                            this.neutral();
                        }
                    },
                    stateDead: function () {
                    },
                    neutral: function () {
                        this.state = this.stateNeutral;
                    },
                    damage: function (attacker) {
                        this.life.damage(1);
                        if(this.life.isAlive()) {
                            this.state = this.stateDamage;
                        } else {
                            this.dead();
                        }
                    },
                    dead: function () {
                        this.visible = false;
                        this.state = this.stateDead;
                        for(var i = 0, iNum = 3; i < iNum; ++i) {
                            var effect = new scenes.DeadEffect(this, i * kimiko.kimiko.core.fps * 0.2);
                            effect.x += Math.random() * 32 - 16;
                            effect.y += Math.random() * 32 - 16;
                            this.parentNode.addChild(effect);
                        }
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
                scenes.EnemyA = Class.create(scenes.Attacker, {
                    initialize: function () {
                        var _this = this;
                        scenes.Attacker.call(this);
                        this.enemyId = -1;
                        this.weapons = [];
                        for(var i = 0, iNum = 8; i < iNum; ++i) {
                            this.weapons[i] = new scenes.WeaponA(this);
                        }
                        this.weaponNum = 1;
                        this.anchor = new osakana4242.utils.Vector2D();
                        this.collider = new osakana4242.utils.Collider();
                        this.collider.parent = this;
                        this.life.setGhostFrameMax(kimiko.kimiko.secToFrame(0.2));
                        this.addEventListener(Event.ENTER_FRAME, function () {
                            for(var i = 0, iNum = _this.weaponNum; i < iNum; ++i) {
                                _this.weapons[i].step();
                            }
                        });
                    },
                    weapon: {
                        get: function () {
                            return this.weapons[0];
                        }
                    },
                    getEnemyData: function () {
                        return scenes.EnemyData[this.enemyId];
                    },
                    isBoss: function () {
                        return this.enemyId === kimiko.DF.ENEMY_ID_BOSS;
                    }
                });
                scenes.DeadEffect = Class.create(enchant.Sprite, {
                    initialize: function (attacker, delay) {
                        var _this = this;
                        enchant.Sprite.call(this);
                        this.width = attacker.width;
                        this.height = attacker.height;
                        this.center.x = attacker.center.x;
                        this.center.y = attacker.center.y;
                        this.backgroundColor = attacker.backgroundColor;
                        var effectTime = kimiko.kimiko.secToFrame(0.5);
                        this.visible = false;
                        this.tl.delay(delay).then(function () {
                            return _this.visible = true;
                        }).scaleTo(2.0, effectTime, enchant.Easing.SIN_EASEOUT).and().fadeOut(effectTime, enchant.Easing.SIN_EASEOUT).then(function () {
                            return _this.tl.removeFromScene();
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
                        sprite.anim.sequence = kimiko.kimiko.getAnimFrames(kimiko.DF.ANIM_ID_CHARA002_WALK);
                        sprite.collider.centerBottom(28, 28);
                    }
                    EnemyBodys.body1 = body1;
                    function body2(sprite) {
                        sprite.width = 64;
                        sprite.height = 64;
                        sprite.anim.sequence = kimiko.kimiko.getAnimFrames(kimiko.DF.ANIM_ID_CHARA003_WALK);
                        sprite.collider.centerMiddle(56, 56);
                        sprite.weaponNum = 3;
                    }
                    EnemyBodys.body2 = body2;
                    function body3(sprite) {
                        sprite.width = 32;
                        sprite.height = 16;
                        sprite.backgroundColor = "rgb(255,48,48)";
                        sprite.collider.centerMiddle(28, 12);
                    }
                    EnemyBodys.body3 = body3;
                })(scenes.EnemyBodys || (scenes.EnemyBodys = {}));
                var EnemyBodys = scenes.EnemyBodys;
                (function (EnemyBrains) {
                    function brainX(sprite) {
                        var anchor = sprite.anchor;
                        var range = 48;
                        var waitFire = function () {
                            return !sprite.weapon.isStateFire();
                        };
                        sprite.tl.moveTo(anchor.x + range, anchor.y, kimiko.kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN).moveTo(anchor.x, anchor.y, kimiko.kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN).loop();
                    }
                    EnemyBrains.brainX = brainX;
                    function brain1(sprite) {
                        var anchor = sprite.anchor;
                        var range = 48;
                        var fire = function () {
                            var player = sprite.scene.player;
                            var wp = sprite.weapon;
                            wp.wayNum = 1;
                            wp.speed = kimiko.kimiko.dpsToDpf(1.5 * kimiko.DF.BASE_FPS);
                            wp.dir.x = player.x - sprite.x;
                            wp.dir.y = 0;
                            wp.fireFunc = scenes.WeaponA.fireA;
                            wp.lookAtPlayer();
                            osakana4242.utils.Vector2D.normalize(wp.dir);
                            wp.startFire();
                        };
                        var waitFire = function () {
                            return !sprite.weapon.isStateFire();
                        };
                        sprite.tl.moveTo(anchor.x, anchor.y - range, kimiko.kimiko.secToFrame(2.0), Easing.SIN_EASEINOUT).then(fire).waitUntil(waitFire).moveTo(anchor.x, anchor.y, kimiko.kimiko.secToFrame(2.0), Easing.SIN_EASEINOUT).then(fire).waitUntil(waitFire).loop();
                    }
                    EnemyBrains.brain1 = brain1;
                    function brain2(sprite) {
                        var anchor = sprite.anchor;
                        var range = 16;
                        var waitFire = function () {
                            return !sprite.weapon.isStateFire();
                        };
                        sprite.weapon.fireFunc = scenes.WeaponA.fireA;
                        sprite.tl.moveTo(sprite.anchor.x + range, sprite.anchor.y, kimiko.kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN).then(function () {
                            var wp = sprite.weapon;
                            wp.dir.x = 1;
                            wp.dir.y = 0;
                            wp.startFire();
                        }).waitUntil(waitFire).moveTo(sprite.anchor.x - range, sprite.anchor.y, kimiko.kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN).then(function () {
                            var wp = sprite.weapon;
                            wp.dir.x = -1;
                            wp.dir.y = 0;
                            wp.startFire();
                        }).waitUntil(waitFire).then(function () {
                            var player = sprite.scene.player;
                            var wp = sprite.weapon;
                            wp.dir.x = player.center.x - sprite.center.x;
                            wp.dir.y = player.center.y - sprite.center.y;
                            osakana4242.utils.Vector2D.normalize(wp.dir);
                            wp.startFire();
                        }).waitUntil(waitFire).moveTo(sprite.anchor.x, sprite.anchor.y - 32, kimiko.kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN).then(function () {
                            var wp = sprite.weapon;
                            wp.dir.x = -1;
                            wp.dir.y = 0;
                            wp.startFire();
                        }).waitUntil(waitFire).loop();
                    }
                    EnemyBrains.brain2 = brain2;
                    function brain3(sprite) {
                        var anchor = sprite.anchor;
                        var range = 16;
                        var waitFire = function () {
                            return !sprite.weapon.isStateFire();
                        };
                        function fireToPlayer() {
                            var player = sprite.scene.player;
                            var wp = sprite.weapon;
                            wp.fireCount = 1;
                            wp.wayNum = 1;
                            wp.dir.x = player.center.x - sprite.center.x;
                            wp.dir.y = player.center.y - sprite.center.y;
                            wp.fireFunc = scenes.WeaponA.fireA;
                            osakana4242.utils.Vector2D.normalize(wp.dir);
                            wp.startFire();
                        }
                        sprite.tl.delay(kimiko.kimiko.secToFrame(0.5)).moveBy(0, -16, kimiko.kimiko.secToFrame(0.2), Easing.CUBIC_EASEOUT).moveBy(0, 16, kimiko.kimiko.secToFrame(0.2), Easing.CUBIC_EASEOUT).moveBy(0, -8, kimiko.kimiko.secToFrame(0.1), Easing.CUBIC_EASEOUT).moveBy(0, 8, kimiko.kimiko.secToFrame(0.1), Easing.CUBIC_EASEOUT).then(fireToPlayer).moveBy(8, 0, kimiko.kimiko.secToFrame(0.5), Easing.CUBIC_EASEOUT).delay(kimiko.kimiko.secToFrame(0.5)).waitUntil(waitFire).then(fireToPlayer).moveBy(8, 0, kimiko.kimiko.secToFrame(0.5), Easing.CUBIC_EASEOUT).delay(kimiko.kimiko.secToFrame(0.5)).waitUntil(waitFire).then(fireToPlayer).moveBy(8, 0, kimiko.kimiko.secToFrame(0.5), Easing.CUBIC_EASEOUT).delay(kimiko.kimiko.secToFrame(0.5)).waitUntil(waitFire).delay(kimiko.kimiko.secToFrame(0.5)).moveTo(sprite.anchor.x, sprite.anchor.y, kimiko.kimiko.secToFrame(0.5), Easing.LINEAR).loop();
                    }
                    EnemyBrains.brain3 = brain3;
                    function brain4(sprite) {
                        var anchor = sprite.anchor;
                        anchor.x -= 120;
                        anchor.y -= 16;
                        var range = 240;
                        sprite.y = anchor.y;
                        var totalFrame = kimiko.kimiko.secToFrame(8.0);
                        function fireToPlayer() {
                            var player = sprite.scene.player;
                            var wp = sprite.weapon;
                            wp.fireCount = 1;
                            wp.wayNum = 1;
                            wp.dir.x = player.center.x - sprite.center.x;
                            wp.dir.y = 0;
                            wp.fireFunc = scenes.WeaponA.fireA;
                            osakana4242.utils.Vector2D.normalize(wp.dir);
                            wp.startFire();
                        }
                        sprite.tl.then(fireToPlayer).moveTo(anchor.x - range, anchor.y, totalFrame * 0.5, Easing.LINEAR).then(fireToPlayer).moveTo(anchor.x + range, anchor.y, totalFrame * 0.5, Easing.LINEAR).loop();
                    }
                    EnemyBrains.brain4 = brain4;
                    function brainBoss(sprite) {
                        var anchor = sprite.anchor;
                        var waitFire = function () {
                            return !sprite.weapon.isStateFire();
                        };
                        function runup() {
                            return sprite.tl.moveBy(0, -24, kimiko.kimiko.secToFrame(0.2), Easing.CUBIC_EASEOUT).moveBy(0, 24, kimiko.kimiko.secToFrame(0.2), Easing.CUBIC_EASEOUT).moveBy(0, -8, kimiko.kimiko.secToFrame(0.1), Easing.CUBIC_EASEOUT).moveBy(0, 8, kimiko.kimiko.secToFrame(0.1), Easing.CUBIC_EASEOUT).delay(kimiko.kimiko.secToFrame(0.5));
                        }
                        function fireToPlayer() {
                            var wp = sprite.weapons[0];
                            wp.fireCount = 5;
                            wp.wayNum = 4;
                            wp.fireInterval = kimiko.kimiko.secToFrame(0.5);
                            wp.speed = kimiko.kimiko.dpsToDpf(3 * kimiko.DF.BASE_FPS);
                            wp.fireFunc = scenes.WeaponA.fireC;
                            wp.isTracePlayer = true;
                            wp.lookAtPlayer();
                            wp.startFire();
                            wp = sprite.weapons[1];
                            wp.fireCount = 3;
                            wp.wayNum = 1;
                            wp.fireInterval = kimiko.kimiko.secToFrame(0.75);
                            wp.speed = kimiko.kimiko.dpsToDpf(2 * kimiko.DF.BASE_FPS);
                            wp.fireFunc = scenes.WeaponA.fireA;
                            wp.isTracePlayer = true;
                            wp.startFire();
                        }
                        function fireToPlayer2() {
                            var wp = sprite.weapon;
                            wp.fireCount = 9;
                            wp.wayNum = 1;
                            wp.fireInterval = kimiko.kimiko.secToFrame(0.5);
                            wp.speed = kimiko.kimiko.dpsToDpf(3 * kimiko.DF.BASE_FPS);
                            wp.fireFunc = scenes.WeaponA.fireB;
                            wp.isTracePlayer = true;
                            wp.lookAtPlayer();
                            wp.startFire();
                            wp = sprite.weapons[1];
                            wp.fireCount = 1;
                            wp.wayNum = 1;
                            wp.fireInterval = kimiko.kimiko.secToFrame(1.5);
                            wp.speed = kimiko.kimiko.dpsToDpf(1 * kimiko.DF.BASE_FPS);
                            wp.fireFunc = scenes.WeaponA.fireA;
                            wp.isTracePlayer = true;
                            wp.startFire();
                        }
                        function fireToPlayer3() {
                            var wp = sprite.weapons[0];
                            wp.fireCount = 1;
                            wp.wayNum = 6;
                            wp.fireInterval = kimiko.kimiko.secToFrame(0.5);
                            wp.speed = kimiko.kimiko.dpsToDpf(1 * kimiko.DF.BASE_FPS);
                            wp.fireFunc = scenes.WeaponA.fireA;
                            wp.isTracePlayer = false;
                            wp.lookAtPlayer();
                            wp.startFire();
                            wp = sprite.weapons[1];
                            wp.fireCount = 2;
                            wp.wayNum = 1;
                            wp.fireInterval = kimiko.kimiko.secToFrame(0.2);
                            wp.speed = kimiko.kimiko.dpsToDpf(3 * kimiko.DF.BASE_FPS);
                            wp.fireFunc = scenes.WeaponA.fireA;
                            wp.isTracePlayer = true;
                            wp.startFire();
                        }
                        function fire1() {
                            return runup().then(fireToPlayer).moveBy(8, 0, kimiko.kimiko.secToFrame(0.5), Easing.CUBIC_EASEOUT).delay(kimiko.kimiko.secToFrame(0.5)).waitUntil(waitFire);
                        }
                        function fire2() {
                            return runup().then(fireToPlayer2).waitUntil(waitFire);
                        }
                        function fire3() {
                            return runup().then(fireToPlayer3).moveBy(8, 0, kimiko.kimiko.secToFrame(0.5), Easing.CUBIC_EASEOUT).delay(kimiko.kimiko.secToFrame(0.5)).waitUntil(waitFire);
                        }
                        var top = sprite.anchor.y - 96;
                        var bottom = sprite.anchor.y;
                        var left = sprite.anchor.x - 200;
                        var right = sprite.anchor.x + 0;
                        sprite.x = right;
                        sprite.y = top;
                        sprite.tl.delay(kimiko.kimiko.secToFrame(1.0)).moveTo(right, bottom, kimiko.kimiko.secToFrame(2.0)).scaleTo(-1.0, 1.0, 1).delay(kimiko.kimiko.secToFrame(0.5)).then(function () {
                            sprite.tl.moveTo(left, bottom, kimiko.kimiko.secToFrame(0.5), Easing.CUBIC_EASEIN).scaleTo(1.0, 1.0, 1);
                            fire2().moveTo(left, top, kimiko.kimiko.secToFrame(1.0));
                            fire1().moveTo(right, top, kimiko.kimiko.secToFrame(0.5), Easing.CUBIC_EASEIN).scaleTo(-1.0, 1.0, 1);
                            fire2().moveTo(right, bottom, kimiko.kimiko.secToFrame(1.0));
                            fire1().moveTo(left, top, kimiko.kimiko.secToFrame(2.0));
                            fire3().moveTo(right, top, kimiko.kimiko.secToFrame(0.5), Easing.CUBIC_EASEIN);
                            fire3().moveTo(left, top, kimiko.kimiko.secToFrame(0.5), Easing.CUBIC_EASEIN);
                            fire3().moveTo(right, top, kimiko.kimiko.secToFrame(0.5));
                            fire3().delay(kimiko.kimiko.secToFrame(1.0)).moveTo(right, bottom, kimiko.kimiko.secToFrame(2.0)).loop();
                        });
                    }
                    EnemyBrains.brainBoss = brainBoss;
                })(scenes.EnemyBrains || (scenes.EnemyBrains = {}));
                var EnemyBrains = scenes.EnemyBrains;
                scenes.EnemyData = {
                    0: {
                        hpMax: 5,
                        body: EnemyBodys.body1,
                        brain: EnemyBrains.brain1,
                        score: 100
                    },
                    1: {
                        hpMax: 5,
                        body: EnemyBodys.body1,
                        brain: EnemyBrains.brain2,
                        score: 100
                    },
                    2: {
                        hpMax: 5,
                        body: EnemyBodys.body1,
                        brain: EnemyBrains.brain3,
                        score: 100
                    },
                    3: {
                        hpMax: 5,
                        body: EnemyBodys.body3,
                        brain: EnemyBrains.brain4,
                        score: 100
                    },
                    15: {
                        hpMax: 100,
                        body: EnemyBodys.body2,
                        brain: EnemyBrains.brainBoss,
                        score: 1000
                    }
                };
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
                var Class = enchant.Class;
                var Event = enchant.Event;
                var Easing = enchant.Easing;
                scenes.Player = Class.create(scenes.Attacker, {
                    initialize: function () {
                        var _this = this;
                        scenes.Attacker.call(this);
                        this.bodyStyles = ((function () {
                            var animWalk = kimiko.kimiko.getAnimFrames(kimiko.DF.ANIM_ID_CHARA001_WALK);
                            var animStand = kimiko.kimiko.getAnimFrames(kimiko.DF.ANIM_ID_CHARA001_STAND);
                            var animSquat = kimiko.kimiko.getAnimFrames(kimiko.DF.ANIM_ID_CHARA001_SQUAT);
                            var animDead = kimiko.kimiko.getAnimFrames(kimiko.DF.ANIM_ID_CHARA001_DEAD);
                            _this.anim.sequence = animWalk;
                            var colliderA = ((function () {
                                var c = new osakana4242.utils.Collider();
                                c.parent = _this;
                                c.centerBottom(12, 28);
                                return c;
                            })());
                            var colliderB = ((function () {
                                var c = new osakana4242.utils.Collider();
                                c.parent = _this;
                                c.centerBottom(12, 14);
                                return c;
                            })());
                            var muzzlePosUp = new osakana4242.utils.Vector2D(32, 12);
                            var muzzlePosDown = new osakana4242.utils.Vector2D(32, 24);
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
                        })());
                        this.bodyStyle = this.bodyStyles.stand;
                        this.life.hpMax = kimiko.DF.PLAYER_HP;
                        this.life.hp = this.life.hpMax;
                        this.life.setGhostFrameMax(kimiko.kimiko.secToFrame(1.5));
                        this.life.damageListener = function () {
                            if(_this.life.isDead()) {
                            }
                        };
                        this.touchStartAnchor = new osakana4242.utils.Vector2D();
                        this.isPause = false;
                        this.isSlowMove = false;
                        this.isOnMap = false;
                        this.targetEnemy = null;
                        this.limitRect = new osakana4242.utils.Rect(0, 0, kimiko.DF.SC_W, kimiko.DF.SC_H);
                        this.wallPushDir = new osakana4242.utils.Vector2D();
                        this.inputForce = new osakana4242.utils.Vector2D();
                        this.addEventListener(Event.ENTER_FRAME, function () {
                            var scene = _this.scene;
                            if(_this.isPause) {
                                return;
                            }
                            var isAlive = !_this.life.isDead();
                            if(isAlive) {
                                _this.checkInput();
                            }
                            _this.updateBodyStyle();
                            if(isAlive) {
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
                            this.collider = v.collider;
                        }
                    },
                    searchEnemy: function () {
                        var scene = this.scene;
                        if((this.age % kimiko.kimiko.secToFrame(0.2)) === 0) {
                            var srect = osakana4242.utils.Rect.alloc();
                            srect.width = 256;
                            srect.height = this.height * 2;
                            srect.x = this.x + ((this.width - srect.width) / 2);
                            srect.y = this.y + ((this.height - srect.height) / 2);
                            var enemy = scene.getNearEnemy(this, srect);
                            if(enemy) {
                                this.targetEnemy = enemy;
                            }
                            osakana4242.utils.Rect.free(srect);
                        }
                        if(this.targetEnemy === null) {
                        } else {
                            if(this.targetEnemy.life.isDead()) {
                                this.targetEnemy = null;
                            }
                            if(this.targetEnemy !== null) {
                                var distance = osakana4242.utils.Rect.distance(this, this.targetEnemy);
                                var threshold = kimiko.DF.SC1_W;
                                if(threshold < distance) {
                                    this.targetEnemy = null;
                                } else {
                                    this.dirX = kimiko.kimiko.numberUtil.sign(this.targetEnemy.x - this.x);
                                    this.scaleX = this.dirX;
                                    if((this.age % kimiko.kimiko.secToFrame(0.2)) === 0) {
                                        var srect = osakana4242.utils.Rect.alloc();
                                        srect.width = kimiko.DF.SC1_W;
                                        srect.height = this.height * 2;
                                        srect.x = this.center.x + (this.dirX < 0 ? -srect.width : 0);
                                        srect.y = this.y + ((this.height - srect.height) / 2);
                                        if(osakana4242.utils.Rect.intersect(srect, this.targetEnemy)) {
                                            this.attack();
                                        }
                                        osakana4242.utils.Rect.free(srect);
                                    }
                                }
                            }
                        }
                    },
                    stateToString: function () {
                        var str = scenes.Attacker.prototype.stateToString.call(this);
                        str += " hp:" + this.life.hp + " L:" + (this.targetEnemy !== null ? "o" : "x");
                        return str;
                    },
                    attack: function () {
                        var bullet = this.scene.newOwnBullet();
                        if(bullet === null) {
                            return;
                        }
                        bullet.force.x = this.dirX * kimiko.kimiko.dpsToDpf(6 * 60);
                        bullet.force.y = 0;
                        bullet.center.x = this.center.x + this.scaleX * (this.bodyStyle.muzzlePos.x - (this.width / 2));
                        bullet.center.y = this.y + this.bodyStyle.muzzlePos.y;
                    },
                    updateBodyStyle: function () {
                        var nextBodyStyle = this.bodyStyle;
                        if(this.life.isDead()) {
                            nextBodyStyle = this.bodyStyles.dead;
                        } else if(0 < this.wallPushDir.y) {
                            nextBodyStyle = this.bodyStyles.squat;
                        } else if(!osakana4242.utils.Vector2D.equals(this.inputForce, osakana4242.utils.Vector2D.zero)) {
                            nextBodyStyle = this.bodyStyles.walk;
                        } else {
                            nextBodyStyle = this.bodyStyles.stand;
                        }
                        if(this.bodyStyle !== nextBodyStyle) {
                            this.bodyStyle = nextBodyStyle;
                        }
                    },
                    stepMove: function () {
                        var scene = this.scene;
                        if(!this.targetEnemy) {
                            if(0 !== this.inputForce.x) {
                                this.dirX = kimiko.kimiko.numberUtil.sign(this.inputForce.x);
                                this.scaleX = this.dirX;
                            }
                        }
                        if(this.isSlowMove || !osakana4242.utils.Vector2D.equals(this.inputForce, osakana4242.utils.Vector2D.zero)) {
                            this.force.x = this.inputForce.x;
                            this.force.y = this.inputForce.y;
                        } else {
                        }
                        this.force.y += kimiko.kimiko.dpsToDpf(kimiko.DF.GRAVITY);
                        var totalMx = this.force.x;
                        var totalMy = this.force.y;
                        osakana4242.utils.Vector2D.copyFrom(this.wallPushDir, osakana4242.utils.Vector2D.zero);
                        var loopCnt = Math.floor(Math.max(Math.abs(totalMx), Math.abs(totalMy)) / kimiko.DF.PLAYER_MOVE_RESOLUTION);
                        var mx = totalMx / loopCnt;
                        var my = totalMy / loopCnt;
                        for(var i = 0, loopCnt; i <= loopCnt; ++i) {
                            if(i < loopCnt) {
                                this.x += mx;
                                this.y += my;
                                totalMx -= mx;
                                totalMy -= my;
                            } else {
                                this.x += totalMx;
                                this.y += totalMy;
                            }
                            osakana4242.utils.Rect.trimPos(this, this.limitRect, this.onTrim);
                            scene.checkMapCollision(this, this.onTrim, this.onIntersect);
                            if(this.force.x === 0) {
                                mx = 0;
                                totalMx = 0;
                            }
                            if(this.force.y === 0) {
                                my = 0;
                                totalMy = 0;
                            }
                        }
                        if(!osakana4242.utils.Vector2D.equals(this.inputForce, osakana4242.utils.Vector2D.zero)) {
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
                        if(tile !== kimiko.DF.MAP_TILE_DOOR_OPEN) {
                            return;
                        }
                        var scene = this.scene;
                        scene.state = scene.stateGameClear;
                        this.endMap();
                    },
                    onTrim: function (x, y) {
                        if(x !== 0) {
                            if(1 < Math.abs(this.inputForce.x)) {
                                this.wallPushDir.x = x;
                            }
                            this.force.x = 0;
                        }
                        if(y !== 0) {
                            if(1 < Math.abs(this.inputForce.y)) {
                                this.wallPushDir.y = y;
                            }
                            this.force.y = 0;
                        }
                    },
                    checkInput: function () {
                        osakana4242.utils.Vector2D.copyFrom(this.inputForce, osakana4242.utils.Vector2D.zero);
                        if(this.life.isDead()) {
                            return;
                        }
                        this.checkKeyInput();
                        this.checkTouchInput();
                    },
                    checkKeyInput: function () {
                        var input = kimiko.kimiko.core.input;
                        var flag = ((input.left ? 1 : 0) << 0) | ((input.right ? 1 : 0) << 1) | ((input.up ? 1 : 0) << 2) | ((input.down ? 1 : 0) << 3);
                        this.isSlowMove = kimiko.kimiko.core.input.a;
                        if(flag !== 0) {
                            if(this.isSlowMove) {
                                this.inputForce.x = kimiko.DF.DIR_FLAG_TO_VECTOR2D[flag].x * 2;
                                this.inputForce.y = kimiko.DF.DIR_FLAG_TO_VECTOR2D[flag].y * 2;
                            } else {
                                this.inputForce.x = kimiko.DF.DIR_FLAG_TO_VECTOR2D[flag].x * 4;
                                this.inputForce.y = kimiko.DF.DIR_FLAG_TO_VECTOR2D[flag].y * 4;
                            }
                        }
                    },
                    checkTouchInput: function () {
                        var scene = this.scene;
                        var player = this;
                        var touch = scene.touch;
                        if(!touch.isTouching) {
                            var input = kimiko.kimiko.core.input;
                            var flag = ((input.left ? 1 : 0) << 0) | ((input.right ? 1 : 0) << 1) | ((input.up ? 1 : 0) << 2) | ((input.down ? 1 : 0) << 3);
                            var isSlow = kimiko.kimiko.core.input.a;
                            if(isSlow) {
                                player.inputForce.x = 0;
                                player.inputForce.y = 0;
                            }
                            if(flag !== 0) {
                                if(isSlow) {
                                    player.inputForce.x = kimiko.DF.DIR_FLAG_TO_VECTOR2D[flag].x * 2;
                                    player.inputForce.y = kimiko.DF.DIR_FLAG_TO_VECTOR2D[flag].y * 2;
                                } else {
                                    player.inputForce.x = kimiko.DF.DIR_FLAG_TO_VECTOR2D[flag].x * 4;
                                    player.inputForce.y = kimiko.DF.DIR_FLAG_TO_VECTOR2D[flag].y * 4;
                                }
                            }
                        } else {
                            var moveLimit = kimiko.DF.TOUCH_TO_CHARA_MOVE_LIMIT;
                            var moveRate = kimiko.kimiko.config.swipeToMoveRate;
                            if(kimiko.DF.PLAYER_TOUCH_ANCHOR_ENABLE) {
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
                                player.inputForce.x = kimiko.kimiko.numberUtil.trim(touch.diff.x * moveRate.x, -moveLimit, moveLimit);
                                player.inputForce.y = kimiko.kimiko.numberUtil.trim(touch.diff.y * moveRate.y, -moveLimit, moveLimit);
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
                var Class = enchant.Class;
                var Core = enchant.Core;
                var Scene = enchant.Scene;
                var Label = enchant.Label;
                var Event = enchant.Event;
                var Easing = enchant.Easing;
                scenes.Camera = Class.create(enchant.Node, {
                    initialize: function () {
                        enchant.Node.call(this);
                        this.width = kimiko.DF.SC1_W;
                        this.height = kimiko.DF.SC1_H;
                        this.center = new osakana4242.utils.RectCenter(this);
                        this.limitRect = new osakana4242.utils.Rect(0, 0, 320, 320);
                        this.sleepRect = new osakana4242.utils.Rect(0, 0, this.width + kimiko.DF.ENEMY_SLEEP_RECT_MARGIN, this.height + kimiko.DF.ENEMY_SLEEP_RECT_MARGIN);
                        this.spawnRect = new osakana4242.utils.Rect(0, 0, this.width + kimiko.DF.ENEMY_SPAWN_RECT_MARGIN, this.height + kimiko.DF.ENEMY_SPAWN_RECT_MARGIN);
                        this._targetPos = new osakana4242.utils.Vector2D();
                        this.targetGroup = null;
                        this.targetNode = this;
                    },
                    getTargetPosOnCamera: function () {
                        var camera = this;
                        var pos = this.targetNode.center;
                        var o = {
                        };
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
                        this._targetPos.x = node.center.x - (camera.width / 2) + (node.dirX * 16);
                        this._targetPos.y = node.center.y - (camera.height / 2) + 32;
                        return this._targetPos;
                    },
                    onenterframe: function () {
                        var camera = this;
                        var tp = this.calcTargetPos();
                        var speed = kimiko.kimiko.dpsToDpf(5 * 60);
                        var dv = osakana4242.utils.Vector2D.alloc(tp.x - camera.x, tp.y - camera.y);
                        var mv = osakana4242.utils.Vector2D.alloc();
                        var distance = osakana4242.utils.Vector2D.magnitude(dv);
                        if(speed < distance) {
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
                        var limitRect = osakana4242.utils.Rect.alloc(Math.floor(tp.x - marginX / 2), Math.floor(tp.y - marginY / 2), Math.floor(camera.width + marginX), Math.floor(camera.height + marginY));
                        osakana4242.utils.Rect.trimPos(camera, limitRect);
                        osakana4242.utils.Rect.trimPos(camera, camera.limitRect);
                        this.updateGroup();
                        osakana4242.utils.Vector2D.free(dv);
                        osakana4242.utils.Vector2D.free(mv);
                        osakana4242.utils.Rect.free(limitRect);
                    },
                    updateGroup: function () {
                        var group = this.targetGroup;
                        if(group) {
                            group.x = -this.x;
                            group.y = -this.y;
                        }
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
                        this.ghostFrameMax = kimiko.kimiko.secToFrame(1.0);
                        this.ghostFrameCounter = this.ghostFrameMax;
                    }
                    Life.prototype.setGhostFrameMax = function (frameMax) {
                        this.ghostFrameMax = frameMax;
                        this.ghostFrameCounter = frameMax;
                    };
                    Life.prototype.step = function () {
                        if(this.isGhostTime()) {
                            ++this.ghostFrameCounter;
                        }
                    };
                    Life.prototype.isAlive = function () {
                        return 0 < this.hp;
                    };
                    Life.prototype.isDead = function () {
                        return !this.isAlive();
                    };
                    Life.prototype.isGhostTime = function () {
                        return this.ghostFrameCounter < this.ghostFrameMax;
                    };
                    Life.prototype.canAddDamage = function () {
                        return this.isAlive() && !this.isGhostTime();
                    };
                    Life.prototype.damage = function (v) {
                        this.hp -= v;
                        this.ghostFrameCounter = 0;
                        if(this.damageListener) {
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
                        if(0 < this.sleeps.length) {
                            return false;
                        }
                        return this.getAliveCount() === 0;
                    };
                    MapCharaManager.prototype.clear = function () {
                        var arr = this.actives;
                        for(var i = arr.length - 1; 0 <= i; --i) {
                            var chara = arr.pop();
                            if(chara.parentNode) {
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
                        for(var i = this.actives.length - 1; 0 <= i; --i) {
                            if(this.actives[i].life.isAlive()) {
                                ++count;
                            }
                        }
                        return count;
                    };
                    MapCharaManager.prototype.checkSpawn = function () {
                        var scene = this.scene;
                        var camera = this.scene.camera;
                        var arr = this.sleeps;
                        for(var i = arr.length - 1; 0 <= i; --i) {
                            var chara = arr[i];
                            if(!camera.isIntersectSpawnRect(chara)) {
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
                        for(var i = arr.length - 1; 0 <= i; --i) {
                            var chara = arr[i];
                            if(chara.isDead()) {
                                arr.splice(i, 1);
                                this.deads.push(chara);
                                scene.world.removeChild(chara);
                                continue;
                            }
                            if(!camera.isOutsideSleepRect(chara)) {
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
                        for(var key in kimiko.DF.MAP_OPTIONS) {
                            mapIds.push(parseInt(key));
                        }
                        var mapIdsIdx = 0;
                        var title = ((function () {
                            var spr = new enchant.Label("KIMIKO'S NIGHTMARE");
                            spr.font = kimiko.DF.FONT_L;
                            spr.color = "rgb(255, 255, 255)";
                            spr.width = kimiko.DF.SC_W;
                            spr.height = 24;
                            spr.textAlign = "center";
                            spr.x = 0;
                            spr.y = 8;
                            return spr;
                        })());
                        var player = ((function () {
                            var spr = new enchant.Sprite();
                            spr.anim.sequence = kimiko.kimiko.getAnimFrames(kimiko.DF.ANIM_ID_CHARA001_WALK);
                            spr.center.x = kimiko.DF.SC_W / 2;
                            spr.y = 240;
                            var ax = spr.x;
                            var ay = spr.y;
                            spr.addEventListener(Event.TOUCH_END, function () {
                                if(0 < spr.tl.queue.length) {
                                    return;
                                }
                                spr.tl.clear().moveTo(ax, ay - 32, kimiko.kimiko.secToFrame(0.1), Easing.CUBIC_EASEOUT).moveTo(ax, ay, kimiko.kimiko.secToFrame(0.1), Easing.CUBIC_EASEIN);
                            });
                            return spr;
                        })());
                        var author = ((function () {
                            var spr = new enchant.Label("created by @osakana4242");
                            spr.font = kimiko.DF.FONT_M;
                            spr.color = "rgb(255, 255, 255)";
                            spr.width = kimiko.DF.SC_W;
                            spr.height = 12;
                            spr.textAlign = "center";
                            spr.x = 0;
                            spr.y = 300;
                            return spr;
                        })());
                        var mapLabel = ((function () {
                            var spr = new enchant.Label();
                            spr.font = kimiko.DF.FONT_L;
                            spr.color = "rgb(255, 255, 255)";
                            spr.width = kimiko.DF.SC_W;
                            spr.height = 24;
                            spr.textAlign = "center";
                            spr.x = 0;
                            spr.y = 80;
                            return spr;
                        })());
                        function updateMapLabel() {
                            mapLabel.text = "MAP" + mapIds[mapIdsIdx];
                        }
                        updateMapLabel();
                        var leftBtn = ((function () {
                            var spr = new enchant.Label("<-");
                            spr.font = kimiko.DF.FONT_L;
                            spr.backgroundColor = "rgb(64, 64, 64)";
                            spr.color = "rgb(255, 255, 0)";
                            spr.textAlign = "center";
                            spr.width = 56;
                            spr.height = 48;
                            spr.x = kimiko.DF.SC_W / 3 * 0 + (spr.width / 2);
                            spr.y = 80;
                            spr.addEventListener(Event.TOUCH_END, prevMap);
                            return spr;
                        })());
                        var rightBtn = ((function () {
                            var spr = new enchant.Label("->");
                            spr.font = kimiko.DF.FONT_L;
                            spr.backgroundColor = "rgb(64, 64, 64)";
                            spr.color = "rgb(255, 255, 0)";
                            spr.textAlign = "center";
                            spr.width = 56;
                            spr.height = 48;
                            spr.x = kimiko.DF.SC_W / 3 * 2 + (spr.width / 2);
                            spr.y = 80;
                            spr.addEventListener(Event.TOUCH_END, nextMap);
                            return spr;
                        })());
                        var startBtn = ((function () {
                            var spr = new enchant.Label("START");
                            spr.font = kimiko.DF.FONT_L;
                            spr.color = "rgb(255, 255, 0)";
                            spr.backgroundColor = "rgb(64, 64, 64)";
                            spr.width = kimiko.DF.SC_W / 2;
                            spr.height = 48;
                            spr.textAlign = "center";
                            spr.x = (kimiko.DF.SC_W - spr.width) / 2;
                            spr.y = 140;
                            spr.addEventListener(Event.TOUCH_END, gotoGameStart);
                            return spr;
                        })());
                        scene.backgroundColor = "rgb( 32, 32, 32)";
                        scene.addChild(player);
                        scene.addChild(title);
                        scene.addChild(author);
                        scene.addChild(mapLabel);
                        scene.addChild(leftBtn);
                        scene.addChild(rightBtn);
                        scene.addChild(startBtn);
                        scene.addEventListener(Event.A_BUTTON_UP, gotoGameStart);
                        scene.addEventListener(Event.LEFT_BUTTON_UP, prevMap);
                        scene.addEventListener(Event.RIGHT_BUTTON_UP, nextMap);
                        var fader = new scenes.Fader(this);
                        fader.setBlack(true);
                        fader.fadeIn(kimiko.kimiko.secToFrame(0.5));
                        function nextMap() {
                            mapIdsIdx = (mapIdsIdx + mapIds.length + 1) % mapIds.length;
                            updateMapLabel();
                        }
                        function prevMap() {
                            mapIdsIdx = (mapIdsIdx + mapIds.length - 1) % mapIds.length;
                            updateMapLabel();
                        }
                        function gotoGameStart() {
                            var pd = kimiko.kimiko.playerData;
                            pd.reset();
                            pd.mapId = mapIds[mapIdsIdx];
                            fader.fadeOut(kimiko.kimiko.secToFrame(0.3), function () {
                                kimiko.kimiko.core.replaceScene(new kimiko.scenes.GameStart());
                            });
                        }
                        ;
                    }
                });
                scenes.GameStart = Class.create(Scene, {
                    initialize: function () {
                        Scene.call(this);
                        var scene = this;
                        var bg1 = new enchant.Sprite(kimiko.DF.SC1_W, kimiko.DF.SC1_H);
                        ((function (sprite) {
                            sprite.x = 0;
                            sprite.y = 0;
                            sprite.image = kimiko.kimiko.core.assets[kimiko.Assets.IMAGE_GAME_START_BG];
                        })(bg1));
                        var label1 = new enchant.Label("GOOD NIGHT...");
                        ((function (label) {
                            label.font = kimiko.DF.FONT_M;
                            label.width = kimiko.DF.SC_W;
                            label.height = 12;
                            label.color = "rgb(255, 255, 255)";
                            label.textAlign = "center";
                            var ax = (kimiko.DF.SC1_W - label.width) / 2;
                            var ay = (kimiko.DF.SC1_H - label.height) / 2;
                            label.x = ax;
                            label.y = ay;
                            label.tl.moveTo(ax + 0, ay + 8, kimiko.kimiko.secToFrame(1.0), Easing.SIN_EASEINOUT).moveTo(ax + 0, ay - 8, kimiko.kimiko.secToFrame(1.0), Easing.SIN_EASEINOUT).loop();
                        })(label1));
                        var fader = new scenes.Fader(this);
                        var layer1 = new enchant.Group();
                        layer1.addChild(bg1);
                        layer1.addChild(label1);
                        scene.backgroundColor = "rgb(0, 0, 0)";
                        scene.addChild(layer1);
                        ((function () {
                            var next = function () {
                                fader.fadeOut2(kimiko.kimiko.secToFrame(1.0), new osakana4242.utils.Vector2D(242, 156), function () {
                                    kimiko.kimiko.core.replaceScene(kimiko.kimiko.gameScene);
                                });
                            };
                            fader.setBlack(true);
                            scene.tl.then(function () {
                                fader.fadeIn(kimiko.kimiko.secToFrame(0.5));
                            }).delay(kimiko.kimiko.secToFrame(0.5)).delay(kimiko.kimiko.secToFrame(2.0)).then(next);
                            scene.addEventListener(Event.TOUCH_END, next);
                            scene.addEventListener(Event.A_BUTTON_UP, next);
                        })());
                    }
                });
                scenes.Pause = Class.create(Scene, {
                    initialize: function () {
                        Scene.call(this);
                        var scene = this;
                        var bg = ((function () {
                            var spr = new enchant.Sprite(kimiko.DF.SC_W, kimiko.DF.SC_H);
                            spr.backgroundColor = "#000";
                            spr.opacity = 0.5;
                            return spr;
                        })());
                        var label1 = ((function () {
                            var label = new enchant.Label("PAUSE");
                            label.font = kimiko.DF.FONT_M;
                            label.width = kimiko.DF.SC_W;
                            label.height = 12;
                            label.color = "rgb(255, 255, 255)";
                            label.textAlign = "center";
                            label.x = 0;
                            label.y = 60;
                            label.tl.moveBy(0, -8, kimiko.kimiko.secToFrame(1.0), Easing.SIN_EASEINOUT).moveBy(0, 8, kimiko.kimiko.secToFrame(1.0), Easing.SIN_EASEINOUT).loop();
                            return label;
                        })());
                        var label2 = ((function () {
                            var label = new enchant.Label("GOTO TITLE");
                            label.font = kimiko.DF.FONT_M;
                            label.width = kimiko.DF.SC_W / 2;
                            label.height = 48;
                            label.backgroundColor = "#444";
                            label.color = "#ff0";
                            label.textAlign = "center";
                            label.x = (kimiko.DF.SC_W - label.width) / 2;
                            label.y = 90;
                            label.addEventListener(Event.TOUCH_END, function () {
                                kimiko.kimiko.gameScene.state = kimiko.kimiko.gameScene.stateGameStart;
                                kimiko.kimiko.core.replaceScene(new kimiko.scenes.Title());
                            });
                            return label;
                        })());
                        var label3 = ((function () {
                            var label = new enchant.Label("CONTINUE");
                            label.font = kimiko.DF.FONT_M;
                            label.width = kimiko.DF.SC_W / 2;
                            label.height = 48;
                            label.backgroundColor = "#444";
                            label.color = "#ff0";
                            label.textAlign = "center";
                            label.x = (kimiko.DF.SC_W - label.width) / 2;
                            label.y = 180;
                            label.addEventListener(Event.TOUCH_END, function () {
                                kimiko.kimiko.core.popScene();
                            });
                            return label;
                        })());
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
                        var label1 = new enchant.Label("GAME OVER");
                        ((function (label) {
                            label.font = kimiko.DF.FONT_M;
                            label.width = kimiko.DF.SC_W;
                            label.height = 12;
                            label.color = "rgb(255, 255, 255)";
                            label.textAlign = "center";
                            var ax = (kimiko.DF.SC1_W - label.width) / 2;
                            var ay = (kimiko.DF.SC1_H - label.height) / 2;
                            label.x = ax;
                            label.y = ay;
                            label.tl.moveTo(ax + 0, ay + 8, kimiko.kimiko.secToFrame(1.0), Easing.SIN_EASEINOUT).moveTo(ax + 0, ay - 8, kimiko.kimiko.secToFrame(1.0), Easing.SIN_EASEINOUT).loop();
                        })(label1));
                        var layer1 = new enchant.Group();
                        layer1.addChild(label1);
                        scene.addChild(layer1);
                        scene.addEventListener(Event.TOUCH_END, function () {
                            kimiko.kimiko.core.popScene();
                        });
                    }
                });
                scenes.GameClear = Class.create(Scene, {
                    initialize: function () {
                        Scene.call(this);
                        var scene = this;
                        var pd = kimiko.kimiko.playerData;
                        var label1 = new enchant.Label("GAME CLEAR!");
                        ((function (label) {
                            label.font = kimiko.DF.FONT_M;
                            label.width = kimiko.DF.SC_W;
                            label.height = 12;
                            label.color = "rgb(255, 255, 255)";
                            label.textAlign = "center";
                            var ax = (kimiko.DF.SC1_W - label.width) / 2;
                            var ay = 32 + 24 * 1;
                            label.x = ax;
                            label.y = ay - 8;
                            label.tl.hide().delay(kimiko.kimiko.secToFrame(0.5)).show().moveTo(ax, ay, kimiko.kimiko.secToFrame(0.5), Easing.SIN_EASEOUT);
                        })(label1));
                        var label2 = new enchant.Label("REST TIME " + Math.floor(kimiko.kimiko.frameToSec(pd.restTimeCounter)));
                        ((function (label) {
                            label.font = kimiko.DF.FONT_M;
                            label.width = kimiko.DF.SC_W;
                            label.height = 12;
                            label.color = "rgb(255, 255, 255)";
                            label.textAlign = "center";
                            var ax = (kimiko.DF.SC1_W - label.width) / 2;
                            var ay = 32 + 24 * 2;
                            label.x = ax;
                            label.y = ay - 8;
                            label.tl.hide().delay(kimiko.kimiko.secToFrame(1.0)).show().moveTo(ax, ay, kimiko.kimiko.secToFrame(0.5), Easing.SIN_EASEOUT);
                        })(label2));
                        var label3 = new enchant.Label("SCORE " + pd.score);
                        ((function (label) {
                            label.font = kimiko.DF.FONT_M;
                            label.width = kimiko.DF.SC_W;
                            label.height = 12;
                            label.color = "rgb(255, 255, 255)";
                            label.textAlign = "center";
                            var ax = (kimiko.DF.SC1_W - label.width) / 2;
                            var ay = 32 + 24 * 3;
                            label.x = ax;
                            label.y = ay - 8;
                            label.tl.hide().delay(kimiko.kimiko.secToFrame(1.5)).show().moveTo(ax, ay, kimiko.kimiko.secToFrame(0.5), Easing.SIN_EASEOUT);
                        })(label3));
                        var layer1 = new enchant.Group();
                        layer1.addChild(label1);
                        layer1.addChild(label2);
                        layer1.addChild(label3);
                        scene.addChild(layer1);
                        scene.tl.delay(kimiko.kimiko.secToFrame(3.0)).waitUntil(function () {
                            if(pd.restTimeCounter < kimiko.kimiko.secToFrame(1)) {
                                return true;
                            }
                            pd.restTimeCounter -= kimiko.kimiko.secToFrame(1);
                            pd.score += Math.floor(10);
                            label2.text = "REST TIME " + Math.floor(kimiko.kimiko.frameToSec(pd.restTimeCounter));
                            label3.text = "SCORE " + pd.score;
                            return false;
                        });
                        scene.addEventListener(Event.TOUCH_END, function () {
                            kimiko.kimiko.core.popScene();
                            kimiko.kimiko.core.replaceScene(new scenes.Title());
                        });
                    }
                });
                scenes.Act = Class.create(Scene, {
                    initialize: function () {
                        var _this = this;
                        Scene.call(this);
                        var scene = this;
                        this.state = this.stateGameStart;
                        this.gameOverFrameMax = 0;
                        this.gameOverFrameCounter = this.gameOverFrameMax;
                        this.celarFrameMax = 0;
                        this.clearFrameCounter = this.clearFrameMax;
                        this.statusTexts = [
                            [], 
                            [], 
                            [], 
                            [], 
                            
                        ];
                        this.backgroundColor = "rgb(32, 32, 64)";
                        var sprite;
                        var world = new enchant.Group();
                        this.world = world;
                        scene.addChild(world);
                        var map = new enchant.Map(kimiko.DF.MAP_TILE_W, kimiko.DF.MAP_TILE_H);
                        this.map = map;
                        this.mapOption = {
                        };
                        map.image = kimiko.kimiko.core.assets[kimiko.Assets.IMAGE_MAP];
                        map.x = 0;
                        map.y = 0;
                        if(map._style) {
                            map._style.zIndex = -1;
                        }
                        world.addChild(map);
                        var camera = new scenes.Camera();
                        this.camera = camera;
                        camera.targetGroup = world;
                        world.addChild(camera);
                        sprite = new scenes.Player();
                        this.player = sprite;
                        world.addChild(sprite);
                        sprite.x = 0;
                        sprite.y = this.map.height - sprite.height;
                        ((function () {
                            var bg = ((function () {
                                var spr = new enchant.Sprite(kimiko.DF.SC2_W, kimiko.DF.SC2_H);
                                _this.controllArea = spr;
                                spr.x = 0;
                                spr.y = 0;
                                spr.backgroundColor = "rgb(64, 64, 64)";
                                return spr;
                            })());
                            _this.labels = [];
                            var texts = _this.statusTexts;
                            for(var i = 0, iNum = texts.length; i < iNum; ++i) {
                                sprite = new Label("");
                                _this.labels.push(sprite);
                                sprite.font = kimiko.DF.FONT_M;
                                sprite.color = "#fff";
                                sprite.y = 12 * i;
                            }
                            var btnPause = ((function () {
                                var spr = new enchant.Label("P");
                                spr.font = kimiko.DF.FONT_M;
                                spr.color = "#ff0";
                                spr.backgroundColor = "#000";
                                spr.width = 48;
                                spr.height = 48;
                                spr.textAlign = "center";
                                spr.x = kimiko.DF.SC2_W - 56;
                                spr.y = kimiko.DF.SC2_H - 56;
                                spr.addEventListener(Event.TOUCH_END, function () {
                                    kimiko.kimiko.core.pushScene(kimiko.kimiko.pauseScene);
                                });
                                return spr;
                            })());
                            var group = new enchant.Group();
                            _this.statusGroup = group;
                            group.x = kimiko.DF.SC2_X1;
                            group.y = kimiko.DF.SC2_Y1;
                            group.addChild(bg);
                            for(var i = 0, iNum = _this.labels.length; i < iNum; ++i) {
                                group.addChild(_this.labels[i]);
                            }
                            group.addChild(btnPause);
                            _this.addChild(group);
                        })());
                        this.ownBulletPool = new osakana4242.utils.SpritePool(kimiko.DF.PLAYER_BULLET_NUM, function () {
                            var spr = new scenes.OwnBullet();
                            return spr;
                        });
                        this.enemyBulletPool = new osakana4242.utils.SpritePool(32, function () {
                            var spr = new scenes.EnemyBullet();
                            return spr;
                        });
                        this.effectPool = new osakana4242.utils.SpritePool(64, function () {
                            var spr = new enchant.Sprite(16, 16);
                            spr.ageMax = 0;
                            spr.anim.loopListener = function () {
                                _this.effectPool.free(spr);
                            };
                            return spr;
                        });
                        this.mapCharaMgr = new MapCharaManager(this);
                        this.touch = new osakana4242.utils.Touch();
                        this.fader = new scenes.Fader(this);
                        this.fader.setBlack(true);
                        this.fader.fadeOut(0);
                    },
                    initPlayerStatus: function () {
                        var scene = this;
                        var pd = kimiko.kimiko.playerData;
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
                        if(this.player.parentNode) {
                            this.player.parentNode.removeChild(this.player);
                        }
                    },
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
                        var player = this.player;
                        player.force.x = 0;
                        player.force.y = 0;
                        if(Math.abs(touch.totalDiff.x) + Math.abs(touch.totalDiff.y) < 16) {
                            player.attack();
                        }
                        player.useGravity = true;
                    },
                    onenterframe: function () {
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
                        this.loadMapData(jp.osakana4242.kimiko["mapData" + kimiko.kimiko.playerData.mapId]);
                        scene.fader.setBlack(true);
                        var player = scene.player;
                        var camera = scene.camera;
                        scene.fader.fadeIn2(kimiko.kimiko.secToFrame(0.2), camera.getTargetPosOnCamera());
                        scene.state = scene.stateNormal;
                        if(kimiko.kimiko.config.isSoundEnabled) {
                            var sound = kimiko.kimiko.core.assets[kimiko.Assets.SOUND_BGM];
                            var soundSec = 15.922 + 0.5;
                            var replay = function () {
                                sound.play();
                                if(!scene.state === scene.stateNormal) {
                                    return;
                                }
                                window.setTimeout(replay, Math.floor(soundSec * 1000));
                            };
                            replay();
                        }
                    },
                    stateNormal: function () {
                        var player = this.player;
                        var mapCharaMgr = this.mapCharaMgr;
                        mapCharaMgr.step();
                        this.checkCollision();
                        if(this.gameOverFrameCounter < this.gameOverFrameMax) {
                            ++this.gameOverFrameCounter;
                            if(this.gameOverFrameMax <= this.gameOverFrameCounter) {
                                this.state = this.stateGameOver;
                            }
                        } else if(this.clearFrameCounter < this.clearFrameMax) {
                            ++this.clearFrameCounter;
                            if(this.clearFrameMax <= this.clearFrameCounter) {
                                this.state = this.stateGameClear;
                            }
                        } else if(this.countTimeLimit()) {
                            this.state = this.stateGameOver;
                        }
                    },
                    stateGameOver: function () {
                        var pd = kimiko.kimiko.playerData;
                        pd.reset();
                        kimiko.kimiko.core.pushScene(new scenes.GameOver());
                        this.state = this.stateGameStart;
                    },
                    stateGameClear: function () {
                        var _this = this;
                        var pd = kimiko.kimiko.playerData;
                        pd.hp = this.player.life.hp;
                        var mapOption = this.mapOption;
                        if(mapOption.nextMapId === 0) {
                            kimiko.kimiko.core.pushScene(new scenes.GameClear());
                            this.state = this.stateGameStart;
                        } else {
                            pd.mapId = mapOption.nextMapId;
                            pd.restTimeCounter += pd.restTimeMax;
                            this.state = this.stateWait;
                            var player = this.player;
                            var camera = this.camera;
                            this.fader.fadeOut2(kimiko.kimiko.secToFrame(0.5), camera.getTargetPosOnCamera(), function () {
                                _this.state = _this.stateGameStart;
                            });
                        }
                    },
                    loadMapData: function (mapData) {
                        var _this = this;
                        var map = this.map;
                        var mapOption = kimiko.DF.MAP_OPTIONS[kimiko.kimiko.playerData.mapId];
                        for(var key in mapOption) {
                            this.mapOption[key] = mapOption[key];
                        }
                        this.backgroundColor = mapOption.backgroundColor;
                        function cloneTiles(tiles) {
                            var a = [];
                            for(var y = 0, yNum = tiles.length; y < yNum; ++y) {
                                a.push(tiles[y].slice(0));
                            }
                            return a;
                        }
                        function eachTiles(tiles, func) {
                            for(var y = 0, yNum = tiles.length; y < yNum; ++y) {
                                for(var x = 0, xNum = tiles[y].length; x < xNum; ++x) {
                                    func(tiles[y][x], x, y, tiles);
                                }
                            }
                        }
                        ((function () {
                            var mapWork = {
                            };
                            mapWork.groundTilesOrig = mapData.layers[0].tiles;
                            mapWork.groundTiles = cloneTiles(mapWork.groundTilesOrig);
                            _this.mapWork = mapWork;
                            var tiles = mapWork.groundTiles;
                            eachTiles(tiles, function (tile, x, y, tiles) {
                                if(tile === kimiko.DF.MAP_TILE_DOOR_OPEN) {
                                    tiles[y][x] = kimiko.DF.MAP_TILE_DOOR_CLOSE;
                                }
                            });
                            var collisionData = [];
                            for(var y = 0, yNum = tiles.length; y < yNum; ++y) {
                                var line = [];
                                for(var x = 0, xNum = tiles[y].length; x < xNum; ++x) {
                                    var tile = tiles[y][x];
                                    line.push(kimiko.DF.MAP_TILE_COLLISION_MIN <= tile && tile <= kimiko.DF.MAP_TILE_COLLISION_MAX);
                                }
                                collisionData.push(line);
                            }
                            map.loadData(tiles);
                            map.collisionData = collisionData;
                        })());
                        ((function () {
                            var mapCharaMgr = _this.mapCharaMgr;
                            var layer = mapData.layers[1];
                            eachTiles(layer.tiles, function (charaId, x, y, tiles) {
                                if(charaId === -1) {
                                    return;
                                }
                                var left = x * kimiko.DF.MAP_TILE_W;
                                var top = y * kimiko.DF.MAP_TILE_H;
                                if(charaId === kimiko.DF.MAP_TILE_PLAYER_POS) {
                                    var player = _this.player;
                                    player.x = left + (kimiko.DF.MAP_TILE_W - player.width) / 2;
                                    player.y = top + (kimiko.DF.MAP_TILE_H - player.height);
                                } else if(kimiko.DF.MAP_TILE_CHARA_MIN <= charaId) {
                                    var enemyId = charaId - kimiko.DF.MAP_TILE_CHARA_MIN;
                                    var data = scenes.EnemyData[enemyId];
                                    var enemy = new scenes.EnemyA();
                                    enemy.enemyId = enemyId;
                                    enemy.life.hpMax = data.hpMax;
                                    enemy.life.hp = enemy.life.hpMax;
                                    data.body(enemy);
                                    var center = left + (enemy.width / 2);
                                    var bottom = top + (kimiko.DF.MAP_TILE_H - enemy.height);
                                    enemy.x = enemy.anchor.x = center;
                                    enemy.y = enemy.anchor.y = bottom;
                                    data.brain(enemy);
                                    mapCharaMgr.addSleep(enemy);
                                }
                            });
                        })());
                        var camera = this.camera;
                        camera.limitRect.x = 0;
                        camera.limitRect.y = 0;
                        camera.limitRect.width = map.width;
                        camera.limitRect.height = map.height + (kimiko.DF.SC1_H / 2);
                        var player = this.player;
                        osakana4242.utils.Rect.copyFrom(player.limitRect, camera.limitRect);
                        player.startMap();
                        camera.targetNode = player;
                        camera.moveToTarget();
                    },
                    addEffect: function (animId, pos) {
                        var effect = this.scene.effectPool.alloc();
                        if(effect === null) {
                            return;
                        }
                        effect.anim.sequence = kimiko.kimiko.getAnimFrames(animId);
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
                        player.tl.moveBy(dx * 96 * 0.25, -96 * 0.8, kimiko.kimiko.secToFrame(0.2), Easing.LINEAR).moveBy(dx * 96 * 0.25, -96 * 0.2, kimiko.kimiko.secToFrame(0.2), Easing.LINEAR).moveBy(dx * 96 * 0.25, 32 * 0.2, kimiko.kimiko.secToFrame(0.3), Easing.LINEAR).moveBy(dx * 96 * 0.25, 32 * 0.8, kimiko.kimiko.secToFrame(0.3), Easing.LINEAR).hide();
                        scene.gameOverFrameMax = kimiko.kimiko.secToFrame(1.0);
                        scene.gameOverFrameCounter = 0;
                    },
                    onAllEnemyDead: function () {
                        var scene = this;
                        var mapOption = scene.mapOption;
                        switch(mapOption.exitType) {
                            case "door":
                                scene.map.loadData(scene.mapWork.groundTilesOrig);
                                break;
                            case "enemy_zero":
                                scene.clearFrameMax = kimiko.kimiko.secToFrame(3.0);
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
                        for(var i = 0, iNum = enemys.length; i < iNum; ++i) {
                            var enemy = enemys[i];
                            if(enemy.isDead()) {
                                continue;
                            }
                            if(!osakana4242.utils.Rect.intersect(searchRect, enemy)) {
                                continue;
                            }
                            var sqrDistance = osakana4242.utils.Rect.distance(sprite, enemy);
                            if(near === null) {
                                near = enemy;
                                nearSqrDistance = sqrDistance;
                            } else if(sqrDistance < nearSqrDistance) {
                                near = enemy;
                                nearSqrDistance = sqrDistance;
                            }
                        }
                        return near;
                    },
                    newEnemyBullet: function () {
                        var bullet = this.enemyBulletPool.alloc();
                        if(!bullet) {
                            return null;
                        }
                        bullet.ageMax = kimiko.kimiko.secToFrame(5);
                        this.world.addChild(bullet);
                        return bullet;
                    },
                    newOwnBullet: function () {
                        var bullet = this.ownBulletPool.alloc();
                        if(!bullet) {
                            return null;
                        }
                        bullet.ageMax = kimiko.kimiko.secToFrame(0.4);
                        this.world.addChild(bullet);
                        return bullet;
                    },
                    intersectActiveArea: function (sprite) {
                        var player = this.player;
                        var minX = player.center.x - kimiko.DF.SC1_W;
                        var maxX = player.center.x + kimiko.DF.SC1_W;
                        if(minX <= sprite.center.x && sprite.center.x <= maxX) {
                            return true;
                        }
                        return false;
                    },
                    countTimeLimit: function () {
                        var pd = kimiko.kimiko.playerData;
                        if(pd.restTimeCounter <= 0) {
                            return true;
                        }
                        --pd.restTimeCounter;
                        return pd.restTimeCounter <= 0;
                    },
                    updateStatusText: function () {
                        var scene = this;
                        var player = this.player;
                        var pd = kimiko.kimiko.playerData;
                        var mapCharaMgr = this.mapCharaMgr;
                        var texts = this.statusTexts;
                        var lifeText = osakana4242.utils.StringUtil.mul("o", player.life.hp) + osakana4242.utils.StringUtil.mul("_", player.life.hpMax - player.life.hp);
                        texts[0][0] = "SC " + kimiko.kimiko.playerData.score + " " + "TIME " + Math.floor(kimiko.kimiko.frameToSec(pd.restTimeCounter));
                        texts[1][0] = "LIFE " + lifeText + " " + "WALL " + player.wallPushDir.x + "," + player.wallPushDir.y + " " + (player.targetEnemy ? "LOCK" : "    ") + " " + "";
                        for(var i = 0, iNum = texts.length; i < iNum; ++i) {
                            var line = texts[i].join(" ");
                            this.labels[i].text = line;
                        }
                    },
                    checkMapCollision: function (player, onTrim, onIntersect) {
                        var collider = player.collider;
                        var prect = collider.getRect();
                        var map = this.map;
                        var xDiff = map.tileWidth;
                        var yDiff = map.tileHeight;
                        var xMin = prect.x;
                        var yMin = prect.y;
                        var xMax = prect.x + prect.width + (xDiff - 1);
                        var yMax = prect.y + prect.height + (yDiff - 1);
                        var hoge = 8;
                        var rect = osakana4242.utils.Rect.alloc();
                        try  {
                            for(var y = yMin; y < yMax; y += yDiff) {
                                for(var x = xMin; x < xMax; x += xDiff) {
                                    rect.reset(Math.floor(x / map.tileWidth) * map.tileWidth, Math.floor(y / map.tileHeight) * map.tileHeight, map.tileWidth, map.tileHeight);
                                    if(!osakana4242.utils.Rect.intersect(prect, rect)) {
                                        continue;
                                    }
                                    if(onIntersect) {
                                        onIntersect.call(player, map.checkTile(x, y), x, y);
                                    }
                                    if(!map.hitTest(x, y)) {
                                        continue;
                                    }
                                    if(!map.hitTest(x, y - yDiff) && 0 <= player.force.y && prect.y <= rect.y + hoge) {
                                        player.y = rect.y - prect.height - collider.rect.y;
                                        onTrim.call(player, 0, 1);
                                        player.force.y = 0;
                                    } else if(!map.hitTest(x, y + yDiff) && player.force.y <= 0 && rect.y + rect.height - hoge < prect.y + prect.height) {
                                        player.y = rect.y + rect.height - collider.rect.y;
                                        onTrim.call(player, 0, -1);
                                        player.force.y = 0;
                                    } else if(!map.hitTest(x - xDiff, y) && 0 <= player.force.x && prect.x <= rect.x + hoge) {
                                        player.x = rect.x - prect.width - collider.rect.x;
                                        onTrim.call(player, 1, 0);
                                    } else if(!map.hitTest(x + xDiff, y) && player.force.x <= 0 && rect.x + rect.width - hoge < prect.x + prect.width) {
                                        player.x = rect.x + rect.width - collider.rect.x;
                                        onTrim.call(player, -1, 0);
                                    }
                                    if(!player.parentNode) {
                                        return;
                                    }
                                }
                            }
                        }finally {
                            osakana4242.utils.Rect.free(rect);
                        }
                    },
                    checkCollision: function () {
                        var scene = this;
                        var mapCharaMgr = this.mapCharaMgr;
                        var player = this.player;
                        var enemys = mapCharaMgr.actives;
                        var bullets = this.enemyBulletPool.actives;
                        for(var i = bullets.length - 1; 0 <= i; --i) {
                            var bullet = bullets[i];
                            if(bullet.visible && player.life.canAddDamage() && player.collider.intersect(bullet.collider)) {
                                player.damage(bullet);
                                if(player.life.isDead()) {
                                    this.onPlayerDead();
                                }
                                this.addEffect(kimiko.DF.ANIM_ID_DAMAGE, bullet.center);
                                bullet.free();
                            }
                        }
                        for(var i = enemys.length - 1; 0 <= i; --i) {
                            var enemy = enemys[i];
                            if(player.life.canAddDamage() && player.collider.intersect(enemy.collider)) {
                                player.damage(enemy);
                                if(player.life.isDead()) {
                                    this.onPlayerDead();
                                }
                                this.addEffect(kimiko.DF.ANIM_ID_DAMAGE, player.center);
                            }
                        }
                        for(var i = enemys.length - 1; 0 <= i; --i) {
                            var enemy = enemys[i];
                            var bullets = this.ownBulletPool.actives;
                            for(var j = bullets.length - 1; 0 <= j; --j) {
                                var bullet = bullets[j];
                                if(bullet.visible && enemy.life.canAddDamage() && enemy.collider.intersect(bullet.collider)) {
                                    enemy.damage(bullet);
                                    kimiko.kimiko.playerData.score += 10;
                                    if(enemy.life.isDead()) {
                                        var ed = enemy.getEnemyData();
                                        kimiko.kimiko.playerData.score += ed.score;
                                        if(mapCharaMgr.isAllDead()) {
                                            scene.onAllEnemyDead();
                                        }
                                    }
                                    this.addEffect(kimiko.DF.ANIM_ID_DAMAGE, bullet.center);
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

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
                        sprite.image = kimiko.kimiko.core.assets[kimiko.Assets.IMAGE_CHARA002];
                        sprite.frame = kimiko.kimiko.getAnimFrames(kimiko.DF.ANIM_ID_CHARA002_WALK);
                        sprite.collider.centerBottom(28, 28);
                    }
                    EnemyBodys.body1 = body1;
                    function body2(sprite) {
                        sprite.width = 64;
                        sprite.height = 64;
                        sprite.backgroundColor = "rgb(192, 128, 192)";
                        sprite.collider.centerBottom(60, 60);
                    }
                    EnemyBodys.body2 = body2;
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
                            wp.dir.x = player.x - sprite.x;
                            wp.dir.y = player.y - sprite.y;
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
                            wp.dir.x = player.x - sprite.x;
                            wp.dir.y = player.y - sprite.y;
                            osakana4242.utils.Vector2D.normalize(wp.dir);
                            wp.startFire();
                        }
                        sprite.tl.delay(kimiko.kimiko.secToFrame(0.5)).moveBy(0, -16, kimiko.kimiko.secToFrame(0.2), Easing.CUBIC_EASEOUT).moveBy(0, 16, kimiko.kimiko.secToFrame(0.2), Easing.CUBIC_EASEOUT).moveBy(0, -8, kimiko.kimiko.secToFrame(0.1), Easing.CUBIC_EASEOUT).moveBy(0, 8, kimiko.kimiko.secToFrame(0.1), Easing.CUBIC_EASEOUT).then(fireToPlayer).moveBy(8, 0, kimiko.kimiko.secToFrame(0.5), Easing.CUBIC_EASEOUT).delay(kimiko.kimiko.secToFrame(0.5)).waitUntil(waitFire).then(fireToPlayer).moveBy(8, 0, kimiko.kimiko.secToFrame(0.5), Easing.CUBIC_EASEOUT).delay(kimiko.kimiko.secToFrame(0.5)).waitUntil(waitFire).then(fireToPlayer).moveBy(8, 0, kimiko.kimiko.secToFrame(0.5), Easing.CUBIC_EASEOUT).delay(kimiko.kimiko.secToFrame(0.5)).waitUntil(waitFire).delay(kimiko.kimiko.secToFrame(0.5)).moveTo(sprite.anchor.x, sprite.anchor.y, kimiko.kimiko.secToFrame(0.5), Easing.LINEAR).loop();
                    }
                    EnemyBrains.brain3 = brain3;
                })(scenes.EnemyBrains || (scenes.EnemyBrains = {}));
                var EnemyBrains = scenes.EnemyBrains;
                scenes.EnemyData = {
                    0: {
                        hpMax: 10,
                        body: EnemyBodys.body1,
                        brain: EnemyBrains.brain1,
                        score: 100
                    },
                    1: {
                        hpMax: 10,
                        body: EnemyBodys.body1,
                        brain: EnemyBrains.brain2,
                        score: 100
                    },
                    2: {
                        hpMax: 10,
                        body: EnemyBodys.body1,
                        brain: EnemyBrains.brain3,
                        score: 100
                    },
                    15: {
                        hpMax: 30,
                        body: EnemyBodys.body2,
                        brain: EnemyBrains.brain3,
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
                        this.dir = {
                            x: 1,
                            y: 0
                        };
                        this.speed = kimiko.kimiko.dpsToDpf(60 * 1.0);
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
                        var parent = this.parent;
                        var wayNum = this.wayNum;
                        var degToRad = Math.PI / 180;
                        var degInterval = 90 / wayNum;
                        var startDeg = -degInterval * ((wayNum - 1) / 2);
                        for(var i = 0, iNum = wayNum; i < iNum; ++i) {
                            var bullet = parent.scene.newEnemyBullet();
                            var deg = startDeg + (degInterval * i);
                            var rad = deg * degToRad;
                            var speed = this.speed;
                            bullet.vx = (this.dir.x * Math.cos(rad) - (this.dir.y * Math.sin(rad))) * speed;
                            bullet.vy = (this.dir.y * Math.cos(rad) + (this.dir.x * Math.sin(rad))) * speed;
                            bullet.cx = parent.cx;
                            bullet.cy = parent.cy;
                        }
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
                var Core = enchant.Core;
                var Scene = enchant.Scene;
                var Label = enchant.Label;
                var Event = enchant.Event;
                var Easing = enchant.Easing;
                scenes.Sprite = Class.create(enchant.Sprite, {
                    initialize: function (w, h) {
                        enchant.Sprite.call(this, w, h);
                    },
                    cx: {
                        get: function () {
                            return this.x + this.width / 2;
                        },
                        set: function (v) {
                            this.x = v - this.width / 2;
                        }
                    },
                    cy: {
                        get: function () {
                            return this.y + this.height / 2;
                        },
                        set: function (v) {
                            this.y = v - this.height / 2;
                        }
                    }
                });
                scenes.EnemyBullet = Class.create(scenes.Sprite, {
                    initialize: function () {
                        var _this = this;
                        scenes.Sprite.call(this, 12, 12);
                        this.vx = 0;
                        this.vy = 0;
                        this.collider = ((function () {
                            var c = new osakana4242.utils.Collider();
                            c.parent = _this;
                            c.centerMiddle(4, 4);
                            return c;
                        })());
                        this.backgroundColor = 'rgb(255, 64, 64)';
                        this.tl.scaleTo(1.0, kimiko.kimiko.core.fps * 0.1).scaleTo(0.75, kimiko.kimiko.core.fps * 0.1).loop();
                    },
                    onenterframe: function () {
                        if(!this.visible) {
                            return;
                        }
                        this.x += this.vx;
                        this.y += this.vy;
                        var scene = this.scene;
                        var camera = this.scene.camera;
                        if(camera.isOutsideSleepRect(this)) {
                            this.visible = false;
                            return;
                        }
                        if(!this.scene.intersectActiveArea(this)) {
                            this.visible = false;
                            return;
                        }
                        scene.checkMapCollision(this);
                    },
                    onMapHit: function () {
                        this.visible = false;
                    }
                });
                scenes.OwnBullet = Class.create(scenes.Sprite, {
                    initialize: function () {
                        var _this = this;
                        scenes.Sprite.call(this, 8, 8);
                        this.vx = 0;
                        this.vy = 0;
                        this.visibleCnt = 0;
                        this.collider = ((function () {
                            var c = new osakana4242.utils.Collider();
                            c.parent = _this;
                            c.centerMiddle(8, 8);
                            return c;
                        })());
                        this.backgroundColor = 'rgb(64, 255, 255)';
                        this.tl.scaleTo(0.75, kimiko.kimiko.secToFrame(0.1)).scaleTo(1.0, kimiko.kimiko.secToFrame(0.1)).loop();
                    },
                    onenterframe: function () {
                        if(!this.visible) {
                            return;
                        }
                        this.x += this.vx;
                        this.y += this.vy;
                        var scene = this.scene;
                        var camera = this.scene.camera;
                        ++this.visibleCnt;
                        if(camera.isOutsideSleepRect(this)) {
                            this.visible = false;
                            this.visibleCnt = 0;
                            return;
                        }
                        if(!this.scene.intersectActiveArea(this)) {
                            this.visible = false;
                            this.visibleCnt = 0;
                            return;
                        }
                        scene.checkMapCollision(this);
                    },
                    onMapHit: function () {
                        this.visible = false;
                        this.visibleCnt = 0;
                    }
                });
                var Life = (function () {
                    function Life() {
                        this.hpMax = 100;
                        this.hp = this.hpMax;
                        this.damageFrameMax = kimiko.kimiko.secToFrame(1.0);
                        this.damageFrameCounter = this.damageFrameMax;
                    }
                    Life.prototype.step = function () {
                        if(this.hasDamage()) {
                            ++this.damageFrameCounter;
                        }
                    };
                    Life.prototype.isAlive = function () {
                        return 0 < this.hp;
                    };
                    Life.prototype.isDead = function () {
                        return !this.isAlive();
                    };
                    Life.prototype.hasDamage = function () {
                        return this.damageFrameCounter < this.damageFrameMax;
                    };
                    Life.prototype.damage = function (v) {
                        this.hp -= v;
                        if(this.damageListener) {
                            this.damageListener();
                        }
                    };
                    return Life;
                })();
                scenes.Life = Life;                
                scenes.Attacker = Class.create(scenes.Sprite, {
                    initialize: function () {
                        var _this = this;
                        scenes.Sprite.call(this);
                        this.dirX = 1;
                        this.vx = 0;
                        this.vy = 0;
                        this.attackCnt = 0;
                        this.useGravity = true;
                        this.life = new Life();
                        this.blinkFrameMax = kimiko.kimiko.secToFrame(0.5);
                        this.blinkFrameCounter = this.blinkFrameMax;
                        this.stateNeutral.stateName = "neutral";
                        this.state = this.stateNeutral;
                        this.rectCollider_ = new osakana4242.utils.Rect();
                        this.workRect_ = new osakana4242.utils.Rect();
                        this.addEventListener(Event.ENTER_FRAME, function () {
                            _this.state();
                            _this.life.step();
                            if(_this.blinkFrameCounter < _this.blinkFrameMax) {
                                ++_this.blinkFrameCounter;
                                if(_this.blinkFrameCounter < _this.blinkFrameMax) {
                                    _this.visible = (_this.blinkFrameCounter & 0x1) == 0;
                                } else {
                                    _this.visible = true;
                                }
                            }
                        });
                    },
                    stateToString: function () {
                        var dir = 0 <= this.dirX ? '>' : '<';
                        return ([
                            dir, 
                            this.state.stateName, 
                            'cx', 
                            Math.round(this.cx), 
                            'cy', 
                            Math.round(this.cy)
                        ]).join();
                    },
                    stateNeutral: function () {
                    },
                    stateDamage: function () {
                        if(!this.life.hasDamage()) {
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
                        this.blinkFrameCounter = 0;
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
                        this.parentNode.removeChild(this);
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
                scenes.DeadEffect = Class.create(scenes.Sprite, {
                    initialize: function (attacker, delay) {
                        var _this = this;
                        scenes.Sprite.call(this);
                        this.width = attacker.width;
                        this.height = attacker.height;
                        this.cx = attacker.cx;
                        this.cy = attacker.cy;
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
                scenes.Ground = Class.create(scenes.Sprite, {
                    initialize: function () {
                        scenes.Sprite.call(this);
                        this.width = 96;
                        this.height = 8;
                        this.backgroundColor = 'rgb(128, 128, 128)';
                    }
                });
                scenes.Player = Class.create(scenes.Attacker, {
                    initialize: function () {
                        var _this = this;
                        scenes.Attacker.call(this);
                        this.image = kimiko.kimiko.core.assets[kimiko.Assets.IMAGE_CHARA001];
                        this.animWalk = kimiko.kimiko.getAnimFrames(kimiko.DF.ANIM_ID_CHARA001_WALK);
                        this.animStand = kimiko.kimiko.getAnimFrames(kimiko.DF.ANIM_ID_CHARA001_STAND);
                        this.frame = this.animStand;
                        this.width = 32;
                        this.height = 32;
                        this.collider = ((function () {
                            var c = new osakana4242.utils.Collider();
                            c.parent = _this;
                            c.centerBottom(12, 24);
                            return c;
                        })());
                        this.life.hpMax = kimiko.DF.PLAYER_HP;
                        this.life.hp = this.life.hpMax;
                        this.anchorX = 0;
                        this.anchorY = 0;
                        this.useGravity = true;
                        this.isOnMap = false;
                        this.targetEnemy = null;
                        this.limitRect = new osakana4242.utils.Rect(0, 0, kimiko.DF.SC_W, kimiko.DF.SC_H);
                        this.addEventListener(Event.ENTER_FRAME, function () {
                            _this.stepMove();
                            if(_this.targetEnemy === null) {
                                var scene = _this.scene;
                                if((_this.age % kimiko.kimiko.secToFrame(0.2)) === 0) {
                                    _this.targetEnemy = scene.getNearEnemy(_this, 128 * 128);
                                }
                            } else {
                                if(_this.targetEnemy.life.isDead()) {
                                    _this.targetEnemy = null;
                                }
                                if(_this.targetEnemy !== null) {
                                    var distance = osakana4242.utils.Vector2D.distance(_this, _this.targetEnemy);
                                    distance = osakana4242.utils.Rect.distance(_this, _this.targetEnemy);
                                    var threshold = kimiko.DF.SC_W / 2;
                                    if(threshold < distance) {
                                        _this.targetEnemy = null;
                                    } else {
                                        _this.dirX = kimiko.kimiko.numberUtil.sign(_this.targetEnemy.x - _this.x);
                                        _this.scaleX = _this.dirX;
                                        if((_this.age % kimiko.kimiko.secToFrame(0.2)) === 0) {
                                            if(distance < 128) {
                                                _this.attack();
                                            }
                                        }
                                    }
                                }
                            }
                        });
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
                        bullet.vx = this.dirX * kimiko.kimiko.dpsToDpf(8 * 60);
                        bullet.vy = 0;
                        bullet.cx = this.cx;
                        bullet.cy = this.cy;
                    },
                    stepMove: function () {
                        var scene = this.scene;
                        var input = kimiko.kimiko.core.input;
                        var flag = ((input.left ? 1 : 0) << 0) | ((input.right ? 1 : 0) << 1) | ((input.up ? 1 : 0) << 2) | ((input.down ? 1 : 0) << 3);
                        if(flag !== 0) {
                            this.vx = kimiko.DF.DIR_FLAG_TO_VECTOR2D[flag].x * 4;
                            this.vy = kimiko.DF.DIR_FLAG_TO_VECTOR2D[flag].y * 4;
                        }
                        if(!this.targetEnemy) {
                            if(0 !== this.vx) {
                                this.dirX = kimiko.kimiko.numberUtil.sign(this.vx);
                                this.scaleX = this.dirX;
                            }
                        }
                        if(this.vx !== 0 || this.vy !== 0) {
                            if(this.animWalk !== this.frame) {
                                this.frame = this.animWalk;
                            }
                        } else {
                            if(this.animStand !== this.frame) {
                                this.frame = this.animStand;
                            }
                        }
                        if(this.useGravity && !this.isOnMap) {
                            this.vy += kimiko.kimiko.dpsToDpf(kimiko.DF.GRAVITY);
                        }
                        var moveLimit = 8;
                        var speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                        var loopCnt = Math.floor((speed + moveLimit - 1) / moveLimit);
                        for(var i = 0; i < loopCnt; ++i) {
                            this.x += this.vx / loopCnt;
                            this.y += this.vy / loopCnt;
                            scene.checkMapCollision(this);
                            osakana4242.utils.Rect.trimPos(this, this.limitRect, this.onTrim);
                            if(this.vx === 0 && this.vy === 0) {
                                break;
                            }
                        }
                        var touch = scene.touch;
                        if(touch.isTouching || flag !== 0) {
                            this.vx = 0;
                            this.vy = 0;
                        }
                    },
                    onTrim: function (x, y) {
                        if(x !== 0) {
                            this.vx = 0;
                        }
                        if(y !== 0) {
                            this.vy = 0;
                        }
                    }
                });
                scenes.EnemyA = Class.create(scenes.Attacker, {
                    initialize: function () {
                        var _this = this;
                        scenes.Attacker.call(this);
                        this.enemyId = -1;
                        this.weapon = new scenes.WeaponA(this);
                        this.anchor = new osakana4242.utils.Vector2D();
                        this.collider = new osakana4242.utils.Collider();
                        this.collider.parent = this;
                        this.addEventListener(Event.ENTER_FRAME, function () {
                            _this.weapon.step();
                        });
                    },
                    getEnemyData: function () {
                        return scenes.EnemyData[this.enemyId];
                    },
                    isBoss: function () {
                        return this.enemyId === kimiko.DF.ENEMY_ID_BOSS;
                    }
                });
                var MapCharaManager = (function () {
                    function MapCharaManager(scene) {
                        this.sleeps = [];
                        this.actives = [];
                        this.deads = [];
                        this.scene = scene;
                    }
                    MapCharaManager.prototype.addSleep = function (sleep) {
                        this.sleeps.push(sleep);
                    };
                    MapCharaManager.prototype.step = function () {
                        this.checkSpawn();
                        this.checkSleep();
                    };
                    MapCharaManager.prototype.getAliveCount = function () {
                        return this.sleeps.length + this.actives.length;
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
                var Camera = Class.create(enchant.Node, {
                    initialize: function () {
                        enchant.Node.call(this);
                        this.width = kimiko.DF.SC1_W;
                        this.height = kimiko.DF.SC1_H;
                        this.limitRect = new osakana4242.utils.Rect(0, 0, 320, 320);
                        this.sleepRect = {
                            x: 0,
                            y: 0,
                            width: this.width + 128,
                            height: this.height + 128
                        };
                        this.spawnRect = {
                            x: 0,
                            y: 0,
                            width: this.width + 32,
                            height: this.height + 32
                        };
                        this.targetGroup = null;
                    },
                    onenterframe: function () {
                        var camera = this;
                        var player = this.scene.player;
                        var tx = player.cx - (camera.width / 2) + (player.dirX * 16);
                        var ty = player.cy - (camera.height / 2);
                        var speed = kimiko.kimiko.dpsToDpf(8 * 60);
                        var dx = tx - camera.x;
                        var dy = ty - camera.y;
                        var mx = 0;
                        var my = 0;
                        var distance = osakana4242.utils.Vector2D.magnitude({
                            x: dx,
                            y: dy
                        });
                        if(speed < distance) {
                            mx = dx * speed / distance;
                            my = dy * speed / distance;
                        } else {
                            mx = dx;
                            my = dy;
                        }
                        camera.x = Math.floor(camera.x + mx);
                        camera.y = Math.floor(camera.y + my);
                        osakana4242.utils.Rect.trimPos(camera, camera.limitRect);
                        var group = this.targetGroup;
                        if(group) {
                            group.x = -camera.x;
                            group.y = -camera.y;
                        }
                    },
                    isIntersectSpawnRect: function (entity) {
                        var rect = this.spawnRect;
                        rect.x = this.x - ((rect.width - this.width) / 2);
                        rect.y = this.y - ((rect.height - this.height) / 2);
                        return osakana4242.utils.Rect.inside(rect, entity);
                    },
                    isOutsideSleepRect: function (entity) {
                        var rect = this.sleepRect;
                        rect.x = this.x - ((rect.width - this.width) / 2);
                        rect.y = this.y - ((rect.height - this.height) / 2);
                        return osakana4242.utils.Rect.outside(rect, entity);
                    }
                });
                scenes.GameStart = Class.create(Scene, {
                    initialize: function () {
                        Scene.call(this);
                        var scene = this;
                        var bg1 = new scenes.Sprite(kimiko.DF.SC1_W, kimiko.DF.SC1_H);
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
                        var fadeFilm = new scenes.Sprite(kimiko.DF.SC_W, kimiko.DF.SC_H);
                        ((function (sprite) {
                            sprite.x = 0;
                            sprite.y = 0;
                            sprite.backgroundColor = "rgb(0, 0, 0)";
                        })(fadeFilm));
                        var layer1 = new enchant.Group();
                        layer1.addChild(bg1);
                        layer1.addChild(label1);
                        scene.backgroundColor = "rgb(0, 0, 0)";
                        scene.addChild(layer1);
                        scene.addChild(fadeFilm);
                        ((function () {
                            var next = function () {
                                kimiko.kimiko.core.replaceScene(new kimiko.scenes.Act());
                            };
                            scene.tl.then(function () {
                                fadeFilm.tl.fadeTo(0.0, kimiko.kimiko.secToFrame(0.5));
                            }).delay(kimiko.kimiko.secToFrame(0.5)).delay(kimiko.kimiko.secToFrame(2.0)).then(function () {
                                fadeFilm.tl.fadeTo(1.0, kimiko.kimiko.secToFrame(0.5));
                            }).delay(kimiko.kimiko.secToFrame(0.5)).then(next);
                            scene.addEventListener(Event.TOUCH_END, next);
                            scene.addEventListener(Event.A_BUTTON_UP, next);
                        })());
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
                    }
                });
                scenes.GameClear = Class.create(Scene, {
                    initialize: function () {
                        Scene.call(this);
                        var scene = this;
                        var label1 = new enchant.Label("GAME CLEAR!");
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
                    }
                });
                scenes.Act = Class.create(Scene, {
                    initialize: function () {
                        var _this = this;
                        Scene.call(this);
                        var scene = this;
                        this.state = this.stateGameStart;
                        this.score = 0;
                        this.timeLimitCounter = 0;
                        this.timeLimit = kimiko.kimiko.secToFrame(180);
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
                        map.image = kimiko.kimiko.core.assets[kimiko.Assets.IMAGE_MAP];
                        map.x = 0;
                        map.y = 0;
                        if(map._style) {
                            map._style.zIndex = -1;
                        }
                        world.addChild(map);
                        var camera = new Camera();
                        this.camera = camera;
                        camera.targetGroup = world;
                        world.addChild(camera);
                        this.ownBullets = [];
                        for(var i = 0, iNum = kimiko.DF.PLAYER_BULLET_NUM; i < iNum; ++i) {
                            sprite = new scenes.OwnBullet();
                            world.addChild(sprite);
                            this.ownBullets.push(sprite);
                            sprite.visible = false;
                        }
                        this.enemyBullets = [];
                        for(var i = 0, iNum = 32; i < iNum; ++i) {
                            sprite = new scenes.EnemyBullet();
                            world.addChild(sprite);
                            this.enemyBullets.push(sprite);
                            sprite.visible = false;
                        }
                        sprite = new scenes.Player();
                        this.player = sprite;
                        world.addChild(sprite);
                        sprite.x = 0;
                        sprite.y = this.map.height - sprite.height;
                        ((function () {
                            var group = new enchant.Group();
                            _this.statusGroup = group;
                            _this.addChild(group);
                            group.x = kimiko.DF.SC2_X1;
                            group.y = kimiko.DF.SC2_Y1;
                            sprite = new scenes.Sprite(kimiko.DF.SC2_W, kimiko.DF.SC2_H);
                            group.addChild(sprite);
                            _this.controllArea = sprite;
                            sprite.x = 0;
                            sprite.y = 0;
                            sprite.backgroundColor = "rgb(64, 64, 64)";
                            _this.labels = [];
                            var texts = _this.statusTexts;
                            for(var i = 0, iNum = texts.length; i < iNum; ++i) {
                                sprite = new Label("");
                                group.addChild(sprite);
                                _this.labels.push(sprite);
                                sprite.font = kimiko.DF.FONT_M;
                                sprite.color = "#fff";
                                sprite.y = 12 * i;
                            }
                        })());
                        this.mapCharaMgr = new MapCharaManager(this);
                        this.touch = new osakana4242.utils.Touch();
                        this.loadMapData(jp.osakana4242.kimiko["mapData"]);
                    },
                    ontouchstart: function (event) {
                        var touch = this.touch;
                        touch.saveTouchStart(event);
                        var player = this.player;
                        player.anchorX = player.x;
                        player.anchorY = player.y;
                        player.vx = 0;
                        player.vy = 0;
                        player.useGravity = false;
                        player.isOnMap = false;
                    },
                    ontouchmove: function (event) {
                        var touch = this.touch;
                        touch.saveTouchMove(event);
                        var player = this.player;
                        var playerOldX = player.x;
                        var playerOldY = player.y;
                        if(player.animWalk !== player.frame) {
                            player.frame = player.animWalk;
                        }
                        var touchElpsedFrame = touch.getTouchElpsedFrame();
                        touchElpsedFrame = 0;
                        if(touchElpsedFrame < kimiko.kimiko.secToFrame(0.5)) {
                            var moveLimit = kimiko.DF.TOUCH_TO_CHARA_MOVE_LIMIT;
                            var moveRate = kimiko.DF.TOUCH_TO_CHARA_MOVE_RATE;
                            if(kimiko.DF.PLAYER_TOUCH_ANCHOR_ENABLE) {
                                var tv = new osakana4242.utils.Vector2D(player.anchorX + touch.totalDiff.x * moveRate, player.anchorY + touch.totalDiff.y * moveRate);
                                var v = new osakana4242.utils.Vector2D(tv.x - player.x, tv.y - player.y);
                                var vm = Math.min(osakana4242.utils.Vector2D.magnitude(v), moveLimit);
                                osakana4242.utils.Vector2D.normalize(v);
                                v.x *= vm;
                                v.y *= vm;
                                player.vx = v.x;
                                player.vy = v.y;
                            } else {
                                player.vx = kimiko.kimiko.numberUtil.trim(touch.diff.x * moveRate, -moveLimit, moveLimit);
                                player.vy = kimiko.kimiko.numberUtil.trim(touch.diff.y * moveRate, -moveLimit, moveLimit);
                            }
                        }
                    },
                    ontouchend: function (event) {
                        var touch = this.touch;
                        touch.saveTouchEnd(event);
                        var player = this.player;
                        player.frame = player.animStand;
                        player.vx = 0;
                        player.vy = 0;
                        if(Math.abs(touch.totalDiff.x) + Math.abs(touch.totalDiff.y) < 16) {
                            player.attack();
                        }
                        player.useGravity = true;
                    },
                    onenterframe: function () {
                        this.state();
                        this.updateStatusText();
                    },
                    stateGameStart: function () {
                        var scene = this;
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
                        if(this.countTimeLimit()) {
                            this.state = this.stateGameOver;
                        }
                    },
                    stateGameOver: function () {
                        kimiko.kimiko.core.pushScene(new scenes.GameOver());
                        this.state = this.stateGameStart;
                    },
                    stateGameClear: function () {
                        kimiko.kimiko.core.pushScene(new scenes.GameClear());
                        this.state = this.stateGameStart;
                    },
                    loadMapData: function (mapData) {
                        var _this = this;
                        var map = this.map;
                        this.timeLimit = kimiko.kimiko.secToFrame(180);
                        this.timeLimitCounter = 0;
                        ((function () {
                            var layer = mapData.layers[0];
                            map.loadData(layer.tiles);
                            var collisionData = [];
                            for(var y = 0, yNum = layer.tiles.length; y < yNum; ++y) {
                                var line = [];
                                for(var x = 0, xNum = layer.tiles[y].length; x < xNum; ++x) {
                                    line.push(layer.tiles[y][x] !== -1);
                                }
                                collisionData.push(line);
                            }
                            map.collisionData = collisionData;
                        })());
                        ((function () {
                            var mapCharaMgr = _this.mapCharaMgr;
                            var layer = mapData.layers[1];
                            for(var y = 0, yNum = layer.tiles.length; y < yNum; ++y) {
                                for(var x = 0, xNum = layer.tiles[y].length; x < xNum; ++x) {
                                    var charaId = layer.tiles[y][x];
                                    if(charaId === -1) {
                                        continue;
                                    }
                                    var left = x * kimiko.DF.MAP_TILE_W;
                                    var top = y * kimiko.DF.MAP_TILE_H;
                                    if(charaId === 40) {
                                        var player = _this.player;
                                        player.x = left + (kimiko.DF.MAP_TILE_W - player.width) / 2;
                                        player.y = top + (kimiko.DF.MAP_TILE_H - player.height);
                                    } else if(48 <= charaId) {
                                        var enemyId = charaId - 48;
                                        var data = scenes.EnemyData[enemyId];
                                        var enemy = new scenes.EnemyA();
                                        enemy.enemyId = enemyId;
                                        enemy.life.hpMax = data.hpMax;
                                        enemy.life.hp = enemy.life.hpMax;
                                        data.body(enemy);
                                        var center = left + (enemy.width / 2);
                                        var bottom = top + (kimiko.DF.MAP_TILE_H - enemy.height);
                                        var anchor = new osakana4242.utils.Vector2D(center, bottom);
                                        osakana4242.utils.Vector2D.copyFrom(enemy.anchor, anchor);
                                        enemy.x = anchor.x;
                                        enemy.y = anchor.y;
                                        data.brain(enemy);
                                        mapCharaMgr.addSleep(enemy);
                                    }
                                }
                            }
                        })());
                        var camera = this.camera;
                        camera.limitRect.x = 0;
                        camera.limitRect.y = 0;
                        camera.limitRect.width = map.width;
                        camera.limitRect.height = map.height + (kimiko.DF.SC1_H / 2);
                        var player = this.player;
                        osakana4242.utils.Rect.copyFrom(player.limitRect, camera.limitRect);
                    },
                    onPlayerDead: function () {
                        var scene = this;
                        scene.state = scene.stateGameOver;
                    },
                    onBossDead: function () {
                        var scene = this;
                        scene.state = scene.stateGameClear;
                    },
                    getNearEnemy: function (sprite, sqrDistanceThreshold) {
                        var mapCharaMgr = this.mapCharaMgr;
                        var enemys = mapCharaMgr.actives;
                        var getSqrDistance = function (a, b) {
                            var dx = a.cx - b.cx;
                            var dy = a.cy - b.cy;
                            return (dx * dx) + (dy * dy);
                        };
                        var near = null;
                        var nearSqrDistance = 0;
                        for(var i = 0, iNum = enemys.length; i < iNum; ++i) {
                            var enemy = enemys[i];
                            if(enemy.isDead()) {
                                continue;
                            }
                            var sqrDistance = getSqrDistance(sprite, enemy);
                            if(near === null) {
                                near = enemy;
                                nearSqrDistance = sqrDistance;
                            } else if(sqrDistance < nearSqrDistance) {
                                near = enemy;
                                nearSqrDistance = sqrDistance;
                            }
                        }
                        return nearSqrDistance < sqrDistanceThreshold ? near : null;
                    },
                    newEnemyBullet: function () {
                        var old = null;
                        for(var i = 0, iNum = this.enemyBullets.length; i < iNum; ++i) {
                            var bullet = this.enemyBullets[i];
                            if(!bullet.visible) {
                                bullet.visible = true;
                                return bullet;
                            }
                            old = bullet;
                        }
                        return bullet;
                    },
                    newOwnBullet: function () {
                        var old = null;
                        for(var i = 0, iNum = this.ownBullets.length; i < iNum; ++i) {
                            var bullet = this.ownBullets[i];
                            if(!bullet.visible) {
                                bullet.visible = true;
                                return bullet;
                            }
                            old = bullet;
                        }
                        return null;
                    },
                    intersectActiveArea: function (sprite) {
                        var player = this.player;
                        var minX = player.cx - kimiko.DF.SC1_W;
                        var maxX = player.cx + kimiko.DF.SC1_W;
                        if(minX <= sprite.cx && sprite.cx <= maxX) {
                            return true;
                        }
                        return false;
                    },
                    countTimeLimit: function () {
                        if(this.timeLimit <= this.timeLimitCounter) {
                            return true;
                        }
                        ++this.timeLimitCounter;
                        return this.timeLimit <= this.timeLimitCounter;
                    },
                    updateStatusText: function () {
                        var scene = this;
                        var player = this.player;
                        var mapCharaMgr = this.mapCharaMgr;
                        var texts = this.statusTexts;
                        texts[0][0] = "SC " + scene.score + " " + "TIME " + Math.floor(kimiko.kimiko.frameToSec(this.timeLimit - this.timeLimitCounter));
                        texts[1][0] = "LIFE " + player.life.hp;
                        for(var i = 0, iNum = texts.length; i < iNum; ++i) {
                            var line = texts[i].join(" ");
                            this.labels[i].text = line;
                        }
                    },
                    checkMapCollision: function (player) {
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
                        var isHit = false;
                        for(var y = yMin; y < yMax; y += yDiff) {
                            for(var x = xMin; x < xMax; x += xDiff) {
                                if(!map.hitTest(x, y)) {
                                    continue;
                                }
                                var rect = new osakana4242.utils.Rect(Math.floor(x / map.tileWidth) * map.tileWidth, Math.floor(y / map.tileHeight) * map.tileHeight, map.tileWidth, map.tileHeight);
                                if(!osakana4242.utils.Rect.intersect(prect, rect)) {
                                    continue;
                                }
                                if(!map.hitTest(x, y - yDiff) && 0 <= player.vy && prect.y <= rect.y + hoge) {
                                    player.y = rect.y - prect.height - collider.rect.y;
                                    player.vy = 0;
                                    isHit = true;
                                } else if(!map.hitTest(x, y + yDiff) && player.vy <= 0 && rect.y + rect.height - hoge < prect.y + prect.height) {
                                    player.y = rect.y + rect.height - collider.rect.y;
                                    player.vy = 0;
                                    isHit = true;
                                } else if(!map.hitTest(x - xDiff, y) && 0 <= player.vx && prect.x <= rect.x + hoge) {
                                    player.x = rect.x - prect.width - collider.rect.x;
                                    player.vx = 0;
                                    isHit = true;
                                } else if(!map.hitTest(x + xDiff, y) && player.vx <= 0 && rect.x + rect.width - hoge < prect.x + prect.width) {
                                    player.x = rect.x + rect.width - collider.rect.x;
                                    player.vx = 0;
                                    isHit = true;
                                }
                            }
                        }
                        if(isHit && player.onMapHit) {
                            player.onMapHit();
                        }
                    },
                    checkCollision: function () {
                        var scene = this;
                        var mapCharaMgr = this.mapCharaMgr;
                        var player = this.player;
                        var enemys = mapCharaMgr.actives;
                        if(player.isNeutral() || player.isAttack()) {
                            for(var i = 0, iNum = this.enemyBullets.length; i < iNum; ++i) {
                                var bullet = this.enemyBullets[i];
                                if(bullet.visible && player.life.isAlive() && player.collider.intersect(bullet.collider)) {
                                    player.damage(bullet);
                                    bullet.visible = false;
                                    if(player.life.isDead()) {
                                        this.onPlayerDead();
                                    }
                                }
                            }
                        }
                        for(var i = 0, iNum = enemys.length; i < iNum; ++i) {
                            var enemy = enemys[i];
                            if(enemy.isDead() || enemy.isDamage()) {
                                continue;
                            }
                            for(var j = 0, jNum = this.ownBullets.length; j < jNum; ++j) {
                                var bullet = this.ownBullets[j];
                                if(bullet.visible && enemy.life.isAlive() && enemy.collider.intersect(bullet.collider)) {
                                    enemy.damage(bullet);
                                    scene.score += 10;
                                    if(enemy.life.isDead()) {
                                        var ed = enemy.getEnemyData();
                                        scene.score += ed.score;
                                        if(enemy.isBoss()) {
                                            scene.onBossDead();
                                        }
                                    }
                                    bullet.visible = false;
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
        (function (utils) {
            var Vector2D = (function () {
                function Vector2D(x, y) {
                    if (typeof x === "undefined") { x = 0; }
                    if (typeof y === "undefined") { y = 0; }
                    this.x = x;
                    this.y = y;
                }
                Vector2D.hoge = function hoge() {
                };
                Vector2D.copyFrom = function copyFrom(dest, src) {
                    dest.x = src.x;
                    dest.y = src.y;
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
                }
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
                        ownRect.x = limitRect.width - ownRect.width;
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
                        ownRect.y = limitRect.height - ownRect.height;
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
                Touch.prototype.getTouchElpsedFrame = function () {
                    return enchant.Core.instance.frame - this.startFrame;
                };
                return Touch;
            })();
            utils.Touch = Touch;            
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
                DF.PLAYER_COLOR = "rgb(240, 240, 240)";
                DF.PLAYER_DAMAGE_COLOR = "rgb(240, 240, 120)";
                DF.PLAYER_ATTACK_COLOR = "rgb(160, 160, 240)";
                DF.ENEMY_COLOR = "rgb(120, 80, 120)";
                DF.ENEMY_DAMAGE_COLOR = "rgb(240, 16, 240)";
                DF.ENEMY_ATTACK_COLOR = "rgb(240, 16, 16)";
                DF.ENEMY_ID_BOSS = 0xf;
                DF.ANIM_ID_CHARA001_WALK = 10;
                DF.ANIM_ID_CHARA001_STAND = 11;
                DF.ANIM_ID_CHARA002_WALK = 20;
                DF.TOUCH_TO_CHARA_MOVE_RATE = 1.5;
                DF.TOUCH_TO_CHARA_MOVE_LIMIT = 320;
                DF.PLAYER_HP = 5;
                DF.PLAYER_BULLET_NUM = 2;
                DF.FONT_M = '12px Verdana,"ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","ＭＳ ゴシック","MS Gothic",monospace';
                DF.GRAVITY = 0.25 * 60;
                DF.PLAYER_TOUCH_ANCHOR_ENABLE = true;
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
            var Kimiko = (function () {
                function Kimiko(config) {
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
                    this.registerAnimFrames(DF.ANIM_ID_CHARA001_WALK, [
                        0, 
                        1, 
                        0, 
                        2
                    ], 0.2);
                    this.registerAnimFrames(DF.ANIM_ID_CHARA001_STAND, [
                        0
                    ], 0.2);
                    this.registerAnimFrames(DF.ANIM_ID_CHARA002_WALK, [
                        0, 
                        1, 
                        2, 
                        3
                    ], 0.1);
                    core.keybind(" ".charCodeAt(0), "a");
                    core.keybind("A".charCodeAt(0), "left");
                    core.keybind("D".charCodeAt(0), "right");
                    core.keybind("W".charCodeAt(0), "up");
                    core.keybind("S".charCodeAt(0), "down");
                    core.onload = function () {
                        var scene = new jp.osakana4242.kimiko.scenes.GameStart();
                        core.replaceScene(scene);
                    };
                }
                Kimiko.instance = null;
                Kimiko.prototype.registerAnimFrames = function (animId, arr, frameSec) {
                    if (typeof frameSec === "undefined") { frameSec = 0.1; }
                    var frameNum = Math.floor(this.core.fps * frameSec);
                    var dest = [];
                    for(var i = 0, iNum = arr.length; i < iNum; ++i) {
                        for(var j = 0, jNum = frameNum; j < jNum; ++j) {
                            dest.push(arr[i]);
                        }
                    }
                    this.animFrames[animId] = dest;
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

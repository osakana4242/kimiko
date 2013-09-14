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
                var sprites;
                (function (sprites) {
                    sprites.Sprite = Class.create(enchant.Sprite, {
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
                    sprites.EnemyBullet = Class.create(sprites.Sprite, {
                        initialize: function () {
                            sprites.Sprite.call(this, 16, 16);
                            this.vx = 0;
                            this.vy = 0;
                            this.backgroundColor = 'rgb(255, 64, 64)';
                            this.tl.scaleTo(1.0, kimiko.kimiko.core.fps * 0.1).scaleTo(0.75, kimiko.kimiko.core.fps * 0.1).loop();
                        },
                        onenterframe: function () {
                            if(!this.visible) {
                                return;
                            }
                            this.x += this.vx;
                            this.y += this.vy;
                            var player = this.scene.player;
                            var minX = player.cx - kimiko.DF.SC1_W;
                            var maxX = player.cx + kimiko.DF.SC1_W;
                            if(!this.scene.intersectActiveArea(this)) {
                                this.visible = false;
                            }
                        }
                    });
                    sprites.OwnBullet = Class.create(sprites.Sprite, {
                        initialize: function () {
                            sprites.Sprite.call(this, 8, 8);
                            this.vx = 0;
                            this.vy = 0;
                            this.visibleCnt = 0;
                            this.backgroundColor = 'rgb(64, 255, 255)';
                            this.tl.scaleTo(1.25, kimiko.DF.FPS * 0.1).scaleTo(1.0, kimiko.DF.FPS * 0.1).loop();
                        },
                        onenterframe: function () {
                            if(!this.visible) {
                                return;
                            }
                            this.x += this.vx;
                            this.y += this.vy;
                            var player = this.scene.player;
                            var minX = player.cx - kimiko.DF.SC1_W;
                            var maxX = player.cx + kimiko.DF.SC1_W;
                            this.visibleCnt += 1;
                            if(kimiko.kimiko.secToFrame(0.5) <= this.visibleCnt || !this.scene.intersectActiveArea(this)) {
                                this.visible = false;
                                this.visibleCnt = 0;
                            }
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
                    sprites.Life = Life;                    
                    sprites.Attacker = Class.create(sprites.Sprite, {
                        initialize: function () {
                            var _this = this;
                            sprites.Sprite.call(this);
                            this.dirX = 1;
                            this.vx = 0;
                            this.vy = 0;
                            this.attackCnt = 0;
                            this.useGravity = true;
                            this.life = new Life();
                            this.stateNeutral.stateName = "neutral";
                            this.state = this.stateNeutral;
                            this.addEventListener(Event.ENTER_FRAME, function () {
                                _this.state();
                                _this.life.step();
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
                            if(attacker) {
                                this.vx += attacker.vx;
                                this.vy += -1;
                            }
                            this.life.damage(10);
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
                                var effect = new sprites.DeadEffect(this, i * kimiko.kimiko.core.fps * 0.2);
                                effect.x += Math.random() * 32 - 16;
                                effect.y += Math.random() * 32 - 16;
                                this.parentNode.addChild(effect);
                            }
                            this.parentNode.removeChild(this);
                        },
                        attack: function () {
                            this.attackCnt = kimiko.DF.ATTACK_TIME;
                            this.state = this.stateAttack;
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
                    sprites.DeadEffect = Class.create(sprites.Sprite, {
                        initialize: function (attacker, delay) {
                            var _this = this;
                            sprites.Sprite.call(this);
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
                    sprites.Ground = Class.create(sprites.Sprite, {
                        initialize: function () {
                            sprites.Sprite.call(this);
                            this.width = 96;
                            this.height = 8;
                            this.backgroundColor = 'rgb(128, 128, 128)';
                        }
                    });
                    sprites.Player = Class.create(sprites.Attacker, {
                        initialize: function () {
                            var _this = this;
                            sprites.Attacker.call(this);
                            this.image = kimiko.kimiko.core.assets[kimiko.DF.IMAGE_PLAYER];
                            this.frame = [
                                0, 
                                0, 
                                0, 
                                0, 
                                0, 
                                0, 
                                0, 
                                0, 
                                1, 
                                1, 
                                1, 
                                1, 
                                1, 
                                1, 
                                1, 
                                1, 
                                0, 
                                0, 
                                0, 
                                0, 
                                0, 
                                0, 
                                0, 
                                0, 
                                2, 
                                2, 
                                2, 
                                2, 
                                2, 
                                2, 
                                2, 
                                2, 
                                
                            ];
                            this.width = 32;
                            this.height = 32;
                            this.life.hpMax = 500;
                            this.life.hp = this.life.hpMax;
                            this.anchorX = 0;
                            this.anchorY = 0;
                            this.useGravity = false;
                            this.addEventListener(Event.ENTER_FRAME, function () {
                                _this.stepMove();
                            });
                        },
                        attack: function () {
                            var bullet = this.scene.newOwnBullet();
                            bullet.vx = this.dirX * kimiko.kimiko.secToPx(200);
                            bullet.vy = 0;
                            bullet.cx = this.cx;
                            bullet.cy = this.cy;
                        },
                        stepMove: function () {
                            if(this.useGravity) {
                                this.vy += kimiko.DF.GRAVITY;
                            }
                            if(this.cx < kimiko.DF.SC_X1) {
                                this.cx = kimiko.DF.SC_X1;
                                this.vx = 0;
                            }
                            if(kimiko.DF.SC_X2 < this.cx) {
                            }
                            if(kimiko.DF.GROUND_Y < this.cy) {
                                this.cy = kimiko.DF.GROUND_Y;
                                this.vy = 0;
                            }
                            this.x += this.vx;
                            this.y += this.vy;
                            var hoge = 0.98;
                            this.vx *= hoge;
                            this.vy *= hoge;
                        }
                    });
                    var WeaponA = (function () {
                        function WeaponA(sprite) {
                            this.parent = sprite;
                            this.state = this.stateNeutral;
                            this.fireCount = 3;
                            this.fireInterval = kimiko.kimiko.secToFrame(0.2);
                            this.reloadFrameCount = kimiko.kimiko.secToFrame(3.0);
                            this.dir = {
                                x: 1,
                                y: 0
                            };
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
                            var wayNum = 3;
                            var degToRad = Math.PI / 180;
                            var degInterval = 45;
                            var startDeg = -degInterval * ((wayNum - 1) / 2);
                            for(var i = 0, iNum = wayNum; i < iNum; ++i) {
                                var bullet = parent.scene.newEnemyBullet();
                                var deg = startDeg + (degInterval * i);
                                var rad = deg * degToRad;
                                var speed = kimiko.kimiko.secToPx(80);
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
                    sprites.EnemyA = Class.create(sprites.Attacker, {
                        initialize: function () {
                            var _this = this;
                            sprites.Attacker.call(this);
                            var life = this.life;
                            life.hpMax = 100;
                            life.hp = life.hpMax;
                            this.weapon = new WeaponA(this);
                            this.anchor = {
                                x: 0,
                                y: 0
                            };
                            this.initStyle_();
                            this.addEventListener(Event.ENTER_FRAME, function () {
                                _this.weapon.step();
                            });
                        },
                        initStyle_: function () {
                            this.width = 24;
                            this.height = 32;
                            this.backgroundColor = "rgb(192, 128, 128)";
                        },
                        start: function (anchor) {
                            var _this = this;
                            var range = 16;
                            this.anchor.x = anchor.x;
                            this.anchor.y = anchor.y - (this.height / 2);
                            this.x = this.anchor.x;
                            this.y = this.anchor.y;
                            var waitFire = function () {
                                return !_this.weapon.isStateFire();
                            };
                            this.tl.moveTo(this.anchor.x + range, this.anchor.y, kimiko.kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN).then(function () {
                                var wp = _this.weapon;
                                wp.dir.x = 1;
                                wp.dir.y = 0;
                                wp.startFire();
                            }).waitUntil(waitFire).moveTo(this.anchor.x - range, this.anchor.y, kimiko.kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN).then(function () {
                                var wp = _this.weapon;
                                wp.dir.x = -1;
                                wp.dir.y = 0;
                                wp.startFire();
                            }).waitUntil(waitFire).then(function () {
                                var player = _this.scene.player;
                                var wp = _this.weapon;
                                wp.dir.x = player.x - _this.x;
                                wp.dir.y = player.y - _this.y;
                                osakana4242.utils.Vector2D.normalize(wp.dir);
                                wp.startFire();
                            }).waitUntil(waitFire).moveTo(this.anchor.x, this.anchor.y - 32, kimiko.kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN).then(function () {
                                var wp = _this.weapon;
                                wp.dir.x = -1;
                                wp.dir.y = 0;
                                wp.startFire();
                            }).waitUntil(waitFire).loop();
                        }
                    });
                })(sprites || (sprites = {}));
                scenes.Act = Class.create(Scene, {
                    initialize: function () {
                        Scene.call(this);
                        this.backgroundColor = "rgb(32, 32, 64)";
                        var group;
                        var sprite;
                        group = new enchant.Group();
                        this.bg = group;
                        this.addChild(group);
                        for(var i = 0, iNum = 128; i < iNum; ++i) {
                            sprite = new sprites.Sprite(8, 8);
                            group.addChild(sprite);
                            sprite.backgroundColor = "rgb(64, 64, 32)";
                            sprite.x = i * 100;
                            sprite.y = kimiko.DF.GROUND_Y - ((i % 3) * 50);
                        }
                        this.grounds = [];
                        this.ownBullets = [];
                        for(var i = 0, iNum = 8; i < iNum; ++i) {
                            sprite = new sprites.OwnBullet();
                            group.addChild(sprite);
                            this.ownBullets.push(sprite);
                            sprite.visible = false;
                        }
                        this.enemyBullets = [];
                        for(var i = 0, iNum = 255; i < iNum; ++i) {
                            sprite = new sprites.EnemyBullet();
                            group.addChild(sprite);
                            this.enemyBullets.push(sprite);
                            sprite.visible = false;
                        }
                        this.enemys = [];
                        for(var i = 0, iNum = 1; i < iNum; ++i) {
                            sprite = new sprites.EnemyA();
                            var anchor = {
                                x: 240 + i * 300,
                                y: kimiko.DF.GROUND_Y
                            };
                            sprite.start(anchor);
                            this.enemys.push(sprite);
                            group.addChild(sprite);
                        }
                        sprite = new sprites.Player();
                        this.player = sprite;
                        group.addChild(sprite);
                        sprite.width = 32;
                        sprite.height = 32;
                        sprite.x = 0;
                        sprite.y = 64;
                        this.labels = [];
                        for(var i = 0, iNum = 3; i < iNum; ++i) {
                            sprite = new Label("");
                            this.addChild(sprite);
                            this.labels.push(sprite);
                            sprite.font = kimiko.DF.FONT_M;
                            sprite.color = "#fff";
                            sprite.y = 12 * i;
                        }
                        sprite = new sprites.Sprite(kimiko.DF.SC2_W, kimiko.DF.SC2_H);
                        this.addChild(sprite);
                        this.controllArea = sprite;
                        sprite.x = kimiko.DF.SC2_X1;
                        sprite.y = kimiko.DF.SC2_Y1;
                        sprite.backgroundColor = "rgb(64, 64, 64)";
                        this.touch = new osakana4242.utils.Touch();
                    },
                    getNearEnemy: function (sprite, sqrDistanceThreshold) {
                        var enemys = this.enemys;
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
                        return bullet;
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
                    ontouchstart: function (event) {
                        var touch = this.touch;
                        touch.saveTouchStart(event.x, event.y);
                        var player = this.player;
                        player.anchorX = player.x;
                        player.anchorY = player.y;
                        player.useGravity = false;
                    },
                    ontouchmove: function (event) {
                        var touch = this.touch;
                        var diffX = event.x - touch.startX;
                        var diffY = event.y - touch.startY;
                        var player = this.player;
                        var playerOldX = player.x;
                        var playerOldY = player.y;
                        var touchElpsedFrame = this.scene.touch.getTouchElpsedFrame();
                        touchElpsedFrame = 0;
                        if(touchElpsedFrame < kimiko.kimiko.secToFrame(0.5)) {
                            player.x = player.anchorX + (diffX * 1.0);
                            player.y = player.anchorY + (diffY * 1.0);
                        }
                        var dirChangeThreshold = 4;
                        if(dirChangeThreshold <= Math.abs(player.x - playerOldX)) {
                            player.dirX = kimiko.kimiko.numberUtil.sign(player.x - playerOldX);
                            player.scaleX = player.dirX;
                        }
                    },
                    ontouchend: function (event) {
                        var touch = this.touch;
                        touch.saveTouchEnd(event.x, event.y);
                        this.labels[0].text = ([
                            "touch end diff", 
                            Math.floor(touch.diffX), 
                            Math.floor(touch.diffY)
                        ]).join();
                        var player = this.player;
                        if(Math.abs(touch.diffX) + Math.abs(touch.diffY) < 16) {
                            player.attack();
                        }
                        player.useGravity = true;
                    },
                    onenterframe: function () {
                        var player = this.player;
                        if((player.age % kimiko.kimiko.secToFrame(0.2)) === 0) {
                            var nearEnemy = this.getNearEnemy(player, 64 * 64);
                            if(nearEnemy !== null) {
                                player.attack();
                            }
                        }
                        this.checkCollision();
                        var tx = (kimiko.DF.SC1_W / 2) - player.cx + (-player.dirX * 16);
                        var ty = (kimiko.DF.SC1_H) - (player.y + player.height + 64);
                        this.bg.x += (tx - this.bg.x) / 8;
                        this.bg.y += (ty - this.bg.y) / 4;
                        this.labels[1].text = player.stateToString() + " fps:" + Math.round(kimiko.kimiko.core.actualFps);
                    },
                    checkCollision: function () {
                        var player = this.player;
                        for(var i = 0, iNum = this.grounds.length; i < iNum; ++i) {
                            var ground = this.grounds[i];
                            if(!this.intersectActiveArea(ground)) {
                                continue;
                            }
                            if(player.vy < 0) {
                                continue;
                            }
                            if(ground.intersect(player)) {
                                player.vy = 0;
                                player.y = ground.y - player.height;
                                break;
                            }
                        }
                        if(true) {
                            if(player.isNeutral() || player.isAttack()) {
                                for(var i = 0, iNum = this.enemyBullets.length; i < iNum; ++i) {
                                    var bullet = this.enemyBullets[i];
                                    if(bullet.visible && player.intersect(bullet)) {
                                        player.damage(bullet);
                                        bullet.visible = false;
                                    }
                                }
                            }
                        } else {
                            if(player.isNeutral() || player.isAttack()) {
                                sprites.EnemyBullet.collection.forEach(function (bullet) {
                                    if(bullet.visible && player.intersect(bullet)) {
                                        player.damage(bullet);
                                        bullet.visible = false;
                                    }
                                });
                            }
                        }
                        this.labels[2].text = "";
                        for(var i = 0, iNum = this.enemys.length; i < iNum; ++i) {
                            var enemy = this.enemys[i];
                            if(enemy.isDead() || player.isDead() || enemy.isDamage() || player.isDamage()) {
                                continue;
                            }
                            if(player.intersect(enemy)) {
                                this.labels[2].text = "hit";
                                if(player.isAttack() && enemy.isAttack()) {
                                    if(enemy.attackCnt <= player.attackCnt) {
                                        enemy.damage(player);
                                    } else {
                                        player.damage(enemy);
                                    }
                                } else if(player.isAttack() && !enemy.isDamage()) {
                                    enemy.damage(player);
                                } else if(enemy.isAttack() && !player.isDamage()) {
                                    player.damage(enemy);
                                }
                            }
                        }
                        for(var i = 0, iNum = this.enemys.length; i < iNum; ++i) {
                            var enemy = this.enemys[i];
                            if(enemy.isDead() || enemy.isDamage()) {
                                continue;
                            }
                            for(var j = 0, jNum = this.ownBullets.length; j < jNum; ++j) {
                                var bullet = this.ownBullets[j];
                                if(bullet.visible && enemy.intersect(bullet)) {
                                    enemy.damage(bullet);
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
                function Vector2D() { }
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
            var Touch = (function () {
                function Touch() {
                    this.isTouching = false;
                }
                Touch.prototype.saveTouchStart = function (x, y) {
                    this.startX = x;
                    this.startY = y;
                    this.startFrame = enchant.Core.instance.frame;
                    this.isTouching = true;
                };
                Touch.prototype.saveTouchMove = function (x, y) {
                    this.endX = x;
                    this.endY = y;
                    this.endFrame = enchant.Core.instance.frame;
                    this.isTouching = false;
                    this.diffX = this.endX - this.startX;
                    this.diffY = this.endY - this.startY;
                };
                Touch.prototype.saveTouchEnd = function (x, y) {
                    this.endX = x;
                    this.endY = y;
                    this.endFrame = enchant.Core.instance.frame;
                    this.isTouching = false;
                    this.diffX = this.endX - this.startX;
                    this.diffY = this.endY - this.startY;
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
            (function (DF) {
                DF.FPS = 60;
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
                DF.IMAGE_PLAYER = "./assets/images/chara001.png";
                DF.PLAYER_COLOR = "rgb(240, 240, 240)";
                DF.PLAYER_DAMAGE_COLOR = "rgb(240, 240, 120)";
                DF.PLAYER_ATTACK_COLOR = "rgb(160, 160, 240)";
                DF.ENEMY_COLOR = "rgb(120, 80, 120)";
                DF.ENEMY_DAMAGE_COLOR = "rgb(240, 16, 240)";
                DF.ENEMY_ATTACK_COLOR = "rgb(240, 16, 16)";
                DF.DAMAGE_TIME = DF.FPS * 0.5;
                DF.ATTACK_TIME = DF.FPS * 0.5;
                DF.GROUND_Y = 0;
                DF.FONT_M = '12px Verdana,"ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","ＭＳ ゴシック","MS Gothic",monospace';
                DF.GRAVITY = 0.25;
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
                function Kimiko() {
                    this.numberUtil = new NumberUtil();
                    if(Kimiko.instance) {
                        return;
                    }
                    Kimiko.instance = this;
                    var core = new enchant.Core(DF.SC_W, DF.SC_H);
                    core.fps = DF.FPS;
                    core.preload(DF.IMAGE_PLAYER);
                    core.onload = function () {
                        var scene = new jp.osakana4242.kimiko.scenes.Act();
                        core.replaceScene(scene);
                    };
                }
                Kimiko.instance = null;
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
                Kimiko.prototype.secToPx = function (px) {
                    return px ? px / this.core.fps : 0;
                };
                return Kimiko;
            })();
            kimiko.Kimiko = Kimiko;            
            function start() {
                kimiko.kimiko = new Kimiko();
                kimiko.kimiko.core.start();
            }
            kimiko.start = start;
        })(osakana4242.kimiko || (osakana4242.kimiko = {}));
        var kimiko = osakana4242.kimiko;
    })(jp.osakana4242 || (jp.osakana4242 = {}));
    var osakana4242 = jp.osakana4242;
})(jp || (jp = {}));

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
                            this.tl.scaleTo(1.25, kimiko.kimiko.core.fps * 0.1).scaleTo(1.0, kimiko.kimiko.core.fps * 0.1).loop();
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
                    sprites.Attacker = Class.create(sprites.Sprite, {
                        initialize: function () {
                            sprites.Sprite.call(this);
                            this.dirX = 1;
                            this.vx = 0;
                            this.vy = 0;
                            this.damageCnt = 0;
                            this.attackCnt = 0;
                            this.colorNeutral = kimiko.DF.ENEMY_COLOR;
                            this.colorDamage = kimiko.DF.ENEMY_DAMAGE_COLOR;
                            this.colorAttack = kimiko.DF.ENEMY_ATTACK_COLOR;
                            this.hp = 100;
                            this.useGravity = true;
                            this.stateNeutral.stateName = "neutral";
                            this.state = this.stateNeutral;
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
                        onenterframe: function () {
                            this.stepMove();
                            this.stepState();
                            if(this.step) {
                                this.step();
                            }
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
                        },
                        stepState: function () {
                            this.state();
                        },
                        stateNeutral: function () {
                        },
                        stateDamage: function () {
                            --this.damageCnt;
                            if(this.damageCnt <= 0) {
                                this.neutral();
                            }
                        },
                        stateAttack: function () {
                            --this.attackCnt;
                            if(this.attackCnt <= 0) {
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
                            this.hp -= 50;
                            if(0 < this.hp) {
                                this.damageCnt = kimiko.DF.DAMAGE_TIME;
                                this.attackCnt = 0;
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
                            this.hp = 500;
                            this.colorNeutral = kimiko.DF.PLAYER_COLOR;
                            this.colorDamage = kimiko.DF.PLAYER_DAMAGE_COLOR;
                            this.colorAttack = kimiko.DF.PLAYER_ATTACK_COLOR;
                            this.anchorX = 0;
                            this.anchorY = 0;
                            this.useGravity = false;
                        },
                        attack: function () {
                            var bullet = this.scene.newOwnBullet();
                            bullet.vx = this.dirX * kimiko.kimiko.secToPx(200);
                            bullet.vy = 0;
                            bullet.cx = this.cx;
                            bullet.cy = this.cy;
                        }
                    });
                    var WeaponA = (function () {
                        function WeaponA(sprite) {
                            this.parent = sprite;
                            this.state = this.stateNeutral;
                            this.fireCount = 3;
                            this.fireInterval = kimiko.kimiko.secToFrame(0.1);
                            this.reloadFrameCount = kimiko.kimiko.secToFrame(3.0);
                        }
                        WeaponA.prototype.step = function () {
                            this.state();
                        };
                        WeaponA.prototype.stateNeutral = function () {
                        };
                        WeaponA.prototype.stateFire = function () {
                            if(this.reloadFrameCount < this.reloadFrameCounter) {
                                ++this.reloadFrameCounter;
                                this.state = this.stateNeutral;
                                return;
                            }
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
                        };
                        WeaponA.prototype.fire = function () {
                            console.log("fire");
                            var parent = this.parent;
                            var bullet = parent.scene.newEnemyBullet();
                            bullet.vx = parent.dirX * kimiko.kimiko.secToPx(40);
                            bullet.vy = 0;
                            bullet.cx = parent.cx;
                            bullet.cy = parent.cy;
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
                    var EnemySinBrain = (function () {
                        function EnemySinBrain(sprite, anchor) {
                            this.sprite = sprite;
                            this.anchor = anchor;
                            var _this = this;
                            this.sprite.cx = anchor.x;
                            this.sprite.cy = anchor.y;
                            this.sprite.step = function () {
                                _this.step();
                            };
                        }
                        EnemySinBrain.prototype.step = function () {
                            var cycle = kimiko.kimiko.secToFrame(3);
                            this.sprite.useGravity = false;
                            var ty = this.anchor.y + (Math.sin(this.sprite.age * Math.PI * 2 / cycle) * 32);
                            this.sprite.vy = ty - this.sprite.y;
                            var body = this.sprite;
                            if(!body.weapon.isStateFire()) {
                                body.weapon.startFire();
                            }
                        };
                        return EnemySinBrain;
                    })();                    
                    var EnemyBrain = (function () {
                        function EnemyBrain(sprite, anchor) {
                            this.sprite = sprite;
                            this.anchor = anchor;
                            var _this = this;
                            this.minX = 0;
                            this.maxX = 0;
                            this.moveCnt = 0;
                            this.waitCnt = 0;
                            this.sprite.cx = anchor.x;
                            this.sprite.cy = anchor.y;
                            this.sprite.step = function () {
                                _this.step();
                            };
                            this.minX = this.anchor.x - 64;
                            this.maxX = this.anchor.x + 64;
                        }
                        EnemyBrain.prototype.step = function () {
                            if(!this.sprite.scene.intersectActiveArea(this.sprite)) {
                                return;
                            }
                            if(this.sprite.isDamage() || this.sprite.isDead()) {
                                return;
                            }
                            if(0 < --this.waitCnt) {
                                return;
                            }
                            if(!this.sprite.isNeutral()) {
                                return;
                            }
                            if(Math.abs(this.sprite.vx) < kimiko.kimiko.secToPx(1)) {
                                console.log("vx:" + this.sprite.vx);
                                if((this.moveCnt % 4) === 0) {
                                    this.sprite.vx = -this.sprite.dirX * kimiko.kimiko.secToPx(10);
                                    this.waitCnt = kimiko.kimiko.secToFrame(1.0);
                                    var bullet = this.sprite.scene.newEnemyBullet();
                                    bullet.vx = this.sprite.dirX * kimiko.kimiko.secToPx(80);
                                    bullet.vy = 0;
                                    bullet.cx = this.sprite.cx;
                                    bullet.cy = this.sprite.cy;
                                } else {
                                    this.sprite.vx += this.sprite.dirX * kimiko.kimiko.secToPx(40);
                                }
                                ++this.moveCnt;
                            }
                            if(this.sprite.cx < this.minX) {
                                this.sprite.dirX = 1;
                            }
                            if(this.maxX < this.sprite.cx) {
                                this.sprite.dirX = -1;
                            }
                        };
                        return EnemyBrain;
                    })();                    
                    sprites.Enemy = Class.create(sprites.Attacker, {
                        initialize: function (anchor) {
                            sprites.Attacker.call(this);
                            this.width = 32;
                            this.height = 32;
                            this.hp = 100;
                            this.colorNeutral = kimiko.DF.ENEMY_COLOR;
                            this.colorDamage = kimiko.DF.ENEMY_DAMAGE_COLOR;
                            this.colorAttack = kimiko.DF.ENEMY_ATTACK_COLOR;
                            this.backgroundColor = this.colorNeutral;
                            this.anchor = anchor;
                            this.brain = null;
                            this.weapon = new WeaponA(this);
                        },
                        initType: function (typeId) {
                            switch(typeId) {
                                case sprites.Enemy.ID_A:
                                    this.brain = new EnemyBrain(this, this.anchor);
                                    break;
                                case sprites.Enemy.ID_B:
                                    this.brain = new EnemySinBrain(this, this.anchor);
                                    break;
                            }
                        }
                    });
                    sprites.Enemy.ID_A = 1;
                    sprites.Enemy.ID_B = 2;
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
                        for(var i = 0, iNum = 16; i < iNum; ++i) {
                            sprite = new sprites.EnemyBullet();
                            group.addChild(sprite);
                            this.enemyBullets.push(sprite);
                            sprite.visible = false;
                        }
                        this.enemys = [];
                        for(var i = 0, iNum = 16; i < iNum; ++i) {
                            var anchor = {
                                x: 240 + i * 300,
                                y: -64
                            };
                            sprite = new sprites.Enemy(anchor);
                            var enemyTypeId = ((i & 0x1) == 0) ? sprites.Enemy.ID_A : sprites.Enemy.ID_B;
                            sprite.initType(enemyTypeId);
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
                        var _this = this;
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
                        if(true) {
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
                        } else {
                            sprites.Enemy.collection.forEach(function (enemy) {
                                if(enemy.isDead() || player.isDead() || enemy.isDamage() || player.isDamage()) {
                                    return;
                                }
                                if(player.intersect(enemy)) {
                                    _this.labels[2].text = "hit";
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
                            });
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

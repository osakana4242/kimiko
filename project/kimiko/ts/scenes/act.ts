declare var enchant: any;

module jp.osakana4242.kimiko.scenes {

	var Class = enchant.Class;
	var Core = enchant.Core;
	var Scene = enchant.Scene;
	var Label = enchant.Label;
	var Event = enchant.Event;
	var Easing = enchant.Easing;

	module sprites {

		/** 拡張Sprite */
		export var Sprite: any = Class.create(enchant.Sprite, {
			initialize: function (w: number, h: number) {
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
			},
		});

		/** 敵弾 */
		export var EnemyBullet: any = Class.create(Sprite, {
			initialize: function () {
				Sprite.call(this, 16, 16);
				this.vx = 0;
				this.vy = 0;
				this.backgroundColor = 'rgb(255, 64, 64)';
				this.tl.scaleTo(1.0, kimiko.core.fps * 0.1)
					.scaleTo(0.75, kimiko.core.fps * 0.1)
					.loop();
			},
			onenterframe: function () {
				if (!this.visible) {
					return;
				}
				this.x += this.vx;
				this.y += this.vy;
				var player = this.scene.player;
				var minX: number = player.cx - DF.SC1_W;
				var maxX: number = player.cx + DF.SC1_W;
				if (!this.scene.intersectActiveArea(this)) {
					this.visible = false;
				}
			},
		});
		
		/** 自弾 */
		export var OwnBullet: any = Class.create(Sprite, {
			initialize: function () {
				Sprite.call(this, 8, 8);
				this.vx = 0;
				this.vy = 0;
				this.visibleCnt = 0;
				this.backgroundColor = 'rgb(64, 255, 255)';
				this.tl.scaleTo(1.25, kimiko.secToFrame(0.1))
					.scaleTo(1.0, kimiko.secToFrame(0.1))
					.loop();
			},
			onenterframe: function () {
				if (!this.visible) {
					return;
				}
				this.x += this.vx;
				this.y += this.vy;
				var player = this.scene.player;
				var minX: number = player.cx - DF.SC1_W;
				var maxX: number = player.cx + DF.SC1_W;
				this.visibleCnt += 1;
				if (kimiko.secToFrame(0.5) <= this.visibleCnt || !this.scene.intersectActiveArea(this)) {
					this.visible = false;
					this.visibleCnt = 0;
				}
			},
		});

		export class Life {
			hp: number;
			hpMax: number;
			damageFrameCounter: number;
			damageFrameMax: number;
			damageListener: () => void;

			constructor() {
				this.hpMax = 100;
				this.hp = this.hpMax;
				this.damageFrameMax = kimiko.secToFrame(1.0);
				this.damageFrameCounter = this.damageFrameMax;
			}

			public step(): void {
				if (this.hasDamage()) {
					++this.damageFrameCounter;
				}
			}

			public isAlive(): bool { return 0 < this.hp; }
			public isDead(): bool { return !this.isAlive(); }
			public hasDamage(): bool { return this.damageFrameCounter < this.damageFrameMax; }

			public damage(v: number) {
				this.hp -= v;
				if (this.damageListener) {
					this.damageListener();
				}
			}
		}
		
		/** とりあえず攻撃できるひと */
		export var Attacker: any = Class.create(Sprite, {
			initialize: function () {
				Sprite.call(this);
				this.dirX = 1;
				this.vx = 0;
				this.vy = 0;
				this.attackCnt = 0;
				this.useGravity = true;
				this.life = new Life();

				this.blinkFrameMax = kimiko.secToFrame(0.5);
				this.blinkFrameCounter = this.blinkFrameMax;
				
				this.stateNeutral.stateName = "neutral";
				this.state = this.stateNeutral;

				this.addEventListener(Event.ENTER_FRAME, () => {
					this.state();
					this.life.step();
					if (this.blinkFrameCounter < this.blinkFrameMax) {
						++this.blinkFrameCounter;
						if (this.blinkFrameCounter < this.blinkFrameMax) {
							this.visible = (this.blinkFrameCounter & 0x1) == 0;
						} else {
							this.visible = true;
						}
					}
				});
			},

			stateToString: function () {
				var dir: string = 0 <= this.dirX ? '>' : '<';
				return (<any[]>[dir, this.state.stateName, 'cx', Math.round(this.cx), 'cy', Math.round(this.cy)]).join();
			},

			stateNeutral: function () {
			},

			stateDamage: function () {
				if (!this.life.hasDamage()) {
					this.neutral();
				}
			},

			stateDead: function () {
			},

			neutral: function () {
				this.state = this.stateNeutral;
			},

			damage: function (attacker?: any) {
				this.life.damage(10);
				this.blinkFrameCounter = 0;
				if (this.life.isAlive()) {
					this.state = this.stateDamage;
				} else {
					// シボンヌ.
					this.dead();
				}
			},
			dead: function () {
				this.visible = false;
				this.state = this.stateDead;
				// 死亡エフェクト追加.
				for (var i = 0, iNum = 3; i < iNum; ++i) {
					var effect = new DeadEffect(this, i * kimiko.core.fps * 0.2);
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
			},
		});
		
		/** 死亡エフェクト */
		export var DeadEffect: any = Class.create(Sprite, {
			initialize: function (attacker, delay: number) {
				Sprite.call(this);
				this.width = attacker.width;
				this.height = attacker.height;
				this.cx = attacker.cx;
				this.cy = attacker.cy;
				this.backgroundColor = attacker.backgroundColor;
				var effectTime: number = kimiko.secToFrame(0.5);
				this.visible = false;
				this.tl
				.delay(delay)
				.then(() => this.visible = true)
				.scaleTo(2.0, effectTime, enchant.Easing.SIN_EASEOUT)
				.and().fadeOut(effectTime, enchant.Easing.SIN_EASEOUT)
				.then(() => this.tl.removeFromScene());
			},
		});
		
		/** 地形 */
		export var Ground: any = Class.create(Sprite, {
			initialize: function () {
				Sprite.call(this);
				this.width = 96;
				this.height = 8;
				this.backgroundColor = 'rgb(128, 128, 128)';
			},
		});
		
		export var Player: any = Class.create(Attacker, {
			initialize: function () {
				Attacker.call(this);
				this.image = kimiko.core.assets[DF.IMAGE_CHARA001]
				this.frame = kimiko.getAnimFrames(DF.ANIM_ID_CHARA001_WALK);
				this.width = 32;
				this.height = 32;
				this.life.hpMax = 500;
				this.life.hp = this.life.hpMax;
				this.anchorX = 0;
				this.anchorY = 0;
				this.useGravity = false;

				this.addEventListener(Event.ENTER_FRAME, () => {
					this.stepMove();
					
					// 敵が近くにいれば攻撃.
					var scene = this.scene;
					if ((this.age % kimiko.secToFrame(0.2)) === 0) {
						var nearEnemy = scene.getNearEnemy(this, 96 * 96);
						if (nearEnemy !== null) {
							this.attack();
						}
					}

				});
			},

			attack: function () {
				var bullet = this.scene.newOwnBullet();
				bullet.vx = this.dirX * kimiko.dpsToDpf(200);
				bullet.vy = 0;
				bullet.cx = this.cx;
				bullet.cy = this.cy;
			},

			stepMove: function () {
				if (this.useGravity) {
					this.vy += kimiko.dpsToDpf(DF.GRAVITY);
				}
				this.x += this.vx;
				this.y += this.vy;

				if (this.cx < DF.SC_X1) {
					this.cx = DF.SC_X1;
					this.vx = 0;
				}
				if (DF.SC_X2 < this.cx) {
					//this.cx = DF.SC_X2;
					//this.vx = 0;
				}
				if (DF.GROUND_Y < this.cy) {
					this.cy = DF.GROUND_Y;
					this.vy = 0;
				}
			},
		});
		
		class WeaponA {
			fireCounter: number;
			fireCount: number;
			fireIntervalCounter: number;
			fireInterval: number;
			reloadFrameCounter: number;
			reloadFrameCount: number;
			parent: any;
			dir: utils.IVector2D;

			state: () => void;

			constructor(sprite: any) {
				this.parent = sprite;
				this.state = this.stateNeutral;
				this.fireCount = 1;
				this.fireInterval = kimiko.secToFrame(0.2);
				this.reloadFrameCount = kimiko.secToFrame(3.0);
				this.dir = { x: 1, y: 0 }
			}

			public step(): void {
				this.state();
				
			}
			
			private stateNeutral(): void {
			}

			private stateFire(): void {
				if (this.fireIntervalCounter < this.fireInterval) {
					 ++this.fireIntervalCounter;
					 return;
				}
				this.fireIntervalCounter = 0;
				if (this.fireCounter < this.fireCount ) {
					 this.fire();
					 ++this.fireCounter;
					 return;
				}
				this.fireCounter = 0;
				this.reloadFrameCounter = 0;
				this.state = this.stateNeutral;
			}

			private fire(): void {
				var parent = this.parent;
				var wayNum = 1;
				var degToRad = Math.PI / 180;
				var degInterval = 45;
				var startDeg = - degInterval * ((wayNum - 1) / 2);
				for (var i = 0, iNum = wayNum; i < iNum; ++i) {
					var bullet = parent.scene.newEnemyBullet();
					var deg = startDeg + (degInterval * i);
					var rad = deg * degToRad;
					var speed = kimiko.dpsToDpf(80);
					bullet.vx = (this.dir.x * Math.cos(rad) - (this.dir.y * Math.sin(rad))) * speed;
					bullet.vy = (this.dir.y * Math.cos(rad) + (this.dir.x * Math.sin(rad))) * speed;
					bullet.cx = parent.cx;
					bullet.cy = parent.cy;
				}

			}


			public startFire(): void {
				this.fireCounter = 0;
				this.fireIntervalCounter = this.fireInterval;
				this.reloadFrameCounter = this.reloadFrameCount;
				this.state = this.stateFire;
			}

			public isStateFire(): bool {
				return this.state === this.stateFire;
			}

		}

		export var EnemyA = Class.create(Attacker, {
			initialize: function () {
				Attacker.call(this);

				var life: Life = this.life;
				life.hpMax = 100;
				life.hp = life.hpMax;

				this.weapon = new WeaponA(this);
				this.anchor = {
					x: 0,
					y: 0,
				};
				this.initStyle_();
				this.addEventListener(Event.ENTER_FRAME, () => {
					this.weapon.step();
				});
			},

			initStyle_: function () {
				this.width = 32;
				this.height = 32;
				//this.backgroundColor = "rgb(192, 128, 128)";

				this.image = kimiko.core.assets[DF.IMAGE_CHARA002]
				this.frame = kimiko.getAnimFrames(DF.ANIM_ID_CHARA002_WALK);
			},

			start: function (anchor: utils.IVector2D) {
				var range = 16;
				this.anchor.x = anchor.x;
				this.anchor.y = anchor.y - (this.height / 2);
				this.x = this.anchor.x;
				this.y = this.anchor.y;
				var waitFire = () => { return !this.weapon.isStateFire(); };
				this.tl
					.moveTo(this.anchor.x + range, this.anchor.y, kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN)
					.then(() => {
						var wp: WeaponA = this.weapon;
						wp.dir.x = 1;
						wp.dir.y = 0;
						wp.startFire();
					})
					.waitUntil(waitFire)
					.moveTo(this.anchor.x - range, this.anchor.y, kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN)
					.then(() => {
						var wp: WeaponA = this.weapon;
						wp.dir.x = -1;
						wp.dir.y = 0;
						wp.startFire();
					})
					.waitUntil(waitFire)
					.then(() => {
						// プレイヤーの向きを求める.
						var player = this.scene.player;
						var wp: WeaponA = this.weapon;
						wp.dir.x = player.x - this.x;
						wp.dir.y = player.y - this.y;
						utils.Vector2D.normalize(wp.dir);
						wp.startFire();
					})
					.waitUntil(waitFire)
					.moveTo(this.anchor.x, this.anchor.y - 32, kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN)
					.then(() => {
						var wp: WeaponA = this.weapon;
						wp.dir.x = -1;
						wp.dir.y = 0;
						wp.startFire();
					})
					.waitUntil(waitFire)
					.loop();
			},
		});

	}
	
	export var Act: any = Class.create(Scene, {
		initialize: function () {
			Scene.call(this);
			this.backgroundColor = "rgb(32, 32, 64)";
			var group;
			var sprite;

			group = new enchant.Group();
			this.bg = group;
			this.addChild(group);
			

			var blocks = [
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
	[-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1],
	[-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, -1, -1, 0, 0, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, -1, -1, -1, -1, 1, 1, 1, 1, 0, 0, -1, -1, 0, 0, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, -1, -1, -1, -1, 1, 1, 1, 1, 0, 0, -1, -1, 0, 0, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, 0, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 0, 0, -1, -1, 0, 0, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, 0, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, 0, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, 0, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 0, 0, -1, -1, 0, 0, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, 0, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 0, 0, -1, -1, 0, 0, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, 0, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 0, 0, -1, -1, 0, 0, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, 0, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 0, 0, -1, -1, 0, 0, 1, 1, -1],
	[-1, 1, 1, 0, 0, 0, 0, 0, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, 0, 0, 0, 0, 0, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 0, 0, -1, -1, 0, 0, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 0, 0, -1, -1, 0, 0, 1, 1, -1],
	[-1, 1, 1, 0, 0, 0, 0, 0, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 0, 0, -1, -1, 0, 0, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 0, 0, -1, -1, 0, 0, 1, 1, -1],
	[-1, 1, 1, -1, 0, 0, 0, 0, 0, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 0, 0, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 0, 0, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, 0, 0, 0, 0, 0, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 0, 0, 0, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, 0, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, 0, -1, -1, -1, -1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, -1, -1, 0, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, 0, -1, -1, -1, -1, 1, 1, 1, 1, -1, -1, -1, -1, 1, 1, 1, 1, -1, -1, 0, 0, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, 0, -1, -1, -1, -1, 1, 1, 1, 1, -1, -1, -1, -1, 1, 1, 1, 1, -1, -1, -1, 0, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, 0, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, 0, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, 0, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, 0, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, 0, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, 0, 0, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, 0, 0, 0, 0, 0, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, 0, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, 0, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, 0, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, 0, 0, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, 0, 0, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, 0, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, 0, -1, -1, 1, 1, -1],
	[-1, 1, 1, 0, -1, -1, -1, -1, 0, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, 0, 0, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, 0, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, 0, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, 0, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, 0, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, 0, 0, 1, 1, 2, 2, -1, -1, -1, -1, 2, 2, 1, 1, 0, 0, 0, 0, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, -1, -1, -1, -1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, -1, -1, -1, -1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, 0, 0, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, 0, 0, 0, 0, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, 0, 0, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 0, 0, 0, 0, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, 1, 1, 0, 0, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, 1, 1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 1, 1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 1, 1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 1, 1, -1],
	[-1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1],
	[-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1]
			];

			var map = new enchant.Map(16, 16);
			map.image = kimiko.core.assets[DF.IMAGE_MAP];
			map.loadData(blocks);
			map.x = 0;
			map.y = - map.height;
			group.addChild(map);
			group.onenterframe = () => {
				var player = this.player;
				// カメラ移動.
				var tx: number = (DF.SC1_W / 2) - player.cx + (-player.dirX * 16);
				var ty: number = (DF.SC1_H) - (player.y + player.height + 64);
				this.bg.x += (tx - this.bg.x) / 2;
				this.bg.y += (ty - this.bg.y) / 2;
				this.bg.x = Math.floor(this.bg.x);
				this.bg.y = Math.floor(this.bg.y);
			};

			for (var i: number = 0, iNum: number = 128; i < iNum; ++i) {
				// 背景.
				sprite = new enchant.Sprite(8, 8);
				sprite.backgroundColor = "rgb(64, 64, 32)"
				sprite.x = i * 100;
				sprite.y = DF.GROUND_Y - ((i % 3) * 50);
				group.addChild(sprite);
			}
			
			this.grounds = [];
			/*
			for (var i: number =0, iNum: number = 16; i < iNum; ++i) {
				sprite = new sprites.Ground();
				group.addChild(sprite);
				this.grounds[i] = sprite;
				sprite.x = i * 200;
				sprite.y = DF.GROUND_Y - 32;
			}
			*/
			this.ownBullets = [];
			for (var i: number = 0, iNum: number = 8; i < iNum; ++i) {
				sprite = new sprites.OwnBullet();
				group.addChild(sprite);
				this.ownBullets.push(sprite);
				sprite.visible = false;
			}
			
			this.enemyBullets = [];
			for (var i: number = 0, iNum: number = 32; i < iNum; ++i) {
				sprite = new sprites.EnemyBullet();
				group.addChild(sprite);
				this.enemyBullets.push(sprite);
				sprite.visible = false;
			}
			
			this.enemys = [];
			for (var i: number = 0, iNum: number = 1; i < iNum; ++i) {
				// 敵.
				sprite = new sprites.EnemyA();
				var anchor: utils.IVector2D = {
					x: 240 + i * 300,
					y: DF.GROUND_Y,
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
			for (var i: number = 0, iNum: number = 3; i < iNum; ++i) {
				sprite = new Label("");
				//this.addChild(sprite);
				this.labels.push(sprite);
				sprite.font = DF.FONT_M;
				sprite.color = "#fff";
				sprite.y = 12 * i;
			}
			
			// 操作エリア.
			sprite = new sprites.Sprite(DF.SC2_W, DF.SC2_H);
			this.addChild(sprite);
			this.controllArea = sprite;
			sprite.x = DF.SC2_X1;
			sprite.y = DF.SC2_Y1;
			sprite.backgroundColor = "rgb(64, 64, 64)";
			
			
			this.touch = new utils.Touch();
		},
		
		getNearEnemy: function (sprite, sqrDistanceThreshold) {
			var enemys = this.enemys;
			
			var getSqrDistance = function ( a, b ) {
				var dx = a.cx - b.cx;
				var dy = a.cy - b.cy;
				return (dx * dx) + (dy * dy);
			};
			
			var near = null;
			var nearSqrDistance = 0;
			for (var i = 0, iNum = enemys.length; i < iNum; ++i) {
				var enemy = enemys[i];
				if (enemy.isDead()) {
					continue;
				}
				var sqrDistance = getSqrDistance(sprite, enemy);
				if ( near === null ) {
					near = enemy;
					nearSqrDistance = sqrDistance;
				} else if ( sqrDistance < nearSqrDistance ) {
					near = enemy;
					nearSqrDistance = sqrDistance;
					
				}
			}
			return nearSqrDistance < sqrDistanceThreshold
				? near
				: null;
		},
		
		newEnemyBullet: function () {
			var old = null;
			for (var i = 0, iNum = this.enemyBullets.length; i < iNum; ++i) {
				var bullet = this.enemyBullets[i];
				if (!bullet.visible) {
					bullet.visible = true;
					return bullet;
				}
				old = bullet;
			}
			return bullet;
		},
		newOwnBullet: function () {
			var old = null;
			for (var i = 0, iNum = this.ownBullets.length; i < iNum; ++i) {
				var bullet = this.ownBullets[i];
				if (!bullet.visible) {
					bullet.visible = true;
					return bullet;
				}
				old = bullet;
			}
			return bullet;
		},
		intersectActiveArea: function (sprite) {
			var player = this.player;
			var minX: number = player.cx - DF.SC1_W;
			var maxX: number = player.cx + DF.SC1_W;
			if (minX <= sprite.cx && sprite.cx <= maxX) {
				return true;
			}
			return false;
		},
		ontouchstart: function (event) {
			var touch: utils.Touch = this.touch;
			touch.saveTouchStart(event.x, event.y);
			var player = this.player;
			player.anchorX = player.x;
			player.anchorY = player.y;
			player.vx = 0;
			player.vy = 0;
			player.useGravity = false;
		},
		ontouchmove: function (event) {
			var touch: utils.Touch = this.touch;
			var diffX = event.x - touch.startX;
			var diffY = event.y - touch.startY
			var player = this.player;
			var playerOldX = player.x;
			var playerOldY = player.y;

			var touchElpsedFrame = touch.getTouchElpsedFrame();
			touchElpsedFrame = 0;
			if (touchElpsedFrame < kimiko.secToFrame(0.5)) {
				player.x = player.anchorX + (diffX * 1.0);
				player.y = player.anchorY + (diffY * 1.0);
			}

			var dirChangeThreshold = kimiko.core.fps / 15;
			if (dirChangeThreshold <= Math.abs(player.x - playerOldX)) {
				player.dirX = kimiko.numberUtil.sign(player.x - playerOldX);
				player.scaleX = player.dirX;
			}
		},
		ontouchend: function (event) {
			var touch: utils.Touch = this.touch;
			touch.saveTouchEnd(event.x, event.y);
			this.labels[0].text = (<any[]>["touch end diff", Math.floor(touch.diffX), Math.floor(touch.diffY)]).join();
			
			var player = this.player;

			//player.vx += NumUtil.trim(touch.diffX * 0.05, -16, 16);
			
			if (Math.abs(touch.diffX) + Math.abs(touch.diffY) < 16) {
				player.attack();
			}
			player.useGravity = true;
		},
		onenterframe: function () {
			var player = this.player;
			//
			this.checkCollision();
			// 情報.
			this.labels[1].text = player.stateToString() + " fps:" + Math.round(kimiko.core.actualFps);
		},
		
		checkCollision: function () {
			var player = this.player;
			
			// 地形とプレイヤーの衝突判定.
			for (var i = 0, iNum = this.grounds.length; i < iNum; ++i) {
				var ground = this.grounds[i];
				if (!this.intersectActiveArea(ground)) {
					continue;
				}
				if (player.vy < 0) {
					continue;
				}
				if (ground.intersect(player)) {
					player.vy = 0;
					player.y = ground.y - player.height;
					break;
				}
			}
			
			
			// 敵弾とプレイヤーの衝突判定.
			if (true) {
				if (player.isNeutral() || player.isAttack()) {
					for (var i = 0, iNum = this.enemyBullets.length; i < iNum; ++i) {
						var bullet = this.enemyBullets[i];
						if (bullet.visible && player.intersect(bullet)) {
							player.damage(bullet);
							bullet.visible = false;
						}
					}
				}
			} else {
				if (player.isNeutral() || player.isAttack()) {
					sprites.EnemyBullet.collection.forEach((bullet)=>{
						if (bullet.visible && player.intersect(bullet)) {
							player.damage(bullet);
							bullet.visible = false;
						}
					});
				}
			}
			// 敵とプレイヤーの衝突判定.
			this.labels[2].text = "";
			for (var i = 0, iNum = this.enemys.length; i < iNum; ++i) {
				var enemy = this.enemys[i];
				if (enemy.isDead() || player.isDead() || enemy.isDamage() || player.isDamage()) {
					continue;
				}
				if (player.intersect(enemy)) {
					this.labels[2].text = "hit";
					if (player.isAttack() && enemy.isAttack()) {
						// 両方攻撃してたら、後出しの勝ち.
						if (enemy.attackCnt <= player.attackCnt) {
							enemy.damage(player);
						} else {
							player.damage(enemy);
						}
					} else if (player.isAttack() && !enemy.isDamage()) {
						enemy.damage(player);
					} else if (enemy.isAttack() && !player.isDamage()) {
						player.damage(enemy);
					}
				}
			}
			// 敵とプレイヤー弾の衝突判定.
			for (var i = 0, iNum = this.enemys.length; i < iNum; ++i) {
				var enemy = this.enemys[i];
				if (enemy.isDead() || enemy.isDamage()) {
					continue;
				}
				for (var j = 0, jNum = this.ownBullets.length; j < jNum; ++j) {
					var bullet = this.ownBullets[j];
					if (bullet.visible && enemy.intersect(bullet)) {
						enemy.damage(bullet);
						bullet.visible = false;
					}
				}
			}
		},
	});
}

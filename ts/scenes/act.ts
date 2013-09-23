//
/// <reference path="enemyBrains.ts" />
/// <reference path="weapon.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.scenes {

	var Class = enchant.Class;
	var Core = enchant.Core;
	var Scene = enchant.Scene;
	var Label = enchant.Label;
	var Event = enchant.Event;
	var Easing = enchant.Easing;

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

			var scene = this.scene;
			var camera = this.scene.camera;

			if (camera.isOutsideSleepRect(this)) {
					this.visible = false;
					return;
			}
					
			if (!this.scene.intersectActiveArea(this)) {
				this.visible = false;
				return;
			}
			scene.checkMapCollision(this);
		},
			
		onMapHit: function () {
				this.visible = false;
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
			var scene = this.scene;
			var camera = this.scene.camera;
			++this.visibleCnt;

			if (camera.isOutsideSleepRect(this)) {
					this.visible = false;
					this.visibleCnt = 0;
					return;
			}
					
			if (!this.scene.intersectActiveArea(this)) {
				this.visible = false;
				this.visibleCnt = 0;
				return;
			}

			scene.checkMapCollision(this);

		},

		onMapHit: function () {
			this.visible = false;
			this.visibleCnt = 0;
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
			this.life.damage(1);
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
			this.image = kimiko.core.assets[Assets.IMAGE_CHARA001]
			this.animWalk = kimiko.getAnimFrames(DF.ANIM_ID_CHARA001_WALK);
			this.animStand = kimiko.getAnimFrames(DF.ANIM_ID_CHARA001_STAND);
			this.frame = this.animStand;
			this.width = 32;
			this.height = 32;
			this.life.hpMax = DF.PLAYER_HP;
			this.life.hp = this.life.hpMax;
			this.anchorX = 0;
			this.anchorY = 0;
			this.useGravity = true;
			this.isOnMap = false;
			this.targetEnemy = null;
			this.limitRect = new utils.Rect( 0, 0, DF.SC_W, DF.SC_H );

			this.addEventListener(Event.ENTER_FRAME, () => {
				this.stepMove();
					
				if (this.targetEnemy === null) {
					var scene = this.scene;
					if ((this.age % kimiko.secToFrame(0.2)) === 0) {
						this.targetEnemy = scene.getNearEnemy(this, 128 * 128);
					}
				} else {
					if (this.targetEnemy.life.isDead()) {
						// 敵が死んでたら解除.
						this.targetEnemy = null;
					}
					if (this.targetEnemy !== null) {
						var distance = utils.Vector2D.distance(this, this.targetEnemy);
						var threshold = DF.SC_W / 2;
						if (threshold < distance) {
							// 敵が離れたら解除.
							this.targetEnemy = null;
						} else {
							this.dirX = kimiko.numberUtil.sign(this.targetEnemy.x - this.x);
							this.scaleX = this.dirX;
							if ((this.age % kimiko.secToFrame(0.2)) === 0) {
								if (distance < 128) {
									this.attack();
								}
							}
						}
					}
				}
			});
		},

		stateToString: function () {
			var str = Attacker.prototype.stateToString.call(this);
			str += " hp:" + this.life.hp + " L:" + (this.targetEnemy !== null ? "o" : "x");
			return str;
		},

		attack: function () {
			var bullet = this.scene.newOwnBullet();
			if (bullet === null) {
				return;
			}
			bullet.vx = this.dirX * kimiko.dpsToDpf(200);
			bullet.vy = 0;
			bullet.cx = this.cx;
			bullet.cy = this.cy;
		},

		stepMove: function () {
			var scene = this.scene;
			var input = kimiko.core.input;
			var flag = ((input.left ? 1 : 0) << 0)
				| ((input.right ? 1 : 0) << 1)
				| ((input.up ? 1 : 0) << 2)
				| ((input.down ? 1 : 0) << 3);
			if (flag !== 0) {
				this.vx = DF.DIR_FLAG_TO_VECTOR2D[flag].x * 4;
				this.vy = DF.DIR_FLAG_TO_VECTOR2D[flag].y * 4;
			}

			if (!this.targetEnemy) {
				if (0 !== this.vx) {
					this.dirX = kimiko.numberUtil.sign(this.vx);
					this.scaleX = this.dirX;
				}
			}

			if (this.vx !== 0 || this.vy !== 0) {
				if (this.animWalk !== this.frame) {
					this.frame = this.animWalk;
				}
			} else {
				if (this.animStand !== this.frame) {
					this.frame = this.animStand;
				}
			}

			if (this.useGravity && !this.isOnMap) {
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

			scene.checkMapCollision(this);
			utils.Rect.trimPos(this, this.limitRect, this.onTrim);

			var touch: utils.Touch = scene.touch;
			if (touch.isTouching || flag !== 0) {
				this.vx = 0;
				this.vy = 0;
			}
		},
			
		onTrim: function (x: number, y: number) {
			if (x !== 0) { this.vx = 0; }
			if (y !== 0) { this.vy = 0; }
		},

	});

	// 敵はしかれたレールをなぞるだけ。
	export var EnemyA = Class.create(Attacker, {
		initialize: function () {
			Attacker.call(this);

			this.enemyId = -1;
			this.weapon = new WeaponA(this);
			this.anchor = new utils.Vector2D();
			this.addEventListener(Event.ENTER_FRAME, () => {
				this.weapon.step();
			});
		},
		
		getEnemyData: function () { return EnemyData[this.enemyId]; },
		isBoss: function () { return this.enemyId === DF.ENEMY_ID_BOSS; },

	});
	
	export class MapCharaManager {
		scene: any;
		sleeps: any[] = [];
		actives: any[] = [];
		deads: any[] = [];
		
		constructor(scene: any) {
			this.scene = scene;
		}

		public addSleep(sleep: any): void {
			this.sleeps.push(sleep);
		}

		public step(): void {
			this.checkSpawn();
			this.checkSleep();
		}

		public getAliveCount(): number {
			return this.sleeps.length + this.actives.length;
		}

		// 画面内に入ったキャラを発生させる。
		private checkSpawn(): void {
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
		}

		// 画面外に出たキャラを休ませるか棺送りにする。
		private checkSleep(): void {
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
		}
	}

	var Camera: any = Class.create(enchant.Node, {
		initialize: function () {
			enchant.Node.call(this);

			this.width = DF.SC1_W;
			this.height = DF.SC1_H;
			this.limitRect = new utils.Rect(0, 0, 320, 320);
			this.sleepRect = {
				x: 0,
				y: 0,
				width: this.width + 128,
				height: this.height + 128,
			};
			this.spawnRect = {
				x: 0,
				y: 0,
				width: this.width + 32,
				height: this.height + 32,
			};
			this.targetGroup = null;
		},

		onenterframe: function () {
			var camera = this;
			var player = this.scene.player;
			// カメラ移動.
			// プレイヤーからどれだけずらすか。
			// 前方は後方より少しだけ先が見えるようにする。
			var tx: number = player.cx - (camera.width / 2) + (player.dirX * 16);
			var ty: number = player.cy - (camera.height / 2);
			var speed = kimiko.dpsToDpf(8 * 60);
			var dx = tx - camera.x;
			var dy = ty - camera.y;
			var mx = 0;
			var my = 0;
			var distance = utils.Vector2D.magnitude({ x: dx, y: dy });

			if (speed < distance) {
				mx = dx * speed / distance;
				my = dy * speed / distance;
			} else {
				mx = dx;
				my = dy;
			}
			camera.x = Math.floor(camera.x + mx);
			camera.y = Math.floor(camera.y + my);

			utils.Rect.trimPos(camera, camera.limitRect);

			//
			var group = this.targetGroup;
			if (group) {
				group.x = -camera.x;
				group.y = -camera.y;
			}
		},

		isIntersectSpawnRect: function (entity: utils.IRect) {
				var rect: utils.IRect = this.spawnRect;
				rect.x = this.x -((rect.width -this.width) / 2);
				rect.y = this.y -((rect.height -this.height) / 2);
				return utils.Rect.inside(rect, entity);
		},

		isOutsideSleepRect: function (entity: utils.IRect) {
			var rect: utils.IRect = this.sleepRect;
			rect.x = this.x - ((rect.width - this.width) / 2);
			rect.y = this.y - ((rect.height - this.height) / 2);
			return utils.Rect.outside(rect, entity);
		},
	});

	export var GameStart: any = Class.create(Scene, {
		initialize: function () {
			Scene.call(this);
			
			var scene = this;
			//
			var bg1 = new Sprite(DF.SC1_W, DF.SC1_H);
			((sprite: any) => {
				sprite.x = 0;
				sprite.y = 0;
				sprite.image = kimiko.core.assets[Assets.IMAGE_GAME_START_BG];
			}(bg1));
			//
			var label1 = new enchant.Label("GOOD NIGHT...");
			((label: any) => {
				label.font = DF.FONT_M;
				label.width = DF.SC_W;
				label.height = 12;
				label.color = "rgb(255, 255, 255)";
				label.textAlign = "center";
				var ax = (DF.SC1_W - label.width) / 2;
				var ay = (DF.SC1_H - label.height) / 2;
				label.x = ax;
				label.y = ay;
				label.tl.
					moveTo(ax + 0, ay + 8, kimiko.secToFrame(1.0), Easing.SIN_EASEINOUT).
					moveTo(ax + 0, ay - 8, kimiko.secToFrame(1.0), Easing.SIN_EASEINOUT).
					loop();
			}(label1));
			//
			var fadeFilm = new Sprite(DF.SC_W, DF.SC_H);
			((sprite: any) => {
				sprite.x = 0;
				sprite.y = 0;
				sprite.backgroundColor = "rgb(0, 0, 0)";
			}(fadeFilm));

			var layer1 = new enchant.Group();
			layer1.addChild(bg1);
			layer1.addChild(label1); 
			//
			scene.backgroundColor = "rgb(0, 0, 0)";
			scene.addChild(layer1);
			scene.addChild(fadeFilm);
			(() => {
				var next = () => {
					kimiko.core.replaceScene(new scenes.Act());
				};
				scene.tl.
					then(() => { fadeFilm.tl.fadeTo(0.0, kimiko.secToFrame(0.5)); }).
					delay(kimiko.secToFrame(0.5)).
					delay(kimiko.secToFrame(2.0)).
					then(() => { fadeFilm.tl.fadeTo(1.0, kimiko.secToFrame(0.5)); }).
					delay(kimiko.secToFrame(0.5)).
					then(next);
					scene.addEventListener(Event.TOUCH_END, next);
					scene.addEventListener(Event.A_BUTTON_UP, next);
			}());
		},

	});
	
	export var GameOver: any = Class.create(Scene, {
		initialize: function () {
			Scene.call(this);
			
			var scene = this;
			//
			var label1 = new enchant.Label("GAME OVER");
			((label: any) => {
				label.font = DF.FONT_M;
				label.width = DF.SC_W;
				label.height = 12;
				label.color = "rgb(255, 255, 255)";
				label.textAlign = "center";
				var ax = (DF.SC1_W - label.width) / 2;
				var ay = (DF.SC1_H - label.height) / 2;
				label.x = ax;
				label.y = ay;
				label.tl.
					moveTo(ax + 0, ay + 8, kimiko.secToFrame(1.0), Easing.SIN_EASEINOUT).
					moveTo(ax + 0, ay - 8, kimiko.secToFrame(1.0), Easing.SIN_EASEINOUT).
					loop();
			}(label1));
			//
			var layer1 = new enchant.Group();
			layer1.addChild(label1); 
			//
			scene.addChild(layer1);
		}
	});
	export var GameClear: any = Class.create(Scene, {
		initialize: function () {
			Scene.call(this);
			
			var scene = this;
			//
			var label1 = new enchant.Label("GAME CLEAR!");
			((label: any) => {
				label.font = DF.FONT_M;
				label.width = DF.SC_W;
				label.height = 12;
				label.color = "rgb(255, 255, 255)";
				label.textAlign = "center";
				var ax = (DF.SC1_W - label.width) / 2;
				var ay = (DF.SC1_H - label.height) / 2;
				label.x = ax;
				label.y = ay;
				label.tl.
					moveTo(ax + 0, ay + 8, kimiko.secToFrame(1.0), Easing.SIN_EASEINOUT).
					moveTo(ax + 0, ay - 8, kimiko.secToFrame(1.0), Easing.SIN_EASEINOUT).
					loop();
			}(label1));
			//
			var layer1 = new enchant.Group();
			layer1.addChild(label1); 
			//
			scene.addChild(layer1);
		}
	});

	export var Act: any = Class.create(Scene, {
		initialize: function () {
			Scene.call(this);

			var scene = this;

			// systems
			this.state = this.stateGameStart;
			this.score = 0;
			this.timeLimitCounter = 0;
			this.timeLimit = kimiko.secToFrame(180);
			this.statusTexts = [
				[], [], [], [],
			];
			//
			this.backgroundColor = "rgb(32, 32, 64)";
			var sprite;

			var world = new enchant.Group();
			this.world = world;
			scene.addChild(world);


			var map = new enchant.Map(DF.MAP_TILE_W, DF.MAP_TILE_H);
			this.map = map;
			map.image = kimiko.core.assets[Assets.IMAGE_MAP];
			map.x = 0;
			map.y = 0;
			if (map._style) {
				// for enchant-0.5.x
				// マップがなぜか手前に来てしまうので、zIndex指定しちゃう。
				map._style.zIndex = -1;
			}
			world.addChild(map);

			// 1カメ.
			var camera = new Camera();
			this.camera = camera;
			camera.targetGroup = world;
			world.addChild(camera);

			this.ownBullets = [];
			for (var i: number = 0, iNum: number = DF.PLAYER_BULLET_NUM; i < iNum; ++i) {
				sprite = new OwnBullet();
				world.addChild(sprite);
				this.ownBullets.push(sprite);
				sprite.visible = false;
			}
			
			this.enemyBullets = [];
			for (var i: number = 0, iNum: number = 32; i < iNum; ++i) {
				sprite = new EnemyBullet();
				world.addChild(sprite);
				this.enemyBullets.push(sprite);
				sprite.visible = false;
			}
			
			sprite = new Player();
			this.player = sprite;
			world.addChild(sprite);
			sprite.x = 0;
			sprite.y = this.map.height - sprite.height;
			
			(() => {
				// 操作エリア.
				var group = new enchant.Group();
				this.statusGroup = group;
				this.addChild(group);
				group.x = DF.SC2_X1;
				group.y = DF.SC2_Y1;

				// 背景.
				sprite = new Sprite(DF.SC2_W, DF.SC2_H);
				group.addChild(sprite);
				this.controllArea = sprite;
				sprite.x = 0;
				sprite.y = 0;
				sprite.backgroundColor = "rgb(64, 64, 64)";

				// labels
				this.labels = [];
				var texts: string[][] = this.statusTexts;
				for (var i: number = 0, iNum: number = texts.length; i < iNum; ++i) {
					sprite = new Label("");
					group.addChild(sprite);
					this.labels.push(sprite);
					sprite.font = DF.FONT_M;
					sprite.color = "#fff";
					sprite.y = 12 * i;
				}

			}());
			
			this.mapCharaMgr = new MapCharaManager(this);
			this.touch = new utils.Touch();
			this.loadMapData( jp.osakana4242.kimiko["mapData"] );

		},

		//---------------------------------------------------------------------------
		ontouchstart: function (event) {
			var touch: utils.Touch = this.touch;
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
			var touch: utils.Touch = this.touch;
			touch.saveTouchMove(event);
			var player = this.player;
			var playerOldX = player.x;
			var playerOldY = player.y;
			if (player.animWalk !== player.frame) {
				player.frame = player.animWalk;
			}

			var touchElpsedFrame = touch.getTouchElpsedFrame();
			touchElpsedFrame = 0;
			if (touchElpsedFrame < kimiko.secToFrame(0.5)) {
				var moveLimit = DF.TOUCH_TO_CHARA_MOVE_LIMIT;
				var moveRate = DF.TOUCH_TO_CHARA_MOVE_RATE;
				if (DF.PLAYER_TOUCH_ANCHOR_ENABLE) {
					var tv = new utils.Vector2D(
						player.anchorX + touch.totalDiff.x * moveRate,
						player.anchorY + touch.totalDiff.y * moveRate);
					var v = new utils.Vector2D(
						tv.x - player.x,
						tv.y - player.y
						);
					var vm = Math.min(utils.Vector2D.magnitude(v), moveLimit);
					utils.Vector2D.normalize(v);
					v.x *= vm;
					v.y *= vm;
					player.vx = v.x;
					player.vy = v.y;
				} else {
					player.vx = kimiko.numberUtil.trim(touch.diff.x * moveRate, -moveLimit, moveLimit);
					player.vy = kimiko.numberUtil.trim(touch.diff.y * moveRate, -moveLimit, moveLimit);
				}
			}
		},

		ontouchend: function (event) {
			var touch: utils.Touch = this.touch;
			touch.saveTouchEnd(event);
			// this.statusTexts[0][1] = (<any[]>["touch end diff", Math.floor(touch.totalDiff.x), Math.floor(touch.totalDiff.y)]).join();
			
			var player = this.player;
			player.frame = player.animStand;
			player.vx = 0;
			player.vy = 0;
			//player.vx += NumUtil.trim(touch.diffX * 0.05, -16, 16);
			
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
		
		stateGameStart: function () {
			var scene = this;
			scene.state = scene.stateNormal;
			
			var sound = kimiko.core.assets[Assets.SOUND_BGM];
			var soundSec = 15.922 + 0.5;
			var replay = () => {
				// sound.play();
				if (!scene.state === scene.stateNormal) {
					return;
				}
				window.setTimeout(replay, Math.floor(soundSec * 1000));
			};	
			replay();
		},
					
		stateNormal: function () {
			var player = this.player;
			//
			var mapCharaMgr: MapCharaManager = this.mapCharaMgr;
			mapCharaMgr.step();
			//
			this.checkCollision();
			//
			if (this.countTimeLimit()) {
				// タイムオーバー.
				this.state = this.stateGameOver;
			}
		},

		stateGameOver: function () {
			kimiko.core.pushScene(new GameOver());
			this.state = this.stateGameStart;
		},

		stateGameClear: function () {
			kimiko.core.pushScene(new GameClear());
			this.state = this.stateGameStart;
		},

		//---------------------------------------------------------------------------

		loadMapData: function (mapData: utils.IMapData) {
			var map = this.map;
			this.timeLimit = kimiko.secToFrame(180);
			this.timeLimitCounter = 0;

			(() => {
				var layer = mapData.layers[0];
				map.loadData(layer.tiles);

				// コリジョン自動生成.
				var collisionData = [];
				for (var y = 0, yNum = layer.tiles.length; y < yNum; ++y) {
					var line = [];
					for (var x = 0, xNum = layer.tiles[y].length; x < xNum; ++x) {
						line.push(layer.tiles[y][x] !== -1);
					}
					collisionData.push(line);
				}
				map.collisionData = collisionData;
			}());

			// 敵, スタート地点.
			(() => {
				var mapCharaMgr: MapCharaManager = this.mapCharaMgr;
				var layer = mapData.layers[1];
				for (var y = 0, yNum = layer.tiles.length; y < yNum; ++y) {
					for (var x = 0, xNum = layer.tiles[y].length; x < xNum; ++x) {
						var charaId = layer.tiles[y][x];
						if (charaId === -1) {
							continue;
						}
						var left = x * DF.MAP_TILE_W;
						var top = y * DF.MAP_TILE_H;

						if (charaId === 40) {
							var player = this.player;
							player.x = left + (DF.MAP_TILE_W - player.width) / 2;
							player.y = top + (DF.MAP_TILE_H - player.height);
						} else if (48 <= charaId) {
							var enemyId = charaId - 48;
							var data = EnemyData[enemyId]
							var enemy = new EnemyA();
							enemy.enemyId = enemyId;
							enemy.life.hpMax = data.hpMax;
							enemy.life.hp = enemy.life.hpMax;
							data.body(enemy);
							
							var center = left + (enemy.width / 2);
							var bottom = top + (DF.MAP_TILE_H - enemy.height);
							var anchor = new utils.Vector2D(center, bottom);
							utils.Vector2D.copyFrom(enemy.anchor, anchor);
							enemy.x = anchor.x;
							enemy.y = anchor.y;
						data.brain(enemy);
							mapCharaMgr.addSleep(enemy);
						}
					}
				}
			} ());
			var camera = this.camera;
			camera.limitRect.x = 0;
			camera.limitRect.y = 0;
			camera.limitRect.width = map.width;
			camera.limitRect.height = map.height + (DF.SC1_H / 2);
			
			var player = this.player;
			utils.Rect.copyFrom(player.limitRect, camera.limitRect);
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
			var mapCharaMgr: MapCharaManager = this.mapCharaMgr;
			var enemys = mapCharaMgr.actives;
			
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
			// return bullet; // 弾が消えるまで再利用不可に.
			return null;
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
		
		/** タイムオーバーになったらtrue. */
		countTimeLimit: function () {
			if (this.timeLimit <= this.timeLimitCounter) {
				return true;
			}
			++this.timeLimitCounter;
			return this.timeLimit <= this.timeLimitCounter;
		},


		updateStatusText: function () {
			var scene = this;
			var player = this.player;
			var mapCharaMgr: MapCharaManager = this.mapCharaMgr;
			//" fps:" + Math.round(kimiko.core.actualFps)
			var texts: string[][] = this.statusTexts;
			texts[0][0] = "SC " + scene.score + " " +
				"TIME " + Math.floor(kimiko.frameToSec(this.timeLimit - this.timeLimitCounter));	
			texts[1][0] = "LIFE " + player.life.hp;
			//texts[1][0] = player.stateToString()
			//texts[2][0] = "actives:" + mapCharaMgr.actives.length + " " +
			//	"sleeps:" + mapCharaMgr.sleeps.length;
			//
			for (var i = 0, iNum = texts.length; i < iNum; ++i) {
				var line = texts[i].join(" ");
				this.labels[i].text = line;
			}
		},

		checkMapCollision: function (player) {
			// 地形とプレイヤーの衝突判定.
			// 自分の周囲の地形を調べる.
			var map = this.map;
			var xDiff = map.tileWidth;
			var yDiff = map.tileHeight;
			var xMin = player.x;
			var yMin = player.y;
			var xMax = player.x + player.width + (xDiff - 1);
			var yMax = player.y + player.height + (yDiff - 1);
			var hoge = 8;
			var isHit = false;
			for (var y = yMin; y < yMax; y += yDiff) {
				for (var x = xMin; x < xMax; x += xDiff) {
					if (!map.hitTest(x, y)) {
						continue;
					}
					var rect = new utils.Rect(
						Math.floor(x / map.tileWidth) * map.tileWidth,
						Math.floor(y / map.tileHeight) * map.tileHeight,
						map.tileWidth,
						map.tileHeight
					);
					if (!utils.Rect.intersect(player, rect)) {
						continue;
					}
					// TODO: たま消しのときは無駄になってしまうので省略したい
					if (!map.hitTest(x, y - yDiff) && 0 <= player.vy && player.y <= rect.y + hoge) {
						// top
						player.y = rect.y - player.height;
						player.vy = 0;
						//player.isOnMap = true;
						isHit = true;
					} else if (!map.hitTest(x, y + yDiff) && player.vy <= 0 && rect.y + rect.height - hoge < player.y + player.height) {
						// bottom
						player.y = rect.y + rect.height;
						player.vy = 0;
						isHit = true;
					} else if (!map.hitTest(x - xDiff, y) && 0 <= player.vx && player.x <= rect.x + hoge) {
						// left
						player.x = rect.x - player.width;
						player.vx = 0;
						isHit = true;
					} else if (!map.hitTest(x + xDiff, y) && player.vx <= 0 && rect.x + rect.width - hoge < player.x + player.width) {
						// right
						player.x = rect.x + rect.width;
						player.vx = 0;
						isHit = true;
					}
				}
			}
			if (isHit && player.onMapHit) {
					player.onMapHit();
			}
		},

		checkCollision: function () {
			var scene = this;
			var mapCharaMgr: MapCharaManager = this.mapCharaMgr;
			var player = this.player;
			var enemys = mapCharaMgr.actives;

			// プレイヤーと敵弾の衝突判定.
			if (player.isNeutral() || player.isAttack()) {
				for (var i = 0, iNum = this.enemyBullets.length; i < iNum; ++i) {
					var bullet = this.enemyBullets[i];
					if (bullet.visible && player.life.isAlive() && player.intersect(bullet)) {
						player.damage(bullet);
						bullet.visible = false;
						if (player.life.isDead()) {
							this.onPlayerDead();
						}
					}
				}
			}
			// 敵とプレイヤー弾の衝突判定.
			for (var i = 0, iNum = enemys.length; i < iNum; ++i) {
				var enemy = enemys[i];
				if (enemy.isDead() || enemy.isDamage()) {
					continue;
				}
				for (var j = 0, jNum = this.ownBullets.length; j < jNum; ++j) {
					var bullet = this.ownBullets[j];
					if (bullet.visible && enemy.intersect(bullet)) {
						enemy.damage(bullet);
						scene.score += 10;
						if (enemy.life.isDead()) {
							var ed: IEnemyData = enemy.getEnemyData();
							scene.score += ed.score;
							if (enemy.isBoss()) {
								scene.onBossDead();
							}
						}
						bullet.visible = false;
					}
				}
			}
		},
	});
}
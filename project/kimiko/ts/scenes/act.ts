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
				this.animWalk = kimiko.getAnimFrames(DF.ANIM_ID_CHARA001_WALK);
				this.animStand = kimiko.getAnimFrames(DF.ANIM_ID_CHARA001_STAND);
				this.frame = this.animStand;
				this.width = 32;
				this.height = 32;
				this.life.hpMax = 500;
				this.life.hp = this.life.hpMax;
				this.anchorX = 0;
				this.anchorY = 0;
				this.useGravity = true;
				this.isOnMap = false;

				this.addEventListener(Event.ENTER_FRAME, () => {
					this.stepMove();
					
					// 敵が近くにいれば攻撃.
					var scene = this.scene;
					if ((this.age % kimiko.secToFrame(0.2)) === 0) {
						var nearEnemy = scene.getNearEnemy(this, 128 * 128);
						if (nearEnemy !== null) {
							this.attack();
						}
					}

				});
			},

			stateToString: function () {
				var str = Attacker.prototype.stateToString.call(this);
				str += " hp:" + this.life.hp + " G:" + (this.isOnMap ? "o" : "x");
				return str;
			},

			attack: function () {
				var bullet = this.scene.newOwnBullet();
				bullet.vx = this.dirX * kimiko.dpsToDpf(200);
				bullet.vy = 0;
				bullet.cx = this.cx;
				bullet.cy = this.cy;
			},

			stepMove: function () {
				var scene = this.scene;
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

				var map = this.scene.map;
				if (map.height < this.y + this.height) {
					this.y = map.height - this.height;
					this.vy = 0;
				}

				var touch: utils.Touch = scene.touch;
				if (touch.isTouching) {
					this.vx = 0;
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


		// 敵はしかれたレールをなぞるだけ。
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

			// 左右に行ったりきたり
			brain1: function (anchor: utils.IVector2D) {
				var range = 16;
				this.anchor.x = anchor.x;
				this.anchor.y = anchor.y;
				this.x = this.anchor.x;
				this.y = this.anchor.y;
				var waitFire = () => { return !this.weapon.isStateFire(); };
				this.tl
					.moveTo(this.anchor.x + range, this.anchor.y, kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN)
					.moveTo(this.anchor.x - range, this.anchor.y, kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN)
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
					.loop();
			},

			// 三角形
			brain2: function (anchor: utils.IVector2D) {
				var range = 16;
				this.anchor.x = anchor.x;
				this.anchor.y = anchor.y;
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
				if (!camera.isInsideSpawnRect(chara)) {
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

				if (camera.isInsideSleepRect(chara)) {
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
			this.sleepRect = {
				x: 0,
				y: 0,
				width: this.width + 96,
				height: this.height + 96,
			};
			this.spawnRect = {
				x: 0,
				y: 0,
				width: this.width + 8,
				height: this.height + 8,
			};
			this.targetGroup = null;
		},

		onenterframe: function () {
			var camera = this;
			var player = this.scene.player;
			// カメラ移動.
			// プレイヤーからどれだけずらすか。
			var tx: number = player.cx - (camera.width / 2) + (player.dirX * 32);
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
			//
			var group = this.targetGroup;
			if (group) {
				group.x = -camera.x;
				group.y = -camera.y;
			}
		},

		isInsideSpawnRect: function (entity: utils.IRect) {
				var rect: utils.IRect = this.spawnRect;
				rect.x = this.x -((rect.width -this.width) / 2);
				rect.y = this.y -((rect.height -this.height) / 2);
				return utils.Rect.inside(rect, entity);
		},

		isInsideSleepRect: function (entity: utils.IRect) {
			var rect: utils.IRect = this.sleepRect;
			rect.x = this.x - ((rect.width - this.width) / 2);
			rect.y = this.y - ((rect.height - this.height) / 2);
			return utils.Rect.inside(rect, entity);
		},
	});

	export var Act: any = Class.create(Scene, {
		initialize: function () {
			Scene.call(this);

			var scene = this;
			this.backgroundColor = "rgb(32, 32, 64)";
			var sprite;

			var world = new enchant.Group();
			this.world = world;
			scene.addChild(world);


			var map = new enchant.Map(DF.MAP_TILE_W, DF.MAP_TILE_H);
			this.map = map;
			map.image = kimiko.core.assets[DF.IMAGE_MAP];
			map.x = 0;
			map.y = 0;
			world.addChild(map);

			// 1カメ.
			var camera = new Camera();
			this.camera = camera;
			camera.targetGroup = world;
			world.addChild(camera);

			this.ownBullets = [];
			for (var i: number = 0, iNum: number = 8; i < iNum; ++i) {
				sprite = new sprites.OwnBullet();
				world.addChild(sprite);
				this.ownBullets.push(sprite);
				sprite.visible = false;
			}
			
			this.enemyBullets = [];
			for (var i: number = 0, iNum: number = 32; i < iNum; ++i) {
				sprite = new sprites.EnemyBullet();
				world.addChild(sprite);
				this.enemyBullets.push(sprite);
				sprite.visible = false;
			}
			
			sprite = new sprites.Player();
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

				sprite = new sprites.Sprite(DF.SC2_W, DF.SC2_H);
				group.addChild(sprite);
				this.controllArea = sprite;
				sprite.x = 0;
				sprite.y = 0;
				sprite.backgroundColor = "rgb(64, 64, 64)";

				this.labels = [];
				for (var i: number = 0, iNum: number = 4; i < iNum; ++i) {
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

		loadMapData: function (mapData: utils.IMapData) {
			var map = this.map;

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
							var enemyId = charaId - 48 + 1;
							var enemy = new sprites.EnemyA();
							// center, bottom で配置.
							var anchor: utils.IVector2D = {
								"x": left + (enemy.width / 2),
								"y": top + (DF.MAP_TILE_H - enemy.height),
							};
							enemy["brain" + enemyId](anchor);
							mapCharaMgr.addSleep(enemy);
						}
					}
				}
			} ());
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
				var moveLimit = 30;
				if (DF.PLAYER_TOUCH_ANCHOR_ENABLE) {
					var tv = new utils.Vector2D(
						player.anchorX + touch.totalDiff.x * 1.5,
						player.anchorY + touch.totalDiff.y * 1.5);
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
					player.vx = kimiko.numberUtil.trim(touch.diff.x * 1.5, -moveLimit, moveLimit);
					player.vy = kimiko.numberUtil.trim(touch.diff.y * 1.5, -moveLimit, moveLimit);
				}
			}

			var dirChangeThreshold = kimiko.core.fps / 20;
			if (dirChangeThreshold <= Math.abs(player.vx)) {
				player.dirX = kimiko.numberUtil.sign(player.vx);
				player.scaleX = player.dirX;
			}
		},

		ontouchend: function (event) {
			var touch: utils.Touch = this.touch;
			touch.saveTouchEnd(event);
			this.labels[0].text = (<any[]>["touch end diff", Math.floor(touch.totalDiff.x), Math.floor(touch.totalDiff.y)]).join();
			
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
			var player = this.player;
			//
			var mapCharaMgr: MapCharaManager = this.mapCharaMgr;
			mapCharaMgr.step();
			//
			this.checkCollision();
			// 情報.
			//" fps:" + Math.round(kimiko.core.actualFps)
			this.labels[1].text = player.stateToString()
			this.labels[2].text = "actives:" + mapCharaMgr.actives.length + " sleeps:" + mapCharaMgr.sleeps.length;
		},
		//---------------------------------------------------------------------------


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
					if (!map.hitTest(x, y - yDiff) && 0 <= player.vy && player.y <= rect.y + hoge) {
						// top
						player.y = rect.y - player.height;
						player.vy = 0;
						//player.isOnMap = true;
					} else if (!map.hitTest(x, y + yDiff) && player.vy <= 0 && rect.y + rect.height - hoge < player.y + player.height) {
						// bottom
						player.y = rect.y + rect.height;
						player.vy = 0;
					} else if (!map.hitTest(x - xDiff, y) && 0 <= player.vx && player.x <= rect.x + hoge) {
						// left
						player.x = rect.x - player.width;
						player.vx = 0;
					} else if (!map.hitTest(x + xDiff, y) && player.vx <= 0 && rect.x + rect.width - hoge < player.x + player.width) {
						// right
						player.x = rect.x + rect.width;
						player.vx = 0;
					}
				}
			}
		},

		checkCollision: function () {
			var mapCharaMgr: MapCharaManager = this.mapCharaMgr;
			var player = this.player;
			var enemys = mapCharaMgr.actives;

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
			this.labels[3].text = "";
			for (var i = 0, iNum = enemys.length; i < iNum; ++i) {
				var enemy = enemys[i];
				if (enemy.isDead() || player.isDead() || enemy.isDamage() || player.isDamage()) {
					continue;
				}
				if (player.intersect(enemy)) {
					this.labels[3].text = "hit";
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
			for (var i = 0, iNum = enemys.length; i < iNum; ++i) {
				var enemy = enemys[i];
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

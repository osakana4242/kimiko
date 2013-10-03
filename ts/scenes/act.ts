// references
/// <reference path="../kimiko.ts" />
/// <reference path="weapon.ts" />
/// <reference path="mapCharas.ts" />
/// <reference path="enemyBrains.ts" />
/// <reference path="player.ts" />
/// <reference path="camera.ts" />
//

declare var enchant: any;

module jp.osakana4242.kimiko.scenes {

	var Class = enchant.Class;
	var Core = enchant.Core;
	var Scene = enchant.Scene;
	var Label = enchant.Label;
	var Event = enchant.Event;
	var Easing = enchant.Easing;

	export class Life {
		hp: number;
		hpMax: number;
		ghostFrameCounter: number;
		ghostFrameMax: number;
		damageListener: () => void;

		constructor() {
			this.hpMax = 100;
			this.hp = this.hpMax;
			this.ghostFrameMax = kimiko.secToFrame(1.0);
			this.ghostFrameCounter = this.ghostFrameMax;
		}

		public setGhostFrameMax(frameMax: number) {
			this.ghostFrameMax = frameMax;
			this.ghostFrameCounter = frameMax;
		}

		public step(): void {
			if (this.isGhostTime()) {
				++this.ghostFrameCounter;
			}
		}

		public isAlive(): bool { return 0 < this.hp; }
		public isDead(): bool { return !this.isAlive(); }
		/** 無敵時間. */
		public isGhostTime(): bool { return this.ghostFrameCounter < this.ghostFrameMax; }
		public canAddDamage(): bool { return this.isAlive() && !this.isGhostTime(); }

		public damage(v: number): void {
			this.hp -= v;
			this.ghostFrameCounter = 0;
			if (this.damageListener) {
				this.damageListener();
			}
		}
		
		public recover(): void {
			this.hp = this.hpMax;
			this.ghostFrameCounter = this.ghostFrameMax;
		}
	}
	
	export class MapCharaManager {
		scene: any;
		sleeps: any[] = [];
		actives: any[] = [];
		deads: any[] = [];
		
		constructor(scene: any) {
			this.scene = scene;
		}

		public clear(): void {
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

	export var GameStart: any = Class.create(Scene, {
		initialize: function () {
			Scene.call(this);
			
			var scene = this;
			//
			var bg1 = new utils.Sprite(DF.SC1_W, DF.SC1_H);
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
			var fadeFilm = new utils.Sprite(DF.SC_W, DF.SC_H);
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
			//
			scene.addEventListener(Event.TOUCH_END, () => {
				kimiko.core.popScene();
			});
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
			//
			scene.addEventListener(Event.TOUCH_END, () => {
				kimiko.core.popScene();
			});
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
			/** 条件を満たしてからゲームオーバーに移るまでの間隔 */
			this.gameOverFrameMax = kimiko.secToFrame(3.0);
			this.gameOverFrameCounter = this.gameOverFrameMax;
			/** 条件を満たしてからゲームクリアに移るまでの間隔 */
			this.celarFrameMax = kimiko.secToFrame(3.0);
			this.clearFrameCounter = this.clearFrameMax;
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
				sprite = new utils.Sprite(DF.SC2_W, DF.SC2_H);
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

			this.ownBulletPool = new utils.SpritePool(DF.PLAYER_BULLET_NUM, () => {
				var spr = new OwnBullet();
				return spr;
			});
			
			this.enemyBulletPool = new utils.SpritePool(32, () => {
				var spr = new EnemyBullet();
				return spr;
			});
	
			this.effectPool = new utils.SpritePool(64, () => {
				var spr = new utils.Sprite(16, 16);
				spr.ageMax = 0;
				spr.anim.loopListener = () => {
					this.effectPool.free(spr);
				};
				return spr;
			});
			
			this.mapCharaMgr = new MapCharaManager(this);
			this.touch = new utils.Touch();

		},

		// はじめから。
		// スコアリセット、プレイヤーHP回復。
		initPlayerStatus: function () {
			var scene = this;
			scene.score = 0;

			var player = this.player;
			player.life.recover();
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
			var touch: utils.Touch = this.touch;
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
			var touch: utils.Touch = this.touch;
			touch.saveTouchMove(event);
		},

		ontouchend: function (event) {
			var touch: utils.Touch = this.touch;
			touch.saveTouchEnd(event);
			// this.statusTexts[0][1] = (<any[]>["touch end diff", Math.floor(touch.totalDiff.x), Math.floor(touch.totalDiff.y)]).join();
			
			var player = this.player;
			player.anim.sequence = player.animStand;
			player.force.x = 0;
			player.force.y = 0;
			//player.force.x += NumUtil.trim(touch.diffX * 0.05, -16, 16);
			
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

			this.clear();
			this.initPlayerStatus();
			this.world.addChild(this.player);
			this.loadMapData( jp.osakana4242.kimiko["mapData"] );

			if (kimiko.config.isSoundEnabled) {
				var sound = kimiko.core.assets[Assets.SOUND_BGM];
				var soundSec = 15.922 + 0.5;
				var replay = () => {
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
			var mapCharaMgr: MapCharaManager = this.mapCharaMgr;
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
							enemy.x = enemy.anchor.x = center;
							enemy.y = enemy.anchor.y = bottom;
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

			// カメラの追跡対象をプレイヤーにする.
			camera.targetNode = player;
			camera.moveToTarget();
		},

		onPlayerDead: function () {
			var scene = this;
			var player = this.player;
			var sx = player.x;
			var sy = player.y;
			var t1x = sx + (- player.dirX * 96);
			var t1y = sy - 64;
			var dx = - player.dirX;
			player.tl.
				moveBy(dx * 96 * 0.25, -96 * 0.8, kimiko.secToFrame(0.2), Easing.LINEAR).
				moveBy(dx * 96 * 0.25, -96 * 0.2, kimiko.secToFrame(0.2), Easing.LINEAR).
				moveBy(dx * 96 * 0.25,  32 * 0.2, kimiko.secToFrame(0.3), Easing.LINEAR).
				moveBy(dx * 96 * 0.25,  32 * 0.8, kimiko.secToFrame(0.3), Easing.LINEAR).
				hide();

			/*
			player.tl.
				moveTo(sx + (t1x - sx) * 0.5, sy + (t1y - sy) * 0.5 - 8, kimiko.secToFrame(0.2), Easing.LINEAR).
				moveTo(sx + (t1x - sx) * 1.0, sy + (t1y - sy) * 1.0,     kimiko.secToFrame(0.3), Easing.LINEAR).
				moveBy(- player.dirX * 48,   32,  kimiko.secToFrame(0.5), Easing.LINEAR).
				hide();
			*/
			
			// ゲームオーバーカウント開始.
			scene.gameOverFrameMax = kimiko.secToFrame(1.0);
			scene.gameOverFrameCounter = 0;
		},
		
		onBossDead: function () {
			var scene = this;
			// ゲームクリアカウント開始.
			scene.clearFrameMax = kimiko.secToFrame(2.0);
			scene.clearFrameCounter = 0;
		},
		
		getNearEnemy: function (sprite, searchRect: utils.IRect) {
			var mapCharaMgr: MapCharaManager = this.mapCharaMgr;
			var enemys = mapCharaMgr.actives;
			
			var near = null;
			var nearSqrDistance = 0;
			for (var i = 0, iNum = enemys.length; i < iNum; ++i) {
				var enemy = enemys[i];
				if (enemy.isDead()) {
					continue;
				}
				if (!utils.Rect.intersect(searchRect, enemy)) {
					continue;
				}
				var sqrDistance = utils.Rect.distance(sprite, enemy);
				if ( near === null ) {
					near = enemy;
					nearSqrDistance = sqrDistance;
				} else if ( sqrDistance < nearSqrDistance ) {
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
			bullet.ageMax = kimiko.secToFrame(5);
			this.world.addChild(bullet);
			return bullet;
		},

		newOwnBullet: function () {
			var bullet = this.ownBulletPool.alloc();
			if (!bullet) {
				return null;
			}
			bullet.ageMax = kimiko.secToFrame(0.4);
			this.world.addChild(bullet);
			return bullet;
		},

		intersectActiveArea: function (sprite) {
			var player = this.player;
			var minX: number = player.center.x - DF.SC1_W;
			var maxX: number = player.center.x + DF.SC1_W;
			if (minX <= sprite.center.x && sprite.center.x <= maxX) {
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
			var lifeText = utils.StringUtil.mul("o", player.life.hp) + utils.StringUtil.mul("_", player.life.hpMax - player.life.hp);
			texts[0][0] = "SC " + scene.score + " " +
				"TIME " + Math.floor(kimiko.frameToSec(this.timeLimit - this.timeLimitCounter));	
			texts[1][0] = "LIFE " + lifeText + " " +
				"WALL " + player.wallPushDir.x + "," + player.wallPushDir.y + " " +
				(player.targetEnemy ? "LOCK" : "    ") + " " +
				"";

			//texts[1][0] = player.stateToString()
			//texts[2][0] = "actives:" + mapCharaMgr.actives.length + " " +
			//	"sleeps:" + mapCharaMgr.sleeps.length;
			//
			for (var i = 0, iNum = texts.length; i < iNum; ++i) {
				var line = texts[i].join(" ");
				this.labels[i].text = line;
			}
		},

		checkMapCollision: function (player, onTrim: (x: number, y: number) => void) {
			// 地形とプレイヤーの衝突判定.
			// 自分の周囲の地形を調べる.
			var collider: utils.Collider = player.collider;
			var prect: utils.IRect = collider.getRect();
			var map = this.map;
			var xDiff = map.tileWidth;
			var yDiff = map.tileHeight;
			var xMin = prect.x;
			var yMin = prect.y;
			var xMax = prect.x + prect.width + (xDiff - 1);
			var yMax = prect.y + prect.height + (yDiff - 1);
			var hoge = 8;
			var rect = utils.Rect.alloc();
			try {
				for (var y = yMin; y < yMax; y += yDiff) {
					for (var x = xMin; x < xMax; x += xDiff) {
						if (!map.hitTest(x, y)) {
							continue;
						}
						rect.reset(
							Math.floor(x / map.tileWidth) * map.tileWidth,
							Math.floor(y / map.tileHeight) * map.tileHeight,
							map.tileWidth,
							map.tileHeight
						);
						if (!utils.Rect.intersect(prect, rect)) {
							continue;
						}
						// TODO: たま消しのときは無駄になってしまうので省略したい
						if (!map.hitTest(x, y - yDiff) && 0 <= player.force.y && prect.y <= rect.y + hoge) {
							// top
							player.y = rect.y - prect.height - collider.rect.y;
							onTrim.call(player, 0, 1);
							player.force.y = 0;
							//player.isOnMap = true;
						} else if (!map.hitTest(x, y + yDiff) && player.force.y <= 0 && rect.y + rect.height - hoge < prect.y + prect.height) {
							// bottom
							player.y = rect.y + rect.height - collider.rect.y;
							onTrim.call(player, 0, -1);
							player.force.y = 0;
						} else if (!map.hitTest(x - xDiff, y) && 0 <= player.force.x && prect.x <= rect.x + hoge) {
							// left
							player.x = rect.x - prect.width - collider.rect.x;
							onTrim.call(player, 1, 0);
						} else if (!map.hitTest(x + xDiff, y) && player.force.x <= 0 && rect.x + rect.width - hoge < prect.x + prect.width) {
							// right
							player.x = rect.x + rect.width - collider.rect.x;
							onTrim.call(player, -1, 0);
						}
						if (!player.parentNode) {
							// 死んでたら帰る.
							return;
						}
					}
				}
			} finally {
				utils.Rect.free(rect);
			}
		},

		checkCollision: function () {
			var scene = this;
			var mapCharaMgr: MapCharaManager = this.mapCharaMgr;
			var player = this.player;
			var enemys = mapCharaMgr.actives;
			// プレイヤーと敵弾の衝突判定.
			var bullets = this.enemyBulletPool.actives;
			for (var i = bullets.length - 1; 0 <= i; --i) {
				var bullet = bullets[i];
				if (bullet.visible &&
					player.life.canAddDamage() &&
					player.collider.intersect(bullet.collider)) {
					//
					player.damage(bullet);
					if (player.life.isDead()) {
						this.onPlayerDead();
					}
					bullet.free();
				}
			}
			// 敵とプレイヤー弾の衝突判定.
			for (var i = 0, iNum = enemys.length; i < iNum; ++i) {
				var enemy = enemys[i];
				var bullets = this.ownBulletPool.actives;
				for (var j = bullets.length - 1; 0 <= j; --j) {
					var bullet = bullets[j];
					if (bullet.visible &&
						enemy.life.canAddDamage() &&
						enemy.collider.intersect(bullet.collider)) {
						enemy.damage(bullet);
						scene.score += 10;
						if (enemy.life.isDead()) {
							var ed: IEnemyData = enemy.getEnemyData();
							scene.score += ed.score;
							if (enemy.isBoss()) {
								scene.onBossDead();
							}
						}
						bullet.free();
					}
				}
			}
		},
	});
}

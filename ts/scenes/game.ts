// references
/// <reference path="../kimiko.ts" />
/// <reference path="../fader.ts" />
/// <reference path="../game/camera.ts" />
/// <reference path="../game/life.ts" />
/// <reference path="../game/weapon.ts" />
/// <reference path="../game/own_bullet.ts" />
/// <reference path="../game/enemy_bullet.ts" />
/// <reference path="../game/enemy.ts" />
/// <reference path="../game/player.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.scenes {

	var g_app = jp.osakana4242.kimiko.g_app;
	var DF = jp.osakana4242.kimiko.DF;

	export var Game: any = enchant.Class.create(enchant.Scene, {
		initialize: function () {
			enchant.Scene.call(this);

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
				[], [], [], [],
			];
			//
			this.layouter = new kimiko.SpriteLayouter(this);
			this.layouter.layout = (() => {
				var list = [
					[ "spriteName",       "layoutName", "visible", "delay",  "x",  "y", ],

					[ "pauseBtn",         "normal",     true,       0.05 * 0,  4,     4, ],
					[ "statusLabels_0",   "normal",     true,       0.05 * 0,  70,    4 + 12 * 0, ],
					[ "statusLabels_1",   "normal",     true,       0.05 * 0,  70,    4 + 12 * 1, ],
					[ "statusLabels_2",   "normal",     true,       0.05 * 0,  70,    4 + 12 * 2, ],
					[ "statusLabels_3",   "normal",     true,       0.05 * 0,  70,    4 + 12 * 3, ],
				];
				return g_app.labeledValuesToObjects(list);
			})();

			this.backgroundColor = "rgb(32, 32, 64)";
			var sprite;

			var world = new enchant.Group();
			world.name = "world";
			this.world = world;
			scene.addChild(world);

			var map = new enchant.Map(DF.MAP_TILE_W, DF.MAP_TILE_H);
			this.map = map;
			this.mapOption = {};
			map.name = "map";
			map.image = g_app.core.assets[Assets.IMAGE_MAP];
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
			camera.name = "camera";
			camera.targetGroup = world;
			world.addChild(camera);

			this.player = (() => {
				var sprite = new game.Player();
				sprite.name = "player";
				sprite.x = 0;
				sprite.y = this.map.height - sprite.height;
				return sprite;
			})();
			world.addChild(this.player);
			// world.addChild(this.player.viewpoint);
			
			(() => {
				// 操作エリア.

				// 背景.
				var bg = (() => {
					var spr = new enchant.Sprite(DF.SC2_W, DF.SC2_H);
					this.controllArea = spr;
					spr.x = 0;
					spr.y = 0;
					spr.backgroundColor = "rgb(60, 60, 40)";
					return spr;
				})();

				// labels
				this.labels = [];
				var texts: string[][] = this.statusTexts;
				for (var i: number = 0, iNum: number = texts.length; i < iNum; ++i) {
					sprite = new utils.SpriteLabel(g_app.fontS, "");
					sprite.width = 160;
					this.labels.push(sprite);
					this.layouter.sprites["statusLabels_" + i ] = sprite;
				}

				var pauseBtn = (() => {
					var spr = new LabeledButton(48, 48, "P");
					spr.addEventListener(enchant.Event.TOUCH_END, () => {
						g_app.sound.playSe(Assets.SOUND_SE_OK);
						g_app.core.pushScene(g_app.pauseScene);
					});
					return spr;
				})();
				this.layouter.sprites["pauseBtn"] = pauseBtn;

				var group = new enchant.Group();
				this.statusGroup = group;
				group.x = DF.SC2_X1;
				group.y = DF.SC2_Y1;

				group.addChild(bg);
				for (var i: number = 0, iNum: number = this.labels.length; i < iNum; ++i) {
					group.addChild(this.labels[i]);
				}
				group.addChild(pauseBtn);
				this.addChild(group);

			})();

			this.ownBulletPool = new utils.SpritePool(DF.PLAYER_BULLET_NUM, (idx: number) => {
				var spr = new game.OwnBullet();
				spr.name = "OwnBullet" + idx;
				return spr;
			});
			
			this.enemyBulletPool = new utils.SpritePool(32, (idx: number) => {
				var spr = new game.EnemyBullet();
				spr.name = "EnemyBullet" + idx;
				return spr;
			});

			this.effectPool = new utils.SpritePool(16, (idx: number) => {
				var spr = new enchant.Sprite(16, 16);
				spr.name = "effect" + idx;
				spr.ageMax = 0;
				spr.anim.loopListener = () => {
					this.effectPool.free(spr);
				};
				return spr;
			});
			
			this.mapCharaMgr = new game.MapCharaManager(this);
			this.touch = new utils.Touch();

			this.fader = new Fader(this);
			this.fader.setBlack(true);
			this.fader.fadeOut(0);

		},

		initPlayerStatus: function () {
			var scene = this;
			var pd = g_app.playerData;
			pd.restTimeMax = g_app.secToFrame(180); // TODO: マップデータから持ってくる.
			pd.restTimeCounter = pd.restTimeMax;
			var player = this.player;
			player.reset();
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
		
		onenter: function () {
			g_app.addTestHudTo(this);
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
			this.loadMapData( jp.osakana4242.kimiko["mapData" + g_app.playerData.mapId] );

			scene.fader.setBlack(true);
			//scene.fader.fadeIn(g_app.secToFrame(0.2));
			var player = scene.player;
			var camera = scene.camera;
			scene.fader.fadeIn2(g_app.secToFrame(0.2), camera.getTargetPosOnCamera());

			scene.layouter.transition("normal", false);

			scene.state = scene.stateNormal;
			// scene.state = scene.ntateGameClear;

			g_app.sound.playBgm(Assets.SOUND_BGM, false);
		},
					
		stateNormal: function () {
			var player = this.player;
			//
			var mapCharaMgr: game.MapCharaManager = this.mapCharaMgr;
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
			} else {
				this.countTimeLimit();
			}
		},

		stateGameOver: function () {
			var pd = g_app.playerData;
			//
			var userMap = g_app.storage.getUserMapForUpdate(pd.mapId);
			userMap.playCount += 1;
			g_app.storage.save();
			//
			pd.reset();
			//
			g_app.core.pushScene(new GameOver());
			this.state = this.stateGameStart;
		},

		/**
			
		*/
		stateGameClear: function () {
			var pd = g_app.playerData;
			//
			pd.score += pd.timeToScore(Math.floor(g_app.frameToSec(pd.restTimeCounter)) * 10);
			pd.restTimeCounter = 0;
			//
			var userMap = g_app.storage.getUserMapForUpdate(pd.mapId);
			userMap.playCount += 1;
			g_app.storage.save();
			//
			pd.hp = this.player.life.hp;
			var mapOption: IMapOption = this.mapOption;
			if (mapOption.nextMapId === 0) {
				g_app.core.pushScene(new GameClear());
				this.state = this.stateGameStart;
			} else {
				pd.mapId = mapOption.nextMapId;
				//
				this.state = this.stateWait;

				var camera = this.camera;
				this.fader.fadeOut2(g_app.secToFrame(0.5), camera.getTargetPosOnCamera(), () => {
					this.state = this.stateGameStart;
				});
			}

		},

		//---------------------------------------------------------------------------
		
		loadMapData: function (mapData: utils.IMapData) {
			var map = this.map;
			var mapOption: IMapOption = DF.MAP_OPTIONS[g_app.playerData.mapId];
			for (var key in mapOption) {
				this.mapOption[key] = mapOption[key];
			}
			this.backgroundColor = mapOption.backgroundColor;

			function cloneTiles(tiles: number[][]) {
				var a = [];
				for (var y = 0, yNum = tiles.length; y < yNum; ++y) {
					a.push(tiles[y].slice(0));
				}
				return a;
			}

			function eachTiles(tiles: number[][], func: (value: number, x: number, y: number, tiles: number[][]) => void) {
				for (var y = 0, yNum = tiles.length; y < yNum; ++y) {
					for (var x = 0, xNum = tiles[y].length; x < xNum; ++x) {
						func(tiles[y][x], x, y, tiles);
					}
				}
			}

			(() => {
				// 1: レイヤーをクローンしてトビラを削除する.
				// 2: 条件をみたしたらクローンしたレイヤーのトビラを復活させる.
				
				var mapWork: any = {};
				mapWork.groundTilesOrig = mapData.layers[0].tiles;
				mapWork.groundTiles = cloneTiles(mapWork.groundTilesOrig);
				this.mapWork = mapWork;
			
				var tiles = mapWork.groundTiles;
				
				if (DF.IS_HIDDEN_DOOR) {
					eachTiles(tiles, (tile, x, y, tiles) => {
						if (tile === DF.MAP_TILE_DOOR_OPEN) {
							// ドアを消す
							tiles[y][x] = DF.MAP_TILE_DOOR_CLOSE;
						}
					});
				}

				// コリジョン自動生成.
				var collisionData = [];
				for (var y = 0, yNum = tiles.length; y < yNum; ++y) {
					var line = [];
					for (var x = 0, xNum = tiles[y].length; x < xNum; ++x) {
						var tile = tiles[y][x];
						line.push(DF.MAP_TILE_COLLISION_MIN <= tile && tile <= DF.MAP_TILE_COLLISION_MAX);
					}
					collisionData.push(line);
				}
				
				map.loadData(tiles);
				map.collisionData = collisionData;
			})();

			// 敵, スタート地点.
			(() => {
				var mapCharaMgr: game.MapCharaManager = this.mapCharaMgr;
				var layer = mapData.layers[1];
				var enemyIdx = 0;
				eachTiles(layer.tiles, (charaId, x, y, tiles) => {
					if (charaId === -1) {
						return;
					}
					var left = x * DF.MAP_TILE_W;
					var top = y * DF.MAP_TILE_H;

					if (charaId === DF.MAP_TILE_PLAYER_POS) {
						var player = this.player;
						player.x = left + (DF.MAP_TILE_W - player.width) / 2;
						player.y = top + (DF.MAP_TILE_H - player.height);
					} else if (DF.MAP_TILE_CHARA_MIN <= charaId) {
						var enemyId = charaId - DF.MAP_TILE_CHARA_MIN;
						var data = game.EnemyData[enemyId]
						var enemy = new game.Enemy();
						enemy.tl.unloop().clear();
						enemy.enemyId = enemyId;
						var isEasy = g_app.storage.root.userConfig.difficulty <= 1;
						if (isEasy) {
							enemy.life.hpMax = Math.ceil(data.hpMax / 2);
						} else {
							enemy.life.hpMax = data.hpMax;
						}
						enemy.life.hp = enemy.life.hpMax;
						data.body(enemy);
						
						// セルのどこに吸着させるか.
						var anchorX = left;
						var anchorY = top;

						var aligns = data.align.split(" ");
						var alignH = aligns[0];
						var alignV = aligns[1];
						switch(alignH) {
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
							console.log("unknown case:" + alignH);
							break;
						}
						switch(alignV) {
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
			camera.limitRect.height = map.height;// + (DF.SC1_H / 2);
			
			var player = this.player;
			utils.Rect.copyFrom(player.limitRect, camera.limitRect);
			player.startMap();

			// カメラの追跡対象をプレイヤーにする.
			camera.targetNode = player.viewpoint;
			camera.moveToTarget();
		},

		addEffect: function (animId: number, pos: utils.IVector2D) {
			var effect = this.scene.effectPool.alloc();
			if (effect === null) {
				return;
			}
			effect.anim.sequence = g_app.getAnimFrames(animId);
			effect.center.set(pos);
			effect.x += -1 + Math.random() * 3;
			effect.y += -1 + Math.random() * 3;
			this.world.addChild(effect);
			return effect;
		},

		onPlayerDead: function () {
			var scene = this;

			// ゲームオーバーカウント開始.
			scene.gameOverFrameMax = g_app.secToFrame(1.0);
			scene.gameOverFrameCounter = 0;
		},

		onAllEnemyDead: function () {
			var scene = this;
			var mapOption: IMapOption = scene.mapOption;
			switch (mapOption.exitType) {
			case "door":
				if (DF.IS_HIDDEN_DOOR) {
					scene.map.loadData(scene.mapWork.groundTilesOrig);
				}
				break;
			case "enemy_zero":
				// ゲームクリアカウント開始.
				scene.clearFrameMax = g_app.secToFrame(3.0);
				scene.clearFrameCounter = 0;
				break;
			default:
				console.log("unkown exitType:" + mapOption.exitType);
				break;
			}
		},
		
		getNearEnemy: function (sprite, searchRect: utils.IRect) {
			var mapCharaMgr: game.MapCharaManager = this.mapCharaMgr;
			var enemys = mapCharaMgr.actives;
			
			var near = null;
			var nearSqrDistance = 0;
			for (var i = 0, iNum = enemys.length; i < iNum; ++i) {
				var enemy = enemys[i];
				if (enemy.life.isDead) {
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
			var minX: number = player.center.x - DF.SC1_W;
			var maxX: number = player.center.x + DF.SC1_W;
			if (minX <= sprite.center.x && sprite.center.x <= maxX) {
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
			var mapCharaMgr: game.MapCharaManager = this.mapCharaMgr;
			var texts: string[][] = this.statusTexts;
			var lifeText = g_app.stringUtil.mul("[@]", player.life.hp) + utils.StringUtil.mul("[ ]", player.life.hpMax - player.life.hp);
			texts[0][0] =
				"LIFE  " + lifeText;
			texts[1][0] =
				"SCORE " + g_app.playerData.score;
			texts[2][0] =
				"TIME  " + Math.floor(g_app.frameToSec(pd.restTimeCounter));

			if (g_app.testHud.parentNode) {
				// デバッグ表示.
				g_app.testHud.labels[2].text = 
					"W:" + player.wallPushDir.x + "," + player.wallPushDir.y + " " +
					(player.targetEnemy ? "L" : " ") + " " +
					"";
			}

			//texts[1][0] = player.stateToString()
			//texts[2][1] = "actives:" + mapCharaMgr.actives.length + " " +
			//	"sleeps:" + mapCharaMgr.sleeps.length;
			//
			for (var i = 0, iNum = texts.length; i < iNum; ++i) {
				var line = texts[i].join(" ");
				this.labels[i].text = line;
			}
		},

		/**
			スプライトと地形の衝突判定.
			衝突してたら、スプライトの位置を補正する.
		*/
		checkMapCollision: function (
			spr: any,
			onTrim: (x: number, y: number) => void,
			onIntersect: (tile: number, x: number, y: number) => void) {

			var sprRect: utils.IRect = spr.collider.getRect();
			var sprForceX = spr.force.x;
			var sprForceY = spr.force.y;

			var map = this.map;
			var xDiff = map.tileWidth;
			var yDiff = map.tileHeight;

			// スプライトの4隅.
			var xMin = sprRect.x;
			var yMin = sprRect.y;
			var xMax = sprRect.x + sprRect.width + (xDiff - 1);
			var yMax = sprRect.y + sprRect.height + (yDiff - 1);
			//
			var tileRect = utils.Rect.alloc();
			tileRect.width = map.tileWidth;
			tileRect.height = map.tileHeight;
			try {
				for (var y = yMin; y < yMax; y += yDiff) {
					for (var x = xMin; x < xMax; x += xDiff) {
						tileRect.x = Math.floor(x / map.tileWidth) * map.tileWidth;
						tileRect.y = Math.floor(y / map.tileHeight) * map.tileHeight;
						if (!utils.Rect.intersect(sprRect, tileRect)) {
							continue;
						}
						if (onIntersect) {
							onIntersect.call(spr, map.checkTile(x, y), x, y);
						}
						if (!map.hitTest(x, y)) {
							continue;
						}

						// 4方向のうち、どの方向に補正するか、重みづけをする.
						/** 補正距離. */
						var addX = 0;
						var addY = 0;
						/** 補正するか. */
						var isTrimX = false;
						var isTrimY = false;
						// X.
						if (0 <= sprForceX) {
							// to left.
							if (map.hitTest(x - xDiff, y)) {
								//
							} else {
								addX = (tileRect.x - sprRect.width) - sprRect.x;
								isTrimX = true;
							}
						} else {
							// to right.
							if (map.hitTest(x + xDiff, y)) {
								//
							} else {
								addX =  (tileRect.x + tileRect.width) - sprRect.x;
								isTrimX = true;
							}
						}
						// Y.
						if (0 <= sprForceY) {
							// to top.
							if (map.hitTest(x, y - yDiff)) {
								//
							} else {
								addY = (tileRect.y - sprRect.height) - sprRect.y;
								isTrimY = true;
							}
						} else {
							// to bottom.
							if (map.hitTest(x, y + yDiff)) {
								//
							} else {
								addY = (tileRect.y + tileRect.height) - sprRect.y;
								isTrimY = true;
							}
						}

						// 補正距離が短い軸で補正する.
						var cmp = addX * addX - addY * addY;
						if (isTrimX && (!isTrimY || cmp < 0)) {
							spr.x += addX;
							sprRect.x += addX;
							onTrim.call(spr, g_app.numberUtil.sign(-addX), 0);
						} else {
							spr.y += addY;
							sprRect.y += addY;
							onTrim.call(spr, 0, g_app.numberUtil.sign(-addY));
						}

						if (!spr.parentNode) {
							// 死んでたら帰る.
							return;
						}

					}
				}
			} finally {
				utils.Rect.free(tileRect);
			}
		},

		checkCollision: function () {
			var scene = this;
			var mapCharaMgr: game.MapCharaManager = this.mapCharaMgr;
			var player = this.player;
			var enemys = mapCharaMgr.actives;

			// プレイヤーと敵弾の衝突判定.
			var bullets = this.enemyBulletPool.actives;
			for (var i = bullets.length - 1; 0 <= i; --i) {
				var bullet = bullets[i];
				if (bullet.visible &&
					player.life.canAddDamage &&
					player.collider.intersect(bullet.collider)) {
					//
					player.life.addDamage(1);
					if (player.life.isDead) {
						this.onPlayerDead();
					}
					g_app.sound.playSe(Assets.SOUND_SE_HIT);
					this.addEffect(DF.ANIM_ID_DAMAGE, bullet.center);
					bullet.free();
				}
			}
			// プレイヤーと敵の衝突判定.
			// ダメージを受けるのはプレイヤーだけ.
			for (var i = enemys.length - 1; 0 <= i; --i) {
				var enemy = enemys[i];
				if (player.life.canAddDamage &&
					player.collider.intersect(enemy.collider)) {
					//
					player.life.addDamage(1);
					if (player.life.isDead) {
						this.onPlayerDead();
					}
					g_app.sound.playSe(Assets.SOUND_SE_HIT);
					this.addEffect(DF.ANIM_ID_DAMAGE, player.center);
				}
			}
			// 敵とプレイヤー弾の衝突判定.
			for (var i = enemys.length - 1; 0 <= i; --i) {
				var enemy = enemys[i];
				var bullets = this.ownBulletPool.actives;
				for (var j = bullets.length - 1; 0 <= j; --j) {
					var bullet = bullets[j];
					if (bullet.visible &&
						enemy.life.canAddDamage &&
						enemy.collider.intersect(bullet.collider)) {
						enemy.life.addDamage(1);
						g_app.playerData.score += 10;
						if (enemy.life.isDead) {
							var ed: game.IEnemyData = enemy.enemyData;
							g_app.playerData.score += ed.score;
							if (mapCharaMgr.isAllDead()) {
								scene.onAllEnemyDead();
							}
						}
						if (!enemy.life.isDead) {
							g_app.sound.playSe(Assets.SOUND_SE_HIT);
							this.addEffect(DF.ANIM_ID_DAMAGE, bullet.center);
						} else {
							g_app.sound.playSe(Assets.SOUND_SE_KILL);
						}
						bullet.free();
					}
				}
			}
		},
	});
}


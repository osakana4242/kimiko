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

	var app = jp.osakana4242.kimiko.app;
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
			map.image = app.core.assets[Assets.IMAGE_MAP];
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
					spr.backgroundColor = "rgb(64, 64, 64)";
					return spr;
				})();

				// labels
				this.labels = [];
				var texts: string[][] = this.statusTexts;
				for (var i: number = 0, iNum: number = texts.length; i < iNum; ++i) {
					sprite = new enchant.Label("");
					this.labels.push(sprite);
					sprite.font = DF.FONT_M;
					sprite.color = "#fff";
					sprite.y = 12 * i;
				}

				var btnPause = (() => {
					var spr = new enchant.Label("P");
					spr.font = DF.FONT_M;
					spr.color = "#ff0";
					spr.backgroundColor = "#000";
					spr.width = 48;
					spr.height = 48;
					spr.textAlign = "center";
					spr.x = DF.SC2_W - 56;
					spr.y = DF.SC2_H - 56;
					spr.addEventListener(enchant.Event.TOUCH_END, () => {
						app.core.pushScene(app.pauseScene);
					});
					return spr;
				})();

				var group = new enchant.Group();
				this.statusGroup = group;
				group.x = DF.SC2_X1;
				group.y = DF.SC2_Y1;

				group.addChild(bg);
				for (var i: number = 0, iNum: number = this.labels.length; i < iNum; ++i) {
					group.addChild(this.labels[i]);
				}
				group.addChild(btnPause);
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

		// はじめから。
		// スコアリセット、プレイヤーHP回復。
		initPlayerStatus: function () {
			var scene = this;
			var pd = app.playerData;
			var player = this.player;
			player.reset();
			player.life.hpMax = pd.hpMax;
			player.life.recover();
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
			this.loadMapData( jp.osakana4242.kimiko["mapData" + app.playerData.mapId] );

			scene.fader.setBlack(true);
			//scene.fader.fadeIn(app.secToFrame(0.2));
			var player = scene.player;
			var camera = scene.camera;
			scene.fader.fadeIn2(app.secToFrame(0.2), camera.getTargetPosOnCamera());

			scene.state = scene.stateNormal;
			// scene.state = scene.stateGameClear;

			if (app.config.isSoundEnabled) {
				var sound = app.core.assets[Assets.SOUND_BGM];
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
			} else if (this.countTimeLimit()) {
				// タイムオーバー.
				this.state = this.stateGameOver;
			}
		},

		stateGameOver: function () {
			var pd = app.playerData;
			//
			var userMap = app.storage.getUserMapForUpdate(pd.mapId);
			userMap.playCount += 1;
			app.storage.save();
			//
			pd.reset();
			//
			app.core.pushScene(new GameOver());
			this.state = this.stateGameStart;
		},

		/**
			
		*/
		stateGameClear: function () {
			var pd = app.playerData;
			//
			var userMap = app.storage.getUserMapForUpdate(pd.mapId);
			userMap.playCount += 1;
			app.storage.save();
			//
			pd.hp = this.player.life.hp;
			var mapOption: IMapOption = this.mapOption;
			if (mapOption.nextMapId === 0) {
				app.core.pushScene(new GameClear());
				this.state = this.stateGameStart;
			} else {
				pd.mapId = mapOption.nextMapId;
				//
				pd.restTimeCounter += pd.restTimeMax;
				this.state = this.stateWait;

				var player = this.player;
				var camera = this.camera;
				this.fader.fadeOut2(app.secToFrame(0.5), camera.getTargetPosOnCamera(), () => {
					this.state = this.stateGameStart;
				});
			}

		},

		//---------------------------------------------------------------------------
		
		loadMapData: function (mapData: utils.IMapData) {
			var map = this.map;
			var mapOption: IMapOption = DF.MAP_OPTIONS[app.playerData.mapId];
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
						enemy.life.hpMax = data.hpMax;
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
			effect.anim.sequence = app.getAnimFrames(animId);
			effect.center.set(pos);
			effect.x += -1 + Math.random() * 3;
			effect.y += -1 + Math.random() * 3;
			this.world.addChild(effect);
			return effect;
		},

		onPlayerDead: function () {
			var scene = this;

			// ゲームオーバーカウント開始.
			scene.gameOverFrameMax = app.secToFrame(1.0);
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
				scene.clearFrameMax = app.secToFrame(3.0);
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
			bullet.ageMax = app.secToFrame(5);
			this.world.addChild(bullet);
			return bullet;
		},

		newOwnBullet: function () {
			var bullet = this.ownBulletPool.alloc();
			if (!bullet) {
				return null;
			}
			bullet.ageMax = app.secToFrame(0.4);
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
			var pd = app.playerData;
			if (pd.restTimeCounter <= 0) {
				return true;
			}
			--pd.restTimeCounter;
			return pd.restTimeCounter <= 0;
		},


		updateStatusText: function () {
			var scene = this;
			var player = this.player;
			var pd = app.playerData;
			var mapCharaMgr: game.MapCharaManager = this.mapCharaMgr;
			var texts: string[][] = this.statusTexts;
			var lifeText = app.stringUtil.mul("o", player.life.hp) + utils.StringUtil.mul("_", player.life.hpMax - player.life.hp);
			texts[0][0] = "SC " + app.playerData.score + " " +
				"TIME " + Math.floor(app.frameToSec(pd.restTimeCounter));	
			texts[1][0] = "LIFE " + lifeText + " " +
				"WALL " + player.wallPushDir.x + "," + player.wallPushDir.y + " " +
				(player.targetEnemy ? "LOCK" : "    ") + " " +
				"";

			texts[2][0] = "nodes " + scene.world.childNodes.length;
			//texts[1][0] = player.stateToString()
			//texts[2][1] = "actives:" + mapCharaMgr.actives.length + " " +
			//	"sleeps:" + mapCharaMgr.sleeps.length;
			//
			for (var i = 0, iNum = texts.length; i < iNum; ++i) {
				var line = texts[i].join(" ");
				this.labels[i].text = line;
			}
		},

		checkMapCollision: function (player, onTrim: (x: number, y: number) => void, onIntersect: (tile: number, x: number, y: number) => void) {
			// 地形とプレイヤーの衝突判定.
			// 自分の周囲の地形を調べる.
			var collider: utils.Collider = player.collider;
			var pRelRect = collider.getRelRect();
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
						rect.reset(
							Math.floor(x / map.tileWidth) * map.tileWidth,
							Math.floor(y / map.tileHeight) * map.tileHeight,
							map.tileWidth,
							map.tileHeight
						);
						if (!utils.Rect.intersect(prect, rect)) {
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
				utils.Rect.free(rect);
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
						app.playerData.score += 10;
						if (enemy.life.isDead) {
							var ed: game.IEnemyData = enemy.enemyData;
							app.playerData.score += ed.score;
							if (mapCharaMgr.isAllDead()) {
								scene.onAllEnemyDead();
							}
						}
						if (!enemy.life.isDead) {
							this.addEffect(DF.ANIM_ID_DAMAGE, bullet.center);
						}
						bullet.free();
					}
				}
			}
		},
	});
}


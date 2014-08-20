// references
/// <reference path="../kimiko.ts" />
/// <reference path="../Fader.ts" />
/// <reference path="../game/Camera.ts" />
/// <reference path="../game/Life.ts" />
/// <reference path="../game/Weapon.ts" />
/// <reference path="../game/OwnBullet.ts" />
/// <reference path="../game/EnemyBullet.ts" />
/// <reference path="../game/Enemy.ts" />
/// <reference path="../game/Player.ts" />

module jp.osakana4242.kimiko.scenes {

	var g_app = jp.osakana4242.kimiko.g_app;
	var DF = jp.osakana4242.kimiko.DF;

	export var GameScene: any = cc.Scene.extend( {
		ctor: function () {
			this._super();

			var scene = this;

			var aaa = this.aaa = new oskn.AspectAnchorAdjuster();

			aaa.addToScene( this );

			var mainNode = this.mainNode = cc.Node.create();
			var mainTopNode = this.mainTopNode = cc.Node.create();
			scene.addChild(mainNode);
			mainNode.addChild(mainTopNode, 1);
			aaa.addAnchor(mainTopNode, "top");

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

					[ "pauseBtn",         "normal",     true,       0.05 * 0,   120 + 0,    4, ],
					[ "statusLabels_0",   "normal",     true,       0.05 * 0,  -160 + 4,    4 + 12 * -0, ],
					[ "statusLabels_1",   "normal",     true,       0.05 * 0,  -160 + 4,    4 + 12 * -1, ],
					[ "statusLabels_2",   "normal",     true,       0.05 * 0,  -160 + 4,    4 + 12 * -2, ],
					[ "statusLabels_3",   "normal",     true,       0.05 * 0,  -160 + 4,    4 + 12 * -3, ],
				];
				return g_app.labeledValuesToObjects(list);
			})();

			// this.backgroundColor = "rgb(32, 32, 64)";
			var bg1 = this.bg1 = (() => {
				var spr = oskn.Plane.create(cc.color(0xff, 0xff, 64, 0xff), DF.SC_W, DF.SC_H);
				return spr;
			})();
			var bg2 = this.bg2= (() => {
				var spr = oskn.Plane.create(cc.color(32, 32, 64, 0xff), DF.SC_W, DF.SC_H);
				return spr;
			})();
			var bg3 = this.bg3= (() => {
				var spr = oskn.Plane.create(cc.color(64, 32, 64, 0xff), DF.SC1_W, DF.SC1_H);
				return spr;
			})();

			var sprite;

			var world = this.world = cc.Node.create();
			world.name = "world";


			var gameLayer = this.gameLayer = oskn.nodes.createRectClippingNode(0, 0, DF.SC1_W, DF.SC1_H);

			if (false) {
			} else {
				mainTopNode.addChild(bg1);
				bg1.y = ( DF.SC_H - DF.SC1_H ) * 0.5 * DF.UP;
				gameLayer.addChild(bg2);
				gameLayer.addChild(bg3);
				gameLayer.addChild(world);
				gameLayer.x = 0;
				gameLayer.y = ( DF.SC_H - DF.SC1_H ) * 0.5 * DF.UP;
				mainTopNode.addChild(gameLayer);
			}
			this.fader = new Fader(gameLayer);

			var map = this.map = game.GameMap.create();
			this.mapOption = {};
//			map.name = "map";
//			map.image = g_app.core.assets[Assets.IMAGE_MAP];
			map.map.x = 0;
			map.map.y = 0;
			world.addChild(map.map);

			// 1カメ.
			var camera = new Camera();
			this.camera = camera;
			camera.name = "camera";
			camera.targetGroup = world;
			world.addChild(camera);

			this.player = (() => {
				var sprite = new game.Player();
				sprite.retain();
				sprite.name = "player";
				sprite.x = 0;
				sprite.y = this.map.map.height - sprite.height;
				return sprite;
			})();
//			world.addChild(this.player);
//			world.addChild(this.player.viewpoint);
			
			var hudGroup = (() => {
				// 操作エリア.

				// 背景.
				var bg = (() => {
					var spr = oskn.Plane.create( cc.color( 60, 60, 40, 0xff ), DF.SC2_W, cc.director.getWinSize().height);
					this.controllArea = spr;
					spr.x = 0;
					spr.y = (DF.SC2_H - spr.height) * 0.5 * DF.UP;
					return spr;
				})();

				// labels
				this.labels = [];
				var texts: string[][] = this.statusTexts;
				for (var i: number = 0, iNum: number = texts.length; i < iNum; ++i) {
					sprite = cc.LabelBMFont.create( "label", res.font_fnt );
					sprite.width = 160;
					sprite.textAlign = cc.TEXT_ALIGNMENT_LEFT;
					sprite.setAnchorPoint(cc.p(0.0, 0.5));
					this.labels.push(sprite);
					this.layouter.sprites["statusLabels_" + i ] = sprite;
				}

				var pauseBtn = this.layouter.sprites["pauseBtn"] = (() => {
					var spr = oskn.MenuItem.createByTitle("P", 48, 48, () => {
						g_app.sound.playSe(Assets.SOUND_SE_OK);
						//scene.isExitByPush = true;
						oskn.NodeUtils.visitNodes(this.mainNode, ( n ) => {
							cc.log("pause:" + n["name"]);
							n.pause();
						});
						this.pauseMenu = new game.PauseMenu(() => {
							oskn.NodeUtils.visitNodes(this.mainNode, ( n ) => { n.resume(); });
							// this.gameLayer.resume();
							this.pauseMenu = null;
						});
						scene.aaa.centerNode.addChild(this.pauseMenu);
						//cc.director.pushScene(new scenes.TitleScene());
					}, scene);
					return spr;
				})();

				var menu = cc.Menu.create(pauseBtn);
				menu.x = 0;
				menu.y = 0;

				var group = cc.Node.create();
				this.statusGroup = group;
				group.x = 0;
				group.y = ( DF.SC_H - DF.SC1_H ) * 0.5 * DF.UP +
					( DF.SC1_H + DF.SC2_H ) * 0.5 * DF.DOWN;

				group.addChild(bg);
				for (var i: number = 0, iNum: number = this.labels.length; i < iNum; ++i) {
					group.addChild(this.labels[i]);
				}
				group.addChild(menu);
				return group;
			})();
			mainTopNode.addChild(hudGroup);

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
				var spr = cc.Sprite.create();
				spr.width = 16;
				spr.height = 16;
				spr.rect = new utils.NodeRect(spr);
				spr.anim = new utils.AnimSequencer(spr);
				spr.name = "effect" + idx;
				spr.ageMax = 0;
				spr.anim.loopListener = () => {
					this.effectPool.free(spr);
				};
				return spr;
			});
			
			this.mapCharaMgr = new game.MapCharaManager(this);
			this.touch = new utils.Touch();
			this.pauseMenu = null;

			var listener = cc.EventListener.create( {
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches: true,
				onTouchBegan:     (t, evt) => { return scene.onTouchBegan(t, evt); },
				onTouchMoved:     (t, evt) => { return scene.onTouchMoved(t, evt); },
				onTouchEnded:     (t, evt) => { return scene.onTouchEnded(t, evt); },
				onTouchCancelled: (t, evt) => { return scene.onTouchEnded(t, evt); },
			} );
			cc.eventManager.addListener( listener, scene );
			this.scheduleUpdate();
			this.isExitByPush = false;

			this.fader.setBlack(true);
			this.fader.fadeOut(0);
		},

		initPlayerStatus: function () {
			var scene = this;
			var pd = g_app.playerData;
			pd.restTimeMax = g_app.secToFrame(180); // TODO: マップデータから持ってくる.
			pd.restTimeCounter = pd.restTimeMax;
			var player = this.player;
			player.reset(pd);
			
		},

		clear: function () {
			this.ownBulletPool.freeAll();
			this.enemyBulletPool.freeAll();
			this.effectPool.freeAll();
			this.mapCharaMgr.clear();
			this.player.removeFromParent(false);
		},

		//---------------------------------------------------------------------------
		onTouchBegan: function (t, evt) {
			var touch: utils.Touch = this.touch;
			touch.saveTouchStart(t.getLocation());
			var player = this.player;
			player.touchStartAnchor.x = player.x;
			player.touchStartAnchor.y = player.y;
			player.force.x = 0;
			player.force.y = 0;
			player.useGravity = false;
			player.isOnMap = false;
			return true;
		},

		onTouchMoved: function (t, evt) {
			var touch: utils.Touch = this.touch;
			touch.saveTouchMove(t.getLocation());
			return true;
		},

		onTouchEnded: function (t, evt) {
			var touch: utils.Touch = this.touch;
			touch.saveTouchEnd(t.getLocation());
			// this.statusTexts[0][1] = (<any[]>["touch end diff", Math.floor(touch.totalDiff.x), Math.floor(touch.totalDiff.y)]).join();
			
			var player = this.player;
			player.force.x = 0;
			player.force.y = 0;
			
			if (Math.abs(touch.totalDiff.x) + Math.abs(touch.totalDiff.y) < 16) {
			//	player.attack();
			}
			player.useGravity = true;
			return true;
		},

		onEnter: function () {
			this._super();
			cc.log( "game onEnter" );
			if ( this.isExitByPush ) {
				this.isExitByPush = false;
				return;
			}

			g_app.addTestHudTo(this);
		},

		onExit: function () {
			this._super();
			cc.log( "game onExit" );
			if ( this.isExitByPush ) {
				return;
			}
			this.fader.destroy();
			this.player.release();
			this.ownBulletPool.destroy();
			this.enemyBulletPool.destroy();
			this.effectPool.destroy();
		},

		update: function (deltTime: number) {
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
			this.loadMapData( jp.osakana4242.kimiko["mapData" + g_app.playerData.mapId] );

			scene.fader.setBlack(true);
			var player = scene.player;
			var camera = scene.camera;
			scene.fader.fadeIn2(0.2, camera.getTargetPosOnCamera());

			scene.layouter.transition("normal", false);

			scene.state = scene.stateNormal;
			// scene.state = scene.ntateGameClear;

			g_app.sound.playBgm(res[scene.mapOption.bgm], false);
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
//			g_app.core.pushScene(new GameOver());
			this.state = this.stateGameStart;
		},

		/**
			
		*/
		stateGameClear: function () {
			var player = this.player;

			var pd = g_app.playerData;
			//
			pd.score += pd.timeToScore(Math.floor(g_app.frameToSec(pd.restTimeCounter)) * 10);
			pd.restTimeCounter = 0;
			//
			var mapOption: IMapOption = this.mapOption;
			var userMap = g_app.storage.getUserMapForUpdate(pd.mapId);
			userMap.playCount += 1;
			if (mapOption.nextMapId !== 0) {
				// 次のマップデータを作成.
				g_app.storage.getUserMapForUpdate(mapOption.nextMapId);
			}
			g_app.storage.save();
			//
			pd.hp = this.player.life.hp;
			if (mapOption.nextMapId === 0) {
//				g_app.core.pushScene(new GameClear());
				this.state = this.stateGameStart;
			} else {
				pd.mapId = mapOption.nextMapId;
				//
				this.state = this.stateWait;

				var camera = this.camera;
				this.fader.fadeOut2(0.5, camera.getTargetPosOnCamera(), () => {
					player.removeFromParent(false);
					player.viewpoint.removeFromParent(false);
					this.state = this.stateGameStart;
				});
			}

		},

		//---------------------------------------------------------------------------
		
		loadMapData: function (mapData: utils.IMapData) {
			cc.log("loadMapData");
			var scene = this;
			var map: game.GameMap = scene.map;
			var mapOption: IMapOption = DF.MAP_OPTIONS[g_app.playerData.mapId];
			for (var key in mapOption) {
				scene.mapOption[key] = mapOption[key];
			}
			map.load(res[mapOption.resName]);
//			scene.backgroundColor = mapOption.backgroundColor;
//
//			function cloneTiles(tiles: number[][]): number[][] {
//				var a = [];
//				for (var y = 0, yNum = tiles.length; y < yNum; ++y) {
//					a.push(tiles[y].slice(0));
//				}
//				return a;
//			}
//
//			function filterTiles(tiles: number[][], filter: (tile: number) => boolean): number[][] {
//				var a = [];
//				for (var y = 0, yNum = tiles.length; y < yNum; ++y) {
//					var b = tiles[y].slice(0);
//					for (var x = 0, xNum = tiles[y].length; x < xNum; ++x) {
//						var tile = b[x];
//						if (!filter(tile)) {
//							b[x] = -1;
//						}
//					}
//					a.push(b);
//				}
//				return a;
//			}
//
//			function filterNormalTiles(tiles: number[][]): number[][] {
//				return filterTiles(tiles, (tile: number) => {
//					return tile < DF.MAP_TILE_GROUND_MAX;
//				});
//			}
//
//
//			(() => {
//				// 1: レイヤーをクローンしてトビラを削除する.
//				// 2: 条件をみたしたらクローンしたレイヤーのトビラを復活させる.
//
//				var mapWork: any = {};
//				mapWork.groundTilesOrig = filterNormalTiles(mapData.layers[0].tiles);
//				mapWork.groundTiles = cloneTiles(mapWork.groundTilesOrig);
//				scene.mapWork = mapWork;
//			
//				var tiles = mapWork.groundTiles;
//				
//				if (DF.IS_HIDDEN_DOOR) {
//					eachTiles(tiles, (tile, x, y, tiles) => {
//						if (tile === DF.MAP_TILE_DOOR_OPEN) {
//							// ドアを消す
//							tiles[y][x] = DF.MAP_TILE_DOOR_CLOSE;
//						}
//					});
//				}
//
//				// コリジョン自動生成.
//				var collisionData = [];
//				for (var y = 0, yNum = tiles.length; y < yNum; ++y) {
//					var line = [];
//					for (var x = 0, xNum = tiles[y].length; x < xNum; ++x) {
//						var tile = tiles[y][x];
//						line.push(DF.MAP_TILE_COLLISION_MIN <= tile && tile <= DF.MAP_TILE_COLLISION_MAX);
//					}
//					collisionData.push(line);
//				}
//				
//				map.loadData(tiles);
//				map.collisionData = collisionData;
//			})();
//
			// 敵, スタート地点.
			(() => {
				var mapCharaMgr: game.MapCharaManager = scene.mapCharaMgr;
				var enemyIdx = 0;
				var layer = map.getLayer("chara");
				layer.layer.visible = false;
				layer.eachTileGIDs(loadChara);
				function loadChara(charaId, gridPos, la) {
					if (charaId === 0) {
						return;
					}
					var tileWldPos = layer.gridToWorldPos(gridPos);
					var left =   tileWldPos.x;
					var center = tileWldPos.x + DF.MAP_TILE_W * 0.5;
					var top =    tileWldPos.y + DF.MAP_TILE_H;
					var middle = tileWldPos.y + DF.MAP_TILE_H * 0.5;
					var bottom = tileWldPos.y;

					if (charaId === DF.MAP_TILE_PLAYER_POS) {
						var player = scene.player;
						player.x = center;
						player.y = bottom + player.height * 0.5;
					} else if (DF.MAP_TILE_CHARA_MIN <= charaId) {
						var enemyId = charaId - DF.MAP_TILE_CHARA_MIN;
						var data = game.EnemyData[enemyId]
						var enemy = new game.Enemy();
						enemy.stopAllActions();
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
							cc.log("unknown case:" + alignH);
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
							cc.log("unknown case:" + alignV);
							break;
						}
						
						enemy.x = enemy.anchor.x = anchorX;
						enemy.y = enemy.anchor.y = anchorY;
						data.brain(enemy);
						enemy.name = "enemy" + (++enemyIdx);
						mapCharaMgr.addSleep(enemy);
					}

				};

			})();
			var camera = scene.camera;
			camera.limitRect.x = 0;
			camera.limitRect.y = 0;
			camera.limitRect.width = map.map.width;
			camera.limitRect.height = map.map.height;// + (DF.SC1_H / 2);

			cc.log(
				"map.wh: " + map.map.width + ", " + map.map.height + ", " +
				"layer.wh: " + map.getLayer("ground").layer.width + ", " + map.getLayer("ground").layer.height + ", " +
				""
			);
			
			var player = scene.player;
			player.removeFromParent(false);
			player.viewpoint.removeFromParent(false);
			this.world.addChild(player);
			this.world.addChild(player.viewpoint);
			utils.Rect.copyFrom(player.limitRect, camera.limitRect);
			player.touchStartAnchor.x = player.x;
			player.touchStartAnchor.y = player.y;
			player.startMap();

			// カメラの追跡対象をプレイヤーにする.
			camera.targetNode = player.viewpoint;
			camera.moveToTarget();
		},

		addEffect: function (animId: number, pos: utils.IVector2D) {
			var scene = cc.director.getRunningScene();
			var effect = scene.effectPool.alloc();
			if (effect === null) {
				return;
			}
			effect.anim.sequence = g_app.getAnimFrames(animId);
			effect.rect.centerX = pos.x;
			effect.rect.centerY = pos.y;
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
				cc.log("unkown exitType:" + mapOption.exitType);
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
			var minX: number = player.rect.centerX - DF.SC1_W;
			var maxX: number = player.rect.centerX + DF.SC1_W;
			if (minX <= sprite.rect.centerX && sprite.rect.centerX <= maxX) {
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

			if (g_app.testHud.parent) {
				// デバッグ表示.
				g_app.testHud.labels[2].setString(
//					"P:" + Math.floor(player.x) + "x" + Math.floor(player.y) + " " +
					"V:" + Math.floor(player.viewpoint.x) + "x" + Math.floor(player.viewpoint.y) + " " +
					"C:" + Math.floor(this.camera.x) + "x" + Math.floor(this.camera.y) + " " +
					"G:" + player.tileGid + " " +
					// "W:" + player.wallPushDir.x + "," + player.wallPushDir.y + " " +
					(player.targetEnemy ? "L" : " ") + " " +
					""
				);
			}

			//texts[1][0] = player.stateToString()
			//texts[2][1] = "actives:" + mapCharaMgr.actives.length + " " +
			//	"sleeps:" + mapCharaMgr.sleeps.length;
			//
			for (var i = 0, iNum = texts.length; i < iNum; ++i) {
				var line = texts[i].join(" ");
				this.labels[i].setString(line);
			}
		},

		mapGridToWorldPos: function (layer, gridPos: utils.IVector2D): utils.IVector2D {
			return cc.p(gridPos.x * DF.MAP_TILE_W, gridPos.y * DF.MAP_TILE_H);
		},

		hitTest: function (layer, x, y): boolean {
			var gid = layer.getGID(x, y);
			return DF.MAP_TILE_COLLISION_MIN <= gid && gid <= DF.MAP_TILE_COLLISION_MAX;
		},

		/**
			スプライトと地形の衝突判定.
			衝突してたら、スプライトの位置を補正する.
		*/
		checkMapCollision: function (
			spr: any,
			/** 距離補正されたら呼ばれる. */
			onTrim: (x: number, y: number) => void,
			/** タイルに重なったら呼ばれる. */
			onIntersect: (tile: number, x: number, y: number) => void) {

			var sprRect: utils.IRect = spr.collider.getRect();
			var sprForceX = spr.force.x;
			var sprForceY = spr.force.y;

			var map: game.GameMap = this.map;
			var tileSize = map.map.getTileSize();
			var layer = map.getLayer("ground");
			var xDiff = tileSize.width;
			var yDiff = tileSize.height;

			// スプライトの4隅.
			var xMin = sprRect.x;
			var yMin = sprRect.y;
			var xMax = sprRect.x + sprRect.width + (xDiff - 1);
			var yMax = sprRect.y + sprRect.height + (yDiff - 1);
			//
			var tileRect = utils.Rect.alloc();
			tileRect.width = tileSize.width;
			tileRect.height = tileSize.height;
			spr.tileGid = layer.getGID(spr.x, spr.y);
			try {
				for (var y = yMin; y < yMax; y += yDiff) {
					for (var x = xMin; x < xMax; x += xDiff) {
						tileRect.x = Math.floor(x / tileSize.width) * tileSize.width;
						tileRect.y = Math.floor(y / tileSize.height) * tileSize.height;
						if (!utils.Rect.intersect(sprRect, tileRect)) {
							continue;
						}
						var gid = layer.getGID(x, y);
						if (onIntersect) {
							onIntersect.call(spr, gid, x, y);
						}
						if (!this.hitTest(layer, x, y)) {
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
						if (0 < sprForceX) {
							// to left.
							if (this.hitTest(layer, x - xDiff, y)) {
								//
							} else {
								addX = (tileRect.x - sprRect.width) - sprRect.x;
								isTrimX = true;
							}
						} else if (sprForceX < 0) {
							// to right.
							if (this.hitTest(layer, x + xDiff, y)) {
								//
							} else {
								addX =  (tileRect.x + tileRect.width) - sprRect.x;
								isTrimX = true;
							}
						}
						// Y.
						if (0 < sprForceY) {
							// to top.
							if (this.hitTest(layer, x, y - yDiff)) {
								//
							} else {
								addY = (tileRect.y - sprRect.height) - sprRect.y;
								isTrimY = true;
							}
						} else if (sprForceY < 0) {
							// to bottom.
							if (this.hitTest(layer, x, y + yDiff)) {
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
						} else if (isTrimY) {
							spr.y += addY;
							sprRect.y += addY;
							onTrim.call(spr, 0, g_app.numberUtil.sign(-addY));
						}

						if (!spr.parent) {
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
					this.addEffect(DF.ANIM_ID_DAMAGE, bullet.rect.center);
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
					this.addEffect(DF.ANIM_ID_DAMAGE, player.rect.center);
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
							this.addEffect(DF.ANIM_ID_DAMAGE, bullet.rect.center);
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


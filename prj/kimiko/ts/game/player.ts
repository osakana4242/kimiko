
/// <reference path="../kimiko.ts" />

module jp.osakana4242.kimiko.game {

	var g_app = jp.osakana4242.kimiko.g_app;

	/**
		force 自然な力
		ctrlForce 意図的な力
	*/
	export var Player: any = cc.Sprite.extend( {

			ctor: function () {
				this._super();

				this.age = 0;
				this.rect = new utils.NodeRect(this);
				this.force = new utils.Vector2D();
				this.dirX = 1;
				
				this.bodyStyles = (() => {
					var animWalk = g_app.getAnimFrames(DF.ANIM_ID_CHARA001_WALK);
					var animStand = g_app.getAnimFrames(DF.ANIM_ID_CHARA001_STAND);
					var animSquat = g_app.getAnimFrames(DF.ANIM_ID_CHARA001_SQUAT);
					var animDead = g_app.getAnimFrames(DF.ANIM_ID_CHARA001_DEAD);
					this.anim = new utils.AnimSequencer(this);
					this.anim.sequence = animWalk;

					var oldX = 0;
					var oldY = 0;
	
					var colliderA = utils.Collider.centerBottom(this, 12, 28);
					var colliderB = utils.Collider.centerBottom(this, 12, 14);
					var muzzlePosUp = new utils.Vector2D( 36, 12 );
					var muzzlePosDown = new utils.Vector2D( 36, 24 );

					return {
						"stand": {
							"anim": animStand,
							"collider": colliderA,
							"muzzlePos": muzzlePosUp,
						},
						"walk": {
							"anim": animWalk,
							"collider": colliderA,
							"muzzlePos": muzzlePosUp,
						},
						"squat": {
							"anim": animSquat,
							"collider": colliderB,
							"muzzlePos": muzzlePosDown,
						},
						"dead": {
							"anim": animDead,
							"collider": colliderB,
							"muzzlePos": muzzlePosUp,
						},
					};
				})();
				
				this.collider = (() => {
					var c = new utils.Collider();
					c.parent = this;
					return c;
				})();

				this.viewpoint = (() => {
					var sprite = oskn.Plane.create(cc.color(0xff, 0xff, 0x00), 8, 8);
					sprite.retain();
					return sprite;
				})();

				this.bodyStyle = this.bodyStyles.stand;

				this.life = new game.Life(this);
				this.life.hpMax = DF.PLAYER_HP;
				this.life.hp = this.life.hpMax;
				this.life.setGhostFrameMax(g_app.secToFrame(1.5));

				this.gravityHoldCounter = 0;
				this.touchStartAnchor = new utils.Vector2D();
				this.isPause = false;
				this.isSlowMove = false;
				this.isOnMap = false;
				this.targetEnemy = null;
				this.limitRect = new utils.Rect( 0, 0, DF.SC_W, DF.SC_H );
				/** 壁を押している方向. */
				this.wallPushDir = new utils.Vector2D();
				/** 入力された移動距離. */
				this.inputForce = new utils.Vector2D();

				this.scheduleUpdate();
				this._onTrim = (x, y) => { this.onTrim(x, y); };
			},

			/** ステージ開始時用の状態初期化. */
			reset: function (pd: kimiko.PlayerData) {
				this.life.resetCounter();
				this.life.hpMax = pd.hpMax;
				this.life.hp = pd.hp;

				this.bodyStyle = this.bodyStyles.stand;
				this.targetEnemy = null;
				this.gravityHoldCounter = 0;
				this.dirX = 1;
				this.scaleX = 1.0;
				this.scaleY = 1.0;
				this.opacity = 0xff;
				this.visible = true;
			},

			update: function (deltaTime: number) {
				++this.age;
				var scene = cc.director.getRunningScene();
				if (this.isPause) {
					return;
				}
				this.life.step();

				var isAlive = this.life.isAlive;
				if (isAlive) {
					this.checkInput();
				}
				this.updateBodyStyle();
				if (isAlive) {
					this.stepMove();
					this.searchEnemy();
				}
				// viewpoint.
				var viewpoint = this.viewpoint;
				viewpoint.x = this.x;
				viewpoint.y = this.y;
				viewpoint.x += (this.dirX * 16);
				// 指で操作する関係で下方向に余裕を持たせる.
				viewpoint.y += 24 * DF.DOWN;
				if (this.isBodyStyleSquat) {
					if (this.scaleY < 0) {
						viewpoint.y += 16 * DF.UP;
					} else {
						viewpoint.y += 16 * DF.DOWN;
					}
				}

				Object.defineProperty(this, "bodyStyle", {
						get: function () {
							return this._bodyStyle;
						},
						set: function (v) {
							this._bodyStyle = v;
							this.anim.sequence = v.anim;
							utils.Rect.copyFrom(this.collider.rect, v.collider);
						},
						enumerable: true,
						configurable: true
				});
				Object.defineProperty(this, "isBodyStyleSquat", {
						get: function () {
							return this.bodyStyle === this.bodyStyles.squat;
						},
						enumerable: true,
						configurable: true
				});
			},
			
			searchEnemy: function () {
				var scene = cc.director.getRunningScene();
				if ((this.age % g_app.secToFrame(0.2)) === 0) {
					// TODO: ロックオン済みの敵がいる場合は索敵間隔を遅らせたほうがいいかも.
					// 近い敵を探す.
					var srect = utils.Rect.alloc();
					srect.width = 256;
					srect.height = this.height * 2;
					srect.x = this.x + ((this.width - srect.width) / 2);
					srect.y = this.y + ((this.height - srect.height) / 2);
					var enemy = scene.getNearEnemy(this, srect);
					if (enemy) {
						this.targetEnemy = enemy;
					}	
					utils.Rect.free(srect);
				}
				
				if (this.targetEnemy === null) {
					//
				} else {
					if (this.targetEnemy.life.isDead) {
						// 敵が死んでたら解除.
						this.targetEnemy = null;
					}
					if (this.targetEnemy !== null) {
						var distance = utils.Rect.distance(this, this.targetEnemy);
						var threshold = DF.SC1_W;
						if (threshold < distance) {
							// 敵が離れたら解除.
							this.targetEnemy = null;
						} else {
							// ロックオン状態. 常に敵を見る.
							this.dirX = g_app.numberUtil.sign(this.targetEnemy.x - this.x);
							this.scaleX = this.dirX;
							if ((this.age % g_app.secToFrame(0.2)) === 0) {
								// TODO: 敵同様にweaponクラス化.
								var srect = utils.Rect.alloc();
								srect.width = DF.SC1_W;
								srect.height = this.height * 2;
								srect.x = this.x + (this.dirX < 0 ? - srect.width : 0); 
								srect.y = this.y + ((this.height - srect.height) / 2);
								if (utils.Rect.intersect(srect, this.targetEnemy)) {
									this.attack();
								}
								utils.Rect.free(srect);
							}
						}
					}
				}
			},

			stateToString: function () {
				var str = " hp:" + this.life.hp +
					" L:" + (this.targetEnemy !== null ? "o" : "x");
				return str;
			},

			attack: function () {
				if (!g_app.config.isFireEnabled) {
					return;
				}
				var bullet = cc.director.getRunningScene().newOwnBullet();
				if (bullet === null) {
					return;
				}
				g_app.sound.playSe(Assets.SOUND_SE_SHOT);
				bullet.scaleX = this.scaleX;
				bullet.force.x = this.dirX * 6 * 60;
				bullet.force.y = 0;
				bullet.x = this.x + this.scaleX * (this.bodyStyle.muzzlePos.x - (this.width / 2));
				bullet.y = this.y + this.scaleY * (this.bodyStyle.muzzlePos.y - (this.height / 2));
			},
			
			updateBodyStyle: function () {
				var scene = cc.director.getRunningScene();
				var touch: utils.Touch = scene.touch;
				// body style
				var nextBodyStyle = this.bodyStyle;
				if (this.life.isDead) {
					nextBodyStyle = this.bodyStyles.dead;
				} else if (0 < this.wallPushDir.y && DF.PLAYER_SQUAT_THRESHOLD < touch.totalDiff.y) {
					// しゃがみ判定.
					// 横の移動量が規定範囲内 + 接地した状態で地面方向に力がかかってる状態.
					nextBodyStyle = this.bodyStyles.squat;
				} else if (this.wallPushDir.y < 0 && touch.totalDiff.y < - DF.PLAYER_SQUAT_THRESHOLD) {
					nextBodyStyle = this.bodyStyles.squat;
					// nextBodyStyle = this.bodyStyles.stand;
				} else if (!utils.Vector2D.equals(this.inputForce, utils.Vector2D.zero)) {
					if (this.bodyStyle === this.bodyStyles.squat) {
						if (this.inputForce.y * this.scaleY < 0) {
							nextBodyStyle = this.bodyStyles.walk;
						} else {
							nextBodyStyle = this.bodyStyles.squat;
						}
					} else {
						nextBodyStyle = this.bodyStyles.walk;
					}
					nextBodyStyle = this.bodyStyles.walk;
				} else {
					if (this.bodyStyle === this.bodyStyles.squat) {
						//nextBodyStyle = this.bodyStyles.squat;
						nextBodyStyle = this.bodyStyles.stand;
					} else {
						nextBodyStyle = this.bodyStyles.stand;
					}
				}
				if (this.wallPushDir.y !== 0) {
					this.scaleY = this.wallPushDir.y < 0 ? 1 : -1;
				}

				if (this.bodyStyle !== nextBodyStyle) {
					this.bodyStyle = nextBodyStyle;
				}
			},

			stepMove: function () {
				var scene = cc.director.getRunningScene();
				var deltaTime = cc.director.getDeltaTime();
				this.oldX = this.x;
				this.oldY = this.y;

				if (!this.targetEnemy) {
						var touch: utils.Touch = scene.touch;
						if (touch.isTouching) {
							if (DF.PLAYER_TURN_CHANGE_THRESHOLD < Math.abs(touch.totalDiff.x)) {
								this.dirX = g_app.numberUtil.sign(touch.totalDiff.x);
								this.scaleX = this.dirX;
								//cc.log("this.dirX:" + this.dirX);
							}
						}
//					if (0 !== this.inputForce.x) {
//						this.dirX = g_app.numberUtil.sign(this.inputForce.x);
//						this.scaleX = this.dirX;
//					}
				}
				//
				if (this.isSlowMove ||
					!utils.Vector2D.equals(this.inputForce, utils.Vector2D.zero)) {
					this.force.x = this.inputForce.x;
					this.force.y = this.inputForce.y;
				} else {
					//
				}
				if (0 < this.gravityHoldCounter) {
					var old = this.gravityHoldCounter;
					this.gravityHoldCounter -= deltaTime;
					// cc.log("deltaTime:" + deltaTime + " hc: " + old + " -> " + this.gravityHoldCounter);
				} else {
					if (0 < this.scaleY) {
						var gravityMin = - 60 * 10 * deltaTime;
						this.force.y = Math.max(this.force.y - DF.GRAVITY * deltaTime, gravityMin);
					} else {
						var gravityMax = 60 * 10 * deltaTime;
						this.force.y = Math.min(this.force.y + DF.GRAVITY * deltaTime, gravityMax);
					}
				}
	
				var totalMx = this.force.x;
				var totalMy = this.force.y;
				var oldForceX = this.force.x;
				var oldForceY = this.force.y;

				// 壁衝突状態リセット.
				utils.Vector2D.copyFrom(this.wallPushDir, utils.Vector2D.zero);

				// 壁突き抜け防止のため、移動を数回に分ける.
				var loopCnt = Math.floor(Math.max(Math.abs(totalMx), Math.abs(totalMy)) / DF.PLAYER_MOVE_RESOLUTION);
				//
				// 1回の移動量. 移動するごとに地形との当たり判定を行う.
				var mx = totalMx / loopCnt;
				var my = totalMy / loopCnt;
				
				for (var i = 0; i <= loopCnt; ++i) {
					if (i < loopCnt) {
						this.x += mx;
						this.y += my;
						totalMx -= mx;
						totalMy -= my;
					} else {
						// 最後のひと押し.
						this.x += totalMx;
						this.y += totalMy;
					}
					utils.Rect.trimPos(this.rect, this.limitRect, this._onTrim);
					scene.checkMapCollision(this, this._onTrim, this.onIntersect);
					if (this.force.x === 0) {
						mx = 0;
						totalMx = 0;
					}
					if (this.force.y === 0) {
						my = 0;
						totalMy = 0;
					}
				}
				
				if (false) {
					// 壁にひっかかったときに、ひっかかった分の移動量を打ち消すか.
					if (oldForceX !== this.force.x) {
						this.touchStartAnchor.x += this.force.x - oldForceX + g_app.numberUtil.sign(oldForceX);
					}
					if (oldForceY !== this.force.y) {
						this.touchStartAnchor.y += this.force.y - oldForceY + g_app.numberUtil.sign(oldForceY);
					}
				}

				//
				if (!utils.Vector2D.equals(this.inputForce, utils.Vector2D.zero)) {
					this.force.x = 0;
					this.force.y = 0;
				}
			},
			
			startMap: function () {
				cc.log("player startMap");
				this.isPause = false;
			},
			
			endMap: function () {
				cc.log("player endMap");
				this.isPause = true;
			},

			onIntersect: function (tile: number, x: number, y: number) {
				if (tile !== DF.MAP_TILE_DOOR_OPEN) {
					return;
				}
				// クリア.
				var scene = cc.director.getRunningScene();
				scene.state = scene.stateGameClear;
				this.endMap();
			},
				
			onTrim: function (x: number, y: number) {
				if (x !== 0) {
					if (1 < Math.abs(this.inputForce.x)) {
						this.wallPushDir.x = x;
					}
					this.force.x = 0;
				}

				if (y !== 0) {
					if (1 < Math.abs(this.inputForce.y)) {
						this.wallPushDir.y = y;
					}
					this.force.y = 0;
				}
			},
			
			checkInput: function () {
				utils.Vector2D.copyFrom(this.inputForce, utils.Vector2D.zero);
				if (this.life.isDead) {
					return;
				}
				this.checkKeyInput();
				this.checkTouchInput();
			},

			checkKeyInput: function () {
//				var input = g_app.input;
//				var flag =
//					((input.left  ? 1 : 0) << 0) |
//					((input.right ? 1 : 0) << 1) |
//					((input.up    ? 1 : 0) << 2) |
//					((input.down  ? 1 : 0) << 3);
//				this.isSlowMove = g_app.input.a;
//				if (flag !== 0) {
//					if (this.isSlowMove) {
//						this.inputForce.x = DF.DIR_FLAG_TO_VECTOR2D[flag].x * g_app.dpsToDpf(2 * 60);
//						this.inputForce.y = DF.DIR_FLAG_TO_VECTOR2D[flag].y * g_app.dpsToDpf(2 * 60);
//					} else {
//						this.inputForce.x = DF.DIR_FLAG_TO_VECTOR2D[flag].x * g_app.dpsToDpf(4 * 60);
//						this.inputForce.y = DF.DIR_FLAG_TO_VECTOR2D[flag].y * g_app.dpsToDpf(4 * 60);
//					}
//				}
//				if (this.isSlowMove || flag !== 0) {
//					this.gravityHoldCounter = g_app.secToFrame(DF.GRAVITY_HOLD_SEC);
//				}
			},

			checkTouchInput: function () {
				var scene = cc.director.getRunningScene();
				var player = this;
				var touch: utils.Touch = scene.touch;
				if (touch.isTouching) {
					var moveLimit = DF.TOUCH_TO_CHARA_MOVE_LIMIT;
					var moveRate = g_app.config.swipeToMoveRate;
					if (DF.PLAYER_TOUCH_ANCHOR_ENABLE) {
						var tv = utils.Vector2D.alloc(
							player.touchStartAnchor.x + touch.totalDiff.x * moveRate.x,
							player.touchStartAnchor.y + touch.totalDiff.y * moveRate.y);
						var v = utils.Vector2D.alloc(
							tv.x - player.x,
							tv.y - player.y);
						var vm = Math.min(utils.Vector2D.magnitude(v), moveLimit);
						utils.Vector2D.normalize(v);
						v.x *= vm;
						v.y *= vm;
						player.inputForce.x = v.x;
						player.inputForce.y = v.y;
						utils.Vector2D.free(tv);
						utils.Vector2D.free(v);
					} else {
						player.inputForce.x = g_app.numberUtil.trim(touch.diff.x * moveRate.x, -moveLimit, moveLimit);
						player.inputForce.y = g_app.numberUtil.trim(touch.diff.y * moveRate.y, -moveLimit, moveLimit);
					}
					this.gravityHoldCounter = DF.GRAVITY_HOLD_SEC;
				}
			},

			onDead: function () {
				// プレイヤーをふっとばす演出.
				var player = this;
				var sx = player.x;
				var sy = player.y;
				var t1x = sx + (- player.dirX * 96);
				var t1y = sy - 64;
				var dx = - player.dirX;
				player.runAction(cc.Sequence.create(
					cc.MoveBy.create(0.2, cc.p(dx * 96 * 0.25, -96 * 0.8)), 
					cc.MoveBy.create(0.2, cc.p(dx * 96 * 0.25, -96 * 0.2)),
					cc.MoveBy.create(0.3, cc.p(dx * 96 * 0.25,  32 * 0.2)),
					cc.MoveBy.create(0.3, cc.p(dx * 96 * 0.25,  32 * 0.8)),
					cc.Hide.create()
				));
			},

		});

}


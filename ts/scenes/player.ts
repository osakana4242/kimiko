
/// <reference path="../kimiko.ts" />

module jp.osakana4242.kimiko.scenes {
	var Class = enchant.Class;
	var Core = enchant.Core;
	var Scene = enchant.Scene;
	var Label = enchant.Label;
	var Event = enchant.Event;
	var Easing = enchant.Easing;

	export var Player: any = Class.create(Attacker, {

			initialize: function () {
				Attacker.call(this);
				this.image = kimiko.core.assets[Assets.IMAGE_CHARA001]
				this.width = 32;
				this.height = 32;
				
				this.bodyStyles = (() => {
					var animWalk = kimiko.getAnimFrames(DF.ANIM_ID_CHARA001_WALK);
					var animStand = kimiko.getAnimFrames(DF.ANIM_ID_CHARA001_STAND);
					var animSquat = kimiko.getAnimFrames(DF.ANIM_ID_CHARA001_SQUAT);
					var colliderA = (() => {
						var c = new utils.Collider();
						c.parent = this;
						c.centerBottom(12, 28);
						return c;
					}());
					var colliderB = (() => {
						var c = new utils.Collider();
						c.parent = this;
						c.centerBottom(12, 14);
						return c;
					}());

					return {
						"stand": {
							"anim": animStand,
							"collider": colliderA,
						},
						"walk": {
							"anim": animWalk,
							"collider": colliderA,
						},
						"squat": {
							"anim": animSquat,
							"collider": colliderB,
						},
					};
				}());
				
				this.bodyStyle = this.bodyStyles.stand;

				this.life.hpMax = DF.PLAYER_HP;
				this.life.hp = this.life.hpMax;
				this.life.setGhostFrameMax(kimiko.secToFrame(1.5));

				this.touchStartAnchor = new utils.Vector2D();
				this.useGravity = true;
				this.isOnMap = false;
				this.targetEnemy = null;
				this.limitRect = new utils.Rect( 0, 0, DF.SC_W, DF.SC_H );
				/** 壁を押している方向. */
				this.wallPushDir = new utils.Vector2D();

				this.addEventListener(Event.ENTER_FRAME, () => {
					var scene = this.scene;
					this.checkTouchInput();
					this.stepMove();
					if ((this.age % kimiko.secToFrame(0.2)) === 0) {
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
						if (this.targetEnemy.life.isDead()) {
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
								this.dirX = kimiko.numberUtil.sign(this.targetEnemy.x - this.x);
								this.scaleX = this.dirX;
								if ((this.age % kimiko.secToFrame(0.2)) === 0) {
									// TODO: 敵同様にweaponクラス化.
									var srect = utils.Rect.alloc();
									srect.width = DF.SC1_W;
									srect.height = this.height * 2;
									srect.x = this.center.x + (this.dirX < 0 ? - srect.width : 0); 
									srect.y = this.y + ((this.height - srect.height) / 2);
									if (utils.Rect.intersect(srect, this.targetEnemy)) {
										this.attack();
									}
									utils.Rect.free(srect);
								}
							}
						}
					}
				});
			},
			
			bodyStyle: {
				get: function () { return this._bodyStyle; },
				set: function (v) { 
					this._bodyStyle = v;
					this.anim.sequence = v.anim;
					this.collider = v.collider;
				},
			},

			stateToString: function () {
				var str = Attacker.prototype.stateToString.call(this);
				str += " hp:" + this.life.hp +
					" L:" + (this.targetEnemy !== null ? "o" : "x");
				return str;
			},

			attack: function () {
				var bullet = this.scene.newOwnBullet();
				if (bullet === null) {
					return;
				}
				bullet.force.x = this.dirX * kimiko.dpsToDpf(6 * 60);
				bullet.force.y = 0;
				bullet.center.x = this.center.x;
				bullet.center.y = this.center.y;
			},

			stepMove: function () {
				var scene = this.scene;

				var input = kimiko.core.input;
				var flag =
					((input.left  ? 1 : 0) << 0) |
					((input.right ? 1 : 0) << 1) |
					((input.up    ? 1 : 0) << 2) |
					((input.down  ? 1 : 0) << 3);
				var isSlow: bool = kimiko.core.input.a;
				if (isSlow) {
					this.force.x = 0;
					this.force.y = 0;
				}
				if (flag !== 0) {
					if (isSlow) {
						this.force.x = DF.DIR_FLAG_TO_VECTOR2D[flag].x * 2;
						this.force.y = DF.DIR_FLAG_TO_VECTOR2D[flag].y * 2;
					} else {
						this.force.x = DF.DIR_FLAG_TO_VECTOR2D[flag].x * 4;
						this.force.y = DF.DIR_FLAG_TO_VECTOR2D[flag].y * 4;
					}
				}

				if (!this.targetEnemy) {
					if (0 !== this.force.x) {
						this.dirX = kimiko.numberUtil.sign(this.force.x);
						this.scaleX = this.dirX;
					}
				}
				// body style
				var nextBodyStyle = this.bodyStyle;
				if (Math.abs(this.force.x) < 2 && 0 < this.wallPushDir.y) {
					// しゃがみ判定.
					// 横の移動量が規定範囲内 + 接地した状態で地面方向に力がかかってる状態.
					nextBodyStyle = this.bodyStyles.squat;
				} else if (this.force.x !== 0 || this.force.y !== 0) {
					nextBodyStyle = this.bodyStyles.walk;
				} else {
					nextBodyStyle = this.bodyStyles.stand;
				}
				if (this.bodyStyle !== nextBodyStyle) {
					this.bodyStyle = nextBodyStyle;
				}
				//
				if (this.useGravity && !this.isOnMap) {
					this.force.y += kimiko.dpsToDpf(DF.GRAVITY);
				}

				// 壁衝突状態リセット.
				utils.Vector2D.copyFrom(this.wallPushDir, utils.Vector2D.zero);

				// 壁突き抜け防止のため、移動を数回に分ける.
				var loopCnt = Math.floor(Math.max(Math.abs(this.force.x), Math.abs(this.force.y)) / DF.PLAYER_MOVE_RESOLUTION);
				//
				var totalMx = this.force.x;
				var totalMy = this.force.y;
				// 1回の移動量. 移動するごとに地形との当たり判定を行う.
				var mx = this.force.x / loopCnt;
				var my = this.force.y / loopCnt;
				
				for (var i = 0, loopCnt; i <= loopCnt; ++i) {
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
					utils.Rect.trimPos(this, this.limitRect, this.onTrim);
					scene.checkMapCollision(this, this.onTrim);
					if (this.force.x === 0) {
						mx = 0;
						totalMx = 0;
					}
					if (this.force.y === 0) {
						my = 0;
						totalMy = 0;
					}
				}

				//
				var touch: utils.Touch = scene.touch;
				if (touch.isTouching || flag !== 0) {
					this.force.x = 0;
					this.force.y = 0;
				}
			},
				
			onTrim: function (x: number, y: number) {
				if (x !== 0) {
					if (1 < Math.abs(this.force.x)) {
						this.wallPushDir.x = x;
					}
					this.force.x = 0;
				}

				if (y !== 0) {
					if (1 < Math.abs(this.force.y)) {
						this.wallPushDir.y = y;
					}
					this.force.y = 0;
				}
			},

			checkTouchInput: function () {
				var scene = this.scene;
				var player = this;
				var touch: utils.Touch = scene.touch;
				if (!touch.isTouching) {
					var input = kimiko.core.input;
					var flag =
						((input.left  ? 1 : 0) << 0) |
						((input.right ? 1 : 0) << 1) |
						((input.up    ? 1 : 0) << 2) |
						((input.down  ? 1 : 0) << 3);
					var isSlow: bool = kimiko.core.input.a;
					if (isSlow) {
						player.force.x = 0;
						player.force.y = 0;
					}
					if (flag !== 0) {
						if (isSlow) {
							player.force.x = DF.DIR_FLAG_TO_VECTOR2D[flag].x * 2;
							player.force.y = DF.DIR_FLAG_TO_VECTOR2D[flag].y * 2;
						} else {
							player.force.x = DF.DIR_FLAG_TO_VECTOR2D[flag].x * 4;
							player.force.y = DF.DIR_FLAG_TO_VECTOR2D[flag].y * 4;
						}
					}
				} else {
					var moveLimit = DF.TOUCH_TO_CHARA_MOVE_LIMIT;
					var moveRate = kimiko.config.swipeToMoveRate;
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
						player.force.x = v.x;
						player.force.y = v.y;
						utils.Vector2D.free(tv);
						utils.Vector2D.free(v);
					} else {
						player.force.x = kimiko.numberUtil.trim(touch.diff.x * moveRate.x, -moveLimit, moveLimit);
						player.force.y = kimiko.numberUtil.trim(touch.diff.y * moveRate.y, -moveLimit, moveLimit);
					}
				}
			},

		});

}


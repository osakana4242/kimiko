/// <reference path="../kimiko.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.game {

	var Easing = enchant.Easing;

	export module EnemyBodys {

		export function body1(sprite: any) {
			sprite.width = 32;
			sprite.height = 32;
			sprite.anim.sequence = g_app.getAnimFrames(DF.ANIM_ID_CHARA002_WALK);
			utils.Rect.copyFrom(sprite.collider.rect, utils.Collider.centerBottom(sprite, 28, 28));
		}

		/** クネクネカラス */
		export function body2(sprite: any) {
			sprite.width = 64;
			sprite.height = 64;
			sprite.anim.sequence = g_app.getAnimFrames(DF.ANIM_ID_CHARA003_WALK);
			utils.Rect.copyFrom(sprite.collider.rect, utils.Collider.centerMiddle(sprite, 56, 56));
			sprite.weaponNum = 3;
		}

		/** 星型. */
		export function body4(sprite: any) {
			sprite.width = 32;
			sprite.height = 32;
			sprite.anim.sequence = g_app.getAnimFrames(DF.ANIM_ID_CHARA004_WALK);
			utils.Rect.copyFrom(sprite.collider.rect, utils.Collider.centerBottom(sprite, 28, 28));
		}

		/** 風船型. */
		export function body5(sprite: any) {
			sprite.width = 32;
			sprite.height = 32;
			sprite.anim.sequence = g_app.getAnimFrames(DF.ANIM_ID_CHARA005_WALK);
			utils.Rect.copyFrom(sprite.collider.rect, utils.Collider.centerBottom(sprite, 28, 28));
		}

		/** バネ型. */
		export function body6(sprite: any) {
			sprite.width = 32;
			sprite.height = 32;
			sprite.anim.sequence = g_app.getAnimFrames(DF.ANIM_ID_CHARA006_WALK);
			utils.Rect.copyFrom(sprite.collider.rect, utils.Collider.centerBottom(sprite, 28, 28));
		}

		/** 弾丸型. */
		export function body7(sprite: any) {
			sprite.width = 32;
			sprite.height = 32;
			sprite.anim.sequence = g_app.getAnimFrames(DF.ANIM_ID_CHARA007_WALK);
			utils.Rect.copyFrom(sprite.collider.rect, utils.Collider.centerBottom(sprite, 28, 28));
		}
		/** カニ型. */
		export function body8(sprite: any) {
			sprite.width = 32;
			sprite.height = 32;
			sprite.anim.sequence = g_app.getAnimFrames(DF.ANIM_ID_CHARA008_WALK);
			utils.Rect.copyFrom(sprite.collider.rect, utils.Collider.centerBottom(sprite, 28, 28));
		}
		/** 中キャラ */
		export function body10(sprite: any) {
			sprite.width = 48;
			sprite.height = 48;
			//sprite.anim.sequence = g_app.getAnimFrames(DF.ANIM_ID_CHARA002_WALK);
			sprite.backgroundColor = "rgb(255,48,48)";
			utils.Rect.copyFrom(sprite.collider.rect, utils.Collider.centerBottom(sprite, 32, 40));
		}
	}

	export module EnemyBrains {

		/** 突進. */
		export function brain1(sprite: any): void {
			var anchor = sprite.anchor;

			sprite.tl.
				delay(g_app.secToFrame(0.5)).
				then(function () {
					var player = sprite.scene.player;
					var dir = utils.Vector2D.alloc(
						player.center.x - sprite.center.x,
						player.center.y - sprite.center.y
					);
					var mag = utils.Vector2D.magnitude(dir);
					var dist = 480;
					var speed = g_app.dpsToDpf(2 * DF.BASE_FPS);
					dir.x = dir.x * dist / mag;
					dir.y = dir.y * dist / mag;
					var frame = Math.floor(dist / speed);
					
					sprite.tl.
						moveBy(dir.x, dir.y, frame).
						then(function () {
							sprite.life.kill();
						});

					utils.Vector2D.free(dir);
				});
		}

		/** 追跡. */
		export function brain2(sprite: any): void {
			var anchor = sprite.anchor;
			sprite.weapon.fireFunc = WeaponA.fireA;

			var xMin = anchor.x + (32 * -8);
			var xMax = anchor.x + (32 *  8);
			var yMin = anchor.y + (32 * -8);
			var yMax = anchor.y + (32 *  8);
			var cnt = 0;
			function f1(e) {
				if (e) {
					return false;
				}
				var isNext = false;
				var player = sprite.scene.player;
				var dir = utils.Vector2D.alloc(
					g_app.numberUtil.trim(player.center.x, xMin, xMax) - sprite.center.x,
					g_app.numberUtil.trim(player.center.y, yMin, yMax) - sprite.center.y
				);
				var mag = utils.Vector2D.magnitude(dir);
				// var dist = mag;
				var dist = 32 * 4;
				if (dist < 4) {
					// 移動の必要ナシ.
					isNext = false;
				} else {
					var speed = g_app.dpsToDpf(2 * DF.BASE_FPS);
					dir.x = dir.x * dist / mag;
					dir.y = dir.y * dist / mag;
					var frame = (speed === 0) ? 1 : Math.max(Math.floor(dist / speed), 1);
					
					sprite.tl.
						moveTo(sprite.x + dir.x, sprite.y + dir.y, frame).
						then(() => {
							if (2 <= sprite.enemyData.level) {
								sprite.weapon.lookAtPlayer();
								sprite.weapon.startFire();
							}
						}).
						delay(g_app.secToFrame(0.5)).
						waitUntil(f1);
					isNext = true;
				}
				utils.Vector2D.free(dir);
				return isNext;
			}
			sprite.tl.
				waitUntil(f1);
		}

		/** 地上ジャンプ.*/
		export function brain3(sprite: any): void {
			var anchor = sprite.anchor;
			sprite.weapon.fireFunc = WeaponA.fireA;

			sprite.tl.
				then(() => { sprite.scaleX = -1; }).
				moveBy( -32 * 4 * 0.5, -32 * 3, g_app.secToFrame( 0.5 ) ).
				moveBy( -32 * 4 * 0.5,  32 * 3, g_app.secToFrame( 0.5 ) ).
				delay( g_app.secToFrame( 0.25 ) ).
				then(() => {
					if (2 <= sprite.enemyData.level) {
						sprite.weapon.lookAtPlayer();
						sprite.weapon.startFire();
					}
				}).
				then(() => { sprite.scaleX = 1; }).
				moveBy(  32 * 4 * 0.5, -32 * 3, g_app.secToFrame( 0.5 ) ).
				moveBy(  32 * 4 * 0.5,  32 * 3, g_app.secToFrame( 0.5 ) ).
				delay( g_app.secToFrame( 0.25 ) ).
				loop();
	}

		/** 天井ジャンプ. */
		export function brain4(sprite: any): void {
			sprite.scaleY = -1;
			var anchor = sprite.anchor;
			sprite.weapon.fireFunc = WeaponA.fireA;

			sprite.tl.
				then(() => { sprite.scaleX = -1; }).
				moveBy( -32 * 4 * 0.5,  32 * 3, g_app.secToFrame( 0.5 ) ).
				moveBy( -32 * 4 * 0.5, -32 * 3, g_app.secToFrame( 0.5 ) ).
				delay( g_app.secToFrame( 0.25 ) ).
				then(() => {
					if (2 <= sprite.enemyData.level) {
						sprite.weapon.lookAtPlayer();
						sprite.weapon.startFire();
					}
				}).
				then(() => { sprite.scaleX = 1; }).
				moveBy(  32 * 4 * 0.5,  32 * 3, g_app.secToFrame( 0.5 ) ).
				moveBy(  32 * 4 * 0.5, -32 * 3, g_app.secToFrame( 0.5 ) ).
				delay( g_app.secToFrame( 0.25 ) ).
				loop();
		}

		/** うろつき. */
		export function brain5(sprite: any): void {
			var anchor = sprite.anchor;
			var totalFrame = g_app.secToFrame(8.0);
			sprite.tl.
				moveTo(anchor.x - 32 * 3 + sprite.width / 2, anchor.y, totalFrame * 0.5, Easing.LINEAR).
				moveTo(anchor.x + 0      + sprite.width / 2, anchor.y, totalFrame * 0.5, Easing.LINEAR).
				loop();
		}

		/** ブンブン.*/
		export function brain6(sprite: any): void {
			var anchor = sprite.anchor;
			sprite.weapon.fireFunc = WeaponA.fireA;

			var fire = function () {
				if (2 <= sprite.enemyData.level) {
					sprite.weapon.lookAtPlayer();
					sprite.weapon.startFire();
				}
			};

			sprite.tl.
				moveTo(anchor.x + 32 * -0.5, anchor.y + 32 * -0.5, g_app.secToFrame(0.5)).
				moveTo(anchor.x + 32 *  0.5, anchor.y + 32 * -0.5, g_app.secToFrame(0.5)).
				moveTo(anchor.x + 32 * -0.5, anchor.y + 32 *  0.5, g_app.secToFrame(0.5)).
				moveTo(anchor.x + 32 *  0.0, anchor.y + 32 *  0.0, g_app.secToFrame(0.5)).
				then(fire).
				moveTo(anchor.x + 32 *  0.5, anchor.y + 32 *  0.5, g_app.secToFrame(0.5)).
				loop();
		}

		/** ホバリング.*/
		export function brain7(sprite: any): void {
			var anchor = sprite.anchor;
			sprite.weapon.fireFunc = WeaponA.fireA;

			var fire = function () {
				if (2 <= sprite.enemyData.level) {
					sprite.weapon.lookAtPlayer();
					sprite.weapon.startFire();
				}
			};

			var totalFrame = g_app.secToFrame(2.0);
			sprite.tl.
				moveTo(anchor.x, anchor.y + 32 *  1, totalFrame * 0.5, Easing.LINEAR).
				then(fire).
				moveTo(anchor.x, anchor.y + 32 * -1, totalFrame * 0.5, Easing.LINEAR).
				then(fire).
				loop();
		}

		/** 水平突進.*/
		export function brain8(sprite: any): void {
			var anchor = sprite.anchor;

			sprite.tl.
				then(function () {
					var player = sprite.scene.player;
					sprite.scaleX = ((player.x - sprite.x) < 0) ? -1 : 1;
				}).
				delay(g_app.secToFrame(0.5)).
				then(function () {
					var player = sprite.scene.player;
					var dir = utils.Vector2D.alloc(
						player.center.x - sprite.center.x,
						player.center.y - sprite.center.y
					);
					var mag = utils.Vector2D.magnitude(dir);
					var dist = 480;
					var speed = g_app.dpsToDpf(2 * DF.BASE_FPS);
					dir.x = dir.x * dist / mag;
					dir.y = 0;
					var frame = Math.floor(dist / speed);
					sprite.scaleX = (dir.x < 0) ? -1 : 1;
					
					sprite.tl.
						moveBy(dir.x, dir.y, frame).
						then(function () {
							sprite.life.kill();
						});

					utils.Vector2D.free(dir);
				});
		}

		/** 水平追跡.*/
		export function brain9(sprite: any): void {
			var anchor = sprite.anchor;
			var xMin = anchor.x + (32 * -2) + sprite.width / 2;
			var xMax = anchor.x + (32 *  2) + sprite.width / 2;
			var cnt = 0;
			function f1(e) {
				if (e) {
					return false;
				}
				var isNext = false;
				var player = sprite.scene.player;
				var dir = utils.Vector2D.alloc(
					g_app.numberUtil.trim(player.center.x, xMin, xMax) - sprite.center.x,
					0
				);
				var mag = utils.Vector2D.magnitude(dir);
				if (mag < 4) {
					// 移動の必要ナシ.
					isNext = false;
				} else {
					var dist = mag;
					var speed = g_app.dpsToDpf(1 * DF.BASE_FPS);
					dir.x = dir.x * dist / mag;
					dir.y = dir.y * dist / mag;
					var frame = (speed === 0) ? 1 : Math.max(Math.floor(dist / speed), 1);
					sprite.scaleX = (dir.x < 0) ? -1 : 1;
					sprite.tl.
						moveTo(sprite.x + dir.x, sprite.y + dir.y, frame).
						delay(g_app.secToFrame(0.2)).
						waitUntil(f1);
					isNext = true;
				}
				utils.Vector2D.free(dir);
				return isNext;
			}
			sprite.tl.
				waitUntil(f1);
		}

		// BOSS.
		export function brainBoss(sprite: any): void {
			var anchor = sprite.anchor;

			var waitFire = () => { return !sprite.weapon.isStateFire(); };

			// 発砲の予備動作.
			function runup() {
				return sprite.tl.
					moveBy(0, -24, g_app.secToFrame(0.2), Easing.CUBIC_EASEOUT).
					moveBy(0,  24, g_app.secToFrame(0.2), Easing.CUBIC_EASEOUT).
					moveBy(0, -8, g_app.secToFrame(0.1), Easing.CUBIC_EASEOUT).
					moveBy(0, 8, g_app.secToFrame(0.1), Easing.CUBIC_EASEOUT).
					delay(g_app.secToFrame(0.5));
			}

			function fireToPlayer() {
				var wp: WeaponA = sprite.weapons[0];
				wp.fireCount = 5;
				wp.wayNum = 4;
				wp.fireInterval = g_app.secToFrame(0.5);
				wp.speed = g_app.dpsToDpf(3 * DF.BASE_FPS);
				wp.fireFunc = WeaponA.fireC;
				wp.isTracePlayer = true;
				wp.lookAtPlayer();
				wp.startFire();
				
				wp = sprite.weapons[1];
				wp.fireCount = 3;
				wp.wayNum = 1;
				wp.fireInterval = g_app.secToFrame(0.75);
				wp.speed = g_app.dpsToDpf(2 * DF.BASE_FPS);
				wp.fireFunc = WeaponA.fireA;
				wp.isTracePlayer = true;
				wp.startFire();
			}
	

			function fireToPlayer2() {
				var wp: WeaponA = sprite.weapon;
				wp.fireCount = 9 
				wp.wayNum = 1;
				wp.fireInterval = g_app.secToFrame(0.5);
				wp.speed = g_app.dpsToDpf(3 * DF.BASE_FPS);
				wp.fireFunc = WeaponA.fireB;
				wp.isTracePlayer = true;
				wp.lookAtPlayer();
				wp.startFire();

				wp = sprite.weapons[1];
				wp.fireCount = 1;
				wp.wayNum = 1;
				wp.fireInterval = g_app.secToFrame(1.5);
				wp.speed = g_app.dpsToDpf(1 * DF.BASE_FPS);
				wp.fireFunc = WeaponA.fireA;
				wp.isTracePlayer = true;
				wp.startFire();
			}
			
			function fireToPlayer3() {
				var wp: WeaponA = sprite.weapons[0];
				wp.fireCount = 1;
				wp.wayNum = 6;
				wp.fireInterval = g_app.secToFrame(0.5);
				wp.speed = g_app.dpsToDpf(1 * DF.BASE_FPS);
				wp.fireFunc = WeaponA.fireA;
				wp.isTracePlayer = false;
				wp.lookAtPlayer();
				wp.startFire();
				
				wp = sprite.weapons[1];
				wp.fireCount = 2;
				wp.wayNum = 1;
				wp.fireInterval = g_app.secToFrame(0.2);
				wp.speed = g_app.dpsToDpf(3 * DF.BASE_FPS);
				wp.fireFunc = WeaponA.fireA;
				wp.isTracePlayer = true;
				wp.startFire();
			}

			function fire1() {
				return runup().
					then(fireToPlayer).
					moveBy(8, 0, g_app.secToFrame(0.5), Easing.CUBIC_EASEOUT).
					delay(g_app.secToFrame(0.5)).
					waitUntil(waitFire);
			}

			function fire2() {
				return runup().
					then(fireToPlayer2).
					waitUntil(waitFire);
			}

			function fire3() {
				return runup().
					then(fireToPlayer3).
					moveBy(8, 0, g_app.secToFrame(0.5), Easing.CUBIC_EASEOUT).
					delay(g_app.secToFrame(0.5)).
					waitUntil(waitFire);
			}

			var top = sprite.anchor.y - 96;
			var bottom = sprite.anchor.y;
			var left = sprite.anchor.x - 200;
			var right = sprite.anchor.x + 0;
			sprite.x = right;
			sprite.y = top;
			sprite.tl.
				delay(g_app.secToFrame(1.0)).
				moveTo(right, bottom, g_app.secToFrame(2.0)).
				scaleTo(-1.0, 1.0, 1).
				delay(g_app.secToFrame(0.5)).
				then(function () {
					sprite.tl.
						moveTo(left, bottom, g_app.secToFrame(0.5), Easing.CUBIC_EASEIN).
						scaleTo(1.0, 1.0, 1);
					fire2().
						moveTo(left, top, g_app.secToFrame(1.0));
					fire1().
						moveTo(right, top, g_app.secToFrame(0.5), Easing.CUBIC_EASEIN).
						scaleTo(-1.0, 1.0, 1);
					fire2().
						moveTo(right, bottom, g_app.secToFrame(1.0));
					fire1().
						moveTo(left, top, g_app.secToFrame(2.0));
					fire3().
						moveTo(right, top, g_app.secToFrame(0.5), Easing.CUBIC_EASEIN);
					fire3().
						moveTo(left, top, g_app.secToFrame(0.5), Easing.CUBIC_EASEIN);
					fire3().
						moveTo(right, top, g_app.secToFrame(0.5));
					fire3().
						delay(g_app.secToFrame(1.0)).
						moveTo(right, bottom, g_app.secToFrame(2.0)).
						loop();
				});
		}

	}

	export interface IEnemyData {
		hpMax: number;
		body: (sprite: any) => void;
		brain: any;
		score: number;
		align: string;
	}
	export var EnemyData: { [index: number]: IEnemyData; } = <any>{
		0x0: {
			hpMax: 2,
			level: 1,
			body: EnemyBodys.body1,
			brain: EnemyBrains.brain1,
			score: 100,
			align: "center middle",
		},

		0x1: {
			hpMax: 2,
			level: 1,
			body: EnemyBodys.body1,
			brain: EnemyBrains.brain1,
			score: 100,
			align: "center middle",
		},

		0x2: {
			hpMax: 2,
			level: 1,
			body: EnemyBodys.body1,
			brain: EnemyBrains.brain2,
			score: 100,
			align: "center middle",
		},

		0x3: {
			hpMax: 2,
			level: 1,
			body: EnemyBodys.body6,
			brain: EnemyBrains.brain3,
			score: 100,
			align: "center bottom",
		},

		0x4: {
			hpMax: 2,
			level: 1,
			body: EnemyBodys.body6,
			brain: EnemyBrains.brain4,
			score: 100,
			align: "center top",
		},
		0x5: {
			hpMax: 16,
			level: 1,
			body: EnemyBodys.body10,
			brain: EnemyBrains.brain5,
			score: 100,
			align: "center bottom",
		},
		0x6: {
			hpMax: 2,
			level: 1,
			body: EnemyBodys.body4,
			brain: EnemyBrains.brain6,
			score: 100,
			align: "center middle",
		},
		0x7: {
			hpMax: 2,
			level: 1,
			body: EnemyBodys.body5,
			brain: EnemyBrains.brain7,
			score: 100,
			align: "center middle",
		},
		0x8: {
			hpMax: 2,
			level: 1,
			body: EnemyBodys.body7,
			brain: EnemyBrains.brain8,
			score: 100,
			align: "center middle",
		},
		0x9: {
			hpMax: 2,
			level: 1,
			body: EnemyBodys.body8,
			brain: EnemyBrains.brain9,
			score: 100,
			align: "center bottom",
		},
		0xa: {
			hpMax: 2,
			level: 2,
			body: EnemyBodys.body4,
			brain: EnemyBrains.brain6,
			score: 100,
			align: "center middle",
		},
		0xb: {
			hpMax: 2,
			level: 2,
			body: EnemyBodys.body5,
			brain: EnemyBrains.brain7,
			score: 100,
			align: "center middle",
		},
		// boss.
		0xf: {
			hpMax: 100,
			level: 1,
			body: EnemyBodys.body2,
			brain: EnemyBrains.brainBoss,
			score: 1000,
			align: "center bottom",
		},
	};

	export var Enemy = enchant.Class.create(enchant.Sprite, {
		initialize: function () {
			enchant.Sprite.call(this);

			this.enemyId = -1;
			this.weapons = [];
			for (var i = 0, iNum = 8; i < iNum; ++i) {
				this.weapons[i] = new jp.osakana4242.kimiko.game.WeaponA(this);
			}
			this.weaponNum = 1;
			this.anchor = new utils.Vector2D();
			this.collider = new utils.Collider();
			this.collider.parent = this;
			this.life = new game.Life(this);
			// ゴースト状態無し.
			this.life.setGhostFrameMax(g_app.secToFrame(0.0));

		},

		onenterframe: function () {
			this.life.step();
			for (var i = this.weaponNum - 1; 0 <= i; --i) {
				this.weapons[i].step();
			}
		},
		
		weapon: { get: function () {
				return this.weapons[0];
		}, },
		
		enemyData: { get: function () {
			return game.EnemyData[this.enemyId];
		}, },

		isBoss: function () { return this.enemyId === DF.ENEMY_ID_BOSS; },

		onDead: function () {
			// 死亡エフェクト追加.
			var effect = this.scene.addEffect(DF.ANIM_ID_DEAD, this.center);
			effect.scaleX = 2.0;
			effect.scaleY = 2.0;

			//
			this.visible = false;
		},

	});

}


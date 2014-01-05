/// <reference path="act.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.scenes {

	var Class = enchant.Class;
	var Core = enchant.Core;
	var Scene = enchant.Scene;
	var Label = enchant.Label;
	var Event = enchant.Event;
	var Easing = enchant.Easing;

	export module EnemyBodys {

		export function body1(sprite: any) {
			sprite.width = 32;
			sprite.height = 32;
			sprite.anim.sequence = kimiko.getAnimFrames(DF.ANIM_ID_CHARA002_WALK);
			sprite.collider.centerBottom(28, 28);
		}

		// クネクネカラス
		export function body2(sprite: any) {
			sprite.width = 64;
			sprite.height = 64;
			sprite.anim.sequence = kimiko.getAnimFrames(DF.ANIM_ID_CHARA003_WALK);
			sprite.collider.centerMiddle(56, 56);
			sprite.weaponNum = 3;
		}

		// 飛行キャラ:小
		export function body3(sprite: any) {
			sprite.width = 32;
			sprite.height = 16;
			//sprite.anim.sequence = kimiko.getAnimFrames(DF.ANIM_ID_CHARA002_WALK);
			sprite.backgroundColor = "rgb(255,48,48)";
			sprite.collider.centerMiddle(28, 12);
		}

		// 中キャラ
		export function body4(sprite: any) {
			sprite.width = 48;
			sprite.height = 48;
			//sprite.anim.sequence = kimiko.getAnimFrames(DF.ANIM_ID_CHARA002_WALK);
			sprite.backgroundColor = "rgb(255,48,48)";
			sprite.collider.centerBottom(32, 40);
		}
	}

	export module EnemyBrains {

		// 突進.
		export function brain1(sprite: any): void {
			var anchor = sprite.anchor;

			sprite.tl.
				delay(kimiko.secToFrame(0.5)).
				then(function () {
					var player = sprite.scene.player;
					var dir = utils.Vector2D.alloc(
						player.center.x - sprite.center.x,
						player.center.y - sprite.center.y
					);
					var mag = utils.Vector2D.magnitude(dir);
					var dist = 480;
					var speed = kimiko.dpsToDpf(2 * DF.BASE_FPS);
					dir.x = dir.x * dist / mag;
					dir.y = dir.y * dist / mag;
					var frame = Math.floor(dist / speed);
					
					sprite.tl.
						moveBy(dir.x, dir.y, frame).
						then(function () {
							sprite.dead();
						});

					utils.Vector2D.free(dir);
				});
		}

		// 追跡.
		export function brain2(sprite: any): void {
			var anchor = sprite.anchor;

			function f1() {
				var player = sprite.scene.player;
				var dir = utils.Vector2D.alloc(
					player.center.x - sprite.center.x,
					player.center.y - sprite.center.y
				);
				var mag = utils.Vector2D.magnitude(dir);
				var dist = 120;
				var speed = kimiko.dpsToDpf(2 * DF.BASE_FPS);
				dir.x = dir.x * dist / mag;
				dir.y = dir.y * dist / mag;
				var frame = Math.floor(dist / speed);
				
				sprite.tl.
					moveBy(dir.x, dir.y, frame).
					delay(kimiko.secToFrame(0.5)).
					then(f1);

				utils.Vector2D.free(dir);
			}

			sprite.tl.
				delay(kimiko.secToFrame(0.5)).
				then(f1);
		}

		// 地上ジャンプ.
		export function brain3(sprite: any): void {
			var anchor = sprite.anchor;
			sprite.weapon.fireFunc = WeaponA.fireA;

			sprite.tl.
				moveBy( -32 * 4 * 0.5, -32 * 3, kimiko.secToFrame( 0.5 ) ).
				moveBy( -32 * 4 * 0.5,  32 * 3, kimiko.secToFrame( 0.5 ) ).
				delay( kimiko.secToFrame( 0.25 ) ).
				then(() => {
					if (1 <= sprite.enemyData.level) {
						sprite.weapon.lookAtPlayer();
						sprite.weapon.startFire();
					}
				}).
				moveBy(  32 * 4 * 0.5, -32 * 3, kimiko.secToFrame( 0.5 ) ).
				moveBy(  32 * 4 * 0.5,  32 * 3, kimiko.secToFrame( 0.5 ) ).
				delay( kimiko.secToFrame( 0.25 ) ).
				loop();
	}

		// 天井ジャンプ.
		export function brain4(sprite: any): void {
			var anchor = sprite.anchor;
			sprite.tl.
				moveBy( -32 * 4 * 0.5,  32 * 3, kimiko.secToFrame( 0.5 ) ).
				moveBy( -32 * 4 * 0.5, -32 * 3, kimiko.secToFrame( 0.5 ) ).
				delay( kimiko.secToFrame( 0.25 ) ).
				moveBy(  32 * 4 * 0.5,  32 * 3, kimiko.secToFrame( 0.5 ) ).
				moveBy(  32 * 4 * 0.5, -32 * 3, kimiko.secToFrame( 0.5 ) ).
				delay( kimiko.secToFrame( 0.25 ) ).
				loop();
		}

		// うろつき.
		export function brain5(sprite: any): void {
			var anchor = sprite.anchor;
			var totalFrame = kimiko.secToFrame(8.0);
			sprite.tl.
				moveTo(anchor.x - 32 * 3, anchor.y, totalFrame * 0.5, Easing.LINEAR).
				moveTo(anchor.x + 0,      anchor.y, totalFrame * 0.5, Easing.LINEAR).
				loop();
		}

		// ブンブン.
		export function brain6(sprite: any): void {
			var anchor = sprite.anchor;
			sprite.tl.
				moveTo( anchor.x + 32 * -0.5, anchor.y + 32 * -0.5, kimiko.secToFrame( 0.5 ) ).
				moveTo( anchor.x + 32 *  0.5, anchor.y + 32 * -0.5, kimiko.secToFrame( 0.5 ) ).
				moveTo( anchor.x + 32 * -0.5, anchor.y + 32 *  0.5, kimiko.secToFrame( 0.5 ) ).
				moveTo( anchor.x + 32 *  0.0, anchor.y + 32 *  0.0, kimiko.secToFrame( 0.5 ) ).
				moveTo( anchor.x + 32 *  0.5, anchor.y + 32 *  0.5, kimiko.secToFrame( 0.5 ) ).
				loop();
		}

		// ホバリング.
		export function brain7(sprite: any): void {
			var anchor = sprite.anchor;
			var totalFrame = kimiko.secToFrame(4.0);
			sprite.tl.
				moveTo(anchor.x, anchor.y + 32 *  1, totalFrame * 0.5, Easing.LINEAR).
				moveTo(anchor.x, anchor.y + 32 * -1, totalFrame * 0.5, Easing.LINEAR).
				loop();
		}

		// 水平突進.
		export function brain8(sprite: any): void {
			var anchor = sprite.anchor;

			sprite.tl.
				delay(kimiko.secToFrame(0.5)).
				then(function () {
					var player = sprite.scene.player;
					var dir = utils.Vector2D.alloc(
						player.center.x - sprite.center.x,
						player.center.y - sprite.center.y
					);
					var mag = utils.Vector2D.magnitude(dir);
					var dist = 480;
					var speed = kimiko.dpsToDpf(2 * DF.BASE_FPS);
					dir.x = dir.x * dist / mag;
					dir.y = 0;
					var frame = Math.floor(dist / speed);
					
					sprite.tl.
						moveBy(dir.x, dir.y, frame).
						then(function () {
							sprite.dead();
						});

					utils.Vector2D.free(dir);
				});
		}

		// 水平追跡.
		export function brain9(sprite: any): void {
			var anchor = sprite.anchor;
		}

		// 左右に行ったりきたり
		export function brainX(sprite: any): void {
			var anchor = sprite.anchor;
			var range = 48;
			var waitFire = () => { return !sprite.weapon.isStateFire(); };
			sprite.tl
				.moveTo(anchor.x + range, anchor.y, kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN)
				.moveTo(anchor.x, anchor.y, kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN)
				.loop();
		}

		// 上下にふわふわ.
		export function brainX1(sprite: any): void {
			var anchor = sprite.anchor;
			var range = 48;
			var fire = () => {
					// X方向だけプレイヤーに合わせて発泡する.
				var player = sprite.scene.player;
				var wp: WeaponA = sprite.weapon;
				wp.wayNum = 1;
				wp.speed = kimiko.dpsToDpf(1.5 * DF.BASE_FPS);
				wp.dir.x = player.x - sprite.x;
				wp.dir.y = 0;
				wp.fireFunc = WeaponA.fireA;
				wp.lookAtPlayer();
				utils.Vector2D.normalize(wp.dir);
				wp.startFire();
				
			};
			var waitFire = () => { return !sprite.weapon.isStateFire(); };
			
			sprite.tl.
				moveTo(anchor.x, anchor.y - range, kimiko.secToFrame(2.0), Easing.SIN_EASEINOUT).
				then(fire).waitUntil(waitFire).
				moveTo(anchor.x, anchor.y, kimiko.secToFrame(2.0), Easing.SIN_EASEINOUT).
				then(fire).waitUntil(waitFire).
				loop();
		}

		// 三角形
		export function brainX2(sprite: any): void {
			var anchor = sprite.anchor;
			var range = 16;
			var waitFire = () => { return !sprite.weapon.isStateFire(); };
			sprite.weapon.fireFunc = WeaponA.fireA;
	
			sprite.tl
				.moveTo(sprite.anchor.x + range, sprite.anchor.y, kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN)
				.then(() => {
					var wp: WeaponA = sprite.weapon;
					wp.dir.x = 1;
					wp.dir.y = 0;
					wp.startFire();
				})
				.waitUntil(waitFire)
				.moveTo(sprite.anchor.x - range, sprite.anchor.y, kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN)
				.then(() => {
					var wp: WeaponA = sprite.weapon;
					wp.dir.x = -1;
					wp.dir.y = 0;
					wp.startFire();
				})
				.waitUntil(waitFire)
				.then(() => {
					// プレイヤーの向きを求める.
					var player = sprite.scene.player;
					var wp: WeaponA = sprite.weapon;
					wp.dir.x = player.center.x - sprite.center.x;
					wp.dir.y = player.center.y - sprite.center.y;
					utils.Vector2D.normalize(wp.dir);
					wp.startFire();
				})
				.waitUntil(waitFire)
				.moveTo(sprite.anchor.x, sprite.anchor.y - 32, kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN)
				.then(() => {
					var wp: WeaponA = sprite.weapon;
					wp.dir.x = -1;
					wp.dir.y = 0;
					wp.startFire();
				})
				.waitUntil(waitFire)
				.loop();
		}

		// 連射マン.
		export function brainX3(sprite: any): void {
			var anchor = sprite.anchor;
			var range = 16;

			var waitFire = () => { return !sprite.weapon.isStateFire(); };
			function fireToPlayer() {
				// プレイヤーの向きを求める.
				var player = sprite.scene.player;
				var wp: WeaponA = sprite.weapon;
				wp.fireCount = 1;
				wp.wayNum = 1;
				wp.dir.x = player.center.x - sprite.center.x;
				wp.dir.y = player.center.y - sprite.center.y;
				wp.fireFunc = WeaponA.fireA;
				utils.Vector2D.normalize(wp.dir);
				wp.startFire();
			}
			sprite.tl
				.delay(kimiko.secToFrame(0.5))
				.moveBy(0, -16, kimiko.secToFrame(0.2), Easing.CUBIC_EASEOUT)
				.moveBy(0,  16, kimiko.secToFrame(0.2), Easing.CUBIC_EASEOUT)
				.moveBy(0, -8, kimiko.secToFrame(0.1), Easing.CUBIC_EASEOUT)
				.moveBy(0, 8, kimiko.secToFrame(0.1), Easing.CUBIC_EASEOUT)
				.then(fireToPlayer)
				.moveBy(8, 0, kimiko.secToFrame(0.5), Easing.CUBIC_EASEOUT)
				.delay(kimiko.secToFrame(0.5))
				.waitUntil(waitFire)
				.then(fireToPlayer)
				.moveBy(8, 0, kimiko.secToFrame(0.5), Easing.CUBIC_EASEOUT)
				.delay(kimiko.secToFrame(0.5))
				.waitUntil(waitFire)
				.then(fireToPlayer)
				.moveBy(8, 0, kimiko.secToFrame(0.5), Easing.CUBIC_EASEOUT)
				.delay(kimiko.secToFrame(0.5))
				.waitUntil(waitFire)
				.delay(kimiko.secToFrame(0.5))
				.moveTo(sprite.anchor.x, sprite.anchor.y, kimiko.secToFrame(0.5), Easing.LINEAR)
				.loop();
		}

		// 左右に行ったりきたり
		export function brainX4(sprite: any): void {
			var anchor = sprite.anchor;
			anchor.x -= 120;
			anchor.y -= 16;
			var range = 240;
			sprite.y = anchor.y;
			var totalFrame = kimiko.secToFrame(8.0);
			function fireToPlayer() {
				// プレイヤーの向きを求める.
				var player = sprite.scene.player;
				var wp: WeaponA = sprite.weapon;
				wp.fireCount = 1;
				wp.wayNum = 1;
				wp.dir.x = player.center.x - sprite.center.x;
				wp.dir.y = 0; // player.center.y - sprite.center.y;
				wp.fireFunc = WeaponA.fireA;
				utils.Vector2D.normalize(wp.dir);
				wp.startFire();
			}
			sprite.tl.
				then(fireToPlayer).
				moveTo(anchor.x - range, anchor.y, totalFrame * 0.5, Easing.LINEAR).
				then(fireToPlayer).
				moveTo(anchor.x + range, anchor.y, totalFrame * 0.5, Easing.LINEAR).
				loop();
		}

		// BOSS.
		export function brainBoss(sprite: any): void {
			var anchor = sprite.anchor;

			var waitFire = () => { return !sprite.weapon.isStateFire(); };

			// 発砲の予備動作.
			function runup() {
				return sprite.tl.
					moveBy(0, -24, kimiko.secToFrame(0.2), Easing.CUBIC_EASEOUT).
					moveBy(0,  24, kimiko.secToFrame(0.2), Easing.CUBIC_EASEOUT).
					moveBy(0, -8, kimiko.secToFrame(0.1), Easing.CUBIC_EASEOUT).
					moveBy(0, 8, kimiko.secToFrame(0.1), Easing.CUBIC_EASEOUT).
					delay(kimiko.secToFrame(0.5));
			}

			function fireToPlayer() {
				var wp: WeaponA = sprite.weapons[0];
				wp.fireCount = 5;
				wp.wayNum = 4;
				wp.fireInterval = kimiko.secToFrame(0.5);
				wp.speed = kimiko.dpsToDpf(3 * DF.BASE_FPS);
				wp.fireFunc = WeaponA.fireC;
				wp.isTracePlayer = true;
				wp.lookAtPlayer();
				wp.startFire();
				
				wp = sprite.weapons[1];
				wp.fireCount = 3;
				wp.wayNum = 1;
				wp.fireInterval = kimiko.secToFrame(0.75);
				wp.speed = kimiko.dpsToDpf(2 * DF.BASE_FPS);
				wp.fireFunc = WeaponA.fireA;
				wp.isTracePlayer = true;
				wp.startFire();
			}
	

			function fireToPlayer2() {
				var wp: WeaponA = sprite.weapon;
				wp.fireCount = 9 
				wp.wayNum = 1;
				wp.fireInterval = kimiko.secToFrame(0.5);
				wp.speed = kimiko.dpsToDpf(3 * DF.BASE_FPS);
				wp.fireFunc = WeaponA.fireB;
				wp.isTracePlayer = true;
				wp.lookAtPlayer();
				wp.startFire();

				wp = sprite.weapons[1];
				wp.fireCount = 1;
				wp.wayNum = 1;
				wp.fireInterval = kimiko.secToFrame(1.5);
				wp.speed = kimiko.dpsToDpf(1 * DF.BASE_FPS);
				wp.fireFunc = WeaponA.fireA;
				wp.isTracePlayer = true;
				wp.startFire();
			}
			
			function fireToPlayer3() {
				var wp: WeaponA = sprite.weapons[0];
				wp.fireCount = 1;
				wp.wayNum = 6;
				wp.fireInterval = kimiko.secToFrame(0.5);
				wp.speed = kimiko.dpsToDpf(1 * DF.BASE_FPS);
				wp.fireFunc = WeaponA.fireA;
				wp.isTracePlayer = false;
				wp.lookAtPlayer();
				wp.startFire();
				
				wp = sprite.weapons[1];
				wp.fireCount = 2;
				wp.wayNum = 1;
				wp.fireInterval = kimiko.secToFrame(0.2);
				wp.speed = kimiko.dpsToDpf(3 * DF.BASE_FPS);
				wp.fireFunc = WeaponA.fireA;
				wp.isTracePlayer = true;
				wp.startFire();
			}

			function fire1() {
				return runup().
					then(fireToPlayer).
					moveBy(8, 0, kimiko.secToFrame(0.5), Easing.CUBIC_EASEOUT).
					delay(kimiko.secToFrame(0.5)).
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
					moveBy(8, 0, kimiko.secToFrame(0.5), Easing.CUBIC_EASEOUT).
					delay(kimiko.secToFrame(0.5)).
					waitUntil(waitFire);
			}

			var top = sprite.anchor.y - 96;
			var bottom = sprite.anchor.y;
			var left = sprite.anchor.x - 200;
			var right = sprite.anchor.x + 0;
			sprite.x = right;
			sprite.y = top;
			sprite.tl.
				delay(kimiko.secToFrame(1.0)).
				moveTo(right, bottom, kimiko.secToFrame(2.0)).
				scaleTo(-1.0, 1.0, 1).
				delay(kimiko.secToFrame(0.5)).
				then(function () {
					sprite.tl.
						moveTo(left, bottom, kimiko.secToFrame(0.5), Easing.CUBIC_EASEIN).
						scaleTo(1.0, 1.0, 1);
					fire2().
						moveTo(left, top, kimiko.secToFrame(1.0));
					fire1().
						moveTo(right, top, kimiko.secToFrame(0.5), Easing.CUBIC_EASEIN).
						scaleTo(-1.0, 1.0, 1);
					fire2().
						moveTo(right, bottom, kimiko.secToFrame(1.0));
					fire1().
						moveTo(left, top, kimiko.secToFrame(2.0));
					fire3().
						moveTo(right, top, kimiko.secToFrame(0.5), Easing.CUBIC_EASEIN);
					fire3().
						moveTo(left, top, kimiko.secToFrame(0.5), Easing.CUBIC_EASEIN);
					fire3().
						moveTo(right, top, kimiko.secToFrame(0.5));
					fire3().
						delay(kimiko.secToFrame(1.0)).
						moveTo(right, bottom, kimiko.secToFrame(2.0)).
						loop();
				});
		}

	}

	export interface IEnemyData {
		hpMax: number;
		body: (sprite: any) => void;
		brain: any;
		score: number;
	}
	export var EnemyData: { [index: number]: IEnemyData; } = <any>{
		0x0: {
			hpMax: 1,
			level: 1,
			body: EnemyBodys.body1,
			brain: EnemyBrains.brain1,
			score: 100,
		},

		0x1: {
			hpMax: 5,
			level: 1,
			body: EnemyBodys.body1,
			brain: EnemyBrains.brain1,
			score: 100,
		},

		0x2: {
			hpMax: 5,
			level: 1,
			body: EnemyBodys.body1,
			brain: EnemyBrains.brain2,
			score: 100,
		},

		0x3: {
			hpMax: 5,
			level: 1,
			body: EnemyBodys.body1,
			brain: EnemyBrains.brain3,
			score: 100,
		},

		0x4: {
			hpMax: 5,
			level: 1,
			body: EnemyBodys.body1,
			brain: EnemyBrains.brain4,
			score: 100,
		},
		0x5: {
			hpMax: 20,
			level: 1,
			body: EnemyBodys.body4,
			brain: EnemyBrains.brain5,
			score: 100,
		},
		0x6: {
			hpMax: 5,
			level: 1,
			body: EnemyBodys.body1,
			brain: EnemyBrains.brain6,
			score: 100,
		},
		0x7: {
			hpMax: 5,
			level: 1,
			body: EnemyBodys.body1,
			brain: EnemyBrains.brain7,
			score: 100,
		},
		0x8: {
			hpMax: 5,
			level: 1,
			body: EnemyBodys.body1,
			brain: EnemyBrains.brain8,
			score: 100,
		},
		0x9: {
			hpMax: 5,
			level: 1,
			body: EnemyBodys.body1,
			brain: EnemyBrains.brain9,
			score: 100,
		},
			// boss.
		0xf: {
			hpMax: 100,
			level: 1,
			body: EnemyBodys.body2,
			brain: EnemyBrains.brainBoss,
			score: 1000,
		},
	};

}

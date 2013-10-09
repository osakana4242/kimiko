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
		}
	}

	export module EnemyBrains {

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
		export function brain1(sprite: any): void {
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
		export function brain2(sprite: any): void {
			var anchor = sprite.anchor;
			var range = 16;
			var waitFire = () => { return !sprite.weapon.isStateFire(); };
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
		export function brain3(sprite: any): void {
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
				var wp: WeaponA = sprite.weapon;
				wp.fireCount = 3;
				wp.wayNum = 6;
				wp.fireInterval = kimiko.secToFrame(0.5);
				wp.speed = kimiko.dpsToDpf(3 * DF.BASE_FPS);
				wp.fireFunc = WeaponA.fireC;

				wp.lookAtPlayer();
				wp.startFire();
			}
	

			function fireToPlayer2() {
				var wp: WeaponA = sprite.weapon;
				wp.fireCount = 3;
				wp.wayNum = 1;
				wp.fireInterval = kimiko.secToFrame(0.3);
				wp.speed = kimiko.dpsToDpf(5 * DF.BASE_FPS);
				wp.fireFunc = WeaponA.fireB;

				wp.lookAtPlayer();
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
			var top = sprite.anchor.y - 96;
			var bottom = sprite.anchor.y;
			var left = sprite.anchor.x - 200;
			var right = sprite.anchor.x + 0;
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
				loop();
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
			hpMax: 5,
			body: EnemyBodys.body1,
			brain: EnemyBrains.brain1,
			score: 100,
		},

		0x1: {
			hpMax: 5,
			body: EnemyBodys.body1,
			brain: EnemyBrains.brain2,
			score: 100,
	},

		0x2: {
			hpMax: 5,
			body: EnemyBodys.body1,
			brain: EnemyBrains.brain3,
			score: 100,
		},
		// boss.
		0xf: {
			hpMax: 100,
			body: EnemyBodys.body2,
			brain: EnemyBrains.brainBoss,
			score: 1000,
		},
	};

}

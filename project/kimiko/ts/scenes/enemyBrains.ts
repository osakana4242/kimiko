/// <reference path="act.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.scenes {

	var Class = enchant.Class;
	var Core = enchant.Core;
	var Scene = enchant.Scene;
	var Label = enchant.Label;
	var Event = enchant.Event;
	var Easing = enchant.Easing;

	export class EnemyBrains {

		// 左右に行ったりきたり
		public static brain1(sprite: any, anchor: utils.IVector2D): void {
			var range = 48;
			sprite.anchor.x = anchor.x;
			sprite.anchor.y = anchor.y;
			sprite.x = sprite.anchor.x;
			sprite.y = sprite.anchor.y;
			var waitFire = () => { return !sprite.weapon.isStateFire(); };
			sprite.tl
				.moveTo(sprite.anchor.x + range, sprite.anchor.y, kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN)
				.moveTo(sprite.anchor.x, sprite.anchor.y, kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN)
				.loop();
		}

		// 三角形
		public static brain2(sprite: any, anchor: utils.IVector2D): void {
			var range = 16;
			sprite.anchor.x = anchor.x;
			sprite.anchor.y = anchor.y;
			sprite.x = sprite.anchor.x;
			sprite.y = sprite.anchor.y;
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
					wp.dir.x = player.x - sprite.x;
					wp.dir.y = player.y - sprite.y;
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
		public static brain3(sprite: any, anchor: utils.IVector2D): void {
			var range = 16;
			sprite.anchor.x = anchor.x;
			sprite.anchor.y = anchor.y;
			sprite.x = sprite.anchor.x;
			sprite.y = sprite.anchor.y;

			var waitFire = () => { return !sprite.weapon.isStateFire(); };
			function fireToPlayer() {
				// プレイヤーの向きを求める.
				var player = sprite.scene.player;
				var wp: WeaponA = sprite.weapon;
				wp.fireCount = 1;
				wp.wayNum = 1;
				wp.dir.x = player.x - sprite.x;
				wp.dir.y = player.y - sprite.y;
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
	}

}

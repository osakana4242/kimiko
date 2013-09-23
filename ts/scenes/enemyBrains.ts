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
			sprite.image = kimiko.core.assets[Assets.IMAGE_CHARA002]
			sprite.frame = kimiko.getAnimFrames(DF.ANIM_ID_CHARA002_WALK);
		}

		export function body2(sprite: any) {
			sprite.width = 64;
			sprite.height = 64;
			sprite.backgroundColor = "rgb(192, 128, 192)";
		}
	}

	export module EnemyBrains {

		// ���E�ɍs�����肫����
		export function brain1(sprite: any): void {
			var anchor = sprite.anchor;
			var range = 48;
			var waitFire = () => { return !sprite.weapon.isStateFire(); };
			sprite.tl
				.moveTo(sprite.anchor.x + range, sprite.anchor.y, kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN)
				.moveTo(sprite.anchor.x, sprite.anchor.y, kimiko.secToFrame(1.0), Easing.CUBIC_EASEIN)
				.loop();
		}

		// �O�p�`
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
					// �v���C���[�̌��������߂�.
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

		// �A�˃}��.
		export function brain3(sprite: any, anchor: utils.IVector2D): void {
			var anchor = sprite.anchor;
			var range = 16;

			var waitFire = () => { return !sprite.weapon.isStateFire(); };
			function fireToPlayer() {
				// �v���C���[�̌��������߂�.
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

	export var EnemyData: { [index: number]: {hpMax: number; body: any; brain: any;}; } = <any>[
		{
			hpMax: 5,
			body: EnemyBodys.body1,
			brain: EnemyBrains.brain1,
		},

		{
			hpMax: 10,
			body: EnemyBodys.body1,
			brain: EnemyBrains.brain2,
		},

		{
			hpMax: 10,
			body: EnemyBodys.body1,
			brain: EnemyBrains.brain3,
		},

		{
			hpMax: 30,
			body: EnemyBodys.body2,
			brain: EnemyBrains.brain3,
		},
	];

}

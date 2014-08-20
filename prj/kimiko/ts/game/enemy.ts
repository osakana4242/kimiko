/// <reference path="../kimiko.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.game {

	var Easing: any = {}; // enchant.Easing;

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
		/** クラウド型. */
		export function body9(sprite: any) {
			sprite.width = 32;
			sprite.height = 32;
			sprite.anim.sequence = g_app.getAnimFrames(DF.ANIM_ID_CHARA009_WALK);
			utils.Rect.copyFrom(sprite.collider.rect, utils.Collider.centerBottom(sprite, 28, 28));
		}
		/** プロペラ耳型. */
		export function body10(sprite: any) {
			sprite.width = 32;
			sprite.height = 32;
			sprite.anim.sequence = g_app.getAnimFrames(DF.ANIM_ID_CHARA010_WALK);
			utils.Rect.copyFrom(sprite.collider.rect, utils.Collider.centerBottom(sprite, 28, 28));
		}
		/** 中キャラ */
		export function body11(sprite: any) {
			sprite.width = 48;
			sprite.height = 48;
			sprite.anim.sequence = g_app.getAnimFrames(DF.ANIM_ID_CHARA011_WALK);
			utils.Rect.copyFrom(sprite.collider.rect, utils.Collider.centerBottom(sprite, 32, 40));
		}
	}

	export module EnemyBrains {

		/** 突進. */
		export function brain1(sprite: any): void {
			var anchor = sprite.anchor;

			sprite.runAction(cc.Sequence.create(
				cc.CallFunc.create(sprite.lookAtPlayer, sprite),
				cc.DelayTime.create(0.5),
				cc.CallFunc.create(function () {
					var scene = cc.director.getRunningScene();
					var player = scene.player;
					var dir = utils.Vector2D.alloc(
						player.rect.center.x - sprite.rect.center.x,
						player.rect.center.y - sprite.rect.center.y
					);
					var mag = utils.Vector2D.magnitude(dir);
					var dist = 480;
					var speed = g_app.dpsToDpf(2 * DF.BASE_FPS);
					dir.x = dir.x * dist / mag;
					dir.y = dir.y * dist / mag;
					var frame = Math.floor(dist / speed);

					sprite.lookAtPlayer();
					
					sprite.runAction(cc.Sequence.create(
						cc.MoveBy.create(g_app.frameToSec(frame), cc.p(dir.x, dir.y)),
						cc.CallFunc.create(function () {
							sprite.life.kill();
						}, sprite)
					));

					utils.Vector2D.free(dir);
				}, sprite)
			));
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
			function f1() {
				var isNext = false;
				var scene = cc.director.getRunningScene();
				var player = scene.player;
				var dir = utils.Vector2D.alloc(
					g_app.numberUtil.trim(player.rect.center.x, xMin, xMax) - sprite.rect.center.x,
					g_app.numberUtil.trim(player.rect.center.y, yMin, yMax) - sprite.rect.center.y
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

					sprite.lookAtPlayer();
					
					sprite.runAction(cc.Sequence.create(
						cc.MoveTo.create(g_app.frameToSec(frame), cc.p(sprite.x + dir.x, sprite.y + dir.y)),
						cc.CallFunc.create(function () {
							if (2 <= sprite.enemyData.level) {
								sprite.weapon.lookAtPlayer();
								sprite.weapon.startFire();
							}
						}),
						cc.DelayTime.create(0.5),
						oskn.WaitUntil.create(f1)
					));
					isNext = true;
				}
				utils.Vector2D.free(dir);
				return isNext;
			}
			sprite.runAction(cc.Sequence.create(
				oskn.WaitUntil.create(f1)
			));
		}

		/** 地上ジャンプ.*/
		export function brain3(sprite: any): void {
			var anchor = sprite.anchor;
			sprite.weapon.fireFunc = WeaponA.fireA;

			sprite.runAction(cc.RepeatForever.create(cc.Sequence.create(
				cc.CallFunc.create(function () {
					sprite.scaleX = -1;
				}),
				cc.MoveBy.create(0.5, cc.p(VecX.L * 32 * 4 * 0.5, VecY.U * 32 * 3)),
				cc.MoveBy.create(0.5, cc.p(VecX.L * 32 * 4 * 0.5, VecY.D * 32 * 3)),
				cc.DelayTime.create(0.25),
				cc.CallFunc.create(function () {
					if (2 <= sprite.enemyData.level) {
						sprite.weapon.lookAtPlayer();
						sprite.weapon.startFire();
					}
				}),
				cc.CallFunc.create(function () {
					sprite.scaleX = 1;
				}),
				cc.MoveBy.create(0.5, cc.p(VecX.R * 32 * 4 * 0.5, VecY.U * 32 * 3)),
				cc.MoveBy.create(0.5, cc.p(VecX.R * 32 * 4 * 0.5, VecY.D * 32 * 3)),
				cc.DelayTime.create(0.25)
			)));
		}

		/** 天井ジャンプ. */
		export function brain4(sprite: any): void {
			sprite.scaleY = -1;
			var anchor = sprite.anchor;
			sprite.weapon.fireFunc = WeaponA.fireA;

			sprite.runAction(cc.RepeatForever.create(cc.Sequence.create(
				cc.CallFunc.create(function () {
					sprite.scaleX = -1;
				}),
				cc.MoveBy.create(0.5, cc.p(VecX.L * 32 * 4 * 0.5, VecY.D * 32 * 3)),
				cc.MoveBy.create(0.5, cc.p(VecX.L * 32 * 4 * 0.5, VecY.U * 32 * 3)),
				cc.DelayTime.create(0.25),
				cc.CallFunc.create(function () {
					if (2 <= sprite.enemyData.level) {
						sprite.weapon.lookAtPlayer();
						sprite.weapon.startFire();
					}
				}),
				cc.CallFunc.create(function () {
					sprite.scaleX = 1;
				}),
				cc.MoveBy.create(0.5, cc.p(VecX.R * 32 * 4 * 0.5, VecY.D * 32 * 3)),
				cc.MoveBy.create(0.5, cc.p(VecX.R * 32 * 4 * 0.5, VecY.U * 32 * 3)),
				cc.DelayTime.create(0.25)
			)));
		}

		/** うろつき. */
		export function brain5(sprite: any): void {
			var anchor = sprite.anchor;
			var totalFrame = g_app.secToFrame(8.0);
			sprite.runAction(cc.RepeatForever.create(cc.Sequence.create(
				cc.MoveTo.create(0.5, cc.p(anchor.x + VecX.L * 32 * 3 + sprite.width / 2, anchor.y)),
				cc.MoveTo.create(0.5, cc.p(anchor.x + 0               + sprite.width / 2, anchor.y))
			)));
		}

		/** ブンブン.*/
		export function brain6(sprite: any): void {
			var anchor = sprite.anchor;
			sprite.weapon.fireFunc = WeaponA.fireA;

			var fire = function () {
				sprite.lookAtPlayer();
				if (2 <= sprite.enemyData.level) {
					sprite.weapon.lookAtPlayer();
					sprite.weapon.startFire();
				}
			};

			sprite.runAction(cc.RepeatForever.create(cc.Sequence.create(
				cc.MoveTo.create(0.5, cc.p(anchor.x + VecX.L * 32 * 0.5, anchor.y + VecY.U * 32 * 0.5)),
				cc.MoveTo.create(0.5, cc.p(anchor.x + VecX.R * 32 * 0.5, anchor.y + VecY.U * 32 * 0.5)),
				cc.MoveTo.create(0.5, cc.p(anchor.x + VecX.L * 32 * 0.5, anchor.y + VecY.D * 32 * 0.5)),
				cc.MoveTo.create(0.5, cc.p(anchor.x + VecX.R * 32 * 0.0, anchor.y + VecY.D * 32 * 0.0)),
				cc.CallFunc.create(fire),
				cc.MoveTo.create(0.5, cc.p(anchor.x + VecX.R * 32 * 0.5, anchor.y + VecY.D * 32 * 0.5))
			)));
		}

		/** ホバリング.*/
		export function brain7(sprite: any): void {
			var anchor = sprite.anchor;
			sprite.weapon.fireFunc = WeaponA.fireA;

			var fire = function () {
				sprite.lookAtPlayer();
				if (2 <= sprite.enemyData.level) {
					sprite.weapon.lookAtPlayer();
					sprite.weapon.startFire();
				}
			};

			var totalFrame = g_app.secToFrame(2.0);
			sprite.runAction(cc.RepeatForever.create(cc.Sequence.create(
				cc.CallFunc.create(sprite.lookAtPlayer, sprite),
				cc.MoveTo.create(0.5, cc.p(anchor.x, anchor.y + 32 * VecY.D)),
				cc.CallFunc.create(fire),
				cc.MoveTo.create(0.5, cc.p(anchor.x, anchor.y + 32 * VecY.U)),
				cc.CallFunc.create(fire)
			)));
		}

		/** 水平突進.*/
		export function brain8(sprite: any): void {
			var anchor = sprite.anchor;

			sprite.runAction(cc.Sequence.create(
				cc.CallFunc.create(sprite.lookAtPlayer, sprite),
				cc.DelayTime.create(0.5),
				cc.CallFunc.create(function () {
					var scene = cc.director.getRunningScene();
					var player = scene.player;
					var dir = utils.Vector2D.alloc(
						player.rect.center.x - sprite.rect.center.x,
						player.rect.center.y - sprite.rect.center.y
					);
					var mag = utils.Vector2D.magnitude(dir);
					var dist = 480;
					var speed = g_app.dpsToDpf(2 * DF.BASE_FPS);
					dir.x = dir.x * dist / mag;
					dir.y = 0;
					var frame = Math.floor(dist / speed);

					sprite.lookAtPlayer();
					
					sprite.runAction(cc.Sequence.create(
						cc.MoveBy.create(g_app.frameToSec(frame), cc.p(dir.x, dir.y)),
						cc.CallFunc.create(function () {
							sprite.life.kill();
						})
					));

					utils.Vector2D.free(dir);
				})
			));

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
				var scene = cc.director.getRunningScene();
				var player = scene.player;
				var dir = utils.Vector2D.alloc(
					g_app.numberUtil.trim(player.rect.center.x, xMin, xMax) - sprite.rect.center.x,
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
					sprite.lookAtPlayer();
					sprite.runAction(cc.Sequence.create(
						cc.MoveBy.create(g_app.frameToSec(frame), cc.p(sprite.x + dir.x, sprite.y + dir.y)),
						cc.DelayTime.create(0.2),
						oskn.WaitUntil.create(f1)
					));
					isNext = true;
				}
				utils.Vector2D.free(dir);
				return isNext;
			}
			sprite.runAction(oskn.WaitUntil.create(f1));
		}

		// BOSS.
		export function brainBoss(sprite: any): void {
			var anchor = sprite.anchor;

			var waitFire = () => { return !sprite.weapon.isStateFire(); };

			// 発砲の予備動作.
			function runup(seq: any[]) {
					seq.push(cc.DelayTime(1.0));
					seq.push(cc.EaseSineIn.create(cc.MoveBy.create(0.2, cc.p(0, VecY.U * 24))));
					seq.push(cc.EaseSineIn.create(cc.MoveBy.create(0.2, cc.p(0, VecY.D * 24))));
					seq.push(cc.EaseSineIn.create(cc.MoveBy.create(0.1, cc.p(0, VecY.U *  8))));
					seq.push(cc.EaseSineIn.create(cc.MoveBy.create(0.1, cc.p(0, VecY.D *  8))));
					return seq;
			}

			function fireToPlayer() {
				var wp: WeaponA = sprite.weapons[0];
				wp.fireCount = 5;
				wp.wayNum = 2;
				wp.fireInterval = 0.5;
				wp.speed = g_app.dpsToDpf(3 * DF.BASE_FPS);
				wp.fireFunc = WeaponA.fireC;
				wp.isTracePlayer = true;
				wp.lookAtPlayer();
				wp.startFire();
				
				wp = sprite.weapons[1];
				wp.fireCount = 3;
				wp.wayNum = 1;
				wp.fireInterval = 0.75;
				wp.speed = g_app.dpsToDpf(2 * DF.BASE_FPS);
				wp.fireFunc = WeaponA.fireA;
				wp.isTracePlayer = true;
				wp.startFire();
			}
	

			function fireToPlayer2() {
				var wp: WeaponA = sprite.weapon;
				wp.fireCount = 9 
				wp.wayNum = 1;
				wp.fireInterval = 0.5;
				wp.speed = g_app.dpsToDpf(3 * DF.BASE_FPS);
				wp.fireFunc = WeaponA.fireB;
				wp.isTracePlayer = true;
				wp.lookAtPlayer();
				wp.startFire();

				wp = sprite.weapons[1];
				wp.fireCount = 1;
				wp.wayNum = 1;
				wp.fireInterval = 1.5;
				wp.speed = g_app.dpsToDpf(1 * DF.BASE_FPS);
				wp.fireFunc = WeaponA.fireA;
				wp.isTracePlayer = true;
				wp.startFire();
			}
			
			function fireToPlayer3() {
				var wp: WeaponA = sprite.weapons[0];
				wp.fireCount = 1;
				wp.wayNum = 4;
				wp.fireInterval = 0.5;
				wp.speed = g_app.dpsToDpf(1 * DF.BASE_FPS);
				wp.fireFunc = WeaponA.fireA;
				wp.isTracePlayer = false;
				wp.lookAtPlayer();
				wp.startFire();
				
				wp = sprite.weapons[1];
				wp.fireCount = 2;
				wp.wayNum = 1;
				wp.fireInterval = 0.2;
				wp.speed = g_app.dpsToDpf(3 * DF.BASE_FPS);
				wp.fireFunc = WeaponA.fireA;
				wp.isTracePlayer = true;
				wp.startFire();
			}

			function fire1(seq: any[]) {
				runup(seq);
				seq.push(cc.CallFunc.create(fireToPlayer));
				seq.push(cc.DelayTime.create(0.5))
				seq.push(oskn.WaitUntil.create(waitFire));
				return seq;
			}

			function fire2(seq: any[]) {
				runup(seq);
				seq.push(cc.CallFunc.create(fireToPlayer2));
				seq.push(oskn.WaitUntil.create((waitFire)));
				return seq;
			}

			function fire3(seq: any[]) {
				runup(seq);
				seq.push(cc.CallFunc.create(fireToPlayer3));
				seq.push(cc.DelayTime.create(0.5));
				seq.push(oskn.WaitUntil.create(waitFire));
				return seq;
			}

			var top = sprite.anchor.y + VecY.U * 96;
			var bottom = sprite.anchor.y;
			var left = sprite.anchor.x + VecX.L * 224;
			var right = sprite.anchor.x + 0;
			sprite.x = right;
			sprite.y = top;
			var seq1= [];
			seq1.push(cc.CallFunc.create(sprite.lookAtPlayer, sprite));
			seq1.push(cc.DelayTime.create(1.0));
			seq1.push(cc.MoveTo.create(2.0, cc.p(right, bottom)));
			seq1.push(cc.ScaleTo.create(0.1, VecX.L, 1.0));
			seq1.push(cc.DelayTime.create(0.5));
			seq1.push(cc.CallFunc.create(function () {
				var seq2 = [];
				seq2.push(cc.EaseSineIn.create(cc.MoveBy.create(1.0, cc.p(VecX.R * 32, 0))));
				seq2.push(cc.EaseSineIn.create(cc.MoveTo.create(0.5, cc.p(left, bottom))));
				seq2.push(cc.ScaleTo.create(0.1, VecX.R, 1.0));
				fire2(seq2);
				seq2.push(cc.EaseSineIn.create(cc.MoveTo.create(1.0, cc.p(left, top))));
				fire1(seq2);
				seq2.push(cc.EaseSineIn.create(cc.MoveBy.create(1.0, cc.p(VecX.L * 32, 0))));
				seq2.push(cc.EaseSineIn.create(cc.MoveTo.create(0.5, cc.p(left, bottom))));
				seq2.push(cc.ScaleTo.create(0.1, VecX.R, 1.0));
				fire2(seq2);
				seq2.push(cc.EaseSineIn.create(cc.MoveTo.create(1.0, cc.p(right, bottom))));
				fire1(seq2);
				seq2.push(cc.EaseSineIn.create(cc.MoveTo.create(2.0, cc.p(left, top))));
				seq2.push(cc.CallFunc.create(sprite.lookAtRight, sprite));
				fire3(seq2);
				seq2.push(cc.EaseSineIn.create(cc.MoveBy.create(1.0, cc.p(VecX.L * 32, 0))));
				seq2.push(cc.EaseSineIn.create(cc.MoveTo.create(0.5, cc.p(right, top))));
				seq2.push(cc.CallFunc.create(sprite.lookAtLeft, sprite));
				fire3(seq2);
				seq2.push(cc.EaseSineIn.create(cc.MoveBy.create(1.0, cc.p(VecX.R * 32, 0))));
				seq2.push(cc.EaseSineIn.create(cc.MoveTo.create(0.5, cc.p(left, top))));
				seq2.push(cc.CallFunc.create(sprite.lookAtRight, sprite));
				fire3(seq2);
				seq2.push(cc.EaseSineIn.create(cc.MoveBy.create(1.0, cc.p(VecX.L * 32, 0))));
				seq2.push(cc.EaseSineIn.create(cc.MoveTo.create(0.5, cc.p(right, top))));
				seq2.push(cc.CallFunc.create(sprite.lookAtLeft, sprite));
				fire3(seq2);
				seq2.push(cc.DelayTime.create(1.0));
				seq2.push(cc.EaseSineIn.create(cc.MoveTo.create(2.0, cc.p(right, bottom))));
				sprite.runAction(cc.RepeatForever.create(cc.Sequence.create(seq2)));
			}, sprite));
			sprite.runAction(cc.Sequence.create(seq1));
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
			body: EnemyBodys.body9,
			brain: EnemyBrains.brain1,
			score: 100,
			align: "center middle",
		},

		0x1: {
			hpMax: 2,
			level: 1,
			body: EnemyBodys.body9,
			brain: EnemyBrains.brain1,
			score: 100,
			align: "center middle",
		},

		0x2: {
			hpMax: 2,
			level: 1,
			body: EnemyBodys.body10,
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
			body: EnemyBodys.body11,
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

	export var Enemy = cc.Sprite.extend( {

		rect: null,
		anim: null,
		enemyId: -1,
		score: 0,

		ctor: function () {
			this._super();

			oskn.ObjectUtils.defineProperties(this, this.__proto__);

			this.rect = new utils.NodeRect(this);
			this.anim = new utils.AnimSequencer(this);
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
			//
			this.scheduleUpdate();
		},

		update: function (deltaTime: number) {
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
			var scene = cc.director.getRunningScene();
			var effect = scene.addEffect(DF.ANIM_ID_DEAD, this.rect.center);
			effect.scaleX = 2.0;
			effect.scaleY = 2.0;

			//
			this.visible = false;
		},
		
		lookAtPlayer: function() {
			var scene = cc.director.getRunningScene();
			var player = scene.player;
			this.lookAtPosition(player.rect.center);
		},

		lookAtPosition: function(pos: utils.IVector2D) {
			var distX = pos.x - this.rect.center.x;
			this.scaleX = distX < 0 ? -1 : 1;
		},

		lookAtLeft: function() {
			this.scaleX = -1;
		},

		lookAtRight: function() {
			this.scaleX = 1;
		},

	});

}


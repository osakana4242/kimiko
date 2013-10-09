/// <reference path="act.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.scenes {

	var Class = enchant.Class;
	var Core = enchant.Core;
	var Scene = enchant.Scene;
	var Label = enchant.Label;
	var Event = enchant.Event;
	var Easing = enchant.Easing;

	export class WeaponA {
		fireCounter: number;
		fireCount: number;
		fireIntervalCounter: number;
		fireInterval: number;
		reloadFrameCounter: number;
		reloadFrameCount: number;
		wayNum: number;
		speed: number;
		parent: any;
		targetPos: utils.Vector2D;
		dir: utils.Vector2D;

		state: () => void;
		fireFunc: (bullet: any, tpos: utils.Vector2D) => void;

		constructor(sprite: any) {
			this.parent = sprite;
			this.state = this.stateNeutral;
			this.wayNum = 1;
			this.fireCount = 1;
			this.fireInterval = kimiko.secToFrame(0.2);
			this.reloadFrameCount = kimiko.secToFrame(3.0);
			this.dir = new utils.Vector2D(1, 0);
			this.targetPos = new utils.Vector2D();
			this.speed = kimiko.dpsToDpf(60 * 1.0);
			this.fireFunc = WeaponA.fireC;
		}

		public step(): void {
			this.state();

		}

		private stateNeutral(): void {
		}

		private stateFire(): void {
			if (this.fireIntervalCounter < this.fireInterval) {
				++this.fireIntervalCounter;
				return;
			}
			this.fireIntervalCounter = 0;
			if (this.fireCounter < this.fireCount) {
				this.fire();
				++this.fireCounter;
				return;
			}
			this.fireCounter = 0;
			this.reloadFrameCounter = 0;
			this.state = this.stateNeutral;
	}

		private fire(): void {
			var parent = this.parent;
			var wayNum = this.wayNum;
			var degToRad = Math.PI / 180;
			var degInterval = 90 / wayNum;
			var startDeg = -degInterval * ((wayNum - 1) / 2);
			for (var i = 0, iNum = wayNum; i < iNum; ++i) {
				var bullet = parent.scene.newEnemyBullet();
				if (!bullet) {
					continue;
				}
				var deg = startDeg + (degInterval * i);
				var rad = deg * degToRad;
				var speed = this.speed;
				bullet.force.x = (this.dir.x * Math.cos(rad) - (this.dir.y * Math.sin(rad))) * speed;
				bullet.force.y = (this.dir.y * Math.cos(rad) + (this.dir.x * Math.sin(rad))) * speed;
				bullet.center.set(parent.center);
				if (true) {
					var v1 = utils.Vector2D.alloc();
					var v2 = utils.Vector2D.alloc();
	
					v1.set(this.targetPos);
					v1.x -= parent.center.x;
					v1.y -= parent.center.y;
					v1.rotate(rad);
					v1.x += parent.center.x;
					v1.y += parent.center.y;
					this.fireFunc(bullet, v1);

					utils.Vector2D.free(v1);
					utils.Vector2D.free(v2);
				}
				
			}
		}

		// 直進.
		public static fireA(bullet: any, tpos: utils.Vector2D): void {
			bullet.force.x = 0;
			bullet.force.y = 0;
			var d = utils.Vector2D.alloc();
			d.x = tpos.x - bullet.center.x;
			d.y = tpos.y - bullet.center.y;
			var m = utils.Vector2D.magnitude(d);
			var d2 = 480;
			d.x = d.x * d2 / m;
			d.y = d.y * d2 / m;
			var frame = Math.floor(d2 / kimiko.dpsToDpf(3 * 60));
			
			bullet.tl.
				moveBy(d.x, d.y, frame).
				then(function () {
					this.miss();
				});
			utils.Vector2D.free(d);
		}

		// 直進. 最初早い.
		public static fireC(bullet: any, tpos: utils.Vector2D): void {
			bullet.force.x = 0;
			bullet.force.y = 0;
			var d = utils.Vector2D.alloc();
			d.x = tpos.x - bullet.center.x;
			d.y = tpos.y - bullet.center.y;
			var m = utils.Vector2D.magnitude(d);
			var d2 = 480;
			var dx = d.x * d2 / m;
			var dy = d.y * d2 / m;
			var frame1 = Math.floor(d2 * 0.2 / kimiko.dpsToDpf(4 * 60));
			var frame2 = Math.floor(d2 * 0.8 / kimiko.dpsToDpf(1 * 60));
	
			bullet.tl.
				// 早く移動.
				moveBy(dx * 0.2, dy * 0.2, frame1).
				// 遅く移動.
				moveBy(dx * 0.8, dy * 0.8, frame2).
				then(function () {
					this.miss();
				});
			utils.Vector2D.free(d);
		}

		
		// なんちゃって放物線.
		public static fireB(bullet: any, tpos: utils.Vector2D): void {
			bullet.force.x = 0;
			bullet.force.y = 0;
			var dx = tpos.x - bullet.center.x;
			var dy = tpos.y - bullet.center.y;
			var frameNum = kimiko.secToFrame(1.0);
			bullet.tl.
				moveBy(dx * 0.25, dy * 0.25 - 64 * 0.7, frameNum * 0.25).
				moveBy(dx * 0.25, dy * 0.25 - 64 * 0.3, frameNum * 0.25).
				moveBy(dx * 0.25, dy * 0.25 + 64 * 0.3, frameNum * 0.25).
				moveBy(dx * 0.25, dy * 0.25 + 64 * 0.7, frameNum * 0.25).
				moveBy(dx       , 320                 , frameNum).
				then(function () {
					this.miss();
				});
		}

		public lookAtPlayer(): void {
			var player = this.parent.scene.player;
			this.dir.x = player.center.x - this.parent.center.x;
			this.dir.y = player.center.y - this.parent.center.y;
			this.targetPos.set(player.center);
			utils.Vector2D.normalize(this.dir);
		}

		public lookAtFront(): void {
			this.targetPos.x = this.parent.center.x + this.dir.x * 320;
			this.targetPos.y = this.parent.center.y + this.dir.y * 320;
		}

		public startFire(): void {
			this.fireCounter = 0;
			this.fireIntervalCounter = this.fireInterval;
			this.reloadFrameCounter = this.reloadFrameCount;
			this.state = this.stateFire;
		}

		public isStateFire(): bool {
			return this.state === this.stateFire;
		}
	}
}

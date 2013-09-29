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
		dir: utils.IVector2D;

		state: () => void;

		constructor(sprite: any) {
			this.parent = sprite;
			this.state = this.stateNeutral;
			this.wayNum = 1;
			this.fireCount = 1;
			this.fireInterval = kimiko.secToFrame(0.2);
			this.reloadFrameCount = kimiko.secToFrame(3.0);
			this.dir = { x: 1, y: 0 }
			this.speed = kimiko.dpsToDpf(60 * 1.0);
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
				var deg = startDeg + (degInterval * i);
				var rad = deg * degToRad;
				var speed = this.speed;
				bullet.force.x = (this.dir.x * Math.cos(rad) - (this.dir.y * Math.sin(rad))) * speed;
				bullet.force.y = (this.dir.y * Math.cos(rad) + (this.dir.x * Math.sin(rad))) * speed;
				bullet.center.x = parent.center.x;
				bullet.center.y = parent.center.y;
			}
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

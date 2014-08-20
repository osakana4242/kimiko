
/// <reference path="../kimiko.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.game {

	export class WeaponA {
		fireCounter: number;
		fireCount: number;
		fireIntervalCounter: number;
		fireInterval: number;
		reloadSecCounter: number;
		reloadSecCount: number;
		wayNum: number;
		speed: number;
		parent: any;
		targetPos: utils.Vector2D;
		dir: utils.Vector2D;
		isTracePlayer: boolean;

		state: () => void;
		fireFunc: (bullet: any, tpos: utils.Vector2D, speed: number) => void;

		constructor(sprite: any) {
			this.parent = sprite;
			this.state = this.stateNeutral;
			this.wayNum = 1;
			this.fireCount = 1;
			this.fireInterval = 0.2;
			this.fireIntervalCounter = 0;
			this.reloadSecCount = 3.0;
			this.dir = new utils.Vector2D(1, 0);
			this.targetPos = new utils.Vector2D();
			this.speed = g_app.dpsToDpf(60 * 1.0);
			this.fireFunc = WeaponA.fireC;
			this.isTracePlayer = false;
		}

		public step(): void {
			this.state();

		}

		private stateNeutral(): void {
		}

		private stateFire(): void {
			if (this.fireIntervalCounter < this.fireInterval) {
				this.fireIntervalCounter += cc.director.getDeltaTime();
				return;
			}
			this.fireIntervalCounter = 0;
			if (this.fireCounter < this.fireCount) {
				this.fire();
				++this.fireCounter;
				return;
			}
			this.fireCounter = 0;
			this.reloadSecCounter = 0;
			this.state = this.stateNeutral;
	}

		private fire(): void {
			if (this.isTracePlayer) {
				this.lookAtPlayer();
			}
			var parent = this.parent;
			var wayNum = this.wayNum;
			var degToRad = Math.PI / 180;
			var degInterval = 90 / wayNum;
			var startDeg = -degInterval * ((wayNum - 1) / 2);
			for (var i = 0, iNum = wayNum; i < iNum; ++i) {
				var bullet = cc.director.getRunningScene().newEnemyBullet();
				if (!bullet) {
					continue;
				}
				var deg = startDeg + (degInterval * i);
				var rad = deg * degToRad;
				var speed = this.speed;
				bullet.force.x = (this.dir.x * Math.cos(rad) - (this.dir.y * Math.sin(rad))) * speed;
				bullet.force.y = (this.dir.y * Math.cos(rad) + (this.dir.x * Math.sin(rad))) * speed;
				bullet.rect.center = parent.rect.center;
				if (true) {
					var v1 = utils.Vector2D.alloc();
					var v2 = utils.Vector2D.alloc();
	
					v1.set(this.targetPos);
					v1.x -= parent.rect.center.x;
					v1.y -= parent.rect.center.y;
					v1.rotate(rad);
					v1.x += parent.rect.center.x;
					v1.y += parent.rect.center.y;
					this.fireFunc(bullet, v1, speed);

					utils.Vector2D.free(v1);
					utils.Vector2D.free(v2);
				}
				
			}
		}

		// 直進.
		public static fireA(bullet: any, tpos: utils.Vector2D, speed: number): void {
			bullet.force.x = 0;
			bullet.force.y = 0;
			var d = utils.Vector2D.alloc();
			d.x = tpos.x - bullet.rect.center.x;
			d.y = tpos.y - bullet.rect.center.y;
			var mag = utils.Vector2D.magnitude(d);
			var d2 = 480;
			d.x = d.x * d2 / mag;
			d.y = d.y * d2 / mag;
			var frame = Math.floor(d2 / speed);
			
			bullet.runAction(cc.Sequence.create(
				cc.MoveBy.create(g_app.frameToSec(frame), cc.p(d.x, d.y)),
				cc.CallFunc.create(bullet.miss, bullet)
			));
			utils.Vector2D.free(d);
		}

		// 直進. 最初早い.
		public static fireC(bullet: any, tpos: utils.Vector2D, speed: number): void {
			bullet.force.x = 0;
			bullet.force.y = 0;
			var d = utils.Vector2D.alloc();
			d.x = tpos.x - bullet.rect.center.x;
			d.y = tpos.y - bullet.rect.center.y;
			var m = utils.Vector2D.magnitude(d);
			var d2 = 480;
			var dx = d.x * d2 / m;
			var dy = d.y * d2 / m;
			var frame1 = Math.floor(d2 * 0.2 / g_app.dpsToDpf(4 * 60));
			var frame2 = Math.floor(d2 * 0.8 / g_app.dpsToDpf(1 * 60));
	
			bullet.runAction(cc.Sequence.create(
				// 早く移動.
				cc.MoveBy.create(g_app.frameToSec(frame1), cc.p(dx * 0.2, dy * 0.2)),
				// 遅く移動.
				cc.MoveBy.create(g_app.frameToSec(frame2), cc.p(dx * 0.8, dy * 0.8)),
				cc.CallFunc.create(bullet.miss, bullet)
			));

			utils.Vector2D.free(d);
		}

		
		// なんちゃって放物線.
		public static fireB(bullet: any, tpos: utils.Vector2D, speed: number): void {
			bullet.force.x = 0;
			bullet.force.y = 0;
			var dx = tpos.x - bullet.rect.center.x;
			var dy = tpos.y - bullet.rect.center.y;
			var sec = 1.0;

			bullet.runAction(cc.Sequence.create(
				cc.MoveBy.create(sec * 0.25, cc.p(dx * 0.25, dy * 0.25 + VecY.U * 64 * 0.7)),
				cc.MoveBy.create(sec * 0.25, cc.p(dx * 0.25, dy * 0.25 + VecY.U * 64 * 0.3)),
				cc.MoveBy.create(sec * 0.25, cc.p(dx * 0.25, dy * 0.25 + VecY.D * 64 * 0.3)),
				cc.MoveBy.create(sec * 0.25, cc.p(dx * 0.25, dy * 0.25 + VecY.D * 64 * 0.7)),
				cc.MoveBy.create(sec       , cc.p(dx       , VecY.D * 320                 )),
				cc.CallFunc.create(bullet.miss, bullet)
			));
		}

		public lookAtPlayer(): void {
			var player = cc.director.getRunningScene().player;
			this.dir.x = player.rect.center.x - this.parent.rect.center.x;
			this.dir.y = player.rect.center.y - this.parent.rect.center.y;
			this.targetPos.set(player.rect.center);
			utils.Vector2D.normalize(this.dir);
		}

		public lookAtFront(): void {
			this.targetPos.x = this.parent.rect.center.x + this.dir.x * 320;
			this.targetPos.y = this.parent.rect.center.y + this.dir.y * 320;
		}

		public startFire(): void {
			this.fireCounter = 0;
			this.fireIntervalCounter = this.fireInterval;
			this.reloadSecCounter = this.reloadSecCount;
			this.state = this.stateFire;
		}

		public isStateFire(): boolean {
			return this.state === this.stateFire;
		}
	}
}


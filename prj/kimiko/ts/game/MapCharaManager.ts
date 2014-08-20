
/// <reference path="../kimiko.ts" />

module jp.osakana4242.kimiko.game {
	
	var g_app = jp.osakana4242.kimiko.g_app;

	export class MapCharaManager {
		scene: any;
		sleeps: any[] = [];
		actives: any[] = [];
		deads: any[] = [];
		
		constructor(scene: any) {
			this.scene = scene;
		}

		public isAllDead(): boolean {
			if (0 < this.sleeps.length) {
				return false;
			}
			return this.getAliveCount() === 0;
		}

		public clear(): void {
			var arr = this.actives;
			for (var i = arr.length - 1; 0 <= i; --i) {
				var chara = arr.pop();
				chara.removeFromParent(false);
			}
			this.actives.length = 0;
			this.deads.length = 0;
			this.sleeps.length = 0;
		}

		public addSleep(sleep: any): void {
			this.sleeps.push(sleep);
		}

		public step(): void {
			this.checkSpawn();
			this.checkSleep();
		}

		public getAliveCount(): number {
			var count = this.sleeps.length
			for (var i = this.actives.length - 1; 0 <= i; --i) {
				if (this.actives[i].life.isAlive) {
					++count;
				}
			}
			return count;
		}

		/** 画面内に入ったキャラを発生させる。 */
		private checkSpawn(): void {
			var scene = this.scene;
			var camera = this.scene.camera;
			var arr = this.sleeps;
			for (var i = arr.length - 1; 0 <= i; --i) {
				var chara = arr[i];
				if (!camera.isIntersectSpawnRect(chara)) {
					continue;
				}
				arr.splice(i, 1);
				this.actives.push(chara);

				scene.world.addChild(chara);
			}
		}

		/** 画面外に出たキャラを休ませるか棺送りにする。 */
		private checkSleep(): void {
			var scene = this.scene;
			var camera = this.scene.camera;
			var arr = this.actives;
			for (var i = arr.length - 1; 0 <= i; --i) {
				var chara = arr[i];

				if (chara.life.isDead) {
					arr.splice(i, 1);
					this.deads.push(chara);
					chara.removeFromParent(false);
					continue;
				}

				if (!camera.isOutsideSleepRect(chara)) {
					continue;
				}
				arr.splice(i, 1);
				this.sleeps.push(chara);
				chara.removeFromParent(false);
			}
		}
	}
}


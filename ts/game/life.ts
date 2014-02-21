
/// <reference path="../kimiko.ts" />

module jp.osakana4242.kimiko.game {
	
	var g_app = jp.osakana4242.kimiko.g_app;

	/**
		HPを持つもの.
		ダメージを受けるもの.
		ダメージを受けた直後、点滅する.

		用語:
		* Ghost: ダメージを受けない状態.
	*/
	export class Life {
		hp: number;
		hpMax: number;
		ghostFrameCounter: number;
		ghostFrameMax: number;
		damageFrameCounter: number;
		damageFrameMax: number;
		sprite: any;

		constructor(sprite: any) {
			this.sprite = sprite;
			this.hpMax = 100;
			this.hp = this.hpMax;
			this.ghostFrameMax = g_app.secToFrame(1.0);
			this.ghostFrameCounter = 0;
			this.damageFrameMax = g_app.secToFrame(0.2);
			/** ダメージによる点滅演出用カウンタ. */
			this.damageFrameCounter = 0;
		}

		public setGhostFrameMax(frameMax: number) {
			this.ghostFrameMax = frameMax;
			this.ghostFrameCounter = 0;
		}

		public step(): void {
			if (this.isDamageTime || this.isGhostTime) {
				
				if (this.isDamageTime) {
					--this.damageFrameCounter;
				}
				if (this.isGhostTime) {
					--this.ghostFrameCounter;
				}

				// 点滅処理.
				if (this.isDamageTime) {
					this.sprite.visible = (this.damageFrameCounter & 0x1) === 0;
				} else if (this.isGhostTime) {
					this.sprite.visible = (this.ghostFrameCounter & 0x1) === 0;
				} else {
					this.sprite.visible = true;
				}
			}
		}

		public get isAlive(): boolean { return 0 < this.hp; }
		public get isDead(): boolean { return !this.isAlive; }
		/** 無敵時間. */
		public get isGhostTime(): boolean { return 0 < this.ghostFrameCounter; }
		public get isDamageTime(): boolean { return 0 < this.damageFrameCounter; }
		public get canAddDamage(): boolean { return this.isAlive && !this.isGhostTime; }

		public addDamage(v: number): void {
			if (!g_app.config.isDamageEnabled) {
				v = 0;
			}

			this.hp -= v;
			this.ghostFrameCounter = this.ghostFrameMax;
			this.damageFrameCounter = this.damageFrameMax;

			if (0 < this.hp) {
				// Do nothing.
			} else {
				this.kill();
			}
		}
		
		/** HPMAXで復活. */
		public recover(): void {
			this.hp = this.hpMax;
			this.ghostFrameCounter = 0;
			this.damageFrameCounter = 0;
		}

		public kill() {
			this.hp = 0;
			var onDead = this.sprite["onDead"];
			if (onDead) {
				onDead.call(this.sprite);
			}
		}
	}
}


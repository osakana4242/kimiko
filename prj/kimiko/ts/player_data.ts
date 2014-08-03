
/// <reference path="kimiko.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko {

	var DF = jp.osakana4242.kimiko.DF;
	
	export class PlayerData {
		/** 残りHP */
		hp: number;
		hpMax: number;
		score: number;
		restTimeCounter: number;
		restTimeMax: number;
		mapId: number;
		
		constructor() {
			this.reset();
		}

		public reset(): void {
			this.hpMax= DF.PLAYER_HP;
			this.hp = this.hpMax;
			this.score = 0;
			this.restTimeMax = 0;
			this.restTimeCounter = 0;
			this.mapId= DF.MAP_ID_MIN;
		}

		public timeToScore(time: number): number {
			return time;
		}

		/** 結果送信用のテキスト. */
		public get resultText(): string {
			return "SCORE: " + this.score;
		}
	}

}


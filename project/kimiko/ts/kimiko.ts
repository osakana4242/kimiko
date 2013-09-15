/// <reference path="scenes/act.ts" />

declare var enchant: any;

module jp.osakana4242.utils {

	export interface IVector2D {
		x: number;
		y: number;
	}

	export class Vector2D {
		public static copyFrom(dest: IVector2D, src: IVector2D): void {
			dest.x = src.x;
			dest.y = src.y;
		}

		public static add(dest: IVector2D, src: IVector2D): void {
			dest.x += src.x;
			dest.y += src.y;
		}

		public static sqrMagnitude(a: IVector2D): number {
			return (a.x * a.x) + (a.y * a.y);
		}

		public static magnitude(a: IVector2D): number {
			return Math.sqrt(Vector2D.sqrMagnitude(a));
		}

		public static normalize(a: IVector2D): void {
			var m = Vector2D.magnitude(a);
			if (m === 0) {
				return;
			}
			a.x = a.x / m;
			a.y = a.y / m;
		}

	}


	export class Touch {
		startX: number;
		startY: number;
		startFrame: number;
		endX: number;
		endY: number;
		endFrame: number;
		diffX: number;
		diffY: number;
		isTouching: bool = false;
		
		saveTouchStart(x: number, y: number): void {
			this.startX = x;
			this.startY = y;
			this.startFrame = enchant.Core.instance.frame;
			this.isTouching = true;
		}
		
		saveTouchMove(x: number, y: number): void {
			this.endX = x;
			this.endY = y;
			this.endFrame = enchant.Core.instance.frame;
			this.isTouching = false;
			
			this.diffX = this.endX - this.startX;
			this.diffY = this.endY - this.startY;
		}
		
		saveTouchEnd(x: number, y: number): void {
			this.endX = x;
			this.endY = y;
			this.endFrame = enchant.Core.instance.frame;
			this.isTouching = false;
			
			this.diffX = this.endX - this.startX;
			this.diffY = this.endY - this.startY;
		}
		
		getTouchElpsedFrame() { return enchant.Core.instance.frame - this.startFrame; }
	}
	
}

module jp.osakana4242.kimiko {
	var Class = enchant.Class;
	var Core = enchant.Core;
	var Scene = enchant.Scene;
	var Label = enchant.Label;
	var Event = enchant.Event;
	
	export var kimiko: Kimiko = null;
	
	export module DF {
		export var BASE_FPS: number = 60;
		export var SC_W: number = 320;
		export var SC_H: number = 320;
		export var SC_X1: number = 0;
		export var SC_Y1: number = 0;
		export var SC_X2: number = SC_X1 + SC_W;
		export var SC_Y2: number = SC_Y1 + SC_H;
		export var SC1_W: number = 320;
		export var SC1_H: number = 240;
		export var SC2_W: number = 320;
		export var SC2_H: number = 80;
		export var SC2_X1: number = 0;
		export var SC2_Y1: number = 240;
		export var SC2_X2: number = SC2_X1 + SC2_W;
		export var SC2_Y2: number = SC2_Y1 + SC2_H;
		export var IMAGE_MAP = "./images/map.gif";
		export var IMAGE_CHARA001 = "./images/chara001.png";
		export var IMAGE_CHARA002 = "./images/chara002.png";
		export var PLAYER_COLOR: string = "rgb(240, 240, 240)";
		export var PLAYER_DAMAGE_COLOR: string = "rgb(240, 240, 120)";
		export var PLAYER_ATTACK_COLOR: string = "rgb(160, 160, 240)";
		export var ENEMY_COLOR: string = "rgb(120, 80, 120)";
		export var ENEMY_DAMAGE_COLOR: string = "rgb(240, 16, 240)";
		export var ENEMY_ATTACK_COLOR: string = "rgb(240, 16, 16)";

		export var ANIM_ID_CHARA001_WALK = 1;
		export var ANIM_ID_CHARA002_WALK = 2;

		export var GROUND_Y: number = 160;
		export var FONT_M: string = '12px Verdana,"ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","ＭＳ ゴシック","MS Gothic",monospace';
		export var GRAVITY: number = 0.25 * 60;
	}
	
	export class NumberUtil {
		trim(v: number, vMin: number, vMax: number) {
			return Math.max(vMin, Math.min(vMax, v));
		}
		
		sign(v: number) {
			if (0 <= v) {
				return 1;
			} else {
				return -1;
			}
		}
	}
	
	export class Kimiko {
		
		static instance: Kimiko = null;
		
		numberUtil = new NumberUtil();

		
		constructor(config) {
			if (Kimiko.instance) {
				return;
			}
			Kimiko.instance = this;
			var core: any = new enchant.Core(DF.SC_W, DF.SC_H);

			core.fps = config.fps || DF.BASE_FPS;
			core.preload([
				DF.IMAGE_MAP,
				DF.IMAGE_CHARA001,
				DF.IMAGE_CHARA002,
			]); // preload image

			this.registerAnimFrames(DF.ANIM_ID_CHARA001_WALK, [0, 1, 0, 2], 0.2);
			this.registerAnimFrames(DF.ANIM_ID_CHARA002_WALK, [0, 1, 2, 3], 0.1);

			core.onload = function () {
				var scene = new jp.osakana4242.kimiko.scenes.Act();
				core.replaceScene(scene);
			};
		}

		animFrames: { [index: number]: number[]; } = <any>{};

		registerAnimFrames(animId: number, arr: number[], frameSec: number = 0.1) {
			var frameNum = Math.floor(this.core.fps * frameSec);
			var dest = [];
			for (var i = 0, iNum = arr.length; i < iNum; ++i) {
				for (var j = 0, jNum = frameNum; j < jNum; ++j) {
					dest.push(arr[i]);
				}
			}
			this.animFrames[animId] = dest;
		}

		getAnimFrames(animId: number) {
			return this.animFrames[animId];
		}
		
		get core() {
			return enchant.Core.instance;
		}
		
		secToFrame(sec: number): number {
			return this.core.fps * sec;
		}
		
		/**
			毎秒Xドット(DotPerSec) を 毎フレームXドット(DotPerFrame) に変換。 

			60FPSで1フレームに1dot → 1 x 60 = 1秒間に60dot = 60dps
			20FPSで1フレームに1dot → 1 x 20 = 1秒間に20dot = 20dps
		 */
		dpsToDpf(dotPerSec: number): number {
			return dotPerSec
				? dotPerSec / this.core.fps
				: 0;
		}

		//dotPerSecToDotPerFrame
	
	}
	
	export function start(params) {
		kimiko = new Kimiko(params);
		kimiko.core.start();
	}
}

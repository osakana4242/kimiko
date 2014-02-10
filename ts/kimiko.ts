declare var enchant: any;

module jp.osakana4242.utils {

	export interface IVector2D {
		x: number;
		y: number;
	}

	export module StringUtil {
		/** 文字列を指定回数繰り返す.文字列に数値を掛け算. */
		export function mul(v: string, count: number): string {
			var ret = "";
			while (count !== 0) {
				ret += v;
				--count;
			}
			return ret;
		}

	}

	export class Vector2D implements IVector2D {

		public static zero = new Vector2D(0, 0);
		public static one = new Vector2D(1, 1);

		static pool: Vector2D[] = (() => {
			var pool = new Vector2D[]();
			for (var i = 0, iNum = 64; i < iNum; ++i) {
				pool.push(new Vector2D());
			}
			return pool;
		}());

		public static alloc(
			x: number = 0,
			y: number = 0): Vector2D {
			var v = Vector2D.pool.pop();
			if (!v) {
				throw "Vector2D pool empty!!";
			}
			v.reset(x, y);
			return v;
		}

		public static free(r: Vector2D): void {
			Vector2D.pool.push(r);
		}

		constructor(
			public x: number = 0,
			public y: number = 0) {
		}
		
		public reset(x: number, y: number): void {
			this.x = x;
			this.y = y;
		}

		public set(v: IVector2D): void {
			this.x = v.x;
			this.y = v.y;
		}
		
		public rotate(rad: number): void {
			var x = this.x;
			var y = this.y;
			this.x = x * Math.cos(rad) - (y * Math.sin(rad));
			this.y = y * Math.cos(rad) + (x * Math.sin(rad));
		}

		public static copyFrom(dest: IVector2D, src: IVector2D): void {
			dest.x = src.x;
			dest.y = src.y;
		}

		public static equals(a: IVector2D, b: IVector2D) {
			return a.x === b.x && a.y === b.y;
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

		public static sqrDistance(a: IVector2D, b: IVector2D): number {
			var dx = b.x - a.x;
			var dy = b.y - a.y;
			return (dx * dx) + (dy * dy);
		}

		public static distance(a: IVector2D, b: IVector2D): number {
			return Math.sqrt(Vector2D.sqrDistance(a, b));
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

	export class RectCenter implements IVector2D {
		constructor(public rect: IRect) {
		}

		get x(): number {
			return this.rect.x + (this.rect.width / 2);
		}

		set x(v: number) {
			this.rect.x = v - (this.rect.width / 2);
		}

		get y(): number {
			return this.rect.y + (this.rect.height / 2);
		}

		set y(v: number) {
			this.rect.y = v - (this.rect.height / 2);
		}

		set(v: IVector2D): void {
			this.x = v.x;
			this.y = v.y;
		}

	}

	export interface IRect {
		x: number;
		y: number;
		width: number;
		height: number;
	}

	export class Rect implements IRect{
		
		static pool: Rect[] = (() => {
			var pool = new Rect[]();
			for (var i = 0, iNum = 64; i < iNum; ++i) {
				pool.push(new Rect());
			}
			return pool;
		}());

		public static alloc(
			x: number = 0,
			y: number = 0,
			width: number = 0,
			height: number = 0): Rect {
			var v = Rect.pool.pop();
			if (!v) {
				throw "Rect pool empty!!";
			}
			v.reset(x, y, width, height);
			return v;
		}

		public static free(r: Rect): void {
			Rect.pool.push(r);
		}

		center: IVector2D;

		constructor(
			public x: number = 0,
			public y: number = 0,
			public width: number = 0,
			public height: number = 0) {
			this.center = new RectCenter(this);
		}

		public reset(
			x: number = 0,
			y: number = 0,
			width: number = 0,
			height: number = 0): void {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
		}

		public set(v: IRect): void {
			this.x = v.x;
			this.y = v.y;
			this.width = v.width;
			this.height = v.height;
		}

		public static copyFrom(a: IRect, b: IRect): void {
			a.x = b.x;
			a.y = b.y;
			a.width = b.width;
			a.height = b.height;
		}

		public static inside(a: IRect, b: IRect): bool {
			return (a.x <= b.x) && (b.x + b.width < a.x + a.width)
				&& (a.y <= b.y) && (b.y + b.height < a.y + a.height);

		}

		// a の外側に b がいるか.
		public static outside(a: IRect, b: IRect): bool {
			return (b.x + b.width < a.x) || (a.x + a.width <= b.x)
				|| (b.y + b.height < a.y) || (a.y + a.height <= b.y);
		}

		public static intersect(a: IRect, other: IRect): bool {
			return (a.x < other.x + other.width) && (other.x < a.x + a.width)
				&& (a.y < other.y + other.height) && (other.y < a.y + a.height);
		}

		public static distance(a: IRect, b: IRect): number {
			var dx = Math.max(b.x - (a.x + a.width), a.x - (b.x + b.width));
			var dy = Math.max(b.y - (b.y + b.height), a.y - (b.y + b.height));
			// 食い込んでるのは距離0とする.
			if (dx < 0) { dx = 0; }
			if (dy < 0) { dy = 0; }
			//
			if (dx !== 0 && dy !== 0) {
				return Math.sqrt((dx * dx) + (dy * dy));
			} else if (dx !== 0) {
				return dx;
			} else {
				return dy;
			}	
		}

		// own を limitRect の中に収める.
		public static trimPos(ownRect: IRect, limitRect: IRect, onTrim: (x: number, y: number) => void = null ): void {
			// 移動制限.
			if (ownRect.x < limitRect.x) {
				// <
				ownRect.x = limitRect.x;
				if (onTrim) { onTrim.call(ownRect, -1, 0); }
			}
			if (limitRect.x + limitRect.width < ownRect.x + ownRect.width) {
				// >
				ownRect.x = limitRect.x + limitRect.width - ownRect.width;
				if (onTrim) { onTrim.call(ownRect, 1, 0); }
			}
			if (ownRect.y < limitRect.y) {
				// ^
				ownRect.y = limitRect.y;
				if (onTrim) { onTrim.call(ownRect, 0, -1); }
			}
			if (limitRect.y + limitRect.height < ownRect.y + ownRect.height) {
				// v
				ownRect.y = limitRect.y + limitRect.height - ownRect.height;
				if (onTrim) { onTrim.call(ownRect, 0, 1); }
			}
		}
	}

	/** 矩形の当たり判定 */
	export class Collider {
		public parent: IRect;
		public rect = new Rect();
		private workRect = new Rect();
		
		public getRect() {
			var s = this.rect;
			var d = this.workRect;
			d.width = s.width;
			d.height = s.height;
			var x = s.x;
			var y = s.y;
			var p = this.parent;
			if (p) {
				x += p.x;
				y += p.y;
			}
			d.x = x;
			d.y = y;
			return d;
		}
		
		public centerBottom(width: number, height: number) {
			var rect = this.rect;
			rect.width  = width;
			rect.height = height;
			rect.x = (this.parent.width - width) / 2;
			rect.y = this.parent.height - height;
		}
		
		public centerMiddle(width: number, height: number) {
			var rect = this.rect;
			rect.width  = width;
			rect.height = height;
			rect.x = (this.parent.width  - width ) / 2;
			rect.y = (this.parent.height - height) / 2;
		}

		public intersect(collider: Collider): bool {
			return Rect.intersect(this.getRect(), collider.getRect());
		}
		
	}
	

	export class Touch {
		startFrame: number;
		start: Vector2D = new Vector2D();
		end: Vector2D = new Vector2D();
		endFrame: number;
		totalDiff: Vector2D = new Vector2D();
		diff: Vector2D = new Vector2D();
		isTouching: bool = false;
		
		saveTouchStart(pos: IVector2D): void {
			Vector2D.copyFrom(this.start, pos);
			Vector2D.copyFrom(this.end, this.start);
			this.startFrame = enchant.Core.instance.frame;
			this.totalDiff.x = 0;
			this.totalDiff.y = 0;
			this.isTouching = true;
		}
		
		saveTouchMove(pos: IVector2D): void {
			this.diff.x = pos.x - this.end.x;
			this.diff.y = pos.y - this.end.y;
			Vector2D.copyFrom(this.end, pos);

			this.totalDiff.x = this.end.x - this.start.x;
			this.totalDiff.y = this.end.y - this.start.y;
		}
		
		saveTouchEnd(pos: IVector2D): void {
			Vector2D.copyFrom(this.end, pos);
			this.endFrame = enchant.Core.instance.frame;
			this.isTouching = false;
			
			this.totalDiff.x = this.end.x - this.start.x;
			this.totalDiff.y = this.end.y - this.start.y;
		}
		
		getTouchElapsedFrame() { return enchant.Core.instance.frame - this.startFrame; }
	}

	export interface IMapData {
		width: number;
		height: number;
		tileWidth: number;
		tileHeight: number;
		chipSet: string;
		layers: { name: string; tiles: number[][]; }[];
	}
	
	export class AnimSequence {
		imageName: string;
		frameTime: number;
		frameNum: number;
		frameWidth: number;
		frameHeight: number;
		frameList: number[];
	
		constructor(imageName: string, frameWidth: number, frameHeight: number, frameTime: number, frameList: number[]) {
			this.imageName = imageName;
			this.frameTime = frameTime; // 1フレームにかける秒数。
			this.frameWidth = frameWidth;
			this.frameHeight = frameHeight;
			this.frameNum = frameList.length;
			this.frameList = frameList;
		}
	}

	export class AnimSequencer {
		sprite: any;
		waitCnt: number;
		speed: number;
		frameIdx: number;
		sequence_: AnimSequence;
		loopCnt: number;
		loopListener: () => void;
		
		constructor(sprite: any) {
			this.sprite = sprite;
			this.waitCnt = 0.0;
			this.speed = 1.0;
			
			this.frameIdx = 0;
			this.sequence_ = null;
			this.loopCnt = 0;
			
			sprite.addEventListener(enchant.Event.ENTER_FRAME, () => {
				this.step();
				this.sprite.frame = this.curFrame;
			});
		}
		
		get sequence(): AnimSequence {
			return this.sequence_;
		}
		
		set sequence(v: AnimSequence) {
			if (!v) {
				throw "sequcence is null";
			}
			this.sequence_ = v;
			this.waitCnt = 0;
			this.frameIdx = 0;
			this.speed = 1.0;
			this.loopCnt = 0;
			this.sprite.width = v.frameWidth;
			this.sprite.height = v.frameHeight;
			this.sprite.image = kimiko.kimiko.core.assets[v.imageName];
		}
		
		get curFrame(): number {
			if (this.sequence_) {
				return this.sequence_.frameList[this.frameIdx];
			} else {
				return 0;
			}
		}
		
		get isOneLoopEnd() { return 0 < this.loopCnt; }

		step(): void {
			if (this.sequence_ == null) {
				return;
			}
			
			this.waitCnt += 1;
			if (kimiko.kimiko.secToFrame(this.sequence_.frameTime) / this.speed <= this.waitCnt) {
				this.frameIdx += 1;
				if (this.sequence_.frameNum <= this.frameIdx) {
					this.frameIdx = 0;
					++this.loopCnt;
					if (this.loopListener) {
						this.loopListener();
					}
				}
				this.waitCnt = 0;
			}
		}
	}
	
	/** enchant.tl.Timeline拡張. */
	(function() {
		enchant.tl.Timeline.prototype.removeFromParentNode = function() {
			return this.then(function() {
					this.parentNode.removeChild(this);
			});
		};
	}());

	/** enchant.Sprite拡張. */
	(function() {
		var orig = enchant.Sprite.prototype.initialize;
		enchant.Sprite.prototype.initialize = function() {
			orig.apply(this, arguments);
			this.center = new utils.RectCenter(this);
			this.anim = new utils.AnimSequencer(this);
		};
	}());

	export class SpritePool {
		actives: any[];
		sleeps: any[];

		constructor(capacity: number, newSprite: (idx: number) => any) {
			this.sleeps = [];
			this.actives = [];

			for (var i = 0, iNum = capacity; i < iNum; ++i) {
				var spr = newSprite(i);
				this.sleeps.push(spr);
			}
		}

		/** シーンに自前で追加する必要あり. 取得出来ない場合は null を返す.  */
		alloc() {
			var spr = this.sleeps.shift();
			if (spr) {
				spr.tl.clear();
				spr.age = 0;
				spr.scaleX = spr.scaleY = 1.0;
				spr.backgroundColor = null;
				spr.visible = true;
				this.actives.push(spr);
				return spr;
			} else {
				return null;
			}
		}

		/** 未使用状態にする. シーンから取り除く. */
		free(spr: any) {
			if (spr.parentNode) {
				spr.parentNode.removeChild(spr);
			} else {
				var a = 0;
			}
			spr.x = spr.y = 0x7fffffff;
			spr.visible = false;
			//
			var index = this.actives.indexOf(spr);
			if (index !== -1) {
				this.actives.splice(index, 1);
			} else {
				console.log("warn can't free spr. '" + spr + "'");
			}
			//
			this.sleeps.push(spr);
		}

		freeAll(): void {
			for (var i = this.actives.length - 1; 0 <= i; --i) {
				this.free(this.actives[i]);
			}
		}

	}

}

module jp.osakana4242.kimiko {
	var Class = enchant.Class;
	var Core = enchant.Core;
	var Scene = enchant.Scene;
	var Label = enchant.Label;
	var Event = enchant.Event;
	
	export var kimiko: Kimiko = null;
	
	export module Assets {
		export var IMAGE_GAME_START_BG = "./images/game_start_bg.png";
		export var IMAGE_MAP = "./images/map.png";
		export var IMAGE_CHARA001 = "./images/chara001.png";
		export var IMAGE_CHARA002 = "./images/chara002.png";
		export var IMAGE_CHARA003 = "./images/chara003.png";
		export var IMAGE_BULLET = "./images/bullet.png";
		export var IMAGE_EFFECT = "./images/bullet.png";
		export var SOUND_BGM = "./sounds/bgm.mp3";
	}

	export module DF {

		/** ドアを隠すか. */
		export var IS_HIDDEN_DOOR: bool = false;

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
		export var MAP_TILE_W = 32;
		export var MAP_TILE_H = 32;
		export var ENEMY_SPAWN_RECT_MARGIN: number = 8;
		export var ENEMY_SLEEP_RECT_MARGIN: number = 128;
		export var PLAYER_COLOR: string = "rgb(240, 240, 240)";
		export var PLAYER_DAMAGE_COLOR: string = "rgb(240, 240, 120)";
		export var PLAYER_ATTACK_COLOR: string = "rgb(160, 160, 240)";
		export var ENEMY_COLOR: string = "rgb(120, 80, 120)";
		export var ENEMY_DAMAGE_COLOR: string = "rgb(240, 16, 240)";
		export var ENEMY_ATTACK_COLOR: string = "rgb(240, 16, 16)";
		export var ENEMY_ID_BOSS = 0xf;

		export var ANIM_ID_CHARA001_WALK = 10;
		export var ANIM_ID_CHARA001_STAND = 11;
		export var ANIM_ID_CHARA001_SQUAT = 12;
		export var ANIM_ID_CHARA001_DEAD = 13;

		export var ANIM_ID_CHARA002_WALK = 20;
		export var ANIM_ID_CHARA003_WALK = 30;

		export var ANIM_ID_BULLET001 = 300;
		export var ANIM_ID_BULLET002 = 301;

		export var ANIM_ID_DAMAGE = 400;
		export var ANIM_ID_MISS = 401;
		export var ANIM_ID_DEAD = 402;
	

		// スワイプで1フレームにキャラが移動できる最大距離.
		export var TOUCH_TO_CHARA_MOVE_LIMIT = 320; // 30;
		// 一度に移動できる最大ドット数.
		export var PLAYER_MOVE_RESOLUTION = 8;
		export var PLAYER_HP = 3;
		// 最大連射数.
		export var PLAYER_BULLET_NUM = 1;

		export var FONT_M: string = '12px Verdana,"ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","ＭＳ ゴシック","MS Gothic",monospace';
		export var FONT_L: string = '24px Verdana,"ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","ＭＳ ゴシック","MS Gothic",monospace';
	
		export var GRAVITY: number = 0.25 * 60;
		
		export var PLAYER_TOUCH_ANCHOR_ENABLE = true;

		export var MAP_TILE_EMPTY = -1;
		export var MAP_TILE_COLLISION_MIN = 0;
		export var MAP_TILE_COLLISION_MAX = 15;
		export var MAP_TILE_PLAYER_POS = 40;
		export var MAP_TILE_DOOR_OPEN = 41;
		export var MAP_TILE_DOOR_CLOSE = -1;
		export var MAP_TILE_CHARA_MIN = 48;
		
		export var MAP_ID_MIN = 101;
		export var MAP_ID_MAX = 104;

		export var MAP_OPTIONS = {
			101: {
				"title": "tutorial",
				"backgroundColor": "rgb(196,196,196)",
				//"backgroundColor": "rgb(8,8,16)",
				// ドアあり.
				"nextMapId": 102,
				"exitType": "door",
			},
			102: {
				"title": "tutorial",
				"backgroundColor": "rgb(16,16,32)",
				// ドアなし.
				"nextMapId": 103,
				"exitType": "door",
			},
			103: {
				"title": "tutorial",
				"backgroundColor": "rgb(32,196,255)",
				// ドアなし.
				"nextMapId": 104,
				"exitType": "door",
			},
			104: {
				"title": "station",
				"backgroundColor": "rgb(32,196,255)",
				// ドアなし.
				"nextMapId": 105,
				"exitType": "door",
			},
			105: {
				"title": "station",
				"backgroundColor": "rgb(32,196,255)",
				// ドアなし.
				"nextMapId": 106,
				"exitType": "door",
			},
			106: {
				"title": "station",
				"backgroundColor": "rgb(32,196,255)",
				// ドアなし.
				"nextMapId": 107,
				"exitType": "door",
			},
			107: {
				"title": "boss",
				"backgroundColor": "rgb(196,32,32)",
				// ドアなし
				// ラスト.
				"nextMapId": 0,
				"exitType": "enemy_zero",
			},
			202: {
				"title": "trace",
				"backgroundColor": "rgb(32,32,32)",
				"nextMapId": 0,
				"exitType": "door",
			},
			206: {
				"title": "bunbun",
				"backgroundColor": "rgb(32,32,32)",
				"nextMapId": 0,
				"exitType": "door",
			},
			207: {
				"title": "hovering",
				"backgroundColor": "rgb(32,32,32)",
				"nextMapId": 0,
				"exitType": "door",
			},
			208: {
				"title": "horizontal move",
				"backgroundColor": "rgb(32,32,32)",
				"nextMapId": 0,
				"exitType": "door",
			},
			209: {
				"title": "horizontal trace",
				"backgroundColor": "rgb(32,32,32)",
				"nextMapId": 0,
				"exitType": "door",
			},
			301: {
				"title": "test",
				"backgroundColor": "rgb(32,32,32)",
				"nextMapId": 0,
				"exitType": "door",
			},
		};

		export var BIT_L = 1 << 0;
		export var BIT_R = 1 << 1;
		export var BIT_U = 1 << 2;
		export var BIT_D = 1 << 3;
		
		export var DIR_FLAG_TO_VECTOR2D = (() => {
			var a: { [index: number]: utils.IVector2D; } = <any>{};
			var b = 1;
			var c = 0.7;
			a[BIT_L] = { x: -b, y: 0 };
			a[BIT_R] = { x: b, y: 0 };
			a[BIT_U] = { x:  0, y : -b };
			a[BIT_D] = { x: 0, y: b };

			a[BIT_L | BIT_U] = { x: -c, y: -c };
			a[BIT_L | BIT_D] = { x: -c, y: c };
			a[BIT_L | BIT_R] = { x: 0, y: 0 };

			a[BIT_R | BIT_U] = { x: c, y: -c };
			a[BIT_R | BIT_D] = { x: c, y: c };

			a[BIT_U | BIT_D] = { x: 0, y: 0 };

			a[BIT_L | BIT_R | BIT_U] = { x: 0, y: -b };
			a[BIT_L | BIT_R | BIT_D] = { x: 0, y: b };
			a[BIT_L | BIT_U | BIT_D] = { x: -b, y: 0 };
			a[BIT_R | BIT_U | BIT_D] = { x: b, y: 0 };

			a[BIT_L | BIT_R | BIT_U | BIT_D] = { x: 0, y: 0 };
			return a;
		}());
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
		
	export interface IConfig {
		fps: number;
		isSoundEnabled: bool;
		/** プレイヤーが発砲するか. */
		isFireEnabled: bool;
		/** プレイヤー、敵がダメージを受けるか. */
		isDamageEnabled: bool;
		swipeToMoveRate: utils.IVector2D;
		version: string;
	}

	export interface IMapOption {
		title: string;
		backgroundColor: string;
		exitType: string;
		nextMapId: number;
	}

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
			this.score= 0;
			this.restTimeCounter= 0;
			this.restTimeMax= 0;
			this.restTimeMax = kimiko.secToFrame(180);
			this.restTimeCounter = this.restTimeMax;
			this.mapId= DF.MAP_ID_MIN;
		}
	}

	export class Kimiko {
		
		static instance: Kimiko = null;
		
		numberUtil = new NumberUtil();
		config: IConfig;
		playerData: PlayerData;
		gameScene: any;
		pauseScene: any;
		
		constructor(config: IConfig) {
			if (Kimiko.instance) {
				return;
			}
			Kimiko.instance = this;
			this.config = config;
			
			var core: any = new enchant.Core(DF.SC_W, DF.SC_H);
			core.fps = config.fps || DF.BASE_FPS;
			// preload
			for (var key in Assets) {
				if (!Assets.hasOwnProperty(key)) {
					continue;
				}
				var path = Assets[key];
				var pathSplited = path.split(".");
				var ext = pathSplited.length <= 0 ? "" : "." + pathSplited[pathSplited.length - 1];
				// パスにバージョンを付加.
				var newPath = path + "?v=" + config.version + ext;
				Assets[key] = newPath;
				//
				var isSound = ext === ".mp3";
				if (!config.isSoundEnabled && isSound) {
					// 音鳴らさないので読み込みをスキップ.
					continue;
				}
				core.preload(newPath);
			}
			
			// anim
			(() => {
				var r = (animId: number, imageName: string, frameWidth: number, frameHeight: number, frameSec: number, frames: number[]) => {
					var seq = new utils.AnimSequence(imageName, frameWidth, frameHeight, frameSec, frames);
					this.registerAnimFrames(animId, seq);
				}
				r(DF.ANIM_ID_CHARA001_WALK,  Assets.IMAGE_CHARA001, 32, 32, 0.1, [0, 1, 0, 2]);
				r(DF.ANIM_ID_CHARA001_STAND, Assets.IMAGE_CHARA001, 32, 32, 0.1, [0]);
				r(DF.ANIM_ID_CHARA001_SQUAT, Assets.IMAGE_CHARA001, 32, 32, 0.1, [4]);
				r(DF.ANIM_ID_CHARA001_DEAD,  Assets.IMAGE_CHARA001, 32, 32, 0.1, [0, 1, 0, 2]);
		
				r(DF.ANIM_ID_CHARA002_WALK,  Assets.IMAGE_CHARA002, 32, 32, 0.1, [0, 1, 2, 3]);
				r(DF.ANIM_ID_CHARA003_WALK,  Assets.IMAGE_CHARA003, 64, 64, 0.1, [0, 1, 2, 3]);

				r(DF.ANIM_ID_BULLET001,      Assets.IMAGE_BULLET,   16, 16, 0.1, [0, 1, 2, 3]);
				r(DF.ANIM_ID_BULLET002,      Assets.IMAGE_BULLET,   16, 16, 0.1, [4, 5, 6, 7]);

				r(DF.ANIM_ID_DAMAGE,         Assets.IMAGE_EFFECT,   16, 16, 0.1, [8, 9, 10, 11]);
				r(DF.ANIM_ID_MISS,           Assets.IMAGE_EFFECT,   16, 16, 0.1, [12, 13, 14, 15]);
				r(DF.ANIM_ID_DEAD,           Assets.IMAGE_EFFECT,   16, 16, 0.1, [8, 9, 10, 11]);
			}());

			// key bind
			core.keybind(" ".charCodeAt(0), "a");	
			core.keybind("A".charCodeAt(0), "left");	
			core.keybind("D".charCodeAt(0), "right");	
			core.keybind("W".charCodeAt(0), "up");	
			core.keybind("S".charCodeAt(0), "down");	

			//
			core.onload = (() => {
				this.gameScene = new jp.osakana4242.kimiko.scenes.Act();
				this.pauseScene = new jp.osakana4242.kimiko.scenes.Pause();
				kimiko.playerData = new PlayerData();
				if (true) {
					var scene = new jp.osakana4242.kimiko.scenes.Title();
					core.replaceScene(scene);
				} else {
					kimiko.playerData.reset();
					kimiko.playerData.mapId = DF.MAP_ID_MAX;
					core.replaceScene(this.gameScene);
				}
			});
		}

		animFrames: { [index: number]: utils.AnimSequence; } = <any>{};

		registerAnimFrames(animId: number, seq: utils.AnimSequence) {
			this.animFrames[animId] = seq;
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

		frameToSec(frame: number): number { return frame / this.core.fps; }
		
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
		
		/** 指定距離を指定dpsで通過できる時間(frame)
			関数名が決まらない. ('A`)
		*/
		getFrameCountByHoge(distance: number, dps: number): number {
			return distance / this.dpsToDpf(dps);
		}

		//dotPerSecToDotPerFrame
	
	}
	
	export function start(params) {
		kimiko = new Kimiko(params);
		kimiko.core.start();
	}
}


declare var enchant: any;

module jp.osakana4242.utils {

	export module NumberUtil {
		export function trim(v: number, vMin: number, vMax: number) {
			return (v <= vMin) ?
				vMin : (vMax <= v) ?
					vMax :
					v;
		}
		
		export function sign(v: number) {
			return (0 <= v) ?
				1 :
				-1;
		}
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

	export interface IVector2D {
		x: number;
		y: number;
	}

	export class Vector2D implements IVector2D {

		public static zero = new Vector2D(0, 0);
		public static one = new Vector2D(1, 1);

		private static pool: Array<Vector2D> = (() => {
			var pool = new Array<Vector2D>();
			for (var i = 0, iNum = 64; i < iNum; ++i) {
				pool.push(new Vector2D());
			}
			return pool;
		})();

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
		
		static pool: Array<Rect> = (() => {
			var pool = new Array<Rect>();
			for (var i = 0, iNum = 64; i < iNum; ++i) {
				pool.push(new Rect());
			}
			return pool;
		})();

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

		public static inside(a: IRect, b: IRect): boolean {
			return (a.x <= b.x) && (b.x + b.width < a.x + a.width)
				&& (a.y <= b.y) && (b.y + b.height < a.y + a.height);

		}

		// a の外側に b がいるか.
		public static outside(a: IRect, b: IRect): boolean {
			return (b.x + b.width < a.x) || (a.x + a.width <= b.x)
				|| (b.y + b.height < a.y) || (a.y + a.height <= b.y);
		}

		public static intersect(a: IRect, other: IRect): boolean {
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
		private _parent: any;
		public sprite: any;
		public rect = new Rect();
		private relRect = new Rect();
		private workRect = new Rect();
		private onAdded = () => {
			this.parent.parentNode.addChild(this.sprite);
		};
		private onRemoved = () => {
			if (this.sprite.parentNode) {
				this.sprite.parentNode.removeChild(this.sprite);
			}
		};

		public constructor() {
			if (false) {
				// コリジョンの表示.
				this.sprite = new enchant.Sprite();
				this.sprite.backgroundColor = "rgb(255,0,0)";
				this.sprite.addEventListener(enchant.Event.RENDER, () => { this.onRender(); } );
			}
		}

		public get parent() {
			return this._parent;
		}

		public set parent( value ) {
			this._parent = value;

			if (this.sprite && value["addEventListener"]) {
				var pSprite = value;
				if (pSprite.parentNode) {
					this.onAdded();
				}
				pSprite.addEventListener(enchant.Event.ADDED, this.onAdded);
				pSprite.addEventListener(enchant.Event.REMOVED, this.onRemoved);
			}
		}

		public getRelRect() {
			var s = this.rect;
			var d = this.relRect;
			var x = s.x;
			var y = s.y;
			var p = this.parent;
			if (p) {
				var scaleX: number = p["scaleX"];
				var scaleY: number = p["scaleY"];
				var isFlipX = scaleX && (scaleX < 0);
				var isFlipY = scaleY && (scaleY < 0);
				if (isFlipX) {
					var phw = p.width >> 1;
					var shw = s.width >> 1;
					x = (-1 * (s.x + shw - phw)) - shw + phw;
				}
				if (isFlipY) {
					var phh = p.height >> 1;
					var shh = s.height >> 1;
					y = (-1 * (s.y + shh - phh)) - shh + phh;
				}
			}
			d.x = x;
			d.y = y;
			d.width = s.width;
			d.height = s.height;

			return d;
		}
		
		public getRect() {
			var s = this.getRelRect();
			var d = this.workRect;
			var x = s.x;
			var y = s.y;
			var p = this.parent;
			if (p) {
				x += p.x;
				y += p.y;
			}
			d.x = x;
			d.y = y;
			d.width = s.width;
			d.height = s.height;

			return d;
		}

		public onRender() {
			var sprite = this.sprite;
			if (!sprite) {
				return;
			}
			var rect = this.getRect();
			sprite.x = rect.x;
			sprite.y = rect.y;
			sprite.width = rect.width;
			sprite.height = rect.height;
		}
		
		public intersect(collider: Collider): boolean {
			return Rect.intersect(this.getRect(), collider.getRect());
		}

		public static centerBottom(parent: IRect, width: number, height: number): IRect {
			var rect = new Rect();
			rect.width  = width;
			rect.height = height;
			rect.x = (parent.width - width) / 2;
			rect.y = parent.height - height;
			return rect;
		}
		
		public static centerMiddle(parent: IRect, width: number, height: number) {
			var rect = new Rect();
			rect.width  = width;
			rect.height = height;
			rect.x = (parent.width  - width ) / 2;
			rect.y = (parent.height - height) / 2;
			return rect;
		}
	
	}
	

	export class Touch {
		startFrame: number;
		start: Vector2D = new Vector2D();
		end: Vector2D = new Vector2D();
		endFrame: number;
		totalDiff: Vector2D = new Vector2D();
		diff: Vector2D = new Vector2D();
		isTouching: boolean = false;
		
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
			this.sprite.image = enchant.Core.instance.assets[v.imageName];
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
			if (kimiko.g_app.secToFrame(this.sequence_.frameTime) / this.speed <= this.waitCnt) {
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
	(() => {
		var Timeline = enchant.Timeline || enchant.tl.Timeline;
		Timeline.prototype.removeFromParentNode = function() {
			return this.then(function() {
					this.parentNode.removeChild(this);
			});
		};
	})();

	/** enchant.Sprite拡張. */
	(() => {
		var orig = enchant.Sprite.prototype.initialize;
		enchant.Sprite.prototype.initialize = function() {
			orig.apply(this, arguments);
			this.center = new utils.RectCenter(this);
			this.anim = new utils.AnimSequencer(this);
		};
	})();

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


module jp.osakana4242.utils {

	export module ObjectUtil {

		/**
			[ラベル行]と[値行]からなる配列を
			Object型の配列に変換する.

			[
				[label1, label2],
				[value, value],
				[value, value],
			];

				||
				vv

			[
				{label1: value, label2: value},
				{label1: value, label2: value},
			];
		*/
		export function makeObjectListFromLabeledValues(list: Array<any>): Array<any> {
			var dest = [];
			var keys = list[0];
			for (var i = 1, iNum = list.length; i < iNum; ++i) {
				var record = list[i];
				var obj = {};
				for (var j = 0, jNum = keys.length; j < jNum; ++j) {
					obj[keys[j]] = record[j];
				}
				dest.push(obj);
			}
			return dest;
		}

		export function makeObjectMapFromLabeldValues(list: Array<any>, keyGetter: (any) => any) {
			return makeObjectMap(makeObjectListFromLabeledValues(list), keyGetter);
		}

		export function makeObjectMap(list: Array<any>, keyGetter: (any) => any) {
			var map = {};
			for (var i = list.length - 1; 0 <= i; --i) {
				var record = list[i];
				var key = keyGetter(record);
				map[key] = record;
			}
			return map;
		}
	}

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

		export function toPaddingString(v: number, c: string, count: number) {
			return StringUtil.addPadding(v.toString(), c, count);
		}
	}
		
	export module StringUtil {
		var _cacheThreshold = 16;
		var _mulCache = {};

		/** 文字列を指定回数繰り返す.文字列に数値を掛け算.
			一部の計算結果はキャッシュする.
		*/
		export function mul(v: string, count: number): string {
			var ret = ((_cacheThreshold <= count) || !_mulCache[v])
				? null
				: _mulCache[v][count] || null;
			if (ret) {
				// cc.log("mul cache hit!");
				return ret;
			}
			ret = "";

			for (var i = count -1; 0 <= i; --i) {
				ret += v;
			}

			if (count < _cacheThreshold) {
				_mulCache[v] =  _mulCache[v] || {};
				_mulCache[v][count] = ret;
			}
			return ret;
		}

		export function addPadding(v: string, c: string, count: number) {
			var cc = StringUtil.mul(c, count);
			return (cc + v).slice(-cc.length);
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

	export class NodeRect {
		private _node: any;
		private _center = new utils.Vector2D();
		public constructor(node) {
			this._node = node;
		}
		public get width(): number {
			return this._node.width;
		}
		public get height(): number {
			return this._node.height;
		}
		public get x(): number {
			return this._node.x - this._node.width * this._node.getAnchorPoint().x;
		}
		public set x(value: number) {
			this._node.x = value + this._node.width * this._node.getAnchorPoint().x;
		}
		public get y(): number {
			return this._node.y - this._node.getAnchorPoint().y * this._node.height;
		}
		public set y(value: number) {
			this._node.y = value + this._node.height * this._node.getAnchorPoint().y;
		}
		public get minX(): number {
			return this.x;
		}
		public get minY(): number {
			return this.y;
		}
		public get maxX(): number {
			return this.minX + this.width;
		}
		public get maxY(): number {
			return this.minY + this.height;
		}
		public get centerX(): number {
			return this.minX + this.width * 0.5;
		}
		public set centerX(value: number) {
			this.x = value - this.width * 0.5;
		}
		public get centerY(): number {
			return this.minY + this.height * 0.5;
		}
		public set centerY(value: number) {
			this.y = value - this.height * 0.5;
		}
		public get center(): utils.IVector2D {
			this._center.x = this.centerX;
			this._center.y = this.centerY;
			return this._center;
		}
	}

	/** 矩形の当たり判定 */
	export class Collider {
		private _parent: any;
		public sprite: any;
		public rect = new Rect();
		private relRect = new Rect();
		private workRect = new Rect();

		public constructor() {
			if (false) {
				// コリジョンの表示.
				this.sprite = oskn.Plane.create(cc.color(0xff, 0x00, 0x00), 8, 8);
				this.sprite.setAnchorPoint(cc.p(0, 0));
				this.sprite.schedule( () => { this.onRender(); } );
			}
		}

		public get parent() {
			return this._parent;
		}

		public set parent( value ) {
			this._parent = value;

			if (this.sprite) {
				var pSprite = value;
				if (this.sprite.parent !== pSprite) {
					this.sprite.removeFromParent(false);
					pSprite.addChild(this.sprite);
				}
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
				x += p.rect.x;
				y += p.rect.y;
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
			var rect = this.getRelRect();
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
			rect.y = 0; // parent.height - height;
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
			this.startFrame = cc.director.getTotalFrames();
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
			this.endFrame = cc.director.getTotalFrames();
			this.isTouching = false;
			
			this.totalDiff.x = this.end.x - this.start.x;
			this.totalDiff.y = this.end.y - this.start.y;
		}
		
		getTouchElapsedFrame() { return cc.director.getTotalFrames() - this.startFrame; }
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
			
			sprite.schedule( () => {
				this.step();
				this.updateTexture();
			} );
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
			this.sprite.setTexture( v.imageName );
			// this.sprite.getTexture();
			// this.sprite.image = enchant.Core.instance.assets[v.imageName];
			this.updateTexture();
		}
		
		updateTexture() {
			var sprite = this.sprite;
			var r = sprite.getTextureRect();
			var tex = sprite.getTexture(); // Texture2D
			var imgW = tex.getPixelsWide();
			r.width = this.sequence_.frameWidth;
			r.height = this.sequence_.frameHeight;

			var hoge = this.curFrame * r.width;
			r.x = Math.floor( hoge % imgW );
			r.y = Math.floor( hoge / imgW ) * r.height;
			sprite.setTextureRect( r );
			//cc.log( "updateTexture: " + [JSON.stringify(tex), tex.width, tex.height, r.x, r.y, r.width, r.height].join());
			//this.sprite.frame = this.curFrame;
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
	
	export interface ISpriteFontCharacter {
		left: number;
		top: number;
		width: number;
		height: number;
	}

	export class SpriteFont {
		assetName: string;
		imageWidth: number;
		imageHeight: number;
		outlineSize: number;
		marginLeft: number;
		marginRight: number;
		characters: {[index: number]: ISpriteFontCharacter;};
		defaultCharCode: number;

		public getTextWidth(text: string): number {
			var ret = 0;
			for (var i = 0, iNum = text.length; i < iNum; ++i) {
				var code = text.charCodeAt(i);
				var fc = this.getCharacter(code);
				ret += fc.width;
			}
			// 縁取り重なり分.
			ret -= (text.length - 1) * this.outlineSize;
			return ret;
		}

		public getCharacter(code: number) {
			var fc = this.characters[code];
			if (!fc) {
				if (0x61 <= code && code <= 0x7a) {
					// a <= fc <= z
					fc = this.characters[code - 0x20];
				}
				if (!fc) {
					fc = this.characters[this.defaultCharCode];
				}
			}
			return fc;
		}

		public get lineHeight(): number {
			return this.characters[this.defaultCharCode].height;
		}

		public static makeFromFontSettings(assetName: string, defaultCharCode: number, imageWidth: number, imageHeight: number, fontSettings: Array<number>) {
			var font = new SpriteFont();
			font.assetName = assetName;
			font.imageWidth = imageWidth;
			font.imageHeight = imageHeight;
			font.characters = SpriteFont.loadFontSettings(imageWidth, imageHeight, fontSettings);
			font.defaultCharCode = defaultCharCode;
			font.outlineSize = 1;
			return font;
		}

		public static loadFontSettings(textureWidth: number, textureHeight: number, arr: Array<number>) {
			var colCnt = 9;
			var rowCnt = arr.length / colCnt;
			var map: any = {};
			for (var rowI = 0; rowI < rowCnt; ++rowI) {
				var arrOffs = colCnt * rowI;
				var charCode = arr[arrOffs + 0];
				var fontLeftRate = arr[arrOffs + 1];
				var fontBottomRate = arr[arrOffs + 2];
				var fontWidth =  arr[arrOffs + 7];
				var fontHeight = - arr[arrOffs + 8];
				var fontLeft =   textureWidth * fontLeftRate;
				var fontBottom = textureHeight - (textureHeight * fontBottomRate);
				var fontTop =    fontBottom - fontHeight - 1;
				var c = String.fromCharCode(charCode);
				map[charCode] = {
					"char": c,
					"left": fontLeft,
					"top": fontTop,
					"width": fontWidth,
					"height": fontHeight,
				};
			}
			return map;
		}
	}

//	/** enchant.Sprite拡張. */
//	(() => {
//		var orig = enchant.Sprite.prototype.initialize;
//		enchant.Sprite.prototype.initialize = function() {
//			orig.apply(this, arguments);
//			this.center = new utils.RectCenter(this);
//			this.anim = new utils.AnimSequencer(this);
//		};
//	})();

	export class SpritePool {
		actives: any[];
		sleeps: any[];

		constructor(capacity: number, newSprite: (idx: number) => any) {
			this.sleeps = [];
			this.actives = [];

			for (var i = 0, iNum = capacity; i < iNum; ++i) {
				var spr = newSprite(i);
				spr.retain();
				this.sleeps.push(spr);
			}
		}

		destroy() {
			this.freeAll();
			for (var i = this.sleeps.length - 1; 0 <= i; --i) {
				this.sleeps[i].release();
			}
		}

		/** シーンに自前で追加する必要あり. 取得出来ない場合は null を返す.  */
		alloc() {
			var spr = this.sleeps.shift();
			if (spr) {
				spr.stopAllActions();
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
			spr.removeFromParent(false);
			spr.x = spr.y = 0x7fffffff;
			spr.visible = false;
			//
			var index = this.actives.indexOf(spr);
			if (index !== -1) {
				this.actives.splice(index, 1);
			} else {
				cc.log("warn can't free spr. '" + spr + "'");
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

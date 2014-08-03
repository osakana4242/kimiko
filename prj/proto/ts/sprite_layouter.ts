
/// <reference path="kimiko.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko {
	
	var g_app = jp.osakana4242.kimiko.g_app;
	var DF = jp.osakana4242.kimiko.DF;

	export interface ISpriteLayoutItem {
		spriteName: string;
		layoutName: string;
		visible: boolean;
		delay: number;
		x: number;
		y: number;
	}

	export class SpriteLayouter {
		public layout: Array<ISpriteLayoutItem>;
		public sprites: {[index: string]: any;} = {};
		public scale = new utils.Vector2D(1.0, 1.0);
		public node: any = new enchant.Node();

		constructor(parentNode: any) {
			parentNode.addChild(this.node);
		}
	
		/** 指定矩形のXYを指定位置を中心に反転する. */
		private scalePosition(rect: utils.IRect, origin: utils.IVector2D, scale: utils.IVector2D) {
			var x = rect.x;
			var y = rect.y;

			var ox = origin.x;
			var rhw = rect.width >> 1;
			x = (scale.x * (x + rhw - ox)) - rhw + ox;

			var oy = origin.y;
			var rhh = rect.height >> 1;
			y = (scale.y * (y + rhh - oy)) - rhh + oy;

			rect.x = x;
			rect.y = y;
			return rect;
		}

		/** 指定矩形のXYを指定位置を中心に反転する. */
		private flipPosition(rect: utils.IRect, origin: utils.IVector2D, isFlipX: boolean, isFlipY: boolean) {
			var x = rect.x;
			var y = rect.y;
			if (isFlipX) {
				var ox = origin.x;
				var rhw = rect.width >> 1;
				x = (-1 * (x + rhw - ox)) - rhw + ox;
			}
			if (isFlipY) {
				var oy = origin.y;
				var rhh = rect.height >> 1;
				y = (-1 * (y + rhh - oy)) - rhh + oy;
			}
			rect.x = x;
			rect.y = y;
			return rect;
		}

		private _transition(layoutName: string, isUseTl: boolean, scale: utils.IVector2D) {
			console.log("transition: " + layoutName);

			var rect =    utils.Rect.alloc(0, 0, 320, 320);
			var sprRect = utils.Rect.alloc();

			var origin = rect.center;

			for (var i = 0, iNum = this.layout.length; i < iNum; ++i) {
				var l = this.layout[i];
				if (l.layoutName !== layoutName) {
					continue;
				}
				var spr = this.sprites[l.spriteName];
				if (!spr) {
					continue;
				}
				console.log( "spr:" + l.spriteName );

				sprRect.x = l.x;
				sprRect.y = l.y;
				sprRect.width = spr.width;
				sprRect.height = spr.height;
				this.scalePosition(sprRect, origin, scale);

				if (isUseTl) {
					if (0 < l.delay) {
						spr.tl.delay(g_app.secToFrame(l.delay));
					}
					if (l.visible) {
						// 動く前に表示する.
						spr.tl.then(function () { this.visible = true; });
					}
					spr.tl.moveTo(sprRect.x, sprRect.y, g_app.secToFrame(0.2), enchant.Easing.SIN_EASEOUT);
					if (!l.visible) {
						// 動いた後に非表示にする.
						spr.tl.then(function () { this.visible = false; });
					}
				} else {
					spr.x = sprRect.x;
					spr.y = sprRect.y;
					spr.visible = l.visible;
				}
			}

			utils.Rect.free(rect);
			utils.Rect.free(sprRect);
		}

		public transition(layoutName: string, isUseTl: boolean) {
			var scale = new utils.Vector2D(this.scale.x, this.scale.y);
			if (!g_app.storage.root.userConfig.isUiRight) {
				scale.x *= -1;
			}

			if (!isUseTl && this.node.tl.queue.length <= 0) {
				this._transition(layoutName, isUseTl, scale);
				return;
			}

			this.node.tl.
				then(() => {
					this._transition(layoutName, isUseTl, scale);
				}).
				waitUntil(() => {
					// 各スプライトのTLが終わるのを待つ.
					for (var key in this.sprites) {
						var spr = this.sprites[key];
						if (0 < spr.tl.queue.length) {
							return false;
						}
					}
					return true;
				});
		}
	}
}


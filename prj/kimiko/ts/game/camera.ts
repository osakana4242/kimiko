/// <reference path="../kimiko.ts" />

module jp.osakana4242.kimiko.scenes {

	var g_app = jp.osakana4242.kimiko.g_app;

	export var Camera: any = cc.Node.extend( {
		ctor: function () {
			this._super();

			this.width = DF.SC1_W;
			this.height = DF.SC1_H;
			this.setAnchorPoint(cc.p(0.5, 0.5));
			this.rect = new utils.NodeRect( this );

			this.guide = oskn.Plane.create(cc.color(0xff, 0x00, 0xff), 8, 8);
			this.addChild(this.guide);

			this.limitRect = new utils.Rect(0, 0, 320, 320);
			this.sleepRect = new utils.Rect(
				0,
				0,
				this.width + DF.ENEMY_SLEEP_RECT_MARGIN,
				this.height + DF.ENEMY_SLEEP_RECT_MARGIN
			);
			this.spawnRect = new utils.Rect(
				0,
				0,
				this.width + DF.ENEMY_SPAWN_RECT_MARGIN,
				this.height + DF.ENEMY_SPAWN_RECT_MARGIN
			);
			this._targetPos = new utils.Vector2D();
			this.targetGroup = null;
			this.targetNode = this;

			this.scheduleUpdate();
		},

		getTargetPosOnCamera: function (): utils.IVector2D {
			var camera = this;
			var pos = this.targetNode;
			var o = <utils.IVector2D>{};
			Object.defineProperty(o, "x", {
					get: function () {
							return pos.x - camera.x;
					},
					enumerable: true,
					configurable: true
			});
			Object.defineProperty(o, "y", {
					get: function () {
							return pos.y - camera.y;
					},
					enumerable: true,
					configurable: true
			});
			return o;
		},

		/** 目的地に瞬時にたどり着く。 */
		moveToTarget: function() {
			utils.Vector2D.copyFrom(this, this.calcTargetPos());
		},

		calcTargetPos: function() {
			var node = this.targetNode;
			var camera = this;
			this._targetPos.x = node.x;
			this._targetPos.y = node.y;
			return this._targetPos;
		},

		update: function (deltaTime: number) {
			//cc.log( "camera update deltaTime:" + deltaTime );
			var camera = this;
			var tp = this.calcTargetPos();
			var speed = g_app.dpsToDpf(3 * 60);
			var dv = utils.Vector2D.alloc(
				tp.x - camera.x,
				tp.y - camera.y
			);
			var mv = utils.Vector2D.alloc();
			var distance = utils.Vector2D.magnitude(dv);

			if (speed < distance) {
				mv.x = dv.x * speed / distance;
				mv.y = dv.y * speed / distance;
			} else {
				mv.x = dv.x;
				mv.y = dv.y;
			}
			camera.x = camera.x + mv.x;
			camera.y = camera.y + mv.y;
			
			// カメラと対象のずれの許容範囲.
			var marginX = camera.width * 0.25;
			var marginY = camera.height * 0.25;
			var limitRect = utils.Rect.alloc(
				tp.x - (camera.width + marginX) * 0.5,
				tp.y - (camera.height + marginY) * 0.5,
				camera.width + marginX,
				camera.height + marginY
			);
			
			utils.Rect.trimPos(camera.rect, limitRect);
			
//			cc.log("" +
//				"(" +
//				limitRect.x + ", " +
//				limitRect.y + ", " +
//				limitRect.width + ", " +
//				limitRect.height + ", " +
//				")" +
//				camera.x + ", " +
//				camera.y + "" +
//				"");
				
			utils.Rect.trimPos(camera.rect, camera.limitRect);

			//
			this.updateGroup();
			this.updateGuide();
			//
			utils.Vector2D.free(dv);
			utils.Vector2D.free(mv);
			utils.Rect.free(limitRect);
		},

		updateGroup: function() {
			var group = this.targetGroup;
			if (group) {
				group.x = Math.round(- this.x);
				group.y = Math.round(- this.y);
			}
		},

		/** デバッグ用. カメラの位置を表す矩形. */
		updateGuide: function() {
			var guide = this.guide;
			guide.x = this.width * 0.5;
			guide.y = this.height * 0.5;
		},

		isIntersectSpawnRect: function (entity: utils.IRect): boolean {
				var rect: utils.IRect = this.spawnRect;
				rect.x = this.x -((rect.width - this.width) / 2);
				rect.y = this.y -((rect.height - this.height) / 2);
				return utils.Rect.intersect(rect, entity);
		},

		isOutsideSleepRect: function (entity: utils.IRect) {
			var rect: utils.IRect = this.sleepRect;
			rect.x = this.x - ((rect.width - this.width) / 2);
			rect.y = this.y - ((rect.height - this.height) / 2);
			return utils.Rect.outside(rect, entity);
		},
	});

}


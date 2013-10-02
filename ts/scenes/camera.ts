/// <reference path="../kimiko.ts" />

module jp.osakana4242.kimiko.scenes {
	var Class = enchant.Class;
	var Core = enchant.Core;
	var Scene = enchant.Scene;
	var Label = enchant.Label;
	var Event = enchant.Event;
	var Easing = enchant.Easing;

	export var Camera: any = Class.create(enchant.Node, {
		initialize: function () {
			enchant.Node.call(this);

			this.width = DF.SC1_W;
			this.height = DF.SC1_H;
			this.center = new utils.RectCenter(this);

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
		},

		/** 目的地に瞬時にたどり着く。 */
		moveToTarget: function() {
			utils.Vector2D.copyFrom(this, this.calcTargetPos());
		},

		calcTargetPos: function() {
			var node = this.targetNode;
			var camera = this;
			// カメラ移動.
			// プレイヤーからどれだけずらすか。
			// 前方は後方より少しだけ先が見えるようにする。
			this._targetPos.x = node.center.x - (camera.width / 2) + (node.dirX * 16);
			// 指で操作する関係で下方向に余裕を持たせる.
			this._targetPos.y = node.center.y - (camera.height / 2) + 32;
			return this._targetPos;
		},

		onenterframe: function () {
			var camera = this;
			var tv = this.calcTargetPos();
			var speed = kimiko.dpsToDpf(8 * 60);
			var dv = utils.Vector2D.alloc(
				tv.x - camera.x,
				tv.y - camera.y
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
			camera.x = Math.floor(camera.x + mv.x);
			camera.y = Math.floor(camera.y + mv.y);

			utils.Rect.trimPos(camera, camera.limitRect);

			//
			this.updateGroup();
			//
			utils.Vector2D.free(dv);
			utils.Vector2D.free(mv);
		},

		updateGroup: function() {
			var group = this.targetGroup;
			if (group) {
				group.x = - this.x;
				group.y = - this.y;
			}
		},

		isIntersectSpawnRect: function (entity: utils.IRect): bool {
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


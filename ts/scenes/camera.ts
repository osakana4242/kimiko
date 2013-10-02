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
			this.targetGroup = null;
		},

		onenterframe: function () {
			var camera = this;
			var player = this.scene.player;
			// カメラ移動.
			// プレイヤーからどれだけずらすか。
			// 前方は後方より少しだけ先が見えるようにする。
			var tx: number = player.center.x - (camera.width / 2) + (player.dirX * 16);
			// 指で操作する関係で下方向に余裕を持たせる.
			var ty: number = player.center.y - (camera.height / 2) + 32;
			var speed = kimiko.dpsToDpf(8 * 60);
			var dx = tx - camera.x;
			var dy = ty - camera.y;
			var mx = 0;
			var my = 0;
			var distance = utils.Vector2D.magnitude({ x: dx, y: dy });

			if (speed < distance) {
				mx = dx * speed / distance;
				my = dy * speed / distance;
			} else {
				mx = dx;
				my = dy;
			}
			camera.x = Math.floor(camera.x + mx);
			camera.y = Math.floor(camera.y + my);

			utils.Rect.trimPos(camera, camera.limitRect);

			//
			var group = this.targetGroup;
			if (group) {
				group.x = -camera.x;
				group.y = -camera.y;
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



/// <reference path="../kimiko.ts" />

module jp.osakana4242.kimiko.game {

	var g_app = jp.osakana4242.kimiko.g_app;
	var DF = jp.osakana4242.kimiko.DF;

	/** 自弾 */
	export var OwnBullet: any = enchant.Class.create(enchant.Sprite, {
		initialize: function () {
			enchant.Sprite.call(this, 16, 16);
			this.anim.sequence = g_app.getAnimFrames(DF.ANIM_ID_BULLET001);
			this.ageMax = 0;
			this.force = new utils.Vector2D();
			this.force.x = 0;
			this.force.y = 0;
			this.collider = (() => {
				var c = new utils.Collider();
				c.parent = this;
				utils.Rect.copyFrom(c.rect, new utils.Rect(-24, 4, 32, 8));
				return c;
			})();
		},

		onenterframe: function () {
			this.x += this.force.x;
			this.y += this.force.y;
			var scene = this.scene;
			var camera = this.scene.camera;
			
			if (this.ageMax <= this.age) {
				this.miss();
				return;
			}

			if (camera.isOutsideSleepRect(this)) {
				this.miss();
				return;
			}
					
			if (!this.scene.intersectActiveArea(this)) {
				this.miss();
				return;
			}

			scene.checkMapCollision(this, this.miss);

		},
	
		miss: function () {
			this.scene.addEffect(DF.ANIM_ID_MISS, this.center);
			this.free();
		},
		
		free: function () {
			this.scene.ownBulletPool.free(this);
		},
	});

}


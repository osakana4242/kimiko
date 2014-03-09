
/// <reference path="../kimiko.ts" />

module jp.osakana4242.kimiko.game {

	var g_app = jp.osakana4242.kimiko.g_app;
	var DF = jp.osakana4242.kimiko.DF;

	/** 敵弾 */
	export var EnemyBullet: any = enchant.Class.create(enchant.Sprite, {
		initialize: function () {
			enchant.Sprite.call(this, 16, 16);
			this.anim.sequence = g_app.getAnimFrames(DF.ANIM_ID_BULLET002);
			this.ageMax = 0;
			this.force = new utils.Vector2D();
			this.force.x = 0;
			this.force.y = 0;
			this.oldPos = new utils.Vector2D();
			this.collider = (() => {
				var c = new utils.Collider();
				c.parent = this;
				utils.Rect.copyFrom(c.rect, utils.Collider.centerMiddle(this, 4, 4));
				return c;
			})();
		},

		onenterframe: function () {
			this.force.x = this.x - this.oldPos.x;
			this.force.y = this.y - this.oldPos.y;
			utils.Vector2D.copyFrom(this.oldPos, this);
			
			// this.x += this.force.x;
			// this.y += this.force.y;

			var camera = this.scene.camera;
			
			if (this.ageMax < this.age) {
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

			this.scene.checkMapCollision(this, this.miss);
		},

		miss: function () {
			this.scene.addEffect(DF.ANIM_ID_MISS, this.center);
			this.free();
		},

			
		free: function () {
			this.scene.enemyBulletPool.free(this);
		},

	});
		
}


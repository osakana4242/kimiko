
/// <reference path="../kimiko.ts" />

module jp.osakana4242.kimiko.game {

	var g_app = jp.osakana4242.kimiko.g_app;
	var DF = jp.osakana4242.kimiko.DF;

	/** 自弾 */
	export var OwnBullet: any = cc.Sprite.extend( {
		ctor: function () {
			this._super();

			this.width = 16;
			this.height = 16;
			this.rect = new utils.NodeRect(this);
			this.anim = new utils.AnimSequencer(this);
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
			this._miss = () => { this.miss(); };
			this.scheduleUpdate();
		},

		onEnter: function() {
			this._super();
		},

		update: function (deltaTime: number) {
			++this.age;

			this.oldX = this.x;
			this.oldY = this.y;
			this.x += this.force.x * deltaTime;
			this.y += this.force.y * deltaTime;
			var scene = cc.director.getRunningScene();
			var camera = scene.camera;
			
			if (this.ageMax <= this.age) {
				this.miss();
				return;
			}

			if (camera.isOutsideSleepRect(this)) {
				this.miss();
				return;
			}
					
			if (!scene.intersectActiveArea(this)) {
				this.miss();
				return;
			}

			scene.checkMapCollision(this, this._miss);

		},
	
		miss: function () {
			var scene = cc.director.getRunningScene();
			scene.addEffect(DF.ANIM_ID_MISS, this.rect.center);
			this.free();
		},
		
		free: function () {
			var scene = cc.director.getRunningScene();
			scene.ownBulletPool.free(this);
		},
	} );

}



/// <reference path="act.ts" />

module jp.osakana4242.kimiko.scenes {

	var Class = enchant.Class;
	var Event = enchant.Event;
	var Easing = enchant.Easing;

	/** 敵弾 */
	export var EnemyBullet: any = Class.create(enchant.Sprite, {
		initialize: function () {
			enchant.Sprite.call(this, 16, 16);
			this.anim.sequence = kimiko.getAnimFrames(DF.ANIM_ID_BULLET002);
			this.ageMax = 0;
			this.force = new utils.Vector2D();
			this.force.x = 0;
			this.force.y = 0;
			this.collider = (() => {
				var c = new utils.Collider();
				c.parent = this;
				c.centerMiddle(4, 4);
				return c;
			}());
		},

		onenterframe: function () {
			this.x += this.force.x;
			this.y += this.force.y;

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
		
	/** 自弾 */
	export var OwnBullet: any = Class.create(enchant.Sprite, {
		initialize: function () {
			enchant.Sprite.call(this, 16, 16);
			this.anim.sequence = kimiko.getAnimFrames(DF.ANIM_ID_BULLET001);
			this.ageMax = 0;
			this.force = new utils.Vector2D();
			this.force.x = 0;
			this.force.y = 0;
			this.collider = (() => {
				var c = new utils.Collider();
				c.parent = this;
				c.centerMiddle(8, 8);
				return c;
			}());
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

	/** とりあえず攻撃できるひと */
	export var Attacker: any = Class.create(enchant.Sprite, {
		initialize: function () {
			enchant.Sprite.call(this);
			this.dirX = 1;
			this.force = new utils.Vector2D();
			this.force.x = 0;
			this.force.y = 0;
			this.attackCnt = 0;
			this.useGravity = true;
			this.life = new Life();

			this.stateNeutral.stateName = "neutral";
			this.state = this.stateNeutral;
			
			this.rectCollider_ = new utils.Rect();
			this.workRect_ = new utils.Rect();

			this.addEventListener(Event.ENTER_FRAME, () => {
				this.state();
				this.life.step();

				var visible = true;
				if (this.life.isGhostTime()) {
					visible = (this.life.ghostFrameCounter & 0x1) === 0;
				}
				this.visible = visible;
			});
		},
		
		stateToString: function () {
			var dir: string = 0 <= this.dirX ? '>' : '<';
			return (<any[]>[dir, this.state.stateName, 'cx', Math.round(this.center.x), 'cy', Math.round(this.center.y)]).join();
		},

		stateNeutral: function () {
		},

		stateDamage: function () {
			if (!this.life.isGhostTime()) {
				this.neutral();
			}
		},

		stateDead: function () {
		},

		neutral: function () {
			this.state = this.stateNeutral;
		},

		damage: function (attacker?: any) {
			this.life.damage(1);
			if (this.life.isAlive()) {
				this.state = this.stateDamage;
			} else {
				// シボンヌ.
				this.dead();
			}
		},
		dead: function () {
			this.visible = false;
			this.state = this.stateDead;
			// 死亡エフェクト追加.
			for (var i = 0, iNum = 3; i < iNum; ++i) {
				var effect = new DeadEffect(this, i * kimiko.core.fps * 0.2);
				effect.x += Math.random() * 32 - 16;
				effect.y += Math.random() * 32 - 16;
				this.parentNode.addChild(effect);
			}
		},

		isDead: function () {
			return this.state === this.stateDead;
		},
		isDamage: function () {
			return this.state === this.stateDamage;
		},
		isAttack: function () {
			return this.state === this.stateAttack;
		},
		isNeutral: function () {
			return this.state === this.stateNeutral;
		},
	});
		
	// 敵はしかれたレールをなぞるだけ。
	export var EnemyA = Class.create(Attacker, {
		initialize: function () {
			Attacker.call(this);

			this.enemyId = -1;
			this.weapons = [];
			for (var i = 0, iNum = 8; i < iNum; ++i) {
				this.weapons[i] = new WeaponA(this);
			}
			this.weaponNum = 1;
			this.anchor = new utils.Vector2D();
			this.collider = new utils.Collider();
			this.collider.parent = this;
			this.life.setGhostFrameMax(kimiko.secToFrame(0.2));
			this.addEventListener(Event.ENTER_FRAME, () => {
				for (var i = 0, iNum = this.weaponNum; i < iNum; ++i) {
					this.weapons[i].step();
				}
			});
		},
		
		weapon: { get: function () {
				return this.weapons[0];
		}, },
		
		enemyData: { get: function () {
			return EnemyData[this.enemyId];
		}, },
		isBoss: function () { return this.enemyId === DF.ENEMY_ID_BOSS; },

	});

	/** 死亡エフェクト */
	export var DeadEffect: any = Class.create(enchant.Sprite, {
		initialize: function (attacker, delay: number) {
			enchant.Sprite.call(this);
			this.width = attacker.width;
			this.height = attacker.height;
			this.center.x = attacker.center.x;
			this.center.y = attacker.center.y;
			this.backgroundColor = attacker.backgroundColor;
			var effectTime: number = kimiko.secToFrame(0.5);
			this.visible = false;
			this.tl
			.delay(delay)
			.then(() => this.visible = true)
			.scaleTo(2.0, effectTime, enchant.Easing.SIN_EASEOUT)
			.and().fadeOut(effectTime, enchant.Easing.SIN_EASEOUT)
			.then(() => this.tl.removeFromScene());
		},
	});
	
}


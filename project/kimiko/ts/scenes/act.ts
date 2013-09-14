declare var enchant: any;

module jp.osakana4242.kimiko.scenes {
	
	var Class = enchant.Class;
	var Core = enchant.Core;
	var Scene = enchant.Scene;
	var Label = enchant.Label;
	var Event = enchant.Event;
	
	module sprites {
		/** 拡張Sprite */
		export var Sprite: any = Class.create(enchant.Sprite, {
			initialize: function (w: number, h: number) {
				enchant.Sprite.call(this, w, h);
			},
			cx: {
				get: function () {
					return this.x + this.width / 2;
				},
				set: function (v) {
					this.x = v - this.width / 2;
				}
			},
			cy: {
				get: function () {
					return this.y + this.height / 2;
				},
				set: function (v) {
					this.y = v - this.height / 2;
				}
			},
		});
		
		/** 敵弾 */
		export var EnemyBullet: any = Class.create(Sprite, {
			initialize: function () {
				Sprite.call(this, 16, 16);
				this.vx = 0;
				this.vy = 0;
				this.backgroundColor = 'rgb(255, 64, 64)';
				this.tl.scaleTo(1.25, kimiko.core.fps * 0.1)
					.scaleTo(1.0, kimiko.core.fps * 0.1)
					.loop();
			},
			onenterframe: function () {
				if (!this.visible) {
					return;
				}
				this.x += this.vx;
				this.y += this.vy;
				var player = this.scene.player;
				var minX: number = player.cx - DF.SC1_W;
				var maxX: number = player.cx + DF.SC1_W;
				if (!this.scene.intersectActiveArea(this)) {
					this.visible = false;
				}
			},
		});
		
		/** 自弾 */
		export var OwnBullet: any = Class.create(Sprite, {
			initialize: function () {
				Sprite.call(this, 8, 8);
				this.vx = 0;
				this.vy = 0;
				this.visibleCnt = 0;
				this.backgroundColor = 'rgb(64, 255, 255)';
				this.tl.scaleTo(1.25, DF.FPS * 0.1)
					.scaleTo(1.0, DF.FPS * 0.1)
					.loop();
			},
			onenterframe: function () {
				if (!this.visible) {
					return;
				}
				this.x += this.vx;
				this.y += this.vy;
				var player = this.scene.player;
				var minX: number = player.cx - DF.SC1_W;
				var maxX: number = player.cx + DF.SC1_W;
				this.visibleCnt += 1;
				if (kimiko.secToFrame(0.5) <= this.visibleCnt || !this.scene.intersectActiveArea(this)) {
					this.visible = false;
					this.visibleCnt = 0;
				}
			},
		});
		
		/** とりあえず攻撃できるひと */
		export var Attacker: any = Class.create(Sprite, {
			initialize: function () {
				Sprite.call(this);
				this.dirX = 1;
				this.vx = 0;
				this.vy = 0;
				this.damageCnt = 0;
				this.attackCnt = 0;
				this.colorNeutral = DF.ENEMY_COLOR;
				this.colorDamage = DF.ENEMY_DAMAGE_COLOR;
				this.colorAttack = DF.ENEMY_ATTACK_COLOR;
				this.hp = 100;
				this.useGravity = true;
				
				this.stateNeutral.stateName = "neutral";
				this.state = this.stateNeutral;
			},
			stateToString: function () {
				var dir: string = 0 <= this.dirX ? '>' : '<';
				return (<any[]>[dir, this.state.stateName, 'cx', Math.round(this.cx), 'cy', Math.round(this.cy)]).join();
			},
			onenterframe: function () {
				this.stepMove();
				this.stepState();
				if (this.step) {
					this.step();
				}
			},
			stepMove: function () {
				if (this.useGravity) {
					this.vy += DF.GRAVITY;
				}
				if (this.cx < DF.SC_X1) {
					this.cx = DF.SC_X1;
					this.vx = 0;
				}
				if (DF.SC_X2 < this.cx) {
					//this.cx = DF.SC_X2;
					//this.vx = 0;
				}
				if (DF.GROUND_Y < this.cy) {
					this.cy = DF.GROUND_Y;
					this.vy = 0;
				}
				this.x += this.vx;
				this.y += this.vy;
				var hoge = 0.98;
				this.vx *= hoge;
				this.vy *= hoge;
			},
			stepState: function () {
				this.state();
			},
			stateNeutral: function () {
			},
			stateDamage: function () {
				--this.damageCnt;
				if (this.damageCnt <= 0) {
					this.neutral();
				}
			},
			stateAttack: function () {
				--this.attackCnt;
				if (this.attackCnt <= 0) {
					this.neutral();
				}
			},
			stateDead: function () {
			},
			neutral: function () {
				this.state = this.stateNeutral;
			},
			damage: function (attacker?: any) {
				if (attacker) {
					this.vx += attacker.vx;
					this.vy += -1;
				}
				this.hp -= 50;
				if (0 < this.hp) {
					this.damageCnt = DF.DAMAGE_TIME;
					this.attackCnt = 0;
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
			attack: function () {
				this.attackCnt = DF.ATTACK_TIME;
				this.state = this.stateAttack;
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
		
		/** 死亡エフェクト */
		export var DeadEffect: any = Class.create(Sprite, {
			initialize: function (attacker, delay: number) {
				Sprite.call(this);
				this.width = attacker.width;
				this.height = attacker.height;
				this.cx = attacker.cx;
				this.cy = attacker.cy;
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
		
		/** 地形 */
		export var Ground: any = Class.create(Sprite, {
			initialize: function () {
				Sprite.call(this);
				this.width = 96;
				this.height = 8;
				this.backgroundColor = 'rgb(128, 128, 128)';
			},
		});
		
		export var Player: any = Class.create(Attacker, {
			initialize: function () {
				Attacker.call(this);
				this.image = kimiko.core.assets[DF.IMAGE_PLAYER]
				this.frame = [
					0, 0, 0, 0,
					0, 0, 0, 0,
					1, 1, 1, 1,
					1, 1, 1, 1,
					0, 0, 0, 0,
					0, 0, 0, 0,
					2, 2, 2, 2,
					2, 2, 2, 2,
				];
				this.width = 32;
				this.height = 32;
				this.hp = 500;
				this.colorNeutral = DF.PLAYER_COLOR;
				this.colorDamage = DF.PLAYER_DAMAGE_COLOR;
				this.colorAttack = DF.PLAYER_ATTACK_COLOR;
				this.anchorX = 0;
				this.anchorY = 0;
				this.useGravity = false;
				//this.backgroundColor = this.colorNeutral;
			},
			attack: function () {
				var bullet = this.scene.newOwnBullet();
				bullet.vx = this.dirX * kimiko.secToPx(200);
				bullet.vy = 0;
				bullet.cx = this.cx;
				bullet.cy = this.cy;
			},
		});
		
		class EnemySinBrain {
			constructor(
				public sprite: any,
				public anchor: utils.IVector2D) {
				this.sprite.cx = anchor.x;
				this.sprite.cy = anchor.y;
				this.sprite.step = () => {
					this.step();
				}
			}
			step() {
				var cycle = kimiko.secToFrame( 3 );
				this.sprite.useGravity = false;
				var ty = this.anchor.y + ( Math.sin( this.sprite.age * Math.PI * 2 / cycle) * 32 );
				this.sprite.vy = ty - this.sprite.y;
			}
			
		}
		
		class EnemyBrain {
			minX: number = 0;
			maxX: number = 0;
			/** 移動回数 */
			moveCnt: number = 0;
			waitCnt: number = 0;
			constructor(public sprite: any, public anchor: utils.IVector2D) {
				this.sprite.cx = anchor.x;
				this.sprite.cy = anchor.y;
				this.sprite.step = () => {
					this.step();
				}
				this.minX = this.anchor.x - 64;
				this.maxX = this.anchor.x + 64;
			}
			step() {
				if (!this.sprite.scene.intersectActiveArea(this.sprite)) {
					return;
				}
				if (this.sprite.isDamage() || this.sprite.isDead()) {
					// ダメージ中はなにも出来ない.
					return;
				}
				if (0 < --this.waitCnt) {
					// なにか待ってる.
					return;
				}
				if (!this.sprite.isNeutral()) {
					// そもそもnutralのとき以外はなにもしない..
					return;
				}
				if (Math.abs(this.sprite.vx) < kimiko.secToPx(1)) {
					console.log("vx:" + this.sprite.vx);
					if ((this.moveCnt % 4) === 0) {
						// 攻撃.
						this.sprite.vx = - this.sprite.dirX * kimiko.secToPx(10);
						this.waitCnt = kimiko.secToFrame(1.0);
							
						var bullet = this.sprite.scene.newEnemyBullet();
						bullet.vx = this.sprite.dirX * kimiko.secToPx(80);
						bullet.vy = 0;
						bullet.cx = this.sprite.cx;
						bullet.cy = this.sprite.cy;
					} else {
						this.sprite.vx += this.sprite.dirX * kimiko.secToPx(40);
					}
					++this.moveCnt;
				}
				if (this.sprite.cx < this.minX) {
					this.sprite.dirX = 1;
				}
				if (this.maxX < this.sprite.cx) {
					this.sprite.dirX = -1;
				}
			}
		}
		
		export var Enemy: any = Class.create(Attacker, {
			initialize: function (anchor: utils.IVector2D) {
				Attacker.call(this);
				this.width = 32;
				this.height = 32;
				this.hp = 100;
				this.colorNeutral = DF.ENEMY_COLOR;
				this.colorDamage = DF.ENEMY_DAMAGE_COLOR;
				this.colorAttack = DF.ENEMY_ATTACK_COLOR;
				this.backgroundColor = this.colorNeutral;
				this.anchor = anchor;
				//new EnemySinBrain(this, anchor);
				new EnemyBrain(this, anchor);
			},
		});
	}
	
	export var Act: any = Class.create(Scene, {
		initialize: function () {
			Scene.call(this);
			this.backgroundColor = "rgb(32, 32, 64)";
			var group;
			var sprite;
			
			group = new enchant.Group();
			this.bg = group;
			this.addChild(group);
			
			for (var i: number = 0, iNum: number = 128; i < iNum; ++i) {
				// 背景.
				sprite = new sprites.Sprite(8, 8);
				group.addChild(sprite);
				sprite.backgroundColor = "rgb(64, 64, 32)"
				sprite.x = i * 100;
				sprite.y = DF.GROUND_Y - ((i % 3) * 50);
			}
			
			this.grounds = [];
			/*
			for (var i: number =0, iNum: number = 16; i < iNum; ++i) {
				sprite = new sprites.Ground();
				group.addChild(sprite);
				this.grounds[i] = sprite;
				sprite.x = i * 200;
				sprite.y = DF.GROUND_Y - 32;
			}
			*/
			this.ownBullets = [];
			for (var i: number = 0, iNum: number = 8; i < iNum; ++i) {
				sprite = new sprites.OwnBullet();
				group.addChild(sprite);
				this.ownBullets.push(sprite);
				sprite.visible = false;
			}
			
			this.enemyBullets = [];
			for (var i: number = 0, iNum: number = 16; i < iNum; ++i) {
				sprite = new sprites.EnemyBullet();
				group.addChild(sprite);
				this.enemyBullets.push(sprite);
				sprite.visible = false;
			}
			
			this.enemys = [];
			for (var i: number = 0, iNum: number = 16; i < iNum; ++i) {
				// 敵.
				var anchor: utils.IVector2D = {
					x: 240 + i * 300,
					y: -64,
				};
				sprite = new sprites.Enemy(anchor);
				this.enemys.push(sprite);
				group.addChild(sprite);
			}
			
			sprite = new sprites.Player();
			this.player = sprite;
			group.addChild(sprite);
			sprite.width = 32;
			sprite.height = 32;
			sprite.x = 0;
			sprite.y = 64;
			
			this.labels = [];
			for (var i: number = 0, iNum: number = 3; i < iNum; ++i) {
				sprite = new Label("");
				this.addChild(sprite);
				this.labels.push(sprite);
				sprite.font = DF.FONT_M;
				sprite.color = "#fff";
				sprite.y = 12 * i;
			}
			
			// 操作エリア.
			sprite = new sprites.Sprite(DF.SC2_W, DF.SC2_H);
			this.addChild(sprite);
			this.controllArea = sprite;
			sprite.x = DF.SC2_X1;
			sprite.y = DF.SC2_Y1;
			sprite.backgroundColor = "rgb(64, 64, 64)";
			
			
			this.touch = new utils.Touch();
		},
		
		getNearEnemy: function (sprite, sqrDistanceThreshold) {
			var enemys = this.enemys;
			
			var getSqrDistance = function ( a, b ) {
				var dx = a.cx - b.cx;
				var dy = a.cy - b.cy;
				return (dx * dx) + (dy * dy);
			};
			
			var near = null;
			var nearSqrDistance = 0;
			for (var i = 0, iNum = enemys.length; i < iNum; ++i) {
				var enemy = enemys[i];
				if (enemy.isDead()) {
					continue;
				}
				var sqrDistance = getSqrDistance(sprite, enemy);
				if ( near === null ) {
					near = enemy;
					nearSqrDistance = sqrDistance;
				} else if ( sqrDistance < nearSqrDistance ) {
					near = enemy;
					nearSqrDistance = sqrDistance;
					
				}
			}
			return nearSqrDistance < sqrDistanceThreshold
				? near
				: null;
		},
		
		newEnemyBullet: function () {
			var old = null;
			for (var i = 0, iNum = this.enemyBullets.length; i < iNum; ++i) {
				var bullet = this.enemyBullets[i];
				if (!bullet.visible) {
					bullet.visible = true;
					return bullet;
				}
				old = bullet;
			}
			return bullet;
		},
		newOwnBullet: function () {
			var old = null;
			for (var i = 0, iNum = this.ownBullets.length; i < iNum; ++i) {
				var bullet = this.ownBullets[i];
				if (!bullet.visible) {
					bullet.visible = true;
					return bullet;
				}
				old = bullet;
			}
			return bullet;
		},
		intersectActiveArea: function (sprite) {
			var player = this.player;
			var minX: number = player.cx - DF.SC1_W;
			var maxX: number = player.cx + DF.SC1_W;
			if (minX <= sprite.cx && sprite.cx <= maxX) {
				return true;
			}
			return false;
		},
		ontouchstart: function (event) {
			var touch: utils.Touch = this.touch;
			touch.saveTouchStart(event.x, event.y);
			var player = this.player;
			player.anchorX = player.x;
			player.anchorY = player.y;
			player.useGravity = false;
		},
		ontouchmove: function (event) {
			var touch: utils.Touch = this.touch;
			var diffX = event.x - touch.startX;
			var diffY = event.y - touch.startY
			var player = this.player;
			var playerOldX = player.x;
			var playerOldY = player.y;
			
			var touchElpsedFrame = this.scene.touch.getTouchElpsedFrame();
			touchElpsedFrame = 0;
			if (touchElpsedFrame < kimiko.secToFrame(0.5)) {			
				player.x = player.anchorX + (diffX * 1.0);
				player.y = player.anchorY + (diffY * 1.0);
			}
			
			var dirChangeThreshold = 4;
			if ( dirChangeThreshold <= Math.abs( player.x - playerOldX ) ) {
				player.dirX = kimiko.numberUtil.sign(player.x - playerOldX);
				player.scaleX = player.dirX;
			}
		},
		ontouchend: function (event) {
			var touch: utils.Touch = this.touch;
			touch.saveTouchEnd(event.x, event.y);
			this.labels[0].text = (<any[]>["touch end diff", Math.floor(touch.diffX), Math.floor(touch.diffY)]).join();
			
			var player = this.player;
			//player.vx += NumUtil.trim(touch.diffX * 0.05, -16, 16);
			
			if (Math.abs(touch.diffX) + Math.abs(touch.diffY) < 16) {
				player.attack();
			}
			player.useGravity = true;
		},
		onenterframe: function () {
			var player = this.player;
			//
			if ((player.age % kimiko.secToFrame(0.2)) === 0) {
				var nearEnemy = this.getNearEnemy(player, 64 * 64);
				if ( nearEnemy !== null ) {
					player.attack();
				}
			}
			//
			this.checkCollision();
			// カメラ.
			var tx: number = (DF.SC1_W / 2) - player.cx + (- player.dirX * 16);
			var ty: number = (DF.SC1_H) - (player.y + player.height + 64);
			this.bg.x += (tx - this.bg.x) / 8;
			this.bg.y += (ty - this.bg.y) / 4;
			// 情報.
			this.labels[1].text = player.stateToString() + " fps:" + Math.round(kimiko.core.actualFps);
		},
		
		checkCollision: function () {
			var player = this.player;
			
			// 地形とプレイヤーの衝突判定.
			for (var i = 0, iNum = this.grounds.length; i < iNum; ++i) {
				var ground = this.grounds[i];
				if (!this.intersectActiveArea(ground)) {
					continue;
				}
				if (player.vy < 0) {
					continue;
				}
				if (ground.intersect(player)) {
					player.vy = 0;
					player.y = ground.y - player.height;
					break;
				}
			}
			
			
			// 敵弾とプレイヤーの衝突判定.
			if (true) {
				if (player.isNeutral() || player.isAttack()) {
					for (var i = 0, iNum = this.enemyBullets.length; i < iNum; ++i) {
						var bullet = this.enemyBullets[i];
						if (bullet.visible && player.intersect(bullet)) {
							player.damage(bullet);
							bullet.visible = false;
						}
					}
				}
			} else {
				if (player.isNeutral() || player.isAttack()) {
					sprites.EnemyBullet.collection.forEach((bullet)=>{
						if (bullet.visible && player.intersect(bullet)) {
							player.damage(bullet);
							bullet.visible = false;
						}
					});
				}
			}
			// 敵とプレイヤーの衝突判定.
			this.labels[2].text = "";
			if (true) {
				for (var i = 0, iNum = this.enemys.length; i < iNum; ++i) {
					var enemy = this.enemys[i];
					if (enemy.isDead() || player.isDead() || enemy.isDamage() || player.isDamage()) {
						continue;
					}
					if (player.intersect(enemy)) {
						this.labels[2].text = "hit";
						if (player.isAttack() && enemy.isAttack()) {
							// 両方攻撃してたら、後出しの勝ち.
							if (enemy.attackCnt <= player.attackCnt) {
								enemy.damage(player);
							} else {
								player.damage(enemy);
							}
						} else if (player.isAttack() && !enemy.isDamage()) {
							enemy.damage(player);
						} else if (enemy.isAttack() && !player.isDamage()) {
							player.damage(enemy);
						}
					}
				}
			} else {
				sprites.Enemy.collection.forEach((enemy)=>{
					if (enemy.isDead() || player.isDead() || enemy.isDamage() || player.isDamage()) {
						return;
					}
					if (player.intersect(enemy)) {
						this.labels[2].text = "hit";
						if (player.isAttack() && enemy.isAttack()) {
							// 両方攻撃してたら、後出しの勝ち.
							if (enemy.attackCnt <= player.attackCnt) {
								enemy.damage(player);
							} else {
								player.damage(enemy);
							}
						} else if (player.isAttack() && !enemy.isDamage()) {
							enemy.damage(player);
						} else if (enemy.isAttack() && !player.isDamage()) {
							player.damage(enemy);
						}
					}
				});
			}
			// 敵とプレイヤー弾の衝突判定.
			for (var i = 0, iNum = this.enemys.length; i < iNum; ++i) {
				var enemy = this.enemys[i];
				if (enemy.isDead() || enemy.isDamage()) {
					continue;
				}
				for (var j = 0, jNum = this.ownBullets.length; j < jNum; ++j) {
					var bullet = this.ownBullets[j];
					if (bullet.visible && enemy.intersect(bullet)) {
						enemy.damage(bullet);
						bullet.visible = false;
					}
				}
			}
		},
	});
}

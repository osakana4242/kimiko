
/// <reference path="../kimiko.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.scenes {

	var g_app = jp.osakana4242.kimiko.g_app;

	/**
		 GAME CLEAR!
		SCORE 999
		[SEND] | [RETRY]

		残り時間はスコアに換算する.
		残りライフもスコアに換算する.
	*/
	export var GameClear: any = enchant.Class.create(enchant.Scene, {
		initialize: function () {
			enchant.Scene.call(this);
			
			var scene = this;
			var pd = g_app.playerData;
			//
			scene.fader = new Fader(scene);
			//
			var label1 = (() => {
				var label = new utils.SpriteLabel(g_app.fontS, "CONGRATULATIONS!");
				var ax = (DF.SC1_W - label.width) / 2;
				var ay = 40 + 20 * 0;
				label.x = ax;
				label.y = ay - 8;
				label.opacity = 0;
				label.tl.
					delay(g_app.secToFrame(0.5)).
					show().
					moveTo(ax, ay, g_app.secToFrame(0.2), enchant.Easing.SIN_EASEOUT);
				return label;
			})();

			var label2 = (() => {
				var label = new utils.SpriteLabel(g_app.fontS, "GAME CLEAR!");
				var ax = (DF.SC1_W - label.width) / 2;
				var ay = 40 + 20 * 1;
				label.x = ax;
				label.y = ay - 8;
				label.opacity = 0;
				label.tl.
					delay(g_app.secToFrame(0.7)).
					show().
					moveTo(ax, ay, g_app.secToFrame(0.2), enchant.Easing.SIN_EASEOUT);
				return label;
			})();
			//
			var label3 = (() => {
				var label = new utils.SpriteLabel(g_app.fontS, "SCORE: " + pd.score);
				var ax = (DF.SC1_W - label.width) / 2;
				var ay = 40 + 20 * 3;
				label.x = ax;
				label.y = ay - 8;
				label.opacity = 0;
				label.tl.
					delay(g_app.secToFrame(1.5)).
					show().
					moveTo(ax, ay, g_app.secToFrame(0.2), enchant.Easing.SIN_EASEOUT);
				return label;
			})();
			//
			var label4 = (() => {
				var label = new utils.SpriteLabel(g_app.fontS, "DIFFICULTY: " + g_app.storage.getDifficultyName(g_app.storage.root.userConfig.difficulty));
				var ax = (DF.SC1_W - label.width) / 2;
				var ay = 40 + 20 * 4;
				label.x = ax;
				label.y = ay - 8;
				label.opacity = 0;
				label.tl.
					delay(g_app.secToFrame(2.0)).
					show().
					moveTo(ax, ay, g_app.secToFrame(0.2), enchant.Easing.SIN_EASEOUT);
				return label;
			})();

			var label5 = (() => {
				var label = new utils.SpriteLabel(g_app.fontS, "TOUCH SCREEN");
				var ax = (DF.SC1_W - label.width) / 2;
				var ay = 40 + 20 * 6;
				label.x = ax;
				label.y = ay;
				label.opacity = 0;
				label.tl.
					delay(g_app.secToFrame(3.0)).
					then(() => {
						label.tl.loop().
							show().
							delay(g_app.secToFrame(0.5)).
							hide().
							delay(g_app.secToFrame(0.5));
					});
				return label;
			})();

			var curtainTop = (() => {
				var spr = new enchant.Sprite(DF.SC2_W, 32);
				spr.backgroundColor = "rgb(0,0,0)";
				spr.x = 0;
				spr.y = -32;
				spr.tl.moveTo(0, 0, g_app.secToFrame(0.2));
				return spr;
			})();

			var curtainBottom = (() => {
				var spr = new enchant.Sprite(DF.SC2_W, DF.SC2_H);
				spr.backgroundColor = "rgb(0,0,0)";
				spr.x = 0;
				spr.y = DF.SC_H;
				spr.tl.moveTo(0, DF.SC1_H, g_app.secToFrame(0.2));
				return spr;
			})();

			//
			var layer1 = new enchant.Group();
			layer1.addChild(label1); 
			layer1.addChild(label2); 
			layer1.addChild(label3);
			layer1.addChild(label4);
			layer1.addChild(label5);
			//
			scene.addChild(curtainTop);
			scene.addChild(curtainBottom);
			scene.addChild(layer1);
			//
			scene.tl.
				delay(g_app.secToFrame(3.0)).
				then(() => {
					// TOUCH SCREEN が表示されてから押せるようにする.
					scene.addEventListener(enchant.Event.TOUCH_END, () => {
						if (!scene.fader.isOpend) {
							return;
						}
						g_app.sound.playSe(Assets.SOUND_SE_OK);
						scene.toNext();
					});
				});
		},

		toNext: function () {
			var scene = this;
			scene.fader.fadeOut(g_app.secToFrame(0.1), () => {
				var gameEndMenu = new jp.osakana4242.kimiko.scenes.GameEndMenu();
				gameEndMenu.isFromGameClear = true;
				g_app.core.popScene();
				g_app.core.replaceScene(gameEndMenu);
			});
		},

		onenter: function () {
			g_app.sound.stopBgm();
			var scene = this;
			scene.fader.setBlack(false);
		},
	});

}


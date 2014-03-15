
/// <reference path="../kimiko.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.scenes {

	var g_app = jp.osakana4242.kimiko.g_app;

	export var GameOver: any = enchant.Class.create(enchant.Scene, {
		initialize: function () {
			enchant.Scene.call(this);

			
			var scene = this;
			scene.fader = new Fader(scene);
			//
			this.bg = (() => {
				var spr = new enchant.Sprite(DF.SC_W, DF.SC_H);
				spr.backgroundColor = "#000";
				spr.opacity = 0.5;
				return spr;
			})();

			this.gameOverLabel = (() => {
				var label = new utils.SpriteLabel(g_app.fontS, "GAME OVER");
				var ax = (DF.SC1_W - label.width) / 2;
				var ay = 80;
				label.x = ax;
				label.y = ay;
				label.tl.
					moveTo(ax + 0, ay + 8, g_app.secToFrame(1.0), enchant.Easing.SIN_EASEINOUT).
					moveTo(ax + 0, ay - 8, g_app.secToFrame(1.0), enchant.Easing.SIN_EASEINOUT).
					loop();
				return label;
			})();
			//
			//
			scene.addChild(this.bg); 
			scene.addChild(this.gameOverLabel); 

			scene.addEventListener(enchant.Event.TOUCH_END, () => {
				if (!scene.fader.isOpend) {
					return;
				}
				g_app.sound.playSe(Assets.SOUND_SE_OK);
				scene.toNext();
			});

		},

		toNext: function() {
			var scene = this;
			scene.fader.fadeOut(g_app.secToFrame(0.1), () => {
				var gameEndMenu = new jp.osakana4242.kimiko.scenes.GameEndMenu();
				gameEndMenu.isFromGameClear = false;
				g_app.core.popScene();
				g_app.core.replaceScene(gameEndMenu);
			});
		},

		onenter: function() {
			var scene = this;
			scene.fader.setBlack(false);

			scene.tl.
				delay(g_app.secToFrame(3.0)).
				then(() => {
					scene.toNext();
				});
		},

		onexit: function() {
		},
	});

}


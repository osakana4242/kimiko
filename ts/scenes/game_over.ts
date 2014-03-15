
/// <reference path="../kimiko.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.scenes {

	var g_app = jp.osakana4242.kimiko.g_app;

	export var GameOver: any = enchant.Class.create(enchant.Scene, {
		initialize: function () {
			enchant.Scene.call(this);

			this.fader = new Fader(this);
			
			var scene = this;
			//
			this.layouter = new kimiko.SpriteLayouter(this);
			this.layouter.layout = (() => {
				var list = [
					[ "spriteName", "layoutName", "visible", "delay",  "x",  "y", ],

					[ "retryBtn",   "hide",       false,     0.1 * 0,  80,    140 - 10, ],
					[ "toTitleBtn", "hide",       false,     0.1 * 1,  80,    200 - 10, ],

					[ "retryBtn",   "normal",     true,      0.1 * 0,  80,    140, ],
					[ "toTitleBtn", "normal",     true,      0.1 * 1,  80,    200, ],
				];
				return g_app.labeledValuesToObjects(list);
			})();

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
			this.toTitleBtn = this.layouter.sprites["toTitleBtn"] = (() => {
				var label = new LabeledButton(160, 48, "TO TITLE");
				label.addEventListener(enchant.Event.TOUCH_END, () => {
					g_app.sound.playSe(Assets.SOUND_SE_OK);
					g_app.gameScene.state = g_app.gameScene.stateGameStart;
					g_app.core.replaceScene(new scenes.Title());
				});
				return label;
			})();

			this.retryBtn = this.layouter.sprites["retryBtn"] = (() => {
				var label = new LabeledButton(160, 48, "RETRY");
				label.addEventListener(enchant.Event.TOUCH_END, () => {
					g_app.core.popScene();
				});
				return label;
			})();
			//
			scene.addChild(this.bg); 
			scene.addChild(this.gameOverLabel); 
			scene.addChild(this.toTitleBtn);
			scene.addChild(this.retryBtn);

			this.layouter.transition("hide", false);

		},

		onenter: function() {
			this.tl.
				delay(g_app.secToFrame(0.5)).
				then(() => {
					this.layouter.transition("normal", true);
				});
		},

		onexit: function() {
			this.layouter.transition("hide", false);
		},
	});

}


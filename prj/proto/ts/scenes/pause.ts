
/// <reference path="../kimiko.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.scenes {

	var g_app = jp.osakana4242.kimiko.g_app;

	export var Pause: any = enchant.Class.create(enchant.Scene, {
		initialize: function () {
			enchant.Scene.call(this);
			
			var scene = this;
			//
			this.layouter = new kimiko.SpriteLayouter(this);
			this.layouter.layout = (() => {
				var list = [
					[ "spriteName", "layoutName", "visible", "delay",  "x",  "y", ],

					[ "resumeBtn",  "hide",       false,     0.1 * 0,  80,    100 - 10, ],
					[ "toTitleBtn", "hide",       false,     0.1 * 1,  80,    160 - 10, ],

					[ "resumeBtn",  "normal",     true,      0.1 * 0,  80,    100, ],
					[ "toTitleBtn", "normal",     true,      0.1 * 1,  80,    160, ],
				];
				return g_app.labeledValuesToObjects(list);
			})();
			//
			var bg = (() => {
				var spr = new enchant.Sprite(DF.SC_W, DF.SC_H);
				spr.backgroundColor = "#000";
				spr.opacity = 0.5;
				return spr;
			})();

			var pauseLabel = (() => {
				var label = new utils.SpriteLabel(g_app.fontS, "PAUSE");
				label.x = (DF.SC_W - label.width) / 2;
				label.y = 60;
				label.tl.
					moveBy(0, -8, g_app.secToFrame(1.0), enchant.Easing.SIN_EASEINOUT).
					moveBy(0,  8, g_app.secToFrame(1.0), enchant.Easing.SIN_EASEINOUT).
					loop();
				return label;
			})();
			//
			var toTitleBtn = this.layouter.sprites["toTitleBtn"] = (() => {
				var label = new LabeledButton(160, 48, "TO TITLE");
				label.addEventListener(enchant.Event.TOUCH_END, () => {
					g_app.sound.playSe(Assets.SOUND_SE_OK);
					g_app.gameScene.state = g_app.gameScene.stateGameStart;
					g_app.core.replaceScene(new scenes.Title());
				});
				return label;
			})();

			var resumeBtn = this.layouter.sprites["resumeBtn"] = (() => {
				var label = new LabeledButton(160, 48, "RESUME");
				label.addEventListener(enchant.Event.TOUCH_END, () => {
					g_app.core.popScene();
				});
				return label;
			})();

			scene.addChild(bg);
			scene.addChild(pauseLabel); 
			scene.addChild(toTitleBtn); 
			scene.addChild(resumeBtn);

			this.layouter.transition("hide", false);
		},

		onenter: function() {
			this.layouter.transition("normal", true);
		},

		onexit: function() {
			this.layouter.transition("hide", false);
		},
	});

}


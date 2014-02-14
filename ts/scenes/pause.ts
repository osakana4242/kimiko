
/// <reference path="../kimiko.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.scenes {

	var app = jp.osakana4242.kimiko.app;

	export var Pause: any = enchant.Class.create(enchant.Scene, {
		initialize: function () {
			enchant.Scene.call(this);
			
			var scene = this;
			//
			var bg = (() => {
				var spr = new enchant.Sprite(DF.SC_W, DF.SC_H);
				spr.backgroundColor = "#000";
				spr.opacity = 0.5;
				return spr;
			})();

			var label1 = (() => {
				var label = new enchant.Label("PAUSE");
				label.font = DF.FONT_M;
				label.width = DF.SC_W;
				label.height = 12;
				label.color = "rgb(255, 255, 255)";
				label.textAlign = "center";
				label.x = 0;
				label.y = 60;
				label.tl.
					moveBy(0, -8, app.secToFrame(1.0), enchant.Easing.SIN_EASEINOUT).
					moveBy(0,  8, app.secToFrame(1.0), enchant.Easing.SIN_EASEINOUT).
					loop();
				return label;
			})();
			//
			var label2 = (() => {
				var label = new enchant.Label("GOTO TITLE");
				label.font = DF.FONT_M;
				label.width = DF.SC_W / 2;
				label.height = 48;
				label.backgroundColor = "#444";
				label.color = "#ff0";
				label.textAlign = "center";
				label.x = (DF.SC_W - label.width) / 2;
				label.y = 90;
				label.addEventListener(enchant.Event.TOUCH_END, () => {
					app.gameScene.state = app.gameScene.stateGameStart;
					app.core.replaceScene(new scenes.Title());
				});
				return label;
			})();

			var label3 = (() => {
				var label = new enchant.Label("CONTINUE");
				label.font = DF.FONT_M;
				label.width = DF.SC_W / 2;
				label.height = 48;
				label.backgroundColor = "#444";
				label.color = "#ff0";
				label.textAlign = "center";
				label.x = (DF.SC_W - label.width) / 2;
				label.y = 180;
				label.addEventListener(enchant.Event.TOUCH_END, () => {
					app.core.popScene();
				});
				return label;
			})();

			scene.addChild(bg);
			scene.addChild(label1); 
			scene.addChild(label2); 
			scene.addChild(label3);
		}
	});

}


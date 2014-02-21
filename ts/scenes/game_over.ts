
/// <reference path="../kimiko.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.scenes {

	var g_app = jp.osakana4242.kimiko.g_app;

	export var GameOver: any = enchant.Class.create(enchant.Scene, {
		initialize: function () {
			enchant.Scene.call(this);
			
			var scene = this;
			//
			var label1 = new enchant.Label("GAME OVER");
			((label: any) => {
				label.font = DF.FONT_M;
				label.width = DF.SC_W;
				label.height = 12;
				label.color = "rgb(255, 255, 255)";
				label.textAlign = "center";
				var ax = (DF.SC1_W - label.width) / 2;
				var ay = (DF.SC1_H - label.height) / 2;
				label.x = ax;
				label.y = ay;
				label.tl.
					moveTo(ax + 0, ay + 8, g_app.secToFrame(1.0), enchant.Easing.SIN_EASEINOUT).
					moveTo(ax + 0, ay - 8, g_app.secToFrame(1.0), enchant.Easing.SIN_EASEINOUT).
					loop();
			})(label1);
			//
			var layer1 = new enchant.Group();
			layer1.addChild(label1); 
			//
			scene.addChild(layer1);
			//
			scene.addEventListener(enchant.Event.TOUCH_END, () => {
				g_app.core.popScene();
			});
		}
	});

}


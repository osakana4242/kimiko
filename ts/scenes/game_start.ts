
/// <reference path="../kimiko.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.scenes {

	var g_app = jp.osakana4242.kimiko.g_app;

	export var GameStart: any = enchant.Class.create(enchant.Scene, {
		initialize: function () {
			enchant.Scene.call(this);
			
			var scene = this;
			//
			var bg1 = new enchant.Sprite(DF.SC1_W, DF.SC1_H);
			((sprite: any) => {
				sprite.x = 0;
				sprite.y = 0;
				sprite.image = g_app.core.assets[Assets.IMAGE_GAME_START_BG];
			})(bg1);
			//
			var label1 = new utils.SpriteLabel(g_app.fontS, "GOOD NIGHT...");
			((label: any) => {
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
			var fader = new Fader(this);
			//
			var layer1 = new enchant.Group();
			layer1.addChild(bg1);
			layer1.addChild(label1); 
			//
			scene.backgroundColor = "rgb(0, 0, 0)";
			scene.addChild(layer1);
			(() => {
				var next = () => {
					fader.fadeOut2(g_app.secToFrame(1.0), new utils.Vector2D(242, 156), () => {
						g_app.core.replaceScene(g_app.gameScene);
					});
				};
				fader.setBlack(true);
				scene.tl.
					then(() => { fader.fadeIn(g_app.secToFrame(0.5)); }).
					delay(g_app.secToFrame(0.5)).
					delay(g_app.secToFrame(2.0)).
					then(next);
					scene.addEventListener(enchant.Event.TOUCH_END, next);
					scene.addEventListener(enchant.Event.A_BUTTON_UP, next);
			})();
		},

	});
}


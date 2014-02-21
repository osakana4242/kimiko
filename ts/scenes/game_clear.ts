
/// <reference path="../kimiko.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.scenes {

	var g_app = jp.osakana4242.kimiko.g_app;

	/**
		 GAME CLEAR!
		REST TIME 999
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
			var label1 = new enchant.Label("GAME CLEAR!");
			((label: any) => {
				label.font = DF.FONT_M;
				label.width = DF.SC_W;
				label.height = 12;
				label.color = "rgb(255, 255, 255)";
				label.textAlign = "center";
				var ax = (DF.SC1_W - label.width) / 2;
				var ay = 32 + 24 * 1;
				label.x = ax;
				label.y = ay - 8;
				label.tl.
					hide().
					delay(g_app.secToFrame(0.5)).
					show().
					moveTo(ax, ay, g_app.secToFrame(0.5), enchant.Easing.SIN_EASEOUT);
			})(label1);
			//
			var label2 = new enchant.Label("REST TIME " + Math.floor(g_app.frameToSec(pd.restTimeCounter)));
			((label: any) => {
				label.font = DF.FONT_M;
				label.width = DF.SC_W;
				label.height = 12;
				label.color = "rgb(255, 255, 255)";
				label.textAlign = "center";
				var ax = (DF.SC1_W - label.width) / 2;
				var ay = 32 + 24 * 2;
				label.x = ax;
				label.y = ay - 8;
				label.tl.
					hide().
					delay(g_app.secToFrame(1.0)).
					show().
					moveTo(ax, ay, g_app.secToFrame(0.5), enchant.Easing.SIN_EASEOUT);
			})(label2);

			var label3 = new enchant.Label("SCORE " + pd.score);
			((label: any) => {
				label.font = DF.FONT_M;
				label.width = DF.SC_W;
				label.height = 12;
				label.color = "rgb(255, 255, 255)";
				label.textAlign = "center";
				var ax = (DF.SC1_W - label.width) / 2;
				var ay = 32 + 24 * 3;
				label.x = ax;
				label.y = ay - 8;
				label.tl.
					hide().
					delay(g_app.secToFrame(1.5)).
					show().
					moveTo(ax, ay, g_app.secToFrame(0.5), enchant.Easing.SIN_EASEOUT);
			})(label3);

			//
			var layer1 = new enchant.Group();
			layer1.addChild(label1); 
			layer1.addChild(label2);
			layer1.addChild(label3);
			//
			scene.addChild(layer1);
			//
			scene.tl.
				delay(g_app.secToFrame(3.0)).
				waitUntil(() => {
					if (pd.restTimeCounter < g_app.secToFrame(1)) {
						return true;
					}
					pd.restTimeCounter -= g_app.secToFrame(1);
					pd.score += Math.floor(10);
					label2.text = "REST TIME " + Math.floor(g_app.frameToSec(pd.restTimeCounter));
					label3.text = "SCORE " + pd.score;
					return false;
				});
			//
			scene.addEventListener(enchant.Event.TOUCH_END, () => {
				g_app.core.popScene();
				g_app.core.replaceScene(new jp.osakana4242.kimiko.scenes.Title());
			});
		}
	});

}


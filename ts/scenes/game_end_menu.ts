
/// <reference path="../kimiko.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.scenes {

	var g_app = jp.osakana4242.kimiko.g_app;

	export var GameEndMenu: any = enchant.Class.create(enchant.Scene, {
		initialize: function () {
			enchant.Scene.call(this);

			
			var scene = this;
			//
			scene.fader = new Fader(scene);
			//
			this.layouter = new kimiko.SpriteLayouter(this);
			this.layouter.layout = (() => {
				var list = [
					[ "spriteName", "layoutName", "visible", "delay",  "x",  "y", ],

					[ "scoreLabel",        "hide",       false,     0.1 * 0,  160,   40 - 10, ],
					[ "toSendResultBtn",   "hide",       false,     0.1 * 1,  80,    80 - 10, ],
					[ "retryBtn",          "hide",       false,     0.1 * 2,  80,    160 - 10, ],
					[ "toTitleBtn",        "hide",       false,     0.1 * 3,  80,    220 - 10, ],

					[ "scoreLabel",        "normal",     true,      0.1 * 0,  160,   40, ],
					[ "toSendResultBtn",   "normal",     true,      0.1 * 1,  80,    80, ],
					[ "retryBtn",          "normal",     true,      0.1 * 2,  80,    160, ],
					[ "toTitleBtn",        "normal",     true,      0.1 * 3,  80,    220, ],
				];
				return g_app.labeledValuesToObjects(list);
			})();

			this.bg = (() => {
				var spr = new enchant.Sprite(DF.SC_W, DF.SC_H);
				spr.backgroundColor = "#000";
				return spr;
			})();

			this.scoreLabel = this.layouter.sprites["scoreLabel"] = (() => {
				var group = new enchant.Group();
				var label = new utils.SpriteLabel(g_app.fontS, "SCORE: " + g_app.playerData.score);
				label.x = - label.width * 0.5;
				group.addChild(label);
				return group;
			})();

			this.toTitleBtn = this.layouter.sprites["toTitleBtn"] = (() => {
				var label = new LabeledButton(160, 48, "TO TITLE");
				label.addEventListener(enchant.Event.TOUCH_END, () => {
					g_app.sound.playSe(Assets.SOUND_SE_OK);
					scene.fader.fadeOut(g_app.secToFrame(0.1), () => {
						g_app.gameScene.state = g_app.gameScene.stateGameStart;
						g_app.core.replaceScene(new scenes.Title());
					});
				});
				return label;
			})();

			this.retryBtn = this.layouter.sprites["retryBtn"] = (() => {
				var label = new LabeledButton(160, 48, "RETRY");
				label.addEventListener(enchant.Event.TOUCH_END, () => {
					g_app.sound.playSe(Assets.SOUND_SE_OK);

					g_app.gameScene.state = g_app.gameScene.stateGameStart;
					if (this.isFromGameClear) {
						// from GameClear
						// 最初のステージから.
						var pd = g_app.playerData;
						pd.reset();
						//
						scene.fader.fadeOut(g_app.secToFrame(0.3), () => {
							g_app.core.replaceScene(new scenes.GameStart());
						});
					} else {
						// from GameOver
						// ゲームオーバーになったステージから.
						var pd = g_app.playerData;
						var mapId = pd.mapId;
						pd.reset();
						pd.mapId = mapId;
						//
						scene.fader.fadeOut(g_app.secToFrame(0.1), () => {
							g_app.core.replaceScene(g_app.gameScene);
						});
					}
				});
				return label;
			})();

			this.toSendResultBtn = this.layouter.sprites["toSendResultBtn"] = (() => {
				var label = new LabeledButton(160, 48, "SEND RESULT !");
				label.addEventListener(enchant.Event.TOUCH_END, () => {
					g_app.sound.playSe(Assets.SOUND_SE_OK);
					scene.fader.fadeOut(g_app.secToFrame(0.1), () => {
						g_app.core.replaceScene(new scenes.SendResult());
					});
				});
				return label;
			})();
			//
			scene.addChild(this.bg); 
			scene.addChild(this.scoreLabel);
			scene.addChild(this.toSendResultBtn);
			scene.addChild(this.retryBtn);
			scene.addChild(this.toTitleBtn);

			this.layouter.transition("hide", false);

			this.isFromGameClear = false;

		},

		onenter: function() {
			g_app.sound.stopBgm();
			this.fader.setBlack(true);
			this.fader.fadeIn(g_app.secToFrame(0.1));
			this.layouter.transition("normal", true);
		},

		onexit: function() {
			this.layouter.transition("hide", false);
		},

	});

}


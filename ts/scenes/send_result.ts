
/// <reference path="../kimiko.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.scenes {

	var g_app = jp.osakana4242.kimiko.g_app;

	/** 結果送信画面 */
	export var SendResult: any = enchant.Class.create(enchant.Scene, {
		initialize: function () {
			enchant.Scene.call(this);

			var scene = this;
			//
			scene.fader = new Fader(scene);
			//
			this.bg = (() => {
				var spr = new enchant.Sprite(DF.SC_W, DF.SC_H);
				spr.image = g_app.core.assets[Assets.IMAGE_COMMON_BG];
				return spr;
			})();

			this.workingIcon = (() => {
				var ptns = [
					"[-     ]",
					"[*-    ]",
					"[-*>   ]",
//					"[ -*>  ]",
					"[  -*> ]",
//					"[   -*>]",
					"[    -*]",
					"[     -]",
				];
				var spr = new utils.SpriteLabel(g_app.fontS, ptns[0]);
				var ax = (DF.SC1_W - spr.width) / 2;
				var ay = 140;
				spr.x = ax;
				spr.y = ay;
				spr.addEventListener(enchant.Event.ENTER_FRAME, function () {
					var ptnIdx = Math.floor(spr.age / g_app.secToFrame(0.1)) % ptns.length;
					spr.text = ptns[ptnIdx];
				});
				return spr;
			})();

			this.workingLabel = (() => {
				var label = new utils.SpriteLabel(g_app.fontS, "SENDING..");
				var ax = (DF.SC1_W - label.width) / 2;
				var ay = 160;
				label.x = ax;
				label.y = ay;
				return label;
			})();

			this.scoreLabel = (() => {
				var label = new utils.SpriteLabel(g_app.fontS, "SCORE: " + g_app.playerData.score);
				var ax = (DF.SC1_W - label.width) / 2;
				var ay = 200;
				label.x = ax;
				label.y = ay;
				return label;
			})();

			//
			scene.addChild(this.bg); 
			scene.addChild(this.workingIcon); 
			scene.addChild(this.workingLabel); 
			scene.addChild(this.scoreLabel); 
		},

		onenter: function() {
			var scene = this;
			scene.fader.fadeIn(g_app.secToFrame(0.1));
			scene.tl.
				delay(g_app.secToFrame(1.0)).
				then(() => {
					var pd = g_app.playerData;
					this.sendScoreToNineLeap(pd.score, pd.resultText);
				});
		},

		onexit: function() {
		},

		/** 結果送信処理. */
		sendScoreToNineLeap: function(score, result) {
			try {
				if (location.hostname != 'r.jsgames.jp') {
					// Do nothing.
					this.tl.delay(g_app.secToFrame(3.0)).
						then(() => {
							g_app.core.replaceScene(new scenes.Title());
						});
				} else {
					var id = location.pathname.match(/^\/games\/(\d+)/)[1]; 
					location.replace([
						'http://9leap.net/games/', id, '/result',
						'?score=', encodeURIComponent(score),
						'&result=', encodeURIComponent(result)
					].join(''));
				}
			} catch (ex) {
				console.log("ex: " + ex);
				this.workingIcon.visible = false;
				this.workingLabel.text = "ERROR..";
				this.workingLabel.x = (DF.SC1_W - this.workingLabel.textWidth) * 0.5;
			}
		},
	});

}


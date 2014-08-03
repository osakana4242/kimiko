
/// <reference path="../kimiko.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.scenes {
	
	var g_app = jp.osakana4242.kimiko.g_app;
	var DF = jp.osakana4242.kimiko.DF;

	export var Title: any = enchant.Class.create(enchant.Scene, {
		initialize: function () {
			enchant.Scene.call(this);
			
			g_app.sound.stopBgm();

			var scene = this;
			var mapIds = [];

			if (g_app.config.isTestMapEnabled) {
			for (var key in DF.MAP_OPTIONS) {
					mapIds.push(parseInt(key));
				}
			} else {
				for (var key in g_app.storage.root.userMaps) {
					if ( DF.MAP_OPTIONS[key]) {
						mapIds.push(parseInt(key));
					}
				}
			}

			var mapIdsIdx = 0;
			
			//
			var title = (() => {
				var spr = new utils.SpriteLabel(g_app.fontS, "KIMIKO'S NIGHTMARE");
				spr.x = (DF.SC_W- spr.width) / 2;
				spr.y = 30;
				return spr;
			})();

			var player = (() => {
				var spr = new enchant.Sprite();
				spr.anim.sequence = g_app.getAnimFrames(DF.ANIM_ID_CHARA001_WALK);
				spr.center.x = DF.SC_W / 2;
				spr.y = 256;
				var ax = spr.x;
				var ay = spr.y;
				spr.addEventListener(enchant.Event.TOUCH_END, function () {
					if (0 < spr.tl.queue.length) {
						// 演出終わってないのでカエル.
						return;
					}
					spr.tl.
						clear().
						moveTo(ax, ay - 32, g_app.secToFrame(0.1), enchant.Easing.CUBIC_EASEOUT).
						moveTo(ax, ay,      g_app.secToFrame(0.1), enchant.Easing.CUBIC_EASEIN);
				});
				return spr;
			})();
		
			var author = (() => {
				var spr = new utils.SpriteLabel(g_app.fontS, "created by @osakana4242");
				spr.x = (DF.SC_W - spr.width) / 2;
				spr.y = 300;
				return spr;
			})();

			var mapLabel = (() => {
				var spr = new utils.SpriteLabel(g_app.fontS, "");
				spr.width = 160;
				spr.textAlign = "center";
				spr.x = 0;
				spr.y = 70;
				return spr;
			})();
			
			var mapLabel2 = (() => {
				var spr = new utils.SpriteLabel(g_app.fontS, "");
				spr.width = 160;
				spr.textAlign = "center";
				spr.x = 0;
				spr.y = 94;
				return spr;
			})();

			function getMapTitle(mapId: number) {
				return "STAGE " + Math.floor(mapId / 100) + "-" + (mapId % 100);
			}

			function updateMapLabel() {
				var mapId = mapIds[mapIdsIdx];
				mapLabel2.text = getMapTitle(mapId);
				// mapLabel.text = DF.MAP_OPTIONS[mapId].title;

				mapLabel.x = (DF.SC_W - mapLabel.width) / 2;
				mapLabel2.x = (DF.SC_W - mapLabel2.width) / 2;
			}
			updateMapLabel();

			var leftBtn = (() => {
				var spr = new LabeledButton(48, 48, "<");
				spr.x = 4;
				spr.y = 80;
				spr.addEventListener(enchant.Event.TOUCH_END, prevMap);
				return spr;
			})();

			var rightBtn = (() => {
				var spr = new LabeledButton(48, 48, ">");
				spr.x = 320 - spr.width - 4;
				spr.y = 80;
				spr.addEventListener(enchant.Event.TOUCH_END, nextMap);
				return spr;
			})();
		
			var startBtn = (() => {
				var spr = new LabeledButton(160, 48, "START");
				spr.x = (DF.SC_W - spr.width) / 2;
				spr.y = 140;
				spr.addEventListener(enchant.Event.TOUCH_END, gotoGameStart);
				return spr;
			})();

			var configBtn = (() => {
				var spr = new LabeledButton(160, 48, "CONFIG");
				spr.x = (DF.SC_W - spr.width) / 2;
				spr.y = 200;
				spr.addEventListener(enchant.Event.TOUCH_END, gotoConfig);
				return spr;
			})();

			//
			scene.backgroundColor = "rgb( 16, 16, 16)";
			scene.addChild(player);
			scene.addChild(title);
			scene.addChild(author);
			scene.addChild(mapLabel);
			scene.addChild(mapLabel2);
			scene.addChild(leftBtn);
			scene.addChild(rightBtn);
			scene.addChild(startBtn);
			scene.addChild(configBtn);
			g_app.addTestHudTo(this);
			//
			scene.addEventListener(enchant.Event.A_BUTTON_UP, gotoGameStart);
			scene.addEventListener(enchant.Event.LEFT_BUTTON_UP, prevMap);
			scene.addEventListener(enchant.Event.RIGHT_BUTTON_UP, nextMap);
	
			//
			var fader = new Fader(this);
			fader.setBlack(true);
			fader.fadeIn(g_app.secToFrame(0.2));
	
			function nextMap() {
				g_app.sound.playSe(Assets.SOUND_SE_CURSOR);
				mapIdsIdx = (mapIdsIdx + mapIds.length + 1) % mapIds.length;
				updateMapLabel();
			}

			function prevMap() {
				g_app.sound.playSe(Assets.SOUND_SE_CURSOR);
				mapIdsIdx = (mapIdsIdx + mapIds.length - 1) % mapIds.length;
				updateMapLabel();
			}

			function gotoConfig() {
				g_app.sound.playSe(Assets.SOUND_SE_OK);
				fader.fadeOut(g_app.secToFrame(0.1), () => {
					g_app.core.replaceScene(new scenes.Config());
				});
			};

			function gotoGameStart() {
				scene.touchEnabled = true;
				g_app.sound.playSe(Assets.SOUND_SE_OK);
				var pd = g_app.playerData;
				pd.reset();
				pd.mapId = mapIds[mapIdsIdx];
				fader.fadeOut(g_app.secToFrame(0.3), () => {
					g_app.core.replaceScene(new scenes.GameStart());
				});
			};

			mapLabel.visible = 2 <= mapIds.length;
			mapLabel2.visible = 2 <= mapIds.length;
			leftBtn.visible = 2 <= mapIds.length;
			rightBtn.visible = 2 <= mapIds.length;
		},

		onenter: function () {
			this.touchEnabled = true;
		},
	});
}


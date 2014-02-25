
/// <reference path="../kimiko.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.scenes {
	
	var g_app = jp.osakana4242.kimiko.g_app;
	var DF = jp.osakana4242.kimiko.DF;

	export var Config: any = enchant.Class.create(enchant.Scene, {
		initialize: function () {
			enchant.Scene.call(this);
			
			g_app.sound.stopBgm();

			var scene = this;

			var btnHeight = 48;
			var margin = 4;
			var itemSelectedIdx = 0;

			var userConfig = g_app.storage.root.userConfig;

			var difficulties = {
				"1": "EASY",
				"2": "MEDIUM",
			};

			var layouter = new kimiko.SpriteLayouter(this);

			var itemDataList = [
				{
					"title": "DIFFICULTY",
					"func": (item: any, diff: number) => {
						userConfig.difficulty = g_app.numberUtil.trim(userConfig.difficulty + diff, 1, 2);
						item.valueLabel.text = difficulties[userConfig.difficulty];
					},
				},
				{
					"title": "BGM",
					"func": (item: any, diff: number) => {
						if (diff !== 0) {
							userConfig.isBgmEnabled = !userConfig.isBgmEnabled;
							g_app.sound.setBgmEnabled(userConfig.isBgmEnabled);
							g_app.sound.playBgm(Assets.SOUND_BGM, false);
						}
						item.valueLabel.text = userConfig.isBgmEnabled ? "ON" : "OFF";
					},
				},
				{
					"title": "SE",
					"func": (item: any, diff: number) => {
						if (diff !== 0) {
							userConfig.isSeEnabled = !userConfig.isSeEnabled;
							g_app.sound.setSeEnabled(userConfig.isSeEnabled);
						}
						item.valueLabel.text = userConfig.isSeEnabled ? "ON" : "OFF";
					},
				},
				{
					"title": "UI LAYOUT",
					"func": (item: any, diff: number) => {
						if (diff !== 0) {
							layouter.transition("none", true);
							userConfig.isUiRight = !userConfig.isUiRight;
							g_app.addTestHudTo(scene);
						}
						item.valueLabel.text = userConfig.isUiRight ? "RIGHTY": "LEFTY";
						layouter.transition("none", false);
						layouter.transition("right", true);
					},
				},
				{
					"title": "FPS",
					"func": (item: any, diff: number) => {
						userConfig.fps = g_app.numberUtil.trim(userConfig.fps + (diff * 20), 20, 60);
						item.valueLabel.text = userConfig.fps;
					},
				},
				{
					"title": "FPS VISIBLE",
					"func": (item: any, diff: number) => {
						if (diff !== 0) {
							userConfig.isFpsVisible = !userConfig.isFpsVisible;
							g_app.addTestHudTo(scene);
						}
						item.valueLabel.text = userConfig.isFpsVisible ? "ON": "OFF";
					},
				},
			];

			var items: Array<{
				titleLabel: any;
				valueLabel: any;
				itemData: any;
			}> = [];

			for (var i = 0, iNum = itemDataList.length; i < iNum; ++i) {
				var itemData = itemDataList[i];
				var isAdd = true;
				switch (itemData.title) {
				case "BGM":
				case "SE":
					if (!g_app.env.isSoundEnabled) {
						isAdd = false;
					}
					break;
				}
				if (isAdd) {
					addItem(itemData.title, itemData);
				}
			}

			function addItem(title: string, itemData: any) {
				var idx = items.length;
				var tmpY = 36 * idx;
				var item = {
					"titleLabel": (() => {
						var spr = new utils.SpriteLabel(g_app.fontS, title);
						spr.x = 0;
						spr.y = tmpY;
						spr.touchEnabled = false;
						return spr;
					})(),

					"valueLabel": (() => {
						var spr = new utils.SpriteLabel(g_app.fontS, "");
						spr.x = 24;
						spr.y = tmpY + spr.font.lineHeight;
						spr.touchEnabled = false;
						return spr;
					})(),

					"itemData": itemData,
				};
				items.push(item);
				return item;
			}

			layouter.layout = (() => {
				var list = [
					[ "spriteName", "layoutName", "visible", "delay",  "x",  "y", ],

					[ "titleLabel", "none",       false,     0.05 * 0, 124,         -52, ],
					[ "backBtn",    "none",       false,     0.05 * 0, 320,  4 + 52 * 0, ],
					[ "upBtn",      "none",       false,     0.05 * 1, 320,  4 + 52 * 1, ],
					[ "downBtn",    "none",       false,     0.05 * 2, 320,  4 + 52 * 2, ],
					[ "leftBtn",    "none",       false,     0.05 * 3, 320,  4 + 52 * 3, ],
					[ "rightBtn",   "none",       false,     0.05 * 4, 320,  4 + 52 * 4, ],

					[ "titleLabel", "right",      true,      0.05 * 0, 124,           4, ],
					[ "backBtn",    "right",      true,      0.05 * 0, 268,  4 + 52 * 0, ],
					[ "upBtn",      "right",      true,      0.05 * 1, 268,  4 + 52 * 1, ],
					[ "downBtn",    "right",      true,      0.05 * 2, 268,  4 + 52 * 2, ],
					[ "leftBtn",    "right",      true,      0.05 * 3, 268,  4 + 52 * 3, ],
					[ "rightBtn",   "right",      true,      0.05 * 4, 268,  4 + 52 * 4, ],
				];
				return g_app.labeledValuesToObjects(list);
			})();

			layouter.sprites["titleLabel"] = (() => {
				var spr = new utils.SpriteLabel(g_app.fontS, "CONFIG");
				return spr;
			})();

			layouter.sprites["backBtn"] = (() => {
				var spr = new LabeledButton(48, 48, "X");
				spr.addEventListener(enchant.Event.TOUCH_END, gotoTitle);
				return spr;
			})();

			layouter.sprites["upBtn"] = (() => {
				var spr = new LabeledButton(48, 48, "^");
				spr.addEventListener(enchant.Event.TOUCH_END, () => { onButtonEvent("up"); });
				return spr;
			})();

			layouter.sprites["downBtn"] = (() => {
				var spr = new LabeledButton(48, 48, "v");
				spr.addEventListener(enchant.Event.TOUCH_END, () => { onButtonEvent("down"); });
				return spr;
			})();

			layouter.sprites["leftBtn"] = (() => {
				var spr = new LabeledButton(48, 48, "<");
				spr.addEventListener(enchant.Event.TOUCH_END, () => { onButtonEvent("left"); });
				return spr;
			})();

			layouter.sprites["rightBtn"] = (() => {
				var spr = new LabeledButton(48, 48, ">");
				spr.addEventListener(enchant.Event.TOUCH_END, () => { onButtonEvent("right"); });
				return spr;
			})();

			var cursor = (() => {
				var spr = new utils.SpriteLabel(g_app.fontS, " ");
				spr.x = 0;
				spr.y = 0;
				var ptns = [
					"v",
					"-",
					"^",
					"-",
				];
				spr.onenterframe = function () {
					var ptnIdx = Math.floor(spr.age / g_app.secToFrame(0.2)) % ptns.length;
					spr.text = ptns[ptnIdx];
				};
				return spr;
			})();

			//
			scene.backgroundColor = "rgb( 128, 128, 32)";
			//
			var menuGroup = new enchant.Group();
			menuGroup.x = 80;
			menuGroup.y = 36;

			for (var i = 0, iNum = items.length; i < iNum; ++i) {
				var item = items[i];
				menuGroup.addChild(item.titleLabel);
				menuGroup.addChild(item.valueLabel);
			}
			menuGroup.addChild(cursor);
			//
			scene.addChild(menuGroup);
			for (var key in layouter.sprites) {
				scene.addChild(layouter.sprites[key]);
			}

			g_app.addTestHudTo(this);

			layouter.transition("none", false);
	
			//
			var fader = new Fader(this);
			fader.setBlack(true);
			fader.fadeIn(g_app.secToFrame(0.1));

			var oldUserConfig = {};
			for (var key in userConfig) {
				oldUserConfig[key] = userConfig[key];
			}

			// 値の更新.
			for (var i = items.length - 1; 0 <= i; --i) {
				var item = items[i];
				item.itemData.func(item, 0);
			}
		
			function updateCursorPosition() {
				var item = items[itemSelectedIdx];
				cursor.x = item.titleLabel.x - (cursor.width + 6);
				cursor.y = item.titleLabel.y;
			}

			function onButtonEvent(eventName: string) {
				switch(eventName) {
				case "up":
				case "down":
					var diff = (eventName === "up") ? -1 : 1;
					itemSelectedIdx = g_app.numberUtil.trim(itemSelectedIdx + diff, 0, items.length - 1);
					g_app.sound.playSe(Assets.SOUND_SE_CURSOR);
					updateCursorPosition();
					break;
				case "left":
				case "right":
					var diff = (eventName === "left") ? -1 : 1;
					items[itemSelectedIdx].itemData.func(items[itemSelectedIdx], diff);
					g_app.sound.playSe(Assets.SOUND_SE_CURSOR);
					break;
				}
			}

			updateCursorPosition();

			function gotoTitle() {
				g_app.sound.playSe(Assets.SOUND_SE_OK);
				g_app.storage.save();

				var isReload = false;
				for (var key in userConfig) {
					switch (key) {
					case "fps":
						if (userConfig[key] !== oldUserConfig[key]) {
							isReload = true;
						}
					}
				}

				layouter.transition("none", true);

				if (isReload) {
					fader.fadeOut(g_app.secToFrame(1.0), () => {
						window.location.reload();
					});
				} else {
					fader.fadeOut(g_app.secToFrame(0.1), () => {
						g_app.core.replaceScene(new scenes.Title());
					});
				}
			};

		},
	});
}


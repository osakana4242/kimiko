
/// <reference path="../kimiko.ts" />

module jp.osakana4242.kimiko.scenes {
	
	var g_app = jp.osakana4242.kimiko.g_app;
	var DF = jp.osakana4242.kimiko.DF;

	export var Config: any = cc.Scene.extend( {
		ctor: function () {
			this._super();
			
			g_app.sound.stopBgm();

			var scene = this;

			var scdSize = oskn.conf.scdSize;
			
			var aaa = this.aaa = new oskn.AspectAnchorAdjuster();
			aaa.addToScene( this );

			var btnHeight = 48;
			var margin = 4;
			var itemSelectedIdx = 0;

			var userConfig = g_app.storage.root.userConfig;

			var layouter = new kimiko.SpriteLayouter(this);

			var itemDataList = [
				{
					"title": "DIFFICULTY",
					"func": (item: any, diff: number) => {
						userConfig.difficulty = g_app.numberUtil.trim(userConfig.difficulty + diff, 1, 2);
						item.valueLabel.setString(g_app.storage.getDifficultyName(userConfig.difficulty));
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
						item.valueLabel.setString(userConfig.isBgmEnabled ? "ON" : "OFF");
					},
				},
				{
					"title": "SE",
					"func": (item: any, diff: number) => {
						if (diff !== 0) {
							userConfig.isSeEnabled = !userConfig.isSeEnabled;
							g_app.sound.setSeEnabled(userConfig.isSeEnabled);
						}
						item.valueLabel.setString(userConfig.isSeEnabled ? "ON" : "OFF");
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
						item.valueLabel.setString(userConfig.isUiRight ? "RIGHTY": "LEFTY");
						layouter.transition("none", false);
						layouter.transition("right", true);
					},
				},
				{
					"title": "FPS",
					"func": (item: any, diff: number) => {
						userConfig.fps = g_app.numberUtil.trim(userConfig.fps + (diff * 20), 20, 60);
						cc.director.setAnimationInterval(1.0 / userConfig.fps);
						item.valueLabel.setString(userConfig.fps);
					},
				},
				{
					"title": "FPS VISIBLE",
					"func": (item: any, diff: number) => {
						if (diff !== 0) {
							userConfig.isFpsVisible = !userConfig.isFpsVisible;
							g_app.addTestHudTo(scene);
						}
						item.valueLabel.setString(userConfig.isFpsVisible ? "ON": "OFF");
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
				var tmpY = 120 - 36 * idx;
				var item = {
					"titleLabel": (() => {
						var spr = cc.LabelBMFont.create(title, res.font_fnt);
						spr.width = 160;
						spr.x = 0;
						spr.y = tmpY;
						spr.touchEnabled = false;
						return spr;
					})(),

					"valueLabel": (() => {
						var spr = cc.LabelBMFont.create(" ", res.font_fnt);
						spr.width = 160;
						spr.x = 24;
						spr.y = tmpY - spr.height;
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

					[ "titleLabel", "none",       false,     0.05 * 0,   0,        160, ],
					[ "backBtn",    "none",       false,     0.05 * 0, 160,  140 - 52 * 0, ],
					[ "upBtn",      "none",       false,     0.05 * 1, 160,  140 - 52 * 1, ],
					[ "downBtn",    "none",       false,     0.05 * 2, 160,  140 - 52 * 2, ],
					[ "leftBtn",    "none",       false,     0.05 * 3, 160,  140 - 52 * 3, ],
					[ "rightBtn",   "none",       false,     0.05 * 4, 160,  140 - 52 * 4, ],

					[ "titleLabel", "right",      true,      0.05 * 0,   0,        140, ],
					[ "backBtn",    "right",      true,      0.05 * 0, 136,  140 - 52 * 0, ],
					[ "upBtn",      "right",      true,      0.05 * 1, 136,  140 - 52 * 1, ],
					[ "downBtn",    "right",      true,      0.05 * 2, 136,  140 - 52 * 2, ],
					[ "leftBtn",    "right",      true,      0.05 * 3, 136,  140 - 52 * 3, ],
					[ "rightBtn",   "right",      true,      0.05 * 4, 136,  140 - 52 * 4, ],
				];
				return g_app.labeledValuesToObjects(list);
			})();

			this.bg = (() => {
				var spr = cc.Sprite.create(res.common_bg_png);
				spr.setScaleY( cc.director.getWinSize().height / DF.SC_H );
				return spr;
			})();

			layouter.sprites["titleLabel"] = (() => {
				var spr = cc.LabelBMFont.create("CONFIG", res.font_fnt);
				return spr;
			})();

			layouter.sprites["backBtn"] = (() => {
				var spr = oskn.MenuItem.createByTitle("X", 48, 48, gotoTitle, scene);
				return spr;
			})();

			layouter.sprites["upBtn"] = (() => {
				var spr = oskn.MenuItem.createByTitle("^", 48, 48, () => { onButtonEvent("up"); }, scene);
				return spr;
			})();

			layouter.sprites["downBtn"] = (() => {
				var spr = oskn.MenuItem.createByTitle("v", 48, 48, () => { onButtonEvent("down"); }, scene);
				return spr;
			})();

			layouter.sprites["leftBtn"] = (() => {
				var spr = oskn.MenuItem.createByTitle("<", 48, 48, () => { onButtonEvent("left"); }, scene);
				return spr;
			})();

			layouter.sprites["rightBtn"] = (() => {
				var spr = oskn.MenuItem.createByTitle(">", 48, 48, () => { onButtonEvent("right"); }, scene);
				return spr;
			})();

			var menu = cc.Menu.create(
				layouter.sprites["backBtn"],
				layouter.sprites["upBtn"],
				layouter.sprites["downBtn"],
				layouter.sprites["leftBtn"],
				layouter.sprites["rightBtn"]
			);
			menu.x = 0;
			menu.y = 0;

			var cursor = (() => {
				var spr = cc.LabelBMFont.create(" ", res.font_fnt);
				spr.x = 0;
				spr.y = 0;
				var ptns = [
					"v",
					"-",
					"^",
					"-",
				];
				spr.update = function (deltaTime: number) {
					var ptnIdx = Math.floor(cc.director.getTotalFrames() / g_app.secToFrame(0.2)) % ptns.length;
					spr.setString(ptns[ptnIdx]);
				};
				spr.scheduleUpdate();
				return spr;
			})();

			//
			aaa.centerNode.addChild(this.bg);
			//
			var menuGroup = cc.Node.create();
			menuGroup.x = 0;
			menuGroup.y = 0;

			for (var i = 0, iNum = items.length; i < iNum; ++i) {
				var item = items[i];
				menuGroup.addChild(item.titleLabel);
				menuGroup.addChild(item.valueLabel);
			}
			menuGroup.addChild(cursor);
			//
			aaa.centerNode.addChild(menuGroup);
			aaa.centerNode.addChild(menu);
			aaa.centerNode.addChild(layouter.sprites["titleLabel"]);

			g_app.addTestHudTo(this);

			layouter.transition("none", false);
	
			//
			var fader = new Fader(aaa.centerNode);
			fader.setBlack(true);
			fader.fadeIn(0.1);

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
				cursor.x = item.titleLabel.x - ( item.titleLabel.width + cursor.width ) / 2 - 6;
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
					fader.fadeOut(1.0, () => {
						// window.location.reload();
						cc.director.runScene(new scenes.TitleScene());
					});
				} else {
					fader.fadeOut(0.1, () => {
						cc.director.runScene(new scenes.TitleScene());
					});
				}
			};
			aaa.checkAspect();

		},
	});
}


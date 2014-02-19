﻿
/// <reference path="../kimiko.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.scenes {
	
	var app = jp.osakana4242.kimiko.app;
	var DF = jp.osakana4242.kimiko.DF;

	export var Config: any = enchant.Class.create(enchant.Scene, {
		initialize: function () {
			enchant.Scene.call(this);
			
			app.sound.stopBgm();

			var scene = this;

			var btnHeight = 48;
			var tmpY = 8;

	
			var items: {[index: string]: {
				titleLabel: any;
				valueLabel: any;
				leftBtn: any;
				rightBtn: any;
			}} = {};

			// サウンドをサポートしてるときのみ表示.
			addItem("isBgmEnabled", "BGM");
			tmpY += 56;
			addItem("isSeEnabled", "SE");
			tmpY += 56;
			addItem("fps", "FPS");
			tmpY += 56;

			var backBtn = (() => {
				var spr = new enchant.Label("TO TITLE");
				spr.font = DF.FONT_L;
				spr.color = "rgb(255, 255, 0)";
				spr.backgroundColor = "rgb(64, 64, 64)";
				spr.width = DF.SC_W / 2;
				spr.height = 48;
				spr.textAlign = "center";
				spr.x = (DF.SC_W - spr.width) / 2;
				spr.y = tmpY;
				spr.addEventListener(enchant.Event.TOUCH_END, gotoTitle);
				return spr;
			})();
			tmpY += 56;

			//
			scene.backgroundColor = "rgb( 32, 32, 32)";
			scene.addChild(backBtn);
			for (var key in items) {
				var item = items[key];
				var isAdd = true;
				switch (key) {
				case "isBgmEnabled":
				case "isSeEnabled":
					if (!app.env.isSoundEnabled) {
						isAdd = false;
					}
					break;
				}
				if (isAdd) {
					scene.addChild(item.titleLabel);
					scene.addChild(item.valueLabel);
					scene.addChild(item.leftBtn);
					scene.addChild(item.rightBtn);
				}
			}
			//
	
			//
			var fader = new Fader(this);
			fader.setBlack(true);
			fader.fadeIn(app.secToFrame(0.1));

			var userConfig = app.storage.root.userConfig;

			var oldUserConfig = {};
			for (var key in userConfig) {
				oldUserConfig[key] = userConfig[key];
			}
		
			function addItem(key: string, title: string) {
				var item = {
					"titleLabel": (() => {
						var spr = new enchant.Label(title);
						spr.font = DF.FONT_M;
						spr.color = "rgb(255, 255, 255)";
						spr.width = DF.SC_W;
						spr.height = btnHeight;
						spr.textAlign = "center";
						spr.x = 0;
						spr.y = tmpY;
						return spr;
					})(),

					"valueLabel": (() => {
						var spr = new enchant.Label("");
						spr.font = DF.FONT_M;
						spr.color = "rgb(255, 255, 255)";
						spr.width = DF.SC_W;
						spr.height = btnHeight;
						spr.textAlign = "center";
						spr.x = 0;
						spr.y = tmpY + 24;
						return spr;
					})(),

					"leftBtn": (() => {
						var spr = new enchant.Label("<-");
						spr.font = DF.FONT_L;
						spr.backgroundColor = "rgb(64, 64, 64)";
						spr.color = "rgb(255, 255, 0)";
						spr.textAlign = "center";
						spr.width = 56;
						spr.height = btnHeight;
						spr.x = DF.SC_W / 3 * 0 + (spr.width / 2);
						spr.y = tmpY;
						spr.addEventListener(enchant.Event.TOUCH_END, onAddValue(key, -1));
						return spr;
					})(),

					"rightBtn": (() => {
						var spr = new enchant.Label("->");
						spr.font = DF.FONT_L;
						spr.backgroundColor = "rgb(64, 64, 64)";
						spr.color = "rgb(255, 255, 0)";
						spr.textAlign = "center";
						spr.width = 56;
						spr.height = btnHeight;
						spr.x = DF.SC_W / 3 * 2 + (spr.width / 2);
						spr.y = tmpY;
						spr.addEventListener(enchant.Event.TOUCH_END, onAddValue(key, 1));
						return spr;
					})(),
				};
				items[key] = item;
			}

			function onAddValue(key: string, diff: number) {
				return () => {
					switch(key) {
					case "isSeEnabled":
						userConfig.isSeEnabled = !userConfig.isSeEnabled;
						app.sound.setSeEnabled(userConfig.isSeEnabled);
						break;
					case "isBgmEnabled":
						userConfig.isBgmEnabled = !userConfig.isBgmEnabled;
						app.sound.setBgmEnabled(userConfig.isBgmEnabled);
						app.sound.playBgm(Assets.SOUND_BGM, false);
						break;
					case "fps":
						userConfig.fps = app.numberUtil.trim(userConfig.fps + (diff * 20), 20, 60);
						break;
					default:
						return;
					}
					if (labelUpdaters[key]) {
						labelUpdaters[key]();
					}
					app.sound.playSe(Assets.SOUND_SE_CURSOR);
				};
			}

			var labelUpdaters = {
				"isSeEnabled": () => {
					items["isSeEnabled"].valueLabel.text = userConfig.isSeEnabled ? "ON" : "OFF";
				},
				"isBgmEnabled": () => {
					items["isBgmEnabled"].valueLabel.text = userConfig.isBgmEnabled ? "ON" : "OFF";
				},
				"fps": () => {
					items["fps"].valueLabel.text = userConfig.fps;
				},
			};

			function gotoTitle() {
				app.sound.playSe(Assets.SOUND_SE_OK);
				app.storage.save();

				var isReload = false;
				for (var key in userConfig) {
					switch (key) {
					case "fps":
						if (userConfig[key] !== oldUserConfig[key]) {
							isReload = true;
						}
					}
				}

				if (isReload) {
					fader.fadeOut(app.secToFrame(1.0), () => {
						window.location.reload();
					});
				} else {
					fader.fadeOut(app.secToFrame(0.1), () => {
						app.core.replaceScene(new scenes.Title());
					});
				}
			};

			for(var key in labelUpdaters) {
				labelUpdaters[key]();
			}
		},
	});
}


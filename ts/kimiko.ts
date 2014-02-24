
/// <reference path="env.ts" />
/// <reference path="utils.ts" />
/// <reference path="defines.ts" />
/// <reference path="player_data.ts" />
/// <reference path="storage.ts" />
/// <reference path="sound.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko {
	
	(() => {
		// for enhant-0.5.x
		if (!enchant.Core) {
			enchant.Core = enchant.Game;
		}
	})();

	var DF = jp.osakana4242.kimiko.DF;
	var Assets = jp.osakana4242.kimiko.Assets;

	export interface IConfig {
		isClearStorage: boolean;
		fps: number;
		isSoundEnabled: boolean;
		/** プレイヤーが発砲するか. */
		isFireEnabled: boolean;
		/** プレイヤー、敵がダメージを受けるか. */
		isDamageEnabled: boolean;
		swipeToMoveRate: utils.IVector2D;
		version: string;
	}

	export interface IMapOption {
		title: string;
		backgroundColor: string;
		exitType: string;
		nextMapId: number;
	}

	/**
		
		設定系の初期化順番.
		1. env
		2. config
		3. storage
	*/
	export class App {
		
		numberUtil = utils.NumberUtil;
		stringUtil = utils.StringUtil;

		env: Env;
		config: IConfig;
		storage: Storage;
		sound: Sound;

		playerData: PlayerData;
		gameScene: any;
		pauseScene: any;
		testHud: any;

		isInited: boolean = false;

		fontS: utils.SpriteFont;

		constructor() {
			this.env = new Env();
		}

		public init(config: IConfig) {
			if (g_app.isInited) {
				return;
			}
			g_app.isInited = true;
			g_app.config = config;
			g_app.storage = new Storage();
			if (g_app.config.isClearStorage) {
				g_app.storage.clear();
			}
			g_app.storage.load();
			g_app.storage.save();
			g_app.sound = new Sound();
			g_app.sound.setBgmEnabled(g_app.storage.root.userConfig.isBgmEnabled);
			g_app.sound.setSeEnabled(g_app.storage.root.userConfig.isSeEnabled);

			var core: any = new enchant.Core(DF.SC_W, DF.SC_H);
			core.fps = g_app.storage.root.userConfig.fps;
			// preload
			for (var key in Assets) {
				if (!Assets.hasOwnProperty(key)) {
					continue;
				}
				var path = Assets[key];
				var pathSplited = path.split(".");
				var ext = pathSplited.length <= 0 ? "" : "." + pathSplited[pathSplited.length - 1];
				// パスにバージョンを付加.
				var newPath = path + "?v=" + config.version + ext;
				Assets[key] = newPath;
				//
				var isSound = ext === ".mp3";
				if (!g_app.env.isSoundEnabled && isSound) {
					// 音鳴らさないので読み込みをスキップ.
					continue;
				}
				core.preload(newPath);
			}
			
			// sound
			(() => {
				var SOUND_INFOS = [
					{
						"assetName": Assets.SOUND_BGM,
						"playTime": 27.5,
						"isLoop": true,
						"priority": 0,
					},
					{
						"assetName": Assets.SOUND_SE_OK,
						"playTime": 1,
						"isLoop": false,
						"priority": 10,
					},
					{
						"assetName": Assets.SOUND_SE_CURSOR,
						"playTime": 0.5,
						"isLoop": false,
						"priority": 10,
					},
					{
						"assetName": Assets.SOUND_SE_HIT,
						"playTime": 0.5,
						"isLoop": false,
						"priority": 2,
					},
					{
						"assetName": Assets.SOUND_SE_KILL,
						"playTime": 1.0,
						"isLoop": false,
						"priority": 3,
					},
					{
						"assetName": Assets.SOUND_SE_SHOT,
						"playTime": 0.3,
						"isLoop": false,
						"priority": 1,
					},
				];
				for(var i = 0, iNum = SOUND_INFOS.length; i < iNum; ++i) {
					g_app.sound.add(SOUND_INFOS[i]);
				}
			})();

			// anim
			(() => {
				var r = (animId: number, imageName: string, frameWidth: number, frameHeight: number, frameSec: number, frames: number[]) => {
					var seq = new utils.AnimSequence(imageName, frameWidth, frameHeight, frameSec, frames);
					g_app.registerAnimFrames(animId, seq);
				}
				r(DF.ANIM_ID_CHARA001_WALK,  Assets.IMAGE_CHARA001, 32, 32, 0.1, [0, 1, 0, 2]);
				r(DF.ANIM_ID_CHARA001_STAND, Assets.IMAGE_CHARA001, 32, 32, 0.1, [0]);
				r(DF.ANIM_ID_CHARA001_SQUAT, Assets.IMAGE_CHARA001, 32, 32, 0.1, [4]);
				r(DF.ANIM_ID_CHARA001_DEAD,  Assets.IMAGE_CHARA001, 32, 32, 0.1, [0, 1, 0, 2]);
		
				r(DF.ANIM_ID_CHARA002_WALK,  Assets.IMAGE_CHARA002, 32, 32, 0.1, [0, 1, 2, 3]);
				r(DF.ANIM_ID_CHARA003_WALK,  Assets.IMAGE_CHARA003, 64, 64, 0.1, [0, 1, 2, 3]);

				r(DF.ANIM_ID_BULLET001,      Assets.IMAGE_BULLET,   16, 16, 0.1, [0, 1, 2, 3]);
				r(DF.ANIM_ID_BULLET002,      Assets.IMAGE_BULLET,   16, 16, 0.1, [4, 5, 6, 7]);

				r(DF.ANIM_ID_DAMAGE,         Assets.IMAGE_EFFECT,   16, 16, 0.1, [8, 9, 10, 11]);
				r(DF.ANIM_ID_MISS,           Assets.IMAGE_EFFECT,   16, 16, 0.1, [12, 13, 14, 15]);
				r(DF.ANIM_ID_DEAD,           Assets.IMAGE_EFFECT,   16, 16, 0.1, [8, 9, 10, 11]);

				r(DF.ANIM_ID_COLLIDER,       Assets.IMAGE_COLLIDER, 16, 16, 0.1, [0]);
			})();

			// key bind
			core.keybind(" ".charCodeAt(0), "a");	
			core.keybind("A".charCodeAt(0), "left");	
			core.keybind("D".charCodeAt(0), "right");	
			core.keybind("W".charCodeAt(0), "up");	
			core.keybind("S".charCodeAt(0), "down");	
			//
			// ASCII
			//  !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~
			//
			g_app.fontS = utils.SpriteFont.makeFromFontSettings( 
				Assets.IMAGE_FONT_S,
				"?".charCodeAt(0),
				128,
				128,
				jp.osakana4242.kimiko["g_fontSettings"]
			);

			//
			core.onload = (() => {
				g_app.playerData = new jp.osakana4242.kimiko.PlayerData();

				g_app.testHud = new TestHud();
				g_app.gameScene = new jp.osakana4242.kimiko.scenes.Game();
				g_app.pauseScene = new jp.osakana4242.kimiko.scenes.Pause();
				if (true) {
					var scene = new jp.osakana4242.kimiko.scenes.Title();
					core.replaceScene(scene);
				} else {
					g_app.playerData.reset();
					g_app.playerData.mapId = DF.MAP_ID_MAX;
					core.replaceScene(g_app.gameScene);
				}
			});
		}

		addTestHudTo(scene: any) {
			if (g_app.testHud.parentNode) {
				g_app.testHud.parentNode.removeChild(g_app.testHud);
			}
			if (g_app.storage.root.userConfig.isFpsVisible) {
				scene.addChild(g_app.testHud);
			}
		}

		animFrames: { [index: number]: utils.AnimSequence; } = <any>{};

		registerAnimFrames(animId: number, seq: utils.AnimSequence) {
			g_app.animFrames[animId] = seq;
		}

		getAnimFrames(animId: number) {
			return g_app.animFrames[animId];
		}
		
		get core() {
			return enchant.Core.instance;
		}
		
		secToFrame(sec: number): number {
			return g_app.core.fps * sec;
		}

		frameToSec(frame: number): number { return frame / g_app.core.fps; }
		
		/**
			毎秒Xドット(DotPerSec) を 毎フレームXドット(DotPerFrame) に変換。 

			60FPSで1フレームに1dot → 1 x 60 = 1秒間に60dot = 60dps
			20FPSで1フレームに1dot → 1 x 20 = 1秒間に20dot = 20dps
		 */
		dpsToDpf(dotPerSec: number): number {
			return dotPerSec
				? dotPerSec / g_app.core.fps
				: 0;
		}
		
		/** 指定距離を指定dpsで通過できる時間(frame)
			関数名が決まらない. ('A`)
		*/
		getFrameCountByHoge(distance: number, dps: number): number {
			return distance / g_app.dpsToDpf(dps);
		}

		/**
			[ラベル行]と[値行]からなる配列を
			Object型の配列に変換する.

			[
				[label1, label2],
				[value, value],
				[value, value],
			];

				||
				vv

			[
				{label1: value, label2: value},
				{label1: value, label2: value},
			];
		*/
		public labeledValuesToObjects(list: Array<any>): Array<any> {
			var dest = [];
			var keys = list[0];
			for (var i = 1, iNum = list.length; i < iNum; ++i) {
				var record = list[i];
				var obj = {};
				for (var j = 0, jNum = keys.length; j < jNum; ++j) {
					obj[keys[j]] = record[j];
				}
				dest.push(obj);
			}
			return dest;
		}

	
	}

	export var TestHud = enchant.Class.create(enchant.Group, {
		initialize: function () {
			enchant.Group.call(this);

			var group = this;

			var fpsLabel = (() => {
				function getTime() {
					return new Date().getTime();
				}
				var label = new utils.SpriteLabel(g_app.fontS, "");
				label.width = 160;
				label.scaleX = 0.75;
				label.scaleY = 0.75;
				label.x = - label.width * (1.0 - label.scaleX) / 2;
				label.y = - label.height * (1.0 - label.scaleY) / 2;

				var diffSum = 0;
				var prevTime = getTime();

				// 3秒間の平均FPSを算出する.
				var sampleCountMax = g_app.core.fps * 3;
				var sampleCount = 0;
				var samples = [];
				for (var i = 0; i < sampleCountMax - 1; ++i) {
					samples.push(0);
				}
				var renderCounter = 0;

				label.addEventListener(enchant.Event.RENDER, function() {
					var nowTime = getTime();
					var diffTime = Math.floor(nowTime - prevTime);
					var realFps = 1000 * sampleCountMax / (diffSum + diffTime);
					diffSum += - samples.shift() + diffTime;
					samples.push(diffTime);
					prevTime = nowTime;
					if (--renderCounter <= 0) {
						label.text = "FPS " + Math.floor(realFps);
						renderCounter = g_app.secToFrame(1.0);
					}
				});
				return label;
			})();
			group.addChild(fpsLabel);
		},
	});

	export var LabeledButton = enchant.Class(enchant.Group, {
		initialize: function (width: number, height: number, text: string) {
			enchant.Group.call(this);
			this.button = new enchant.Sprite(width, height);
			this.button.backgroundColor = "rgb(80,80,80)";
			this.button.touchEnabled = true;
			this.label = new utils.SpriteLabel(g_app.fontS, text);
			this.label.x = (this.button.width - this.label.width) / 2;
			this.label.y = (this.button.height - this.label.height) / 2;
			this.label.touchEnabled = false;
			this.addChild(this.button);
			this.addChild(this.label);
			this._visible = true;
		},

		ontouchstart: function () {
			this.button.backgroundColor = "rgb(64,64,64)";
			this.button.y = 1;
		},

		ontouchend: function () {
			this.button.backgroundColor = "rgb(80,80,80)";
			this.button.y = 0;
		},

		visible: {
			get: function () {
				return this._visible;
			},
			set: function (value: boolean) {
				if (this._visible === value) {
					return;
				}
				this._visible = value;
				this.button.visible = value;
				this.label.visible = value;
			}
		},

		width: { get: function () {
			return this.button.width;
		} },

		height: { get: function () {
			return this.button.height;
		} },

		text: {
			get: function (): string {
				return this.label.text;
			},
			set: function (value: string) {
				this.label.text = value;
				this.label.x = (this.width - this.label.width) / 2;
				this.label.y = (this.height - this.label.height) / 2;
			},
		},
	});

	/** この時点で g_app.evn は参照可能. */
	export var g_app: App = new App();

	/** HTMLから呼ぶ. */
	export function start(params) {
		g_app.init(params);
		g_app.core.start();
	}
}


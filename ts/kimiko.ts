
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

		isInited: boolean = false;

		constructor() {
			var app = this;
			app.env = new Env();
		}

		public init(config: IConfig) {
			if (app.isInited) {
				return;
			}
			app.isInited = true;
			app.config = config;
			app.storage = new Storage();
			if (app.config.isClearStorage) {
				app.storage.clear();
			}
			app.storage.load();
			app.storage.save();
			app.sound = new Sound();
			app.sound.setBgmEnabled(app.storage.root.userConfig.isBgmEnabled);
			app.sound.setSeEnabled(app.storage.root.userConfig.isSeEnabled);

			var core: any = new enchant.Core(DF.SC_W, DF.SC_H);
			core.fps = app.storage.root.userConfig.fps;
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
				if (!app.env.isSoundEnabled && isSound) {
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
					app.sound.add(SOUND_INFOS[i]);
				}
			})();

			// anim
			(() => {
				var r = (animId: number, imageName: string, frameWidth: number, frameHeight: number, frameSec: number, frames: number[]) => {
					var seq = new utils.AnimSequence(imageName, frameWidth, frameHeight, frameSec, frames);
					app.registerAnimFrames(animId, seq);
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
			core.onload = (() => {
				app.playerData = new jp.osakana4242.kimiko.PlayerData();
				app.gameScene = new jp.osakana4242.kimiko.scenes.Game();
				app.pauseScene = new jp.osakana4242.kimiko.scenes.Pause();
				if (true) {
					var scene = new jp.osakana4242.kimiko.scenes.Title();
					core.replaceScene(scene);
				} else {
					app.playerData.reset();
					app.playerData.mapId = DF.MAP_ID_MAX;
					core.replaceScene(app.gameScene);
				}
			});
		}

		animFrames: { [index: number]: utils.AnimSequence; } = <any>{};

		registerAnimFrames(animId: number, seq: utils.AnimSequence) {
			app.animFrames[animId] = seq;
		}

		getAnimFrames(animId: number) {
			return app.animFrames[animId];
		}
		
		get core() {
			return enchant.Core.instance;
		}
		
		secToFrame(sec: number): number {
			return app.core.fps * sec;
		}

		frameToSec(frame: number): number { return frame / app.core.fps; }
		
		/**
			毎秒Xドット(DotPerSec) を 毎フレームXドット(DotPerFrame) に変換。 

			60FPSで1フレームに1dot → 1 x 60 = 1秒間に60dot = 60dps
			20FPSで1フレームに1dot → 1 x 20 = 1秒間に20dot = 20dps
		 */
		dpsToDpf(dotPerSec: number): number {
			return dotPerSec
				? dotPerSec / app.core.fps
				: 0;
		}
		
		/** 指定距離を指定dpsで通過できる時間(frame)
			関数名が決まらない. ('A`)
		*/
		getFrameCountByHoge(distance: number, dps: number): number {
			return distance / app.dpsToDpf(dps);
		}

		//dotPerSecToDotPerFrame
	
	}

	/** この時点で app.evn は参照可能. */
	export var app: App = new App();

	/** HTMLから呼ぶ. */
	export function start(params) {
		app.init(params);
		app.core.start();
	}
}



/// <reference path="env.ts" />
/// <reference path="utils.ts" />
/// <reference path="defines.ts" />
/// <reference path="player_data.ts" />
/// <reference path="storage.ts" />
/// <reference path="sound.ts" />

module jp.osakana4242.kimiko {
	
	var DF = jp.osakana4242.kimiko.DF;
	var Assets = jp.osakana4242.kimiko.Assets;

	export interface IConfig {
		isTestMapEnabled: boolean;
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
		resName: string;
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
				r(DF.ANIM_ID_CHARA001_WALK,  res.chara001_png, 32, 32, 0.1, [0, 1, 0, 2]);
				r(DF.ANIM_ID_CHARA001_STAND, res.chara001_png, 32, 32, 0.1, [0]);
				r(DF.ANIM_ID_CHARA001_SQUAT, res.chara001_png, 32, 32, 0.1, [4]);
				r(DF.ANIM_ID_CHARA001_DEAD,  res.chara001_png, 32, 32, 0.1, [0, 1, 0, 2]);
		
				r(DF.ANIM_ID_CHARA002_WALK,  res.chara002_png, 32, 32, 0.1, [0, 1, 2, 3]);
				r(DF.ANIM_ID_CHARA003_WALK,  res.chara003_png, 64, 64, 0.1, [0, 1, 2, 3]);
				r(DF.ANIM_ID_CHARA004_WALK,  res.chara002_png, 32, 32, 0.1, [4]);
				r(DF.ANIM_ID_CHARA005_WALK,  res.chara002_png, 32, 32, 0.1, [8]);
				r(DF.ANIM_ID_CHARA006_WALK,  res.chara002_png, 32, 32, 0.1, [12]);
				r(DF.ANIM_ID_CHARA007_WALK,  res.chara002_png, 32, 32, 0.1, [16]);
				r(DF.ANIM_ID_CHARA008_WALK,  res.chara002_png, 32, 32, 0.1, [20]);
				r(DF.ANIM_ID_CHARA009_WALK,  res.chara002_png, 32, 32, 0.1, [24]);
				r(DF.ANIM_ID_CHARA010_WALK,  res.chara002_png, 32, 32, 0.1, [28]);
				r(DF.ANIM_ID_CHARA011_WALK,  res.chara004_png, 48, 48, 0.1, [0]);

				r(DF.ANIM_ID_BULLET001,      res.bullet_png,   16, 16, 0.1, [0, 1, 2, 3]);
				r(DF.ANIM_ID_BULLET002,      res.bullet_png,   16, 16, 0.1, [4, 5, 6, 7]);

				r(DF.ANIM_ID_DAMAGE,         res.effect_png,   16, 16, 0.1, [8, 9, 10, 11]);
				r(DF.ANIM_ID_MISS,           res.effect_png,   16, 16, 0.1, [12, 13, 14, 15]);
				r(DF.ANIM_ID_DEAD,           res.effect_png,   16, 16, 0.1, [8, 9, 10, 11]);

				r(DF.ANIM_ID_COLLIDER,       res.collider_png, 16, 16, 0.1, [0]);
			})();

			// key bind
//			core.keybind(" ".charCodeAt(0), "a");	
//			core.keybind("A".charCodeAt(0), "left");	
//			core.keybind("D".charCodeAt(0), "right");	
//			core.keybind("W".charCodeAt(0), "up");	
//			core.keybind("S".charCodeAt(0), "down");	
			//
			// ASCII
			//  !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~
			//
//			g_app.fontS = utils.SpriteFont.makeFromFontSettings( 
//				Assets.IMAGE_FONT_S,
//				"?".charCodeAt(0),
//				128,
//				128,
//				jp.osakana4242.kimiko["g_fontSettings"]
//			);

			//
//			core.onload = (() => {
//				g_app.playerData = new jp.osakana4242.kimiko.PlayerData();
//
//				g_app.testHud = new TestHud();
//				g_app.gameScene = new jp.osakana4242.kimiko.scenes.Game();
//				g_app.pauseScene = new jp.osakana4242.kimiko.scenes.Pause();
//				if (false) {
//					var scene = new jp.osakana4242.kimiko.scenes.Title();
//					core.replaceScene(scene);
//				} else {
//					//core.replaceScene(new jp.osakana4242.kimiko.scenes.SendResult());
//					core.replaceScene(new jp.osakana4242.kimiko.scenes.GameClear());
//					//core.replaceScene(new jp.osakana4242.kimiko.scenes.GameOver());
//				}
//			});
		}

		destroy() {
			if (g_app.testHud) {
				g_app.testHud.release();
			}
		}

		addTestHudTo(scene: any) {
			g_app.testHud.removeFromParent(true);
			if (g_app.storage.root.userConfig.isFpsVisible) {
				scene.addChild(g_app.testHud);
				if (scene.aaa) {
					cc.log("addTestHud to aaa");
					scene.aaa.addAnchor(g_app.testHud, "top");
				}
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
			throw "not support";
		}

		get fps() {
			return this.config.fps;
		}

		get input(): any {
			return null;
		}
		
		secToFrame(sec: number): number {
			return g_app.fps * sec;
		}

		frameToSec(frame: number): number { return frame / g_app.fps; }
		
		/**
			毎秒Xドット(DotPerSec) を 毎フレームXドット(DotPerFrame) に変換。 

			60FPSで1フレームに1dot → 1 x 60 = 1秒間に60dot = 60dps
			20FPSで1フレームに1dot → 1 x 20 = 1秒間に20dot = 20dps
		 */
		dpsToDpf(dotPerSec: number): number {
			return dotPerSec
				? dotPerSec / g_app.fps
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

	export var TestHud = cc.Node.extend( {
		ctor: function () {
			this._super();

			var group = this;

			/** 左寄せ. */
			function originLeft(spr: any) {
				spr.x += - label.width * (1.0 - label.scaleX) / 2;
				spr.y += - label.height * (1.0 - label.scaleY) / 2;
			}

			this.labels = [];
			var labelNum = 4;

			var top = DF.SC_H / 2;
			var left = - DF.SC_W / 2;

			for (var i = 0; i < labelNum; ++i) {
				var label = cc.LabelBMFont.create( " ", res.font_fnt );
				label.textAlign = cc.TEXT_ALIGNMENT_LEFT;
				label.width = DF.SC_W / labelNum;
				label.scaleX = 0.75;
				label.scaleY = 0.75;
				label.x = left + (DF.SC_W / labelNum * i);
				label.y = top - (label.height / 2);
//				originLeft(label);
				this.labels.push(label);
			}

			var fpsLabel = (() => {
				function getTime() {
					return new Date().getTime();
				}
				var label = this.labels[0];

				var diffSum = 0;
				var prevTime = getTime();

				// 3秒間の平均FPSを算出する.
				var sampleCountMax = g_app.fps * 3;
				var sampleCount = 0;
				var samples = [];
				for (var i = 0; i < sampleCountMax - 1; ++i) {
					samples.push(0);
				}
				var renderCounter = 0;

				label.schedule(() => {
					var nowTime = getTime();
					var diffTime = Math.floor(nowTime - prevTime);
					var realFps = 1000 * sampleCountMax / (diffSum + diffTime);
					diffSum += - samples.shift() + diffTime;
					samples.push(diffTime);
					prevTime = nowTime;
					if (--renderCounter <= 0) {
						label.setString("FPS " + Math.floor(realFps));
						renderCounter = g_app.secToFrame(1.0);
					}
				});
				return label;
			})();

			for (var i = 0; i < labelNum; ++i) {
				group.addChild(this.labels[i]);
			}

			this.scheduleUpdate();
		},

		update: function (deltaTime: number) {
			this.labels[1].setString(
				"N:" + this.countNodes(cc.director.getRunningScene().getChildren())
			);
		},

		/** ノード数をカウント. Groupは数えない. */
		countNodes: function (nodes: Array<any>) {
			if (!nodes) {
				return 0;
			}
			var cnt = 0;
			for (var i = nodes.length - 1; 0 <= i; --i) {
				var node = nodes[i];
				if (node.getChildren() && 1 <= node.getChildren().length) {
					cnt += this.countNodes(node.getChildren());
				} else {
					++cnt;
				}
			}
			return cnt;
		},
	});

	/** この時点で g_app.evn は参照可能. */
	export var g_app: App = new App();

}


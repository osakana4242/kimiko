/// <reference path="utils.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko {
	
	export module Assets {
		export var IMAGE_FONT_S = "./images/font_s.png";
		export var IMAGE_GAME_START_BG = "./images/game_start_bg.png";
		export var IMAGE_MAP = "./images/map.png";
		export var IMAGE_CHARA001 = "./images/chara001.png";
		export var IMAGE_CHARA002 = "./images/chara002.png";
		export var IMAGE_CHARA003 = "./images/chara003.png";
		export var IMAGE_BULLET = "./images/bullet.png";
		export var IMAGE_EFFECT = "./images/bullet.png";
		export var IMAGE_COLLIDER = "./images/collider.png";
		export var SOUND_BGM = "./sounds/bgm_02.mp3";
		export var SOUND_SE_OK = "./sounds/se_ok.mp3";
		export var SOUND_SE_CURSOR = "./sounds/se_cursor.mp3";
		export var SOUND_SE_HIT = "./sounds/se_hit.mp3";
		export var SOUND_SE_KILL = "./sounds/se_kill.mp3";
		export var SOUND_SE_SHOT = "./sounds/se_shot.mp3";
	}

	export module DF {

		/** ドアを隠すか. */
		export var IS_HIDDEN_DOOR: boolean = false;

		export var BASE_FPS: number = 60;
		export var SC_W: number = 320;
		export var SC_H: number = 320;
		export var SC_X1: number = 0;
		export var SC_Y1: number = 0;
		export var SC_X2: number = SC_X1 + SC_W;
		export var SC_Y2: number = SC_Y1 + SC_H;
		export var SC1_W: number = 320;
		export var SC1_H: number = 240;
		export var SC2_W: number = 320;
		export var SC2_H: number = 80;
		export var SC2_X1: number = 0;
		export var SC2_Y1: number = 240;
		export var SC2_X2: number = SC2_X1 + SC2_W;
		export var SC2_Y2: number = SC2_Y1 + SC2_H;
		export var MAP_TILE_W = 32;
		export var MAP_TILE_H = 32;
		export var ENEMY_SPAWN_RECT_MARGIN: number = 8;
		export var ENEMY_SLEEP_RECT_MARGIN: number = 320;
		export var PLAYER_COLOR: string = "rgb(240, 240, 240)";
		export var PLAYER_DAMAGE_COLOR: string = "rgb(240, 240, 120)";
		export var PLAYER_ATTACK_COLOR: string = "rgb(160, 160, 240)";
		export var ENEMY_COLOR: string = "rgb(120, 80, 120)";
		export var ENEMY_DAMAGE_COLOR: string = "rgb(240, 16, 240)";
		export var ENEMY_ATTACK_COLOR: string = "rgb(240, 16, 16)";
		export var ENEMY_ID_BOSS = 0xf;

		export var ANIM_ID_CHARA001_WALK = 10;
		export var ANIM_ID_CHARA001_STAND = 11;
		export var ANIM_ID_CHARA001_SQUAT = 12;
		export var ANIM_ID_CHARA001_DEAD = 13;

		export var ANIM_ID_CHARA002_WALK = 20;
		export var ANIM_ID_CHARA003_WALK = 30;
		export var ANIM_ID_CHARA004_WALK = 40;
		export var ANIM_ID_CHARA005_WALK = 50;
		export var ANIM_ID_CHARA006_WALK = 60;
		export var ANIM_ID_CHARA007_WALK = 70;
		export var ANIM_ID_CHARA008_WALK = 80;

		export var ANIM_ID_BULLET001 = 300;
		export var ANIM_ID_BULLET002 = 301;

		export var ANIM_ID_DAMAGE = 400;
		export var ANIM_ID_MISS = 401;
		export var ANIM_ID_DEAD = 402;

		export var ANIM_ID_COLLIDER = 500;
	

		// スワイプで1フレームにキャラが移動できる最大距離.
		export var TOUCH_TO_CHARA_MOVE_LIMIT = 320; // 30;
		// 一度に移動できる最大ドット数.
		export var PLAYER_MOVE_RESOLUTION = 8;
		export var PLAYER_HP = 3;
		// 最大連射数.
		export var PLAYER_BULLET_NUM = 1;

		export var FONT_M: string = '12px Verdana,"ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","ＭＳ ゴシック","MS Gothic",monospace';
		export var FONT_L: string = '24px Verdana,"ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","ＭＳ ゴシック","MS Gothic",monospace';
	
		export var GRAVITY: number = 0.5 * 60;
		/** キー入力後、プレイヤーに重力がかかるまでの間隔. */
		export var GRAVITY_HOLD_SEC: number = 0.3;
		
		export var PLAYER_TOUCH_ANCHOR_ENABLE = true;

		export var MAP_TILE_EMPTY = -1;
		export var MAP_TILE_COLLISION_MIN = 0;
		export var MAP_TILE_COLLISION_MAX = 15;
		export var MAP_TILE_PLAYER_POS = 40;
		export var MAP_TILE_DOOR_OPEN = 41;
		export var MAP_TILE_DOOR_CLOSE = -1;
		export var MAP_TILE_CHARA_MIN = 48;
		
		export var MAP_ID_MIN = 101;
		export var MAP_ID_MAX = 104;

		export var MAP_OPTIONS = {
			101: {
				"title": "tutorial",
				"backgroundColor": "rgb(196,196,196)",
				//"backgroundColor": "rgb(8,8,16)",
				// ドアあり.
				"nextMapId": 102,
				"exitType": "door",
			},
			102: {
				"title": "tutorial",
				"backgroundColor": "rgb(16,16,32)",
				// ドアなし.
				"nextMapId": 103,
				"exitType": "door",
			},
			103: {
				"title": "tutorial",
				"backgroundColor": "rgb(32,196,255)",
				// ドアなし.
				"nextMapId": 104,
				"exitType": "door",
			},
			104: {
				"title": "station",
				"backgroundColor": "rgb(32,196,255)",
				// ドアなし.
				"nextMapId": 105,
				"exitType": "door",
			},
			105: {
				"title": "station",
				"backgroundColor": "rgb(32,196,255)",
				// ドアなし.
				"nextMapId": 106,
				"exitType": "door",
			},
			106: {
				"title": "station",
				"backgroundColor": "rgb(32,196,255)",
				// ドアなし.
				"nextMapId": 107,
				"exitType": "door",
			},
			107: {
				"title": "boss",
				"backgroundColor": "rgb(196,32,32)",
				// ドアなし
				// ラスト.
				"nextMapId": 0,
				"exitType": "enemy_zero",
			},
			202: {
				"title": "trace",
				"backgroundColor": "rgb(32,32,32)",
				"nextMapId": 0,
				"exitType": "door",
			},
			206: {
				"title": "bunbun",
				"backgroundColor": "rgb(32,32,32)",
				"nextMapId": 0,
				"exitType": "door",
			},
			207: {
				"title": "hovering",
				"backgroundColor": "rgb(32,32,32)",
				"nextMapId": 0,
				"exitType": "door",
			},
			208: {
				"title": "horizontal move",
				"backgroundColor": "rgb(32,32,32)",
				"nextMapId": 0,
				"exitType": "door",
			},
			209: {
				"title": "horizontal trace",
				"backgroundColor": "rgb(32,32,32)",
				"nextMapId": 0,
				"exitType": "door",
			},
			301: {
				"title": "test",
				"backgroundColor": "rgb(32,32,32)",
				"nextMapId": 0,
				"exitType": "door",
			},
		};

		export var BIT_L = 1 << 0;
		export var BIT_R = 1 << 1;
		export var BIT_U = 1 << 2;
		export var BIT_D = 1 << 3;
		
		export var DIR_FLAG_TO_VECTOR2D = (() => {
			var a: { [index: number]: utils.IVector2D; } = <any>{};
			var b = 1;
			var c = 0.7;
			a[BIT_L] = { x: -b, y: 0 };
			a[BIT_R] = { x: b, y: 0 };
			a[BIT_U] = { x:  0, y : -b };
			a[BIT_D] = { x: 0, y: b };

			a[BIT_L | BIT_U] = { x: -c, y: -c };
			a[BIT_L | BIT_D] = { x: -c, y: c };
			a[BIT_L | BIT_R] = { x: 0, y: 0 };

			a[BIT_R | BIT_U] = { x: c, y: -c };
			a[BIT_R | BIT_D] = { x: c, y: c };

			a[BIT_U | BIT_D] = { x: 0, y: 0 };

			a[BIT_L | BIT_R | BIT_U] = { x: 0, y: -b };
			a[BIT_L | BIT_R | BIT_D] = { x: 0, y: b };
			a[BIT_L | BIT_U | BIT_D] = { x: -b, y: 0 };
			a[BIT_R | BIT_U | BIT_D] = { x: b, y: 0 };

			a[BIT_L | BIT_R | BIT_U | BIT_D] = { x: 0, y: 0 };
			return a;
		})();
	}

}


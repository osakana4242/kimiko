/// <reference path="utils.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko {
	
	export module Assets {
		export var IMAGE_FONT_S =                 "res/font_s.png";
		export var IMAGE_GAME_START_BG =          "res/game_start_bg.png";
		export var IMAGE_COMMON_BG =              "res/common_bg.png";
		export var IMAGE_MAP =                    "res/map.png";
		export var IMAGE_CHARA001 =               "res/chara001.png";
		export var IMAGE_CHARA002 =               "res/chara002.png";
		export var IMAGE_CHARA003 =               "res/chara003.png";
		export var IMAGE_CHARA004 =               "res/chara004.png";
		export var IMAGE_BULLET =                 "res/bullet.png";
		export var IMAGE_EFFECT =                 "res/bullet.png";
		export var IMAGE_COLLIDER =               "res/collider.png";

		export var SOUND_BGM =                    "res/snd/bgm_02.mp3";
		export var SOUND_SE_OK =                  "res/snd/se_ok.mp3";
		export var SOUND_SE_CURSOR =              "res/snd/se_cursor.mp3";
		export var SOUND_SE_HIT =                 "res/snd/se_hit.mp3";
		export var SOUND_SE_KILL =                "res/snd/se_kill.mp3";
		export var SOUND_SE_SHOT =                "res/snd/se_shot.mp3";
	}

	export module VecX {
		export var L = -1;
		export var R =  1;
	}

	export module VecY {
		export var U =  1;
		export var D = -1;
	}

	export module DF {

		/** ドアを隠すか. */
		export var IS_HIDDEN_DOOR: boolean = false;

		export var BASE_FPS: number = 60;
		export var SC_W: number = 320;
		export var SC_H: number = 480;
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

		export var UP: number = 1;
		export var DOWN: number = -1;
		export var LEFT: number = -1;
		export var RIGHT: number = 1;

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
		export var ANIM_ID_CHARA009_WALK = 90;
		export var ANIM_ID_CHARA010_WALK = 100;
		export var ANIM_ID_CHARA011_WALK = 110;

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
		/** アンカーからどれだけ移動したら振り向くか. */
		export var PLAYER_TURN_CHANGE_THRESHOLD = 16;
		/** アンカーからどれだけ移動したらしゃがむか. */
		export var PLAYER_SQUAT_THRESHOLD = 16;

		/** ライフ一つ分のスコアボーナス */
		export var SCORE_LIFE = 300;

		export var FONT_M: string = '12px Verdana,"ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","ＭＳ ゴシック","MS Gothic",monospace';
		export var FONT_L: string = '24px Verdana,"ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","ＭＳ ゴシック","MS Gothic",monospace';
	
		export var GRAVITY: number = 0.5 * 60;
		/** キー入力後、プレイヤーに重力がかかるまでの間隔. */
		export var GRAVITY_HOLD_SEC: number = 0.3;
		
		export var PLAYER_TOUCH_ANCHOR_ENABLE = true;

		export var MAP_TILE_EMPTY = 0;
		export var MAP_TILE_COLLISION_MIN = 1;
		export var MAP_TILE_COLLISION_MAX = 16;
		export var MAP_TILE_GROUND_MAX = 40;
		export var MAP_TILE_PLAYER_POS = 41;
		export var MAP_TILE_DOOR_OPEN = 33;
		export var MAP_TILE_DOOR_CLOSE = 0;
		export var MAP_TILE_CHARA_MIN = 49;
		
		export var MAP_ID_MIN = 101;
		export var MAP_ID_MAX = 104;

		export var MAP_OPTIONS = utils.ObjectUtil.makeObjectMapFromLabeldValues([
				[ "id",   "resName",             "title",            "backgroundColor",  "nextMapId", "exitType",   "bgm",            ],
				[ 101,    "map101_tmx",          "tutorial",         "rgb(196,196,196)", 102,         "door",       "snd_bgm_02_mp3", ],
				[ 102,    "map102_tmx",          "tutorial",         "rgb(16,16,32)",    103,         "door",       "snd_bgm_02_mp3", ],
				[ 103,    "map103_tmx",          "tutorial",         "rgb(196,196,196)", 201,         "door",       "snd_bgm_02_mp3", ],
				[ 201,    "map201_tmx",          "station",          "rgb(32,196,255)",  202,         "door",       "snd_bgm_02_mp3", ],
				[ 202,    "map202_tmx",          "station",          "rgb(32,196,255)",  203,         "door",       "snd_bgm_02_mp3", ],
				[ 203,    "map203_tmx",          "station",          "rgb(196,128,32)",  204,         "door",       "snd_bgm_02_mp3", ],
				[ 204,    "map204_tmx",          "boss",             "rgb(196,32,32)",   0,           "enemy_zero", "snd_bgm_03_mp3", ],
				[ 900102, "map900102_tmx",       "trace",            "rgb(32,32,32)",    0,           "door",       "snd_bgm_02_mp3", ],
				[ 900103, "map900103_tmx",       "jump up",          "rgb(32,32,32)",    0,           "door",       "snd_bgm_02_mp3", ],
				[ 900104, "map900104_tmx",       "jump down",        "rgb(32,32,32)",    0,           "door",       "snd_bgm_02_mp3", ],
				[ 900105, "map900105_tmx",       "front back",       "rgb(32,32,32)",    0,           "door",       "snd_bgm_02_mp3", ],
				[ 900106, "map900106_tmx",       "bunbun",           "rgb(32,32,32)",    0,           "door",       "snd_bgm_02_mp3", ],
				[ 900107, "map900107_tmx",       "hovering",         "rgb(32,32,32)",    0,           "door",       "snd_bgm_02_mp3", ],
				[ 900108, "map900108_tmx",       "horizontal move",  "rgb(32,32,32)",    0,           "door",       "snd_bgm_02_mp3", ],
				[ 900109, "map900109_tmx",       "horizontal trace", "rgb(32,32,32)",    0,           "door",       "snd_bgm_02_mp3", ],
				[ 900201, "map900201_tmx",       "test",             "rgb(32,32,32)",    0,           "door",       "snd_bgm_02_mp3", ],
				[ 900202, "map900202_tmx",       "test",             "rgb(32,32,32)",    0,           "door",       "snd_bgm_02_mp3", ],
				[ 900203, "map900203_tmx",       "test",             "rgb(32,32,32)",    0,           "door",       "snd_bgm_02_mp3", ],
				], (record) => { return record.id; });

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


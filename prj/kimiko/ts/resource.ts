
var res = {
	HelloWorld_png : "res/HelloWorld.png",
	CloseNormal_png : "res/CloseNormal.png",
	CloseSelected_png : "res/CloseSelected.png",

	map001_tmx: "res/map001.tmx",

	font_png: "res/font.png",
	font_fnt: "res/font.fnt",

	game_start_bg_png : "res/game_start_bg.png",
	bullet_png        : "res/bullet.png",
	effect_png        : "res/bullet.png",
	chara001_png      : "res/chara001.png",
	chara002_png      : "res/chara002.png",
	chara003_png      : "res/chara003.png",
	chara004_png      : "res/chara004.png",
	clip_png          : "res/clip.png",
	collider_png      : "res/collider.png",
	common_bg_png     : "res/common_bg.png",
	map_png           : "res/map.png",

	SND_BGM_02        : "res/snd/bgm_02.mp3",
	SND_SE_OK         : "res/snd/se_ok.mp3",
	SND_SE_CURSOR     : "res/snd/se_cursor.mp3",
	SND_SE_HIT        : "res/snd/se_hit.mp3",
	SND_SE_KILL       : "res/snd/se_kill.mp3",
	SND_SE_SHOT       : "res/snd/se_shot.mp3",
};

//	export module Assets {
//		export var IMAGE_FONT_S = "./images/font_s.png";
//		export var IMAGE_GAME_START_BG = "./images/game_start_bg.png";
//		export var IMAGE_COMMON_BG = "./images/common_bg.png";
//		export var IMAGE_MAP = "./images/map.png";
//		export var IMAGE_CHARA001 = "./images/chara001.png";
//		export var IMAGE_CHARA002 = "./images/chara002.png";
//		export var IMAGE_CHARA003 = "./images/chara003.png";
//		export var IMAGE_CHARA004 = "./images/chara004.png";
//		export var IMAGE_BULLET = "./images/bullet.png";
//		export var IMAGE_EFFECT = "./images/bullet.png";
//		export var IMAGE_COLLIDER = "./images/collider.png";
//		export var SOUND_BGM = "./sounds/bgm_02.mp3";
//		export var SOUND_SE_OK = "./sounds/se_ok.mp3";
//		export var SOUND_SE_CURSOR = "./sounds/se_cursor.mp3";
//		export var SOUND_SE_HIT = "./sounds/se_hit.mp3";
//		export var SOUND_SE_KILL = "./sounds/se_kill.mp3";
//		export var SOUND_SE_SHOT = "./sounds/se_shot.mp3";
//	}

var g_resources = ( () => {
	var list = [];
	for ( var key in res ) {
		list.push( res[ key ] );
	}
	return list;
} )();

// cc.log( "g_resources: " + JSON.stringify( g_resources ) );

//var g_resources = [
//	//image
//	res.HelloWorld_png,
//	res.CloseNormal_png,
//	res.CloseSelected_png,
//	res.bullet_png,
//	res.chara001_png,
//	res.chara002_png,
//	res.chara003_png,
//	res.chara004_png,
//	res.collider_png,
//	res.common_bg_png,
//	res.font_s_png,
//	res.map_png,
//
//	//plist
//
//	//fnt
//
//	//tmx
//
//	//bgm
//
//	//effect
//];


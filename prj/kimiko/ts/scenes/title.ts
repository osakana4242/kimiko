
/// <reference path="../kimiko.ts" />

module jp.osakana4242.kimiko.scenes {
	
	var g_app = jp.osakana4242.kimiko.g_app;
	var DF = jp.osakana4242.kimiko.DF;

	export var TitleScene: any = cc.Scene.extend({
		ctor: function () {
			this._super();
		},

		onEnter: function () {
			this._super();

			var scdSize = oskn.conf.scdSize;
			
			var aaa = this.aaa = new oskn.AspectAnchorAdjuster();
			aaa.addToScene( this );

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
				var spr = cc.LabelBMFont.create("KIMIKO'S NIGHTMARE", res.font_fnt);
				spr.x = 0;
				spr.y = ( scdSize.height - spr.height ) / 2 - spr.height;
				return spr;
			})();

			var player = (() => {
				var spr = cc.Sprite.create(res.chara001_png);
				spr.anim = new utils.AnimSequencer( spr );
				spr.anim.sequence = g_app.getAnimFrames( DF.ANIM_ID_CHARA001_WALK );
				spr.x = 0;
				spr.y = - ( scdSize.height - spr.height ) / 2 + spr.height;
//				spr.retain();
				return spr;
//				spr.anim.sequence = g_app.getAnimFrames(DF.ANIM_ID_CHARA001_WALK);
//				spr.center.x = DF.SC_W / 2;
//				spr.y = 256;
//				var ax = spr.x;
//				var ay = spr.y;
//				spr.addEventListener(enchant.Event.TOUCH_END, function () {
//					if (0 < spr.tl.queue.length) {
//						// 演出終わってないのでカエル.
//						return;
//					}
//					spr.tl.
//						clear().
//						moveTo(ax, ay - 32, g_app.secToFrame(0.1), enchant.Easing.CUBIC_EASEOUT).
//						moveTo(ax, ay,      g_app.secToFrame(0.1), enchant.Easing.CUBIC_EASEIN);
//				});
				return spr;
			})();
		
			var author = (() => {
				var spr = cc.LabelBMFont.create("created by @osakana4242", res.font_fnt);
				spr.x = 0;
				spr.y = - ( scdSize.height - spr.height ) / 2;
				return spr;
			})();

			var mapLabel = (() => {
				var spr = cc.LabelBMFont.create(" ", res.font_fnt);
				spr.x = 0;
				spr.y = spr.height * 1 * DF.UP;
				spr.textAlign = cc.TEXT_ALIGNMENT_CENTER;
				return spr;
			})();
			
			var mapLabel2 = (() => {
				var spr = cc.LabelBMFont.create(" ", res.font_fnt);
				spr.x = 0;
				spr.y = spr.height * 0 * DF.UP;
				spr.textAlign = cc.TEXT_ALIGNMENT_CENTER;
				return spr;
			})();

			function getMapTitle(mapId: number) {
				return "STAGE " + Math.floor(mapId / 100) + "-" + (mapId % 100);
			}

			function updateMapLabel() {
				var mapId = mapIds[mapIdsIdx];
				mapLabel2.string = getMapTitle(mapId);
				// mapLabel.string = DF.MAP_OPTIONS[mapId].title;
			}
			updateMapLabel();

			var leftBtn = (() => {
				var spr = oskn.MenuItem.createByTitle("<", 48, 48, prevMap, scene);
				spr.x = -1 * scdSize.width / 3;
				spr.y = spr.height * 0;
				return spr;
			})();

			var rightBtn = (() => {
				var spr = oskn.MenuItem.createByTitle(">", 48, 48, nextMap, scene);
				spr.x = 1 * scdSize.width / 3;
				spr.y = spr.height * 0;
				return spr;
			})();
		
			var startBtn = (() => {
				var spr = oskn.MenuItem.createByTitle("START", 160, 48, gotoGameStart, scene);
				spr.x = 0;
				spr.y = spr.height * -1;
				return spr;
			})();

			var configBtn = (() => {
				var spr = oskn.MenuItem.createByTitle("CONFIG", 160, 48, gotoConfig, scene);
				spr.x = 0;
				spr.y = spr.height * -2;
				return spr;
			})();

			var menu = cc.Menu.create( leftBtn, rightBtn, startBtn, configBtn );
			menu.x = 0;
			menu.y = 0;

			//
			scene.backgroundColor = "rgb( 16, 16, 16)";
			aaa.topNode.addChild(title);
			aaa.centerNode.addChild(player);
			aaa.centerNode.addChild(mapLabel);
			aaa.centerNode.addChild(mapLabel2);
			aaa.centerNode.addChild(menu);
			aaa.bottomNode.addChild(author);
			g_app.addTestHudTo(this);
			//
	
			//
			var fader = this.fader = new Fader( aaa.centerNode );
			fader.setBlack(true);
			fader.fadeIn( 0.2 );
	
			function nextMap() {
				g_app.sound.playSe(res.SND_SE_CURSOR);
				mapIdsIdx = (mapIdsIdx + mapIds.length + 1) % mapIds.length;
				updateMapLabel();
			}

			function prevMap() {
				g_app.sound.playSe(res.SND_SE_CURSOR);
				mapIdsIdx = (mapIdsIdx + mapIds.length - 1) % mapIds.length;
				updateMapLabel();
			}

			function gotoConfig() {
				cc.log("gotoConfig");
				g_app.sound.playSe(res.SND_SE_OK);
				fader.fadeOut( 0.1, () => {
					cc.log("fadeOut end");
					cc.director.runScene(new scenes.Config());
				});
			};

			function gotoGameStart() {
				cc.log( "gotoGameStart" );
				scene.touchEnabled = true;
				g_app.sound.playSe(res.SND_SE_OK);
				var pd = g_app.playerData;
				pd.reset();
				pd.mapId = mapIds[mapIdsIdx];
				fader.fadeOut(0.3, () => {
					cc.director.runScene(new scenes.GameStart());
				});
			};

			mapLabel.visible = 2 <= mapIds.length;
			mapLabel2.visible = 2 <= mapIds.length;
			leftBtn.visible = 2 <= mapIds.length;
			rightBtn.visible = 2 <= mapIds.length;

		},

		onExit: function() {
			this._super();
			this.fader.destroy();
		},



	});
}


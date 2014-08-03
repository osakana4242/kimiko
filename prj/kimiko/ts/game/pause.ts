
/// <reference path="../kimiko.ts" />

module jp.osakana4242.kimiko.game {

	var g_app = jp.osakana4242.kimiko.g_app;
	var DF = jp.osakana4242.kimiko.DF;

	export var PauseMenu: any = cc.Node.extend( {
		ctor: function (exitListener) {
			this._super();

			this.exitListener = exitListener;
			
			var scene = this;

			//
			this.layouter = new kimiko.SpriteLayouter(this);
			this.layouter.layout = (() => {
				var list = [
					[ "spriteName", "layoutName", "visible", "delay",  "x",  "y", ],

					[ "resumeBtn",  "hide",       false,     0.1 * 0,  0,    -0 - 0  + 10, ],
					[ "toTitleBtn", "hide",       false,     0.1 * 1,  0,    -0 - 52 + 10, ],

					[ "resumeBtn",  "normal",     true,      0.1 * 0,  0,    -0 - 0, ],
					[ "toTitleBtn", "normal",     true,      0.1 * 1,  0,    -0 - 52, ],
				];
				return g_app.labeledValuesToObjects(list);
			})();
			//
			var bg = (() => {
				var winSize = cc.director.getWinSize();
				var spr = oskn.Plane.create(cc.color(0x00, 0x00, 0x00, 0x80), winSize.width, winSize.height);
				return spr;
			})();

			var pauseLabel = (() => {
				var label = cc.LabelBMFont.create("PAUSE", res.font_fnt);
				label.x = 0;
				label.y = 80;
				label.runAction(cc.RepeatForever.create(cc.Sequence.create(
					cc.EaseSineInOut.create(cc.MoveBy.create(1.0, cc.p(0,  8))),
					cc.EaseSineInOut.create(cc.MoveBy.create(1.0, cc.p(0, -8)))
				)));
				return label;
			})();
			//
			var toTitleBtn = this.layouter.sprites["toTitleBtn"] = (() => {
				var label = oskn.MenuItem.createByTitle("TO TITLE", 160, 48, () => {
					g_app.sound.playSe(Assets.SOUND_SE_OK);
					cc.director.runScene(new scenes.TitleScene());
				});
				return label;
			})();

			var resumeBtn = this.layouter.sprites["resumeBtn"] = (() => {
				var label = oskn.MenuItem.createByTitle("RESUME", 160, 48, () => {
				scene.removeFromParent();
				});
				return label;
			})();

			var menu = cc.Menu.create(toTitleBtn, resumeBtn);
			menu.x = 0;
			menu.y = 0;

			this.addChild(bg);
			this.addChild(pauseLabel); 
			this.addChild(menu); 

			this.layouter.transition("hide", false);
		},

		onEnter: function() {
			this._super();
			this.layouter.transition("normal", true);
		},

		onExit: function() {
			this._super();
			this.layouter.transition("hide", false);
			if (this.exitListener) {
				this.exitListener();
			}
		},
	});

}


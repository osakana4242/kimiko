
/// <reference path="../kimiko.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko.scenes {

	var g_app = jp.osakana4242.kimiko.g_app;

	export var GameStart: any = cc.Scene.extend( {
		ctor: function () {
			this._super();
			
		},

		onEnter: function () {
			this._super();

			var scene = this;

			var scdSize = oskn.conf.scdSize;
			
			var aaa = this.aaa = new oskn.AspectAnchorAdjuster();
			aaa.addToScene( this );

			//
			var bg1 = ( () => {
				var spr = cc.Sprite.create( res.game_start_bg_png );
				spr.x = 0;
				spr.y = 0;
				return spr;
			} )();
			//
			var label1 = (() => {
				var spr = cc.LabelBMFont.create( "GOOD NIGHT...", res.font_fnt );
				var ax = 0;
				var ay = 0;
				spr.x = ax;
				spr.y = ay;
				spr.runAction( cc.RepeatForever.create( cc.Sequence.create(
					cc.EaseSineInOut.create( cc.MoveTo.create( 1.0, cc.p( ax + 0, ay + 8 * DF.DOWN ) ) ),
					cc.EaseSineInOut.create( cc.MoveTo.create( 1.0, cc.p( ax + 0, ay + 8 * DF.UP   ) ) )
				) ) );
				return spr;
			} )();
			//
			var fader = this.fader = new Fader( aaa.topNode, oskn.conf.scdSize );
			//
			aaa.topNode.addChild(bg1);
			aaa.topNode.addChild(label1); 
			//
			( () => {
				fader.setBlack(true);
				scene.runAction( cc.Sequence.create(
					cc.CallFunc.create( () => {
						fader.fadeIn( 0.5 );
					} ),
					cc.DelayTime.create( 0.5 ),
					cc.DelayTime.create( 2.0 ),
					cc.CallFunc.create( scene.next, scene )
				) );
			} )();


			var listener = cc.EventListener.create( {
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches: true,
				onTouchBegan:     (t, evt) => { return true; },
				onTouchMoved:     (t, evt) => { return true; },
				onTouchEnded:     (t, evt) => { return scene.onTouchEnded(t, evt); },
				onTouchCancelled: (t, evt) => { return scene.onTouchEnded(t, evt); },
			} );
			cc.eventManager.addListener( listener, scene );

		},

		onExit: function () {
			this._super();
		},

		onTouchEnded: function (t, evt) {
			cc.log("onTouchEnded");
			this.next();
			return true;
		},

		next: function () {
			this.fader.fadeOut2( 1.0, new utils.Vector2D( 32, 32 ), () => {
				cc.log( "goto gameScene" );
				cc.director.runScene( new jp.osakana4242.kimiko.scenes.GameScene() );
				//g_app.core.replaceScene(g_app.gameScene);
				//g_app.core.replaceScene(g_app.gameScene);
			} );
		},

	} );
}


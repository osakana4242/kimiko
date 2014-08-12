cc.game.onStart = function(){

	var g_app = jp.osakana4242.kimiko.g_app;
	var env = g_app.env;

	var config = {};
	config.version = "201309292005";
	config.isTestMapEnabled = true;
//	config.isClearStorage = true;
	config.isDamageEnabled = true;
	config.isFireEnabled = true;
	config.fps = cc.game.config.frameRate;
	// タッチとマウスでドラッグによるキャラの移動距離を変える.
	config.swipeToMoveRate = {
		"x": env.isTouchEnabled ? 1.0 : 1.50,
		"y": env.isTouchEnabled ? 1.0 : 1.50
	};
	config.isSoundEnabled = env.isPc;
	config.isSoundEnabled = false;

	cc.game.config.frameRate = config.fps;
//	cc.game.setFrameRate( config.fps );
	// jp.osakana4242.kimiko.start(config);
	cc.director.setAnimationInterval(1.0 / config.fps);

	g_app.init(config);

	var scdSize = oskn.conf.scdSize;
	// cc.view.setDesignResolutionSize( 320, 480, cc.ResolutionPolicy.SHOW_ALL );
	cc.view.setDesignResolutionSize( scdSize.width, scdSize.height, cc.ResolutionPolicy.FIXED_WIDTH );
	cc.view.resizeWithBrowserSize(true);

	//for ( var key in cc.view ) {
	//	cc.log( "view." + key + ": " + ( cc.view[ key ] ) );
	//}

	//load resources
	cc.LoaderScene.preload(g_resources, function () {
		g_app.playerData = new jp.osakana4242.kimiko.PlayerData();
		g_app.testHud = new jp.osakana4242.kimiko.TestHud();
		g_app.testHud.retain();
//		g_app.gameScene = new jp.osakana4242.kimiko.scenes.Game();
		cc.director.runScene( new jp.osakana4242.kimiko.scenes.TitleScene() );
//		cc.director.runScene( new HelloWorldScene() );
	}, g_app);
};

cc.game.run();


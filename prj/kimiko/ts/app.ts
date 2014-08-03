
/// <reference path="oskn.ts" />

/*
	cc
	oskn
*/

/* layout

top
	* one line status
	* act
center
		buttons
bottom
	* buttons

touch area

	480x320
	640x480

	メニューのレイアウトは 240x240 以内で.
	ゲーム全体では 240x320. 

*/

module oskn {
	export class Conf {
		public scdSize = {
			width: 320,
			height: 480
		};
	}
	export var conf = new Conf();

	export class Plane {
		public static create( color, width, height ) {
			var self = cc.LayerColor.create(color, width, height);
			self.ignoreAnchorPointForPosition( false );
			return self;
		}
	}

	export class LabelWithBg {
		public static create( title: string, bgColor: any, width: number, height: number ) {
			var bg = Plane.create( bgColor, width, height );
			var label = cc.LabelBMFont.create( title, res.font_fnt );
			label.x = bg.width / 2;
			label.y = bg.height / 2;
			bg.addChild( label );
			return bg;
		}
	}

	export class MenuItem {

		public static createByTitle( title: string, width: number, height: number, onClick: () => void, targetNode?: any ) {
			var btnIdle     = oskn.LabelWithBg.create( "[" + title + "]", cc.color( 0x60, 0x60, 0x60, 0xff ), width, height );
			var btnActive   = oskn.LabelWithBg.create( "[" + title + "]", cc.color( 0x80, 0x80, 0x80, 0xff ), width, height );
			var btnDisabled = oskn.LabelWithBg.create( title,             cc.color( 0x60, 0x60, 0x60, 0xff ), width, height );

			btnActive.y = -2;

			var item = cc.MenuItemSprite.create(
				btnIdle,
				btnActive,
				btnDisabled,
				onClick,
				targetNode );

			item.attr( {
				x: 0,
				y: 0,
				anchorX: 0.5,
				anchorY: 0.5
			} );
			return item;
		}

	}

	export module WaitUntil {

		var funcs = {
				/**
				 * @return {Boolean}
				 */
				isDone:function () {
						return this._isWaitEnd;
				},

				/**
				 * execute the function.
				 */
				execute:function () {
						if (this._callFunc != null)         //CallFunc, N, ND
								this._isWaitEnd = this._callFunc.call(this._selectorTarget, this.target, this._data);
						else if(this._function)
								this._isWaitEnd = this._function.call(null, this.target);
				},
		};

		export function create(selector, selectorTarget?, data?) {
			var ret = cc.CallFunc.create(selector, selectorTarget, data);

			/** ついか. */
			ret._isWaitEnd = false;
			for (var key in funcs) {
				ret[key] = funcs[key];
			}

			return ret;
		}
	}
}

module oskn.NodeUtils {
	export function visitNodes(node, visitor: ( n ) => void) {
		var children = node.children;
		for (var i = children.length - 1; 0 <= i; --i) {
			oskn.NodeUtils.visitNodes(children[i], visitor);
		}
		visitor(node);
	}
}

module oskn.nodes {
	export function createRectClippingNode(x, y, w, h) {
		if (false) {
			var stencil = null;

			if (false) {
				stencil = cc.LayerColor.create(cc.color(0xff, 0xff, 0xff, 0xff), w, h);
				stencil.setAnchorPoint(0.0, 0.0);
				stencil.x = x - w * 0.5;
				stencil.y = y - h * 0.5;
			} else {
				stencil = cc.Sprite.create(res.clip_png);
				stencil.width = 128;
				stencil.height = 128;
				stencil.scaleX = w / stencil.width;
				stencil.scaleY = h / stencil.height;
			}
			
			var clip = cc.ClippingNode.create(stencil);
			// alphaThreshold のデフォ値は1.0
			//cc.log("alphaThreshold: " + clip.getAlphaThreshold());
			clip.setAlphaThreshold(0.1);
			//clip.setAlphaThreshold(0.9);
			//clip.setAnchorPoint(0.5, 0.5);
			//clip.inverted = true;

	//		clip.update = () => {
	//			clip.stencil.x += 0.5;
	//			if ( 160 < clip.stencil.x ) {
	//				clip.stencil.x = 0;
	//			}
	//		};
	//
	//		clip.scheduleUpdate();
			return clip;
		} else {
			return cc.Node.create();
		}
	}
}





var hoge = {
	nodeLog: function ( node, name ) {
		var p = node.getPosition();
		cc.log(
			JSON.stringify(
				{
					"name": name,
					"position": p,
					"world": node.parent ? node.parent.convertToWorldSpace( p ) : node.convertToWorldSpace( p ),
					"contentSize": node.getContentSize(),
				}
			)
		);
	},
};

var TestScene = cc.Scene.extend( {
	onEnter:function () {
		this._super();
		var scene = this;

		var scdSize = oskn.conf.scdSize;

		var aaa = this.aaa = new oskn.AspectAnchorAdjuster();
		aaa.addToScene( scene );

		var clip = oskn.nodes.createRectClippingNode(0, 0, 32, 32);
		clip.inverted = true;
		aaa.topNode.addChild(clip);

		this.label1 = cc.LabelBMFont.create( "TitleScene", res.font_fnt );
		this.label1.y = ( scdSize.height - this.label1.height ) / 2;
		clip.addChild( this.label1 );

		this.designRect = cc.LayerColor.create();
		this.designRect.setContentSize( scdSize );
		this.designRect.ignoreAnchorPointForPosition( false );
		this.designRect.color = cc.color( 0xff, 0x00, 0x00, 0xff );
		aaa.centerNode.addChild( this.designRect );

		this.designRect2 = cc.LayerColor.create();
		this.designRect2.setContentSize( { width: 240, height: 240 } );
		this.designRect2.ignoreAnchorPointForPosition( false );
		this.designRect2.color = cc.color( 0x00, 0xff, 0x00, 0x80 );
		aaa.centerNode.addChild( this.designRect2 );

		this.menu = ( () => {
			var closeItem = oskn.MenuItem.createByTitle( "next", 120, 48, function() {
				cc.log("Menu is clicked!");
				cc.director.runScene( new ActScene() );
			}, this );
			closeItem.y = ( 240 - closeItem.height ) / 2;

			var menu = cc.Menu.create( closeItem );
			menu.x = 0;
			menu.y = 0;

			return menu;
		} ) ();
		aaa.centerNode.addChild( this.menu );

		var listener = cc.EventListener.create( {
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function (touch, event) {},
			onTouchMoved: function (touch, event) {},
			onTouchEnded: function (touch, event) {},
			onTouchCancelled: function (touch, event) {},
		} );

		

		cc.eventManager.addListener( listener, scene );
		aaa.adjustAnchor();
		this.scheduleUpdate();
	},

	onExit: function () {
	},

	update: function () {
		this.aaa.checkAspect();
	},


} );

var ActScene = cc.Scene.extend( {
	onEnter:function () {
		this._super();
		var scene = this;

		var scdSize = oskn.conf.scdSize;

		this.centerNode2 = cc.Node.create();
		this.addChild( this.centerNode2 );

		var aaa = this.aaa = new oskn.AspectAnchorAdjuster();
		aaa.addToScene( scene );
		aaa.addAnchor( this.centerNode2, "center" );

		this.designRect = cc.LayerColor.create();
		this.designRect.setContentSize( scdSize );
		this.designRect.ignoreAnchorPointForPosition( false );
		this.designRect.color = cc.color( 0xff, 0x00, 0x00 );
		aaa.topNode.addChild( this.designRect );

		this.designRect2 = cc.LayerColor.create();
		this.designRect2.setContentSize( { width: 240, height: 240 } );
		this.designRect2.ignoreAnchorPointForPosition( false );
		this.designRect2.color = cc.color( 0x00, 0xff, 0x00, 0x80 );
		this.centerNode2.addChild( this.designRect2 );

		this.map = cc.TMXTiledMap.create( res.map001_tmx );
		aaa.topNode.addChild( this.map );

		this.label1 = cc.LabelBMFont.create( "ActScene", res.font_fnt );
		this.label1.y = ( scdSize.height - this.label1.height ) / 2;
		aaa.topNode.addChild( this.label1 );

		this.menu = ( () => {
			var closeItem = oskn.MenuItem.createByTitle( "next", 120, 48, function() {
				cc.log("Menu is clicked!");
				cc.director.runScene( new TestScene() );
			}, this );
			closeItem.y = ( 240 - closeItem.height ) / 2;

			var menu = cc.Menu.create( closeItem );
			menu.x = 0;
			menu.y = 0;

			return menu;
		} ) ();
		this.centerNode2.addChild( this.menu );

		var listener = cc.EventListener.create( {
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function (touch, event) {},
			onTouchMoved: function (touch, event) {},
			onTouchEnded: function (touch, event) {},
			onTouchCancelled: function (touch, event) {},
		} );

		

		cc.eventManager.addListener( listener, scene );
		aaa.adjustAnchor();
		this.scheduleUpdate();
	},

	onExit: function () {
	},

	update: function () {
		this.aaa.checkAspect();
	},


} );

var HelloWorldLayer = cc.Layer.extend({
	sprite:null,
	ctor:function () {
		//////////////////////////////
		// 1. super init first
		this._super();

		/////////////////////////////
		// 2. add a menu item with "X" image, which is clicked to quit the program
		//	you may modify it.
		// ask director the window size
		var size = cc.director.getWinSize();

		// add a "close" icon to exit the progress. it's an autorelease object
		var closeItem = cc.MenuItemImage.create(
			res.CloseNormal_png,
			res.CloseSelected_png,
			function () {
				cc.log("Menu is clicked!");
			}, this);
		closeItem.attr({
			x: size.width - 20,
			y: 20,
			anchorX: 0.5,
			anchorY: 0.5
		});

		var menu = cc.Menu.create(closeItem);
		menu.x = 0;
		menu.y = 0;
		this.addChild(menu, 1);

		/////////////////////////////
		// 3. add your codes below...
		// add a label shows "Hello World"
		// create and initialize a label
		var helloLabel = cc.LabelTTF.create("Hello World", "Arial", 38);
		// position the label on the center of the screen
		helloLabel.x = size.width / 2;
		helloLabel.y = 0;
		// add the label as a child to this layer
		this.addChild(helloLabel, 5);

		// add "HelloWorld" splash screen"
		this.sprite = cc.Sprite.create(res.HelloWorld_png);
		this.sprite.attr({
			x: size.width / 2,
			y: size.height / 2,
			scale: 0.5,
			rotation: 180
		});
		this.addChild(this.sprite, 0);

		var rotateToA = cc.RotateTo.create(2, 0);
		var scaleToA = cc.ScaleTo.create(2, 1, 1);

		this.sprite.runAction(cc.Sequence.create(rotateToA, scaleToA));
		helloLabel.runAction(cc.Spawn.create(cc.MoveBy.create(2.5, cc.p(0, size.height - 40)),cc.TintTo.create(2.5,255,125,0)));
		return true;
	}
});

var HelloWorldScene = cc.Scene.extend({
	onEnter:function () {
		this._super();

		var wSize = cc.director.getWinSize();

		var clippingNode = oskn.nodes.createRectClippingNode(0, 0, 320, 160);
		clippingNode.setAnchorPoint(0.5, 0.5);
		clippingNode.x = wSize.width * 0.5;
		clippingNode.y = wSize.height * 0.5;

		var layer = new HelloWorldLayer();
		layer.x = - wSize.width * 0.5;
		layer.y = - wSize.height * 0.5;

		var node = cc.Node.create();
		node.addChild(layer);

		clippingNode.addChild(node);
		this.addChild(clippingNode);
	}
});


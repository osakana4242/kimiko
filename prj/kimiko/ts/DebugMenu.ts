
/// <reference path="oskn.ts" />

module oskn {
	class DebugTool {
		constructor( public node ) {
		}
		label( str: string ): void {
			if ( !this.node.label ) {
				var size = cc.view.getDesignResolutionSize();
				this.node.label = cc.LabelBMFont.create( "debug", res.font_fnt );
				this.node.label.y = size.height * 0.5 - 30;
				this.node.addChild( this.node.label, 1 );
			}
			this.node.label.setString( str );
		}
	}

	var DebugLayer = cc.Node.extend( {
		ctor: function (): boolean {
			this._super();

			this.tool = new DebugTool( this );
			this.menus = {};

			this.addMenu( "info", ( tool: DebugTool ) => {
				tool.label( "unko" );
			} );

			return true;
		},

		addMenu: function ( name: string, menu ) {
			this.menus[ name ] = menu;
			this.curMenuName = name;
		},

		onEnter: function () {
			this._super();

			this.scheduleUpdate();
		},

		update: function ( delta: number ) {
			this.menus[ this.curMenuName ]( this.tool );
		},

	} );
}


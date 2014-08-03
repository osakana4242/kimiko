
/// <reference path="oskn.ts" />

module oskn {
	export class AspectAnchorAdjuster {
		
		anchors: any[] = [];

		baseSize = { width: 320, height: 480 };
		baseAspect = 320.0 / 480.0;
		curAspect: number;
		originNode: any;
		topNode: any;
		centerNode: any;
		bottomNode: any;
		onAdjust: () => void = function () {};

		constructor() {
			this.curAspect = this.baseAspect;
			this.baseSize = oskn.conf.scdSize;
		}

		addToScene( scene: any ) {
			this.originNode = cc.Node.create();
			scene.addChild( this.originNode, 10 );

			this.topNode = cc.Node.create();
			this.centerNode = cc.Node.create();
			this.bottomNode = cc.Node.create();

			this.originNode.addChild( this.topNode );
			this.originNode.addChild( this.centerNode );
			this.originNode.addChild( this.bottomNode );

			this.addAnchor( this.topNode, "top" );
			this.addAnchor( this.centerNode, "center" );
			this.addAnchor( this.bottomNode, "bottom" );

			this.adjustAnchor();
			scene.schedule( () => {
				this.checkAspect();
			} );
		}
		
		addAnchor( node: any, typ: string ): void {
			var anchor = {
				"typ": typ,
				"node": node,
				"baseY": 0,
			};
			cc.log( "baseSize: " + JSON.stringify( this.baseSize ) );
			switch ( typ ) {
			case "top":
				anchor.baseY = this.baseSize.height * 0.5;
				break;
			case "bottom":
				anchor.baseY = - this.baseSize.height * 0.5;
				break;
			case "center":
			default:
				break;
			}
			this.anchors.push( anchor );
			this.adjustAnchor();
		}

		checkAspect(): void {
			var size = cc.director.getWinSize();
			var aspect = size.width / size.height;
			if ( this.curAspect === aspect ) {
				return;
			}
			this.curAspect = aspect;
			this.adjustAnchor();
		}

		adjustAnchor() {
			//
			var size = cc.director.getWinSize();
			this.originNode.x = size.width * 0.5;
			this.originNode.y = size.height * 0.5;
			//
			var scaleY = size.height / this.baseSize.height;
			cc.log( "checkAspect, scaleY: " + scaleY );
			for ( var i = this.anchors.length - 1; 0 <= i; --i ) {
				var anchor = this.anchors[ i ];
				var diffY =  ( anchor.baseY * scaleY ) - anchor.baseY;
				var p = this.originNode.parent.convertToWorldSpace( this.originNode.getPosition() );
				p.x = this.originNode.x;
				p.y = this.originNode.y + diffY;
				if ( anchor.node.parent ) {
					anchor.node.setPosition( anchor.node.parent.convertToNodeSpace( p ) );
				} else {
					anchor.node.setPosition( anchor.node.convertToNodeSpace( p ) );
				}
			}
			this.onAdjust();
		}

	}
}


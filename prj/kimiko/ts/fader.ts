// references
/// <reference path="kimiko.ts" />
//

module jp.osakana4242.kimiko.scenes {

	export class Fader {
		targetNode: any;
		film: any;
		scSize: { width: number; height: number; };
		color: any;

		constructor(targetNode: any, scSize?: any ) {
			this.targetNode = targetNode;
			this.color = cc.color(0x80, 0x80, 0x00, 0xff);

			if ( scSize ) {
				this.scSize = scSize;
			} else {
				this.scSize = cc.director.getWinSize();
			}

			this.film = ( () => {
				var spr = oskn.Plane.create( this.color, this.scSize.width, this.scSize.height );
				spr.retain();
				spr.touchEnabled = true;
				return spr;
			} )();
		}

		public destroy() {
			if (this.film) {
				this.film.release();
				this.film = null;
			}
		}

		private addFilm(): any {
			this.removeFilm();
			this.targetNode.addChild( this.film );
			return this.film;
		}

		private removeFilm(): any {
			var film = this.film;
			film.removeFromParent(false);
			return film;
		}

		get isOpend(): boolean {
			return this.film.getOpacity() === 0.0 && this.film.getNumberOfRunningActions() === 0;
		}

		setBlack(isBlack: boolean):void {
			if (isBlack) {
				var film = this.addFilm();
				film.setOpacity( 0xff );
			} else {
				var film = this.removeFilm();
				film.setOpacity( 0x00 );
			}
		}
	
		fadeIn(fadeFrame: number, callback: () => void = null): void {
			var film = this.addFilm();
			film.stopAllActions();
			film.runAction( cc.Sequence.create(
				cc.FadeTo.create( fadeFrame, 0.0 ),
				cc.CallFunc.create( () => {
					if (callback) {
						callback();
					}
					film.removeFromParent(false);
				} )
			) );
		}

		fadeOut(fadeFrame: number, callback: () => void = null): void {
			var film = this.addFilm();
			film.stopAllActions();
			film.runAction( cc.Sequence.create(
				cc.FadeTo.create( fadeFrame, 0xff ),
				cc.CallFunc.create( () => {
					if (callback) {
						callback();
					}
				} )
			) );
		}	

		/** キャラにスポット */
		fadeIn2(fadeFrame: number, target: utils.IVector2D, callback: () => void = null): void {
			var films = [];
			var sideLength = Math.max( this.scSize.width, this.scSize.height );
			var scW = sideLength;
			var scH = sideLength;
			var scLeft =   - scW;
			var scTop =      scH;
			var scRight =    scW;
			var scBottom = - scH;
			var scCenterX = 0;
			var scCenterY = 0;

			var frame = fadeFrame * 0.9;
			for (var i = 0, iNum = 4; i < iNum; ++i) {
				var film = oskn.Plane.create(this.color, scW * 2, scH * 2);
				var mx = 0;
				var my = 0;
				switch (i) {
				case 0:
					// 左へ.
					film.x = scCenterX + film.width / 2 * DF.LEFT;
					film.y = scCenterY;
					mx = (scLeft + film.width / 2 * DF.LEFT) - film.x;
					my = 0;
					break;
				case 1:
					// 右へ.
					film.x = scCenterX + film.width / 2 * DF.RIGHT;
					film.y = scCenterY;
					mx = (scRight + film.width / 2 * DF.RIGHT) - film.x;
					my = 0;
					break;
				case 2:
					// 上へ.
					film.x = scCenterX;
					film.y = scCenterY + film.height / 2 * DF.UP;
					mx = 0;
					my = (scTop + film.height / 2 * DF.UP) - film.y;
					break;
				case 3:
					// 下へ.
					film.x = scCenterX;
					film.y = scCenterY + film.height / 2 * DF.DOWN;
					mx = 0;
					my = (scBottom + film.height / 2 * DF.DOWN) - film.y;
					break;
				}
				film.runAction( cc.Sequence.create(
					cc.EaseSineOut.create( cc.MoveBy.create( frame * 0.4, cc.p( mx * 0.1, my * 0.1 ) ) ),
					cc.EaseSineIn.create(  cc.MoveBy.create( frame * 0.6, cc.p( mx * 0.9, my * 0.9 ) ) )
				) );
				films.push(film);
			}

			var group = cc.Node.create();
			group.schedule( () => {
				// ターゲットを追う.
				group.x = target.x;
				group.y = target.y;
			} );
			
			group.runAction( cc.Sequence.create(
				cc.DelayTime.create(fadeFrame * 0.1),
				cc.CallFunc.create( () => {
					for (var i = 0, iNum = films.length; i < iNum; ++i) {
						group.addChild(films[i]);
					}
					this.setBlack(false);
				} ),
				cc.DelayTime.create(fadeFrame * 0.9),
				cc.CallFunc.create( () => {
					group.removeFromParent(false);
					if (callback) {
						callback();
					}
				} )
			) );
			this.setBlack(true);
			this.targetNode.addChild(group);
		}	

		/** キャラにスポット */
		fadeOut2(fadeFrame: number, target: utils.IVector2D, callback: () => void = null): void {
			var films = [];
			var sideLength = Math.max( this.scSize.width, this.scSize.height );
			var scW = sideLength;
			var scH = sideLength;
			var scLeft =   - scW;
			var scTop =      scH;
			var scRight =    scW;
			var scBottom = - scH;
			var scCenterX = 0;
			var scCenterY = 0;

			var frame = fadeFrame * 0.9;
			for (var i = 0, iNum = 4; i < iNum; ++i) {
				var film = oskn.Plane.create(this.color, scW * 2, scH * 2 );
				var mx = 0;
				var my = 0;
				switch (i) {
				case 0:
					// 右へ.
					film.x = scLeft - film.width / 2;
					film.y = scCenterY;
					mx = ( scCenterX - film.width / 2 ) - film.x;
					my = 0;
					break;
				case 1:
					// 左へ.
					film.x = scRight + film.width / 2;
					film.y = scCenterY;
					mx = ( scCenterX + film.width / 2 ) - film.x;
					my = 0;
					break;
				case 2:
					// 下へ.
					film.x = scCenterX;
					film.y = scTop + film.height / 2;
					mx = 0;
					my = ( scCenterY + film.height / 2 ) - film.y;
					break;
				case 3:
					// 上へ.
					film.x = scCenterX;
					film.y = scBottom - film.height / 2;
					mx = 0;
					my = ( scCenterY - film.height / 2 ) - film.y;
					break;
				}
				film.runAction( cc.Sequence.create(
					cc.EaseSineOut.create( cc.MoveBy.create( frame * 0.6, cc.p( mx * 0.9, my * 0.9 ) ) ),
					cc.EaseSineIn.create(  cc.MoveBy.create( frame * 0.4, cc.p( mx * 0.1, my * 0.1 ) ) )
				) );

				films.push(film);
			}

			var group = cc.Node.create();
			group.schedule( () => {
				group.x = target.x;
				group.y = target.y;
			} );
			
			group.runAction( cc.Sequence.create(
				cc.DelayTime.create( fadeFrame * 0.9 ),
				cc.CallFunc.create( () => {
					this.setBlack( true );
				} ),
				cc.DelayTime.create( fadeFrame * 0.1 ),
				cc.CallFunc.create( () => {
					this.setBlack(true);
					group.removeFromParent(false);
					for (var i = 0, iNum = films.length; i < iNum; ++i) {
						var film = films[i];
						film.removeFromParent(false);
					}
					if (callback) {
						callback();
					}
				} )
			) );
				
			for (var i = 0, iNum = films.length; i < iNum; ++i) {
				group.addChild(films[i]);
			}

			this.targetNode.addChild(group);
		}	

	}

}


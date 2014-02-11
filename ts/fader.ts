// references
/// <reference path="kimiko.ts" />
//

declare var enchant: any;

module jp.osakana4242.kimiko.scenes {

	var Class = enchant.Class;
	var Core = enchant.Core;
	var Scene = enchant.Scene;
	var Label = enchant.Label;
	var Event = enchant.Event;
	var Easing = enchant.Easing;

	export class Fader {
		scene: any;
		film: any;

		constructor(scene: any) {
			this.scene = scene;
			this.film = (() => {
				var spr = new enchant.Sprite(DF.SC_W, DF.SC_H);
				spr.backgroundColor = "rgb(0, 0, 0)";
				return spr;
			})();
		}

		private addFilm(): any {
			this.removeFilm();
			this.scene.addChild(this.film);
			return this.film;
		}

		private removeFilm(): any {
			var film = this.film;
			if (film.parentNode) {
				film.parentNode.removeChild(film);
			}
			return film;
		}

		setBlack(isBlack: boolean):void {
			if (isBlack) {
				var film = this.addFilm();
				film.opacity = 1.0;
			} else {
				var film = this.removeFilm();
				film.opacity = 0.0;
			}
		}
		
		fadeIn(fadeFrame: number, callback: () => void = null): void {
			var film = this.addFilm();
			film.tl.
				clear().
				fadeTo(0.0, fadeFrame);
			if (callback) {
				film.tl.then(callback);
			}
			film.tl.removeFromParentNode();
		}

		fadeOut(fadeFrame: number, callback: () => void = null): void {
			var film = this.addFilm();
			film.tl.
				clear().
				fadeTo(1.0, fadeFrame);
			if (callback) {
				film.tl.then(callback);
			}
		}	

		/** キャラにスポット */
		fadeIn2(fadeFrame: number, target: utils.IVector2D, callback: () => void = null): void {
			var films = [];

			var scLeft =   - DF.SC_W;
			var scTop =    - DF.SC_H;
			var scRight =    DF.SC_W;
			var scBottom =   DF.SC_H;
			var scCenterX = 0;
			var scCenterY = 0;

			var frame = fadeFrame * 0.9;
			for (var i = 0, iNum = 4; i < iNum; ++i) {
				var film = new enchant.Sprite(DF.SC_W * 2, DF.SC_H * 2);
				film.backgroundColor = "rgb(0, 0, 0)";
				var mx = 0;
				var my = 0;
				switch (i) {
				case 0:
					film.x = scCenterX - film.width;
					film.y = scCenterY - film.height / 2;
					mx = (scLeft - film.width) - film.x;
					my = 0;
					break;
				case 1:
					film.x = scCenterX;
					film.y = scCenterY - film.height / 2;
					mx = scRight - film.x;
					my = 0;
					break;
				case 2:
					film.x = scCenterX - film.width / 2;
					film.y = scCenterY - film.height;
					mx = 0;
					my = (scTop - film.height) - film.y;
					break;
				case 3:
					film.x = scCenterX - film.width / 2;
					film.y = scCenterY;
					mx = 0;
					my = scBottom - film.y;
					break;
				}
				film.tl.
					moveBy(mx * 0.1, my * 0.1, frame * 0.4, Easing.CUBIC_EASEOUT).
					moveBy(mx * 0.9, my * 0.9, frame * 0.6, Easing.CUBIC_EASEIN);
				films.push(film);
			}

			var group = new enchant.Group();
			group.addEventListener(Event.ENTER_FRAME, () => {
				// ターゲットを追う.
				group.x = target.x;
				group.y = target.y;
			});
			
			group.tl.
				delay(fadeFrame * 0.1).
				then(() => {
					for (var i = 0, iNum = films.length; i < iNum; ++i) {
						group.addChild(films[i]);
					}
					this.setBlack(false);
				}).
				delay(fadeFrame * 0.9).
				then(() => {
					group.parentNode.removeChild(group);
					if (callback) {
						callback();
					}
				});

			this.setBlack(true);
			this.scene.addChild(group);
		}	

		/** キャラにスポット */
		fadeOut2(fadeFrame: number, target: utils.IVector2D, callback: () => void = null): void {
			var films = [];

			var scLeft =   - DF.SC_W;
			var scTop =    - DF.SC_H;
			var scRight =    DF.SC_W;
			var scBottom =   DF.SC_H;
			var scCenterX = 0;
			var scCenterY = 0;

			var frame = fadeFrame * 0.9;
			for (var i = 0, iNum = 4; i < iNum; ++i) {
				var film = new enchant.Sprite(DF.SC_W * 2, DF.SC_H * 2);
				film.backgroundColor = "rgb(0, 0, 0)";
				var mx = 0;
				var my = 0;
				switch (i) {
				case 0:
					film.x = scLeft - film.width;
					film.y = scCenterY - film.height / 2;
					mx = (scCenterX - film.width) - film.x;
					my = 0;
					break;
				case 1:
					film.x = scRight;
					film.y = scCenterY - film.height / 2;
					mx = scCenterX - film.x;
					my = 0;
					break;
				case 2:
					film.x = scCenterX - film.width / 2;
					film.y = scTop - film.height;
					mx = 0;
					my = (scCenterY - film.height) - film.y;
					break;
				case 3:
					film.x = scCenterX - film.width / 2;
					film.y = scBottom;
					mx = 0;
					my = scCenterY - film.y;
					break;
				}
				film.tl.
					moveBy(mx * 0.9, my * 0.9, frame * 0.6, Easing.CUBIC_EASEOUT).
					moveBy(mx * 0.1, my * 0.1, frame * 0.4, Easing.CUBIC_EASEIN);
				films.push(film);
			}

			var group = new enchant.Group();
			group.addEventListener(Event.ENTER_FRAME, () => {
				group.x = target.x;
				group.y = target.y;
			});
			
			group.tl.
				delay(fadeFrame * 0.9).
				then(() => { this.setBlack(true); }).
				delay(fadeFrame * 0.1).
				then(() => {
					this.setBlack(true);
					group.parentNode.removeChild(group);
					for (var i = 0, iNum = films.length; i < iNum; ++i) {
						var film = films[i];
						film.parentNode.removeChild(film);
					}
					if (callback) {
						callback();
					}
				});
			for (var i = 0, iNum = films.length; i < iNum; ++i) {
				group.addChild(films[i]);
			}
			this.scene.addChild(group);
		}	

	}

}


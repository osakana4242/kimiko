// references
/// <reference path="../kimiko.ts" />

module jp.osakana4242.kimiko.game {
	export class GameMap {
		public map;
		private layers = {};

		public load(name: string) {
			this.layers = {};
			this.map.removeAllChildren(true);
			this.map.initWithTMXFile(name);
		}

		public getLayer(name: string): GameMapLayer {
			var la = this.layers[name];
			if (!la) {
				var layer = this.map.getLayer(name);
				if (!layer) {
					throw "layer not found. name:" + name;
				}
				la = this.layers[name] = new GameMapLayer(layer);
			}
			return la;
		}

		public static create(): GameMap {
			cc.log("GameMap.create");
			var self = new GameMap();
			self.map = cc.TMXTiledMap.create(res.map101_tmx);
			if (!self.map) {
				throw "map create failed?";
			}
			return self;
		}
	}

	export class GameMapLayer {
		layer: any;
		
		constructor(layer: any) {
			this.layer = layer;
		}
	
		getTileGIDByWorldPos(wldPos: utils.IVector2D): number {
			var layer = this.layer;
			var size = layer.getLayerSize();
			var gridPos = this.worldToGridPos(wldPos);
			if ( gridPos.x < 0 || size.width <= gridPos.x || gridPos.y < 0 || size.height <= gridPos.y ) {
				return 0;
			}
			var gid = layer.getTileGIDAt(gridPos);
			return gid;
		}

		worldToGridPos(wldPos: utils.IVector2D): utils.IVector2D {
			var layer = this.layer;
			var size = layer.getLayerSize();
			return cc.p(
				Math.floor(wldPos.x / layer.tileWidth),
				Math.floor((layer.height - wldPos.y) / layer.tileHeight)
			);
		}

		gridToWorldPos(gridPos: utils.IVector2D): utils.IVector2D {
			var layer = this.layer;
			return cc.p(
				gridPos.x * layer.tileWidth,
				layer.height - gridPos.y * layer.tileHeight
			);
		}

		eachTileGIDs(func: (value: number, gridPos: utils.IVector2D, layer: GameMapLayer) => void) {
			var layer = this.layer;
			var size = layer.getLayerSize();
			var p = cc.p(0, 0);
			for (var y = 0, yNum = size.height; y < yNum; ++y) {
				for (var x = 0, xNum = size.width; x < xNum; ++x) {
					p.x = x;
					p.y = y;
					func(layer.getTileGIDAt(p), p, this);
				}
			}
		}

		getGID(wldX: number, wldY: number): number {
			var layer = this.layer;
			var size = layer.getLayerSize();
			var x = Math.floor(wldX / layer.tileWidth);
			var y = Math.floor((layer.height - wldY) / layer.tileHeight);
			if ( x < 0 || size.width <= x || y < 0 || size.height <= y ) {
				return 0;
			}
			var gid = layer.getTileGIDAt(cc.p(x, y));
			return gid;
		}

	}


}


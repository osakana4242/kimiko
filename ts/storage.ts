
/// <reference path="kimiko.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko {

	var DF = jp.osakana4242.kimiko.DF;
	
	export module storage {

		export interface IRoot {
			version: number;
			userConfig: IUserConfig;
			userMaps: { [index: number]: IUserMap; };
		}

		export interface IUserConfig {
			isSeEnabled: boolean;
			isBgmEnabled: boolean;
			fps: number;
			isFpsVisible: boolean;
		}

		export interface IUserMap {
			mapId: number;
			score: number;
			playCount: number;
		}


	}

	export class Storage {

		public static storageVersion = 1;
		public static storageKey = "jp.osakana4242.kimiko.v" + Storage.storageVersion;

		public root: storage.IRoot = null;
		private defaultRoot: storage.IRoot = null;

		constructor() {
			this.defaultRoot = {
				"version": Storage.storageVersion,
				"userConfig": {
					"isSeEnabled":  app.env.isPc,
					"isBgmEnabled": app.env.isPc,
					"fps":          app.config.fps || app.env.isPc ? 60 : 20,
					"isFpsVisible": true,
				},
				"userMaps": {},
			};
			this.root = this.defaultRoot;
		}

		public load() {
			var fromStorage: storage.IRoot = null;
			/** ロードしたデータが有効なものか. */
			var isValid = false;
			try {
				var jsonString = localStorage.getItem(Storage.storageKey);
				console.log( "Storage.load: " + jsonString);
				if (jsonString) {
					var fromStorage: storage.IRoot = JSON.parse(jsonString);
					isValid = this.isValid(fromStorage);
				}
			} catch (ex) {
				console.log( "ex: " + ex);
			}

			if (isValid) {
				// ロード成功.
				this.root = fromStorage;
			} else {
				// ロード失敗.
				console.log("load failed.");
			}
		}

		public save() {
			var jsonString = JSON.stringify(this.root);
			console.log( "Storage.save: " + jsonString);
			localStorage.setItem(Storage.storageKey, jsonString);
		}

		public clear() {
			localStorage.setItem(Storage.storageKey, "");
		}

		public getUserMapForUpdate(mapId: number) {
			var userMap = this.root.userMaps[mapId];
			if (!userMap) {
				userMap = {
					"mapId": mapId,
					"score": 0,
					"playCount": 0,
				};
				this.root.userMaps[mapId] = userMap;
			}
			return userMap;
		}

		/** 正しいロードデータか? */
		private isValid(fromStorage: storage.IRoot): boolean {
			if (fromStorage.version !== this.defaultRoot.version) {
				return false;
			}
			for (var key in this.defaultRoot) {
				if (!(key in fromStorage)) {
					return false;
				}
			}
			return true;
		}

	}
}



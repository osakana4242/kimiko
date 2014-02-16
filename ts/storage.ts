
/// <reference path="kimiko.ts" />

declare var enchant: any;

module jp.osakana4242.kimiko {

	var DF = jp.osakana4242.kimiko.DF;
	
	export module storage {

		export interface IRoot {
			version: number;
			user: IUser;
			userMaps: { [index: number]: IUserMap; };
		}

		export interface IUser {
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

		public load() {
			var orig: storage.IRoot = null;
			var jsonString = localStorage.getItem(Storage.storageKey);
			console.log( "Storage.load: " + jsonString);
			if (jsonString) {
				var orig: storage.IRoot = JSON.parse(jsonString);
				if (orig.version === Storage.storageVersion) {
					this.root = orig;
				}
			}
			if (orig === null) {
				this.root = {
					"version": Storage.storageVersion,
					"user": {},
					"userMaps": {},
				};
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

	}
}



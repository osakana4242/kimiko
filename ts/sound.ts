declare var enchant: any;

module jp.osakana4242.kimiko {

	export interface ISoundInfo {
		assetName: string;
		playTime: number;
		isLoop: boolean;
	}

	export class SoundChannel {
		enchantSound: any;
		soundInfo: ISoundInfo;
		isPlaying = false;
		timeoutId = null;
		/** for setTimeout */
		__play: () => void;

		constructor() {
			this.__play = () => { this._play(); };
		}

		public play(soundInfo: ISoundInfo, enchantSound: any) {
			this.soundInfo = soundInfo;
			this.enchantSound = enchantSound;
			this.isPlaying = true;
			this._play();
		}
		
		public clearTimeout() {
			if (this.timeoutId != null) {
				window.clearTimeout(this.timeoutId);
				this.timeoutId = null;
			}
		}
		
		public stop() {
			this.isPlaying = false;
			this.clearTimeout();
			this._stop();
		}

		private _play() {
			this.timeoutId = null;
			this.clearTimeout();
			this._stop();
			if (this.isPlaying) {
				this.enchantSound.play();
				if (this.soundInfo.isLoop) {
					var time = Math.floor(this.soundInfo.playTime * 1000);
					this.timeoutId = window.setTimeout(this.__play, time);
				}
			}
		}
		
		private _stop() {
			if (!this.enchantSound) {
				return;
			}
			try {
				this.enchantSound.stop();
			} catch (e) {
				if (e.message == "DOM Exception: INVALID_STATE_ERR (11)") {
					// IE で発生するけど、無視してもだいじょぶそう。。。
				} else {
					throw e;
				}
			}
		}
		
	};

	export class Sound {
		public channels = {
			"bgm": new SoundChannel(),
			"se": new SoundChannel(),
		};
		private assetCache = {};
		public soundInfos: { [index: string]: ISoundInfo; } = {};

		public playBgm(assetName: string, isReplay: boolean) {
			var channel = this.channels["bgm"];
			if (isReplay || !channel.isPlaying || channel.soundInfo.assetName !== assetName) {
				this.play("bgm", assetName);
			}
		}

		public stopBgm() {
			this.stop("bgm");
		}

		public playSe(assetName: string) {
			this.play("se", assetName);
		}

		public play(channelName: string, assetName: string) {
			if (!app.config.isSoundEnabled) {
				return;
			}

			var soundInfo = this.soundInfos[assetName]
			var asset = this.assetCache[soundInfo.assetName];
			if (!asset) {
				asset = this.assetCache[soundInfo.assetName] = enchant.Core.instance.assets[soundInfo.assetName];
			}
			
			this.stop(channelName);
			var channel = this.channels[channelName];
			channel.play(soundInfo, asset);
		}

		public stop(channelName: string) {
			if (!app.config.isSoundEnabled) {
				return;
			}
			
			var channel = this.channels[channelName];
			channel.stop();
		}
		public add(soundInfo: ISoundInfo) {
			this.soundInfos[soundInfo.assetName] = soundInfo;
		}
	}
}	


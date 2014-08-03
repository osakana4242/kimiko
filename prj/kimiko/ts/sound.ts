
module jp.osakana4242.kimiko {

	export interface ISoundInfo {
		assetName: string;
		playTime: number;
		isLoop: boolean;
		priority: number;
	}

	export class SoundChannel {
		enchantSound: any;
		soundInfo: ISoundInfo;
		isPlaying = false;
		timeoutId = null;
		/** for setTimeout */
		_onOneLoop: () => void;
		_isEnabled: boolean = true;
		
		constructor() {
			this._onOneLoop = () => { this.onOneLoop(); };
		}

		public get isEnabled(): boolean {
			return this._isEnabled;
		}

		public set isEnabled(value: boolean){
 			this._isEnabled = value;
			if (!this._isEnabled) {
				this.stop();
			}
		}

		public play(soundInfo: ISoundInfo, enchantSound: any) {
			if (!this.isEnabled) {
				return;
			}
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
				var time = Math.floor(this.soundInfo.playTime * 1000);
				this.timeoutId = window.setTimeout(this._onOneLoop, time);
			}
		}
		
		private onOneLoop() {
			if (this.soundInfo.isLoop) {
				this._play();
			} else {
				this.isPlaying = false;
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
			if (!this.channels["bgm"].isEnabled) {
				return;
			}
			cc.audioEngine.playMusic( assetName, true );
			return;

			var channel = this.channels["bgm"];
			if (isReplay || !channel.isPlaying || channel.soundInfo.assetName !== assetName) {
				this.play("bgm", assetName);
			}
		}

		public stopBgm() {
			cc.audioEngine.stopMusic();
			// this.stop("bgm");
		}

		public playSe(assetName: string) {
			if (!this.channels["se"].isEnabled) {
				return;
			}
			// cc.audioEngine.stopEffect( soundId );
			var soundId = cc.audioEngine.playEffect( assetName, false );
			// this.play("se", assetName);
		}

		public setBgmEnabled(value: boolean) {
			this.channels["bgm"].isEnabled = value;
		}

		public setSeEnabled(value: boolean) {
			this.channels["se"].isEnabled = value;
		}

		public play(channelName: string, assetName: string) {
			return;
			if (!g_app.env.isSoundEnabled) {
				return;
			}

			var soundInfo = this.soundInfos[assetName]
			var asset = this.assetCache[soundInfo.assetName];
			if (!asset) {
//				asset = this.assetCache[soundInfo.assetName] = enchant.Core.instance.assets[soundInfo.assetName];
			}

			var channel = this.channels[channelName];

			if (channel.isPlaying && soundInfo.priority < channel.soundInfo.priority) {
				return;
			}
			this.stop(channelName);
			channel.play(soundInfo, asset);
		}

		public stop(channelName: string) {
			if (!g_app.env.isSoundEnabled) {
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



module jp.osakana4242.kimiko {
	
	export class Env {
		public userAgent: string;
		public isIos: boolean;
		public isAndroid: boolean;
		public isSp: boolean;
		public isPc: boolean;
		public isTouchEnabled: boolean;
		public isSoundEnabled: boolean;

		constructor() {
//		 	var ua = navigator ?
//				navigator.userAgent :
//				"";
			var ua = "";
			this.userAgent = ua;
			this.isIos = ((ua.indexOf('iPhone') > 0 && ua.indexOf('iPad') === -1) || ua.indexOf('iPod') > 0);
			this.isAndroid = (ua.indexOf('Android') > 0);
			this.isSp = this.isIos || this.isAndroid;
			this.isPc = !this.isSp;
			this.isTouchEnabled = this.isSp;
			this.isSoundEnabled = this.isPc;
			cc.log("Env: " + JSON.stringify(this));
		}
	}
}


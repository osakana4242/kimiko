/*
	grunt 環境設定コマンド.

	$ npm install grunt-contrib-watch --save-dev
	$ npm install grunt-typescript --save-dev
	$ npm install grunt-contrib-clean --save-dev
	$ npm install grunt-contrib-copy --save-dev

*/


module.exports = function(grunt) {

	var rootPath = './';
	//Gruntの設定
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			files: [rootPath + '/ts/**/*.ts'],
			tasks: ['clean:build', 'typescript', 'copy', 'watch_end_echo']
		},
		clean: {
			build: [rootPath + '/cocos/src/app.js'],
		},
		typescript: {
			base: {
				src: [rootPath + '/ts/**/*.ts'],
				dest: rootPath + '/cocos/src/app.js',
				options: {
					module: 'amd', //or commonjs
					target: 'es5', //or es3
					basePath: 'ts',
					sourceMap: false,
					declaration: false
				}
			}
		},
		copy : {
				js : {
					files : [{expand: true, cwd:'cocos/src/', src:'*.js', dest:'cocos/runtime/ios/cocos2d-x-rc1.app/src/'}]
				},
		}
	});

	grunt.loadNpmTasks('grunt-typescript');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');

	//defaultタスクの定義
	grunt.registerTask('default', 'Log some stuff.', function() {
		//ログメッセージの出力
		grunt.log.write('Logging some stuff...').ok();
	});
	grunt.registerTask('watch_end_echo', 'hoge', function() {
		grunt.log.write('watch_end').ok();
	});

};


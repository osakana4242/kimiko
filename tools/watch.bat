@rem *.ts の watch をする.
@echo ON
%~d0
cd %~p0
@call _conf.bat
@title %~n0

@set TS_FILELIST=%PRJ_DIR%\temp\ts_filelist.txt
@rem watch対象のtsファイルを出力.
@dir /b /S "%TS_DIR%\*.ts" > "%TS_FILELIST%"
@rem watch 開始
%NODE_JS_TSC% --target ES5 --watch @"%TS_FILELIST%" --out "%JS_DIR%\kimiko.js"
@cd %PRJ_DIR%

@rem *.ts の watch をする.
@echo ON
%~d0
cd %~p0
@call _conf.bat
@title %~n0
@rem watch対象のtsファイルを出力.
@rem dir /b /S %TS_DIR%\*.ts > ts_filelist.txt
@rem watch 開始
cd %PRJ_DIR%
%NODE_JS_TSC% --target ES5 --watch @tools\ts_filelist.txt --out js\kimiko.js

@rem *.ts �� watch ������.
@echo ON
%~d0
cd %~p0
@call _conf.bat
@title %~n0
@rem watch�Ώۂ�ts�t�@�C�����o��.
@rem dir /b /S %TS_DIR%\*.ts > ts_filelist.txt
@rem watch �J�n
cd %PRJ_DIR%
%NODE_JS_TSC% --target ES5 --watch @tools\ts_filelist.txt --out js\kimiko.js

@rem *.ts �� watch ������.
@echo ON
%~d0
cd %~p0
@call _conf.bat
@title %~n0

@set TS_FILELIST=%PRJ_DIR%\temp\ts_filelist.txt
@rem watch�Ώۂ�ts�t�@�C�����o��.
@dir /b /S "%TS_DIR%\*.ts" > "%TS_FILELIST%"
@rem watch �J�n
%NODE_JS_TSC% --target ES5 --watch @"%TS_FILELIST%" --out "%JS_DIR%\kimiko.js"
@cd %PRJ_DIR%

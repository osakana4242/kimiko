@set PRJ_DIR=%~d0%~p0
@rem PRJ_DIR の末尾 \tools\ を切り取る.
@set PRJ_DIR=%PRJ_DIR:~0,-7%
@set TS_DIR=%PRJ_DIR%\ts
@set JS_DIR=%PRJ_DIR%\public\js
@set NODE_JS_TSC=%HOME%\AppData\Roaming\npm\tsc

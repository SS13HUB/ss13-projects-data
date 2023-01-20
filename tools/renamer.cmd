
@REM ECHO OFF

CD %~dp0
CD
CD ..\data\json
CD
PAUSE
REN *.json 0???.*
PAUSE
EXIT


FOR /r %%i IN (*.json) DO (
	ECHO. "%%~nxi"
	REN %%~nxi 0*.*
)
PAUSE
EXIT

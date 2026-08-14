@echo off
setlocal

set "NODE_EXE=C:\nvm4w\nodejs\node.exe"
set "VITE_CLI=%~dp0node_modules\vite\bin\vite.js"
set "LOCAL_PREVIEW=1"

if not exist "%NODE_EXE%" (
  echo Node 22 was not found at %NODE_EXE%.
  echo Install or select Node 22.13+, then update NODE_EXE in this file.
  exit /b 1
)

if not exist "%VITE_CLI%" (
  echo Project dependencies are missing.
  echo Run npm install with Node 22 before starting the site.
  exit /b 1
)

echo Starting the portfolio with:
"%NODE_EXE%" --version

"%NODE_EXE%" "%VITE_CLI%" --host 127.0.0.1
exit /b %errorlevel%

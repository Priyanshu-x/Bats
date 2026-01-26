@echo off
title ARKON // RULER
echo Initializing Arkon Relay...
cd "Arkon/server"
start "Arkon Relay" npm start
timeout /t 5 /nobreak >nul
echo.
echo Initializing Enforcer Client...
cd "../client"
start "Arkon Enforcer" python arkon.py
echo.
echo [SYSTEM ONLINE] - DASHBOARD: https://arkon-ruler.onrender.com/
echo.
pause

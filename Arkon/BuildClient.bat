@echo off
title Arkon Client Builder
echo.
echo [!] IMPORTANT: Did you update "SERVER_URL" in "arkon.py" to your Render URL?
echo     If you are still testing locally (localhost), you can proceed.
echo.
pause
echo.
echo Building Arkon Enforcer (Single File EXE)...
cd client
pyinstaller --noconsole --onefile --name "Arkon Client" --icon=NONE arkon.py
echo.
echo Build Complete!
echo You can find "Arkon Client.exe" in the "client/dist" folder.
echo.
pause

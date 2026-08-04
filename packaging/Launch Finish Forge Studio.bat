@echo off
title Finish Forge Studio Launcher
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0FinishForge-Server.ps1"
if errorlevel 1 (
  echo.
  echo Finish Forge Studio could not start. See the message above.
  pause
)

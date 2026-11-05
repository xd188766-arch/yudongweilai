@echo off
chcp 936 >nul
cd /d "%~dp0"
title 广财羽动未来俱乐部 - 官网本地预览
echo ============================================
echo   广财羽动未来俱乐部 - 官网本地预览
echo ============================================
echo.

where python >nul 2>nul
if errorlevel 1 (
  echo [提示] 没找到 Python，直接用浏览器打开首页。
  echo        下载链接需要本地服务器才能测试，其余功能正常。
  start "" "%~dp0index.html"
  pause
  exit /b
)

echo 预览地址： http://127.0.0.1:8766/
echo 两秒后自动打开浏览器，关闭本窗口即停止服务。
echo.

start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://127.0.0.1:8766/'"
python -m http.server 8766 --bind 127.0.0.1
pause

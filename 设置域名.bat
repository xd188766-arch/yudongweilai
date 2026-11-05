@echo off
chcp 936 >nul
cd /d "%~dp0"
title 设置站点地址
echo ============================================
echo   设置站点地址（替换 your-domain.com）
echo ============================================
echo.
echo 可以填：
echo    GitHub Pages： 你的用户名.github.io/仓库名
echo    独立域名：     www.yudongweilai.com
echo.
set /p D=请输入站点地址:
if "%D%"=="" (
  echo 没有输入，已取消。
  pause
  exit /b
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0设置域名.ps1" -Domain "%D%"
echo.
pause

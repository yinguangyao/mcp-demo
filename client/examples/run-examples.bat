@echo off
setlocal enabledelayedexpansion

:: 确保在client目录下
cd /d "%~dp0\.."

:: 编译TypeScript代码
echo 编译MCP客户端...
call npm run build
if %errorlevel% neq 0 (
  echo 编译失败
  exit /b 1
)

echo.
echo ===========================================
echo      MCP 时间服务客户端示例
echo ===========================================
echo.

:: 第1部分: 运行time示例 (stdio模式)
echo 启动time示例 (stdio模式)...
call npx ts-node examples/time-example.ts

echo.
echo ===========================================
echo.

:: 第2部分: 检查time-sse服务器是否运行
:: 在Windows下检测端口占用需要用netstat
echo 检查time-sse服务器是否运行...
netstat -ano | findstr ":3000" > nul
if %errorlevel% neq 0 (
  echo 未检测到time-sse服务器运行
  echo 请在单独的命令提示符窗口运行: cd ../time-sse ^&^& node dist/index.js
  echo 服务器启动后，按回车键继续...
  pause > nul
) else (
  echo 检测到time-sse服务器正在运行
)

:: 第3部分: 运行time-sse示例 (SSE模式)
echo 启动time-sse示例 (SSE模式)...
call npx ts-node examples/time-sse-example.ts

echo.
echo 示例运行完成
pause 
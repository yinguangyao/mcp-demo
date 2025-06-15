#!/bin/bash

# 确保在client目录下
cd "$(dirname "$0")/.."

# 编译TypeScript代码
echo "编译MCP客户端..."
npm run build || { echo "编译失败"; exit 1; }

echo ""
echo "==========================================="
echo "     MCP 时间服务客户端示例"
echo "==========================================="
echo ""

# 第1部分: 运行time示例 (stdio模式)
echo "启动time示例 (stdio模式)..."
npx ts-node examples/time-example.ts

echo ""
echo "==========================================="
echo ""

# 第2部分: 检查time-sse服务器是否运行
sse_server_pid=$(lsof -i:3000 -t)
if [ -z "$sse_server_pid" ]; then
  echo "启动time-sse服务器..."
  echo "在单独的终端运行: cd ../time-sse && node dist/index.js"
  echo "服务器启动后，按Enter继续..."
  read
else
  echo "检测到time-sse服务器正在运行 (PID: $sse_server_pid)"
fi

# 第3部分: 运行time-sse示例 (SSE模式)
echo "启动time-sse示例 (SSE模式)..."
npx ts-node examples/time-sse-example.ts

echo ""
echo "示例运行完成" 
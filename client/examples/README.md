# MCP 时间服务客户端示例

这个目录包含两个示例，展示了如何使用我们的 MCP 客户端库连接到时间服务：

1. `time-example.ts` - 通过 stdio 连接到 `/time` 服务
2. `time-sse-example.ts` - 通过 SSE 连接到 `/time-sse` 服务

## 前置条件

在运行示例之前，请确保：

1. 已经安装了所有依赖：
   ```bash
   cd ../client
   npm install
   ```

2. 对于 time-sse 示例，确保 time-sse 服务器已经编译：
   ```bash
   cd ../time-sse
   npm install
   npm run build
   ```

## 运行示例

我们提供了两种方式来运行这些示例：

### 方式一：使用脚本（推荐）

在 Linux/macOS 上运行：
```bash
chmod +x examples/run-examples.sh
./examples/run-examples.sh
```

在 Windows 上运行：
```cmd
examples\run-examples.bat
```

脚本会自动：
1. 编译客户端代码
2. 运行 stdio 示例
3. 检查 time-sse 服务器是否运行，并提示你启动它（如果需要）
4. 运行 SSE 示例

### 方式二：手动运行

#### 1. 运行 Stdio 示例

```bash
# 确保在 client 目录下
cd ../client

# 编译客户端
npm run build

# 运行 stdio 示例
npx ts-node examples/time-example.ts
```

#### 2. 运行 SSE 示例

首先，在一个单独的终端窗口启动 time-sse 服务器：

```bash
# 在第一个终端窗口
cd ../time-sse
node dist/index.js
```

然后，在另一个终端窗口运行 SSE 示例：

```bash
# 在第二个终端窗口
cd ../client
npx ts-node examples/time-sse-example.ts
```

## 示例功能

两个示例都会：

1. 连接到相应的 MCP 服务器
2. 列出所有可用的工具
3. 调用 `getCurrentTime` 工具，获取当前时间（中国时区）
4. 调用 `listTimeZones` 工具，列出所有可用的时区
5. 尝试列出资源和提示（如果服务器支持）
6. 关闭连接

## 故障排除

### Stdio 示例问题

- 确保 time 服务已正确编译：`cd ../time && npm run build`
- 检查示例中的路径是否正确指向 time/dist/index.js

### SSE 示例问题

- 确保 time-sse 服务器已启动并监听在 3000 端口
- 如果端口已被占用，可以修改 time-sse 服务器和客户端使用的端口
- 检查网络连接和防火墙设置是否允许本地连接 
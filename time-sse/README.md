# Time-SSE 服务

基于 MCP SSE 传输的时间服务，提供获取当前时间、时区列表和时间更新订阅功能。

## 功能特点

- 使用 MCP SSE 传输 - 通过标准的 Server-Sent Events (SSE) 流式传输 MCP 数据
- 支持多种时间格式
- 支持全球时区
- 提供时间更新通知功能

## 安装

```bash
npm install
npm run build
```

## 运行

```bash
npm start
```

默认监听端口为 3000，可通过环境变量 PORT 修改。

## API 端点

服务提供以下端点：

- `GET /mcp` - 建立 SSE 连接，获取 sessionId
- `POST /messages?sessionId={sessionId}` - 发送请求到服务器

## MCP 工具

服务提供以下 MCP 工具：

- `getCurrentTime` - 获取当前时间，支持不同格式和时区
- `listTimeZones` - 获取支持的时区列表
- `subscribeTimeUpdates` - 订阅时间更新通知

## 前端使用示例

```javascript
// 建立连接
const eventSource = new EventSource('/mcp');
let sessionId;

eventSource.addEventListener('session_id', (event) => {
  sessionId = JSON.parse(event.data).session_id;
  console.log('获取到会话ID:', sessionId);
});

// 调用工具
async function callTool() {
  if (!sessionId) {
    console.error('尚未获取到会话ID');
    return;
  }
  
  const response = await fetch(`/messages?sessionId=${sessionId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'getCurrentTime',
        arguments: { format: 'full', timezone: 'Asia/Shanghai' }
      },
      id: 1
    })
  });
  
  const result = await response.json();
  console.log('当前时间:', result.result.content[0].text);
}

// 订阅时间更新
async function subscribeUpdates() {
  if (!sessionId) {
    console.error('尚未获取到会话ID');
    return;
  }
  
  const response = await fetch(`/messages?sessionId=${sessionId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'subscribeTimeUpdates',
        arguments: { 
          format: 'full', 
          timezone: 'Asia/Shanghai',
          updates: 10,
          interval: 1000
        }
      },
      id: 2
    })
  });
  
  // 处理通知
  eventSource.addEventListener('notification', (event) => {
    const notification = JSON.parse(event.data);
    console.log('收到通知:', notification);
  });
}
```

## 使用 MCP Inspector 进行测试

你可以使用 MCP Inspector 工具来测试服务：

```bash
npx @modelcontextprotocol/inspector sse http://localhost:3000/mcp
```

注意：使用 SSE 传输方式时，需要在命令中指定 `sse` 参数。

## 注意事项

- 由于使用了 SSE 传输，需要确保客户端支持 EventSource API
- 对于每个 SSE 连接，必须保存从服务端获取的 sessionId 用于后续请求
- 每个时间更新流会发送指定次数的更新后结束
- 虽然 SSE 传输已被标记为弃用，但对于某些场景仍然有用

## 依赖项

- express
- cors
- zod
- @modelcontextprotocol/sdk (v1.9.0+) 
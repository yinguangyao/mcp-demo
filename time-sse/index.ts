/**
 * Time-SSE Tool
 * 提供基于 MCP SSE 传输的时间服务
 */

import express, { Request, Response } from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3001;

// 使用CORS中间件
app.use(cors());
app.use(express.json());

// 存储活跃的传输连接
const transports: Record<string, SSEServerTransport> = {};

// 时区列表
const timeZones = [
  "UTC",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Los_Angeles",
  "Australia/Sydney",
];

/**
 * 创建一个MCP服务器实例
 */
function createMcpServer() {
  // 创建MCP服务器
  const server = new McpServer({
    name: "time-sse-server",
    version: "1.0.0",
  });

  // 注册获取当前时间的工具
  server.registerTool(
    "getCurrentTime",
    {
      description: "获取当前时间，可选择不同格式和时区",
      inputSchema: {
        format: z
          .enum(["iso", "date", "time", "timestamp", "full"])
          .describe(
            "时间格式: 'iso'(ISO格式), 'date'(年月日), 'time'(时分秒), 'timestamp'(时间戳), 'full'(完整格式)"
          ),
        timezone: z
          .string()
          .optional()
          .describe("时区，例如 'Asia/Shanghai'，不填则默认使用系统时区"),
      },
      annotations: {
        title: "获取当前时间",
        readOnlyHint: true,
        openWorldHint: false,
      },
    },
    async (params: { format: string; timezone?: string }) => {
      // 创建时间对象
      const now = new Date();

      // 根据不同格式返回时间
      try {
        let result: string;

        switch (params.format) {
          case "iso":
            result = now.toISOString();
            break;

          case "date":
            result = now.toLocaleDateString(undefined, {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              timeZone: params.timezone,
            });
            break;

          case "time":
            result = now.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              timeZone: params.timezone,
            });
            break;

          case "timestamp":
            result = now.getTime().toString();
            break;

          case "full":
            result = now.toLocaleString(undefined, {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              timeZone: params.timezone,
            });
            break;

          default:
            result = now.toISOString();
        }

        return {
          content: [
            {
              type: "text",
              text: result,
            },
          ],
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `获取时间出错: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );

  // 添加获取时区列表的工具
  server.registerTool(
    "listTimeZones",
    {
      description: "获取可用时区列表",
      inputSchema: {},
      annotations: {
        title: "列出时区",
        readOnlyHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(timeZones, null, 2),
          },
        ],
      };
    }
  );

  // 添加时间更新通知工具
  server.registerTool(
    "subscribeTimeUpdates",
    {
      description: "订阅时间更新通知",
      inputSchema: {
        format: z
          .enum(["iso", "date", "time", "timestamp", "full"])
          .describe(
            "时间格式: 'iso'(ISO格式), 'date'(年月日), 'time'(时分秒), 'timestamp'(时间戳), 'full'(完整格式)"
          ),
        timezone: z
          .string()
          .optional()
          .describe("时区，例如 'Asia/Shanghai'，不填则默认使用系统时区"),
        updates: z
          .number()
          .min(1)
          .max(20)
          .default(5)
          .describe("更新次数，默认为5次，最大20次"),
        interval: z
          .number()
          .min(500)
          .max(10000)
          .default(1000)
          .describe("更新间隔，单位毫秒，默认为1000"),
      },
      annotations: {
        title: "订阅时间更新",
        readOnlyHint: true,
        openWorldHint: false,
      },
    },
    async (
      params: {
        format: string;
        timezone?: string;
        updates?: number;
        interval?: number;
      },
      { sendNotification }
    ) => {
      const format = params.format;
      const timezone = params.timezone;
      const updateCount = Math.min(Math.max(params.updates || 5, 1), 20);
      const interval = Math.min(Math.max(params.interval || 1000, 500), 10000);

      // 发送初始通知
      await sendNotification({
        method: "notifications/message",
        params: {
          level: "info",
          data: `开始订阅时间更新：${updateCount}次，间隔${interval}毫秒，格式：${format}，时区：${
            timezone || "默认"
          }`,
        },
      });

      // 休眠函数
      const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      // 发送定期更新
      for (let i = 0; i < updateCount; i++) {
        // 等待指定间隔
        await sleep(interval);

        try {
          const now = new Date();
          let result: string;

          // 根据格式获取时间字符串
          switch (format) {
            case "iso":
              result = now.toISOString();
              break;

            case "date":
              result = now.toLocaleDateString(undefined, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                timeZone: timezone,
              });
              break;

            case "time":
              result = now.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZone: timezone,
              });
              break;

            case "timestamp":
              result = now.getTime().toString();
              break;

            case "full":
              result = now.toLocaleString(undefined, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZone: timezone,
              });
              break;

            default:
              result = now.toISOString();
          }

          // 发送通知
          await sendNotification({
            method: "notifications/message",
            params: {
              level: "info",
              data: `时间更新 #${i + 1}/${updateCount}: ${result}`,
            },
          });
        } catch (error) {
          console.error("发送通知出错:", error);
          try {
            await sendNotification({
              method: "notifications/message",
              params: {
                level: "error",
                data: `发送通知出错: ${
                  error instanceof Error ? error.message : String(error)
                }`,
              },
            });
          } catch (innerError) {
            console.error("发送错误通知失败:", innerError);
          }
        }
      }

      // 返回结果
      return {
        content: [
          {
            type: "text",
            text: `已完成 ${updateCount} 次时间更新通知`,
          },
        ],
      };
    }
  );

  return server;
}

// 根路由，提供简单的文档
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>MCP Time SSE Service</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #333; }
          pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
          .endpoint { margin-bottom: 20px; }
          code { background: #f0f0f0; padding: 2px 4px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h1>MCP Time SSE Service</h1>
        <p>这是一个基于 MCP SSE 传输的时间服务，提供以下端点:</p>
        
        <div class="endpoint">
          <h2>GET /mcp</h2>
          <p>建立 SSE 连接</p>
        </div>
        
        <div class="endpoint">
          <h2>POST /messages?sessionId={sessionId}</h2>
          <p>发送请求到服务器 (需要在 URL 中附加从 SSE 连接得到的 sessionId)</p>
        </div>
        
        <div class="endpoint">
          <h2>可用 MCP 工具</h2>
          <ul>
            <li><code>getCurrentTime</code> - 获取当前时间，支持不同格式和时区</li>
            <li><code>listTimeZones</code> - 获取支持的时区列表</li>
            <li><code>subscribeTimeUpdates</code> - 订阅时间更新通知</li>
          </ul>
        </div>
        
        <div class="endpoint">
          <h2>示例</h2>
          <p>1. 首先通过 SSE 连接获取 sessionId</p>
          <p>2. 然后使用 sessionId 调用 MCP 工具</p>
          <pre>
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
  
  const response = await fetch(\`/messages?sessionId=\${sessionId}\`, {
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
          </pre>
        </div>
      </body>
    </html>
  `);
});

// SSE 端点，用于建立 SSE 流
app.get("/mcp", async (req: Request, res: Response) => {
  console.log("收到 GET 请求到 /mcp (建立 SSE 流)");

  try {
    // 为客户端创建新的 SSE 传输
    // POST 消息的端点是 '/messages'
    const transport = new SSEServerTransport('/messages', res);

    // 存储传输，使用会话 ID
    const sessionId = transport.sessionId;
    transports[sessionId] = transport;

    // 设置关闭处理程序，在关闭时清理
    transport.onclose = () => {
      console.log(`SSE 传输已关闭，会话 ID: ${sessionId}`);
      delete transports[sessionId];
    };

    // 将传输连接到 MCP 服务器
    const server = createMcpServer();
    await server.connect(transport);

    console.log(`已建立 SSE 流，会话 ID: ${sessionId}`);
  } catch (error) {
    console.error("建立 SSE 流时出错:", error);
    if (!res.headersSent) {
      res.status(500).send("建立 SSE 流时出错");
    }
  }
});

// 消息端点，用于接收客户端 JSON-RPC 请求
app.post("/messages", async (req: Request, res: Response) => {
  console.log("收到 POST 请求到 /messages");

  // 从 URL 查询参数中提取会话 ID
  const sessionId = req.query.sessionId as string | undefined;

  if (!sessionId) {
    console.error("请求 URL 中未提供会话 ID");
    res.status(400).send("缺少 sessionId 参数");
    return;
  }

  const transport = transports[sessionId];
  if (!transport) {
    console.error(`未找到会话 ID 对应的活跃传输: ${sessionId}`);
    res.status(404).send("会话未找到");
    return;
  }

  try {
    // 使用传输处理 POST 消息
    await transport.handlePostMessage(req, res, req.body);
  } catch (error) {
    console.error("处理请求时出错:", error);
    if (!res.headersSent) {
      res.status(500).send("处理请求时出错");
    }
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`MCP SSE 时间服务已在端口 ${PORT} 启动`);
});

// 处理服务器关闭
process.on("SIGINT", async () => {
  console.log("正在关闭服务器...");

  // 关闭所有活跃传输以正确清理资源
  for (const sessionId in transports) {
    try {
      console.log(`关闭会话 ${sessionId} 的传输`);
      await transports[sessionId].close();
      delete transports[sessionId];
    } catch (error) {
      console.error(`关闭会话 ${sessionId} 的传输时出错:`, error);
    }
  }
  console.log("服务器关闭完成");
  process.exit(0);
});

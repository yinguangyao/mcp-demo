/**
 * Model Context Protocol (MCP) - Time Tool
 * 提供获取当前时间的各种格式的工具
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// 创建MCP服务器
const server = new McpServer({
  name: "time-server",
  version: "1.0.0"
});

// 添加获取当前时间的工具
server.registerTool(
  "getCurrentTime",
  {
    description: "获取当前时间，可选择不同格式和时区",
    inputSchema: {
      format: z.enum(["iso", "date", "time", "timestamp", "full"]).describe("时间格式: 'iso'(ISO格式), 'date'(年月日), 'time'(时分秒), 'timestamp'(时间戳), 'full'(完整格式)"),
      timezone: z.string().optional().describe("时区，例如 'Asia/Shanghai'，不填则默认使用系统时区")
    },
    annotations: {
      title: "获取当前时间",
      readOnlyHint: true,  // 该工具是只读的，不修改系统状态
      openWorldHint: false // 该工具不与外部世界交互
    }
  },
  async ({ format, timezone }) => {
    // 创建时间对象
    const now = new Date();
    
    // 根据不同格式返回时间
    try {
      let result: string;
      
      switch (format) {
        case 'iso':
          result = now.toISOString();
          break;
          
        case 'date':
          result = now.toLocaleDateString(undefined, { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            timeZone: timezone
          });
          break;
          
        case 'time':
          result = now.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: timezone
          });
          break;
          
        case 'timestamp':
          result = now.getTime().toString();
          break;
          
        case 'full':
          result = now.toLocaleString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: timezone
          });
          break;
          
        default:
          result = now.toISOString();
      }
      
      return {
        content: [
          {
            type: "text",
            text: result
          }
        ]
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `获取时间出错: ${error instanceof Error ? error.message : String(error)}`
          }
        ]
      };
    }
  }
);

// 添加获取时区列表的工具
server.registerTool(
  "listTimeZones",
  {
    description: "获取可用时区列表",
    annotations: {
      title: "列出时区",
      readOnlyHint: true,
      openWorldHint: false
    }
  },
  async () => {
    // 简化的时区列表
    const timeZones = [
      "UTC",
      "Asia/Shanghai", 
      "Asia/Tokyo", 
      "Europe/London", 
      "Europe/Paris", 
      "America/New_York", 
      "America/Los_Angeles", 
      "Australia/Sydney"
    ];
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(timeZones, null, 2)
        }
      ]
    };
  }
);

// 连接到stdio传输
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("时间工具服务已启动");
}

main().catch(error => {
  console.error("启动时间服务失败:", error);
  process.exit(1);
}); 
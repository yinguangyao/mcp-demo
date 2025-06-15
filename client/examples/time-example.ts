import { McpStdioClient } from '../src/index';
import { join } from 'path';
import { cwd } from 'process';

/**
 * 时间工具MCP客户端示例
 * 通过stdio连接time服务
 */
async function main() {
  console.log('=== Time MCP 客户端示例 (Stdio) ===');

  // 创建客户端
  const client = new McpStdioClient({
    name: 'time-client',
    version: '1.0.0',
    // 运行服务器脚本（通过node执行time目录中的index.ts）
    command: 'node',
    // 使用编译后的js文件路径
    args: [join(cwd(), '../time/dist/index.js')],
    // 设置工作目录为time目录
    cwd: join(cwd(), '../time')
  });

  try {
    // 连接到MCP服务器
    await client.connectStdio();
    console.log('成功连接到Time MCP服务器');
    
    // 列出所有可用工具
    const toolsResult = await client.listTools();
    console.log(`\n可用工具数量: ${toolsResult.tools.length}`);
    
    for (const tool of toolsResult.tools) {
      console.log(`\n工具名称: ${tool.name}`);
      console.log(`描述: ${tool.description || '无描述'}`);
      
      // 测试调用工具
      if (tool.name === 'getCurrentTime') {
        console.log('\n调用getCurrentTime工具:');
        const result = await client.callTool('getCurrentTime', { 
          format: 'full',
          timezone: 'Asia/Shanghai'
        });
        console.log('当前时间:', result);
      }
      
      if (tool.name === 'listTimeZones') {
        console.log('\n调用listTimeZones工具:');
        const result = await client.callTool('listTimeZones', { 
          random_string: 'test'  // 必需的参数，尽管不会使用
        });
        
        // 添加类型检查，确保安全访问结果内容
        if (result && typeof result === 'object' && 'content' in result) {
          const content = result.content;
          if (Array.isArray(content) && content.length > 0) {
            const firstItem = content[0];
            if (typeof firstItem === 'object' && firstItem && 'text' in firstItem) {
              try {
                const textContent = String(firstItem.text || '');
                const timeZones = JSON.parse(textContent);
                if (Array.isArray(timeZones)) {
                  console.log(`时区总数: ${timeZones.length}`);
                  console.log('部分时区列表:', timeZones.slice(0, 5));
                } else {
                  console.log('时区数据不是数组格式');
                }
              } catch (e) {
                console.log('无法解析时区数据:', e instanceof Error ? e.message : String(e));
              }
            } else {
              console.log('返回内容没有text字段');
            }
          } else {
            console.log('返回内容不是数组或为空');
          }
        } else {
          console.log('返回结果没有content字段');
        }
      }
    }

    // 尝试获取可用的资源（如果有）
    try {
      const resources = await client.listResources();
      console.log('\n可用资源:', resources);
    } catch (error) {
      console.log('\n列出资源失败，可能不支持资源功能');
    }

    // 尝试获取可用的提示（如果有）
    try {
      const prompts = await client.listPrompts();
      console.log('\n可用提示:', prompts);
    } catch (error) {
      console.log('\n列出提示失败，可能不支持提示功能');
    }

  } catch (error) {
    console.error('错误:', error);
  } finally {
    // 关闭连接
    await client.close();
    console.log('\n连接已关闭');
  }
}

// 运行示例
main().catch(err => console.error('程序错误:', err)); 
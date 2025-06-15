import { McpStdioClient, McpSseClient } from '../src/index';

// Example 1: Using stdio transport
async function stdioExample() {
  console.log('=== Stdio Example ===');
  
  const client = new McpStdioClient({
    name: 'example-client',
    version: '1.0.0',
    command: 'node',
    args: ['../server/examples/echo-server.js']
  });

  try {
    await client.connectStdio();
    console.log('Connected to MCP server via stdio');

    const tools = await client.listTools();
    console.log('Available tools:', tools);

    if (tools.tools.length > 0) {
      const toolName = tools.tools[0].name;
      const result = await client.callTool(toolName, {
        message: 'Hello from stdio client!'
      });
      console.log(`Tool result (${toolName}):`, result);
    }
  } catch (error) {
    console.error('Stdio error:', error);
  } finally {
    await client.close();
    console.log('Stdio connection closed');
  }
}

// Example 2: Using SSE transport
async function sseExample() {
  console.log('\n=== SSE Example ===');
  
  const client = new McpSseClient({
    name: 'example-client',
    version: '1.0.0',
    baseUrl: 'http://localhost:3000'
  });

  try {
    await client.connectSse();
    console.log('Connected to MCP server via SSE');

    const tools = await client.listTools();
    console.log('Available tools:', tools);

    if (tools.tools.length > 0) {
      const toolName = tools.tools[0].name;
      const result = await client.callTool(toolName, {
        message: 'Hello from SSE client!'
      });
      console.log(`Tool result (${toolName}):`, result);
    }
  } catch (error) {
    console.error('SSE error:', error);
  } finally {
    await client.close();
    console.log('SSE connection closed');
  }
}

// Run examples
async function main() {
  try {
    // Run stdio example
    await stdioExample();
    
    // Run SSE example (uncomment when you have an SSE server running)
    // await sseExample();
  } catch (error) {
    console.error('Example error:', error);
  }
}

main().catch(console.error); 
# MCP Client

A TypeScript implementation of the Model Context Protocol (MCP) client with support for both stdio and SSE transports.

## Installation

```bash
npm install mcp-client
```

## Usage

### Stdio Transport Example

Connect to an MCP server using stdio transport:

```typescript
import { McpStdioClient } from 'mcp-client';

async function main() {
  // Create a new client
  const client = new McpStdioClient({
    name: 'example-client',
    version: '1.0.0',
    command: 'node',
    args: ['path/to/server.js']
  });

  try {
    // Connect to the server
    await client.connectStdio();
    console.log('Connected to MCP server via stdio');

    // List available tools
    const tools = await client.listTools();
    console.log('Available tools:', tools);

    // Call a tool
    const result = await client.callTool('example-tool', {
      param1: 'value1',
      param2: 'value2'
    });
    console.log('Tool result:', result);

    // List available resources
    const resources = await client.listResources();
    console.log('Available resources:', resources);

    // Read a resource
    const resourceContent = await client.readResource('example://resource');
    console.log('Resource content:', resourceContent);

    // List available prompts
    const prompts = await client.listPrompts();
    console.log('Available prompts:', prompts);

    // Get a prompt
    const prompt = await client.getPrompt('example-prompt', {
      param1: 'value1'
    });
    console.log('Prompt:', prompt);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await client.close();
  }
}

main();
```

### SSE Transport Example

Connect to an MCP server using SSE transport:

```typescript
import { McpSseClient } from 'mcp-client';

async function main() {
  // Create a new client
  const client = new McpSseClient({
    name: 'example-client',
    version: '1.0.0',
    baseUrl: 'http://localhost:3000'
  });

  try {
    // Connect to the server
    await client.connectSse();
    console.log('Connected to MCP server via SSE');

    // Use the client as in the stdio example...
    const tools = await client.listTools();
    console.log('Available tools:', tools);

    // ... more operations ...
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await client.close();
  }
}

main();
```

## API Reference

### McpClient

Base class for all MCP clients.

### McpStdioClient

Client that connects to an MCP server via stdio.

#### Options

- `name`: Client name
- `version`: Client version
- `command`: Command to run the server
- `args`: Command arguments (optional)
- `env`: Environment variables (optional)
- `cwd`: Working directory (optional)
- `timeout`: Connection timeout in milliseconds (optional)

### McpSseClient

Client that connects to an MCP server via SSE.

#### Options

- `name`: Client name
- `version`: Client version
- `baseUrl`: Base URL of the MCP server
- `headers`: Additional headers to include with requests (optional)
- `fetch`: Custom fetch implementation (optional)
- `EventSource`: Custom EventSource implementation (optional)
- `timeout`: Connection timeout in milliseconds (optional)

## License

MIT
 
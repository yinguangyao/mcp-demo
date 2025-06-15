import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { McpClient } from "../McpClient";
import { McpClientOptions } from "../interfaces/McpClientOptions";

/**
 * Options specific to SSE transport
 */
export interface McpSseOptions extends McpClientOptions {
  /** Base URL for the MCP server */
  baseUrl: URL | string;

  /** Optional headers to include with requests */
  headers?: Record<string, string>;

  /** Optional fetch implementation to use */
  fetch?: typeof fetch;

  /** Optional EventSource implementation to use */
  EventSource?: any;

  /** Optional timeout in milliseconds */
  timeout?: number;
}

/**
 * MCP client that connects to a server via Server-Sent Events (SSE)
 */
export class McpSseClient extends McpClient {
  private sseOptions: McpSseOptions;

  /**
   * Create a new SSE MCP client
   * @param options Configuration options
   */
  constructor(options: McpSseOptions) {
    super(options);
    this.sseOptions = options;
  }

  /**
   * Connect to an MCP server via SSE
   */
  async connectSse(): Promise<void> {
    const baseUrl =
      this.sseOptions.baseUrl instanceof URL
        ? this.sseOptions.baseUrl
        : new URL(this.sseOptions.baseUrl);

    const transport = new SSEClientTransport(baseUrl);

    await this.connect(transport);
  }
}

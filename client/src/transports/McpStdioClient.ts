import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio";
import { McpClient } from "../McpClient";
import { McpClientOptions } from "../interfaces/McpClientOptions";

/**
 * Options specific to stdio transport
 */
export interface McpStdioOptions extends McpClientOptions {
  /** Command to run the MCP server */
  command: string;
  
  /** Command arguments */
  args?: string[];
  
  /** Environment variables to pass to the command */
  env?: Record<string, string>;
  
  /** Working directory for the command */
  cwd?: string;
  
  /** Timeout in milliseconds */
  timeout?: number;
}

/**
 * MCP client that connects to a server via stdio
 */
export class McpStdioClient extends McpClient {
  private stdioOptions: McpStdioOptions;
  
  /**
   * Create a new Stdio MCP client
   * @param options Configuration options
   */
  constructor(options: McpStdioOptions) {
    super(options);
    this.stdioOptions = options;
  }
  
  /**
   * Connect to an MCP server via stdio
   */
  async connectStdio(): Promise<void> {
    const transport = new StdioClientTransport({
      command: this.stdioOptions.command,
      args: this.stdioOptions.args || [],
      env: this.stdioOptions.env,
      cwd: this.stdioOptions.cwd,
      timeout: this.stdioOptions.timeout
    });
    
    await this.connect(transport);
  }
} 
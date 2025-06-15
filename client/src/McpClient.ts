import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { McpClientOptions } from "./interfaces/McpClientOptions";
import { McpClientError, toMcpError } from "./utils/errorHandling";

/**
 * Base MCP Client class that provides common functionality
 */
export class McpClient {
  protected client: Client;
  protected transport: Transport | null = null;
  protected connected: boolean = false;
  protected options: McpClientOptions;

  /**
   * Create a new MCP client
   * @param options Client configuration options
   */
  constructor(options: McpClientOptions) {
    this.options = options;
    
    this.client = new Client({
      name: options.name,
      version: options.version
    }, {
      capabilities: options.capabilities || {}
    });
  }

  /**
   * Connect to an MCP server using the provided transport
   * @param transport The transport to use for connection
   */
  async connect(transport: Transport): Promise<void> {
    try {
      this.transport = transport;
      await this.client.connect(transport);
      this.connected = true;
    } catch (error) {
      throw toMcpError(error);
    }
  }

  /**
   * Check if the client is connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Close the connection to the server
   */
  async close(): Promise<void> {
    try {
      if (this.connected && this.transport) {
        await this.client.close();
        this.connected = false;
      }
    } catch (error) {
      throw toMcpError(error);
    }
  }

  /**
   * List available tools from the server
   */
  async listTools() {
    this.checkConnected();
    try {
      return await this.client.listTools();
    } catch (error) {
      throw toMcpError(error);
    }
  }

  /**
   * Call a tool on the server
   * @param name Tool name
   * @param args Tool arguments
   */
  async callTool(name: string, args: Record<string, any>) {
    this.checkConnected();
    try {
      return await this.client.callTool({
        name,
        arguments: args
      });
    } catch (error) {
      throw toMcpError(error);
    }
  }

  /**
   * List available resources from the server
   */
  async listResources() {
    this.checkConnected();
    try {
      return await this.client.listResources();
    } catch (error) {
      throw toMcpError(error);
    }
  }

  /**
   * Read a resource from the server
   * @param uri Resource URI
   */
  async readResource(uri: string) {
    this.checkConnected();
    try {
      return await this.client.readResource({
        uri
      });
    } catch (error) {
      throw toMcpError(error);
    }
  }

  /**
   * List available prompts from the server
   */
  async listPrompts() {
    this.checkConnected();
    try {
      return await this.client.listPrompts();
    } catch (error) {
      throw toMcpError(error);
    }
  }

  /**
   * Get a prompt from the server
   * @param name Prompt name
   * @param args Prompt arguments
   */
  async getPrompt(name: string, args: Record<string, any>) {
    this.checkConnected();
    try {
      return await this.client.getPrompt({
        name,
        arguments: args
      });
    } catch (error) {
      throw toMcpError(error);
    }
  }

  /**
   * Check if the client is connected, throw an error if not
   * @private
   */
  private checkConnected() {
    if (!this.connected) {
      throw new McpClientError('MCP client is not connected', -32000);
    }
  }
} 
/**
 * Base options for MCP clients
 */
export interface McpClientOptions {
  /** Name of the client */
  name: string;
  
  /** Version of the client */
  version: string;
  
  /** Optional capabilities configuration */
  capabilities?: Record<string, any>;
} 
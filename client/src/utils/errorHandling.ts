/**
 * MCP Client Error class
 */
export class McpClientError extends Error {
  constructor(
    message: string,
    public readonly code?: number,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'McpClientError';
  }
}

/**
 * Format JSON-RPC error for better readability
 * @param error The JSON-RPC error object
 * @returns A formatted error message
 */
export function formatRpcError(error: any): string {
  if (!error) return 'Unknown error';
  
  const code = error.code ? `[Code: ${error.code}] ` : '';
  const message = error.message || 'No error message';
  
  if (error.data) {
    try {
      const dataStr = typeof error.data === 'string' 
        ? error.data 
        : JSON.stringify(error.data);
      return `${code}${message}\nDetails: ${dataStr}`;
    } catch (_) {
      return `${code}${message}\nDetails: [Unable to stringify error data]`;
    }
  }
  
  return `${code}${message}`;
}

/**
 * Convert any error to McpClientError
 * @param error The error to convert
 * @returns A McpClientError instance
 */
export function toMcpError(error: any): McpClientError {
  if (error instanceof McpClientError) {
    return error;
  }
  
  if (error && typeof error === 'object') {
    // Handle JSON-RPC style errors
    if (error.code !== undefined && error.message) {
      return new McpClientError(
        error.message,
        error.code,
        error.data
      );
    }
    
    // Handle Error objects
    if (error instanceof Error) {
      return new McpClientError(
        error.message,
        undefined,
        error
      );
    }
  }
  
  // Handle other types
  return new McpClientError(
    String(error),
    undefined,
    error
  );
} 
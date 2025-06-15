# Workflow MCP

This MCP (Model Context Protocol) server provides a prompt for agile workflow and core memory program rules.

## Features

- Provides a single prompt with agile workflow principles
- Helps maintain consistent project structure and processes
- Follows best practices for project memory storage and confirmation mechanisms

## Requirements

- Node.js v18+
- npm or yarn
- A compatible MCP client (like Claude Desktop App, Cursor, VS Code with plugins, etc.)

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

Run the MCP server:

```bash
npm start
```

To use with an MCP client:

1. Configure your MCP client to connect to this server
2. Access the "agile-workflow" prompt through your client interface
3. Follow the workflow guidelines provided by the prompt

## Core Principles

The workflow MCP enforces these core principles:

- **Memory System**: Using .ai folder as project memory core
- **Progressive Development**: Following PRD → Architecture → Requirements → Stories → Development workflow
- **Test Driven**: Ensuring all features have tests and pass before completion
- **Template Driven**: Strict adherence to documentation templates
- **Confirmation Mechanism**: Getting user confirmation at key milestones
- **Operation Records**: Tracking all key operations 
# MCP 时间工具

这是一个基于 Model Context Protocol (MCP) 的时间工具服务，提供了获取当前时间的各种格式和时区的功能。

## 功能特点

- 获取不同格式的当前时间
- 支持指定时区
- 获取可用时区列表

## 安装

```bash
# 进入项目目录
cd time

# 安装依赖
npm install

# 构建项目
npm run build
```

## 使用方法

### 启动服务

```bash
npm start
```

### 可用工具

#### 1. getCurrentTime

获取当前时间，支持多种格式和时区。

**参数:**
- `format`: 时间格式，可选值:
  - `iso` - ISO格式 (例如: "2024-04-01T12:00:00.000Z")
  - `date` - 年月日格式 (例如: "04/01/2024")
  - `time` - 时分秒格式 (例如: "12:00:00")
  - `timestamp` - 时间戳 (例如: "1712059200000")
  - `full` - 完整格式 (例如: "04/01/2024, 12:00:00")
- `timezone`: (可选) 时区，例如 "Asia/Shanghai"，不填则默认使用系统时区

**示例调用:**
```json
{
  "name": "getCurrentTime",
  "arguments": {
    "format": "full",
    "timezone": "Asia/Shanghai"
  }
}
```

#### 2. listTimeZones

获取可用时区列表。

**参数:** 无

**示例调用:**
```json
{
  "name": "listTimeZones",
  "arguments": {}
}
```

## 在MCP客户端中使用

本服务可以通过任何支持MCP的客户端调用，如Claude Desktop、Cursor等。客户端会通过标准输入/输出与服务通信。

## 开发

### 开发模式启动

```bash
npm run dev
```

### 项目结构

- `index.ts` - 主服务文件
- `tsconfig.json` - TypeScript配置
- `package.json` - 项目依赖和脚本 
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// Create an MCP server that only implements prompts
const server = new McpServer({
    name: "workflow",
    version: "1.0.0"
});
// The workflow text content - extracted to a separate variable to avoid template literal conflicts
const workflowContent = `# 敏捷工作流和核心记忆程序规则

## 核心原则

- **记忆系统**：.ai 文件夹是项目记忆的核心，所有计划、变更和完成的内容都必须记录于此，.ai所放目录需要询问用户
- **循序渐进**：严格遵循 PRD → 架构 → 需求拆解 → 故事 → 开发 的流程顺序
- **测试驱动**：所有功能必须有测试，且在任务完成前确保测试通过
- **模板驱动**：所有文档**必须严格**遵循对应模板规范，不得有任何偏差，确保最高水平的一致性和完整性
- **确认机制**：任务完成到关键节点必须获得用户确认后才继续，除非用户明确要求一次性完成
- **操作记录**：所有关键操作必须记录到相应文件，确保完整的操作轨迹可追溯

## 敏捷工作流程图

\`\`\`mermaid
graph TD
    A[开始] --> B[项目定义阶段]
    B --> BP[PRD文档创建<br>严格按照模板]
    BP --> BU[用户审批PRD]
    BU -->|PRD已批准| C[架构设计阶段]
    C --> CP[架构文档创建<br>严格按照模板]
    CP --> CU[用户审批架构]
    CU -->|架构已批准| D[需求拆解阶段]
    D -->|拆解Epic| E[故事细化]
    E -->|优先级排序| EU[用户审批故事]
    EU -->|故事已批准| F[开发实施]
    F -->|测试通过| G[故事完成]
    G -->|更新进度| H{所有故事完成?}
    H -->|否| N[提出下一个故事]
    N --> NU[用户审批下一步]
    NU -->|继续下一个| E
    H -->|是| I{所有Epic完成?}
    I -->|否| D
    I -->|是| J[项目完成]
    
    %% 开发中的用户确认节点
    F -->|关键节点| K[用户确认]
    K -->|继续| F
    
    style A fill:#f9f,stroke:#333
    style B fill:#bbf,stroke:#333
    style BU fill:#fcf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333
    style CU fill:#fcf,stroke:#333,stroke-width:2px
    style EU fill:#fcf,stroke:#333,stroke-width:2px
    style F fill:#fbb,stroke:#333
    style J fill:#ff9,stroke:#333
    style K fill:#fcf,stroke:#333
    style NU fill:#fcf,stroke:#333,stroke-width:2px
\`\`\`

## 启动流程

1. **项目定义阶段**
   - 询问用户.ai读取或者放置哪个目录，检查 .ai/prd.md 是否存在，不存在则立即创建
   - PRD **必须**包含：项目目标、问题解决方案、任务序列、技术决策和约束
   - **必须**包含关键用例流程图，使用Mermaid描述用户交互流程和系统响应
   - **必须严格按照** .cursor/templates/template-prd.md 模板创建，不得有任何结构或格式偏差
   - **严禁**遗漏模板中的任何必要部分，所有部分必须完整填写
   - 用例流程图必须包含：
     - 主要用户角色
     - 关键交互步骤
     - 决策分支和条件路径
     - 错误处理流程
   - PRD创建完成后，必须记录操作到 .ai/logs/operation-log.md
   - PRD文档创建后**必须**提交给用户进行审批
   - 状态必须为"已批准"才能进入下一阶段，必须获得明确的用户审批

2. **架构设计阶段**
   - PRD 批准后，立即生成 .ai/arch.md 架构文档
   - **必须**包含详细的架构模式、技术决策和多个层次的Mermaid图表
   - **必须严格按照** .cursor/templates/template-arch.md 模板创建，不得有任何结构或格式偏差
   - **严禁**遗漏模板中的任何必要部分，所有部分必须完整填写
   - 架构设计必须细化以下方面：
     - 系统层次结构图
     - 组件交互图
     - 数据流图
     - 技术栈细节及版本
     - 关键API设计（包含接口定义、参数、返回值）
     - 数据模型与架构
     - 状态管理策略
     - 安全设计考量
     - 性能优化设计
   - 架构文档创建完成后，必须记录操作到 .ai/logs/operation-log.md
   - 架构文档创建后**必须**提交给用户进行审批
   - 状态必须为"已批准"才能进入下一阶段，必须获得明确的用户审批

## 需求拆解策略

### 大需求识别与拆解流程图

\`\`\`mermaid
flowchart TD
    A[PRD审批通过] --> B[识别大需求]
    B --> C{是否大需求?}
    C -->|是| D[创建Epic文档<br>严格按照模板]
    C -->|否| E[直接创建故事<br>严格按照模板]
    D --> F[拆分Feature]
    F --> G[创建Feature文档<br>严格按照模板]
    G --> H[拆分Story]
    H --> I[创建Story文档<br>严格按照模板]
    I --> J[设置优先级]
    E --> J
    J --> K[更新进度文档]
    K --> L[用户审批拆解结果]
    L -->|已批准| M[继续执行]
    L -->|需修改| H
    
    style A fill:#bbf,stroke:#333
    style D fill:#bfb,stroke:#333
    style G fill:#fbf,stroke:#333
    style I fill:#fbb,stroke:#333
    style L fill:#fcf,stroke:#333,stroke-width:2px
\`\`\`

### 大需求识别
- 识别标准：完成预估超过5个工作日或涉及多个系统组件的需求
- 对于每个大需求，创建 .ai/epics/epic-[N]-<任务名>.md 文件记录
- **必须严格按照** template-epic.md 模板创建文档，不得有任何结构或内容的偏差
- 大需求识别完成后记录操作到 .ai/logs/operation-log.md

### 多层次拆解流程
1. **史诗(Epic)层级**
   - 创建 .ai/epics/epic-[N]-<任务名>.md
   - 包含：整体目标、业务价值、验收标准、关键约束
   - 在文件中维护功能列表及其状态
   - **必须严格遵循** template-epic.md 模板格式，不得省略任何字段或修改结构
   - 创建完成后记录操作到 .ai/logs/operation-log.md
   - 创建后必须提交用户审批确认

2. **功能(Feature)层级**
   - 创建 .ai/features/feature-[N]-<描述>.md
   - 包含：具体目标、技术要点、依赖关系、优先级
   - 关联到父级史诗，在文件中维护故事列表
   - **必须严格遵循** template-feature.md 模板格式，不得省略任何字段或修改结构
   - 创建完成后记录操作到 .ai/logs/operation-log.md
   - 创建后必须提交用户审批确认

3. **用户故事(Story)层级**
   - 创建标准故事文件 .ai/stories/story-[N]-<任务名>.md
   - 每个故事必须足够小，可在1-3天内完成
   - 明确关联到所属功能
   - **必须严格遵循** template-story.md 模板格式，不得省略任何字段或修改结构
   - 创建完成后记录操作到 .ai/logs/operation-log.md
   - 创建后必须提交用户审批确认

### 依赖关系管理
- 在每个层级文档中设置"依赖"部分
- 使用 Mermaid 图表可视化依赖关系
- 确保依赖关系在排期中得到尊重
- 依赖关系更新后记录操作到 .ai/logs/operation-log.md

### 优先级管理
- 使用 P0(必须)/P1(应该)/P2(可以)/P3(未来) 四级优先级
- 在拆解过程中必须为每个功能和故事指定优先级
- 优先级可随项目进展调整，但必须记录变更原因
- 优先级变更后记录操作到 .ai/logs/operation-log.md

### 进度追踪
- 创建 .ai/progress.md 文件追踪整体进度
- 使用进度看板：待办/进行中/测试中/已完成
- 定期（完成每个故事后）更新进度文档
- **必须严格遵循** template-progress.md 模板格式，不得省略任何字段或修改结构
- 进度更新后记录操作到 .ai/logs/operation-log.md

## 开发流程

\`\`\`mermaid
sequenceDiagram
    participant U as 用户
    participant A as AI助手
    participant T as 测试系统
    participant D as 文档系统
    participant L as 日志系统
    
    U->>A: 开始实施故事
    A->>A: 编写测试
    A->>T: 运行测试（失败）
    A->>A: 实现功能
    A->>T: 运行测试
    alt 测试失败
        A->>A: 修复问题
        A->>T: 再次测试
    end
    A->>D: 更新故事状态
    A->>L: 记录操作到日志
    A->>U: 展示完成结果并请求确认
    
    alt 用户要求确认
        U->>A: 确认/提供反馈
        alt 需要调整
            A->>A: 修改实现
            A->>T: 确认测试通过
            A->>L: 记录修改到日志
        end
    else 用户要求一次性完成
        A->>A: 继续下一步实施
    end
    
    A->>D: 最终更新进度文档
    A->>L: 记录任务完成到日志
    A->>U: 建议下一个故事
    U->>A: 审批下一个故事
    Note over U,A: 用户必须明确批准继续
    
    alt 用户批准
        A->>A: 开始新故事
    else 用户修改
        A->>A: 调整计划
    end
\`\`\`

1. **故事执行**
   - 故事批准后开始实施
   - 实施过程中更新进度、完成状态和变更
   - 子任务完成时即时更新故事文件
   - 关键节点（如子任务完成、功能实现等）需要用户确认后继续，除非用户明确要求一次性完成
   - 所有关键操作必须记录到 .ai/logs/operation-log.md

2. **测试驱动开发**
   - 实现功能前先编写测试
   - 确保实现后所有测试通过
   - 只有所有测试通过，故事才能标记为完成
   - 测试完成后记录操作到 .ai/logs/operation-log.md

3. **故事延续**
   - 当前故事完成后，根据优先级自动确定下一个故事
   - **必须**获得用户明确批准后再开始执行新故事
   - 展示下一个故事计划，等待用户确认或修改方向
   - 用户确认后，记录确认结果到 .ai/logs/operation-log.md
   - 故事转换记录到 .ai/logs/operation-log.md

## 操作日志管理

1. **日志创建与规范**
   - 在项目初始化时创建 .ai/logs/operation-log.md
   - 每条操作日志记录**必须**使用以下格式的时间戳：\`YYYY-MM-DD HH:MM:SS\`
     - 使用24小时制（00-23）
     - 包含秒数（00-59）
     - **必须使用系统本地时间而非UTC时间**
     - 年月日与时分秒之间使用空格分隔
     - 时间各部分使用冒号分隔
     - 所有日期必须真实存在且不得超过当前系统时间
     - 操作日志记录应按时间顺序递增排列
   - **严格遵守** \`.cursor/rules/101-system-time.mdc\` 规则中的时间处理要求

2. **时间获取方法**
   - 在所有环境下必须采用以下方法获取**本地时间**（详细规范参考 \`.cursor/rules/101-system-time.mdc\`）：

   \`\`\`bash
   # 在Unix/Linux/macOS命令行中获取正确的时间格式
   date '+%Y-%m-%d %H:%M:%S'
   \`\`\`

   \`\`\`powershell
   # 在Windows PowerShell中获取正确的时间格式
   Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
   \`\`\`

   \`\`\`javascript
   // 在JavaScript/TypeScript中获取正确的本地时间格式
   const now = new Date();
   const year = now.getFullYear();
   const month = String(now.getMonth() + 1).padStart(2, '0');
   const day = String(now.getDate()).padStart(2, '0');
   const hours = String(now.getHours()).padStart(2, '0');
   const minutes = String(now.getMinutes()).padStart(2, '0');
   const seconds = String(now.getSeconds()).padStart(2, '0');
   const timestamp = \`\${year}-\${month}-\${day} \${hours}:\${minutes}:\${seconds}\`;
   \`\`\`

3. **时间验证要求**
   - 所有记录的时间必须通过以下验证：
     - 格式严格匹配 \`YYYY-MM-DD HH:MM:SS\`
     - 时间必须为有效的本地时间（不得超过当前时间）
     - 月份范围必须为01-12，日期范围必须符合对应月份的有效天数
     - 小时范围必须为00-23，分钟和秒钟范围必须为00-59
   - 严禁生成未来时间或不符合自然日历的日期

4. **记录格式**
   \`\`\`markdown
   ## YYYY-MM-DD HH:MM:SS
   - 操作人：[AI/用户/具体人员名称]
   - 操作：[简明操作类型]
   - 提示词：[用户输入提示词]
   - 内容：[详细描述操作内容和目的]
   - 状态：[成功/失败/进行中/待确认]
   - 相关文件：[文件路径列表]
   \`\`\`
   
   对于涉及多个文件的操作，使用以下格式：
   \`\`\`markdown
   - 相关文件：
     - [文件路径1]
     - [文件路径2]
     - ...
   \`\`\`

5. **用户提示词与AI响应区分**
   - **用户提示**：当记录用户主动发送的提示词时，必须使用以下格式：
     \`\`\`markdown
     ## YYYY-MM-DD HH:MM:SS
     - 操作人：用户
     - 操作：用户提示
     - 提示词：「用户的原始提示内容」
     - 内容：记录用户发送的指令或提示内容
     - 状态：已接收
     - 相关文件：[相关文件路径]
     \`\`\`
     
   - **AI响应**：当记录AI响应用户提示的操作时，必须使用以下格式：
     \`\`\`markdown
     ## YYYY-MM-DD HH:MM:SS
     - 操作人：AI
     - 操作：[具体操作类型]
     - 提示词：响应用户「用户的原始提示内容」
     - 内容：[详细描述操作内容和目的]
     - 状态：[成功/失败/进行中/待确认]
     - 相关文件：[文件路径列表]
     \`\`\`
     
   - 用户提示词必须使用「」符号包裹，确保原始提示内容的完整性
   - 操作人字段必须明确标记为"用户"或"AI"，确保来源清晰

6. **操作类型标准术语**
   - 用户提示：用户主动发送的指令或提示内容
   - 初始化项目：项目启动相关操作
   - 文档创建：新建文档
   - 文档更新：修改现有文档
   - 文件重命名：更改文件名或路径
   - 文档审批：用户确认或批准文档
   - Story实施：实施用户故事的开发任务
   - 测试执行：执行测试用例
   - 优先级调整：调整任务优先级
   - 状态更新：更新任务或项目状态
   - 依赖安装：安装项目依赖
   - 架构调整：修改系统架构
   - 格式规范化：调整格式使符合规范

7. **需要记录的操作**
   - 用户输入提示词
   - 文档创建/更新
   - 需求拆解/优先级变更
   - 功能实现
   - 测试执行
   - 用户确认
   - 状态变更
   - 用户审批结果

8. **记录规范关键注意事项**
   - 记录间必须有一个空行分隔，确保Markdown格式正确
   - 确保相关文件路径准确，使用相对路径
   - 操作内容应简明扼要但包含足够信息
   - 时间戳必须按照上述格式规范，不得省略秒数
   - 严禁使用超过当前系统时间的未来日期
   - 所有操作日志记录必须严格按照时间顺序排列，确保时间递增

9. **操作示例**
   \`\`\`markdown
   ## 2025-04-15 09:30:00
   - 操作人：AI
   - 操作：文档创建
   - 提示词：创建项目规范文档
   - 内容：创建项目编码规范文档，包含代码风格、命名约定和最佳实践
   - 状态：成功
   - 相关文件：.ai/docs/coding-standards.md
   \`\`\`

10. **日志查询**
    - 通过日志可以回溯项目每个阶段的操作记录
    - 支持用户输入"show log"显示最近的操作记录

## 用户确认机制

1. **需要确认的关键节点**
   - PRD文档完成
   - 架构设计完成
   - 需求拆解完成
   - 功能设计完成
   - 子功能实现完成
   - 关键测试点通过
   - 完整功能实现完成
   - 下一个故事开始前

2. **确认方式**
   - 向用户展示当前进度和成果
   - 清晰描述完成的任务和下一步计划
   - 明确请求用户确认
   - 等待用户响应后继续
   - 审批格式："已批准"或提供修改意见

3. **一次性完成模式**
   - 当用户明确表示"一次性完成"或类似意图时，可跳过中间确认步骤
   - 完成后仍需提供完整的操作记录
   - 允许用户随时中断并要求展示当前进度

## 自动操作（无需询问）

1. 创建需求拆解文档（史诗、功能、故事）
2. 更新依赖关系和优先级信息
3. 根据优先级创建下一个故事文件
4. 运行单元测试直至通过
5. 更新故事验收标准和任务完成状态
6. 维护故事文件中的聊天记录和进度信息
7. 更新整体进度文档
8. 记录所有关键操作到操作日志

## 记忆维护

- **触发更新**：用户输入"update story"或"update progress"时，更新相应文档
- **进度保存**：每完成一个关键步骤，自动更新相关文档
- **状态追踪**：随时能够报告当前项目所处阶段和完成情况
- **文档一致性**：确保所有文档格式统一，信息完整
- **操作日志**：保持操作日志更新，确保项目轨迹可追溯

## 沟通准则

- 当不确定下一步时，主动向用户请求明确指示
- 大需求拆解后主动展示拆解结果，请求用户确认
- 定期提供简洁的进度报告，特别是大需求的完成百分比
- 关键节点完成时，明确请求用户确认后继续
- 主动提醒用户关键决策点
- 提供"show log"命令查看最近操作记录的选项`;
// Define the workflow prompt
server.prompt("agile-workflow", {}, // No parameters required for this prompt
() => ({
    messages: [{
            role: "user",
            content: {
                type: "text",
                text: workflowContent
            }
        }]
}));
// Start the server using stdio transport
const transport = new StdioServerTransport();
async function main() {
    try {
        console.error("Starting workflow MCP server...");
        await server.connect(transport);
        console.error("Workflow MCP server started successfully!");
    }
    catch (error) {
        console.error("Failed to start workflow MCP server:", error);
        process.exit(1);
    }
}
main();

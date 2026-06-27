# PageCraft AI — Design Document

## 实现思路

### 产品定位
**PageCraft AI** 是一个 AI 驱动的落地页生成器。用户通过自然语言对话描述产品需求，Agent 自动生成完整的 HTML/CSS/JS 落地页，支持多轮迭代修改和实时预览。

### 系统架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                         │
│                                                                 │
│  ┌──────────────┐  ┌────────────────┐  ┌─────────────────────┐ │
│  │ ProjectSidebar│  │   ChatPanel    │  │    PreviewPanel     │ │
│  │  (240px)     │  │   (flex-1)     │  │     (flex-1)        │ │
│  │ - 项目列表    │  │ - 流式对话     │  │ - iframe 实时预览   │ │
│  │ - 新建/删除   │  │ - 快捷模板     │  │ - 设备切换          │ │
│  │ - 重命名     │  │ - 错误提示     │  │ - 导出/下载         │ │
│  └──────────────┘  └────────────────┘  └─────────────────────┘ │
│          ↕                  ↕                     ↕            │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              useProjects + usePreview Hooks               │ │
│  │              (状态协调层 - 消息流/HTML提取/预览)            │ │
│  └───────────────────────────────────────────────────────────┘ │
│          ↕                  ↕                                   │
│  ┌──────────────┐  ┌────────────────┐                           │
│  │  localStorage │  │  useChat (AI)  │                           │
│  │  (持久化)    │  │  (流式SSE)     │                           │
│  └──────────────┘  └────────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓ POST /api/chat (SSE)
┌─────────────────────────────────────────────────────────────────┐
│                     Vercel Edge Runtime                         │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  streamText({ model: deepseek("deepseek-chat") })         │ │
│  │  → SSE stream → toDataStreamResponse()                   │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                       DeepSeek API                              │
│                  (deepseek-chat model)                          │
└─────────────────────────────────────────────────────────────────┘
```

### 核心数据流

1. 用户输入描述 → `handleSend` 保存用户消息到 localStorage
2. `handleSubmit` → `POST /api/chat` → DeepSeek SSE 流式响应
3. `useChat` 的 `chatMessages` 实时更新 → `extractHtmlFromText` 提取 HTML
4. `setHtml(html)` → iframe `srcDoc` 更新 → 预览实时渲染
5. `onFinish` → 保存完整 assistant 消息和 HTML 到 localStorage

### 技术选型

| 组件 | 选型 | 理由 |
|------|------|------|
| 框架 | Next.js 16 (App Router) + TypeScript | 全栈一体，Edge Runtime 支持 |
| UI | Tailwind CSS v4 + shadcn/ui | 高质量组件，可深度定制 |
| LLM | DeepSeek API (`@ai-sdk/deepseek@0.2`) | 国内直连、免费额度、中文能力强 |
| 流式 | Vercel AI SDK (`ai@4`) | SSE 流式开箱即用，`useChat` hook |
| 存储 | localStorage | 纯前端零依赖，单 key 可存 50-100 项目 |
| 预览 | iframe srcdoc + sandbox | 安全隔离，防止 XSS |
| 部署 | Vercel (Edge Runtime) | 一键部署，自动 CI/CD |

---

## 关键取舍

### 为什么选 DeepSeek 而不是其他 LLM？
- **国内直连**：无需翻墙，评审可直接体验
- **免费额度**：deepseek-chat 模型调用成本极低
- **中文能力**：生成的落地页中文内容质量高
- **Vercel AI SDK 官方支持**：`@ai-sdk/deepseek` 是官方 provider

### 为什么用 localStorage 而不是数据库？
- **零后端依赖**：无需部署数据库，降低运维成本
- **隐私友好**：用户数据完全在本地
- **MVP 足够**：单用户场景下 localStorage 5-10MB 容量足够存储数十个项目
- **取舍**：不支持跨设备同步，数据不持久（清除浏览器数据会丢失）

### 为什么用 Edge Runtime 而不是 Serverless？
- **流式响应**：Edge Runtime 对 SSE 长连接更友好
- **冷启动**：Edge 函数冷启动更快（ms 级 vs s 级）
- **Vercel Hobby Plan**：Serverless 有 10s 超时限制，Edge 无此限制

### 为什么生成完整 HTML 而不是组件/框架代码？
- **零依赖预览**：iframe srcdoc 直接渲染，无需构建工具
- **通用性强**：HTML/CSS/JS 任何人都能理解和部署
- **迭代简单**：LLM 每次输出完整页面，避免 diff 合并复杂度

### 放弃了什么？
- **用户认证**：MVP 不需要，localStorage 天然单用户
- **多页面生成**：聚焦单落地页场景，避免复杂度
- **代码编辑器**：对话式交互足够直观，无需暴露代码
- **服务端存储**：纯前端方案更简单，适合 Demo 场景

---

## 当前完成程度

### ✅ MVP 功能（已完成）
- [x] 自然语言对话生成落地页
- [x] 流式 SSE 响应，实时显示 AI 思考过程
- [x] 流式 HTML 提取，预览面板实时更新
- [x] 多轮迭代修改（基于对话历史）
- [x] 6 个快捷模板（SaaS/Portfolio/App推广等）
- [x] 设备预览切换（Desktop/Tablet/Mobile）
- [x] HTML 导出（复制/下载/新标签页打开）
- [x] 项目管理（创建/删除/重命名/切换）
- [x] localStorage 持久化（对话历史 + 生成 HTML）
- [x] 错误处理（API Key 缺失/网络错误/生成失败）
- [x] 加载状态（打字指示器 + 加载动画）
- [x] 响应式三栏布局（侧边栏 + 聊天 + 预览）

### ⚠️ 已知局限
- 生成质量依赖 LLM 能力，复杂交互可能不准确
- localStorage 容量有限（约 5-10MB），大量项目可能满额
- 不支持跨设备/跨浏览器同步
- 无用户认证，任何人可访问
- 预览 iframe 使用 `sandbox="allow-scripts"`，不支持 `allow-same-origin`（安全性考虑）

---

## 后续扩展优先级

### P0（核心体验提升）
1. **System Prompt 优化**：针对不同场景（电商/SaaS/内容）设计专属 prompt
2. **对话历史编辑**：支持修改/删除历史消息，重新生成
3. **版本历史**：保存每次生成的 HTML 版本，支持回滚对比
4. **错误重试机制**：网络断开后自动重试，断点续传

### P1（功能扩展）
5. **用户认证**：Clerk / NextAuth 登录，支持多用户
6. **云端存储**：PostgreSQL + Prisma，支持跨设备同步
7. **多页面生成**：支持生成多页面网站（首页/关于/联系）
8. **代码编辑器**：Monaco Editor 集成，支持手动微调代码
9. **图片上传**：支持用户上传图片，AI 集成到落地页中

### P2（高级功能）
10. **一键部署**：集成 Vercel/Netlify API，直接发布生成的页面
11. **模板市场**：用户分享/收藏高质量落地页模板
12. **协作编辑**：多人实时协作编辑同一项目
13. **A/B 测试**：生成多个版本，集成分析工具
14. **SEO 优化建议**：AI 分析页面结构，给出 SEO 改进建议

---

## 项目结构

```
pagecraft-ai/
├── app/
│   ├── api/chat/route.ts     # 流式 AI 对话 API (Edge Runtime)
│   ├── chat/[projectId]/     # 主工作区页面（三栏布局）
│   ├── layout.tsx            # 根布局
│   └── page.tsx              # 首页（欢迎/重定向）
├── components/
│   ├── chat/                 # 聊天面板组件
│   │   ├── ChatPanel.tsx     # 聊天面板容器
│   │   ├── MessageList.tsx   # 消息列表 + 自动滚底
│   │   ├── MessageBubble.tsx # 消息气泡 + Markdown 渲染
│   │   ├── ChatInput.tsx     # 输入框 + 发送/停止
│   │   └── QuickPrompts.tsx  # 快捷模板卡片
│   ├── preview/              # 预览面板组件
│   │   ├── PreviewPanel.tsx  # iframe 预览
│   │   ├── DeviceToggle.tsx  # 设备切换
│   │   └── ExportBar.tsx     # 导出操作栏
│   ├── project/              # 项目管理组件
│   │   ├── ProjectSidebar.tsx# 项目列表侧边栏
│   │   └── NewProjectDialog.tsx
│   └── ui/                   # shadcn/ui 基础组件
├── hooks/
│   ├── useProjects.ts        # 项目 CRUD + localStorage
│   └── usePreview.ts         # 预览状态 + 导出
├── lib/
│   ├── types.ts              # 类型定义
│   ├── storage.ts            # localStorage CRUD 封装
│   ├── extract-html.ts       # HTML 代码块提取
│   ├── deepseek.ts           # DeepSeek provider
│   └── system-prompt.ts      # Agent 系统提示词
└── .env.local                # 环境变量（DEEPSEEK_API_KEY）
```

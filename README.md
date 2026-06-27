# PageCraft AI

AI 驱动的落地页生成器 — 通过自然语言对话，自动生成完整的 HTML/CSS/JS 落地页。

## ✨ 功能特性

- 🤖 **AI 对话生成**：描述你的产品，AI 自动生成专业落地页
- ⚡ **实时预览**：流式响应，预览面板实时更新
- 🔄 **多轮迭代**：通过对话持续优化页面设计
- 📱 **设备预览**：支持桌面端、平板、手机端预览切换
- 📦 **一键导出**：复制 HTML / 下载文件 / 新标签页打开
- 💾 **本地持久化**：对话历史和生成结果自动保存到浏览器
- 🎨 **快捷模板**：6 个预设场景快速开始

## 🚀 快速开始

### 前置要求

- Node.js 18+
- DeepSeek API Key（[申请地址](https://platform.deepseek.com/)）

### 本地运行

```bash
# 1. 克隆项目
git clone https://github.com/your-username/pagecraft-ai.git
cd pagecraft-ai

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入你的 DeepSeek API Key

# 4. 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 环境变量

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `DEEPSEEK_API_KEY` | ✅ | DeepSeek API 密钥 |

## 🏗️ 技术栈

- **框架**: Next.js 16 (App Router) + TypeScript
- **UI**: Tailwind CSS v4 + shadcn/ui
- **LLM**: DeepSeek API + Vercel AI SDK
- **存储**: localStorage
- **部署**: Vercel (Edge Runtime)

## 📖 文档

- [DESIGN.md](./DESIGN.md) — 实现思路、技术选型、完成度、扩展计划

## 📄 License

MIT

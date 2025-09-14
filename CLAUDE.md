# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目架构

这是一个基于 TurboRepo 的 Next.js SaaS 项目，包含以下主要组件：

### 应用结构
- **saasfly**: 主要的 SaaS 应用
  - `apps/nextjs`: Next.js 主应用，包含营销页面、仪表板、文档、编辑器等
  - `packages/`: 共享包
    - `api`: tRPC API 路由
    - `auth`: 认证相关（支持 Clerk 和 NextAuth）
    - `db`: 数据库模式（使用 Prisma）
    - `ui`: 共享 UI 组件
    - `stripe`: Stripe 集成
    - `common`: 通用工具和配置
  - `tooling/`: 开发工具配置（ESLint、Prettier、Tailwind、TypeScript）

- **smart-bookmark-manager**: Chrome 扩展程序（独立项目）

### 技术栈
- **前端**: Next.js 14 (App Router), React 18, TypeScript
- **样式**: Tailwind CSS, Shadcn/ui, Framer Motion
- **状态管理**: Zustand, React Query (TanStack Query)
- **API**: tRPC, Next.js API Routes
- **认证**: Clerk（主要），NextAuth（备用）
- **数据库**: PostgreSQL, Prisma, Kysely
- **支付**: Stripe
- **邮件**: Resend
- **构建工具**: TurboRepo, Bun

### 核心功能模块
1. **营销页面**: 国际化支持，SEO 优化
2. **用户认证**: Clerk 集成，社交登录
3. **仪表板**: 用户数据展示，订阅管理
4. **文档系统**: 基于 MDX 的文档网站
5. **支付系统**: Stripe 订阅和一次性支付
6. **管理员界面**: 独立的管理员后台

## 开发命令

### 根目录命令
```bash
# 安装依赖
bun install

# 开发模式（所有应用）
bun run dev

# 仅开发 Web 应用（不包含 stripe）
bun run dev:web

# 构建所有应用
bun run build

# 代码质量检查
bun run lint          # ESLint 检查
bun run lint:fix      # 自动修复 ESLint 问题
bun run format        # Prettier 格式化检查
bun run format:fix    # 自动格式化代码
bun run typecheck     # TypeScript 类型检查

# 数据库相关
bun run db:push       # 推送数据库 schema 到数据库

# 清理
bun run clean         # 清理 node_modules
bun run clean:workspaces # 清理所有工作空间
```

### Next.js 应用特定命令
```bash
cd apps/nextjs

# 开发服务器
bun run dev

# 构建
bun run build

# 启动生产服务器
bun run start

# Lint 和格式化
bun run lint
bun run format
```

## 开发工作流程

### 1. 环境设置
- 复制 `.env.example` 到 `.env.local`
- 设置必要的环境变量（数据库 URL、认证密钥、Stripe 密钥等）
- 运行 `bun run db:push` 初始化数据库

### 2. 开发新功能
- 使用 TurboRepo 的 monorepo 结构，可以在 `packages/` 中创建共享包
- UI 组件放在 `packages/ui/src/`
- API 路由在 `packages/api/src/router/`
- 数据库模式在 `packages/db/prisma/schema.prisma`

### 3. 代码质量
- 所有代码必须通过 ESLint 和 Prettier 检查
- 使用 TypeScript 确保类型安全
- 运行 `bun run lint` 和 `bun run typecheck` 提交前检查

### 4. 部署
- 项目配置为在 Vercel 上部署
- 使用 TurboRepo 的构建管道优化构建性能
- 支持环境变量和数据库配置

## 重要配置文件

- `turbo.json`: TurboRepo 配置，定义构建管道和缓存策略
- `apps/nextjs/next.config.mjs`: Next.js 配置
- `packages/db/prisma/schema.prisma`: 数据库模式
- `tooling/`: 各种开发工具的共享配置

## 注意事项

- 项目使用 Bun 作为包管理器，但也可以使用 npm
- 支持国际化，翻译文件在 `apps/nextjs/src/config/dictionaries/`
- 默认使用 Clerk 进行认证，NextAuth 作为备用选项
- 包含完整的 Stripe 支付集成和订阅管理
#!/bin/bash

# Vercel 部署脚本
echo "开始 Vercel 部署构建..."

# 安装 Bun
curl -fsSL https://bun.sh/install | bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

# 验证 Bun 安装
bun --version

# 安装依赖
bun install

# 在 apps/nextjs 目录中构建 Next.js 应用
cd apps/nextjs
bun run build

# 将 .next 目录复制到根目录（Vercel 需要）
cp -r .next ../

echo "构建完成！"
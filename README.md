# Meal Moments 🍽️

私人生活记录与饮食开销分享应用。记录每日饮食照片、生活备注和消费金额，通过私密只读链接分享给家人或对象查看。

## 技术栈

- **框架**：Next.js 16 (App Router) + TypeScript
- **样式**：Tailwind CSS v4 + shadcn/ui
- **后端**：Next.js Route Handlers (`/api/v1`)
- **数据库**：Supabase PostgreSQL
- **鉴权**：Supabase Auth
- **图片存储**：Supabase Storage
- **部署**：Vercel（推荐）

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local`，填入你的 Supabase 项目信息：

```bash
cp .env.example .env.local
```

在 [Supabase Dashboard](https://supabase.com/dashboard) -> Project Settings -> API 中获取：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`（仅服务端使用，绝不能暴露到浏览器）

### 3. 初始化数据库

在 Supabase Dashboard -> SQL Editor 中执行：

```
supabase/migrations/0001_initial_schema.sql
```

详细步骤见 [docs/setup-supabase.md](docs/setup-supabase.md)。

### 4. 启动开发服务器

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 项目结构

```
app/
  (auth)/login/          登录页
  (admin)/admin/         管理首页
  (admin)/admin/new/     新建记录
  (admin)/stats/         统计页
  (admin)/settings/      设置页
  api/v1/                后端 API 接口
  records/[id]/          记录详情页
  share/[token]/         只读分享页
lib/
  server/                服务端业务逻辑（不可在客户端使用）
  client/                客户端工具（API client、图片压缩）
  shared/                前后端共用的常量、校验、格式化
components/              可复用 UI 组件
supabase/migrations/     数据库 SQL 迁移文件
docs/                    Supabase 配置文档
```

## 功能特性

- ✅ 邮箱密码登录（Supabase Auth）
- ✅ 创建/编辑/删除饮食记录
- ✅ 多图片上传（前端压缩 + Supabase Storage）
- ✅ 餐别、心情、标签、金额记录
- ✅ 生活流按日期分组展示
- ✅ 只读私密分享链接
- ✅ 消费统计（柱状图 + 饼图）
- ✅ 移动端优先响应式设计
- ✅ 服务端鉴权（管理页面强制登录）
- ✅ Row Level Security（数据库层面隔离）

## 部署

1. 推送代码到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 添加环境变量（同 `.env.local`，另加 `NEXT_PUBLIC_APP_URL` 为 Vercel 域名）
4. 部署完成

## 注意事项

- `SUPABASE_SERVICE_ROLE_KEY` 只能在服务端使用，已通过项目结构强制隔离
- 分享页图片通过服务端生成 signed URL，不直接暴露 Storage 路径
- 删除记录时会同步删除 Storage 中的图片文件

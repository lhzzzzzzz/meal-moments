# Supabase 初始化配置指南

## 1. 创建 Supabase 项目

1. 前往 [supabase.com](https://supabase.com) 登录或注册。
2. 点击 "New project"。
3. 填写项目名称（如 `meal-moments`）。
4. 设置数据库密码（请妥善保存）。
5. 选择离用户最近的区域。

## 2. 获取环境变量

在 Supabase Dashboard：

1. 进入 **Project Settings → API**。
2. 复制：
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY`（⚠️ 仅用于服务端）

将以上值填写到本地 `.env.local`（参考 `.env.example`）。

## 3. 执行数据库迁移

1. 进入 Supabase Dashboard → **SQL Editor**。
2. 点击 "New query"。
3. 打开本地 `supabase/migrations/0001_initial_schema.sql`。
4. 粘贴全部内容。
5. 点击 **Run**。
6. 执行成功后，进入 **Table Editor** 确认以下表已创建：
   - `profiles`
   - `records`
   - `record_images`
   - `tags`
   - `record_tags`
   - `share_links`

## 4. 配置 Auth

1. 进入 **Authentication → Providers**。
2. 确保 **Email** 已启用。
3. 在 **Authentication → Settings** 中：
   - 关闭 "Confirm email"（MVP 阶段可跳过邮件验证，简化调试）。
   - 或者保持开启，接收邮件验证。

## 5. 创建 Storage Bucket

migration SQL 已包含 bucket 创建语句。如果执行失败，手动创建：

1. 进入 **Storage**。
2. 点击 "New bucket"。
3. 名称：`record-images`。
4. 设置为 **Private**。
5. 文件大小限制：`8 MB`。
6. 允许 MIME 类型：`image/jpeg, image/png, image/webp`。

## 6. 创建第一个管理员账号

1. 进入 **Authentication → Users**。
2. 点击 "Add user"。
3. 填写邮箱和密码。
4. 用此邮箱和密码在 `/login` 页面登录。

## 7. 部署到 Vercel

1. 将代码推送到 GitHub。
2. 在 [vercel.com](https://vercel.com) 导入项目。
3. 在 **Environment Variables** 中填写：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL`（填写 Vercel 分配的域名，如 `https://meal-moments.vercel.app`）
4. 完成部署。

## 8. 可选：添加默认标签

登录后，进入 Supabase SQL Editor，执行 `supabase/seed.sql` 中的 SQL（将 `YOUR_USER_ID` 替换为实际 UUID）。

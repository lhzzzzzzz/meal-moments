-- 撤销 anon 对广场相关表的直接读取权限，防止脚本绕过 Next.js 直打数据库。
-- 游客广场改由服务端 service_role 查询（见 lib/server/db/plaza.ts）。

-- 删除 0006 中为 anon 创建的 RLS 策略
drop policy if exists "profiles: anon can view all" on public.profiles;
drop policy if exists "records: anon can select shared" on public.records;
drop policy if exists "record_images: anon can select shared" on public.record_images;
drop policy if exists "record_tags: anon can select shared" on public.record_tags;
drop policy if exists "tags: anon can select shared record tags" on public.tags;

-- 撤销 anon 表级 SELECT 权限
revoke select on public.records from anon;
revoke select on public.profiles from anon;
revoke select on public.record_images from anon;
revoke select on public.record_tags from anon;
revoke select on public.tags from anon;

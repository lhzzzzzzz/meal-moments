-- 将 record-images bucket 单文件大小限制从 8MB 调整为 2MB
-- 在 Supabase Dashboard -> SQL Editor 中执行

update storage.buckets
set file_size_limit = 2097152  -- 2MB
where id = 'record-images';

-- ============================================================
-- 将 record-images bucket 改为 public
-- 原因：image-picker 使用 getPublicUrl() 生成图片链接，
--       该链接格式仅对 public bucket 有效。
--       私有 bucket 需使用 signed URL，架构成本较高。
--       食物记录图片无高度敏感需求，public bucket 更简洁。
-- ============================================================

update storage.buckets
set public = true
where id = 'record-images';

-- 添加允许所有人读取 public bucket 的策略
-- （public bucket 本身已开放读取，此策略是显式备份）
drop policy if exists "storage: owner can view own images" on storage.objects;

create policy "storage: anyone can view record images"
  on storage.objects for select
  using (bucket_id = 'record-images');

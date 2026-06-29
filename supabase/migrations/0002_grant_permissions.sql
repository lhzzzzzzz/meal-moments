-- ============================================================
-- 补充表级权限授予
-- RLS 策略控制行级访问，但角色必须先拥有表级权限
-- ============================================================

-- records
grant select, insert, update, delete on public.records to authenticated;

-- profiles
grant select, update on public.profiles to authenticated;

-- record_images
grant select, insert, delete on public.record_images to authenticated;

-- tags
grant select, insert, update, delete on public.tags to authenticated;

-- record_tags
grant select, insert, delete on public.record_tags to authenticated;

-- share_links
grant select, insert, update, delete on public.share_links to authenticated;

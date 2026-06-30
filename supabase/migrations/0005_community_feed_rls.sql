-- 广场 feed：已登录用户可查看他人公开分享的记录及相关数据

-- profiles：已登录用户可读取所有用户的公开资料（用于展示作者名）
create policy "profiles: authenticated can view all"
  on public.profiles for select
  to authenticated
  using (true);

-- records：已登录用户可查看所有 is_shared = true 的记录
create policy "records: authenticated can select shared"
  on public.records for select
  to authenticated
  using (is_shared = true);

-- record_images：可查看公开记录的图片
create policy "record_images: authenticated can select shared"
  on public.record_images for select
  to authenticated
  using (
    exists (
      select 1 from public.records r
      where r.id = record_images.record_id and r.is_shared = true
    )
  );

-- record_tags：可查看公开记录的标签
create policy "record_tags: authenticated can select shared"
  on public.record_tags for select
  to authenticated
  using (
    exists (
      select 1 from public.records r
      where r.id = record_tags.record_id and r.is_shared = true
    )
  );

-- tags：可查看公开记录所关联的标签定义
create policy "tags: authenticated can select shared record tags"
  on public.tags for select
  to authenticated
  using (
    exists (
      select 1
      from public.record_tags rt
      join public.records r on r.id = rt.record_id
      where rt.tag_id = tags.id and r.is_shared = true
    )
  );

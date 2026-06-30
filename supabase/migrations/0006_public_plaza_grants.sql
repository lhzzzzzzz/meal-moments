-- 补充 anon / service_role 表级权限，并允许游客（未登录）只读访问广场公开数据

-- service_role：供服务端 admin client 使用（分享页、token 校验等）
grant select on public.records to service_role;
grant select on public.profiles to service_role;
grant select on public.record_images to service_role;
grant select on public.record_tags to service_role;
grant select on public.tags to service_role;
grant select on public.share_links to service_role;

-- anon：供游客广场只读访问
grant select on public.records to anon;
grant select on public.profiles to anon;
grant select on public.record_images to anon;
grant select on public.record_tags to anon;
grant select on public.tags to anon;

-- anon RLS：仅允许读取 is_shared = true 的公开内容
create policy "profiles: anon can view all"
  on public.profiles for select
  to anon
  using (true);

create policy "records: anon can select shared"
  on public.records for select
  to anon
  using (is_shared = true);

create policy "record_images: anon can select shared"
  on public.record_images for select
  to anon
  using (
    exists (
      select 1 from public.records r
      where r.id = record_images.record_id and r.is_shared = true
    )
  );

create policy "record_tags: anon can select shared"
  on public.record_tags for select
  to anon
  using (
    exists (
      select 1 from public.records r
      where r.id = record_tags.record_id and r.is_shared = true
    )
  );

create policy "tags: anon can select shared record tags"
  on public.tags for select
  to anon
  using (
    exists (
      select 1
      from public.record_tags rt
      join public.records r on r.id = rt.record_id
      where rt.tag_id = tags.id and r.is_shared = true
    )
  );

-- ============================================================
-- Meal Moments - 初始数据库结构
-- 执行方式：Supabase Dashboard -> SQL Editor -> 粘贴后 Run
-- ============================================================

-- 启用 uuid 扩展
create extension if not exists "pgcrypto";

-- ============================================================
-- 自动更新 updated_at 的触发器函数
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- profiles 表
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url   text,
  share_title  text,
  share_description text,
  timezone    text not null default 'Australia/Sydney',
  currency    text not null default 'CNY',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- 新用户注册时自动创建 profiles 行
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, timezone, currency)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    'Australia/Sydney',
    'CNY'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- records 表
-- ============================================================
create table if not exists public.records (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  note        text,
  meal_type   text not null,
  mood        text,
  location    text,
  amount      numeric(10,2),
  currency    text not null default 'CNY',
  occurred_at timestamptz not null,
  is_shared   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists records_user_id_idx on public.records(user_id);
create index if not exists records_occurred_at_idx on public.records(occurred_at desc);
create index if not exists records_is_shared_idx on public.records(is_shared);
create index if not exists records_user_occurred_idx on public.records(user_id, occurred_at desc);

create trigger records_updated_at
  before update on public.records
  for each row execute function public.handle_updated_at();

-- ============================================================
-- record_images 表
-- ============================================================
create table if not exists public.record_images (
  id           uuid primary key default gen_random_uuid(),
  record_id    uuid not null references public.records(id) on delete cascade,
  storage_path text not null,
  public_url   text not null,
  width        integer,
  height       integer,
  size_bytes   integer,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists record_images_record_id_idx on public.record_images(record_id);

-- ============================================================
-- tags 表
-- ============================================================
create table if not exists public.tags (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  color      text,
  created_at timestamptz not null default now(),
  unique(user_id, name)
);

create index if not exists tags_user_id_idx on public.tags(user_id);

-- ============================================================
-- record_tags 表
-- ============================================================
create table if not exists public.record_tags (
  record_id uuid not null references public.records(id) on delete cascade,
  tag_id    uuid not null references public.tags(id) on delete cascade,
  primary key (record_id, tag_id)
);

-- ============================================================
-- share_links 表
-- ============================================================
create table if not exists public.share_links (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  token      text not null unique,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create index if not exists share_links_token_idx on public.share_links(token);

create trigger share_links_updated_at
  before update on public.share_links
  for each row execute function public.handle_updated_at();

-- ============================================================
-- RLS - Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.records enable row level security;
alter table public.record_images enable row level security;
alter table public.tags enable row level security;
alter table public.record_tags enable row level security;
alter table public.share_links enable row level security;

-- profiles: Owner 只能访问自己的数据
create policy "profiles: owner can view own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: owner can update own"
  on public.profiles for update
  using (auth.uid() = id);

-- records: Owner 完整 CRUD
create policy "records: owner can select"
  on public.records for select
  using (auth.uid() = user_id);

create policy "records: owner can insert"
  on public.records for insert
  with check (auth.uid() = user_id);

create policy "records: owner can update"
  on public.records for update
  using (auth.uid() = user_id);

create policy "records: owner can delete"
  on public.records for delete
  using (auth.uid() = user_id);

-- record_images: 跟随 records 权限
create policy "record_images: owner can select"
  on public.record_images for select
  using (
    exists (
      select 1 from public.records r
      where r.id = record_images.record_id and r.user_id = auth.uid()
    )
  );

create policy "record_images: owner can insert"
  on public.record_images for insert
  with check (
    exists (
      select 1 from public.records r
      where r.id = record_images.record_id and r.user_id = auth.uid()
    )
  );

create policy "record_images: owner can delete"
  on public.record_images for delete
  using (
    exists (
      select 1 from public.records r
      where r.id = record_images.record_id and r.user_id = auth.uid()
    )
  );

-- tags: Owner 完整 CRUD
create policy "tags: owner can select"
  on public.tags for select
  using (auth.uid() = user_id);

create policy "tags: owner can insert"
  on public.tags for insert
  with check (auth.uid() = user_id);

create policy "tags: owner can delete"
  on public.tags for delete
  using (auth.uid() = user_id);

-- record_tags: 跟随 records 权限
create policy "record_tags: owner can select"
  on public.record_tags for select
  using (
    exists (
      select 1 from public.records r
      where r.id = record_tags.record_id and r.user_id = auth.uid()
    )
  );

create policy "record_tags: owner can insert"
  on public.record_tags for insert
  with check (
    exists (
      select 1 from public.records r
      where r.id = record_tags.record_id and r.user_id = auth.uid()
    )
  );

create policy "record_tags: owner can delete"
  on public.record_tags for delete
  using (
    exists (
      select 1 from public.records r
      where r.id = record_tags.record_id and r.user_id = auth.uid()
    )
  );

-- share_links: Owner 完整 CRUD
-- 注意：匿名用户不允许直接查询 share_links，分享页通过服务端 admin client 校验 token
create policy "share_links: owner can select"
  on public.share_links for select
  using (auth.uid() = user_id);

create policy "share_links: owner can insert"
  on public.share_links for insert
  with check (auth.uid() = user_id);

create policy "share_links: owner can update"
  on public.share_links for update
  using (auth.uid() = user_id);

-- ============================================================
-- Storage: record-images bucket RLS（在 Supabase Dashboard 配置）
-- 下面是 SQL 方式配置 Storage RLS 供参考
-- ============================================================

-- 说明：Storage bucket 和 RLS 需在 Supabase Dashboard 中创建：
-- 1. Storage -> New bucket -> 名称：record-images -> Private
-- 2. 在 bucket policies 中添加以下策略：
--    - 已登录用户只能在 {userId}/ 前缀下上传和读取
-- 下面的 SQL 通过 storage.objects 表配置（如果 Storage 允许）

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'record-images',
  'record-images',
  false,
  8388608,  -- 8MB
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Storage RLS 策略
create policy "storage: owner can upload to own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'record-images' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage: owner can view own images"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'record-images' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage: owner can delete own images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'record-images' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

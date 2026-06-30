-- 默认标签 seed
-- 在 Supabase Dashboard -> SQL Editor 中执行
-- 将下面的邮箱替换成你登录 Meal Moments 时用的邮箱

insert into public.tags (user_id, name, color)
select u.id, t.name, t.color
from auth.users u
cross join (
  values
    ('外卖', '#F6D78B'),
    ('自己做', '#A9C7E8'),
    ('食堂', '#EFB4B8'),
    ('聚餐', '#B8E8B4'),
    ('健康', '#A9C7E8'),
    ('甜品', '#EFB4B8')
) as t(name, color)
where u.email = 'YOUR_EMAIL@example.com'
on conflict (user_id, name) do nothing;

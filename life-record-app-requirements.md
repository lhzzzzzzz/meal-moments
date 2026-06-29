# 私人生活记录与饮食开销分享 App 需求清单

版本：v0.1  
创建日期：2026-06-29  
项目阶段：Web Demo / MVP  
目标平台：优先 Web 移动端体验，后续迁移或扩展到 iPhone App

## 1. 项目一句话定位

本项目是一个面向亲密关系的私人生活记录与饮食开销分享工具。用户本人可以上传每日饮食照片、记录简单文字和消费金额，家人或对象通过只读页面查看用户的生活近况。

## 2. 项目背景

很多人在外学习、工作或独自生活时，家人和对象会关心“今天吃得怎么样”“有没有好好生活”“最近花钱多不多”。但日常聊天中频繁报备会比较碎片化，照片散落在微信、相册或聊天记录里，不方便长期回顾。

本项目希望把“记录生活”和“给亲近的人看”结合起来。它不做公开社交，不追求复杂内容生产，而是围绕一个非常轻量的使用场景：

- 我每天上传吃饭照片和简单记录。
- 我的对象和家人可以打开一个页面查看。
- 我可以顺便记录每顿饭的花费。
- 后续可以扩展为支持多人、登录、家庭空间、评论互动和 iOS App。

## 3. 项目目标

### 3.1 对用户生活的价值

- 帮助自己形成稳定的生活记录习惯。
- 让家人和对象更方便地了解自己的近况。
- 通过饮食开销记录，了解自己的消费结构。
- 把散落的饭菜照片、日常备注、金额记录集中起来。
- 让记录过程尽量轻，不像传统日记那样有负担。

### 3.2 对简历项目的价值

该项目不应只被包装成“一个 CRUD 项目”，而应体现以下能力：

- 产品设计能力：从真实生活场景中提炼需求。
- 前端工程能力：移动端优先、响应式布局、图片上传体验。
- 后端接口设计：记录、图片、账单、只读分享权限。
- 数据建模能力：用户、生活记录、图片、消费、标签、分享链接。
- 隐私意识：私人内容、只读访问、公开范围控制。
- 工程交付能力：从 MVP 到上线部署，再到后续 iOS 演进。

## 4. 目标用户

### 4.1 MVP 阶段用户

MVP 阶段只面向一个核心上传用户：

- 用户本人：负责上传、编辑、删除生活记录。
- 家人 / 对象：通过只读页面浏览，不需要编辑。

### 4.2 后续扩展用户

后续版本可以支持：

- 多个上传者。
- 多个家庭成员。
- 情侣共同记录。
- 留学生、异地工作者、独居用户。
- 小范围私密社交用户。

## 5. 核心使用场景

### 5.1 每天吃饭后快速记录

用户打开上传页，上传饭菜照片，选择餐别，填写金额和简单备注，然后保存。保存后记录出现在生活流首页。

### 5.2 家人查看近况

家人打开只读分享链接，可以按日期浏览用户最近吃了什么、有没有正常吃饭、每天大概状态如何。

### 5.3 对象查看今日生活

对象可以打开页面查看今天的记录，看到图片、备注、心情标签和花费。MVP 阶段不需要评论和点赞。

### 5.4 自己查看消费统计

用户可以进入统计页，查看本周、本月饮食花费总额，以及早餐、午餐、晚餐、零食、饮品等分类占比。

### 5.5 回顾一段时间的生活

用户可以按日历或时间线浏览过去一周、一个月的记录，形成一个私人的生活档案。

## 6. 产品原则

- 简单：上传和查看都要足够快，避免复杂表单。
- 私密：默认不是公开社交产品，内容只给被允许的人看。
- 温暖：视觉和文案要有生活感，不做冷冰冰的后台系统。
- 真实：优先呈现真实照片、日期、备注，不做过度包装。
- 可扩展：MVP 虽然只支持单用户，但数据模型要为多用户留空间。
- 移动端优先：Web Demo 必须在 iPhone 浏览器里体验良好。

## 7. MVP 范围

### 7.1 MVP 必须包含

- 新建饮食生活记录。
- 上传一张或多张图片。
- 填写标题。
- 填写备注。
- 选择餐别。
- 填写金额。
- 选择日期和时间。
- 添加简单标签。
- 生活流首页。
- 记录详情页。
- 统计页。
- 管理员上传入口。
- 只读访客页面。
- 基础响应式适配。
- 基础错误提示和加载状态。
- 数据持久化。
- 图片存储。
- 部署到可访问的线上地址。

### 7.2 MVP 暂不包含

- AI 图片识别。
- 自动识别菜品和热量。
- 完整社交系统。
- 点赞、评论、私信。
- 多人家庭空间。
- 复杂预算系统。
- 银行账单导入。
- 原生 iOS App。
- Android App。
- 微信登录。
- 支付功能。

## 8. 角色与权限

### 8.1 角色定义

#### Owner

Owner 是本人账号，拥有全部管理权限。

权限：

- 创建记录。
- 编辑记录。
- 删除记录。
- 上传图片。
- 删除图片。
- 查看全部记录。
- 查看统计数据。
- 管理分享链接。

#### Viewer

Viewer 是家人或对象，只能查看被分享的内容。

权限：

- 查看生活流。
- 查看记录详情。
- 查看基础统计。
- 不可创建记录。
- 不可编辑记录。
- 不可删除记录。
- 不可访问管理后台。

### 8.2 MVP 权限方案

MVP 阶段可以采用简单方案：

- Owner 通过固定管理入口进入上传页面。
- Viewer 通过私密分享链接访问只读页面。
- 分享链接包含一个不可猜测的 token。
- 只读页面不展示编辑和删除按钮。

示例：

- 管理入口：`/admin`
- 只读入口：`/share/[token]`

注意：如果项目部署到公网，管理入口不能只靠隐藏路径。建议 MVP 也实现一个简单登录或管理密码。

## 9. 信息架构

### 9.1 页面结构

- `/`
  - 默认跳转到生活流，或根据权限显示不同入口。

- `/admin`
  - Owner 管理首页。
  - 显示上传按钮、最近记录、统计入口。

- `/admin/new`
  - 新建记录页面。

- `/admin/records/[id]/edit`
  - 编辑记录页面。

- `/records/[id]`
  - 记录详情页。
  - Owner 可看到编辑按钮。
  - Viewer 只能查看。

- `/share/[token]`
  - 访客只读生活流。

- `/stats`
  - 统计页。
  - MVP 可只对 Owner 开放。

- `/settings`
  - 设置页。
  - 管理分享链接、基础偏好。

### 9.2 页面导航

移动端底部导航建议包含：

- 首页：生活流。
- 上传：新增记录。
- 统计：消费统计。
- 设置：分享和偏好。

只读访客页面不展示完整底部导航，只展示：

- 生活流。
- 记录详情。
- 简单筛选。

## 10. 功能需求

## 10.1 生活记录创建

### 描述

Owner 可以创建一条新的生活记录。记录以饮食图片为核心，同时包含文字、金额和分类信息。

### 字段

- 标题：必填，最多 40 字。
- 图片：必填，至少 1 张，最多 6 张。
- 餐别：必填，可选早餐、午餐、晚餐、夜宵、零食、饮品、其他。
- 金额：选填，单位为人民币，允许 0 或空。
- 日期时间：必填，默认当前时间。
- 地点：选填，最多 40 字。
- 备注：选填，最多 300 字。
- 心情：选填，可选开心、平常、疲惫、满足、想家、忙碌、其他。
- 标签：选填，可多选，如外卖、自己做、食堂、聚餐、健康、甜品。
- 是否在分享页显示：默认显示。

### 交互要求

- 上传图片前允许预览。
- 支持删除已选图片。
- 金额输入框只允许数字和小数点。
- 日期时间默认当前时间，但可以手动修改。
- 保存时显示 loading 状态。
- 保存成功后跳转到详情页或生活流。
- 保存失败时保留表单内容并显示错误提示。

### 验收标准

- 未上传图片时不能保存。
- 未填写标题时不能保存。
- 采用「先上传图片到 Storage，全部成功后再创建 records」的顺序；任一图片上传失败则不创建记录。
- 如果记录创建失败，需回收（删除）本次已上传到 Storage 的图片，避免产生孤儿文件。
- 创建成功后生活流立即能看到新记录。

## 10.2 图片上传

### 描述

支持用户上传饭菜照片。图片应存储在对象存储中，数据库只保存图片 URL 和元数据。

### 要求

- MVP 阶段仅支持 jpg、jpeg、png、webp。
- 暂不支持 heic（iPhone 默认格式），原因是浏览器无法直接显示、且前端压缩库不支持解码。HEIC 转码放到后续优化。
- 单张图片建议限制 8MB 以内。
- MVP 阶段最多上传 6 张图片。
- 前端上传前应做基础文件类型校验。
- 可以在前端压缩图片，减少上传时间。
- 每张图片保存原图 URL 或压缩图 URL。
- 生活流优先展示第一张图作为封面。

### 后续优化

- 生成缩略图。
- 图片懒加载。
- 使用 blur placeholder。
- 支持拖拽排序。
- 支持删除单张已上传图片。
- 支持 HEIC：前端用 heic2any 转码，或服务端转码为 webp/jpeg。

## 10.3 生活流首页

### 描述

生活流是家人和对象最常看的页面。它按时间展示用户最近的饮食和生活记录。

### 展示内容

每条记录卡片包含：

- 封面图片。
- 标题。
- 日期和时间。
- 餐别。
- 金额。
- 心情。
- 标签。
- 备注摘要。

### 排序

- 默认按记录时间倒序。
- 最新记录显示在最上方。

### 分组

建议按日期分组：

- 今天。
- 昨天。
- 本周较早时候。
- 具体日期。

### 筛选

MVP 可支持简单筛选：

- 按餐别筛选。
- 按日期范围筛选。
- 是否只看有金额的记录。

### 空状态

没有记录时展示温和的空状态文案：

- Owner 看到“还没有记录，上传今天的第一餐吧。”
- Viewer 看到“还没有可以查看的记录。”

### 验收标准

- 新记录创建后能在首页显示。
- 只读页面不出现编辑和删除入口。
- 图片加载失败时有占位样式。
- 移动端卡片不横向溢出。

## 10.4 记录详情页

### 描述

详情页展示一条记录的完整内容。

### 内容

- 大图轮播或图片网格。
- 标题。
- 日期时间。
- 餐别。
- 金额。
- 地点。
- 心情。
- 标签。
- 完整备注。
- 创建时间。
- 更新时间。

### Owner 操作

- 编辑。
- 删除。
- 返回生活流。

### Viewer 操作

- 返回生活流。
- 不显示编辑和删除。

### 删除确认

删除记录时必须弹出确认：

- 标题：确认删除这条记录？
- 说明：删除后无法恢复。
- 操作：取消 / 删除。

### 验收标准

- Owner 可以从详情页进入编辑。
- Viewer 不会看到任何管理操作。
- 删除后记录从生活流和统计中消失。
- 删除记录时，服务端需同步删除该记录在 Storage 中的所有图片文件，不只删数据库行。

## 10.5 记录编辑

### 描述

Owner 可以编辑已有记录。

### 可编辑字段

- 标题。
- 图片。
- 餐别。
- 金额。
- 日期时间。
- 地点。
- 备注。
- 心情。
- 标签。
- 是否在分享页显示。

### 图片编辑方式

- 编辑提交时，前端传完整的图片列表（含已有图片的 storage_path 与新上传图片）。
- 服务端对比差异：新增的入库、被移除的从 Storage 和 record_images 一并删除、按列表顺序更新 sort_order。
- 编辑后仍需满足「至少 1 张图片」。

### 验收标准

- 编辑后详情页展示最新数据。
- 编辑后统计页使用最新金额。
- 如果关闭分享显示，访客页面看不到该记录。

## 10.6 统计页

### 描述

统计页帮助用户了解饮食开销和生活记录频率。

### MVP 统计指标

- 今日饮食花费。
- 本周饮食花费。
- 本月饮食花费。
- 本月记录天数。
- 本月记录总数。
- 按餐别统计金额。
- 按标签统计记录数量。

### 图表建议

- 顶部使用数字摘要卡片。
- 使用柱状图展示最近 7 天花费。
- 使用环形图或列表展示餐别占比。
- 使用简单日历热力图展示记录频率。

### 筛选

- 本周。
- 本月。
- 最近 3 个月。
- 自定义日期范围。

### 验收标准

- 新增、编辑、删除记录后统计数据正确变化。
- 没有金额的记录不计入金额统计，但计入记录数量。
- 金额显示保留两位小数。
- 所有「今日 / 本周 / 本月」以及日历热力图的按天聚合，必须使用 profiles.timezone（默认 Australia/Sydney）做时区换算后再 date_trunc，不能直接按 UTC 切天。

## 10.7 只读分享

### 描述

家人和对象通过私密链接查看生活流。MVP 阶段不要求每个 Viewer 单独登录。

### 分享链接

示例：

`/share/ckx_private_random_token`

### 要求

- token 不应容易猜测。
- 只读页面只展示 `isShared = true` 的记录。
- 不展示管理入口。
- 不展示上传按钮。
- 不展示删除按钮。
- 不展示内部 ID。

### 设置页能力

- 查看当前分享链接。
- 复制分享链接。
- 重新生成分享 token。
- 开启或关闭分享。

说明：MVP 阶段每个 user 只维护一条 share_links 记录。重新生成 token 即更新该行的 token，旧链接随之失效；分享开关通过 is_enabled 控制。

### 验收标准

- 关闭分享后旧链接不可访问。
- 重新生成 token 后旧链接失效。
- Viewer 不能通过 URL 访问编辑页面。

## 10.8 设置页

### MVP 设置项

- 用户展示名。
- 分享页标题。
- 分享页描述。
- 分享链接开关。
- 复制分享链接。
- 重新生成分享 token。
- 默认货币：人民币。
- 默认时区：Australia/Sydney。

### 后续设置项

- 家人备注名。
- 默认是否分享新记录。
- 图片压缩质量。
- 主题色。
- 数据导出。
- 删除全部数据。

## 10.9 登录与访问控制

### MVP 推荐方案

为了避免公网部署后管理入口被他人使用，MVP 也建议加入基础登录。

可选实现：

- Supabase Auth 邮箱登录。
- 或一个简单的管理密码。

推荐使用 Supabase Auth，因为它更接近真实项目，也更适合简历表达。

### 登录需求

- Owner 访问 `/admin`、`/admin/new`、`/admin/records/[id]/edit`、`/settings` 时必须登录。
- 未登录访问管理页面时跳转到 `/login`。
- Viewer 访问 `/share/[token]` 不需要登录。

### 验收标准

- 未登录不能创建、编辑、删除记录。
- 登录后可以正常管理记录。
- 登出后不能继续访问管理页面。

## 10.10 搜索与筛选

### MVP 搜索

可以先不做全文搜索，但建议做基础筛选：

- 餐别。
- 标签。
- 日期范围。

### 后续搜索

- 按标题搜索。
- 按备注搜索。
- 按地点搜索。
- 搜索“火锅”“咖啡”“食堂”等关键词。

## 10.11 数据导出

MVP 可不做。后续可以提供：

- 导出 CSV。
- 导出图片和 JSON。
- 按月份导出 PDF 生活报告。

## 11. 数据模型

以下数据模型以 Supabase PostgreSQL 为基础设计。

## 11.1 users

如果使用 Supabase Auth，可以直接使用 `auth.users`，应用侧额外建 `profiles` 表。

### profiles

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | uuid | 是 | 对应 auth.users.id |
| display_name | text | 是 | 用户展示名 |
| avatar_url | text | 否 | 头像 |
| share_title | text | 否 | 分享页标题 |
| share_description | text | 否 | 分享页描述 |
| timezone | text | 是 | 默认 Australia/Sydney |
| currency | text | 是 | 默认 CNY |
| created_at | timestamptz | 是 | 创建时间 |
| updated_at | timestamptz | 是 | 更新时间 |

## 11.2 records

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | uuid | 是 | 主键 |
| user_id | uuid | 是 | 所属用户 |
| title | text | 是 | 标题 |
| note | text | 否 | 备注 |
| meal_type | text | 是 | 餐别 |
| mood | text | 否 | 心情 |
| location | text | 否 | 地点 |
| amount | numeric(10,2) | 否 | 金额 |
| currency | text | 是 | 默认 CNY |
| occurred_at | timestamptz | 是 | 记录发生时间 |
| is_shared | boolean | 是 | 是否展示到分享页 |
| created_at | timestamptz | 是 | 创建时间 |
| updated_at | timestamptz | 是 | 更新时间 |

### meal_type 枚举建议

- breakfast
- lunch
- dinner
- midnight_snack
- snack
- drink
- other

### mood 枚举建议

- happy
- normal
- tired
- satisfied
- homesick
- busy
- other

## 11.3 record_images

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | uuid | 是 | 主键 |
| record_id | uuid | 是 | 所属记录 |
| storage_path | text | 是 | 存储路径 |
| public_url | text | 是 | 图片 URL |
| width | integer | 否 | 图片宽度 |
| height | integer | 否 | 图片高度 |
| size_bytes | integer | 否 | 图片大小 |
| sort_order | integer | 是 | 排序 |
| created_at | timestamptz | 是 | 创建时间 |

## 11.4 tags

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | uuid | 是 | 主键 |
| user_id | uuid | 是 | 所属用户 |
| name | text | 是 | 标签名 |
| color | text | 否 | 标签颜色 |
| created_at | timestamptz | 是 | 创建时间 |

## 11.5 record_tags

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| record_id | uuid | 是 | 记录 ID |
| tag_id | uuid | 是 | 标签 ID |

## 11.6 share_links

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| id | uuid | 是 | 主键 |
| user_id | uuid | 是 | 所属用户 |
| token | text | 是 | 分享 token |
| is_enabled | boolean | 是 | 是否启用 |
| created_at | timestamptz | 是 | 创建时间 |
| updated_at | timestamptz | 是 | 更新时间 |

## 12. API / Server Actions 设计

项目采用 Next.js 单仓库实现，但必须保持清晰的前后端分层。页面、组件和交互属于前端层；鉴权、权限校验、数据库读写、分享 token 校验、图片访问控制属于服务端层。

为了后续 iPhone App 可以复用接口，MVP 阶段推荐优先使用 Next.js Route Handlers 作为稳定 API 边界。Server Actions 可以用于简单的表单提交，但不能替代所有 API 设计。

### 12.0 架构边界

本项目不是传统的两个仓库前后端分离，也不是把所有逻辑混在 React 组件里的“松散全栈”。推荐方式是：

```text
一个 Next.js 仓库
  前端层：页面、React 组件、表单交互、视觉样式
  API 层：app/api/v1 下的 Route Handlers
  服务端业务层：lib/server 下的数据库、权限、图片、统计逻辑
  共享层：types、validators、constants、formatters

Supabase
  PostgreSQL 数据库
  Auth 登录
  Storage 图片存储
```

核心原则：

- 不单独创建 Express、NestJS、Spring Boot 等后端项目。
- 不在 UI 组件里直接写复杂数据库逻辑。
- 所有创建、编辑、删除、统计、分享校验都必须经过服务端。
- 前端组件只负责展示、输入、调用 API 和处理状态。
- 后续 iOS App 可以复用 `/api/v1` 下的接口。
- Supabase `service_role` key 只能出现在服务端环境变量中，绝不能传到浏览器。

### 12.0.1 推荐请求流

Owner 创建记录：

```text
浏览器表单
  -> 先上传图片到 Supabase Storage（自己的 {userId}/ 目录）
  -> 拿到图片路径
  -> POST /api/v1/records（携带图片路径与元数据）
  -> 服务端校验登录用户
  -> 服务端校验字段
  -> Supabase PostgreSQL 写入 records 和 record_images
  -> 写入失败则删除本次已上传的图片
  -> 返回 recordId
```

Viewer 查看分享页：

```text
浏览器访问 /share/[token]
  -> GET /api/v1/share/[token]/records
  -> 服务端校验 token 是否有效
  -> 服务端只查询 is_shared = true 的记录
  -> 服务端返回可展示数据
```

统计页：

```text
浏览器访问 /stats
  -> GET /api/v1/stats
  -> 服务端校验 Owner 登录状态
  -> 数据库聚合统计
  -> 返回图表数据
```

### 12.0.2 Cursor 实现时的禁止事项

- 不要让未登录用户调用管理接口。
- 不要把 Supabase service role key 写进客户端代码。
- 不要在 `components/` 里直接调用带有管理员权限的 Supabase client。
- 不要让分享页直接查询所有 records 后再由前端过滤；分享数据必须由服务端校验 token 后只返回 `is_shared = true` 的记录。
- 不要把图片原图无压缩地直接长期存储。
- 不要为了第一版额外创建独立后端仓库。

## 12.1 Records

### 创建记录

`POST /api/v1/records`

请求字段：

- title
- note
- mealType
- mood
- location
- amount
- occurredAt
- isShared
- tagIds
- images

响应：

- recordId
- createdAt

### 获取记录列表

`GET /api/v1/records`

Query：

- page
- pageSize
- mealType
- tag
- startDate
- endDate
- sharedOnly

响应：

- records
- total
- nextPage

### 获取单条记录

`GET /api/v1/records/[id]`

响应：

- record
- images
- tags

### 更新记录

`PATCH /api/v1/records/[id]`

### 删除记录

`DELETE /api/v1/records/[id]`

## 12.2 Upload

### 上传策略

推荐使用 Supabase Storage 私有 bucket。Owner 上传图片时必须处于登录状态，上传路径中包含当前用户 ID。数据库中只保存图片路径和必要元数据，不直接保存图片二进制内容。

MVP 可以选择两种实现方式：

- 方式 A：登录用户通过 Supabase SDK 上传到私有 bucket，并使用 Storage RLS 限制只能上传到自己的目录。
- 方式 B：前端先调用 `/api/v1/uploads/sign` 获取受控上传信息，再上传图片。

第一版推荐方式 A，开发更快；后续如果要给 iOS App 或更严格的服务端审计，可以升级为方式 B。

Bucket 建议：

- `record-images`

路径建议：

`{userId}/{recordId}/{timestamp}-{filename}`

注意：

- bucket 优先设为 private。
- Viewer 查看分享页图片时，由服务端返回可访问 URL。
- 如果使用 signed URL，应设置合理过期时间。
- 前端上传前应压缩图片，避免免费额度被手机原图快速占满。

## 12.3 Share

### 获取分享页数据

`GET /api/v1/share/[token]/records`

要求：

- 校验 token 是否存在。
- 校验分享是否启用。
- 只返回 `is_shared = true` 的记录。
- 由于 records 表开启了 RLS 且不对匿名用户开放，分享接口必须在服务端使用 admin client（service_role）绕过 RLS，校验 token 与 is_enabled 后，再手动只查询该 user 下 `is_shared = true` 的记录。
- 这是 MVP 中唯一允许在服务端用 service_role 主动读取业务数据的接口。

## 12.4 Stats

### 获取统计数据

`GET /api/v1/stats`

Query：

- startDate
- endDate

响应：

- totalAmount
- recordCount
- activeDays
- amountByMealType
- recordsByTag
- dailyAmount

## 13. 技术栈

### 13.1 推荐技术栈

- 框架：Next.js 15 或当前稳定版 Next.js App Router。
- 语言：TypeScript。
- 样式：Tailwind CSS。
- UI 基础：shadcn/ui。
- 图标：lucide-react。
- 表单：react-hook-form。
- 校验：zod。
- 图表：recharts。
- 日期处理：date-fns。
- 数据库：Supabase PostgreSQL。
- 鉴权：Supabase Auth。
- 图片存储：Supabase Storage。
- 前端部署：Vercel 优先（Next.js 官方平台，零配置、与 Supabase SSR 兼容最好），Cloudflare Pages / Workers 作为后续可迁移的备选。
- 域名与 DNS：Cloudflare。
- AI / MCP 协作：优先考虑 Supabase MCP、Cloudflare MCP 或 Cursor 对应集成。

### 13.1.1 架构选择

本项目采用“单仓库、分层式全栈架构”：

- 单仓库：代码放在一个 Next.js 项目里，降低开发、部署和维护成本。
- 前端层：负责页面、组件、表单、样式、交互。
- API 层：使用 Next.js Route Handlers 暴露 `/api/v1` 接口。
- 服务端业务层：集中处理 Supabase 查询、权限判断、图片访问、统计逻辑。
- 数据层：Supabase PostgreSQL、Auth、Storage。

这种方式不是传统的前端仓库 + 后端仓库分离，但后端边界是清楚的。后续如果项目变大，可以把 `lib/server` 和 `app/api/v1` 中的逻辑迁移到独立后端服务。

### 13.1.2 为什么不一开始拆成独立后端

不建议第一版就拆成独立后端项目，原因：

- 当前项目用户量和业务复杂度不高。
- 单独后端会增加部署、跨域、鉴权、日志和运维成本。
- Supabase 已经承担数据库、鉴权和对象存储能力。
- Next.js Route Handlers 足够支撑 MVP 和后续 iOS API 复用。

但代码组织必须按照后端边界来写，避免把数据库操作散落在 UI 组件中。

### 13.2 为什么这样选

- Next.js 适合快速完成可上线 Web Demo。
- TypeScript 提高项目可靠性，也适合简历展示。
- Tailwind CSS 适合快速做移动端响应式界面。
- shadcn/ui 提供高质量基础组件，但不会限制视觉风格。
- Supabase 同时解决数据库、鉴权、对象存储，降低 MVP 复杂度。
- Vercel 是 Next.js 官方平台，零配置部署、原生支持 App Router / SSR，与 Supabase SSR 兼容最好，MVP 阶段调试成本最低。
- Cloudflare 在全球访问、DNS 管理、R2 无出口流量费和后续 MCP/Workers 扩展上更有优势，但用 @cloudflare/next-on-pages 适配 Next.js + Supabase 有 edge runtime 兼容性成本，适合项目稳定后再迁移。
- 折中方案：MVP 用 Vercel 部署，域名/DNS 仍托管在 Cloudflare；后期若图片流量增大，可将图片存储迁到 Cloudflare R2。

### 13.3 后续 iOS 方向

有两条路线：

#### 路线 A：SwiftUI 原生 App

优点：

- iPhone 体验最好。
- 更能展示移动端原生开发能力。
- 可接入相册、通知、小组件等 Apple 生态能力。

缺点：

- 需要额外学习 SwiftUI。
- Web 和 iOS 需要维护两套前端。

#### 路线 B：React Native / Expo

优点：

- 可以复用 React 思维。
- 开发速度快。
- 适合从 Web 项目迁移。

缺点：

- 原生质感略弱于 SwiftUI。
- 调试和打包也有一定成本。

当前建议：

先完成 Next.js Web MVP，再根据时间决定是否做 SwiftUI 或 Expo 版本。

## 14. 前端视觉风格

## 14.1 整体风格关键词

- 温暖。
- 干净。
- 私密。
- 生活感。
- 轻量。
- 移动端友好。

不要做成后台管理系统，也不要做成营销官网。第一屏应该直接是可用的生活流或上传入口。

## 14.2 色彩建议

主色建议使用温和但不过度单一的配色：

- 主色：柔和绿色或番茄红，用于主要按钮和高亮信息。
- 背景：接近白色的暖灰色。
- 文本：深灰，不使用纯黑大面积铺满。
- 辅助色：浅黄、浅蓝、浅粉，用于标签和状态。

示例色值：

- Background：`#FAFAF7`
- Surface：`#FFFFFF`
- Text Primary：`#272722`
- Text Secondary：`#6F6E68`
- Primary：`#3F7D58`
- Accent：`#E86F51`
- Border：`#E7E3DA`
- Tag Yellow：`#F6D78B`
- Tag Blue：`#A9C7E8`
- Tag Pink：`#EFB4B8`

注意：

- 不要让整个页面只有一种绿色或一种米色。
- 不要使用大面积紫蓝渐变。
- 图片本身应成为页面视觉重点。

## 14.3 字体与排版

- 中文字体使用系统默认字体栈。
- 页面标题不要过大，移动端标题建议 24px 到 30px。
- 卡片标题建议 16px 到 18px。
- 正文建议 14px 到 16px。
- 辅助文字建议 12px 到 13px。
- 字间距保持默认，不使用负字间距。
- 长文本需要自动换行，不允许溢出容器。

建议字体栈：

`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

## 14.4 布局风格

### 移动端

- 优先适配 390px 宽度的 iPhone。
- 页面最大宽度可控制在 480px，居中显示。
- 底部导航固定。
- 上传按钮可放在底部导航中间。
- 图片卡片使用稳定比例，建议 4:3 或 1:1。
- 卡片圆角不超过 8px，除非图片本身需要更柔和。
- 页面留白适中，不要过度稀疏。

### 桌面端

- 内容区最大宽度 960px 到 1120px。
- 生活流可以使用两栏布局：
  - 左侧主内容。
  - 右侧统计摘要或日历。
- 访客分享页桌面端仍应保持轻量，不要像后台。

## 14.5 组件风格

### 按钮

- 主要操作使用实心按钮。
- 次要操作使用描边或文本按钮。
- 图标按钮使用 lucide-react。
- 删除等危险操作使用红色或明确危险样式。
- 按钮文字必须短，不要挤压。

### 卡片

- 用于单条记录。
- 不要把页面大区块都做成浮动卡片。
- 不要出现卡片套卡片。
- 卡片圆角建议 8px。
- 图片、标题、元信息层级要清楚。

### 标签

- 标签用于餐别、心情和自定义标签。
- 使用小号 pill 或 badge。
- 颜色轻，不抢图片视觉。

### 表单

- 表单应适合手机单手操作。
- 输入项顺序：
  1. 图片。
  2. 标题。
  3. 餐别。
  4. 金额。
  5. 日期时间。
  6. 心情。
  7. 标签。
  8. 地点。
  9. 备注。
- 必填项要清晰标识。
- 错误提示靠近对应输入项。

## 14.6 图片展示

- 生活流封面应使用真实图片，不使用抽象插画替代。
- 图片加载时显示浅色占位。
- 图片失败时显示简洁占位和提示。
- 多图记录在详情页展示为轮播或网格。
- 图片不应被过度裁切到看不出菜品。

## 14.7 文案风格

文案要自然、温和、简短。

示例：

- “今天吃了什么？”
- “上传今天的第一餐”
- “本周饮食花费”
- “分享给家人看看”
- “这条记录暂时只对自己可见”

避免：

- 太商业化的营销文案。
- 太复杂的功能说明。
- 在页面上大段解释产品功能。

## 15. 页面详细需求

## 15.1 登录页 `/login`

### 功能

- 邮箱登录。
- 邮箱验证码或密码登录，取决于 Supabase Auth 配置。
- 登录成功后跳转 `/admin`。

### UI

- 移动端居中表单。
- 标题可为“回到你的生活记录”。
- 不做营销页。

## 15.2 管理首页 `/admin`

### 功能

- 展示今日摘要。
- 展示最近记录。
- 提供新增记录入口。
- 提供统计页入口。
- 提供分享设置入口。

### 今日摘要

- 今日记录数。
- 今日饮食花费。
- 最近一条记录时间。

### UI

- 顶部显示问候语。
- 主按钮：“记录一餐”。
- 下方是生活流。

## 15.3 新建记录页 `/admin/new`

详见 10.1。

## 15.4 编辑记录页 `/admin/records/[id]/edit`

### 功能

- 复用新建记录表单。
- 自动填充已有数据。
- 保存后返回详情页。

## 15.5 生活流页 `/`

### Owner 访问

- 如果已登录，展示自己的生活流。
- 如果未登录，可跳转登录或展示项目入口。

### Viewer 访问

- 推荐通过 `/share/[token]` 访问，不通过 `/`。

## 15.6 分享页 `/share/[token]`

### 功能

- 展示分享页标题和描述。
- 展示只读生活流。
- 支持点进详情。
- 支持基础筛选。

### UI

- 顶部可以显示用户展示名。
- 不显示后台入口。
- 不出现“注册”“创建你的空间”等营销引导，MVP 阶段保持私密。

## 15.7 统计页 `/stats`

详见 10.6。

## 15.8 设置页 `/settings`

详见 10.8。

## 16. 状态设计

## 16.1 Loading

需要覆盖：

- 页面初次加载。
- 图片上传。
- 表单提交。
- 统计数据加载。
- 删除记录。

### 要求

- 图片上传时显示进度或 loading。
- 表单提交时按钮 disabled。
- 页面加载使用 skeleton，不要空白闪烁。

## 16.2 Empty

需要覆盖：

- 没有任何记录。
- 筛选结果为空。
- 统计区间无数据。
- 分享链接无可见记录。

## 16.3 Error

需要覆盖：

- 图片上传失败。
- 网络请求失败。
- 分享链接无效。
- 登录失败。
- 记录不存在。
- 无权限访问。

错误页面文案建议：

- 分享链接无效：“这个分享链接暂时不可用。”
- 无权限：“你没有访问这个页面的权限。”
- 记录不存在：“这条记录可能已经被删除。”

## 17. 响应式要求

### 17.1 必测尺寸

- iPhone SE：375px 宽。
- iPhone 14/15：390px 宽。
- iPhone Plus/Max：430px 宽。
- iPad：768px 宽。
- 桌面：1280px 宽。

### 17.2 适配要求

- 不允许横向滚动。
- 表单输入框在移动端宽度合适。
- 底部导航不遮挡页面内容。
- 图片比例稳定，加载前后不造成明显布局跳动。
- 长标题、长备注、长标签不会撑破卡片。

## 18. 隐私与安全

### 18.1 内容隐私

- 默认记录仅 Owner 可管理。
- 分享页只展示明确允许分享的记录。
- 重新生成 token 后旧链接失效。
- 关闭分享后所有分享链接不可访问。

### 18.2 访问安全

- 管理页面必须鉴权。
- API 层必须校验用户身份。
- 不能只依赖前端隐藏按钮。
- Viewer 不能通过接口删除或修改记录。

### 18.3 数据安全

- 图片存储路径应包含 userId。
- 数据库 Row Level Security 建议开启。
- Owner 只能访问自己的数据。
- share token 查询只返回允许分享的数据。

## 19. 性能要求

- 移动端首屏加载尽量控制在 2 秒左右。
- 生活流分页加载，不一次性加载全部记录。
- 图片使用 lazy loading。
- 图片建议压缩后上传。
- 统计接口避免前端拉全量数据后计算。
- 常用查询字段建立索引：
  - records.user_id
  - records.occurred_at
  - records.is_shared
  - share_links.token

## 20. 可访问性要求

- 图片上传按钮可通过键盘聚焦。
- 按钮有明确文字或 aria-label。
- 表单错误信息清楚。
- 颜色对比度足够。
- 图标按钮必须有 tooltip 或 aria-label。

## 21. 测试建议

### 21.1 手动测试

- 创建一条只有必填项的记录。
- 创建一条包含全部字段的记录。
- 上传 1 张图片。
- 上传多张图片。
- 上传超大图片。
- 上传不支持格式。
- 编辑记录金额。
- 删除记录。
- 关闭单条记录分享。
- 访问分享链接。
- 重新生成分享 token。
- 未登录访问管理页。

### 21.2 自动化测试

如果时间允许，建议添加：

- 表单校验单元测试。
- 数据格式化函数测试。
- 统计计算函数测试。
- API 权限测试。
- Playwright 端到端测试：
  - 登录。
  - 新建记录。
  - 查看生活流。
  - 访问分享页。

## 22. 项目目录建议

以 Next.js App Router 为例：

```text
app/
  (auth)/
    login/
      page.tsx
  (admin)/
    admin/
      page.tsx
      new/
        page.tsx
      records/
        [id]/
          page.tsx
          edit/
            page.tsx
    settings/
      page.tsx
    stats/
      page.tsx
  api/
    v1/
      records/
        route.ts
        [id]/
          route.ts
      share/
        [token]/
          records/
            route.ts
      stats/
        route.ts
      uploads/
        route.ts
  share/
    [token]/
      page.tsx
  records/
    [id]/
      page.tsx
  layout.tsx
  page.tsx
components/
  forms/
    field-error.tsx
    image-picker.tsx
  records/
    record-card.tsx
    record-form.tsx
    record-image-grid.tsx
    record-filters.tsx
    record-list.tsx
  stats/
    stats-summary.tsx
    daily-spending-chart.tsx
    meal-type-chart.tsx
  share/
    share-header.tsx
  layout/
    mobile-bottom-nav.tsx
    page-shell.tsx
  ui/
features/
  records/
    components/
    hooks/
    schema.ts
    types.ts
  stats/
    components/
    schema.ts
  share/
    components/
    schema.ts
lib/
  client/
    api-client.ts
    image-compress.ts
  server/
    auth/
      require-owner.ts
      get-current-user.ts
    db/
      records.ts
      tags.ts
      share-links.ts
      stats.ts
    storage/
      record-images.ts
      signed-urls.ts
    supabase/
      server.ts
      admin.ts
  shared/
    constants/
      meal-types.ts
      moods.ts
    validators/
      record.ts
      share.ts
    formatters/
      format-money.ts
      format-date.ts
  utils/
    cn.ts
types/
  database.ts
  record.ts
  api.ts
supabase/
  migrations/
    0001_initial_schema.sql
  seed.sql
docs/
  setup-supabase.md
.env.example
```

### 22.1 目录职责说明

- `app/`：页面路由和 API 路由。
- `app/api/v1/`：后端接口边界，后续 iOS App 也调用这里。
- `components/`：可复用 UI 组件，不写敏感数据库逻辑。
- `features/`：按业务模块组织页面内组件、schema 和类型。
- `lib/client/`：只允许浏览器使用的工具，例如请求封装、图片压缩。
- `lib/server/`：只允许服务端使用的业务逻辑，包括鉴权、数据库、Storage。
- `lib/server/supabase/admin.ts`：只能服务端使用，可读取 service role key。
- `lib/shared/`：前后端都可以安全复用的常量、校验和格式化函数。
- `supabase/migrations/`：数据库表结构、RLS、索引、触发器等 SQL 迁移文件。
- `docs/setup-supabase.md`：记录 Supabase 控制台配置步骤，方便自己或 Cursor 继续维护。

### 22.2 Cursor 必须遵守的项目结构规则

- UI 组件只能 import `lib/client`、`lib/shared`、`features` 中的安全代码。
- UI 组件不能 import `lib/server`。
- API Route 可以 import `lib/server`。
- `service_role` 只能在 `lib/server/supabase/admin.ts` 中读取。
- 所有 API 返回结构统一，例如 `{ data, error }`。
- 所有表单校验统一放在 `lib/shared/validators` 或对应 `features/*/schema.ts`。
- 所有数据库类型统一从 `types/database.ts` 引入。

## 23. Supabase 初始化与数据库迁移建议

### 23.1 你需要在 Supabase 上做什么

你已经创建 Supabase 账号后，后续还需要完成：

1. 创建一个 Supabase project。
2. 在 Project Settings 中复制项目 URL 和 anon key。
3. 如果需要服务端管理员能力，复制 service role key，并且只放到服务端环境变量。
4. 创建 Storage bucket：`record-images`。
5. 执行数据库建表 SQL。
6. 配置 Supabase Auth 登录方式。
7. 把环境变量写入本地 `.env.local` 和部署平台。

### 23.2 建表方式选择

Supabase 支持三种建表方式：

#### 方式 A：网页 Table Editor 手动建表

适合刚开始理解数据库结构，但不推荐作为本项目最终方式。

缺点：

- 表多了以后容易点错。
- 不方便回滚。
- 不方便让 Cursor 维护。
- 不方便写进 Git 版本管理。

#### 方式 B：Supabase SQL Editor 执行 SQL

推荐给当前阶段使用。

做法：

- 让 Cursor 根据本文档生成 `supabase/migrations/0001_initial_schema.sql`。
- 打开 Supabase 控制台的 SQL Editor。
- 粘贴 SQL。
- 点击 Run 执行。
- 执行后到 Table Editor 检查表是否创建成功。

优点：

- 快。
- 可复制。
- SQL 文件可以提交到 Git。
- 后续改表可以继续让 Cursor 生成新的 migration。

#### 方式 C：Supabase CLI migrations

适合项目更成熟后使用。

做法：

- 本地安装 Supabase CLI。
- 使用 `supabase migration new create_initial_schema` 创建迁移文件。
- 使用 `supabase db push` 推送到远程 Supabase。

优点：

- 更工程化。
- 适合多人协作。
- 适合长期维护。

当前建议：

第一版使用方式 B。也就是 Cursor 生成 SQL migration 文件，你在 Supabase SQL Editor 中执行。等项目稳定后，再切到 Supabase CLI。

### 23.3 Cursor 应创建的 migration 内容

Cursor 实现时应创建 Supabase migration，至少包含：

- profiles
- records
- record_images
- tags
- record_tags
- share_links
- RLS policies
- indexes
- updated_at 自动更新时间 trigger
- auth.users 新增用户时自动创建 profiles 行的 trigger（默认 timezone = Australia/Sydney，currency = CNY）
- 默认 tag seed 数据，选做

### 23.4 推荐环境变量

本地 `.env.local` 至少需要：

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

部署到 Cloudflare 或 Vercel 时，需要在平台控制台配置同名环境变量。

注意：

- `NEXT_PUBLIC_SUPABASE_URL` 可以暴露给浏览器。
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 可以暴露给浏览器，但仍需配合 RLS。
- `SUPABASE_SERVICE_ROLE_KEY` 绝对不能暴露给浏览器。
- Cursor 不得把 service role key 写入任何前端文件。

### 23.5 Storage bucket 建议

创建 bucket：

```text
record-images
```

推荐配置：

- bucket 类型：private。
- 单文件大小限制：8MB。
- 允许类型：jpg、jpeg、png、webp。
- 路径规则：`{userId}/{recordId}/{timestamp}-{filename}`。

图片访问策略：

- Owner 登录后可以访问自己的图片。
- Viewer 通过分享页访问时，由服务端根据 token 生成可访问 URL。
- 如果第一版为了降低复杂度使用 public bucket，需要在文档和 README 中标注这是 MVP 临时方案，后续改成 private bucket。

### 23.6 RLS 策略方向

- Owner 登录后可操作自己的 profiles。
- Owner 登录后可 CRUD 自己的 records。
- Owner 登录后可 CRUD 自己记录下的 images。
- Owner 登录后可管理自己的 tags。
- share token 查询通过服务端接口完成，不建议直接让匿名用户查表。

### 23.7 推荐数据库初始化流程

交给 Cursor 的提示词可以写：

```text
请根据需求文档创建 Supabase migration 文件：
supabase/migrations/0001_initial_schema.sql

要求：
1. 创建 profiles、records、record_images、tags、record_tags、share_links。
2. 使用 uuid 主键。
3. 给 user_id、occurred_at、is_shared、token 建索引。
4. 开启 RLS。
5. 写出 Owner 只能操作自己数据的 policies。
6. share token 查询由服务端 API 完成，不给匿名用户直接查询 records 的权限。
7. 创建 updated_at 自动更新时间 trigger。
8. 不要在客户端使用 service role key。
```

执行方式：

```text
Supabase Dashboard
  -> SQL Editor
  -> New query
  -> 粘贴 0001_initial_schema.sql 内容
  -> Run
  -> Table Editor 检查表结构
```

## 24. MVP 开发里程碑

### Milestone 1：项目初始化

- 初始化 Next.js + TypeScript。
- 配置 Tailwind CSS。
- 接入 shadcn/ui。
- 配置 Supabase client。
- 配置环境变量。
- 完成基础布局。

验收：

- 本地开发服务器可运行。
- 首页可以访问。
- 移动端布局基础可用。

### Milestone 2：数据库和鉴权

- 创建 Supabase migration SQL。
- 在 Supabase SQL Editor 执行建表 SQL。
- 创建 `record-images` Storage bucket。
- 配置 Supabase Auth。
- 实现登录页。
- 管理页面鉴权。

验收：

- 未登录不能访问管理页。
- 登录后可以进入 `/admin`。

### Milestone 3：记录创建

- 新建记录表单。
- 图片上传。
- 保存记录。
- 保存图片元数据。

验收：

- 可以创建包含图片的记录。
- 创建后生活流显示。

### Milestone 4：生活流和详情

- 生活流列表。
- 日期分组。
- 详情页。
- 编辑记录。
- 删除记录。

验收：

- 完整 CRUD 可用。

### Milestone 5：分享页

- 创建分享 token。
- 只读分享页面。
- 分享开关。
- 重新生成 token。

验收：

- 家人可以通过链接查看。
- 无权限操作不会出现。

### Milestone 6：统计页

- 本周 / 本月花费。
- 最近 7 天图表。
- 按餐别统计。
- 记录频率统计。

验收：

- 统计数据与记录数据一致。

### Milestone 7：打磨和部署

- 响应式细节。
- Loading / Empty / Error 状态。
- 图片压缩。
- 部署到 Cloudflare Pages / Workers，或使用 Vercel 作为备选。
- 编写 README。

验收：

- 手机浏览器体验流畅。
- 可把线上链接放入简历。

## 25. 简历表达建议

项目名称可以写：

私人生活记录与饮食开销分享应用

项目描述：

基于 Next.js 和 Supabase 构建的移动端优先 Web 应用，用于记录每日饮食照片、生活备注和消费金额，并通过私密只读链接分享给家人或对象查看。项目实现了图片上传、记录管理、分享权限、消费统计和响应式 UI。

技术关键词：

- Next.js
- TypeScript
- Supabase
- PostgreSQL
- Supabase Storage
- Supabase Auth
- Tailwind CSS
- shadcn/ui
- Recharts
- Cloudflare Pages / Workers
- Next.js Route Handlers

可以强调的亮点：

- 设计并实现了面向亲密关系场景的只读分享机制。
- 使用 Supabase Storage 完成多图片上传与元数据管理。
- 基于 PostgreSQL 建模生活记录、图片、标签和分享链接。
- 采用 `/api/v1` 服务端接口隔离前端展示与敏感数据库操作。
- 实现饮食消费统计、餐别分类和日期范围筛选。
- 采用移动端优先设计，优化 iPhone 浏览器下的上传和浏览体验。

## 26. 后续版本规划

### v0.2

- 评论或表情回应。
- 家人可以留下简单回复。
- 月度生活报告。
- 数据导出。
- PWA 支持，添加到 iPhone 主屏幕。

### v0.3

- 多用户家庭空间。
- 邀请家人加入。
- 每个 Viewer 单独权限。
- 记录可见范围管理。

### v0.4

- AI 图片识别菜品。
- 自动估算热量。
- 自动生成饮食总结。
- 自动提取消费类别。

### v1.0

- iOS App。
- 推送通知。
- 相册直接上传。
- 小组件展示今日记录。
- Face ID 或本机隐私保护。

## 27. Cursor 实现提示

交给 Cursor 实现时，建议按以下顺序提需求：

1. 先创建 Next.js + TypeScript + Tailwind + shadcn/ui 项目骨架。
2. 按本文档创建项目目录结构，明确 `app/api/v1`、`lib/server`、`lib/client`、`lib/shared` 的边界。
3. 创建 `supabase/migrations/0001_initial_schema.sql`，不要先写页面假数据。
4. 创建 `.env.example`，列出 Supabase 需要的环境变量。
5. 配置 Supabase client、server client 和 admin client。
6. 先做登录和管理页鉴权。
7. 再做记录创建和生活流，不要先做统计。
8. 图片上传跑通后再做编辑、删除。
9. CRUD 稳定后做分享页。
10. 最后做统计、响应式和 UI 打磨。

给 Cursor 的实现原则：

- 保持组件小而清晰。
- 所有表单字段使用 zod 校验。
- 所有数据库操作必须校验当前用户。
- 不要把 Supabase service role key 暴露到客户端。
- Viewer 页面不允许出现任何管理操作。
- 移动端体验优先于桌面端复杂布局。
- 每个页面都要有 loading、empty、error 状态。
- 所有敏感操作通过 `/api/v1` 或服务端逻辑完成。
- 不要让前端组件直接 import `lib/server`。
- 后续 iOS App 应该可以复用 `/api/v1` 接口。

### 27.1 可以直接给 Cursor 的第一条提示词

```text
请阅读 life-record-app-requirements.md，并先完成项目骨架，不要急着实现所有页面。

要求：
1. 使用 Next.js App Router + TypeScript + Tailwind CSS。
2. 采用单仓库分层式全栈架构。
3. 创建文档中第 22 节定义的目录结构。
4. 创建 app/api/v1 作为后端 API 边界。
5. 创建 lib/server、lib/client、lib/shared，并保证 UI 组件不能引用 lib/server。
6. 创建 supabase/migrations/0001_initial_schema.sql。
7. 创建 .env.example，包含 Supabase URL、anon key、service role key、APP URL。
8. 暂时不要接入真实页面 UI，先保证架构、环境变量、Supabase client 文件和 migration 文件完整。
9. service role key 只能在服务端 admin client 中读取。
```

### 27.2 可以直接给 Cursor 的第二条提示词

```text
请根据 life-record-app-requirements.md 的数据模型和 Supabase 初始化要求，完善 supabase/migrations/0001_initial_schema.sql。

要求：
1. 创建 profiles、records、record_images、tags、record_tags、share_links。
2. 开启 RLS。
3. 添加 Owner 只能访问自己数据的 RLS policies。
4. 添加 user_id、occurred_at、is_shared、token 等常用索引。
5. 添加 updated_at 自动更新时间 trigger。
6. 添加必要外键和级联删除。
7. 不允许给匿名用户直接读取 records 全表。
8. 分享页查询应通过服务端 API 校验 token 后返回数据。
```

### 27.3 可以直接给 Cursor 的第三条提示词

```text
请实现登录、管理页鉴权和基础页面框架。

要求：
1. 使用 Supabase Auth。
2. 未登录访问 /admin、/admin/new、/settings、/stats 时跳转 /login。
3. 已登录访问 /login 时跳转 /admin。
4. 实现移动端优先的 PageShell 和底部导航。
5. 页面先使用真实路由和空状态，不要使用大量假数据。
```

## 28. 当前版本结论

这个项目值得做。它有真实生活场景，也有足够的工程实现空间。MVP 不需要追求大而全，重点是把“本人上传、亲近的人只读查看、顺便记录饮食开销”这条核心流程做顺。

第一版成功标准：

- 你能每天用它记录吃了什么。
- 家人或对象能通过链接舒服地查看。
- 你能看到自己的饮食花费统计。
- 项目可以部署上线并写进简历。

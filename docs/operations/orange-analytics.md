# 橙子星球的链接与统计

## 个人链接

文章底部和 Orange 页脚提供自己的 GitHub、CSDN 入口。未设置的平台链接为 `#`，点击不会打开新窗口。文章分享入口保留“复制文章链接”，不再将一长排分享平台显示成个人联系方式。

GitHub 为 `https://github.com/cmerber`，CSDN 为 `https://blog.csdn.net/weixin_43614987`。个人配置中的模板作者链接会清空；Orange 自定义菜单中的旧作者域名变为 `#`。文章正文中的参考文献、上游项目文档和 MIT 版权保留。

## 接入自己的 Clarity

1. 登录 https://clarity.microsoft.com/ ，确认项目归属。没有项目时创建 `橙子星球`，网址填 `https://qcode.im`。
2. 在项目设置的安装代码中取得自己的项目 ID。
3. 在部署环境设置 `NEXT_PUBLIC_CLARITY_ID`，或在 Notion 配置表设置 `CLARITY_ID`。Notion 配置优先，不要保留另一个旧值。
4. 部署后确认页面只加载一次 `https://www.clarity.ms/tag/自己的ID`，并在 Clarity 查看接入状态。

2026-10-29 在站主登录的 Clarity 账号下新建“橙子星球”，自己的 ID 为 `z5a818jas2`。Notion 配置中心已启用 `CLARITY_ID=z5a818jas2`。原线上旧 ID `mitvq51ouk` 的归属不明，代码对该旧值回退为新项目，不使用旧值读取统计。

## Notion 运营展板

程序只创建“橙子星球｜运营展板”笔记和其下的“访问快照”数据库，不写入博客发布库，也不修改升级打怪。

本地 `.env.local` 中设置以下变量，均不提交 Git：

```dotenv
NOTION_TOKEN=
NOTION_ANALYTICS_PAGE_ID=
CLARITY_PROJECT_ID=
CLARITY_API_TOKEN=
```

Notion 集成只连接到运营展板这一页及其子数据库，不授权整个笔记库。`NOTION_ANALYTICS_PAGE_ID` 指向该笔记；程序不会查询其他笔记。Clarity 导出令牌由项目管理员在 Settings → Data Export 创建。令牌应填写到本地私有配置或受保护的运行环境，不发到聊天、不放进笔记、不使用 `NEXT_PUBLIC_` 前缀。只有需要由脚本新建笔记时才使用可选的 `NOTION_ANALYTICS_NOTES_DATABASE_ID`，日常同步不需要该权限。

```sh
# 创建空展板，不生成假数据，只需要 Notion 凭据
node scripts/clarity-notion.mjs --init

# 读取真实统计但不写 Notion
node scripts/clarity-notion.mjs --dry-run

# 验证后手动同步
node scripts/clarity-notion.mjs --sync
```

每次首次采集调用 Clarity 两次：未分组总览与 URL 分组。相同项目、相同 UTC 采集日期复用本地缓存；`--refresh` 会重新消耗两次请求配额。每日每项目最多 10 次请求、只能回看最近 1—3 天、最多 1000 行且无分页，这是 Clarity 的接口限制。

展板顶部显示会话、访客和机器人会话摘要，下方有热门页面和可排序的历史快照表。热力图与会话回放从 Clarity 打开，不将访客级行为记录复制到 Notion。

这里保存的是“采集时最近24小时”的滚动快照，按 UTC 采集日期去重，不等同自然日流量。缺失指标写入空值并显示“待获取”；错误响应不清空已有统计。URL 的查询参数和片段不会写入 Notion；同一路径存在多个 URL 变体时保留最大一项，不相加，避免重复计算会话。热门列表是 URL 变体快照，不能当作精确的路径去重访问数。

API 创建的是原生笔记与内联数据库。卡片/图表视图需要在 Notion 页面中配置，不能把脚本创建表格描述为已经完成了可视化面板。当前程序未设置计划任务；首次真实同步验收后再启用每天运行。

## 已核实与待验收

- `qcode.im` 首页、文章、关于、归档和个人档案页面均返回 HTTP 200；检查的这些页面未发现可见的 tangly/tanghh 链接。
- 当前 Twikoo 服务 `https://twikoo-preview-beta-five.vercel.app/` 返回 HTTP 200、code 100、版本 1.6.32；后端健康不等于评论提交已验证。
- 未提交测试评论、未更改评论存储、未读取或删除私有评论数据。
- Clarity 项目归属、部署后的链接效果、评论提交/刷新、真实同步及 Notion 面板仍需完成验收。

来源：[NotionNext 教程](https://docs.tangly1024.com/article/notion-next-clarity)、[Clarity 数据导出 API](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-data-export-api)、[Twikoo API](https://twikoo.js.org/api.html)。

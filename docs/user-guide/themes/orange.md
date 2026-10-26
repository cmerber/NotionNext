# Orange 3D · 橙子工作室 主题

> 主题 ID：`orange` · 在部署了此分支的站点打开 `/?theme=orange` 预览。

## 简介

全屏云海浮岛工作室，连接纸质手记风格的文章、归档、工具与关于页。首页可以探索物件、打开信箱、收集足迹；阅读时切换到安静的阅读室。

## 主题特性

- **定位**：全屏云海浮岛工作室，平滑运镜、环游、昼夜氛围与立体人物互动，连接原有文章、工具与成长。
- **适用场景**：见 [内置主题全览](./THEMES_CATALOG.md) 选型表
- **配置前缀**：`ORANGE_*`（共 **12** 项，见下方配置表）
- **预览**：在 Vercel 对应分支预览地址后加 `/?theme=orange`，或部署后访问 `https://qcode.im/?theme=orange`。

## 交互与维护

- 书架：文章归档；电脑：`/tools`；档案柜：`/profile`；会客厅：`/about`。点击物件后，在介绍卡中打开对应页面；下方按钮也支持键盘操作。
- 拖动场景可环绕旋转，点击“切换视角”在三个机位之间平滑移动；“环游星球”恢复缓慢环绕。点击物件或四个入口会飞向对应特写，关闭介绍卡返回全景。滚轮留给页面滚动。
- 昼夜与全站深浅色模式同步；可暂停动画。系统要求减少动态效果时自动停止持续动画。
- 初始化失败时自动尝试低开销渲染；图形上下文丢失后先等待浏览器恢复，前台约 2.5 秒未恢复则自动重建，关闭抗锯齿并降低分辨率、阴影与帧率。连续自动重建最多两次，稳定运行 30 秒后恢复重试额度，后台不反复创建画布。持续失败时提供手动重试；无 WebGL 或选择“简洁模式”时，四个普通入口仍可访问内容。
- 3D 只在首页初始化，离开首页释放图形资源；离开可视区域或浏览器切到后台时暂停渲染。
- 静态家具按材质和入口合并，云团与人物固定部件也批量绘制。阴影缓存，小屏关闭阴影，限制画布像素与帧率；持续高开销时自动切入流畅模式，也可手动选择流畅或精细模式。默认不自动环游，避免阅读首屏时持续转动。
- 点击小岛信箱或“摘一颗橙子”，信箱打开、人物回应，收到一篇现有公开文章。四个入口各获得一枚足迹；足迹仅保存在当前标签页，阅读后返回仍可继续探索。兼容场景也保留信箱与四个入口。
- 正文和关于页共享阅读室布局：封面、目录、进度、行宽选择、引用、代码、表格、标签、前后篇、分享和评论。密码保护继续沿用原有机制，锁定时不渲染正文与目录。
- 模型使用原创程序几何体，无需上传私人数据或使用外部模型服务。文章和成长记录仍由原有 Notion 数据流程提供。场景不展示私密任务与复盘。
- 仓库默认主题为 Orange；已有站点的 Notion Config `THEME` 优先于仓库默认值。设为 `orange` 启用，设为其他主题 ID 可切换默认主题。

## 人物与治愈互动

人物根据站长提供的 PNG 头像重建为程序化立体角色：棕色短发、大眼睛、黑色翻领上衣。PNG 用作外观参考；人物网格由 `createCharacter.js` 构造，能够旋转、呼吸、眨眼和挥手，不依赖图片生成或外部建模服务。

- 点击人物或“打个招呼”，人物挥手并显示欢迎语。
- 白天有云海与花瓣，夜晚点亮星空与萤光；轨道上的小星球绕行、云团浮动，植物轻摆、咖啡冒出热气。靠近书架时书本轻轻探出。
- 可单独关闭花雨／萤光，或暂停全部动画；系统减少动态效果偏好仍优先。
- 手机端导航与目录适应窄屏；外观配置位于页脚“外观与主题”，昼夜按钮在页头或场景中；场景按钮提供至少 44px 的触控高度。
- 场景保留纵向滑动页面和浏览器双指缩放；小屏幕降低渲染分辨率、阴影尺寸与动画帧率，减少持续运行的负担。
- 站长可以在 Notion Config 中设置 `ORANGE_AMBIENCE_ENABLE=false` 关闭装饰粒子。
- 原有文章、工具和成长记录数据流程不变；主题只读取现有公开内容。

## 在现有网站中切换体验

`conf/widget.config.js` 默认开放主题面板，但隐藏悬浮工具条。Orange 页脚的“外观与主题”可以打开面板；预览内容只在打开时加载。若需要恢复全站悬浮条，可设置 `THEME_SWITCH_FLOATING=true`。访问者选择主题时 URL 使用 `?theme=orange`；移除该参数即回到站点默认主题。

Notion Config 中可以设置 `THEME_SWITCH=true` 开启面板，设为 `false` 关闭。若 Vercel 已配置 `NEXT_PUBLIC_THEME_SWITCH`，该环境变量优先；若只想体验新主题，保留原来的 `THEME=heo`。只有希望所有访问者默认使用 Orange 时，才把 Notion Config 的 `THEME` 改为 `orange`。

## 适用场景

见 [主题全览](./THEMES_CATALOG.md) 选型表

## 启用方式

1. Notion Config 表：`THEME` = `orange`
2. 环境变量：`NEXT_PUBLIC_THEME=orange`
3. `blog.config.js` 的 `THEME`

## 配置说明

配置文件：[`themes/orange/config.js`](https://github.com/cmerber/NotionNext/blob/main/themes/orange/config.js)
也可在 **Notion Config** 表中填写同名键（对象/数组用 JSON）。

<!-- theme-config-table -->

### 主要配置项

| 配置键                      | 说明                              |
| --------------------------- | --------------------------------- |
| `ORANGE_TITLE`              | 见 config.js                      |
| `ORANGE_DESCRIPTION`        | 见 config.js                      |
| `ORANGE_SCENE_ENABLE`       | 是否显示 3D 工作室，默认 true     |
| `ORANGE_AMBIENCE_ENABLE`    | 是否显示花瓣与夜间萤光，默认 true |
| `ORANGE_COLOR_BG`           | 见 config.js                      |
| `ORANGE_COLOR_SURFACE`      | 见 config.js                      |
| `ORANGE_COLOR_TEXT`         | 见 config.js                      |
| `ORANGE_COLOR_ACCENT`       | 见 config.js                      |
| `ORANGE_COLOR_BG_DARK`      | 见 config.js                      |
| `ORANGE_COLOR_SURFACE_DARK` | 见 config.js                      |
| `ORANGE_COLOR_TEXT_DARK`    | 见 config.js                      |
| `ORANGE_COLOR_ACCENT_DARK`  | 见 config.js                      |

<!-- /theme-config-table -->

## 相关

- [内置主题全览](./THEMES_CATALOG.md)
- [如何配置站点](../config-site.md)
- [菜单 Menu / SubMenu](../menu-secondary.md)

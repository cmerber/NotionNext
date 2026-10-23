# Orange 3D · 橙子工作室 主题

> 主题 ID：`orange` · 在部署了此分支的站点打开 `/?theme=orange` 预览。

## 简介

可旋转的微缩工作室，点击书架、电脑与档案柜，探索文章、工具与成长。

## 主题特性

- **定位**：可旋转的微缩工作室，点击书架、电脑与档案柜，探索文章、工具与成长。
- **适用场景**：见 [内置主题全览](./THEMES_CATALOG.md) 选型表
- **配置前缀**：`ORANGE_*`（共 **11** 项，见下方配置表）
- **预览**：在 Vercel 对应分支预览地址后加 `/?theme=orange`，或部署后访问 `https://qcode.im/?theme=orange`。

## 交互与维护

- 书架：文章归档；电脑：`/tools`；档案柜：`/profile`；会客厅：`/about`。点击物件后，在介绍卡中打开对应页面；下方按钮也支持键盘操作。
- 拖动场景旋转，点击“切换视角”在三个机位之间切换；滚轮留给页面滚动。
- 昼夜与全站深浅色模式同步；可暂停动画。系统要求减少动态效果时自动停止持续动画。
- 无 WebGL、图形上下文丢失或用户选择“简洁模式”时，仍可通过普通入口访问内容。
- 3D 只在首页初始化，离开首页释放图形资源；离开可视区域或浏览器切到后台时暂停渲染。
- 模型使用原创程序几何体，无需上传私人数据或使用外部模型服务。文章和成长记录仍由原有 Notion 数据流程提供。场景不展示私密任务与复盘。
- 这是独立主题，不更改当前默认主题。Notion Config 的 THEME 优先于环境变量；试用请先用 URL 参数。

## 适用场景

见 [主题全览](./THEMES_CATALOG.md) 选型表

## 启用方式

1. Notion Config 表：`THEME` = `orange`
2. 环境变量：`NEXT_PUBLIC_THEME=orange`
3. `blog.config.js` 的 `THEME`

## 配置说明

配置文件：[`themes/orange/config.js`](https://github.com/cmerber/NotionNext/blob/codex/orange-3d-theme/themes/orange/config.js)
也可在 **Notion Config** 表中填写同名键（对象/数组用 JSON）。

<!-- theme-config-table -->

### 主要配置项

| 配置键 | 说明 |
| --- | --- |
| `ORANGE_TITLE` | 见 config.js |
| `ORANGE_DESCRIPTION` | 见 config.js |
| `ORANGE_SCENE_ENABLE` | 见 config.js |
| `ORANGE_COLOR_BG` | 见 config.js |
| `ORANGE_COLOR_SURFACE` | 见 config.js |
| `ORANGE_COLOR_TEXT` | 见 config.js |
| `ORANGE_COLOR_ACCENT` | 见 config.js |
| `ORANGE_COLOR_BG_DARK` | 见 config.js |
| `ORANGE_COLOR_SURFACE_DARK` | 见 config.js |
| `ORANGE_COLOR_TEXT_DARK` | 见 config.js |
| `ORANGE_COLOR_ACCENT_DARK` | 见 config.js |

<!-- /theme-config-table -->

## 相关

- [内置主题全览](./THEMES_CATALOG.md)
- [如何配置站点](../config-site.md)
- [菜单 Menu / SubMenu](../menu-secondary.md)

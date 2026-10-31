# 连载发布

《叩玄》正文仍由既有 Notion 页面维护：
https://qcode.im/article/kouxuan

每日新增章先写入 Notion，核对全文和原生目录并确认保存，再更新
`lib/db/notion/serialPublications.json` 中对应页面的最新章号、章名、日期和递增 revision。
revision 使用北京时间日期与四位章号组合，例如 202610310002。

该登记参与该文章的正文缓存版本，避免复用上一章的持久化正文块。
它不改变其他页面的缓存，不替代 Notion 内容，不代表网站已经上线。
正常 Git 提交由既有 Vercel Git 集成构建并发布，无需每天修改无关代码来触发构建。

推送前检查分支、远端更新及未提交修改，只提交本次连载登记。
发布后实际核验网站新章全文、目录链接、摘要及封面，成功后才登记发布结果。
失败时保留同一份稿件并重试同步，不重复追加或跳章。

验证：`node --test scripts/tests/serial-publication.test.mjs`。

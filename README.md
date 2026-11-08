# 羽动未来俱乐部 · 官网

广州羽毛球球友社群「羽动未来俱乐部」的静态官网。纯 HTML + CSS + JS，**没有构建步骤、没有外部依赖**，双击即可预览，丢到任何静态托管上即可上线。

> 2026-11-08 改版：官网名从「广东财经大学校友会羽毛球俱乐部」改回 **羽动未来俱乐部**，站内不再挂学校名；同时把每个板块拆成独立页面，活动页和比赛页首屏先给「时间 / 地址 / 联系人 / 入场码」。

## 一、目录结构

```
羽动未来官网/
├── index.html            首页（横幅板块目录 + 校友活动 / 校内活动两个大方块 + 场馆照片 + 快捷入口）
├── alumni.html           校友活动（板块页，暂空）
├── activity.html         校内活动（板块页：首屏信息条 + 4 个入口）
├── matches.html          比赛（板块页：首屏信息条 + 3 个比赛帖子）
├── league.html           高校联盟（板块页，暂空）
├── club.html             俱乐部（介绍组织 + 创立原因 + 组织成员）
├── join.html             加入我们（群二维码 + 微信号 + 小程序码位）
├── activity-mon.html     周一新手场
├── activity-wed.html     周三训练场
├── activity-fri.html     周五固定搭档 PK
├── activity-other.html   其他天活动（本周入场码 + 地址 + 体育馆照片）
├── members.html          成员名单
├── history.html          俱乐部历史
├── recommend.html        俱乐部推荐（用球 + 穿线）
├── miniprogram.html      微信小程序
├── gdufe.html            学校官网入口（外部链接合集，页内已注明与俱乐部无隶属关系）
├── 404.html              404 页面
├── sitemap.xml           站点地图
├── robots.txt            爬虫规则
├── _headers              Cloudflare Pages / Netlify 响应头
├── .nojekyll             GitHub Pages 用
├── assets/
│   ├── css/style.css     全部样式（设计变量在文件顶部）
│   ├── js/main.js        导航、动效、复制
│   └── img/              logo、场馆照片、校园地图、入场码截图
├── 资源/                 可下载文件
├── 本地预览.bat          一键本地预览（127.0.0.1:8766）
├── 设置域名.bat / .ps1   换域名
├── 部署指南.md           上线步骤、备案、SEO
└── README.md
```

## 二、怎么预览

- 直接双击 `index.html`（部分链接在 `file://` 下受限）
- 或双击 `本地预览.bat`，打开 <http://127.0.0.1:8766/>
- 或命令行：`python -m http.server 8766`

## 三、需要你补充的内容

| 关键词 | 位置 | 说明 |
| --- | --- | --- |
| `小程序码待上线` | `join.html`、`miniprogram.html` | 换成正式小程序码 |
| `具体日期见群通知` | `matches.html` | 换成每届比赛的真实日期 |
| 入场二维码 | `activity-other.html`（`entry-qr-*.jpg`） | 每周替换成本周的两张入场码截图 |
| `内容整理中` / `这一块还空着` | `alumni.html`、`league.html` | 有内容后替换 `empty-panel` |

### 1. 板块与页面

8 个板块各自一页：首页 / 校友活动 / 校内活动 / 比赛 / 高校联盟 / 俱乐部 / 学校官网 / 加入我们。
导航和页脚在每一页都是同一份，新增板块要同时改：本页 `header`、`footer`、`sitemap.xml`、`probe/check_site.py` 的页面列表。

### 2. 首屏信息条（时间 / 地址 / 联系人 / 入场码）

`activity.html`、`matches.html` 和 4 个活动详情页首屏都有一条 `.info-strip`，四格分别是举办时间、地址、联系人（可复制号码）、入场码。
改内容直接改对应的 `.is-item`；`activity-other.html` 的入场码格链接到同页 `#entry` 的两张二维码。

### 3. 入场码

只在 `activity-other.html` 放图片。换码：把新截图裁成只剩预约卡（去掉状态栏和底部工具栏），
存成 `assets/img/entry-qr-court2.jpg` / `entry-qr-court4.jpg`，再改 `figcaption` 里的日期和场地。

### 4. 换主题色

`assets/css/style.css` 顶部 `:root` 改 `--green-*` 与 `--lime`，全站生效。

## 四、上线方式

### 方式 A：GitHub Pages（当前用的）

仓库 <https://github.com/xd188766-arch/yudongweilai>，Pages 从 `main` 根目录发布，线上地址
<https://xd188766-arch.github.io/yudongweilai/>。本机用 `tools/deploy_push.py` 走 API 推送（见 `官网-状态速览.md`）。

### 方式 B：学校或社团服务器

把整个文件夹上传到网站根目录即可，纯静态，无需特殊配置。

## 五、设计说明

- **风格**：清爽运动风，绿白主色，大字号 + 卡片
- **字体**：系统字体栈，不依赖外网字体
- **响应式**：1200 / 980 / 720 / 420 四档断点，手机端折叠导航
- **无障碍**：键盘可操作、`aria-expanded`、支持 `prefers-reduced-motion`
- **无需联网**：图形都是内联 SVG 或 CSS
- **图片**：大图都生成了 WebP（`assets/img/*.webp`），HTML 用 `<picture>` 优先加载 WebP、旧浏览器回退 JPG/PNG；二维码图片 `loading="eager"` + `fetchpriority="high"`，`activity-other.html` / `join.html` 还在 `<head>` 里 preload，进页面就能看到码，不用等滚动

## 六、免责说明

羽动未来俱乐部是球友自发组织的羽毛球社群，**不是学校官方社团、校友会或代表队**，与任何学校没有隶属关系。
站内提到的场馆、学校链接仅作地点与外部资源说明。

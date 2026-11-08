# 广东财经大学校友会羽毛球俱乐部 · 官网

广东财经大学校友会羽毛球俱乐部的静态官网。纯 HTML + CSS + JS，**没有构建步骤、没有外部依赖**，双击即可预览，丢到任何静态托管上即可上线。

## 一、目录结构

```
羽动未来官网/
├── index.html            首页（横幅板块目录 + 校友会活动 / 校内活动两个大方块 + 场馆照片 + 比赛 + 俱乐部 + 加入我们）
├── activity.html         校内活动详情（三场活动 + 本周入场码 + 地址地图 + 体育馆照片）
├── members.html          组织成员名单（架构图 + 职位卡片 + 名单总表）
├── history.html          俱乐部历史（时间线 + 三阶段 + 照片墙）
├── recommend.html        俱乐部推荐（卖球 + 穿线价目）
├── gdufe.html            广东财经大学官网入口（官方链接合集）
├── miniprogram.html      微信小程序（小程序码位置 + 使用指引）
├── 404.html              404 页面
├── sitemap.xml           站点地图（给搜索引擎看）
├── robots.txt            爬虫规则
├── _headers              Cloudflare Pages / Netlify 的响应头配置
├── .nojekyll             GitHub Pages 用，防止忽略下划线文件
├── assets/
│   ├── css/style.css     全部样式（设计变量集中在文件顶部）
│   ├── js/main.js        导航、动效、板块目录联动、复制
│   └── img/              favicon、二维码、场馆照片、校园地图
├── 资源/                 可下载文件（CSV / Markdown）
├── 本地预览.bat          一键本地预览（127.0.0.1:8766）
├── 设置域名.bat          一键把 your-domain.com 换成你的域名
├── 设置域名.ps1          上面那个 bat 实际调用的脚本
├── 部署指南.md           ★ 上线步骤、备案、SEO 收录
└── README.md
```

> 上线看 **部署指南.md**，本文只讲内容维护。

## 二、怎么预览

- 直接双击 `index.html`（大多数功能正常，下载与部分链接在 `file://` 下受限）
- 或双击 `本地预览.bat`，浏览器打开 <http://127.0.0.1:8766/>
- 或命令行：`python -m http.server 8766` 后访问同一地址

## 三、需要你补充的内容

| 关键词 | 位置 | 说明 |
| --- | --- | --- |
| `小程序码待上线` | `index.html`、`activity.html`、`miniprogram.html` | 换成正式小程序码 |
| `内容整理中` / `这一块还空着` | `index.html`（校友会活动、高校联盟） | 有内容后替换整块 `empty-panel` |
| 邓同学 | `index.html`、`members.html` | 补职务与分工 |
| 入场二维码 | `activity.html`（`entry-qr-*.jpg`） | 每周替换成本周的两张入场码截图 |

### 1. 板块目录

首页最上面是一条横幅目录（8 个板块）：首页 / 校友会活动 / 校内活动 / 比赛 / 高校联盟 / 俱乐部 / 广财官网 / 加入我们。
点目录里的名字会跳到首页对应区块，`assets/js/main.js` 第 9 段负责高亮当前区块。增删板块要同时改三处：
`index.html` 的 `.section-bar`、`.nav`，以及 `main.js` 里的 `menuFor` 映射。

### 2. 两个大方块

目录下面两个大方块固定是「校友会活动」（上）和「校内活动」（下），代码是 `.entry-stack > .entry-tile`。

### 3. 校内活动与入场码

`activity.html` 一处放三场活动、本周入场码、地址地图和体育馆照片。
换入场码：把新截图裁成只剩预约卡（去掉状态栏和底部工具栏），存成
`assets/img/entry-qr-court2.jpg` / `entry-qr-court4.jpg`，再改 `figcaption` 里的日期和场地。

### 4. 小程序码

1. 微信公众平台 → 设置 → 基本设置 → 小程序码，下载 PNG；
2. 改名为 `miniapp-qr.png`，放进 `assets/img/`；
3. 把 `index.html` / `activity.html` 的 `.qr-frame--sm` 占位换成 `<img>`，并在 `miniprogram.html` 同步。

### 5. 换主题色

`assets/css/style.css` 顶部的 `:root` 里改 `--green-*` 与 `--lime` 即可，全站生效。

## 四、上线方式

### 方式 A：GitHub Pages（免费、最快）

```bash
cd 羽动未来官网
git init && git add . && git commit -m "init: 羽动未来官网"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

仓库 Settings → Pages → Source 选 `main` / `root`，几分钟后得到 `https://<用户名>.github.io/<仓库名>/`。
注意：仓库必须是 public，否则 Pages 不可用（学生社团一般没问题）。

### 方式 B：学校或社团服务器

把整个文件夹上传到网站根目录即可，无需 Apache/Nginx 特殊配置（纯静态）。

### 方式 C：微信内打开

微信浏览器可以直接打开 https 页面。若要在群里发链接，建议先部署到 https 域名，
再把 `miniprogram.html` 的二维码换成正式小程序码。

## 五、已验证的外部链接

以下链接都已核对为学校官方域名（`gdufe.edu.cn`）：

- 学校主页 <https://www.gdufe.edu.cn/>
- 新闻网 <https://news.gdufe.edu.cn/>
- 图书馆 <https://lib.gdufe.edu.cn/>
- 教务处 <http://jwc.gdufe.edu.cn/>
- 体育学院 <https://tyb.gdufe.edu.cn/>
- 融合门户 <http://imy.gdufe.edu.cn/>
- 教学资源中心 <https://resource.gdufe.edu.cn/>
- 佛山校区 <https://ss.gdufe.edu.cn/main.htm>
- VPN 说明 <https://xxb.gdufe.edu.cn/VPNfw/list.htm>

学校若调整网址，以官网首页导航为准。

## 六、设计说明

- **风格**：清爽运动风，绿白主色，大字号标题 + 卡片式布局
- **字体**：系统字体栈（Inter / 苹方 / 微软雅黑），不依赖外网字体，离线也一致
- **响应式**：1200 / 980 / 720 / 420 四档断点，手机端自动折叠导航
- **无障碍**：键盘可操作、`aria-expanded` 状态、对比度满足正文阅读、支持 `prefers-reduced-motion`
- **动态**：首页板块目录随滚动高亮当前区块；每页共用一份 `main.js`
- **无需联网**：所有图形都是内联 SVG 或 CSS 绘制

## 七、免责说明

本站由俱乐部学生成员自行维护，**不是广东财经大学官方站点**。涉及学校政策、场馆规则的内容，一律以学校官方发布为准。

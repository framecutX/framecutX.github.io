# 映剪官网

这是映剪（FrameCut）的官方静态网站，发布地址为 <https://framecutx.github.io/>。

网站使用原生 HTML、CSS 和 JavaScript，不需要 Node.js 或构建工具。首页通过 GitHub Releases API 读取 [`framecutX/FrameCut`](https://github.com/framecutX/FrameCut/releases) 的最新正式版本和 Windows 安装包；网络或 API 不可用时会回退到 Releases 页面。

## 页面预览

![映剪官网桌面版](screenshots/home-desktop.png)

手机版预览见 [`screenshots/home-mobile.png`](screenshots/home-mobile.png)。

## 本地预览

在仓库根目录运行：

```powershell
python -m http.server 8080
```

然后访问 <http://localhost:8080/>。

## 文件结构

```text
index.html       首页内容与结构
styles.css       响应式样式和动画
app.js           最新版本、下载链接和移动导航
assets/logo.svg  映剪品牌图标
screenshots/     桌面版与手机版预览图
robots.txt       搜索引擎抓取规则
sitemap.xml      官网站点地图
```

## 发布

推送到 `main` 后由 GitHub Pages 发布。仓库名是用户站点格式 `framecutX.github.io`，Pages 源应设置为 `main` 分支根目录。

应用新版本在 `framecutX/FrameCut` 创建正式 GitHub Release 后，首页会自动显示新的版本号、文件大小、发布时间和安装包下载地址。若 GitHub API 暂未返回新版本，用户仍可通过“查看全部版本”进入 Releases 页面。

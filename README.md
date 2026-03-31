
Prompt Hub
一个基于 React + Vite + Tailwind CSS + lucide-react 构建的 Prompt 素材库网站，支持中英文提示词切换、分类浏览、搜索和一键复制。

在线地址：

https://prompt-hub-liard-delta.vercel.app

本地运行
安装依赖：

npm install
启动开发环境：

npm run dev
生产构建：

npm run build
项目结构
src/App.jsx：主页面和提示词数据
src/index.css：全局样式
vercel.json：Vercel 单页应用路由重写配置
.github/workflows/deploy-pages.yml：GitHub Pages 自动部署工作流
自动更新
这个项目已经连接到 GitHub 和 Vercel。

以后你每次修改代码并推送到 GitHub：

git add .
git commit -m "update"
git push
Vercel 都会自动重新部署，通常 1 到 2 分钟内生效。

部署方式
Vercel
当前线上站点使用 Vercel 部署。

项目根目录里的 vercel.json 已处理 React 单页应用刷新路由时的 404 问题。

GitHub Pages
仓库里也保留了 GitHub Pages 的自动部署工作流作为备用方案：

.github/workflows/deploy-pages.yml
vite.config.js 中的 BASE_PATH 逻辑
如果以后改用 GitHub Pages，只需要在仓库 Settings -> Pages 中把 Source 设置为 GitHub Actions。

# Prompt Hub 部署与自动更新指南

## 核心结论

可以自动更新。

只要把 GitHub 仓库接到支持自动构建的平台上，例如：

1. Vercel
2. GitHub Pages + GitHub Actions

以后你每次在 GitHub 上直接提交代码，或者在本地修改后再 `git push`，线上网站都会自动重新构建并更新，通常 1 到 2 分钟内完成。

## 第一步：本地创建 React 项目

如果你是从零开始，可以执行：

```bash
npm create vite@latest prompt-hub -- --template react
cd prompt-hub
npm install
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

然后修改 `tailwind.config.js`：

```js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
```

再修改 `src/index.css` 顶部：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

如果你直接使用当前目录下的 [`prompt-hub`](./) 项目，这些基础配置已经完成。

## 第二步：替换业务代码

把你的 Prompt Hub 页面代码覆盖到 [`src/App.jsx`](./src/App.jsx)。

本地预览：

```bash
npm install
npm run dev
```

本地构建：

```bash
npm run build
```

## 第三步：推送到 GitHub

在项目根目录执行：

```bash
git init
git add .
git commit -m "首次提交：Prompt Hub 初始化"
git branch -M main
git remote add origin https://github.com/<你的用户名>/prompt-hub.git
git push -u origin main
```

后续新增配置文件后也一样继续提交：

```bash
git add .
git commit -m "chore: update deployment config"
git push
```

## 方案 A：使用 Vercel

项目根目录已经包含 [`vercel.json`](./vercel.json)：

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

这个文件是 React 单页应用的刷新兜底配置。没有它时，用户直接刷新二级路由，Vercel 很容易返回 `404`。

部署步骤：

1. 先把整个项目推到 GitHub，确保 `vercel.json` 也在仓库里。
2. 访问 `https://vercel.com/`，使用 GitHub 登录。
3. 点击 `Add New... -> Project`。
4. 导入你的 `prompt-hub` 仓库。
5. 保持默认设置，直接点击 `Deploy`。

自动更新机制：

1. Vercel 会监听这个 GitHub 仓库。
2. 以后你每次提交代码，Vercel 都会自动重新部署。

## 方案 B：使用 GitHub Pages

### 关键点：Vite 必须配置 `base`

如果你把 Vite 项目发布到 GitHub Pages，但没有配置 `base`，页面通常会因为资源路径错误而白屏。

你给出的硬编码方式是：

```js
export default defineConfig({
  plugins: [react()],
  base: "/prompt-hub/",
})
```

当前项目已经做了更稳妥的处理，在 [`vite.config.js`](./vite.config.js) 里使用环境变量动态注入：

```js
base: env.BASE_PATH || "/"
```

配合 GitHub Actions，构建时会自动注入：

```text
/prompt-hub/
```

这样有两个好处：

1. GitHub Pages 仍然能拿到正确的仓库路径。
2. 本地开发和 Vercel 部署仍然保持 `/`，不需要来回改配置。

### GitHub Pages 部署步骤

当前项目已经包含工作流文件 [`deploy-pages.yml`](./.github/workflows/deploy-pages.yml)。

你只需要：

1. 打开 GitHub 仓库页面。
2. 进入 `Settings -> Pages`。
3. 在 `Build and deployment` 下把 `Source` 设置为 `GitHub Actions`。

之后每次推送到 `main`，Actions 会自动：

1. 安装依赖
2. 执行 `npm run build`
3. 发布 `dist` 到 GitHub Pages

访问地址通常是：

```text
https://<你的用户名>.github.io/<你的仓库名>/
```

## 当前项目已经完成的配置

当前 [`prompt-hub`](./) 项目里已经具备：

1. `Vite + React` 项目骨架
2. `Tailwind CSS` 配置
3. `lucide-react` 依赖
4. [`vercel.json`](./vercel.json)
5. [`deploy-pages.yml`](./.github/workflows/deploy-pages.yml)
6. 可同时兼容 Vercel 和 GitHub Pages 的 [`vite.config.js`](./vite.config.js)

## 现在还差什么

只差两步：

1. 把真实的 Prompt Hub 页面代码放进 [`src/App.jsx`](./src/App.jsx)
2. 把整个项目推到你自己的 GitHub 仓库

完成后，这个仓库就已经满足“修改 GitHub 代码后自动更新线上网站”的要求。

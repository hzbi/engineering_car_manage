<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;">RuoYi v3.8.3</h1>
<h4 align="center">基于SpringBoot+Vue3前后端分离的Java快速开发框架</h4>
<p align="center">
	<a href="https://gitee.com/y_project/RuoYi-Vue/stargazers" target="_blank"><img src="https://gitee.com/y_project/RuoYi-Vue/badge/star.svg?theme=dark"/></a>
	<a href="https://gitee.com/y_project/RuoYi-Vue" target="_blank"><img src="https://img.shields.io/badge/RuoYi-v3.8.3-brightgreen.svg"/></a>
	<a href="https://gitee.com/y_project/RuoYi-Vue/blob/master/LICENSE" target="_blank"><img src="https://img.shields.io/github/license/mashape/apistatus.svg"/></a>
</p>

## 平台简介

-   本仓库为前端技术栈 <a href="https://v3.cn.vuejs.org" target="_blank">Vue3</a> + <a href="https://element-plus.org/zh-CN" target="_blank">Element Plus</a> + <a href="https://cn.vitejs.dev" target="_blank">Vite</a> 版本。
-   配套后端代码仓库地址[RuoYi-Vue](https://gitee.com/lyforvue/ruoyi_vue3_ts) 中的 ruoyi 目录。
-   前端技术栈【<a href="https://cn.vuejs.org" target="_blank">Vue2</a> + <a href="https://element.eleme.cn/#/zh-CN" target="_blank">ElementUI</a> + <a href="https://cli.vuejs.org/zh" target="_blank">Vue CLI</a>】，请移步：<a href="https://gitee.com/y_project/RuoYi-Vue/tree/master/ruoyi-ui" target="_blank">RuoYi-Vue</a>。

## 前端运行

```bash
# 克隆项目
git clone https://e.coding.net/g-upxb5725/car/CAR_PC.git

# 进入项目目录
cd CAR_PC

# 安装依赖
npm install

# 不建议使用cnpm安装依赖，可能会出现莫名其妙的问题，npm依赖安装比较慢使用如下方式
npm install --registry=https://registry.npmmirror.com

# 启动服务
npm run dev

# 需要修改端口请自行改动vite.config.ts中server中的port的值
```

浏览器访问 <a href="http://localhost:1024" target="_blank">http://localhost:1024</a>

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

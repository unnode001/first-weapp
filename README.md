# 点餐应用客户端

基于 uni-app 开发的微信小程序点餐应用

## 项目简介

这是一个功能完整的点餐小程序，包含首页、菜单、订单和个人中心等模块。

## 技术栈

- **框架**: uni-app
- **UI组件**: uView UI
- **开发工具**: HBuilderX
- **平台**: 微信小程序

## 项目结构

```
点餐应用客户端/
├── pages/              # 主要页面
│   ├── index/         # 首页
│   ├── menu/          # 菜单页
│   ├── order/         # 订单页
│   └── my/            # 个人中心
├── subPack/           # 分包页面
│   ├── index/         # 结算、支付成功页
│   └── order/         # 订单详情页
├── static/            # 静态资源
├── common/            # 公共资源
├── node_modules/      # 依赖包
└── uniCloud-aliyun/   # uniCloud 云开发

```

## 功能模块

- 首页展示
- 菜单浏览与点餐
- 订单管理
- 个人中心
- 支付结算

## 开发说明

### 环境要求

- HBuilderX
- 微信开发者工具
- Node.js

### 安装依赖

```bash
npm install
```

### 运行项目

1. 使用 HBuilderX 打开项目
2. 点击运行到微信开发者工具
3. 在微信开发者工具中预览

## 许可证

MIT License

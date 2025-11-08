# 七云菜馆智能点餐小程序 - 项目索引

## 项目概览

这是一个基于 **Vue2 + UniApp + UniCloud** 开发的微信扫码点餐小程序，提供完整的餐厅点餐、订单管理和用户中心功能。

**项目名称**: 七云菜馆智能点餐
**应用版本**: v1.0.0
**应用ID**: __UNI__28998C3
**开发状态**: ✅ 基础架构已完成，核心功能已实现

---

## 核心技术栈

### 前端框架
- **Vue 2**: 核心 MVVM 框架
- **UniApp**: 跨平台应用开发框架
- **uView UI**: UI 组件库

### 后端服务
- **UniCloud (阿里云)**: Serverless 云开发平台
- **JQL**: 数据库查询语言

### 开发工具
- **HBuilderX**: 官方推荐 IDE
- **微信开发者工具**: 小程序预览调试

### 平台支持
- ✅ 微信小程序（主要平台）
- 🔧 H5（支持，Hash 路由）
- 🔧 App（Android/iOS 基础配置完成）

---

## 项目架构

```
first-weapp/
├── .claude/                    # Claude Code 配置
│   └── PROJECT_INDEX.md       # 项目索引文件（本文件）
├── pages/                      # 主包页面（Tab 页面）
│   ├── index/                 # 首页（自定义导航、扫码弹窗）
│   ├── menu/                  # 点餐页（菜单浏览）
│   ├── order/                 # 订单页（订单列表）
│   └── my/                    # 我的页面（自定义导航）
├── subPack/                    # 分包页面（按需加载）
│   ├── index/
│   │   ├── indexSettlement.vue    # 确认订单页
│   │   └── indexPaysuccess.vue    # 支付成功页
│   └── order/
│       └── orderDetail.vue        # 订单详情页
├── static/                     # 静态资源
│   ├── tabbar/                # Tab 栏图标
│   ├── index/                 # 首页资源
│   ├── menu/                  # 菜单资源
│   │   ├── menutab/          # 菜品分类图标
│   │   └── menulist/         # 菜品图片
│   └── my/                    # 个人中心资源
├── common/                     # 公共资源
│   └── menu.js                # 菜单数据配置（4大分类，13道菜品）
├── uniCloud-aliyun/           # UniCloud 云开发
│   ├── cloudfunctions/        # 云函数/云对象
│   │   └── zhuohao/          # 桌号管理云对象
│   │       ├── index.obj.js  # 云对象主文件
│   │       └── package.json  # 依赖配置
│   └── database/              # 数据库配置
│       ├── zhuohao.schema.json    # 桌号表结构
│       └── JQL查询.jql        # 数据库查询文件
├── docs/                       # 项目文档
│   └── TABLE_MANAGEMENT.md    # 桌号管理功能文档
├── App.vue                     # 应用入口组件
├── main.js                     # 应用入口 JS
├── pages.json                  # 页面路由配置
├── manifest.json               # 应用配置清单
├── uni.scss                    # 全局 SCSS 变量
└── README.md                   # 项目说明文档
```

---

## 功能模块详情

### 1. 首页模块 (`pages/index/`)
- **路由**: `pages/index/index`
- **特点**: 自定义导航栏，扫码弹窗
- **功能**:
  - 展示餐厅信息
  - 快速点餐入口
  - 推荐菜品展示
  - **扫码点餐**：扫描桌号小程序码后自动弹窗
    - 显示桌号信息
    - 选择就餐人数（1-8人）
    - 自动跳转到菜单页面

### 2. 点餐模块 (`pages/menu/`)
- **路由**: `pages/menu/menu`
- **标题**: "私房菜"
- **功能**:
  - 菜品分类展示（4大分类）
  - 菜品列表浏览
  - 购物车管理
  - 实时计价

**菜品分类体系**:
```javascript
1. 川味麻辣风（3道菜）
   - 干煸芸豆 ¥16
   - 麻婆豆腐 ¥12
   - 鱼香肉丝 ¥20

2. 家常小炒（3道菜）
   - 糖醋里脊 ¥28
   - 京酱肉丝 ¥26
   - 回锅肉 ¥27

3. 时蔬素菜（3道菜）
   - 酸辣土豆丝 ¥11
   - 西红柿炒鸡蛋 ¥14
   - 红烧茄子 ¥19

4. 汤品主食（4道菜）
   - 米饭 ¥2.5
   - 馒头 ¥1.2
   - 酸辣汤 ¥12
   - 疙瘩汤 ¥16
```

### 3. 订单模块 (`pages/order/`)
- **路由**: `pages/order/order`
- **功能**:
  - 订单列表查看
  - 订单状态跟踪
  - 订单详情跳转

### 4. 个人中心模块 (`pages/my/`)
- **路由**: `pages/my/my`
- **特点**: 自定义导航栏
- **功能**:
  - 用户信息展示
  - 个人设置
  - 历史订单

### 5. 结算流程（分包）
- **确认订单**: `subPack/index/indexSettlement`
  - 订单确认
  - 地址选择
  - 支付方式选择

- **支付成功**: `subPack/index/indexPaysuccess`
  - 支付结果展示
  - 订单跟踪入口

### 6. 订单详情（分包）
- **订单详情**: `subPack/order/orderDetail`
  - 订单完整信息
  - 菜品明细
  - 配送信息

### 7. 桌号管理模块 ⭐ 新功能
- **云对象**: `uniCloud-aliyun/cloudfunctions/zhuohao/index.obj.js`
- **数据库**: `uniCloud-aliyun/database/zhuohao.schema.json`
- **核心功能**:
  - **生成小程序码** (`generateTableQRCode`)
    - 为每个桌号生成专属小程序码
    - 使用微信 API `getUnlimitedQRCode`
    - 自动上传到云存储
    - 保存到数据库
  - **桌号管理** (`getTableList`, `getTableInfo`)
    - 获取所有桌号列表
    - 查询单个桌号详情
  - **状态管理** (`updateTableStatus`)
    - 空闲（0）/ 使用中（1）/ 已预订（2）
    - 扫码后自动更新为使用中
  - **删除桌号** (`deleteTable`)
    - 删除数据库记录
    - 同步删除云存储中的小程序码

**数据模型**:
```javascript
{
  table_number: "A01",           // 桌号
  qrcode_url: "cloud://xxx",     // 小程序码地址
  status: 1,                     // 状态：0-空闲，1-使用中，2-已预订
  seat_count: 4,                 // 座位数
  create_date: 1699999999999     // 创建时间
}
```

**使用流程**:
1. 管理员调用云对象生成桌号小程序码
2. 顾客扫码自动进入首页
3. 弹窗显示桌号和人数选择
4. 确认后跳转到菜单页面开始点餐

📖 详细文档：[桌号管理功能文档](../docs/TABLE_MANAGEMENT.md)

---

## Tab Bar 配置

```javascript
{
  color: "#CDCDCD",           // 未选中颜色
  selectedColor: "#EE2F37",   // 选中颜色（品牌红）
  list: [
    { text: "首页", icon: "index.png" },
    { text: "点餐", icon: "meal.png" },
    { text: "订单", icon: "order.png" },
    { text: "我的", icon: "my.png" }
  ]
}
```

---

## 性能优化

### 分包加载策略
- **分包目录**: `subPack/`
- **预加载规则**: 首页访问时预加载分包（network: all）
- **优势**: 减少主包体积，提升首屏加载速度

### EasyComp 按需引入
```javascript
{
  "^u-(.*)": "uview-ui/components/u-$1/u-$1.vue"
}
```
自动按需引入 uView 组件，无需手动导入

---

## 数据模型

### 菜品数据结构 (`common/menu.js`)
```typescript
interface MenuItem {
  id: number;              // 菜品ID
  icon: string;            // 菜品图片路径
  name: string;            // 菜品名称
  desc: string;            // 食材描述
  price: string;           // 价格
  value: number;           // 购物车数量（默认0）
}

interface MenuCategory {
  name: string;            // 分类名称
  image: string;           // 分类图标
  foods: MenuItem[];       // 菜品列表
}
```

---

## 开发进度

### ✅ 已完成
- [x] 项目初始化与架构搭建
- [x] UniCloud 云开发环境配置
- [x] 4 个主要 Tab 页面结构
- [x] 3 个分包页面结构
- [x] Tab Bar 导航配置
- [x] uView UI 组件库集成
- [x] 菜单数据模型（13 道菜品，4 大分类）
- [x] 静态资源准备（菜品图片、Tab 图标）
- [x] 分包预加载优化
- [x] 自定义导航栏配置（首页、我的）
- [x] 数据库 JQL 查询文件准备
- [x] **桌号管理功能** ⭐
  - [x] 云对象：生成小程序码、管理桌号
  - [x] 数据库表：桌号信息存储
  - [x] 扫码识别：自动识别桌号并弹窗
  - [x] 人数选择：1-8人就餐人数选择
  - [x] 状态管理：桌号状态自动更新

### 🔧 开发中
- [ ] 页面 UI 实现（7个页面待开发，首页扫码功能已完成）
- [ ] 购物车逻辑实现
- [ ] 订单创建流程
- [ ] 微信支付集成
- [ ] 用户登录授权
- [ ] 订单状态管理

### 📋 待规划
- [ ] 云函数开发（订单、支付）
- [ ] 数据库表设计（用户、订单、菜品）
- [ ] 桌号管理后台页面（可视化管理）
- [ ] 实时订单推送
- [ ] 订单评价功能
- [ ] 优惠券系统
- [ ] 会员积分系统

---

## 关键文件说明

### 配置文件

| 文件 | 说明 | 关键配置 |
|------|------|----------|
| `manifest.json` | 应用配置清单 | appid, 平台配置, 权限声明 |
| `pages.json` | 页面路由配置 | 页面路径, 导航栏, Tab Bar, 分包 |
| `uni.scss` | 全局样式变量 | uView 主题色, 通用样式 |
| `App.vue` | 应用生命周期 | onLaunch, onShow, 全局样式 |
| `main.js` | 应用入口 | Vue 实例, uView 注册 |

### 业务文件

| 文件/目录 | 说明 | 状态 |
|----------|------|------|
| `common/menu.js` | 菜单数据配置 | ✅ 完成 |
| `pages/index/index.vue` | 首页（含扫码弹窗） | ✅ 扫码功能已完成 |
| `pages/menu/menu.vue` | 点餐页 | 🔧 开发中 |
| `pages/order/order.vue` | 订单列表 | 🔧 开发中 |
| `pages/my/my.vue` | 个人中心 | 🔧 开发中 |
| `subPack/index/indexSettlement.vue` | 确认订单 | 🔧 开发中 |
| `subPack/index/indexPaysuccess.vue` | 支付成功 | 🔧 开发中 |
| `subPack/order/orderDetail.vue` | 订单详情 | 🔧 开发中 |

### 云开发文件

| 文件/目录 | 说明 | 状态 |
|----------|------|------|
| `uniCloud-aliyun/cloudfunctions/zhuohao/` | 桌号管理云对象 | ✅ 完成 |
| `uniCloud-aliyun/cloudfunctions/zhuohao/index.obj.js` | 云对象主文件（5个方法） | ✅ 完成 |
| `uniCloud-aliyun/database/` | 数据库配置 | ✅ 初始化 |
| `uniCloud-aliyun/database/zhuohao.schema.json` | 桌号表结构 | ✅ 完成 |
| `uniCloud-aliyun/database/JQL查询.jql` | 数据库查询 | ✅ 已创建 |

### 文档文件

| 文件/目录 | 说明 | 状态 |
|----------|------|------|
| `docs/TABLE_MANAGEMENT.md` | 桌号管理功能文档 | ✅ 完成 |
| `.claude/PROJECT_INDEX.md` | 项目索引文档 | ✅ 持续更新 |

---

## 快速开始

### 环境准备
```bash
# 1. 安装 HBuilderX
# 下载地址: https://www.dcloud.io/hbuilderx.html

# 2. 安装微信开发者工具
# 下载地址: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

# 3. 配置微信小程序 appid
# 在 manifest.json -> mp-weixin -> appid 中填写
```

### 运行项目
```bash
# 1. 使用 HBuilderX 打开项目目录
# 2. 运行 -> 运行到小程序模拟器 -> 微信开发者工具
# 3. 首次运行需配置微信开发者工具路径
```

### 开发建议
1. **页面开发顺序**: 首页 → 菜单 → 结算 → 订单 → 我的
2. **云开发优先**: 先设计数据库表结构，再开发页面
3. **组件复用**: 抽取公共组件（菜品卡片、订单卡片等）
4. **状态管理**: 建议引入 Vuex 管理购物车和用户状态

---

## 技术特点

### UniCloud Serverless
- **零运维**: 无需购买服务器
- **弹性伸缩**: 自动扩容
- **前后端一体**: 统一开发体验
- **数据库**: 云数据库（支持 JQL）
- **云存储**: 图片、文件存储
- **云函数**: 业务逻辑后端

### UniApp 跨平台
- **一次开发**: 多端发布
- **条件编译**: 平台差异化处理
- **原生渲染**: 性能接近原生应用
- **丰富生态**: 插件市场、组件库

---

## 下一步开发计划

### Phase 1: 核心点餐流程（优先级最高）
1. 实现菜单页面 UI 和购物车交互
2. 实现结算页面和订单创建
3. 接入微信支付
4. 实现订单列表和详情展示

### Phase 2: 扫码点餐
1. 生成餐桌二维码
2. 扫码识别桌号
3. 桌号关联订单

### Phase 3: 用户体系
1. 微信授权登录
2. 用户信息管理
3. 收货地址管理（外卖模式）

### Phase 4: 增值功能
1. 优惠券系统
2. 会员积分
3. 订单评价
4. 推荐算法

---

## 联系方式

如需了解更多项目信息或参与开发，请查阅：
- **项目文档**: `README.md`
- **路由配置**: `pages.json`
- **应用配置**: `manifest.json`

---

*本索引文件由 Claude Code 自动生成，更新日期: 2025-11-08*

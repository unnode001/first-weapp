# 桌号管理功能使用文档

## 功能概述

桌号管理功能允许餐厅管理员为每张餐桌生成专属的小程序码，顾客扫码后可以直接进入点餐流程，系统会自动识别桌号并引导选择就餐人数。

---

## 功能特点

1. **自动生成小程序码** - 为每个桌号生成带有品牌色的小程序码
2. **扫码自动识别** - 扫码后自动识别桌号，无需手动输入
3. **人数选择** - 支持 1-8 人的就餐人数选择
4. **状态管理** - 自动更新桌号状态（空闲/使用中/已预订）
5. **云端存储** - 小程序码图片自动上传到云存储

---

## 数据库设计

### 桌号表 (zhuohao)

| 字段 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| _id | string | 系统自动生成ID | - |
| table_number | string | 桌号（必填） | - |
| qrcode_url | string | 小程序码云存储地址 | - |
| qrcode_file_id | string | 小程序码文件ID | - |
| status | int | 桌号状态 | 0（空闲） |
| seat_count | int | 座位数 | 4 |
| create_date | timestamp | 创建时间 | 当前时间 |

**桌号状态说明：**
- 0：空闲
- 1：使用中
- 2：已预订

---

## 云对象 API

### 1. 生成桌号小程序码

```javascript
const zhuohaoObj = uniCloud.importObject('zhuohao');
const result = await zhuohaoObj.generateTableQRCode(tableNumber, seatCount);
```

**参数：**
- `tableNumber` (string, 必填): 桌号，如 "A01"、"B02" 等
- `seatCount` (number, 可选): 座位数，默认 4

**返回值：**
```javascript
{
  code: 200,
  message: '生成桌号小程序码成功',
  data: {
    id: '记录ID',
    table_number: '桌号',
    qrcode_url: '小程序码云存储地址',
    seat_count: 座位数
  }
}
```

**示例：**
```javascript
// 生成 A01 桌号，4 人座
const result = await zhuohaoObj.generateTableQRCode('A01', 4);

// 生成 B02 桌号，6 人座
const result = await zhuohaoObj.generateTableQRCode('B02', 6);
```

---

### 2. 获取所有桌号列表

```javascript
const result = await zhuohaoObj.getTableList();
```

**返回值：**
```javascript
{
  code: 200,
  message: '获取成功',
  data: [
    {
      _id: 'xxx',
      table_number: 'A01',
      qrcode_url: 'cloud://xxx',
      status: 0,
      seat_count: 4,
      create_date: 1699999999999
    },
    // ...更多桌号
  ]
}
```

---

### 3. 获取单个桌号信息

```javascript
const result = await zhuohaoObj.getTableInfo(tableNumber);
```

**参数：**
- `tableNumber` (string, 必填): 桌号

**返回值：**
```javascript
{
  code: 200,
  message: '获取成功',
  data: {
    _id: 'xxx',
    table_number: 'A01',
    qrcode_url: 'cloud://xxx',
    status: 1,
    seat_count: 4,
    create_date: 1699999999999
  }
}
```

---

### 4. 更新桌号状态

```javascript
const result = await zhuohaoObj.updateTableStatus(tableNumber, status);
```

**参数：**
- `tableNumber` (string, 必填): 桌号
- `status` (number, 必填): 状态值（0-空闲，1-使用中，2-已预订）

**返回值：**
```javascript
{
  code: 200,
  message: '更新成功',
  data: { updated: 1 }
}
```

---

### 5. 删除桌号

```javascript
const result = await zhuohaoObj.deleteTable(tableNumber);
```

**参数：**
- `tableNumber` (string, 必填): 桌号

**注意：** 删除桌号时会同时删除云存储中的小程序码图片。

---

## 使用流程

### 管理员端（生成小程序码）

1. 调用云对象生成桌号小程序码：

```javascript
// 在 HBuilderX 的云函数控制台中执行
const zhuohaoObj = uniCloud.importObject('zhuohao');

// 批量生成桌号
const tables = ['A01', 'A02', 'A03', 'B01', 'B02', 'B03'];

for (let table of tables) {
  const result = await zhuohaoObj.generateTableQRCode(table, 4);
  console.log(result);
}
```

2. 下载生成的小程序码图片（从云存储获取）
3. 打印并放置在对应餐桌上

---

### 顾客端（扫码点餐）

1. **扫码进入** - 顾客使用微信扫描餐桌上的小程序码
2. **自动识别** - 系统自动识别桌号，显示欢迎弹窗
3. **选择人数** - 顾客选择就餐人数（1-8人）
4. **开始点餐** - 确认后自动跳转到菜单页面开始点餐

**弹窗界面：**
```
┌─────────────────────────┐
│      欢迎光临       ×   │
├─────────────────────────┤
│                         │
│   桌号：A01             │
│                         │
│   请选择就餐人数         │
│   [1人] [2人] [3人] [4人]│
│   [5人] [6人] [7人] [8人]│
│                         │
│  [确认并开始点餐]        │
└─────────────────────────┘
```

---

## 技术实现细节

### 小程序码生成

使用微信官方 API `getUnlimitedQRCode` 生成小程序码：

**参数配置：**
```javascript
{
  scene: 'table=A01',              // 场景值，携带桌号信息
  page: 'pages/index/index',       // 扫码后进入的页面
  width: 430,                       // 小程序码宽度
  auto_color: false,                // 不自动配色
  line_color: {                     // 品牌红色
    "r": 238,
    "g": 47,
    "b": 55
  },
  is_hyaline: false                 // 不透明
}
```

### 场景值解析

**小程序码携带的场景值格式：**
```
table=A01
```

**解析逻辑：** (pages/index/index.vue:165)
```javascript
parseSceneAndShowModal(scene) {
  const params = {};
  scene.split('&').forEach(item => {
    const [key, value] = item.split('=');
    if (key && value) {
      params[key] = value;
    }
  });

  if (params.table) {
    this.currentTable = params.table;
    this.showTableModal = true;
  }
}
```

### 本地存储

确认桌号和人数后，信息会保存到本地存储：

```javascript
uni.setStorageSync('currentTable', 'A01');      // 当前桌号
uni.setStorageSync('peopleCount', 4);           // 就餐人数
uni.setStorageSync('subCurrent', 0);            // 点餐类型（0-堂食）
```

---

## 测试步骤

### 1. 部署云对象

1. 在 HBuilderX 中右键 `uniCloud-aliyun/cloudfunctions/zhuohao`
2. 选择"上传部署"
3. 等待部署完成

### 2. 初始化数据库

1. 打开 uniCloud Web 控制台
2. 进入"数据库" → "DB Schema"
3. 上传 `zhuohao.schema.json`
4. 创建数据表

### 3. 生成测试桌号

在 HBuilderX 的云函数控制台中执行：

```javascript
const zhuohaoObj = uniCloud.importObject('zhuohao');
const result = await zhuohaoObj.generateTableQRCode('TEST01', 4);
console.log(result);
```

### 4. 测试扫码功能

由于开发环境无法直接扫码，可以通过以下方式测试：

**方式1：模拟场景值**

在首页 onLoad 中手动传入场景值：
```javascript
onLoad() {
  // 模拟扫码进入
  this.handleScanScene({ scene: 'table=TEST01' });
}
```

**方式2：真机预览**

1. 使用微信开发者工具预览
2. 生成预览二维码
3. 手机扫码进入小程序
4. 再扫餐桌小程序码

---

## 常见问题

### Q1: 生成小程序码失败？

**可能原因：**
- 未配置小程序 AppID
- access_token 获取失败
- 网络请求失败

**解决方法：**
1. 检查 manifest.json 中是否配置了正确的 AppID
2. 确保云服务空间已关联小程序
3. 查看云函数日志排查具体错误

### Q2: 扫码后弹窗不显示？

**可能原因：**
- 场景值解析失败
- 小程序码 page 参数配置错误

**解决方法：**
1. 在 onLoad 中打印 options 参数，检查场景值
2. 确保小程序码生成时 page 参数为 `pages/index/index`

### Q3: 如何批量生成桌号？

**示例代码：**
```javascript
async function batchGenerateTables() {
  const zhuohaoObj = uniCloud.importObject('zhuohao');

  // 定义桌号列表
  const tables = [
    { number: 'A01', seats: 2 },
    { number: 'A02', seats: 4 },
    { number: 'A03', seats: 4 },
    { number: 'B01', seats: 6 },
    { number: 'B02', seats: 8 },
  ];

  for (let table of tables) {
    try {
      const result = await zhuohaoObj.generateTableQRCode(
        table.number,
        table.seats
      );
      console.log(`✓ ${table.number} 生成成功`);
    } catch (error) {
      console.error(`✗ ${table.number} 生成失败:`, error);
    }

    // 延迟避免频率限制
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

batchGenerateTables();
```

---

## 下一步开发建议

1. **管理后台** - 创建桌号管理页面，可视化操作
2. **下载功能** - 支持批量下载小程序码图片
3. **座位地图** - 显示餐厅平面图，实时桌号状态
4. **预订功能** - 支持提前预订餐桌
5. **数据统计** - 统计每个桌号的使用率

---

## 相关文件

| 文件路径 | 说明 |
|---------|------|
| `uniCloud-aliyun/cloudfunctions/zhuohao/index.obj.js` | 云对象：桌号管理 |
| `uniCloud-aliyun/database/zhuohao.schema.json` | 数据库表结构 |
| `pages/index/index.vue` | 首页：扫码弹窗 |
| `docs/TABLE_MANAGEMENT.md` | 本文档 |

---

*文档更新时间：2025-11-08*

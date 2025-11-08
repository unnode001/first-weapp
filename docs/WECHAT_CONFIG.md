# 微信小程序配置指南

## 为什么需要配置 AppID 和 AppSecret？

在桌号管理功能中，我们使用微信小程序码 API (`getUnlimitedQRCode`)，这个 API 需要：
- **AppID**：标识你的小程序
- **AppSecret**：密钥，用于获取 access_token
- **access_token**：调用微信 API 的凭证

UniCloud 的 `uniCloud.getWXAccessToken()` 会自动处理这些，但需要先在控制台配置。

---

## 配置步骤

### 第一步：获取微信小程序的 AppID 和 AppSecret

1. **登录微信公众平台**
   - 访问：https://mp.weixin.qq.com/
   - 使用小程序管理员账号扫码登录

2. **进入开发设置**
   ```
   左侧菜单：开发 -> 开发管理 -> 开发设置
   ```

3. **获取 AppID**
   ```
   在"开发者ID"栏目中
   AppID(小程序ID): wxXXXXXXXXXXXXXXXX
   ```
   复制并保存这个 AppID

4. **获取 AppSecret**
   ```
   在"开发者密码(AppSecret)"栏目中
   点击"生成"按钮（如果已生成过，点击"重置"）
   ```

   ⚠️ **重要提示**：
   - AppSecret 只会显示一次，请立即复制保存
   - 不要分享给任何人
   - 如果泄露，立即重置
   - 重置后旧的 AppSecret 会立即失效

---

### 第二步：配置 manifest.json（本地开发）

在项目根目录的 `manifest.json` 文件中配置 AppID：

```json
{
  "name": "点餐应用客户端",
  "appid": "__UNI__28998C3",
  "mp-weixin": {
    "appid": "wxXXXXXXXXXXXXXXXX",  // 👈 替换为你的 AppID
    "setting": {
      "urlCheck": false,
      "es6": true,
      "minified": true,
      "postcss": true
    },
    "usingComponents": true
  }
}
```

**作用**：
- 用于本地开发和预览
- 用于发布小程序
- 不包含 AppSecret（安全考虑）

---

### 第三步：配置 UniCloud 控制台（云端调用）

#### 方式A：通过 UniCloud Web 控制台配置（推荐）

1. **登录 UniCloud 控制台**
   ```
   https://unicloud.dcloud.net.cn/
   ```

2. **选择云服务空间**
   - 点击进入你的云服务空间（例如：first-weapp）

3. **配置小程序信息**
   ```
   路径：云服务空间 -> 跨平台集成 -> 微信小程序
   或者：云服务空间 -> 设置 -> 小程序配置
   ```

4. **填写配置**
   ```
   AppID:      wxXXXXXXXXXXXXXXXX
   AppSecret:  XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

5. **保存配置**
   - 点击"保存"或"确认"按钮

#### 方式B：通过 HBuilderX 配置

1. **打开 HBuilderX**
   - 打开项目

2. **关联云服务空间**
   ```
   右键项目根目录 -> 关联云服务空间或项目
   ```

3. **选择云服务空间**
   - 选择已创建的云服务空间
   - 如果没有，先创建一个

4. **配置小程序信息**
   ```
   在 HBuilderX 中：
   uniCloud -> 云服务空间 -> 设置 -> 小程序配置
   ```

---

### 第四步：验证配置

#### 方法1：在云函数中测试

创建一个测试云函数或在现有云对象中测试：

```javascript
// 在 HBuilderX 的云函数控制台中执行
async function testWXConfig() {
  try {
    // 尝试获取 access_token
    const result = await uniCloud.getWXAccessToken();

    if (result && result.accessToken) {
      console.log('✅ 配置成功！');
      console.log('Access Token:', result.accessToken);
      return { success: true, message: '配置正确' };
    } else {
      console.error('❌ 配置失败：', result);
      return { success: false, message: '无法获取 access_token' };
    }
  } catch (error) {
    console.error('❌ 配置错误：', error);
    return { success: false, error: error.message };
  }
}

testWXConfig();
```

#### 方法2：测试生成桌号小程序码

```javascript
// 在云函数控制台中执行
const zhuohaoObj = uniCloud.importObject('zhuohao');
const result = await zhuohaoObj.generateTableQRCode('TEST01', 4);

if (result.code === 200) {
  console.log('✅ 生成小程序码成功！');
  console.log('桌号：', result.data.table_number);
  console.log('二维码地址：', result.data.qrcode_url);
} else {
  console.error('❌ 生成失败：', result.message);
}
```

---

## 常见问题

### Q1: 获取 access_token 失败？

**可能原因**：
1. AppID 或 AppSecret 配置错误
2. 云服务空间未正确关联小程序
3. 小程序未发布或未通过审核

**解决方法**：
1. 检查 AppID 和 AppSecret 是否正确
2. 重新生成 AppSecret 并更新配置
3. 确认小程序已发布（测试环境也需要）

### Q2: 小程序码生成失败，返回 40001 错误？

**错误信息**：`access_token is invalid or not latest`

**解决方法**：
1. AppSecret 可能已过期或被重置
2. 重新获取并配置新的 AppSecret
3. 等待几分钟让配置生效

### Q3: 提示"appid is not a valid appid"？

**可能原因**：
1. AppID 格式错误（应该是 wx 开头的字符串）
2. AppID 不存在或已被删除
3. 复制时多了空格或换行

**解决方法**：
1. 重新从微信公众平台复制 AppID
2. 确保格式为：`wxXXXXXXXXXXXXXXXX`（wx + 16位字符）

### Q4: 云对象中如何使用 access_token？

**正确做法**：
```javascript
// ✅ 推荐：使用 UniCloud 自动管理
const accessTokenRes = await uniCloud.getWXAccessToken();
const accessToken = accessTokenRes.accessToken;

// 调用微信 API
const result = await uniCloud.httpclient.request(
  `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`,
  { ... }
);
```

**错误做法**：
```javascript
// ❌ 不推荐：手动管理 access_token
const appid = 'wxXXXXXXXX';  // 硬编码在代码中
const secret = 'XXXXXXXXX';   // 泄露风险！
```

---

## 配置文件位置总结

| 配置项 | 文件/位置 | 用途 |
|--------|----------|------|
| **AppID** | `manifest.json` -> `mp-weixin.appid` | 本地开发、发布 |
| **AppID + AppSecret** | UniCloud Web 控制台 -> 云服务空间 -> 小程序配置 | 云端调用微信 API |
| **云服务空间关联** | HBuilderX -> 右键项目 -> 关联云服务空间 | 本地连接云端 |

---

## 安全建议

### ✅ 应该做的：
- 将 AppSecret 配置在 UniCloud 控制台，而不是代码中
- 定期更换 AppSecret（建议每3-6个月）
- 不要将 AppSecret 提交到 Git 仓库
- 使用 `.gitignore` 忽略包含敏感信息的文件

### ❌ 不应该做的：
- 不要在代码中硬编码 AppSecret
- 不要分享 AppSecret 给他人
- 不要在公开的地方（如论坛、博客）泄露 AppSecret
- 不要在前端代码中使用 AppSecret

---

## 完整流程图

```
┌─────────────────────────────────────────────────────────┐
│  1. 微信公众平台                                         │
│     - 获取 AppID                                         │
│     - 生成 AppSecret                                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  2. 本地开发环境 (manifest.json)                        │
│     - 配置 AppID（不含 AppSecret）                      │
│     - 用于本地开发和发布                                │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  3. UniCloud 控制台                                      │
│     - 配置 AppID + AppSecret                            │
│     - 关联云服务空间                                    │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  4. 云对象/云函数                                        │
│     - 调用 uniCloud.getWXAccessToken()                  │
│     - 自动获取 access_token                             │
│     - 调用微信 API                                      │
└─────────────────────────────────────────────────────────┘
```

---

## 相关文档

- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [UniCloud 官方文档](https://uniapp.dcloud.net.cn/uniCloud/)
- [微信小程序码生成 API](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/qr-code/getUnlimitedQRCode.html)
- [UniCloud getWXAccessToken 文档](https://uniapp.dcloud.net.cn/uniCloud/cf-functions.html#get-wx-access-token)

---

*文档更新时间：2025-11-08*

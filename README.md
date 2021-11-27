# AsoulCnkiOAuthFrontend

## 简述

为 b 站提供第三方 oauth 服务  
尽量保持打包产物的精简以提升用户体验  
打包采用 vite 进行，css 使用 tailwindcss

## 接入示例

跳转到https://aaa.com/?redirect_uri=https://www.bbb.com,

用户成功授权后 oauth 系统将跳转到回调页面，并通过`锚点`的形式传递 token.

此例中将跳转到https://www.bbb.com/#token=qf4z12s2gsuu0o4l

获取到 token 后可参照[后端 api 说明](https://github.com/ASoulCnki/ASoulCnkiOAuth#%E9%80%9A%E8%BF%87token%E8%8E%B7%E5%8F%96%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF)获取用户信息

## API 说明

### 获取新的 token

token 需要用户发私信验证之后才能正常使用，未绑定的 token 两分钟会过期

```http
GET /verify
```

### 鉴权

只要不是 DELETE 都可以用

```http
GET /verify

Authorization: token
```

#### 返回值

| 名称    | 解释                |
| ------- | ------------------- |
| code    | 为 0 时，验证成功   |
| message | 报错信息，默认为 ok |
| uid     | 和对应用户的 uid    |

## 取消授权

```http
DELETE /verify

Authorization: token
```

#### 返回值

| 名称    | 解释                |
| ------- | ------------------- |
| code    | 为 0 时，验证成功   |
| message | 报错信息，默认为 ok |

## 安装

```bash
npm install
```

## 运行 && 打包

### 启动开发机

```bash
npm run dev
```

### 构建

```bash
npm run build
```

### 本地预览构建产物

```bash
npm run serve
```

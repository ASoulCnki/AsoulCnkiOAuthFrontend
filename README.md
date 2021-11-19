# AsoulCnkiOAuthFrontend

## 简述
为b站提供第三方oauth服务  
尽量保持打包产物的精简以提升用户体验  
打包采用vite进行，css使用tailwindcss  

## 接入示例
跳转到https://aaa.com/?redirect_uri=https://www.bbb.com,

用户成功授权后oauth系统将跳转到回调页面，并通过`锚点`的形式传递token.

此例中将跳转到https://www.bbb.com/#token=qf4z12s2gsuu0o4l

获取到token后可参照[后端api说明](https://github.com/ASoulCnki/ASoulCnkiOAuth#%E9%80%9A%E8%BF%87token%E8%8E%B7%E5%8F%96%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF)获取用户信息

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
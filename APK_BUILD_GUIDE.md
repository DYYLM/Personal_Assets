# 📱 APK 构建完整指南

## 🚀 最简单的方法：使用在线构建服务

### 方法一：使用 GitHub Actions（推荐）

1. **将项目推送到 GitHub**
   - 创建一个新的 GitHub 仓库
   - 上传整个项目文件夹

2. **创建 GitHub Actions 工作流**
   
   在项目根目录创建 `.github/workflows/build-apk.yml`：

   ```yaml
   name: Build APK
   on:
     push:
       branches: [ main ]
     workflow_dispatch:
   
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v4
       
       - name: Set up Node.js
         uses: actions/setup-node@v4
         with:
           node-version: '20'
       
       - name: Install dependencies
         run: npm ci
       
       - name: Build Web
         run: npm run build
       
       - name: Set up JDK 17
         uses: actions/setup-java@v4
         with:
           java-version: '17'
           distribution: 'temurin'
       
       - name: Sync Capacitor
         run: npx cap sync android
       
       - name: Build Debug APK
         working-directory: android
         run: ./gradlew assembleDebug
       
       - name: Upload APK
         uses: actions/upload-artifact@v4
         with:
           name: app-debug
           path: android/app/build/outputs/apk/debug/app-debug.apk
   ```

3. **触发构建**
   - 推送代码到 GitHub
   - 或者在仓库的 "Actions" 标签页手动触发
   - 构建完成后，在 "Artifacts" 下载 APK

---

### 方法二：使用本地 Android Studio（需要安装）

#### 前置准备

**1. 下载并安装 Android Studio**
   - 访问：https://developer.android.com/studio
   - 下载并安装（Windows/Mac/Linux 都有）

**2. 安装 JDK**
   - Android Studio 会自动安装 JDK，或者单独下载
   - 需要 JDK 11 或更高版本

#### 构建步骤

**步骤 1：打开项目**
```bash
# 在项目根目录运行
npm run cap:android
```
这会自动打开 Android Studio 并加载项目。

**步骤 2：等待 Gradle 同步**
- Android Studio 打开后会自动同步项目
- 等待右下角进度条完成（第一次可能需要几分钟下载依赖）

**步骤 3：构建 APK**
- 点击菜单：`Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
- 等待构建完成
- 弹出通知后点击 "locate" 查看 APK 文件

**APK 位置：**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

### 方法三：使用命令行（已配置好 Android 环境）

如果您已经配置好了 Android SDK 和 JDK：

```bash
# 1. 进入 android 目录
cd android

# 2. 构建 Debug APK
./gradlew assembleDebug

# 3. APK 文件位置
# android/app/build/outputs/apk/debug/app-debug.apk

# （可选）构建 Release APK
./gradlew assembleRelease
```

---

## 📋 项目文件说明

您的 Android 项目已完全配置好：

- **项目位置：** [android/](file:///c:/Users/shou2/Documents/trae_projects/Personal_Assets/android)
- **应用包名：** `com.personalassets.manager`
- **应用名称：** 个人资产管理
- **版本：** 1.0 (versionCode: 1)

---

## 💡 常见问题解决

### 问题 1：Gradle 下载慢
**解决：** 配置国内镜像源

在 `android/gradle.properties` 添加：
```properties
systemProp.https.proxyHost=mirrors.cloud.tencent.com
systemProp.https.proxyPort=443
```

### 问题 2：找不到 JAVA_HOME
**解决：** 设置环境变量
- Windows：`set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr`
- Mac：`export JAVA_HOME=/Applications/Android Studio.app/Contents/jbr/Contents/Home`

### 问题 3：构建失败
**解决：** 清理后重新构建
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

---

## 🎯 推荐方案

**最简单：使用 GitHub Actions 在线构建**
- 无需安装任何软件
- 免费使用
- 自动完成所有步骤

**最灵活：使用 Android Studio 本地构建**
- 可以自定义签名
- 可以调试
- 适合长期开发

---

## 📱 APK 安装说明

构建好 APK 后：

1. 将 APK 文件传输到手机
2. 在手机上打开 APK 文件
3. 允许"未知来源"安装
4. 完成安装！

---

祝您构建顺利！🎉

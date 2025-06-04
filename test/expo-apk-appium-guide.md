# 📦 How to Build and Use a `.apk` from Expo with Appium

This guide explains how to generate an `.apk` from your **Expo (React Native)** project using **EAS Build**, and how to configure it for Appium tests.

---

## ✅ Step-by-step to build your `.apk`

### 1. Install EAS CLI

```bash
npm install -g eas-cli
```

### 2. Log in to your Expo account

```bash
eas login
```

> You must be logged in to use EAS Build.

### 3. Initialize EAS in your project (if you haven't)

```bash
eas build:configure
```

> This creates an `eas.json` file in your project root.

### 4. Build the APK

```bash
eas build -p android --profile preview
```

This command:

- Uses the `preview` profile from `eas.json`
- Builds an installable `.apk` (not an `.aab`)

### 5. Download the APK

Once the build completes, you'll get a URL in the terminal (or on https://expo.dev).

Download the `.apk` file manually.

### 6. Set `.apk` in `wdio.conf.ts`

Use the downloaded `.apk` in your WebdriverIO config:

```ts
'appium:app': '/absolute/path/to/your-app.apk'
```

Make sure to use an **absolute path** like:

```ts
'appium:app': '/Users/yourname/Downloads/bagsmobile.apk'
```

---

## 📌 Notes

- Do **not** use `.aab` files with Appium — only `.apk` is supported.
- Use `adb install path-to-apk` to manually reinstall the app on the emulator.


### Run Welcome screen test

```bash
npx wdio run wdio.conf.ts --spec ./test/specs/welcome.e2e.ts
```
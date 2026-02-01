import "dotenv/config";

export default {
  expo: {
    name: "unCaged",
    slug: "unCaged",
    icon: "./src/assets/imgs/icon.png",
    version: "9.0.0",
    orientation: "portrait",
    scheme: "uncaged",
    platforms: ["ios", "android", "web"],
    jsEngine: "hermes",
    extra: {
      apiBaseUrl:  process.env.API_BASE_URL,
      eas: {
        projectId: "8b66d794-89ac-4204-8dcd-3d8e025423fd",
      },
    },
    splash: {
      image: "./src/assets/imgs/icon.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
    },
    updates: {
      enabled: false,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "uncaged.app",
      config: {},
    },
    android: {
      package: "uncaged.app",
      versionCode: 9,
      adaptiveIcon: {
        foregroundImage: "./src/assets/imgs/icon.png",
        backgroundColor: "#000000",
      },
      config: {},
    },
    web: {
      favicon: "./src/assets/imgs/icon.png",
    },
    plugins: ["expo-font", "expo-secure-store"],
  },
};

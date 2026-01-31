import 'dotenv/config';

export default {
  expo: {
    name: 'unCaged',
    slug: 'unCaged',
    icon: './app/assets/imgs/appleIcon.png',
    version: '9.0.0',
    orientation: 'portrait',
    scheme: 'uncaged',
    platforms: ['ios', 'android', 'web'],
    jsEngine: 'hermes',
    packagerOpts: {
      config: 'metro.config.js',
      sourceExts: [
        'expo.ts',
        'expo.tsx',
        'expo.js',
        'expo.jsx',
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'wasm',
        'svg',
      ],
    },
    extra: {
      apiBaseUrl: process.env.API_BASE_URL,
    },
    splash: {
      resizeMode: 'contain',
      backgroundColor: '#000000',
    },
    updates: {
      enabled: false,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'uncaged.app',
      config: {
        googleMobileAdsAppId: '',
      },
    },
    android: {
      package: 'uncaged.app',
      versionCode: 9,
      adaptiveIcon: {
        foregroundImage: './src/assets/imgs/appleIcon.png',
        backgroundColor: '#000000',
      },
      config: {
        googleMobileAdsAppId: '',
      },
    },
    web: {
      favicon: './src/assets/imgs/icon.png',
    },
    plugins: ['expo-font', 'expo-secure-store'],
  },
};

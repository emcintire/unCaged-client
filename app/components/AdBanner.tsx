import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

type Props = {
  bannerSize?: unknown;
};

// Only import ads module if not in Expo Go
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let BannerAd: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let BannerAdSize: any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let TestIds: any;

if (!isExpoGo) {
  const ads = require('react-native-google-mobile-ads');
  ({ BannerAd, BannerAdSize, TestIds } = ads);
}

export default function AdBanner({ bannerSize }: Props) {
  // Return null in Expo Go since it doesn't support native modules
  if (isExpoGo || !BannerAd) {
    return null;
  }

  const adUnitId = __DEV__
    ? TestIds.BANNER
    : Platform.OS === 'ios'
      ? 'ca-app-pub-7328192473595101~2186093958'
      : 'ca-app-pub-7328192473595101~8779422463';

  return (
    <BannerAd
      unitId={adUnitId}
      size={bannerSize || BannerAdSize.BANNER}
      requestOptions={{ requestNonPersonalizedAdsOnly: true }}
    />
  );
}

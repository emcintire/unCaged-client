import { Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

type Props = {
  bannerSize?: BannerAdSize;
};

// Use test IDs in development
const adUnitId = __DEV__
  ? TestIds.BANNER
  : Platform.OS === 'ios'
    ? 'ca-app-pub-7328192473595101~2186093958'
    : 'ca-app-pub-7328192473595101~8779422463';

export default function AdBanner({ bannerSize = BannerAdSize.BANNER }: Props) {
  return (
    <BannerAd
      unitId={adUnitId}
      size={bannerSize}
      requestOptions={{ requestNonPersonalizedAdsOnly: true }}
    />
  );
}

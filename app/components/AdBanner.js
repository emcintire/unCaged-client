import React from 'react';
// import { Platform } from 'react-native';
// import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// // Use test IDs in development
// const adUnitId = __DEV__ 
//   ? TestIds.BANNER 
//   : Platform.OS === 'ios'
//     ? 'ca-app-pub-7328192473595101~2186093958'
//     : 'ca-app-pub-7328192473595101~8779422463';

function AdBanner({ bannerSize }) {
  return (
    null
    // <BannerAd
    //   // unitId={adUnitId}
    //   size={bannerSize}
    //   requestOptions={{
    //     requestNonPersonalizedAdsOnly: true,
    //   }}
    // />
  );
}

export default AdBanner;

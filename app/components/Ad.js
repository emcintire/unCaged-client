import React from 'react';
import { View, Platform } from 'react-native';
import colors from '../config/colors';
import {
    AdMobBanner,
} from 'expo-ads-admob';

function BannerAd ({id}) {

    return (
        <View style={{marginTop: 30}}>
            <AdMobBanner
                bannerSize="fullBanner"
                // adUnitID="ca-app-pub-7328192473595101/4214449357"  // Prod ad
                // adUnitID={id}
                // adUnitID="ca-app-pub-3940256099942544/6300978111"
                servePersonalizedAds={false}
                onDidFailToReceiveAdWithError={(err) => console.log(err)} 
            />
        </View>
    );
}

exports.BannerAd = BannerAd;
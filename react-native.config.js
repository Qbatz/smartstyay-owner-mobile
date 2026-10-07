module.exports = {
  assets: ['./assets/fonts'],
  // Apple In-App Purchase is iOS only. Keep these native modules out of the
  // Android build so the Android (Zoho) payment flow is unaffected.
  dependencies: {
    'react-native-iap': { platforms: { android: null } },
    'react-native-nitro-modules': { platforms: { android: null } },
  },
};


// fontFamily: "Gilroy-Regular"  ==> 400
// fontFamily: "Gilroy-Medium"   ==> 500
// fontFamily: "Gilroy-Semibold" ==> 600 
// fontFamily: "Gilroy-Bold"     ==> 700
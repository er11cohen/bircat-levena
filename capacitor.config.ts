import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eran.bircatlevana',
  appName: 'תזכורת לברכת הלבנה',
  webDir: 'www',
  bundledWebRuntime: false,
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      'android-minSdkVersion': '22',
      BackupWebStorage: 'none',
      AutoHideSplashScreen: 'false',
      SplashMaintainAspectRatio: 'true',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenSpinnerColor: 'white',
      AndroidXEnabled: 'true'
    }
  }
};

export default config;

import {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eran.bircatlevana',
  appName: 'תזכורת לברכת הלבנה',
  webDir: 'www',
  cordova: {
    preferences: {
      ScrollEnabled: 'false',
      BackupWebStorage: 'none',
      AutoHideSplashScreen: 'false',
      SplashMaintainAspectRatio: 'true',
      SplashShowOnlyFirstTime: 'false',
      SplashScreen: 'screen',
      SplashScreenSpinnerColor: 'white',
      AndroidXEnabled: 'true'
    }
  },
  plugins: {
    EdgeToEdge: {
      statusBarColor: '#427ebb',
    }
  }
};

export default config;

import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';

import { GlobalVariables } from './shared/global/global-variables';
import { TranslateService } from '@ngx-translate/core';
import { Languages } from './shared/enums';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private localNotifications: LocalNotifications,
    private geolocation: Geolocation,
    private storage: Storage,
    public translate: TranslateService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
     // this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.setLanguage();

      this.localNotifications.schedule({
        id: 1,
        text: 'Single ILocalNotification',
        sound: null,
        foreground: true,
        priority:2,
        trigger: {at: new Date(new Date().getTime() +190000)},
      });

      this.geolocation.getCurrentPosition({timeout: 5000}).then((resp: Geoposition) => {
        console.log(resp);
        this.storage.set(GlobalVariables.LAST_COORD, {
          latitude: resp.coords.latitude,
          longitude: resp.coords.longitude,
          altitude: resp.coords.altitude,
        });

       }).catch((error) => {
         //console.log('Error getting location', error);
         this.storage.get(GlobalVariables.LAST_COORD).then((coords) => {
           if(coords) {
            console.log('Your latitude is', coords);
           }
        });
       });
    });
  }

  private setLanguage() {
    this.translate.setDefaultLang(Languages.HE);
    let language = Languages.HE
    if(window.navigator.language.startsWith('en')) {
      language = Languages.EN;
    }
    this.translate.use(language);
  }
}

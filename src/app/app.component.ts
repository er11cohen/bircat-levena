import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

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
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
     // this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.localNotifications.schedule({
        id: 1,
        text: 'Single ILocalNotification',
        sound: null,
        foreground: true,
        priority:2,
        trigger: {at: new Date(new Date().getTime() +190000)},
      });

      this.geolocation.getCurrentPosition({timeout: 5000}).then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
        console.log(resp);
       }).catch((error) => {
         console.log('Error getting location', error);
       });
    });
  }
}

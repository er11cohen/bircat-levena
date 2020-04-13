import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { take } from 'rxjs/operators';
import { GlobalVariables } from './shared/global/global-variables';
import { TranslateService } from '@ngx-translate/core';
import { Languages } from './shared/enums';
import { JewishCalendar } from 'kosher-zmanim';

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
    public device: Device,
    private toast: Toast,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log(this.device);

     // this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.setLanguage();

      this.notification();

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

    this.setZmanim();

    setTimeout(()=> {
    //this.toast.show(`I'm a toast`, '10000', 'center').pipe(take(1)).subscribe();
    // this.toast.show(`I'm a toast`, '5000', 'center').subscribe(
    //   toast => {
    //     console.log(toast);
    //   }
    // );
    //debugger
    }, 5000);
   
  }

  private setLanguage() {
    this.translate.setDefaultLang(Languages.HE);
    let language = Languages.HE
    if(window.navigator.language.startsWith('en')) {
      language = Languages.EN;
    }
    this.translate.use(language);
  }

  private setZmanim():void {
     const jewishCalendar = new JewishCalendar();
     const tchilas = jewishCalendar.getTchilasZmanKidushLevana7Days();
     console.log(tchilas);

     this.localNotifications.schedule({
      id: 1,
      text: 'getTchilasZmanKidushLevana7Days',
      sound: null,
      foreground: true,
      priority:2,
      trigger: {at: tchilas},
    });

     const sof = jewishCalendar.getSofZmanKidushLevana15Days();

     this.localNotifications.schedule({
      id: 2,
      text: 'getSofZmanKidushLevana15Days',
      sound: null,
      foreground: true,
      priority:2,
      trigger: {at: sof},
    });
  }

  private notification(): void {
    this.localNotifications.on('schedule')
    .pipe(take(1))
    .subscribe((er) => {
      console.log(er);
      this.notification();
      this.toast.show('schedule', '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );
    });
    
    this.localNotifications.schedule({
      id: 100,
      text: 'Single ILocalNotification',
      sound: null,
      foreground: true,
      priority:2,
      //trigger: {at: new Date(new Date().getTime() +190000)},
      trigger: {at: new Date(new Date().getTime())},
      actions: [
        { id: 'yes', title: 'Yes' },
        { id: 'no',  title: 'No' }
      ]
    });
    
    
    // this.localNotifications.on('yes')
    // .pipe(take(1))
    // .subscribe((er) => {
    //   console.log(er);
    //   this.notification();
    //   this.toast.show('Im a toast', '5000', 'center').subscribe(
    //     toast => {
    //       console.log(toast);
    //     }
    //   );
    // });

   
  }
}

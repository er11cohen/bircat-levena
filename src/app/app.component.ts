import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {Geolocation, Geoposition} from '@ionic-native/geolocation/ngx';
import {Storage} from '@ionic/storage';
import {Toast} from '@ionic-native/toast/ngx';
import {GlobalVariables} from './shared/global/global-variables';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {Languages} from './shared/enums';
import {JewishCalendar} from 'kosher-zmanim';
import {UtilsService} from './services/utils.service';
import {NotificationsService} from './services/notifications.service';
import {SettingsService} from './services/settings.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    public appPages = [
        {
            title: 'BIRCAT_HALEVANA',
            url: '/home',
            icon: 'home'
        },
        {
            title: 'List',
            url: '/list',
            icon: 'list'
        },
        {
            title: 'SETTINGS',
            url: '/settings',
            icon: 'options'
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
        // public device: Device,
        private toast: Toast,
        private utilsService: UtilsService,
        private notificationsService: NotificationsService,
        private settingsService: SettingsService,
    ) {
        this.initializeApp();
    }

    async initializeApp() {
        await this.platform.ready();

        // console.log(this.device);

        // this.statusBar.styleDefault();
        this.splashScreen.hide();

        this.setLanguage();

        // workaround to use after in 'this.translate.instant'
        await this.translate.get('BL_START_TIME').toPromise();
        this.notification();

        await this.settingsService.initialSettings();

        this.geolocation.getCurrentPosition({timeout: 5000}).then((resp: Geoposition) => {
            console.log(resp);
            this.storage.set(GlobalVariables.LAST_COORD, {
                latitude: resp.coords.latitude,
                longitude: resp.coords.longitude,
                altitude: resp.coords.altitude,
            });

        }).catch((error) => {
            // console.log('Error getting location', error);
            this.storage.get(GlobalVariables.LAST_COORD).then((coords) => {
                if (coords) {
                    console.log('Your latitude is', coords);
                }
            });
        });

        this.setZmanim();
    }

    private languageChangedSubscription(): void {
        this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            if (document && document.body) {
                document.body.dir = event.translations.DIR;
            }
        });
    }

    private setLanguage() {
        this.languageChangedSubscription();
        this.translate.setDefaultLang(Languages.HE);
        const language = Languages.HE;
        // if (window.navigator.language.startsWith('en')) {
        //     language = Languages.EN;
        // }
        this.translate.use(language);
    }

    private setZmanim(): void {
        this.notificationsService.createBLNotifications();


        const jewishCalendar = new JewishCalendar();
        const tchilas = jewishCalendar.getTchilasZmanKidushLevana7Days();
        console.log(tchilas);

        this.localNotifications.schedule({
            id: 1,
            text: 'getTchilasZmanKidushLevana7Days',
            sound: null,
            foreground: true,
            priority: 2,
            trigger: {at: tchilas},
        });

        const sof = jewishCalendar.getSofZmanKidushLevana15Days();

        this.localNotifications.schedule({
            id: 2,
            text: 'getSofZmanKidushLevana15Days',
            sound: null,
            foreground: true,
            priority: 2,
            trigger: {at: sof},
        });
    }

    private notification(): void {
        if (this.utilsService.isMobile()) {
            console.log((cordova.plugins as any).notification.local.launchDetails);
            // {action: ’yes', id: 100}
        }
        // this.localNotifications.on('schedule')
        //     .pipe(take(1))
        //     .subscribe((er) => {
        //         console.log(er);
        //         this.notification();
        //         this.toast.show('schedule', '5000', 'center').subscribe(
        //             toast => {
        //                 console.log(toast);
        //             }
        //         );
        //     });

        this.localNotifications.schedule({
            id: 100,
            text: 'Single ILocalNotification',
            // sound: null,
            foreground: true,
            priority: 2,
            // trigger: {at: new Date(new Date().getTime() +190000)},
            trigger: {at: new Date(new Date().getTime())},
            actions: [
                {id: 'yes', title: 'Yes', launch: true},
                {id: 'no', title: 'No', launch: true}
            ]
        });


        // this.localNotifications.on('yes')
        //     // .pipe(take(1))
        //     .subscribe((er) => {
        //         alert('in yes callback');
        //         console.log(er);
        //         this.notification();
        //         this.toast.show('Im a toast', '5000', 'center').subscribe(
        //             toast => {
        //                 console.log(toast);
        //             }
        //         );
        //     });


    }
}

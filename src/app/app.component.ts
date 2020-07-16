import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Storage} from '@ionic/storage';
import {Toast} from '@ionic-native/toast/ngx';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {Languages} from './shared/enums';
import {UtilsService} from './services/utils.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    public isRtl = true;
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
        private toast: Toast,
        private utilsService: UtilsService,
    ) {
        this.initializeApp();
    }

    async initializeApp() {
        await this.platform.ready();

        // console.log(this.device);

        // this.statusBar.styleDefault();
        this.splashScreen.hide();

        this.setLanguage();

        this.utilsService.initialCoordinatesAndCreateBLNotifications();
    }

    private languageChangedSubscription(): void {
        this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            this.isRtl = event.lang === 'he';
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
}

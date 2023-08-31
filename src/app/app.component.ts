import {Component, Inject} from '@angular/core';

import {AlertController, MenuController, Platform, ToastController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {Toast} from '@ionic-native/toast/ngx';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {Languages} from './shared/enums';
import {UtilsService} from './services/utils.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {GlobalVariables} from './shared/global/global-variables';
import {TRANSLATIONS_DICTIONARY, TranslationsDictionary} from './services/translations-dictionary';
import {PlatformsService} from './services/platforms.service';
import {StatusBar} from '@ionic-native/status-bar/ngx';

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
            title: 'HALACH_AND_AGADA',
            url: '/halachot',
            icon: 'book'
        },
        {
            title: 'ABOUT_TITLE',
            url: '/about',
            icon: 'help-circle'
        },
        {
            title: 'SETTINGS',
            url: '/settings',
            icon: 'options'
        }
    ];
    private closeCounter = 0;

    constructor(
        @Inject(TRANSLATIONS_DICTIONARY)
        public dict: TranslationsDictionary,
        public translate: TranslateService,
        private platform: Platform,
        private splashScreen: SplashScreen,
        private toast: Toast,
        private utilsService: UtilsService,
        private alertController: AlertController,
        private router: Router,
        private location: Location,
        private toastCtrl: ToastController,
        private menu: MenuController,
        private platformsService: PlatformsService,
        private readonly statusBar: StatusBar,
    ) {
        this.initializeApp();
    }

    async initializeApp() {
        await this.platform.ready();

        this.statusBar.backgroundColorByHexString('427ebb');
        this.splashScreen.hide();

        this.setLanguage();
        this.backButtonEvent();
        this.utilsService.initialCoordinatesAndInitialBLNotifications();
    }

    private languageChangedSubscription(): void {
        this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            this.isRtl = event.lang === Languages.HE;
            if (document && document.body) {
                document.body.dir = event.translations.DIR;
            }
        });
    }

    private setLanguage() {
        this.languageChangedSubscription();
        this.translate.setDefaultLang(Languages.HE);
        this.translate.use(Languages.HE);
    }

    private backButtonEvent(): void {
        this.platform.backButton.subscribeWithPriority(9999, async () => {
            if (await this.menu.isOpen()) {
                this.menu.close();
                return;
            }

            const alert = await this.alertController.getTop();
            if (alert) {
                if (alert.id !== GlobalVariables.PREVENT_CLOSE_ALERT) {
                    alert.dismiss();
                }
                return;
            }

            switch (true) {
                case /\/home/.test(this.router.url):
                    this.closeApp();
                    break;
                default:
                    this.location.back();
            }
        });
    }

    private async closeApp() {
        this.closeCounter++;
        if (this.closeCounter === 2) {
            // @ts-ignore
            navigator.app.exitApp();
            return;
        }

        setTimeout(() => this.closeCounter = 0, 2000);
        const toast = await this.toastCtrl.create({
            message: this.translate.instant(this.dict.PRESS_AGAIN_TO_EXIT).toString(),
            position: 'top',
            duration: 2000
        });
        toast.present();
    }
}

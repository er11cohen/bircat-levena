import {Component, Inject} from '@angular/core';

import {AlertController, MenuController, Platform, ToastController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {Storage} from '@ionic/storage';
import {Toast} from '@ionic-native/toast/ngx';
import {CodePush, ILocalPackage} from '@ionic-native/code-push/ngx';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {Languages} from './shared/enums';
import {UtilsService} from './services/utils.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {GlobalVariables} from './shared/global/global-variables';
import {TRANSLATIONS_DICTIONARY, TranslationsDictionary} from './services/translations-dictionary';
import {PlatformsService} from './services/platforms.service';

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
            title: 'HALACHOT',
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
        private localNotifications: LocalNotifications,
        private geolocation: Geolocation,
        private storage: Storage,
        private toast: Toast,
        private utilsService: UtilsService,
        private alertController: AlertController,
        private router: Router,
        private location: Location,
        private toastCtrl: ToastController,
        private codePush: CodePush,
        private menu: MenuController,
        private platformsService: PlatformsService,
    ) {
        this.initializeApp();
    }

    async initializeApp() {
        await this.platform.ready();

        // this.statusBar.backgroundColorByHexString('427ebb');
        this.splashScreen.hide();

        this.setLanguage();
        this.backButtonEvent();
        this.utilsService.initialCoordinatesAndCreateBLNotifications();
        //  this.updateCode();
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

    private async updateCode(): Promise<void> {
        this.codePush.sync().subscribe(
            (syncStatus) => console.log('CODE PUSH SUCCESSFUL: ' + syncStatus),
            (err) => console.log('CODE PUSH ERROR: ' + err)
        );

        if (this.platformsService.isIos()) {
            return;
        }

        this.codePush.getCurrentPackage().then(async (update: ILocalPackage) => {
            if (update && update.isFirstRun && update.description) {
                const alert = await this.alertController.create({
                    header: this.translate.instant(this.dict.WHATS_NEW).toString(),
                    message: update.description,
                    buttons: [{text: this.translate.instant(this.dict.GREAT).toString()}]
                });
                await alert.present();
            }
        });
    }
}

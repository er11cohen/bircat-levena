import {Component, Inject, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings.service';
import {Settings} from '../../models/settings';
import {Nusach} from '../../shared/enums';
import {AlertController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {Market} from '@ionic-native/market/ngx';
import {Toast} from '@ionic-native/toast/ngx';
import {TRANSLATIONS_DICTIONARY, TranslationsDictionary} from '../../services/translations-dictionary';
import {GlobalVariables} from '../../shared/global/global-variables';
import {NotificationsService} from '../../services/notifications.service';
import {PlatformsService} from '../../services/platforms.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    public settings: Settings;
    public nusach: typeof Nusach = Nusach;
    public isBlessed = false;
    public showBatteryOptimizations = false;

    constructor(private settingsService: SettingsService,
                public alertController: AlertController,
                @Inject(TRANSLATIONS_DICTIONARY)
                public readonly dict: TranslationsDictionary,
                public readonly translate: TranslateService,
                private readonly socialSharing: SocialSharing,
                private readonly platformsService: PlatformsService,
                private readonly market: Market,
                private readonly toast: Toast,
                private readonly notificationsService: NotificationsService) {
    }

    async ngOnInit() {
        this.settings = this.settingsService.getSettings();
        this.isBlessed = await this.notificationsService.isBLAlreadySaid();

        // @ts-ignore
        const launchDetails = (window.cordova?.plugins as any)?.notification?.local?.launchDetails;
        if (launchDetails?.action === GlobalVariables.ALREADY_BLESSED) {
            this.openNextMonthModal();
        }

        this.checkBatteryOptimizations();
    }

    public shareApp(): void {
        let share = this.translate.instant(this.dict.SHARE_APP).toString() + ' ';
        if (this.platformsService.isAndroid()) {
            share += GlobalVariables.LINK_BL_APP_IN_STORE_ANDROID;
        }

        this.socialSharing.share(share);
    }

    public openStore(): void {
        this.toast.show(this.translate.instant(this.dict.OPEN_STORE).toString(),
            '3000', 'top').subscribe(
            toast => {
                if (toast.event === 'hide') {
                    if (this.platformsService.isAndroid()) {
                        this.market.open('com.eran.bircatlevana');
                    }
                }
            }
        );
    }

    public blessed(): void {
        this.notificationsService.createBLNotifications(true);
        this.openNextMonthModal();
        this.isBlessed = true;
    }

    public async requestBatteryOptimizations(): Promise<void> {
        const alert = await this.alertController.create({
            header: this.translate.instant(this.dict.REMINDER_NOT_SHOWING).toString(),
            message: this.translate.instant(this.dict.BATTERY_OPTIMIZATIONS_EXPLAIN).toString(),
            buttons: [
                {
                    text:  this.translate.instant(this.dict.HAPPILY).toString(),
                    handler: () => {
                        // @ts-ignore
                        cordova.plugins.DozeOptimize.RequestOptimizations();
                    }
                }
            ]
        });

        await alert.present();
    }

    private checkBatteryOptimizations(): void {
        if (!this.platformsService.isAndroid()) {
            return;
        }

        // @ts-ignore
        window.cordova.plugins.DozeOptimize.IsIgnoringBatteryOptimizations((response) => {
            if (response === 'false') {
                this.showBatteryOptimizations = true;
            }
        }, () => {});
    }

    private async openNextMonthModal(): Promise<void> {
            const alert = await this.alertController.create({
                // cssClass: 'my-custom-class',
                header: this.translate.instant(this.dict.BIRCAT_HALEVANA).toString(),
                // subHeader: 'Subtitle',
                message: this.translate.instant(this.dict.WELL_DONE_ON_BLESSING).toString(),
                buttons: [
                    {
                        text:  this.translate.instant(this.dict.MEET_NEXT_MONTH).toString(),
                    }
                ]
            });

            await alert.present();
    }

}

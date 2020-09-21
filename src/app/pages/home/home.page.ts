import {Component, Inject, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings.service';
import {Settings} from '../../models/settings';
import {Nusach} from '../../shared/enums';
import {GlobalVariables} from '../../shared/global/global-variables';
import {AlertController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {Market} from '@ionic-native/market/ngx';
import {Toast} from '@ionic-native/toast/ngx';
import {TRANSLATIONS_DICTIONARY, TranslationsDictionary} from '../../services/translations-dictionary';
import {UtilsService} from '../../services/utils.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    public settings: Settings;
    public nusach: typeof Nusach = Nusach;

    constructor(private settingsService: SettingsService,
                public alertController: AlertController,
                @Inject(TRANSLATIONS_DICTIONARY)
                public readonly dict: TranslationsDictionary,
                public readonly translate: TranslateService,
                private readonly socialSharing: SocialSharing,
                private readonly utilsService: UtilsService,
                private readonly market: Market,
                private readonly toast: Toast) {
    }

    async ngOnInit() {
        this.settings = this.settingsService.getSettings();

        // @ts-ignore
        const launchDetails = (cordova.plugins as any)?.notification?.local?.launchDetails;
        if (launchDetails?.action === GlobalVariables.ALREADY_SAID) {
            const alert = await this.alertController.create({
                // cssClass: 'my-custom-class',
                header: this.translate.instant(this.dict.BIRCAT_HALEVANA).toString(),
                // subHeader: 'Subtitle',
                message: this.translate.instant(this.dict.WELL_DONE_ON_BLESSING).toString(),
                buttons: [
                    // {
                    //     text: 'Cancel',
                    //     handler: () => {
                    //     }
                    // },
                    {
                        text: this.translate.instant(this.dict.MEET_NEXT_MONTH).toString(),
                    }
                ]
            });

            await alert.present();
        }
    }

    public shareApp(): void {
        if (this.utilsService.isAndroid()) {
            this.socialSharing.share(this.translate.instant(this.dict.SHARE_APP).toString());
        }
    }

    public openStore(): void {
        if (this.utilsService.isAndroid()) {
            this.toast.show(this.translate.instant(this.dict.OPEN_STORE).toString(),
                '3000', 'top').subscribe(
                toast => {
                    if (toast.event === 'hide') {
                        this.market.open('com.eran.bircatlevana');
                    }
                }
            );
        }
    }

}

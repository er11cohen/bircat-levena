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
import {UtilsService} from '../../services/utils.service';
import {GlobalVariables} from '../../shared/global/global-variables';

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
    }

    public shareApp(): void {
        let share = this.translate.instant(this.dict.SHARE_APP).toString() + ' ';
        if (this.utilsService.isAndroid()) {
            share += GlobalVariables.LINK_BL_APP_IN_STORE_ANDROID;
        }

        this.socialSharing.share(share);
    }

    public openStore(): void {
            this.toast.show(this.translate.instant(this.dict.OPEN_STORE).toString(),
                '3000', 'top').subscribe(
                toast => {
                    if (toast.event === 'hide') {
                        if (this.utilsService.isAndroid()) {
                            this.market.open('com.eran.bircatlevana');
                        }
                    }
                }
            );
        }

}

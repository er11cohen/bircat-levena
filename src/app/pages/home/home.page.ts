import {Component, Inject, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings.service';
import {Settings} from '../../models/settings';
import {Nusach} from '../../shared/enums';
import {GlobalVariables} from '../../shared/global/global-variables';
import {AlertController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {TRANSLATIONS_DICTIONARY, TranslationsDictionary} from '../../services/translations-dictionary';

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
                public readonly translate: TranslateService) {
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

}

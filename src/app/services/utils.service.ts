import {Inject, Injectable} from '@angular/core';
import {AlertController, Platform} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {SettingsService} from './settings.service';
import {CoordinatesService} from './coordinates.service';
import {NotificationsService} from './notifications.service';
import {TRANSLATIONS_DICTIONARY, TranslationsDictionary} from './translations-dictionary';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    constructor(@Inject(TRANSLATIONS_DICTIONARY)
                public readonly dict: TranslationsDictionary,
                public readonly translate: TranslateService,
                private readonly settingsService: SettingsService,
                private readonly coordinatesService: CoordinatesService,
                private readonly notificationsService: NotificationsService,
                private readonly alertController: AlertController) {
    }

    public async initialData(): Promise<void> {
        // workaround to use after in 'this.translate.instant'
        await Promise.all([
            this.translate.get(this.dict.BL_START_TIME).toPromise(),
            this.settingsService.initialSettings()
            ]);
    }

    public async initialCoordinatesAndCreateBLNotifications(): Promise<void> {
        await this.translate.get(this.dict.BL_START_TIME).toPromise();
        await this.settingsService.initialSettings();
        await this.coordinatesService.initialCoordinates();
        await this.notificationsService.createBLNotifications(false);
    }
}

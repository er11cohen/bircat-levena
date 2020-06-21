import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {SettingsService} from './settings.service';
import {CoordinatesService} from './coordinates.service';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    constructor(private platform: Platform,
                public readonly translate: TranslateService,
                private readonly settingsService: SettingsService,
                private readonly coordinatesService: CoordinatesService) {
    }

    public isMobile() {
        return this.platform.is('cordova');
    }

    public async initialData(): Promise<void> {
        // workaround to use after in 'this.translate.instant'
        await Promise.all([
            this.translate.get('BL_START_TIME').toPromise(),
            this.settingsService.initialSettings(),
            this.coordinatesService.initialCoordinates()
            ]);
    }
}

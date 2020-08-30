import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {SettingsService} from './settings.service';
import {CoordinatesService} from './coordinates.service';
import {NotificationsService} from './notifications.service';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    constructor(private readonly platform: Platform,
                public readonly translate: TranslateService,
                private readonly settingsService: SettingsService,
                private readonly coordinatesService: CoordinatesService,
                private readonly notificationsService: NotificationsService) {
    }

    public isMobile() {
        return this.platform.is('cordova');
    }

    public isAndroid() {
        return this.isMobile() && this.platform.is('android');
    }

    public isIos() {
        return this.isMobile() && this.platform.is('ios');
    }

    public async initialData(): Promise<void> {
        // workaround to use after in 'this.translate.instant'
        await Promise.all([
            this.translate.get('BL_START_TIME').toPromise(),
            this.settingsService.initialSettings()
            ]);
    }

    public async initialCoordinatesAndCreateBLNotifications(): Promise<void> {
        await this.translate.get('BL_START_TIME').toPromise();
        await this.coordinatesService.initialCoordinates();
        await this.notificationsService.createBLNotifications();
    }
}

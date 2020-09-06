import {Inject, Injectable} from '@angular/core';
import {Geolocation, Geoposition} from '@ionic-native/geolocation/ngx';
import {Diagnostic} from '@ionic-native/diagnostic/ngx';
import {GlobalVariables} from '../shared/global/global-variables';
import {Storage} from '@ionic/storage';
import {BLCoordinates} from '../models/coordinates';
import {AlertController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {TRANSLATIONS_DICTIONARY, TranslationsDictionary} from './translations-dictionary';

@Injectable({
    providedIn: 'root'
})
export class CoordinatesService {
    private coordinates: BLCoordinates;
    private resolve: any;

    constructor(
        private readonly geolocation: Geolocation,
        private readonly storage: Storage,
        private readonly diagnostic: Diagnostic,
        private readonly alertController: AlertController,
        private readonly translate: TranslateService,
        @Inject(TRANSLATIONS_DICTIONARY)
        public readonly dict: TranslationsDictionary,
    ) {
    }

    public async initialCoordinates(): Promise<void> {
        if (this.coordinates) {
            return;
        }
        return new Promise<void>(async (resolve, reject) => {
            this.resolve = resolve;
            try {
                const authorized: boolean = await this.diagnostic.isLocationAuthorized();
                if (!authorized) {
                    await this.showPermissionRequestPopup();
                } else {
                    await this.getLocation();
                }
            } catch (e) {}
        });
    }

    public getCoordinates(): BLCoordinates {
        return this.coordinates;
    }

    private async showPermissionRequestPopup(): Promise<void> {
        const alert = await this.alertController.create({
            id: GlobalVariables.PREVENT_CLOSE_ALERT,
            header: this.translate.instant(this.dict.BIRCAT_HALEVANA).toString(),
            backdropDismiss: false,
            message: this.translate.instant(this.dict.LOCATION_ACCESS).toString(),
            buttons: [
                {
                    text: this.translate.instant(this.dict.HAPPILY).toString(),
                    handler: async () => {
                        await this.getLocation();
                    }
                }
            ]
        });
        await alert.present();
    }

    private async getLocation(): Promise<void> {
        try {
            const position: Geoposition = await this.geolocation.getCurrentPosition({timeout: 5000});
            if (position) {
                this.coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                } as BLCoordinates;
                await this.storage.set(GlobalVariables.LAST_COORD, this.coordinates);
                this.resolve();
            }
        } catch (e) {
            this.coordinates = await this.storage.get(GlobalVariables.LAST_COORD);
            if (!this.coordinates) {
                this.coordinates = {
                    latitude: 31.778, // Har Habayis latitude,
                    longitude: 35.2354, // Har Habayis longitude
                } as BLCoordinates;
            }
            this.resolve();
        }
    }
}

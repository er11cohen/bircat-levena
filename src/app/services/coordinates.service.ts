import {Inject, Injectable} from '@angular/core';
import {Geolocation as Geolocation} from '@capacitor/geolocation';
import {GlobalVariables} from '../shared/global/global-variables';
import {Storage} from '@ionic/storage';
import {BLCoordinates} from '../models/coordinates';
import {AlertController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {TRANSLATIONS_DICTIONARY, TranslationsDictionary} from './translations-dictionary';
import {PermissionStatus, Position} from '@capacitor/geolocation/dist/esm/definitions';

@Injectable({
    providedIn: 'root'
})
export class CoordinatesService {
    private readonly TIMEOUT = 5000;
    private coordinates: BLCoordinates;
    private resolve: any;

    constructor(
        private readonly storage: Storage,
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
                const authorized: PermissionStatus =  await Geolocation.checkPermissions();

                if(authorized.coarseLocation !== 'granted') {
                    await this.showPermissionRequestPopup();
                } else {
                    await this.getLocationWithTimeout();
                }
            } catch (e) {
                this.fallbackCoordinates();
            }
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
                        await this.getLocationWithTimeout();
                    }
                }
            ]
        });
        await alert.present();
    }

    private async getLocationWithTimeout(): Promise<void> {
        let timeoutId: number;
        let isTimeout = false;
        // @ts-ignore
        timeoutId = setTimeout(() => {
            isTimeout = true;
            this.fallbackCoordinates();
        }, this.TIMEOUT);

        try {
            const position: Position = await Geolocation.getCurrentPosition({enableHighAccuracy: false, timeout: this.TIMEOUT});
            if (isTimeout) {
                return;
            }
            clearTimeout(timeoutId);

            if (position) {
                this.coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                } as BLCoordinates;
                await this.storage.set(GlobalVariables.LAST_COORD, this.coordinates);
                this.resolve();
            }
        } catch (e) {
            this.fallbackCoordinates();
        }
    }

    private async fallbackCoordinates(): Promise<void> {
        this.coordinates = await this.storage.get(GlobalVariables.LAST_COORD);
        if (!this.coordinates) {
            this.setHarHabayisCoordinates();
        }
        this.resolve();
    }

    private setHarHabayisCoordinates(): void {
        this.coordinates = {
            latitude: 31.778, // Har Habayis latitude,
            longitude: 35.2354, // Har Habayis longitude
        } as BLCoordinates;
    }
}

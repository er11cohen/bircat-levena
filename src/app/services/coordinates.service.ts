import {Injectable} from '@angular/core';
import {Geolocation, Geoposition} from '@ionic-native/geolocation/ngx';
import {GlobalVariables} from '../shared/global/global-variables';
import {Storage} from '@ionic/storage';
import {BLCoordinates} from '../models/coordinates';

@Injectable({
    providedIn: 'root'
})
export class CoordinatesService {
    private coordinates: BLCoordinates;

    constructor(
        private readonly geolocation: Geolocation,
        private readonly storage: Storage,
    ) {
    }

    public async initialCoordinates(): Promise<void> {
        if (this.coordinates) {
            return;
        }

        try {
            const position: Geoposition = await this.geolocation.getCurrentPosition({timeout: 5000});
            if (position) {
                this.coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                } as BLCoordinates;
                await this.storage.set(GlobalVariables.LAST_COORD, this.coordinates);
            }
        } catch (e) {
            this.coordinates = await this.storage.get(GlobalVariables.LAST_COORD);
            if (!this.coordinates) {
                this.coordinates = {
                    latitude: 31.778, // Har Habayis latitude,
                    longitude: 35.2354, // Har Habayis longitude
                } as BLCoordinates;
            }
        }
    }

    public getCoordinates(): BLCoordinates {
        return this.coordinates;
    }
}

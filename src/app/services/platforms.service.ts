import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
@Injectable({
    providedIn: 'root'
})
export class PlatformsService {
    constructor(private readonly platform: Platform) {
    }

    public isMobile(): boolean {
        // return true; //////////////////////////////
         return this.platform.is('cordova');
    }

    public isAndroid(): boolean {
        return this.isMobile() && this.platform.is('android');
    }

    public isIos(): boolean {
        return this.isMobile() && this.platform.is('ios');
    }
}

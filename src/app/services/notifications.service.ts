import {Injectable} from '@angular/core';
import {EndBircatLevana, StartBircatLevana} from '../shared/enums';
import {JewishCalendar} from 'kosher-zmanim';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {TranslateService} from '@ngx-translate/core';
import {ILocalNotification} from '@ionic-native/local-notifications';
import {GlobalVariables} from '../shared/global/global-variables';
import {Storage} from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    private readonly months = 12;

    constructor(
        private localNotifications: LocalNotifications,
        private translate: TranslateService,
        private storage: Storage) {
    }

    public async createBLNotifications(): Promise<any> {
        await this.localNotifications.cancelAll();
        let startBL = await this.storage.get(GlobalVariables.START_BL_METHOD);
        if (!startBL) {
            startBL = StartBircatLevana.SEVEN;
        }

        let endBL = await this.storage.get(GlobalVariables.END_BL_METHOD);
        if (!endBL) {
            endBL = EndBircatLevana.SOF_ZMAN_KIDUSH_LEVANA_15_DAYS;
        }

        let date = new Date();
        for (let i = 0; i < this.months; i++) {
            date = new Date((new Date()).setMonth((new Date()).getMonth() + i));
            const jewishCalendar = new JewishCalendar(date);
            let tchilas;
            if (startBL === StartBircatLevana.SEVEN) {
                tchilas = jewishCalendar.getTchilasZmanKidushLevana7Days();
            } else {
                tchilas = jewishCalendar.getTchilasZmanKidushLevana3Days();
            }


            this.localNotifications.schedule(this.createLocalNotification({
                id: i,
                text: this.translate.instant('BL_START_TIME').toString(),
                trigger: {at: tchilas},
            }));

            let sof;
            if (endBL === EndBircatLevana.SOF_ZMAN_KIDUSH_LEVANA_15_DAYS) {
                sof = jewishCalendar.getSofZmanKidushLevana15Days();
            } else {
                sof = jewishCalendar.getSofZmanKidushLevanaBetweenMoldos();
            }


            this.localNotifications.schedule(this.createLocalNotification({
                id: i,
                text: this.translate.instant('BL_END_TIME').toString(),
                trigger: {at: sof},
            }));
        }

    }

    private createLocalNotification(notification: ILocalNotification) {
        return {
            ...notification,
            sound: null,
            foreground: true,
            priority: 2,
        };
    }
}

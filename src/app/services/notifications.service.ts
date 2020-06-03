import {Injectable} from '@angular/core';
import {EndBircatLevana, StartBircatLevana} from '../shared/enums';
import {JewishCalendar} from 'kosher-zmanim';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {TranslateService} from '@ngx-translate/core';
import {ILocalNotification} from '@ionic-native/local-notifications';
import {Storage} from '@ionic/storage';
import {SettingsService} from './settings.service';
import {Settings} from '../models/settings';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    public settings: Settings;
    private readonly months = 12;

    constructor(
        private localNotifications: LocalNotifications,
        private translate: TranslateService,
        private storage: Storage,
        private settingsService: SettingsService) {
    }

    public async createBLNotifications(): Promise<any> {
        const settings = this.settingsService.getSettings();
        await this.localNotifications.cancelAll();

        let startBL = settings.startBircatLevana;
        if (!startBL) {
            startBL = StartBircatLevana.SEVEN;
        }

        let endBL = settings.endBircatLevana;
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
                trigger: {at: new Date(tchilas)},
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
                trigger: {at: new Date(sof)},
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

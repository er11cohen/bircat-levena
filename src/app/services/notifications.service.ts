import {Injectable} from '@angular/core';
import {EndBircatLevana, StartBircatLevana} from '../shared/enums';
import {getZmanimJson, JewishCalendar, Options} from 'kosher-zmanim';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {TranslateService} from '@ngx-translate/core';
import {Storage} from '@ionic/storage';
import * as moment from 'moment';
import {Moment} from 'moment';

import {SettingsService} from './settings.service';
import {Settings} from '../models/settings';
import {CoordinatesService} from './coordinates.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    public settings: Settings;
    private readonly months = 12;

    constructor(
        private readonly localNotifications: LocalNotifications,
        private readonly translate: TranslateService,
        private readonly storage: Storage,
        private readonly settingsService: SettingsService,
        private readonly coordinatesService: CoordinatesService) {
    }

    public async createBLNotifications(): Promise<any> {
        const settings = this.settingsService.getSettings();
        await this.localNotifications.cancelAll(); ///////////

        let startBL = settings.startBircatLevana;
        if (!startBL) {
            startBL = StartBircatLevana.SEVEN;
        }

        let endBL = settings.endBircatLevana;
        if (!endBL) {
            endBL = EndBircatLevana.SOF_ZMAN_KIDUSH_LEVANA_15_DAYS;
        }

        let date: Date;
        for (let i = 0; i < this.months; i++) {
            date = moment().add(i, 'M').toDate();
            const jewishCalendar = new JewishCalendar(date);
            let tchilas;
            if (startBL === StartBircatLevana.SEVEN) {
                tchilas = jewishCalendar.getTchilasZmanKidushLevana7Days();
            } else {
                tchilas = jewishCalendar.getTchilasZmanKidushLevana3Days();
            }
            //
            // this.localNotifications.schedule(this.createLocalNotification({
            //     id: i,
            //     text: this.translate.instant('BL_START_TIME').toString(),
            //     trigger: {at: new Date(tchilas)},
            // }));


            let sof;
            if (endBL === EndBircatLevana.SOF_ZMAN_KIDUSH_LEVANA_15_DAYS) {
                sof = jewishCalendar.getSofZmanKidushLevana15Days();
            } else {
                sof = jewishCalendar.getSofZmanKidushLevanaBetweenMoldos();
            }


            // this.localNotifications.schedule(this.createLocalNotification({
            //     id: i,
            //     text: this.translate.instant('BL_END_TIME').toString(),
            //     trigger: {at: new Date(sof)},
            // }));

            this.setNotification(moment(new Date(tchilas)), moment(new Date(sof)));/////////////
        }

    }

    // private createLocalNotification(notification: ILocalNotification) {
    //     return {
    //         ...notification,
    //         sound: null,
    //         foreground: true,
    //         priority: 2,
    //     };
    // }

    private setNotification(startMoment: Moment, end: Moment): void {
        // console.log(startMoment); console.log(end);
        let start: Moment;
        for (let i = 0; i < end.diff(startMoment, 'days') + 1; i++) {
            start = startMoment.clone().add(i, 'd');
            // console.log(start.weekday());
            if (start.weekday() === 5) { // friday
                continue;
            }
            // console.log(start.toDate());
            const zmanim: any = this.zmanim4date(start.toDate()).BasicZmanim;
            const tzais: Moment = moment(zmanim.Tzais);

            // if i != 0 show in tzais the notification
            if (start.isBefore(tzais) || i !== 0) {
                start = tzais;
            }

            if (start.isBefore(end)) {
                this.createBlNotification(start.toDate());
            }
        }
    }

    private zmanim4date(day: Date) {
        const options = {
            date: day,
            timeZoneId: 'UTC' + moment().format('Z'),
            latitude: this.coordinatesService.getCoordinates().latitude,
            longitude: this.coordinatesService.getCoordinates().longitude,
            // complexZmanim: false,
        } as Options;
        return getZmanimJson(options);
    }

    private createBlNotification(date: Date): void {
        console.log(date);
        this.localNotifications.schedule({
            // id: i,
            sound: null,
            foreground: true,
            priority: 2,
            text: this.translate.instant('REMINDER_TO_BIRCAT_HALEVANA').toString(),
            trigger: {at: date},
        });
    }
}

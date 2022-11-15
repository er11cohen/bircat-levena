import {Inject, Injectable} from '@angular/core';
import {StartBircatLevana} from '../shared/enums';
import {getZmanimJson, JewishCalendar, Options} from 'kosher-zmanim';
import {TranslateService} from '@ngx-translate/core';
import {Storage} from '@ionic/storage';
import * as moment from 'moment';
import {Moment} from 'moment';
import {
    LocalNotification,
    LocalNotificationActionPerformed,
    LocalNotifications,
    LocalNotificationSchema
} from '@capacitor/local-notifications';
import {PendingResult, ScheduleOptions} from '@capacitor/local-notifications/dist/esm/definitions';

import {SettingsService} from './settings.service';
import {Settings} from '../models/settings';
import {CoordinatesService} from './coordinates.service';
import {GlobalVariables} from '../shared/global/global-variables';
import {TRANSLATIONS_DICTIONARY, TranslationsDictionary} from './translations-dictionary';
import {PlatformsService} from './platforms.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {

    public settings: Settings;
    private notifications: LocalNotificationSchema[];
    private readonly months = 6; //////// 2

    constructor(
        @Inject(TRANSLATIONS_DICTIONARY)
        public readonly dict: TranslationsDictionary,
        private readonly translate: TranslateService,
        private readonly storage: Storage,
        private readonly settingsService: SettingsService,
        private readonly coordinatesService: CoordinatesService,
        private readonly platformsService: PlatformsService) {
    }

    public async createBLNotifications(alreadyBlessed: boolean): Promise<void> {
        this.notifications = [];
        const settings = this.settingsService.getSettings();

        if (this.platformsService.isMobile()) {
            const pendingList: PendingResult = await LocalNotifications.getPending();

            if (pendingList?.notifications?.length > 0) {
                await LocalNotifications.cancel(pendingList);
            }
        }

        let index = 0;

        const jewishSaidCalendar = new JewishCalendar(new Date()) as any;
        const hebrewDate = this.getHebrewSaidFormat(jewishSaidCalendar);
        const blSaidDate: Array<string> | null = await this.storage.get(GlobalVariables.BL_SAID_DATE);
        let blSaidDateArr: Array<string> = blSaidDate ? blSaidDate : [];
        if (blSaidDateArr.includes(hebrewDate)) {
            index = 1;
        } else if (alreadyBlessed) {
            blSaidDateArr.push(hebrewDate);
            // clear old years
            blSaidDateArr = blSaidDateArr.filter((blDate: string) => {
                return blDate.split('_')[0] !== (jewishSaidCalendar.jewishYear - 1).toString();
            });
            this.storage.set(GlobalVariables.BL_SAID_DATE, blSaidDateArr);
            index = 1;
        }


        let startBL = settings.startBircatLevana;
        if (!startBL) {
            startBL = StartBircatLevana.SEVEN;

        }
        // let endBL = settings.endBircatLevana;
        // if (!endBL) {
        //     endBL = EndBircatLevana.SOF_ZMAN_KIDUSH_LEVANA_15_DAYS;
        //
        // }
        let date: Date;
        for (; index < this.months; index++) {
            date = moment().add(index, 'M').toDate();
            const jewishCalendar = new JewishCalendar(date);
            let tchilas;
            if (startBL === StartBircatLevana.SEVEN) {
                tchilas = jewishCalendar.getTchilasZmanKidushLevana7Days();
            } else {
                tchilas = jewishCalendar.getTchilasZmanKidushLevana3Days();
            }

            // let sof;
            // if (endBL === EndBircatLevana.SOF_ZMAN_KIDUSH_LEVANA_15_DAYS) {
            const end15Days = jewishCalendar.getSofZmanKidushLevana15Days();
            //  else {
            const endBetweenMoldos = jewishCalendar.getSofZmanKidushLevanaBetweenMoldos();
            // }

            this.setNotification(moment(new Date(tchilas)), moment(new Date(end15Days)), moment(new Date(endBetweenMoldos)));
        }

        if (this.notifications.length > 0) {
            await LocalNotifications.schedule(
                {
                    notifications: this.notifications,
                    // notifications: [this.notifications[0]],
                } as ScheduleOptions);
        }

    }

    // for the button "blessed" in home.html
    public async isBLAlreadySaid(): Promise<boolean> {
        const jewishSaidCalendar = new JewishCalendar(new Date()) as any;
        const hebrewDate = this.getHebrewSaidFormat(jewishSaidCalendar);
        const blSaidDate: Array<string> | null = await this.storage.get(GlobalVariables.BL_SAID_DATE);
        if (blSaidDate?.includes(hebrewDate)) {
            return true;
        }
        return false;
    }

    private setNotification(startMoment: Moment, end15Days: Moment, endBetweenMoldos: Moment): void {
        let start: Moment;
        for (let i = 0; i < end15Days.diff(startMoment, 'days') + 1; i++) {
            start = startMoment.clone().add(i, 'd');
            if (start.weekday() === 5) { // friday
                continue;
            }

            if (this.isBeforeTishaBeab(start.toDate())) {
                continue;
            }

            const zmanim: any = this.zmanim4date(start.toDate()).BasicZmanim;
            const tzais: Moment = moment(zmanim.Tzais);

            // if i != 0 show in tzais the notification
            if (start.isBefore(tzais) || i !== 0) {
                start = tzais;
            }

            const jewishCalendar = new JewishCalendar(start.toDate()) as any;
            if (jewishCalendar.jewishDay >= 15) {
                // because at night will be 16
                continue;
            }

            // start.add(-9, 'days'); ///////////////////

            if (start.isBefore(new Date())) {
                continue;
            }

            if (start.isBefore(end15Days) && start.isBefore(endBetweenMoldos)) {
                this.createBlNotification(start.toDate(), false);
            } else if (start.isBefore(end15Days) && start.isAfter(endBetweenMoldos)) {
                this.createBlNotification(start.toDate(), true);
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

    private createBlNotification(date: Date, isDispute: boolean): void {
        let text: string;
        if (isDispute) {
            text = this.translate.instant(this.dict.DISPUTE_NIGHT).toString();
        } else {
            text = this.translate.instant(this.dict.TZADIK_ALREADY_BLESSED).toString();
        }

        if (!this.platformsService.isMobile()) {
            return;
        }

        LocalNotifications.registerActionTypes({
            types: [
                {
                    id: GlobalVariables.ALREADY_BLESSED_MAIN_ACTION,
                    actions: [
                        {
                            id: GlobalVariables.ALREADY_BLESSED,
                            title: this.translate.instant(this.dict.ALREADY_BLESSED).toString(),
                        },
                    ]
                }
            ]
        });

        console.log(date);

        this.notifications.push({
            id: new Date().getTime(),
            title: this.translate.instant(this.dict.REMINDER_TO_BIRCAT_HALEVANA).toString(),
            body: text,
            smallIcon: 'ic_launcher',
            vibration: true,
            schedule: {
                at: date,
                // at: new Date(new Date().getTime() + 1000),
                allowWhileIdle: true,
            },
            actionTypeId: GlobalVariables.ALREADY_BLESSED_MAIN_ACTION,
        } as LocalNotificationSchema);
    }

    private isBeforeTishaBeab(date: Date): boolean {
        const jewishCalendar = new JewishCalendar(date) as any;
        if (jewishCalendar.jewishMonth === 5) {
            if (jewishCalendar.jewishDay < 9) {
                return true;
            }

            // Tisha Beab that Applies on Saturday and defer to Sunday
            if (jewishCalendar.jewishDay === 9 && jewishCalendar.dayOfWeek === 7) {
                return true;
            }
        }

        return false;
    }

    private getHebrewSaidFormat(jewishSaidCalendar): string {
        return `${jewishSaidCalendar.jewishYear}_${jewishSaidCalendar.jewishMonth}`;
    }
}

import {Component, Inject, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings.service';
import {Settings} from '../../models/settings';
import {EndBircatLevana, FontSize, Languages, Nusach, StartBircatLevana} from '../../shared/enums';
import {TRANSLATIONS_DICTIONARY, TranslationsDictionary} from '../../services/translations-dictionary';
import {NotificationsService} from '../../services/notifications.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
    public settings: Settings;
    public nusach = Nusach;
    public startBircatLevana = StartBircatLevana;
    public endBircatLevana = EndBircatLevana;
    public languages = Languages;
    public fontSize = FontSize;

    constructor(private settingsService: SettingsService,
                @Inject(TRANSLATIONS_DICTIONARY)
                public readonly dict: TranslationsDictionary,
                private readonly notificationsService: NotificationsService) {
    }

    ngOnInit() {
        this.settings = this.settingsService.getSettings();
    }

    public setSettings(): void {
        const isStartBircatLevanaChanged = this.settings.startBircatLevana
            !== this.settingsService.getSettings().startBircatLevana;
        this.settingsService.setSettings(this.settings);
        if (isStartBircatLevanaChanged) {
            this.notificationsService.createBLNotifications(false);
        }
    }

}

import {Component, Inject, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings.service';
import {Settings} from '../../models/settings';
import {EndBircatLevana, Nusach, StartBircatLevana} from '../../shared/enums';
import {TRANSLATIONS_DICTIONARY, TranslationsDictionary} from '../../services/translations-dictionary';

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

    constructor(private settingsService: SettingsService,
                @Inject(TRANSLATIONS_DICTIONARY)
                public readonly dict: TranslationsDictionary) {
    }

    ngOnInit() {
        this.settings = this.settingsService.getSettings();
    }

    public setSettings(): void {
        this.settingsService.setSettings(this.settings);
    }

}

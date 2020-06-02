import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings.service';
import {Settings} from '../../models/settings';
import {EndBircatLevana, Nusach, StartBircatLevana} from '../../shared/enums';

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

    constructor(private settingsService: SettingsService) {
    }

    ngOnInit() {
        this.settings = this.settingsService.getSettings();
    }

    public setSettings(): void {
        this.settingsService.setSettings(this.settings);
    }

}

import {Injectable} from '@angular/core';
import {Settings} from '../models/settings';
import {GlobalVariables} from '../shared/global/global-variables';
import {Storage} from '@ionic/storage';
import {EndBircatLevana, Nusach, StartBircatLevana} from '../shared/enums';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private settings: Settings;

    constructor(
        private storage: Storage
    ) {
    }

    public async initialSettings(): Promise<void> {
        this.settings = await this.storage.get(GlobalVariables.SETTINGS);
        if (!this.settings) {
            this.settings = {
                nusach: Nusach.EDOT_MIZRACH,
                startBircatLevana: StartBircatLevana.SEVEN,
                endBircatLevana: EndBircatLevana.SOF_ZMAN_KIDUSH_LEVANA_BETWEEN_MOLDOS,
            } as Settings;
        }
    }

    public getSettings(): Settings {
        return this.settings;
    }

    public setSettings(settings: Settings): void {
        this.storage.set(GlobalVariables.SETTINGS, settings);
    }
}

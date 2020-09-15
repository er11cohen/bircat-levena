import {Injectable} from '@angular/core';
import {Settings} from '../models/settings';
import {GlobalVariables} from '../shared/global/global-variables';
import {Storage} from '@ionic/storage';
import {EndBircatLevana, FontSize, Languages, Nusach, StartBircatLevana} from '../shared/enums';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private settings: Settings;

    constructor(
        private readonly storage: Storage,
        public translate: TranslateService,
    ) {
    }

    public async initialSettings(): Promise<void> {
        if (this.settings) {
            return;
        }
        this.settings = await this.storage.get(GlobalVariables.SETTINGS);
        const defaultSettings = {
            nusach: Nusach.EDOT_MIZRACH,
            startBircatLevana: StartBircatLevana.SEVEN,
            endBircatLevana: EndBircatLevana.SOF_ZMAN_KIDUSH_LEVANA_BETWEEN_MOLDOS,
            darkMode: false,
            fontSize: FontSize.M,
        } as Settings;

        if (!this.settings) {
            this.settings = defaultSettings;
        } else {
            this.settings = {
                ...defaultSettings,
                ...this.settings
            };
        }

        this.setAppChanges(this.settings);
    }

    public getSettings(): Settings {
        return this.settings;
    }

    public setSettings(settings: Settings): void {
        this.settings = settings;
        this.storage.set(GlobalVariables.SETTINGS, settings);
        this.setAppChanges(settings);
    }

    private setAppChanges(settings: Settings) {
        if (!settings.language && window.navigator.language.startsWith('en')) {
            this.translate.use(Languages.EN);
        }

        if (settings.language) {
            this.translate.use(settings.language);
        }

        // set dark mode
        document.body.classList.toggle('dark', settings.darkMode);

        document.documentElement.style.fontSize = settings.fontSize;
    }
}


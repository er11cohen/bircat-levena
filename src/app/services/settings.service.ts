import {Injectable} from '@angular/core';
import {Settings} from '../models/settings';
import {GlobalVariables} from '../shared/global/global-variables';
import {Storage} from '@ionic/storage';
import {FontSize, Languages, Nusach, StartBircatLevana} from '../shared/enums';
import {TranslateService} from '@ngx-translate/core';
import {StatusBar} from '@capacitor/status-bar';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private settings: Settings;

    constructor(
        private readonly storage: Storage,
        private readonly translate: TranslateService,
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
            // endBircatLevana: EndBircatLevana.SOF_ZMAN_KIDUSH_LEVANA_15_DAYS,
            darkMode: false,
            fullScreen: false,
            fontSize: FontSize.L,
        } as Settings;

        if (!this.settings) {
            this.settings = defaultSettings;
        } else {
            this.settings = {
                ...defaultSettings,
                ...this.settings
            };
        }

        this.setAppChanges();
    }

    public getSettings(): Settings {
        return {...this.settings};
    }

    public setSettings(settings: Settings): void {
        this.settings = {...settings};
        this.storage.set(GlobalVariables.SETTINGS, this.settings);
        this.setAppChanges();
    }

    private setAppChanges() {
        if (!this.settings.language && window.navigator.language.startsWith('en')) {
            this.translate.use(Languages.EN);
        }

        if (this.settings.language) {
            this.translate.use(this.settings.language);
        }

        // set dark mode
        document.body.classList.toggle('dark', this.settings.darkMode);

        document.documentElement.style.fontSize = this.settings.fontSize;

        if (this.settings.fullScreen) {
            StatusBar.hide();
        } else {
            StatusBar.show();
        }
    }
}


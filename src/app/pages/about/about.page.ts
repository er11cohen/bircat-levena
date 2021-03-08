import {Component, Inject, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Device} from '@ionic-native/device/ngx';
import {AppVersion} from '@ionic-native/app-version/ngx';
import {TRANSLATIONS_DICTIONARY, TranslationsDictionary} from '../../services/translations-dictionary';
import {GlobalVariables} from '../../shared/global/global-variables';
import {PlatformsService} from '../../services/platforms.service';

@Component({
    selector: 'app-about',
    templateUrl: 'about.page.html',
    styleUrls: ['about.page.scss'],
})
export class AboutPage implements OnInit {

    private versionNumber: string;

    constructor(
        @Inject(TRANSLATIONS_DICTIONARY)
        public dict: TranslationsDictionary,
        public translate: TranslateService,
        public platformsService: PlatformsService,
        private  device: Device,
        private appVersion: AppVersion) {

    }

    ngOnInit() {
      this.appVersion.getVersionNumber().then((versionNumber) => {
          this.versionNumber = versionNumber;
      }).catch(() => {});
    }

    get rank(): string {
        let text = this.translate.instant(this.dict.ABOUT.PLEASE_SHARE) +
            ' <a href="0">' +
            this.translate.instant(this.dict.ABOUT.AND_RANK) +
            '</a>.';
        if (this.platformsService.isAndroid()) {
            text = text.replace('0', GlobalVariables.LINK_BL_APP_IN_STORE_ANDROID);
        }
        return text;
    }

    get moreApps(): string {
        let text = '<a href="0">' +
            this.translate.instant(this.dict.ABOUT.MORE_APP) +
            '</a>';
        text = text.replace('0', GlobalVariables.LINK_ALL_APP_IN_STORE_ANDROID);
        return text;
    }

    get contact(): string {
        let text =  this.translate.instant(this.dict.ABOUT.ENCOUNTER_PROBLEM) +
        ` <a href="mailto:eran6cohen@gmail.com?subject=AppName
        &body= (Manufacturer: manufacturer, Model: model , Platform: platform, OSVersion: osVersion , AppVersion: appVersion) "
        target="_top">` +
            this.translate.instant(this.dict.ABOUT.CONTACT_ME) +
        '</a>.';
        text = text.replace('AppName', this.translate.instant(this.dict.BIRCAT_HALEVANA));
        text = text.replace('manufacturer', this.device.manufacturer);
        text = text.replace('model', this.device.model);
        text = text.replace('platform', this.device.platform);
        text = text.replace('osVersion', this.device.version);
        text = text.replace('appVersion', this.versionNumber);
        return text;
    }
}

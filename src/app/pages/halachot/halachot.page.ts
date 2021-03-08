import {AfterViewInit, Component, Inject, OnDestroy, ViewChild} from '@angular/core';
import {TRANSLATIONS_DICTIONARY, TranslationsDictionary} from '../../services/translations-dictionary';
import {TranslateService} from '@ngx-translate/core';
import {AlertController, IonContent} from '@ionic/angular';
import {GlobalVariables} from '../../shared/global/global-variables';
import {Storage} from '@ionic/storage';

@Component({
    selector: 'app-halachot',
    templateUrl: './halachot.page.html',
    styleUrls: ['./halachot.page.scss'],
})
export class HalachotPage implements OnDestroy, AfterViewInit {
    @ViewChild(IonContent) private ionContent: IonContent;
    private scrollInterval;
    private scrollElement: HTMLElement;

    constructor(
        @Inject(TRANSLATIONS_DICTIONARY)
        public readonly dict: TranslationsDictionary,
        public readonly translate: TranslateService,
        private readonly storage: Storage,
        public alertController: AlertController) {
    }

    public async ngAfterViewInit(): Promise<void> {
        const scrollHeight = await this.storage.get(GlobalVariables.SCROLL_HALACHOT);
        if (scrollHeight) {
            this.ionContent.scrollToPoint(0, scrollHeight);
        }

        this.scrollElement = await this.ionContent.getScrollElement();
        this.scrollInterval = setInterval(() => this.saveScroll(), 1000);
    }

    public ngOnDestroy(): void {
        clearInterval(this.scrollInterval);
    }


    public ionViewWillLeave(): void {
        this.saveScroll();
    }

    public async openLearning(): Promise<void> {
        const modal: HTMLIonAlertElement = await this.alertController.create({
            cssClass: 'shortcut-halachot',
            header: this.translate.instant(this.dict.SELECT_LIMUD).toString(),
            inputs: [
                {
                    type: 'radio',
                    label: this.translate.instant(this.dict.AGADA_GATE).toString(),
                    handler: () => {
                        this.scrollToId('agada-gate', modal);
                    }
                },
                {
                    type: 'radio',
                    label: this.translate.instant(this.dict.HALACH_GATE).toString(),
                    handler: () => {
                        this.scrollToId('halcha-gate', modal);
                    }
                },
            ]
        });

        modal.present();
    }

    private saveScroll(): void {
        if (this.scrollElement?.scrollTop) {
            this.storage.set(GlobalVariables.SCROLL_HALACHOT, this.scrollElement.scrollTop);
        }
    }

    private scrollToId(id: string, modal: HTMLIonAlertElement): void {
        const anchor = document.getElementById(id);
        this.ionContent.scrollByPoint(0, anchor.getBoundingClientRect().top - 70, 0);
        modal.dismiss();
    }

}

import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HomePage} from './home.page';
import {SharedModule} from '../../shared/shared.module';
import {EdotMizrachComponent} from './edot-mizrach/edot-mizrach.component';
import {AskenazComponent} from './askenaz/askenaz.component';
import {SfardComponent} from './sfard/sfard.component';
import {TeimanComponent} from './teiman/teiman.component';
import {ChabadComponent} from './chabad/chabad.component';


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomePage
            }
        ]),
    ],
    declarations: [
        HomePage,
        EdotMizrachComponent,
        AskenazComponent,
        SfardComponent,
        TeimanComponent,
        ChabadComponent,
    ]
})
export class HomePageModule {
}

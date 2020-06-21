import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HomePage} from './home.page';
import {SharedModule} from '../../shared/shared.module';
import {EdotMizrachComponent} from './edot-mizrach/edot-mizrach.component';
import {AskenazComponent} from './askenaz/askenaz.component';


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
        AskenazComponent
    ]
})
export class HomePageModule {
}

import {NgModule} from '@angular/core';

import {SkyStatusPage} from './sky-status.page';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: SkyStatusPage
            }
        ]),
        SharedModule
    ],
    declarations: [SkyStatusPage]
})
export class SkyStatusPageModule {
}

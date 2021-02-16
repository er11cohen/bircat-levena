import {NgModule} from '@angular/core';

import {HalachotPage} from './halachot.page';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: HalachotPage
      }
    ]),
  ],
  declarations: [HalachotPage]
})
export class HalachotPageModule {}

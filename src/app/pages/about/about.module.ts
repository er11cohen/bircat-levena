import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AboutPage} from './about.page';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: AboutPage
      }
    ]),
  ],
  declarations: [AboutPage]
})
export class AboutPageModule {}

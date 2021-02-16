import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AboutPage } from './about.page';
import {TranslateModule} from '@ngx-translate/core';
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

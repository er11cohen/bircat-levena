import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AboutPage } from './about.page';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: AboutPage
      }
    ]),
    TranslateModule
  ],
  declarations: [AboutPage]
})
export class AboutPageModule {}

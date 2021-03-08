import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SettingsPage} from './settings.page';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SettingsPage
      }
    ]),
    SharedModule
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {}

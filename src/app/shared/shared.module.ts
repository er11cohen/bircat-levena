import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';




const sharedComponents = [];

const usedModules = [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
];


@NgModule({
    imports: [...usedModules],
    declarations: [...sharedComponents],
    exports: [...usedModules, ...sharedComponents],
})
export class SharedModule { }

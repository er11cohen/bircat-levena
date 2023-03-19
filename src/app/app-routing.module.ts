import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {DataReadyGuard} from './guard/data-ready.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
        canActivate: [DataReadyGuard],
    },
    {
        path: 'about',
        loadChildren: () => import('./pages/about/about.module').then(m => m.AboutPageModule),
        canActivate: [DataReadyGuard],
    },
    {
        path: 'settings',
        loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule),
        canActivate: [DataReadyGuard],
    },
    {
        path: 'halachot',
        loadChildren: () => import('./pages/halachot/halachot.module').then(m => m.HalachotPageModule),
        canActivate: [DataReadyGuard],
    },
    {
        path: 'sky-status',
        loadChildren: () => import('./pages/sky-status/sky-status.module').then(m => m.SkyStatusPageModule),
        canActivate: [DataReadyGuard],
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

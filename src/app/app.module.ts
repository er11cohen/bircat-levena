import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {TranslationsDictionary} from './services/translations-dictionary';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Market } from '@ionic-native/market/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

import { IonicStorageModule } from '@ionic/storage';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Device } from '@ionic-native/device/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { CodePush } from '@ionic-native/code-push/ngx';
import {from, Observable} from 'rxjs';

export class WebpackTranslateLoader implements TranslateLoader {
  public getTranslation(lang: string): Observable<TranslationsDictionary> {
    return from(import(`../assets/i18n/${lang}.ts`).then((mod) => mod.default));
  }
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot({
      driverOrder: ['sqlite', 'localstorage'],
    }),
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader,
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    LocalNotifications,
    Geolocation,
    Device,
    Toast,
    Diagnostic,
    CodePush,
    SocialSharing,
    Market,
    AppVersion,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

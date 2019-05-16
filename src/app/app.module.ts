import {NgModule, APP_INITIALIZER, enableProdMode} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import { NavAsideModule, NavHeaderModule, DefaultModule} from '@global/layout';
import {NgZorroAntdModule, NZ_I18N, zh_CN} from 'ng-zorro-antd';
import {NgZorroIopModule, CookiesService} from 'ng-zorro-iop';
import {AppRoutingModule} from './app-routing.module';
import  { PipeModule } from './pipe/pipe.module';

import {AppComponent} from './app.component';
import {NavHeaderService} from '@global/layout/default/nav-header/nav-header.service';
import {HttpErrorHandler} from '@global/shared/http-error-handler.service';
import {MessageService} from '@global/shared/message.service';
import {AppConfig, initializer} from './app-init';
import {CommonService} from '@global/shared/common/common-service';


// register angular
import { registerLocaleData } from '@angular/common';
// registerLocaleData(LANG.ng, LANG.abbr);
import localeZh from '@angular/common/locales/zh';
import {KeycloakAngularModule} from 'keycloak-angular';
import { httpInterceptorProviders } from './server/index';
import { TranslateStore } from '@ngx-translate/core';

registerLocaleData(localeZh);


enableProdMode();

@NgModule({
  imports: [
    NoopAnimationsModule,
    NavAsideModule,
    NavHeaderModule,
    DefaultModule,
    NgZorroIopModule,
    PipeModule,
    NgZorroAntdModule.forRoot(),
    AppRoutingModule,
    KeycloakAngularModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    TranslateStore,
    HttpErrorHandler,
    MessageService,
    CookiesService,
    AppConfig,
    CommonService,
    httpInterceptorProviders,
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      deps: [AppConfig, CommonService],
      multi: true
    },
    NavHeaderService
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import {KeycloakService} from 'keycloak-iop';
import {Environment} from '../environments/environment';
import {CookiesService} from 'ng-zorro-iop';
import {Injectable, Injector} from '@angular/core';
import {Router} from '@angular/router';
import { CommonService } from '@global/shared';

export function initializer(appConnfig: AppConfig,  commonService: CommonService): Function {
  return () => appConnfig.init(commonService);
}

@Injectable()
export class AppConfig {
  private router: Router;

  constructor(private keycloak: KeycloakService, private cookieService: CookiesService, injector: Injector) {
    setTimeout(() => {
      this.router = injector.get(Router);
    });
  }

  public init(commonService: CommonService) {
    return new Promise(async (resolve, reject) => {
      await commonService.getConfig(Environment.operation).toPromise().then((application) => {
        Environment.application = application;
      });
      try {
        await this.keycloak.init('inspur_token', {
          url: Environment.application.authUrl,
          realm: Environment.application.authRealm,
          clientId: Environment.application.authClientId
        });
        /*  let res = this.keycloak.getUserInfo();
          const username = res.username;
          const email = res.email;
          const isShowEmailBinding = localStorage.getItem('isShowEmailBinding');
          if (!email && !isShowEmailBinding && isShowEmailBinding !== username) {
            window.location.href = window.location.origin + '/console/#/email-binding';
            localStorage.setItem('isShowEmailBinding', username);
          }*/
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}

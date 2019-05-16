import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MyBeianComponent} from './my-beian.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule } from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import { WebsiteMessageComponent } from './website-message/website-message.component';
import { SponsorDetailComponent } from './sponsor-detail/sponsor-detail.component';
import { WebsiteDetailComponent } from './website-message/website-detail/website-detail.component';
import { SponsorChangeComponent } from './sponsor-change/sponsor-change.component';
import { LogoutSponsorComponent } from './logout-sponsor/logout-sponsor.component';
import { CancelAccessComponent } from './cancel-access/cancel-access.component';
import { LogoutWebsiteComponent } from './logout-website/logout-website.component';
import { NewBeianComponent } from './new-beian/new-beian.component';
import { AccessBeianComponent } from './access-beian/access-beian.component';
import { PasswordVerificationComponent } from './password-verification/password-verification.component';
import { ProductVerificationComponent } from './product-verification/product-verification.component';
import { ModifyWebsiteComponent } from './modify-website/modify-website.component';
import { ModifyDetailComponent } from './modify-detail/modify-detail.component';

const routes: Routes = [
  {
    path: '', component: MyBeianComponent
  },
  {
    path: ':id/sponsor/access', component: AccessBeianComponent
  },
  {
    path: ':id/sponsor/access/password', component: PasswordVerificationComponent
  },
  {
    path: ':id/sponsor/access/product', component: ProductVerificationComponent
  },
  {
    path: ':id', component: WebsiteMessageComponent
  },
  {
    path: ':id/sponsor/change', component: SponsorChangeComponent
  },
  {
    path: ':id/sponsor/logout', component: LogoutSponsorComponent
  },
  {
    path: ':id/sponsor', component: SponsorDetailComponent
  },
  {
    path: ':id/website/new', component: NewBeianComponent
  },

  {
    path: ':id/website/logout', component: LogoutWebsiteComponent
  },
  {
    // 4-26 新增要求
    path: ':id/sponsor/detail', component: ModifyDetailComponent
  },
  {
    path: ':id/website/change', component: ModifyWebsiteComponent
  },
  {
    path: ':id/cancel', component: CancelAccessComponent
  },
  {
    path: ':id/detail', component: WebsiteDetailComponent
  }


];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(routes),
    NgZorroAntdModule,
    FormsModule
  ],
  declarations: [
    MyBeianComponent,
    WebsiteMessageComponent,
    SponsorDetailComponent,
    WebsiteDetailComponent,
    SponsorChangeComponent,
    LogoutSponsorComponent,
    CancelAccessComponent,
    LogoutWebsiteComponent,
    NewBeianComponent,
    AccessBeianComponent,
    PasswordVerificationComponent,
    ProductVerificationComponent,
    ModifyWebsiteComponent,
    ModifyDetailComponent
  ]
})
export class MyBeianModule { }

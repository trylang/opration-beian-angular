import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BeianHomeComponent} from "./beian-home.component";
import {RouterModule, Routes} from "@angular/router";
import {FormsModule } from '@angular/forms';
import {NgZorroAntdModule} from "ng-zorro-antd";
import { PipeModule } from '../../pipe/pipe.module';
import { BeianTypeComponent } from './beian-type/beian-type.component';
import { BeianOrganizerComponent } from './beian-organizer/beian-organizer.component';
import { ServiceContentComponent } from './beian-website/service-content/service-content.component';
import { BeianWebsiteComponent } from './beian-website/beian-website.component';
import { BeianUploadComponent } from './beian-upload/beian-upload.component';
import { CurtainMessageComponent } from './curtain-message/curtain-message.component';
import { SecondTrialComponent } from './second-trial/second-trial.component';
import { SmsReminderComponent } from './curtain-message/sms-reminder/sms-reminder.component';
import { NoSmsReminderComponent } from './curtain-message/no-sms-reminder/no-sms-reminder.component';
import {NgxEchartsModule} from 'ngx-echarts';
import { SpecialContentComponent } from './special-content/special-content.component';
import { WebsiteUploadComponent } from './website-upload/website-upload.component';
import { SponsorUploadComponent } from './sponsor-upload/sponsor-upload.component';
import { AuditfailUploadComponent } from './auditfail-upload/auditfail-upload.component';
import { NewWebsiteComponent } from './new-website/new-website.component';

const routes: Routes = [
  {path: '', component: BeianHomeComponent},
  {path: 'type', component: BeianTypeComponent},
  {path: 'type/vertifyICP', component: BeianTypeComponent},
  {path: 'type/organizer', component: BeianOrganizerComponent},
  {path: 'type/organizer/websites', component: BeianWebsiteComponent},
  {path: 'type/organizer/websitesadd', component: BeianWebsiteComponent},
  {path: 'type/organizer/websitelist', component: BeianWebsiteComponent},
  {path: 'type/organizer/websites/:websiteId', component: BeianWebsiteComponent},

  {path: 'type/organizer/websitesreview', component: BeianWebsiteComponent}, // 显示remark
  {path: 'type/organizer/websitelistview', component: BeianWebsiteComponent},
  {path: 'type/organizer/websitesreview/:websiteId', component: BeianWebsiteComponent},

  {path: 'type/organizer/websites/upload/upload', component: BeianUploadComponent},
  {path: 'curtain', component: CurtainMessageComponent},
  // 复审页面
  {path: 'review', component: SecondTrialComponent},
  {path: 'review/message', component: SmsReminderComponent},
  {path: 'review/base', component: NoSmsReminderComponent},
  // 变更为网站的上传页面
  {path: 'website/upload', component: WebsiteUploadComponent},
  // 变更主体的上传页面
  {path: 'sponsor/upload', component: SponsorUploadComponent},
  // 初审失败的上传页面
  {path: 'auditfail/upload', component: AuditfailUploadComponent},
  // 新增网站的上传页面
  {path: 'add/website/upload', component: NewWebsiteComponent},

  {path: 'test', component: SpecialContentComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(routes),
    NgZorroAntdModule,
    FormsModule,
    NgxEchartsModule,
    PipeModule
  ],
  declarations: [
    BeianHomeComponent,
    BeianTypeComponent,
    BeianOrganizerComponent,
    BeianWebsiteComponent,
    ServiceContentComponent,
    BeianUploadComponent,
    CurtainMessageComponent,
    SecondTrialComponent,
    SmsReminderComponent,
    NoSmsReminderComponent,
    SpecialContentComponent,
    WebsiteUploadComponent,
    SponsorUploadComponent,
    AuditfailUploadComponent,
    NewWebsiteComponent
  ]
})
export class BeianHomeModule { }

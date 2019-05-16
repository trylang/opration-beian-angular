import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule } from '@angular/forms';
import {NgZorroAntdModule} from "ng-zorro-antd";

import { PipeModule } from '../../pipe/pipe.module';
import {BeianOrderComponent} from "./beian-order.component";
import { DetailComponent } from './detail/detail.component';
import { OrderstatusComponent } from './orderstatus/orderstatus.component';
import { FirstauditComponent } from './firstaudit/firstaudit.component';
import { SecondauditComponent } from './secondaudit/secondaudit.component';
import { ManageauditComponent } from './manageaudit/manageaudit.component';
import { CommonheaderComponent } from './commonheader/commonheader.component';
import { OrderSponsorComponent } from './order-sponsor/order-sponsor.component';
import { SponsorconfirmComponent } from './sponsorconfirm/sponsorconfirm.component';

const routes: Routes = [
  {path: '', component: BeianOrderComponent},
  {path: 'detail/:orderId', component: DetailComponent},
  {path: 'status/:orderId', component: OrderstatusComponent},
  {path: 'firstaudit', component: FirstauditComponent},
  {path: 'secondaudit', component: SecondauditComponent},
  {path: 'manageaudit', component: ManageauditComponent},
  {path: 'sponsor', component: OrderSponsorComponent},
  {path: 'sponsorconfirm', component: SponsorconfirmComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(routes),
    NgZorroAntdModule,
    PipeModule,
    FormsModule
  ],
  declarations: [
    BeianOrderComponent,
    DetailComponent,
    OrderstatusComponent,
    FirstauditComponent,
    SecondauditComponent,
    ManageauditComponent,
    CommonheaderComponent,
    OrderSponsorComponent,
    SponsorconfirmComponent,
  ]
})
export class BeianOrderModule { }

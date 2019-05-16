import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from '@global/layout';
import {BeianHomeModule} from "./beianEntry/beian-home/beian-home.module";
import {BeianOrderModule} from "./beianMessage/beian-order/beian-order.module";
import {ApplyBeiancodeModule} from "./beianMessage/apply-beiancode/apply-beiancode.module";
import {ManageBeiancodeModule} from "./beianMessage/manage-beiancode/manage-beiancode.module";

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        redirectTo: '/list',
        pathMatch: 'full'
      },
      {
        path: 'app-home',
        loadChildren: './home/home.module#HomeModule',
        data: {
          title: '备案系统',
          breadcrumb: '总览',
          hasBreadcrumb: false
        }
      },
      {
        path: 'list',
        loadChildren: './beianMessage/my-beian/my-beian.module#MyBeianModule',
        data: {
          title: '备案管理',
          breadcrumb: '我的备案',
          hasBreadcrumb: false
        }
      },{
        path: 'order',
        loadChildren: './beianMessage/beian-order/beian-order.module#BeianOrderModule',
        data: {
          title: '备案管理',
          breadcrumb: '备案订单',
          hasBreadcrumb: false
        }
      },{
        path: 'applycode',
        loadChildren: './beianMessage/apply-beiancode/apply-beiancode.module#ApplyBeiancodeModule',
        data: {
          title: '备案管理',
          breadcrumb: '申请备案授权码',
          hasBreadcrumb: false
        }
      },{
        path: 'manageCode',
        loadChildren: './beianMessage/manage-beiancode/manage-beiancode.module#ManageBeiancodeModule',
        data: {
          title: '备案管理',
          breadcrumb: '管理备案授权码',
          hasBreadcrumb: false
        }
      },
      {
        path: 'home',
        loadChildren: './beianEntry/beian-home/beian-home.module#BeianHomeModule',
        data: {
          title: '首页',
          breadcrumb: '我的备案',
          hasBreadcrumb: false
        }
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  // imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload', enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

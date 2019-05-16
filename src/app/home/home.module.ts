import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgZorroIopModule } from 'ng-zorro-iop';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';

const homeRoutes: Routes = [{ path: '', component: HomeComponent }];
@NgModule({
  imports: [
    RouterModule,
    RouterModule.forChild(homeRoutes),
    NgZorroAntdModule,
    NgZorroIopModule,
    CommonModule],
  declarations: [
    HomeComponent
  ],
  exports: [],
  providers: []
})
export class HomeModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ApplyBeiancodeComponent} from "./apply-beiancode.component";
import {RouterModule, Routes} from "@angular/router";
import {FormsModule } from '@angular/forms';
import {NgZorroAntdModule} from "ng-zorro-antd";

const routes: Routes = [
  {path: '', component: ApplyBeiancodeComponent},

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
    ApplyBeiancodeComponent
  ]
})
export class ApplyBeiancodeModule { }

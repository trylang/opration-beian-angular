import { Component, OnInit } from '@angular/core';
import {MyBeianService} from "../my-beian.service";
import {ActivatedRoute} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-logout-website',
  templateUrl: './logout-website.component.html',
  styleUrls: ['./logout-website.component.css']
})
export class LogoutWebsiteComponent implements OnInit {

  constructor(private myBeianService: MyBeianService,
              private message:NzMessageService,
              private router:ActivatedRoute) {
  }

  // 注销网站的参数
  logoutWebsiteParams = {
    websiteId: '',   // 主体id
    password: ''     // 密码
  }
  // 网站id
  public websiteId:string;

  // 注销提示框是否显示
  logoutVisible = false;
  // 模态框提示内容
  warningMessage;
  // 注销成功页面
  logoutSuccess = false;

  // 定时器时长
  timer = 5;
  timer1;

  timerFunction():void {
    const that = this;
    this.timer1 = setInterval(function () {
      that.timer--;
      if (that.timer <= 0) {
        clearInterval(that.timer1);
        // TODO 跳转
      }
    }, 1000);
  }

  // 注销备案验证
  logoutVerification(): void {
    // TODO 这个只是为了能够跳转到下一个页面，稍后去掉
    // this.logoutSuccess = true;
    // 主体的id
    this.logoutWebsiteParams.websiteId = this.websiteId;
    if (this.logoutWebsiteParams.password === ''){
      this.message.warning('ICP备案密码不可为空！')
    } else {
      this.myBeianService.websiteLogout(this.logoutWebsiteParams).subscribe(data => {
        if (data.code === '0'){
          // TODO 直接跳往注销成功页面
          this.logoutSuccess = true;
          this.timerFunction();

        } else {
          this.logoutVisible = true;
          this.warningMessage = data.message;
        }
      })
    }
  }
  // icp的密码验证
  icpPasswordFunction():void {
    if (this.logoutWebsiteParams.password === ''){
      this.message.warning('请输入icp备案密码');
    }
    // TODO 请加入更加详细的校验，目前未知需求
  }

  // 成功提交
  submitOk(): void {
    this.logoutVisible = false;
  }
  // 取消提交
  submitCancel(): void {
    this.logoutVisible = false;
  }

  ngOnInit() {
    // 主体id
    // this.sponsorId = this.router.snapshot.params['id'];
    // console.log(this.sponsorId);

    // 网站id
    this.websiteId = this.router.snapshot.params['id'];
    // console.log(this.websiteId);
  }

}

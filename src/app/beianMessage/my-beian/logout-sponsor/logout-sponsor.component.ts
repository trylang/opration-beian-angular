import {Component, OnInit} from '@angular/core';
import {MyBeianService} from "../my-beian.service";
import {NzMessageService} from "ng-zorro-antd";
import {ActivatedRoute} from "@angular/router";
import {Router} from '@angular/router';

@Component({
  selector: 'app-logout-sponsor',
  templateUrl: './logout-sponsor.component.html',
  styleUrls: ['./logout-sponsor.component.css']
})
export class LogoutSponsorComponent implements OnInit {

  constructor(private myBeianService: MyBeianService,
              private message:NzMessageService,
              private router:ActivatedRoute,
              private route:Router) {
  }

  // 注销主体的参数
  logoutSponsorParams = {
    sponsorId: '',   // 主体id
    password: ''     // 密码
  }
  // 主体id
  public sponsorId:string;

  // 注销提示框是否显示
  logoutVisible = false;
  // 模态框提示内容
  warningMessage;

  // 注销备案验证
  logoutVerification(): void {
    // 主体的id
    this.logoutSponsorParams.sponsorId = this.sponsorId;
    if (this.logoutSponsorParams.password === ''){
      this.message.warning('ICP备案密码不可为空！');
      return;
    }
    this.myBeianService.sponsorLogout(this.logoutSponsorParams).subscribe(data => {
      if (data.code === '0'){
        this.route.navigate([`/list`]);
      } else {
        this.logoutVisible = true;
        this.warningMessage = data.message;
      }
    })

  }
  // icp的密码验证
  icpPasswordFunction():void {
     if (this.logoutSponsorParams.password === ''){
       this.message.warning('请输入icp备案密码');
     }
  }

  // 成功提交
  submitOk(): void {
    this.logoutVisible = false;
  }
  // 取消提交
  submitCancel(): void {
    this.logoutVisible = false;
  }

  // 注销主体的返回上一级
  returnList():void {
    this.route.navigate([`/list`]);
  }

  ngOnInit() {
    // 主体id
    this.sponsorId = this.router.snapshot.params['id'];
  }

}

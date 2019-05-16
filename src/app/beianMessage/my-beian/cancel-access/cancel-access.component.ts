import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MyBeianService} from "../my-beian.service";
import {NzMessageService} from "ng-zorro-antd";
import {Router} from '@angular/router';

@Component({
  selector: 'app-cancel-access',
  templateUrl: './cancel-access.component.html',
  styleUrls: ['./cancel-access.component.css']
})
export class CancelAccessComponent implements OnInit {

  constructor(private router:ActivatedRoute,
              private myBeianService:MyBeianService,
              private message:NzMessageService,
              private route:Router) { }
  // 取消接入是否可见
  cancelVisible = false;

  // 模态框提示内容
  warningMessage;
  // 网站id
  websiteId;
  // 获取手机号的参数
  phoneGetParams = {
    timestamp:'',
    websitedId:''
  }

  // 确定时，回传的参数
  cancelAccessReturnParams = {
    password:'',
    authCode:'',
    phone:'',
    websiteId:''
  }

  code_context = '获取手机验证码';
  // 是否可以点击
  isCanClick = true;
  // 获取验证码的定时器
  timer = 60;
  timer1;

  // 手机验证码参数
  phoneVerificationParams = {
    mobile :'',
    timestamp: ''
  }

  // 成功提交
  submitOk(): void {
    this.cancelVisible = false;
  }
  // 取消提交
  submitCancel(): void {
    this.cancelVisible = false;
  }
  // 确定取消接入
  cancelAccessSubmit():void {
    this.cancelAccessReturnParams.websiteId = this.websiteId;
    this.myBeianService.submitCancelAccessData(this.cancelAccessReturnParams).subscribe(data => {
       if (data.code === '0'){
         this.route.navigate([`/order/`]);
       } else {
         this.message.warning(data.message);
       }
    })
  }
  // 获取手机号
  getPhoneNumber():void {
    this.phoneGetParams.websitedId = this.websiteId;
    this.phoneGetParams.timestamp = new Date().getTime().toString();
    // console.log(this.phoneGetParams,'手机号参数');
    this.myBeianService.phoneNumberFunction(this.phoneGetParams).subscribe(data => {
      if (data.code === '0'){
        this.cancelAccessReturnParams.phone = data.result.telphone;
      } else {
        this.message.warning(data.message);
      }
    })
  }

  sendPhoneVerification():void {
    // 让参数为空
    this.phoneVerificationParams.timestamp = '';
    const that = this;
    if (this.isCanClick) {
      this.phoneVerificationParams.timestamp = new Date().getTime().toString();
      this.phoneVerificationParams.mobile = this.cancelAccessReturnParams.phone;
      this.myBeianService.phoneCode(this.phoneVerificationParams).subscribe(data =>{
        if (data.code === '0'){
          this.message.success(data.message);

        } else {
          this.message.warning(data.message);
        }
      })
      this.isCanClick = false;
      this.timer1 = setInterval(function () {
        that.timer--;
        if (that.timer <= 0) {
          that.code_context = '获取手机验证码';
          that.isCanClick = true;
          that.timer = 60;
          clearInterval(that.timer1);
        } else {
          that.code_context = that.timer + 's 后可重新获取验证码';
        }
      }, 1000);
    }

  }

  ngOnInit() {
    // 网站的id
    this.websiteId = this.router.snapshot.params['id'];
    // 获取手机号
    this.getPhoneNumber();

  }

}

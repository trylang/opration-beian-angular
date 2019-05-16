import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MyBeianService} from "../my-beian.service";
import {NzMessageService} from "ng-zorro-antd";
import {Router} from "@angular/router";
import {BeianVerificationService} from '../../common-serve/beian-verification.service';

@Component({
  selector: 'app-modify-website',
  templateUrl: './modify-website.component.html',
  styleUrls: ['./modify-website.component.css']
})
export class ModifyWebsiteComponent implements OnInit {

  constructor(private activedRoute:ActivatedRoute,
              private myBeianService:MyBeianService,
              private message:NzMessageService,
              private route:Router,
              private beianVerificationService: BeianVerificationService) { }
  // 服务内容处理后的数组
  serviceArr:any;
  // 网站id
  websiteId;

  // 获取网站详情的参数
  getWebsiteDetailParams = {
    timestamp:'',
    websiteId:'',
  }

  // 处理服务内容未被修改
  serviceReturnArr = [];
  // 服务内容参数
  serviceParams = {
    code:'',
    name:''
  }
  mark = '0';
  // 订单的id
  orderId;

  // 网站回传参数
  websitesReturnParams = {
    id:'',     //	网站id
    sponsorId:'',     //	主体id
    name:'',     //	网站名称
    homeUrl:'',     //	网站首页url
    serviceContentList:[], // 网站服务内容
    languageCode:'',     //	网站语言code
    languageName:'',     //	网站语言名称
    specialApprovalCode:'',     //	前置或专项审批内容code
    specialApprovalName:'',     //	前置或专项审批内容
    note:'',     //	备注
    headerName:'',     //	负责人
    headerType:'',     //	负责人证件类型
    headerTypeName:'',     //	负责人证件类型名字
    headerNum:'',     //	负责人证件号码
    telephone1:'',     //	联系电话1
    telephone2:'',     //	联系电话2
    emergencyPhone:'',     //	应急电话
    email:'',     //	电子邮件地址
    icpRegistered:'',     //	ICP主体备案号
    icpRegisteredStatus:'',     //	ICP网站备案状态
    createdUserId:'',     //	创建人
    updatedUserId:'',     //	最后修改人
    enable:'',     //	1有效 0 无效
    instanceIp:'',     //		网站ip地址
    domainList:[],     //		已经验证的域名全部回传
    validateCode:''

  }
  // 网站展示信息
  websiteData = {
    websiteName:'',  //	网站名称
    homeUrl:'',  //	网站首页url
    headerName:'',  //	负责人
    headerType:'',  //	负责人证件类型
    headerTypeName:'',  //	负责人证件类型名字
    serviceContentCode:'',  //	网站服务内容code
    serviceContentName:'',  //	网站服务内容名称
    languageCode:'',  //	网站语言code
    languageName:'',  //	网站语言名称
    specialApprovalCode:'',  //	前置或专项审批内容code
    specialApprovalName:'',  //	前置或专项审批内容
    note:'',  //	备注
    headerNum:'',  //	负责人证件号码
    telephone1:'',  //	联系电话1
    telephone2:'',  //	联系电话2
    emergencyPhone:'',  //	应急电话
    email:'',  //	电子邮件地址
    instanceIp:'',  //	网站ip地址
  }

  // 域名列表
  domainList= [];
  // 页面下拉框集合
  optionObj = {
    languageList: [],
    serviceContentList: [],
    specialApprovalList: [],
    certificationList:[]
  };

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
  // 路径数据
  urlData;

  // 多选框发生改变
  changeHandle(event) {
    this.mark = '1';
    this.websitesReturnParams.serviceContentList = event;
  }

  deleteDomainItem(index) {
    this.domainList.splice(index, 1);
  }
  // 新增的域名为第一次
  addDomainItem(domain) {
    this.domainList.push({
      id: '',
      isFirst: 1,
      domain
    });
  }

  // 负责人证件类型
  sponsorTypeParams;
  // 主体id
  sponsorId;

  // 已验证的域名列表
  param = {
    sponsorId: '',
    websiteId: '',
    timestamp:''
  }

  // 已经验证的域名列表
  getDomains(): void {
    this.param.sponsorId = this.sponsorId;
    this.param.websiteId = this.websiteId;
    this.param.timestamp = new Date().getTime().toString();
    this.myBeianService.getDomains(this.param).subscribe(data => {
      if (data.code == 0) {
        this.domainList = data.result;
      }
    });
  }

  // 获取下拉框列表
  getApprovalsTypes(): void {
    this.myBeianService.getApprovalsTypes().subscribe(data => {
      if (data.code == 0) {
        this.optionObj = Object.assign(this.optionObj, data.result);
        this.optionObj.languageList = data.result.languageList;
        this.optionObj.specialApprovalList = data.result.specialApprovalList;
        let serviceContentList = data.result.serviceContentList;
        if (serviceContentList) {
          this.optionObj.serviceContentList = serviceContentList.map (item => {
            return {
              ...item,
              checked: false
            };
          });
        }
      }
    })
  }
  // 负责人的证件类型
  getCertificates():void {
    // 负责人类型时间戳
    this.sponsorTypeParams = new Date().getTime().toString();
    this.myBeianService.principalCertificateType(this.sponsorTypeParams).subscribe(data => {
      if (data.code === '0'){
        this.optionObj.certificationList = data.result;
      } else {
        this.message.warning(data.message);
      }
    });
  }

  // 发送手机验证码
  sendPhoneVerification():void {
    // 让参数为空
    this.phoneVerificationParams.timestamp = '';
    const that = this;
    if (this.isCanClick) {
      this.phoneVerificationParams.timestamp = new Date().getTime().toString();
      this.phoneVerificationParams.mobile = this.websiteData.telephone1;
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

  // 获取的网站数据
  getWebsiteData():void {
    this.getWebsiteDetailParams.timestamp = '';
    this.getWebsiteDetailParams.websiteId = this.websiteId;
    this.getWebsiteDetailParams.timestamp = new Date().getTime().toString();
    // 变更网站的基础数据
    this.myBeianService.websiteChangeDetail(this.getWebsiteDetailParams).subscribe(data =>{
      if (data.code === '0'){
        // 所有网站的数据
        this.websiteData = data.result.websiteEntity;
        // 字符串转为字符串数组
        if (this.websiteData.serviceContentCode) {
          this.optionObj.serviceContentList = this.optionObj.serviceContentList.map(item => {
            // console.log(this.websiteData.serviceContentCode,'网站服务内容');
            if (this.websiteData.serviceContentCode.indexOf(item.code) >= 0) {
              this.serviceParams.code = item.code;
              this.serviceParams.name = item.name;
              this.serviceReturnArr.push(JSON.parse(JSON.stringify(this.serviceParams)));
              item.checked = true;
            } else {
              item.checked = false;
            }
            return item;
          });
        }



        // 某个网站的域名
        // this.domainList = data.result.websiteEntity.domainList;
      } else {
        this.message.warning(data.message);
      }
    });
  }




  // 网站修改的下一步
  modifyWebsiteNext(): void {
    if (this.websiteData.websiteName === '') {
      this.message.warning('网站名称不能为空!');
      return;
    }
    if (this.websiteData.homeUrl === '') {
      this.message.warning('网站首页URL不能为空!');
      return;
    }
    if (this.websiteData.instanceIp === '') {
      this.message.warning('网站IP地址不能为空!');
      return;
    }
    if (this.websiteData.headerName === '') {
      this.message.warning('负责人姓名不能为空!');
      return;
    }
    if (this.websiteData.headerNum === '') {
      this.message.warning('负责人证件号码不能为空！');
      return;
    }
    if (this.websiteData.telephone1 === '') {
      this.message.warning('联系方式1（手机）不能为空!');
      return;
    }
    this.beianVerificationService.phoneCheck(this.websiteData.telephone1);
    if (this.beianVerificationService.phoneCheckResult() === 1) {
      this.message.warning('请填写正确的手机号格式！');
      return;
    }

    if (this.websiteData.emergencyPhone === '') {
      this.message.warning('应急联系方式（手机号）不能为空!');
      return;
    }
    this.beianVerificationService.phoneCheck(this.websiteData.emergencyPhone);
    if (this.beianVerificationService.phoneCheckResult() === 1) {
      this.message.warning('请填写正确的手机号格式！');
      return;
    }

    if (this.websiteData.email === '') {
      this.message.warning('电子邮件地址不能为空!');
      return;
    }
    this.beianVerificationService.emailCheck(this.websiteData.email);
    if (this.beianVerificationService.emailCheckResult() === 1) {
      this.message.warning('请输入正确格式的邮箱！');
      return;
    }

    if (this.websitesReturnParams.validateCode === '') {
      this.message.warning('验证码不能为空!');
      return;
    }
    if (this.websiteData.emergencyPhone == this.websiteData.telephone1) {
      this.message.warning('应急联系方式（手机号）和联系方式1不可相同!');
      return;
    }

    // 未修改
    if (this.mark === '0') {
      this.websitesReturnParams.serviceContentList = this.serviceReturnArr;
    }

    this.websitesReturnParams.id = this.websiteId;
    this.websitesReturnParams.name = this.websiteData.websiteName;
    this.websitesReturnParams.homeUrl = this.websiteData.homeUrl;
    // this.websitesReturnParams.serviceContentList = this.websitesReturnParams.serviceContentList;
    this.websitesReturnParams.note = this.websiteData.note;
    this.websitesReturnParams.headerName = this.websiteData.headerName;
    this.websitesReturnParams.headerNum = this.websiteData.headerNum;
    this.websitesReturnParams.telephone1 = this.websiteData.telephone1;
    this.websitesReturnParams.telephone2 = this.websiteData.telephone2;
    this.websitesReturnParams.emergencyPhone = this.websiteData.emergencyPhone;
    this.websitesReturnParams.email = this.websiteData.email;
    this.websitesReturnParams.instanceIp = this.websiteData.instanceIp;
    this.websitesReturnParams.languageCode = this.websiteData.languageCode;
    this.optionObj.languageList.forEach(item =>{
      if (item.code === this.websiteData.languageCode) {
        this.websitesReturnParams.languageName = item.name;
      }
    })
    this.websitesReturnParams.specialApprovalCode = this.websiteData.specialApprovalCode;
    this.optionObj.specialApprovalList.forEach(item =>{
      if (this.websiteData.specialApprovalCode === item.code){
        this.websitesReturnParams.specialApprovalName = item.name;
      }
    })
    this.websitesReturnParams.headerType = this.websiteData.headerType;
    this.optionObj.certificationList.forEach(item =>{
      if (item.code === this.websiteData.headerType) {
        this.websitesReturnParams.headerTypeName = item.name;
      }
    })
    this.websitesReturnParams.sponsorId = this.urlData.sponsorId;

    //		已经验证的域名全部回传
    this.websitesReturnParams.domainList = this.domainList;
    // 提交变更网站信息
    this.myBeianService.myBeianWebsiteChange(this.websitesReturnParams).subscribe(data => {
      if (data.code === '0') {
        this.orderId = data.requestId;
        this.route.navigate([`/home/website/upload`], {queryParams: {websiteId: this.websiteId , orderId: this.orderId, sponsorId: this.sponsorId ,type:9}});
      } else {
        this.message.warning(data.message);
      }
    });

  }

  ngOnInit() {
    // 网站id
    this.websiteId = this.activedRoute.snapshot.params['id'];
    this.sponsorId = this.activedRoute.snapshot.queryParams.sponsorId;
    // 路径数据
    this.urlData = this.activedRoute.snapshot.queryParams;
    // 已验证的域名列表
    this.getDomains();
    // 负责人证件类型
    this.getCertificates();
    // 网站页面下拉列表
    this.getApprovalsTypes();
    // 获取网站数据(我的备案-修改网站)
    this.getWebsiteData();


  }

}

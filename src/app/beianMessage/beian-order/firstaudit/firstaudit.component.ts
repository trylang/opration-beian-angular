import { Component, OnInit } from '@angular/core';
import { NzMessageService } from "ng-zorro-antd";
import { Router, ActivatedRoute } from '@angular/router';

import { BeianOrderService } from '../beian-order.service';
import {BeianVerificationService} from "../../../beianEntry/beian-home/common-serve/beian-verification.service";

@Component({
  selector: 'app-firstaudit',
  templateUrl: './firstaudit.component.html',
  styleUrls: ['./firstaudit.component.scss']
})
export class FirstauditComponent implements OnInit {

  // constructor(
  //   private beianOrderService: BeianOrderService,
  //   private message: NzMessageService,
  //   private router: Router,
  //   private route: ActivatedRoute,
  // ) {}
  //
  // ngOnInit() {
  //   let orderId = this.route.snapshot.paramMap.get('orderId');
  //   // this.param = Object.assign(this.param, this.route.snapshot.queryParams);
  // }

  constructor(private beianOrderService: BeianOrderService,
              private message:NzMessageService,
              private router:ActivatedRoute,
              private beianVerificationService:BeianVerificationService,
              private route:Router
  ) { }

  // 主体详情参数
  sponsorDetailParams = {
    orderId:'',
    timestamp:''
  }
  // 主体id
  // sponsorId;
  // 订单id
  orderId;

  // 获取后台的城市数据
  citysData = {
    provinceList: [],
    cityList: [],
    contryList: []
  };

  chengshiData = {
    city: [],
    country: []
  };

  // 获得主体详情的数据
  sponsorDetailData = {
    provincId:'', //	主办单位所属区域
    provinceName:'', //	主办单位所属区域名称
    cityId:'', //	主办单位市辖区
    cityName:'', //	主办单位市辖区名称
    countryId:'', //	所属县(区)
    countryName:'', //	所属区名称
    typeId:'', //	主办单位性质id
    typeName:'', //	主办单位性质名称
    certificationId:'', //	主办单位证件类型id
    certificationName:'', //	主办单位证件类型名称
    certificationNum:'', //	主办单位证件号码
    sponsorName:'', //	主办单位或主办人名称
    productCode:'', //	产品类型
    sponsorAddress:'', //	主办单位证件住所
    sponsorMailAddress:'', //	主办单位通讯地址
    sponsorGovern:'', //	投资人或主管单位
    headerName:'', //	负责人
    headerType:'', //负责人证件类型
    headerTypeName:'', //	负责人证件类型名字
    headerNum:'', //	负责人证件号码
    telephone1:'', //	联系电话1
    telephone2:'', //	联系电话2
    emergency_phone:'', //	应急电话
    email:'', //	电子邮件地址
  }
  // 负责人证件类型
  principalCertificate;
  // 主办单位证件类型
  certificationList;
  // 主办单位性质
  cardTypelist;

  // 手机号验证码
  phoneVerificationParams = {
    mobile:'',
    timestamp:''
  }
  // 验证码
  verificationCode;

  // 上传主体信息参数
  uploadSponsorParams = {
    orderId:'',  //	订单id
    typeId:'',  //	主办单位性质id
    typeName:'',  //	主办单位性质名称
    certificationId:'',  //	主办单位证件类型id
    certificationName:'',  //	主办单位证件类型名称
    certificationNum:'',  //	主办单位证件号码
    provincId:'',  //	主办单位所属区域
    provinceName:'',  //	主办单位所属区域名称
    cityId:'',  //	主办单位市辖区
    cityName:'',  //	主办单位市辖区名称
    countryId:'',  //	所属县(区)
    countryName:'',  //	所属区名称
    sponsorName:'',  //	主办单位或主办人名称
    sponsorAddress:'',  //	主办单位证件住所
    sponsorMailAddress:'',  //	主办单位通讯地址
    sponsorGovern:'',  //	投资人或主管单位
    headerName:'',  //	负责人
    headerType:'',  //	负责人证件类型
    headerTypeName:'',  //	负责人证件类型名字
    headerNum:'',  //	负责人证件号码
    telephone1:'',  //	联系电话1
    telephone2:'',  //	联系电话2
    emergencyPhone:'',  //	应急电话
    email:'',  //	电子邮件地址
    validateCode:'',  //	验证码
    timestamp:'',  //		获取手机验证码时所用的时间戳
  }

  code_context = '获取手机验证码';
  // 是否可以点击
  isCanClick = true;
  // 获取验证码的定时器
  timer = 60;
  timer1;


  // 获取主体详情信息
  getSponsorDetail():void {
    this.sponsorDetailParams.orderId = this.orderId;
    this.sponsorDetailParams.timestamp = new Date().getTime().toString();
    this.beianOrderService.sponsorDetail(this.sponsorDetailParams).subscribe(data =>{
      if (data.code === '0'){
        // 获取返回数据
        this.sponsorDetailData = data.result;

      } else {
        this.message.warning(data.message);
      }
    })
  }

  selectCity(code) {
    this.sponsorDetailData.cityId = '';
    this.sponsorDetailData.countryId = '';
    this.chengshiData.city = this.citysData.cityList.filter(item => item.parentCode == code);
  };

  selectCountry(code) {
    this.sponsorDetailData.countryId = '';
    this.chengshiData.country = this.citysData.contryList.filter(item => item.parentCode == code);
  };

  // 获取省市县
  getCitys(): void {
    this.beianOrderService.getCitys().subscribe(data => {
      if (data.code == 0) {
        this.citysData = data.result;
      }
    })
  }

  // 负责人证件类型
  principalCertificateType(): void {
    const param = new Date().getTime().toString();
    this.beianOrderService.principalCertificateType(param).subscribe(data => {
      if (data.code == 0) {
        this.principalCertificate = data.result;
      }
    })
  }

  //获取主办单位性质下拉列表， 证件类型下拉列表
  showCompanyType(): void {
    this.beianOrderService.getWebsiteBeianType().subscribe(data => {
      if (data.code === "0") {
        this.certificationList = data.result.certificationList;
        this.cardTypelist = data.result.list;

      }
    });

  }
  // 手机验证码
  sendPhoneVerification():void {
    // 让参数为空
    this.phoneVerificationParams.timestamp = '';
    this.phoneVerificationParams.timestamp = new Date().getTime().toString();
    this.phoneVerificationParams.mobile = this.sponsorDetailData.telephone1;
    // this.myBeianService.phoneCode(this.phoneVerificationParams).subscribe(data =>{
    //   if (data.code ==='0'){
    //     this.message.success('验证码已发送！');
    //   } else {
    //     this.message.warning(data.message);
    //   }
    // })
    // TODO 还需要加手机号验证
    // TODO 其实验证发送的应该为旧版手机号，而不是绑定手机号
    if (parseInt(this.sponsorDetailData.telephone1) === 0){
      this.message.warning('手机号不能为空！');
    } else {
      const that = this;
      if (this.isCanClick) {
        // this.codeParams.mobile = this.phoneData;
        // this.codeParams.timestamp = new Date().getTime().toString();
        this.phoneVerificationParams.timestamp = new Date().getTime().toString();
        this.phoneVerificationParams.mobile = this.sponsorDetailData.telephone1;
        this.beianOrderService.phoneCode(this.phoneVerificationParams).subscribe(data =>{
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
            that.timer = 30;
            clearInterval(that.timer1);
          } else {
            that.code_context = that.timer + 's 后可重新获取验证码';
          }
        }, 1000);
      }
    }

  }
  // 验证手机号验证码是否合格
  verificationCodeFunction():void {

    if (this.verificationCode === '') {
      this.message.warning('验证码不能为空！');
    }
    console.log(this.verificationCode);
    // 长度待处理
    // if (this.verificationCode.length !== '6'){
    //   this.message.warning('');
    // }
    // TODO 是否加入数字校验

  }
  // 点击下一步时，提交
  nextSubmitFunction():void {
    this.beianOrderService.changeSponsorData(this.uploadSponsorParams).subscribe(data => {
      if (data.code === '0'){
        // 之所以标记0，是因为需要根据订单的id来请求数据
        this.route.navigate([`/home/type/organizer/websites/upload/upload`], {queryParams: {orderId: this.orderId,mark:0}});
      } else {
        this.message.warning(data.message);
      }
    })
  }

  // 数据赋值
  dataAssignmentFunction():void {
    // TODO  这个地方好像没有接口
    this.uploadSponsorParams.orderId = this.orderId;
    this.uploadSponsorParams.typeId = this.sponsorDetailData.typeId;
    this.cardTypelist.forEach(item =>{
      if (item.code === this.sponsorDetailData.typeId){
        this.uploadSponsorParams.typeName = item.name;
      }
    })
    this.uploadSponsorParams.certificationId = this.sponsorDetailData.certificationId;
    this.certificationList.forEach(item =>{
      if (item.code === this.sponsorDetailData.certificationId) {
        this.uploadSponsorParams.certificationName = item.name;
      }
    })
    this.uploadSponsorParams.certificationNum = this.sponsorDetailData.certificationNum;
    this.uploadSponsorParams.provincId = this.sponsorDetailData.provincId;
    this.citysData.provinceList.forEach(item =>{
      if (item.code === this.sponsorDetailData.provincId ) {
        this.uploadSponsorParams.provinceName = item.name;
      }
    })
    this.uploadSponsorParams.cityId = this.sponsorDetailData.cityId;
    this.chengshiData.city.forEach(item =>{
      if (item.code === this.sponsorDetailData.cityId) {
        this.uploadSponsorParams.cityName = item.name;
      }
    })
    this.uploadSponsorParams.countryId = this.sponsorDetailData.countryId;
    this.chengshiData.country.forEach(item =>{
      if (item.code === this.sponsorDetailData.countryId) {
        this.uploadSponsorParams.countryName = item.name;
      }
    })

    this.uploadSponsorParams.sponsorName = this.sponsorDetailData.sponsorName;
    this.uploadSponsorParams.sponsorAddress = this.sponsorDetailData.sponsorAddress;
    this.uploadSponsorParams.sponsorMailAddress = this.sponsorDetailData.sponsorMailAddress;
    this.uploadSponsorParams.sponsorGovern = this.sponsorDetailData.sponsorGovern;
    this.uploadSponsorParams.headerName = this.sponsorDetailData.headerName;

    this.uploadSponsorParams.headerType = this.sponsorDetailData.headerType;
    this.principalCertificate.forEach(item => {
      if (item.code === this.sponsorDetailData.headerType) {
        this.uploadSponsorParams.headerTypeName = item.name;
      }
    })
    this.uploadSponsorParams.headerNum = this.sponsorDetailData.headerNum;
    this.uploadSponsorParams.telephone1 = this.sponsorDetailData.telephone1;
    this.uploadSponsorParams.telephone2 = this.sponsorDetailData.telephone2;
    this.uploadSponsorParams.emergencyPhone = this.sponsorDetailData.emergency_phone;
    this.uploadSponsorParams.email = this.sponsorDetailData.email;
    this.uploadSponsorParams.validateCode = this.verificationCode;
    this.uploadSponsorParams.timestamp = this.phoneVerificationParams.timestamp;
    this.nextSubmitFunction();
  }

  // 提交变更主体的数据
  submitSponsorData():void {
    // this.route.navigate([`/home/type/organizer/websites/upload/upload`], {queryParams: {sponsorId: this.sponsorId , mark:1}});
    // // TODO 验证数据格式
    // let emailReg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    // let phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    // if(this.phoneVerificationParams.timestamp === ''){
    //   this.message.warning('请获取手机验证码！');
    // }else if(this.sponsorDetailData.typeId === ''
    //   ||this.sponsorDetailData.certificationId === ''
    //   ||this.sponsorDetailData.provincId === ''
    //   ||this.sponsorDetailData.cityId === ''
    //   ||this.sponsorDetailData.countryId === ''
    //   ||this.sponsorDetailData.headerType === ''){
    //   this.message.warning('请检查相应的下拉选择框是否进行选择！');
    // }else if(this.sponsorDetailData.certificationNum === ''
    //   ||this.sponsorDetailData.sponsorName === ''
    //   ||this.sponsorDetailData.sponsorAddress === ''
    //   ||this.sponsorDetailData.sponsorMailAddress === ''
    //   ||this.sponsorDetailData.sponsorGovern === ''
    //   ||this.sponsorDetailData.headerName === ''
    //   ||this.sponsorDetailData.headerNum === ''
    //   ||this.sponsorDetailData.telphone1 === ''
    //   ||this.sponsorDetailData.emergency_phone === ''
    //   ||this.sponsorDetailData.email === ''
    //   ||!phoneReg.test(this.sponsorDetailData.telphone1)
    //   ||!phoneReg.test(this.sponsorDetailData.emergency_phone)
    //   ||!emailReg.test(this.sponsorDetailData.email)){
    //   this.message.warning('请输入符合要求的数据！');
    // } else {
    //   this.dataAssignmentFunction();
    // }
    if (this.sponsorDetailData.certificationNum === ''){
      this.message.warning('主办单位证件号码不可修改为空！');
      return;
    }
    if (this.sponsorDetailData.sponsorName === ''){
      this.message.warning('主办单位或者主办人不可修改为空！');
      return;
    }
    if (this.sponsorDetailData.sponsorAddress === ''){
      this.message.warning('主办单位证件住所不可修改为空！');
      return;
    }
    if (this.sponsorDetailData.sponsorGovern === ''){
      this.message.warning('投资人或主办单位不可修改为空！');
      return;
    }
    if (this.sponsorDetailData.headerName === ''){
      this.message.warning('负责人姓名不可修改为空！');
      return;
    }
    if (this.sponsorDetailData.headerNum === ''){
      this.message.warning('负责人证件号码不可修改为空！');
      return;
    }
    if (this.sponsorDetailData.telephone1 === ''){
      this.message.warning('联系方式1（手机）不可修改为空！');
      return;
    }

    this.beianVerificationService.phoneCheck(this.sponsorDetailData.telephone1);
    if (this.beianVerificationService.phoneCheckResult() === 1) {
      this.message.create('warning', '请输入正确格式的手机号!');
      return;
    }

    if (this.sponsorDetailData.emergency_phone === ''){
      this.message.warning('应急联系方式（手机号）不可修改为空！');
      return;
    }
    this.beianVerificationService.phoneCheck(this.sponsorDetailData.emergency_phone);
    if (this.beianVerificationService.phoneCheckResult() === 1) {
      this.message.create('warning', '请输入正确格式的手机号!');
      return;
    }

    if (this.sponsorDetailData.email === ''){
      this.message.warning('电子邮件地址不可修改为空！');
      return;
    }
    this.beianVerificationService.emailCheck(this.sponsorDetailData.email);
    if (this.beianVerificationService.emailCheckResult() === 1) {
      this.message.create('warning', '请输入正确的邮件地址!');
      return;
    }

    this.dataAssignmentFunction();

  }
  // 主办单位证件号码
  mainPlaceNumberVerification():void {
    if (this.sponsorDetailData.certificationNum === ''){
      this.message.warning('主办单位证件号码不可修改为空！');
    }
  }
  // 主办单位或者主办人
  organiserVerification():void {
    if (this.sponsorDetailData.sponsorName === ''){
      this.message.warning('主办单位或者主办人不可修改为空！');
    }
  }
  // 主办单位证件住所
  cardAddressVerification():void {
    if (this.sponsorDetailData.sponsorAddress === ''){
      this.message.warning('主办单位证件住所不可修改为空！');
    }
  }
  // 主办单位通讯地址
  sponsorMailAddressVerification():void {
    console.log(this.sponsorDetailData.sponsorMailAddress);
    if (this.sponsorDetailData.sponsorMailAddress === ''){
      this.message.warning('主办单位证件住所不可修改为空！');
    }
  }
  // 投资人或主办单位：
  sponsorGovernVerification():void {
    if (this.sponsorDetailData.sponsorGovern === ''){
      this.message.warning('投资人或主办单位不可修改为空！');
    }
  }

  // 负责人姓名
  headerNameVerification():void {
    if (this.sponsorDetailData.headerName === ''){
      this.message.warning('负责人姓名不可修改为空！');
    }
  }
  // 负责人证件号码
  headerNumVerification():void {
    if (this.sponsorDetailData.headerNum === ''){
      this.message.warning('负责人证件号码不可修改为空！');
    }
  }
  // 联系方式1（手机）：
  telephone1Verification():void {
    if (this.sponsorDetailData.telephone1 === ''){
      this.message.warning('联系方式1（手机）不可修改为空！');
    }
    this.beianVerificationService.phoneCheck(this.sponsorDetailData.telephone1);
    if (this.beianVerificationService.phoneCheckResult() === 1) {
      this.message.create('warning', '请输入正确格式的手机号!');
    }
  }
  // 应急联系方式（手机号）
  emergencyPhoneVerification():void {
    if (this.sponsorDetailData.emergency_phone === ''){
      this.message.warning('应急联系方式（手机号）不可修改为空！');
    }
    this.beianVerificationService.phoneCheck(this.sponsorDetailData.emergency_phone);
    if (this.beianVerificationService.phoneCheckResult() === 1) {
      this.message.create('warning', '请输入正确格式的手机号!');
    }
  }
  // 电子邮件地址
  emailVerification():void {
    if (this.sponsorDetailData.email === ''){
      this.message.warning('电子邮件地址不可修改为空！');
    }
    this.beianVerificationService.emailCheck(this.sponsorDetailData.email);
    if (this.beianVerificationService.emailCheckResult() === 1) {
      this.message.create('warning', '请输入正确的邮件地址!');
    }
  }


  ngOnInit() {
    // 主体id
    // this.sponsorId = this.router.snapshot.params['id'];
    // console.log(this.sponsorId);

    this.orderId = this.router.snapshot.params['orderId'];
    // 获取主体信息
    this.getSponsorDetail();
    // 获取城市数据
    this.getCitys();
    // 负责人证件类型
    this.principalCertificateType();
    //获取主办单位性质下拉列表， 证件类型下拉列表
    this.showCompanyType();
  }

}


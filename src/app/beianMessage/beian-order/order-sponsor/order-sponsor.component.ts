import { Component, OnInit } from '@angular/core';
import {MyBeianService} from '../../my-beian/my-beian.service';
import {NzMessageService} from "ng-zorro-antd";
import {ActivatedRoute} from "@angular/router";
import {BeianVerificationService} from "../../../beianEntry/beian-home/common-serve/beian-verification.service";
import {Router} from "@angular/router";
import {BeianOrderService} from '../beian-order.service';

@Component({
  selector: 'app-order-sponsor',
  templateUrl: './order-sponsor.component.html',
  styleUrls: ['./order-sponsor.component.css']
})
export class OrderSponsorComponent implements OnInit {

  constructor(private myBeianService:MyBeianService,
              private message:NzMessageService,
              private router:ActivatedRoute,
              private beianVerificationService:BeianVerificationService,
              private route:Router,
              private beianOrderService:BeianOrderService
  ) { }

  // 主体详情参数
  sponsorDetailParams = {
    orderId:'',
    timestamp:''
  }
  // 主体id
  sponsorId;

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
    provinceId:'', //	主办单位所属区域
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
    emergencyPhone:'', //	应急电话
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
    id:'',  //	主体id
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
    orderId:''
  }

  code_context = '获取手机验证码';
  // 是否可以点击
  isCanClick = true;
  // 获取验证码的定时器
  timer = 60;
  timer1;
  // 订单的id
  orderId: '';
  sponsorRemarks: any = {};
  mainRemark: any = {
    firstRemark: '',
    recheckRemark: '',
    managerRemark: ''
  };
  /**
   * different Process,different type and mark
   */
  type;
  mark;
  // 类型数组
  certificationArr = [];

  // 获取主体详情信息
  getSponsorDetail(): void {
    this.sponsorDetailParams.orderId = this.orderId;
    this.sponsorDetailParams.timestamp = new Date().getTime().toString();
    this.beianOrderService.sponsorDetail(this.sponsorDetailParams).subscribe(data =>{
      if (data.code === '0') {

        // 获取主办单位性质下拉列表， 证件类型下拉列表
        this.showCompanyType();

        this.selectCity(data.result.provinceId);
        this.selectCountry(data.result.cityId);

        this.sponsorDetailData = data.result;
        this.formateRemarks(data.result.remarkList);
      } else {
        this.message.warning(data.message);
      }
    })
  }
  formateRemarks(remark) {
    remark.forEach(item => {
      this.sponsorRemarks[item.code] = item.remark;
    });
  }

  selectCity(code) {
    this.sponsorDetailData.cityId = '';
    this.sponsorDetailData.countryId = '';
    this.chengshiData.city = this.citysData.cityList.filter(item => item.parentCode == code);
  }

  selectCountry(code) {
    this.sponsorDetailData.countryId = '';
    this.chengshiData.country = this.citysData.contryList.filter(item => item.parentCode == code);
  }
  // 性质的id
  selectTypeId(code) {
    this.sponsorDetailData.certificationId = '';
    const typeCodeArr = [];
    this.certificationArr.forEach(item =>{
      if (item.parentCode == code) {
        typeCodeArr.push(item);
      }
    });
    this.certificationList = typeCodeArr;
  }

  // 获取省市县
  getCitys(): void {
    this.myBeianService.getCitys().subscribe(data => {
      if (data.code == 0) {
        this.getSponsorDetail();
        this.citysData = data.result;
      }
    });
  }

  // 负责人证件类型
  principalCertificateType(): void {
    const param = new Date().getTime().toString();
    this.myBeianService.principalCertificateType(param).subscribe(data => {
      if (data.code == 0) {
        this.principalCertificate = data.result;
      }
    })
  }

  // 获取主办单位性质下拉列表， 证件类型下拉列表
  showCompanyType(): void {
    this.myBeianService.getWebsiteBeianType().subscribe(data => {
      if (data.code === "0") {
        // this.certificationList = data.result.certificationList;
        this.certificationArr  = JSON.parse(JSON.stringify(data.result.certificationList));
        const typeArr = [];
        this.certificationArr.forEach(item =>{
          if (item.parentCode == this.sponsorDetailData.typeId) {
            typeArr.push(item);
          }
        });
        this.certificationList = typeArr;
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
    if (parseInt(this.sponsorDetailData.telephone1) === 0){
      this.message.warning('手机号不能为空！');
    } else {
      const that = this;
      if (this.isCanClick) {
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

  }
  // 验证手机号验证码是否合格
  verificationCodeFunction(): void {

    if (this.verificationCode === '') {
      this.message.warning('验证码不能为空！');
    }
  }
  // 点击下一步时，提交
  nextSubmitFunction(): void {
    this.uploadSponsorParams.orderId = this.orderId;
    this.beianOrderService.sponsorMessageKeep(this.uploadSponsorParams).subscribe(data => {
      if (data.code == 0) {
        if (this.type == '6') {
          // 上传页面,因为变更主体没有网站页面跳转
          this.route.navigate([`/home/auditfail/upload`], {queryParams: {sponsorId: this.sponsorId, orderId: this.orderId, mark: this.mark, type: this.type}});
        } else if(this.type == '9'){
         // 变更网站
          this.route.navigate([`/home/type/organizer/websitesreview`], {queryParams: {sponsorId: this.sponsorId, orderId: this.orderId, mark: this.mark, type: this.type}});
        } else {
          // 处理其他情况
          this.route.navigate([`/home/type/organizer/websitesreview`], {queryParams: {sponsorId: this.sponsorId, orderId: this.orderId, mark: this.mark, type: this.type}});
        }
      } else {
        this.message.warning(data.message);
      }
    });
  }

  // 数据赋值
  dataAssignmentFunction(): void {
    this.uploadSponsorParams.id = this.sponsorId;
    this.uploadSponsorParams.typeId = this.sponsorDetailData.typeId;
    this.cardTypelist.forEach(item => {
      if (item.code === this.sponsorDetailData.typeId) {
        this.uploadSponsorParams.typeName = item.name;
      }
    })
    this.uploadSponsorParams.certificationId = this.sponsorDetailData.certificationId;
    this.certificationList.forEach(item => {
      if (item.code === this.sponsorDetailData.certificationId) {
        this.uploadSponsorParams.certificationName = item.name;
      }
    })
    this.uploadSponsorParams.certificationNum = this.sponsorDetailData.certificationNum;

    this.uploadSponsorParams.provincId = this.sponsorDetailData.provinceId;
    this.citysData.provinceList.forEach(item => {
      if (item.code === this.sponsorDetailData.provinceId ) {
        this.uploadSponsorParams.provinceName = item.name;
      }
    })
    this.uploadSponsorParams.cityId = this.sponsorDetailData.cityId;
    this.citysData.cityList.forEach(item => {
      if (item.code === this.sponsorDetailData.cityId) {
        this.uploadSponsorParams.cityName = item.name;
      }
    })
    this.uploadSponsorParams.countryId = this.sponsorDetailData.countryId;
    this.citysData.contryList.forEach(item => {
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
    this.uploadSponsorParams.emergencyPhone = this.sponsorDetailData.emergencyPhone;
    this.uploadSponsorParams.email = this.sponsorDetailData.email;
    this.uploadSponsorParams.validateCode = this.verificationCode;
    this.uploadSponsorParams.timestamp = this.phoneVerificationParams.timestamp;
    this.nextSubmitFunction();
  }

  // 提交变更主体的数据
  submitSponsorData(): void {
    let emailReg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    let phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if(this.phoneVerificationParams.timestamp === ''){
      this.message.warning('请获取手机验证码！');
    }else if(this.sponsorDetailData.typeId === ''
      ||this.sponsorDetailData.certificationId === ''
      ||this.sponsorDetailData.provinceId === ''
      ||this.sponsorDetailData.cityId === ''
      ||this.sponsorDetailData.countryId === ''
      ||this.sponsorDetailData.headerType === ''){
      this.message.warning('请检查相应的下拉选择框是否进行选择！');
    }else if(this.sponsorDetailData.certificationNum === ''
      ||this.sponsorDetailData.sponsorName === ''
      ||this.sponsorDetailData.sponsorAddress === ''
      ||this.sponsorDetailData.sponsorMailAddress === ''
      ||this.sponsorDetailData.sponsorGovern === ''
      ||this.sponsorDetailData.headerName === ''
      ||this.sponsorDetailData.headerNum === ''
      ||this.sponsorDetailData.telephone1 === ''
      ||this.sponsorDetailData.emergencyPhone === ''
      ||this.sponsorDetailData.email === ''
      ||!phoneReg.test(this.sponsorDetailData.telephone1)
      ||!phoneReg.test(this.sponsorDetailData.emergencyPhone)
      ||!emailReg.test(this.sponsorDetailData.email)){
      this.message.warning('请输入符合要求的数据！');
    } else {
      this.dataAssignmentFunction();
    }

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
    if (this.sponsorDetailData.emergencyPhone === ''){
      this.message.warning('应急联系方式（手机号）不可修改为空！');
    }
    this.beianVerificationService.phoneCheck(this.sponsorDetailData.emergencyPhone);
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

  // 主体改变
  sponsorChangeReturn():void {
    this.route.navigate([`/list`]);
  }

  getFirstRejectRemark() {
    this.sponsorDetailParams.orderId = this.orderId;
    this.sponsorDetailParams.timestamp = new Date().getTime().toString();
    this.beianOrderService.firstReject(this.sponsorDetailParams).subscribe(data =>{
      if (data.code === '0') {
       this.mainRemark = {
         firstRemark: data.result.firstRemark,
         recheckRemark: data.result.recheckRemark,
         managerRemark: data.result.managerRemark
       };
      } else {
        this.message.warning(data.message);
      }
    }, error => {
      this.message.warning(error.error.message);
    });
  }

  ngOnInit() {
    // 主体id
    this.sponsorId = this.router.snapshot.queryParams['sponsorId'];
    this.orderId = this.router.snapshot.queryParams['orderId'];
    this.type = this.router.snapshot.queryParams['type'];
    this.mark = this.router.snapshot.queryParams['mark'];

    // 获取城市数据
    this.getCitys();
    // 负责人证件类型
    this.principalCertificateType();
    // // 获取主办单位性质下拉列表， 证件类型下拉列表
    // this.showCompanyType();
    // 获取主体信息
    // this.getSponsorDetail();
    // 获取初审驳回备注信息
    this.getFirstRejectRemark();
  }

}

import { Component, OnInit } from '@angular/core';
import { NzModalService, NzNotificationService, NzMessageService } from "ng-zorro-antd";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BeianHomeService } from "../beian-home.service";
import { BeianVerificationService } from "../common-serve/beian-verification.service";
import {PromptMessageService} from '../common-serve/prompt-message.service';
import {PromptInformationService} from '../common-serve/prompt-information.service';

@Component({
  selector: 'app-beian-organizer',
  templateUrl: './beian-organizer.component.html',
  styleUrls: ['./beian-organizer.component.css']
})
export class BeianOrganizerComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private beianHomeService: BeianHomeService,
    private notification: NzNotificationService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private beianVerificationService: BeianVerificationService,
    public promptMessageService: PromptMessageService,
    private promptInformationService: PromptInformationService
  ) { }

  // 手机号，用来获取验证码
  isEdit = false;

  // 获取手机验证码参数
  codeParams = {
    mobile: '',
    timestamp: ''
  }

  code_context = '获取手机验证码';
  // 是否可以点击
  isCanClick = true;
  // 获取验证码的定时器
  timer = 60;
  timer1;

  //负责人证件类型
  principalCertificate;

  // 主体详情参数
  mainBodyParams = {
    id: '',
    timestamp: ''
  }
  // 主办单位详情数据
  mainDataDetail = {
    id: '', // 	主体id
    provinceId: '', // 	主办单位所属区域
    provinceName: '', // 	主办单位所属区域名称
    cityId: '', // 	主办单位市辖区
    cityName: '', // 	主办单位市辖区名称
    countryId: '', // 	所属县(区)
    countryName: '', // 	所属区名称
    typeId: '', // 	主办单位性质id
    typeName: '', // 	主办单位性质名称
    certificationId: '', // 	主办单位证件类型id
    certificationName: '', // 	主办单位证件类型名称
    certificationNum: '', // 	主办单位证件号码
    sponsorName: '', // 	主办单位或主办人名称
    productCode: '', // 	产品类型
    sponsorAddress: '', // 	主办单位证件住所
    sponsorMailAddress: '', // 	主办单位通讯地址
    sponsorGovern: '', // 	投资人或主管单位
    headerName: '', // 	负责人
    headerType: '', // 	负责人证件类型
    headerTypeName: '', // 	负责人证件类型名字
    headerNum: '', // 	负责人证件号码
    telephone1: '', // 	联系电话1
    telephone2: '', // 	联系电话2
    emergencyPhone: '', // 	应急电话
    email: '', // 	电子邮件地址
    areaPhone: '', // 	区号
  }

  phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;

  // 数据显示
  titleData = {
    typeName: '',
    certificationName: '',
    certificationNum: '',
    provinceName: '',
    cityName: '',
    countryName: ''
  }

  titleDataShow = false;
  // 用来获取区号
  areaNumberSearchParams = {
    cityId:'',
  }

  // 区号显示
  areaShowNumber;
  // 验证校验
  verificationFunction(verificationParam, param): void {
    this.promptInformationService.blurVerificationFunction(verificationParam, param);
  }

  getSponsorDetails(): void {
    this.mainBodyParams.timestamp = new Date().getTime().toString();
    this.beianHomeService.getSponsorDetails(this.mainBodyParams).subscribe(data => {
      if (data.code === '0') {
        if (data.result) {
          this.mainDataDetail = data.result;
          this.organizerParam.sponsorName = this.mainDataDetail.sponsorName;
          this.organizerParam.sponsorAddress = this.mainDataDetail.sponsorAddress;
          this.organizerParam.sponsorMailAddress = this.mainDataDetail.sponsorMailAddress;
          this.organizerParam.sponsorGovern = this.mainDataDetail.sponsorGovern;
          this.organizerParam.headerName = this.mainDataDetail.headerName;
          this.verificationType = this.mainDataDetail.headerType;
          this.organizerParam.headerNum = this.mainDataDetail.headerNum;
          this.organizerParam.telephone1 = this.mainDataDetail.telephone1;
          this.organizerParam.telephone2 = this.mainDataDetail.telephone2;
          this.organizerParam.emergencyPhone = this.mainDataDetail.emergencyPhone;
          this.organizerParam.email = this.mainDataDetail.email;
          if (this.mainDataDetail.typeName) {
            this.titleDataShow = true;
            this.titleData.typeName = this.mainDataDetail.typeName;
            this.titleData.certificationName = this.mainDataDetail.certificationName;
            this.titleData.certificationNum = this.mainDataDetail.certificationNum;
            this.titleData.provinceName = this.mainDataDetail.provinceName;
            this.titleData.cityName = this.mainDataDetail.cityName;
            this.titleData.countryName = this.mainDataDetail.countryName;
            this.areaNumberSearchParams.cityId = this.mainDataDetail.cityId;
            if (this.areaNumberSearchParams.cityId) {
              this.beianHomeService.areaNumberSearch(this.areaNumberSearchParams).subscribe(data =>{
                if (data.code === '0') {
                  this.areaShowNumber = data.result;
                } else {
                  this.message.warning(data.message);
                }
              })
            }
          }

        }
      } else {
        this.message.warning(data.message);
      }
    })
  }

  // 获取手机验证码
  getPhoneCode(): void {
    if (!this.phoneReg.test(this.organizerParam.telephone1)) {
      this.message.warning('手机号格式不正确！');
    } else {
      const that = this;
      if (this.isCanClick) {
        this.codeParams.mobile = this.organizerParam.telephone1;
        this.codeParams.timestamp = new Date().getTime().toString();
        this.beianHomeService.phoneCode(this.codeParams).subscribe(data => {
          if (data.code === '0') {
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

  organizerParam = {
    "id": "",                         // 主体id
    "orderId": "",                    // 订单id
    "sponsorName": "",                //主办单位或主办人名称
    "sponsorAddress": "",             //主办单位证件住所
    "sponsorMailAddress": "",         //主办单位通讯地址
    "sponsorGovern": "",              //投资人或主管单位
    "headerName": "",                 //负责人姓名
    "headerType": "",
    "headerTypeName": "",
    "headerNum": "",                  //负责人证件号码
    "telephone1": "",
    "telephone2": "",
    "emergencyPhone": "",
    "email": "",
    "validateCode": ""
  };
  // 证件类型
  verificationType;

  //时间戳，用来获取后台的证件类型
  param;
  info;
  // 提交数据
  sponsorMessageKeep(): void {
    console.log(this.organizerParam.sponsorName);
    if (this.organizerParam.sponsorName === ''||this.organizerParam.sponsorName === undefined) {
      this.message.warning('主办单位或主办人名称不能为空！');
      return;
    }
    if (this.organizerParam.sponsorAddress === ''||this.organizerParam.sponsorAddress === undefined) {
      this.message.warning('主办单位证件住所不能为空！');
      return;
    }
    if (this.organizerParam.sponsorMailAddress === ''||this.organizerParam.sponsorMailAddress === undefined) {
      this.message.warning('主办单位通讯住址不能为空！');
      return;
    }
    if (this.organizerParam.sponsorGovern === ''||this.organizerParam.sponsorGovern === undefined) {
      this.message.warning('投资人或主管单位不能为空！');
      return;
    }
    if (this.organizerParam.headerName === ''||this.organizerParam.headerName === undefined) {
      this.message.warning('负责人姓名不能为空！');
      return;
    }
    if (this.verificationType === ''||this.verificationType === undefined) {
      this.message.warning('负责人证件类型必须选择！');
      return;
    }
    if (this.organizerParam.headerNum === ''|| this.organizerParam.headerNum === undefined) {
      this.message.warning('负责人证件号码不能为空！');
      return;
    }

    if (this.organizerParam.telephone1 === ''||this.organizerParam.telephone1 === undefined) {
      this.message.warning('联系方式不能为空！');
      return;
    }
    this.beianVerificationService.phoneCheck(this.organizerParam.telephone1);
    if (this.beianVerificationService.phoneCheckResult() === 1) {
      this.message.create('warning', '请输入正确格式的手机号!');
      return;
    }
    if (this.organizerParam.validateCode === ''||this.organizerParam.validateCode === undefined) {
      this.message.warning('验证码不能为空！');
      return;
    }

    if (this.organizerParam.emergencyPhone === ''||this.organizerParam.emergencyPhone === undefined) {
      this.message.warning('应急联系方式（手机号）不能为空！');
      return;
    }
    this.beianVerificationService.phoneCheck(this.organizerParam.emergencyPhone);
    if (this.beianVerificationService.phoneCheckResult() === 1) {
      this.message.create('warning', '请输入正确格式的手机号!');
      return;
    }

    if (this.organizerParam.email === ''||this.organizerParam.email === undefined) {
      this.message.warning('邮件地址不能为空！');
      return;
    }
    this.beianVerificationService.emailCheck(this.organizerParam.email);
    if (this.beianVerificationService.emailCheckResult() === 1) {
      this.message.create('warning', '请输入正确的邮件地址!');
      return;
    }
    // 校验身份证
    if (this.verificationType === '2019022500000000001') {
      this.beianVerificationService.idcardCheck(this.organizerParam.headerNum);
      if (this.beianVerificationService.idcardCheckResult() === 1) {
        this.message.create('warning', '请输入正确的证件号码!');
        return;
      }
    }
    // 应急联系电话和联系方式1不可相同
    if (this.organizerParam.emergencyPhone == this.organizerParam.telephone1 ) {
       this.message.warning('应急联系方式（手机号）和联系方式1不可相同！');
       return;
    }

    // 处理负责人证件类型
    this.principalCertificate.forEach(item => {
      if (item.code === this.verificationType) {
        this.organizerParam.headerTypeName = item.name;
      }
    })


    // 总的校验
    let organizerParam = this.organizerParam;
    organizerParam = Object.assign(organizerParam, {
      id: organizerParam.id,
      orderId: organizerParam.orderId,
      sponsorName: organizerParam.sponsorName,
      sponsorAddress: organizerParam.sponsorAddress,
      sponsorMailAddress: organizerParam.sponsorMailAddress,
      sponsorGovern: organizerParam.sponsorGovern,
      headerName: organizerParam.headerName,
      headerType: this.verificationType,
      headerTypeName: organizerParam.headerTypeName,
      headerNum: organizerParam.headerNum,
      telephone1: organizerParam.telephone1,
      telephone2: organizerParam.telephone2,
      emergencyPhone: organizerParam.emergencyPhone,
      email: organizerParam.email,
      validateCode: organizerParam.validateCode,
    });

    this.beianHomeService.sponsorMessageKeep(organizerParam).subscribe(data => {
      if (data.code == 0) {
        let params: any =  { sponsorId: this.info.sponsorId, orderId: this.info.orderId, type: this.info.type };
        if (this.isEdit) {
          params = {isEdit: true, ...params};
        }
        this.router.navigate(['/home/type/organizer/websites'], { queryParams: params});
      } else {
        this.message.warning(data.message);
      }
    })

  }
  // 返回
  return(): void {
    this.router.navigate(['/home/type'], { queryParams: { sponsorId: this.info.sponsorId, orderId: this.info.orderId, type: this.info.type } });
  }
  // 负责人证件类型
  principalCertificateType(): void {
    const param = new Date().getTime().toString();
    this.beianHomeService.principalCertificateType(param).subscribe(data => {
      if (data.code == 0) {
        this.principalCertificate = data.result;
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.organizerParam.orderId = params['orderId'];
    });

    // 用来获取主体详情的主体id
    this.route.queryParams.subscribe((params: Params) => {
      this.mainBodyParams.id = params['sponsorId'];
      this.organizerParam.id = params['sponsorId'];
      this.isEdit = params['isEdit'] ? JSON.parse(params['isEdit']) : false;
    });
    // 负责人证件类型
    this.principalCertificateType();
    // 一开始初始化的时候，获取页面最上方的数据
    this.getSponsorDetails();
    this.info = this.route.snapshot.queryParams;
  }

}

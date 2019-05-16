import { Component, OnInit } from '@angular/core';
import { NzMessageService} from "ng-zorro-antd";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {BeianHomeService} from "../beian-home.service";
import { BeianVerificationService } from '../common-serve/beian-verification.service';
import { PromptMessageService } from '../common-serve/prompt-message.service';
@Component({
  selector: 'app-beian-type',
  templateUrl: './beian-type.component.html',
  styleUrls: ['./beian-type.component.css']
})
export class BeianTypeComponent implements OnInit {
  constructor(
    private beianVerificationService: BeianVerificationService,
    public promptMessage: PromptMessageService,
    private beianHomeService: BeianHomeService,
    private route: ActivatedRoute,
    private router: Router,
    private message: NzMessageService
  ) { }
  isVisible = false;
  isShow = true;
  imgUrl = '';
  title = "备案类型";
  // 网站列表参数
  websitesParam: any = {
    provinceId: "",           //省id
    provinceName: "",         //省名字
    cityId: "",               //市id
    cityName: "",             //市名字
    countryId: "",            //县id
    countryName: "",          //县名字
    typeId: "",
    typeName:{
      code:"",
      name:""
    },
    certificationId: "",
    certificationName: {
      code:"",
      name:"",
      parentCode:""
    },
    certificationNum: "",
    domain:"",
    validateCode:"",
    timestamp: "",
    type:1
  };

  queryParams = {
    timestamp: new Date().getTime().toString(),
    orderId: '',
    type: '',
    id: '',
    isEdit: false
  }

  citysData = {
    city: [],
    country: []
  };
  optionObj = {
    citysData: {
      provinceList: [],
      cityList: [],
      contryList: []
    },
    unitList: [],
    specialApprovalList: [],
    certificationList: [],
    certifications: [],
    AvailableDomains:[],
  };

  typeLabel = '';
  timestamp = '';

  selectCity(code) {
    this.websitesParam.cityId = '';
    this.websitesParam.countryId = '';
    this.citysData.city = this.optionObj.citysData.cityList.filter(item => item.parentCode == code);
    this.citysData.country = [];
  };

  selectCountry(code) {
    this.websitesParam.countryId = '';
    this.citysData.country = this.optionObj.citysData.contryList.filter(item => item.parentCode == code);
  };

  selectCertification(code) {
    this.websitesParam.certificationNum = '';
    this.websitesParam.certificationId = '';
    this.optionObj.certifications = this.optionObj.certificationList.filter(item => item.parentCode == code);
  }

  //下一步
  async nextStep() {
    let domainReg = /^\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if (!this.websitesParam.provinceId) {
      this.message.warning('请选择省');
      return;
    }
    if (!this.websitesParam.cityId) {
      this.message.warning('请选择市');
      return;
    }
    if (!this.websitesParam.countryId) {
      this.message.warning('请选择区');
      return;
    }

    if (!this.websitesParam.typeId) {
      this.message.warning('请选择主办单位性质');
      return;
    }
    if (!this.websitesParam.certificationId) {
      this.message.warning('请选择主办单位证件类型');
      return;
    }
    if (!this.websitesParam.certificationNum) {
      this.message.warning('请填写主办单位证件号码');
      return;
    }
    if (!this.websitesParam.domain) {
      this.message.warning('请填写域名');
      return;
    }

    if (!this.websitesParam.validateCode) {
      this.message.warning('请填写验证码');
      return;
    }
    if (!this.checkCardId(this.websitesParam.certificationNum)) return;

    let param = this.websitesParam;
    const valid: any = await this.validateCodeAndDomain({
      timestamp: this.timestamp,
      domain: param.domain,
      validateCode: param.validateCode
    });
    if (!valid || (valid.code != '0')) {
      this.message.warning( !valid ? '验证失败' : valid.message);
    } else {
      this.isVisible = true;
    }
  }

  // validateCodeAndDomain
  validateCodeAndDomain(param) {
    return new Promise((resolve, reject) => {
      this.beianHomeService.validateCodeAndDomain(param).subscribe(data => {
        resolve(data);
      });
    })

  }

  checkCardId(cardId) {
    if (this.websitesParam.certificationId === 'idcard') {
      this.beianVerificationService.idcardCheck(cardId);
      if (this.beianVerificationService.idcardCheckResult() === 1) {
        this.message.create('warning', '请输入正确的证件号码!');
        return false;
      }
    }
    return true;
  };

  //点击先一步提交主体
  async addType() {
    let param = this.websitesParam;
    param.provinceName = this.websitesParam.provinceId ? this.optionObj.citysData.provinceList.find(t => t.code == this.websitesParam.provinceId).name : '';
    param.cityName = this.websitesParam.cityId ? this.optionObj.citysData.cityList.find(t => t.code == this.websitesParam.cityId).name : '';
    param.countryName = this.websitesParam.countryId ? this.optionObj.citysData.contryList.find(t => t.code == this.websitesParam.countryId).name : '';

    param.typeName = this.websitesParam.typeId ? this.optionObj.unitList.find(t => t.code == this.websitesParam.typeId).name : '';
    param.certificationName = this.websitesParam.certificationId ? this.optionObj.certificationList.find(t => t.code == this.websitesParam.certificationId).name : '';
    param.timestamp = this.timestamp;
    this.beianHomeService.addType(param).subscribe(data =>{
      if (data.code == '0') {
        if (data.result) {
          this.queryParams.id = data.result.id;
          this.queryParams.orderId = data.result.orderId;
        }
        this.message.success('备案类型录入成功');
        let params: any = {...this.queryParams,  sponsorId: this.queryParams.id, type: this.websitesParam.type};
        if (this.queryParams.isEdit) {
          params = {isEdit: true, ...params};
        }
        if (this.websitesParam.type == 3) { // 新增接入
          this.isShow = false;
          this.router.navigate(['/home/type/vertifyICP'], {queryParams: params});
        } else {
          this.router.navigate(['/home/type/organizer'], {queryParams: params});
        }
      } else {
        this.message.warning(data.message);
      }
    })

  }

  // instanceIp = '';
  // isShowType3 = true;

  // addIP(): void {
  //   if (!this.instanceIp) {
  //     this.message.warning('请输入实例IP');
  //     return;
  //   }
  //   this.BeianHomeService.addInstanceIP({
  //     sponsorId: this.queryParams.id,
  //     orderId: this.queryParams.orderId,
  //     instanceIp: this.instanceIp
  //   }).subscribe(data => {
  //     if (data.code == 0) {
  //       this.message.success('实例IP添加成功');
  //       if (this.websitesParam.type == 3) { // 新增接入
  //         this.isShowType3 = false;
  //       } else {
  //         let params: any = {...this.queryParams, sponsorId: this.queryParams.id};
  //         if (this.queryParams.isEdit) {
  //           params = {isEdit: true, ...params};
  //         }
  //         this.router.navigate(['/home/type/organizer'], {queryParams: params});
  //       }
  //     } else {
  //       this.message.warning(data.message);
  //     }
  //   })
  // }

  //获取域名
  getAvailableDomains(param): void {
    this.beianHomeService.getAvailableDomains(param).subscribe(data => {
      if (data.code == 0) {
        this.optionObj.AvailableDomains= data.result;
      }
    })
  }
  //获取主办单位性质下拉列表， 证件类型下拉列表
  showCompanyType(): void {
    this.beianHomeService.getWebsiteBeianType().subscribe(data => {
      if (data.code === "0") {
       this.optionObj.certificationList= data.result.certificationList;
        this.optionObj.unitList = data.result.list;
      }
    });

    this.isVisible=false;
  }

//显示为首次备案
showModal(): void {
  this.nextStep();
}

changeTab(event) {
  this.typeLabel = event.tab.nzTitle;
  const valueObj = {
    '首次备案': '1',
    '新增接入': '3',
    '新增网站': '2'
  };
  this.websitesParam.type = valueObj[this.typeLabel];
};

subject = {
  id: this.queryParams.id,
  subjectRecordNumber: '',
  subjectIcpPassword: ''
}

  // 接入验证
  vertifySubject(): void {
    if (!this.subject.subjectRecordNumber) {
      this.message.warning('请输入主体备案号');
      return;
    }
    if (!this.subject.subjectIcpPassword) {
      this.message.warning('请输入ICP备案密码');
      return;
    }
    this.beianHomeService.vertifySubject(this.subject).subscribe(data => {
      if (data.code == 0) {
        // this.message.success('密码验证成功');
        let params: any = {...this.queryParams, sponsorId: this.queryParams.id, type: this.queryParams.type};
        if (this.queryParams.isEdit) {
          params = {isEdit: true, ...params};
        }
        this.router.navigate(['/home/type/organizer'], {queryParams: params});
      } else {
        this.message.warning(data.message);
      }
    })
  }

  //首次备案确定
  handleOk(): void {
    this.isVisible = false;
    this.title = "验证产品信息";
    this.addType();
  }
  //首次备案取消
  handleCancel(): void {
    this.isVisible = false;
  }
  //返回填写备案信息页
  back(): void{
    this.isShow = true;
    this.title = "备案类型";
  }

  //获取图片验证码
  getPictureVerificationCode(): void {
    this.websitesParam.timestamp = new Date().getTime().toString();
    this.timestamp = this.websitesParam.timestamp;
    this.beianHomeService.pictureVerificationCode({timestamp: this.websitesParam.timestamp}).subscribe(data =>{
      const reader = new FileReader();
      reader.readAsDataURL(data);
      reader.onload = e => {
        this.imgUrl = e.target['result'];
      }
    }, (error) => {
      console.log(error);
    });
  }

  // 获取省市县
  getCitys() {
    return new Promise(resolve => {
      this.beianHomeService.getCitys().subscribe(data => {
        if (data.code == 0) {
          this.optionObj.citysData = data.result;
          resolve(data.result);
        }
      })
    })
  }
  // 验证码
  verificationCode ():void {
    if (this.websitesParam.validateCode === ''){
      this.message.warning('验证码不能为空！');
    }
  }
  // 主办单位证件号码
  certificationNum():void {
    if (this.websitesParam.certificationNum === ''){
      this.message.warning('负责人证件号码不能为空！');
    }
  }

  getDetail(param) {
    return new Promise(resolve => {
      this.beianHomeService.getSponsorDetails(param).subscribe(data => {
        if (data.code == 0) {
          this.websitesParam = Object.assign({}, data.result);
          resolve(data.result);
        }
      })
    })
  }

  async ngOnInit() {
    this.getAvailableDomains({timestamp: this.timestamp});
    this.showCompanyType();
    this.getPictureVerificationCode();

    this.route.queryParams.subscribe((params: Params) => {
      this.queryParams.orderId = params['orderId'];
      this.queryParams.id = params['sponsorId'];
      this.queryParams.type = params['type'];
      this.queryParams.isEdit = params['isEdit'] ? JSON.parse(params['isEdit']) : false;
    });
    await this.getCitys();
    if (this.queryParams.orderId) {
      let websitesParam: any = await this.getDetail(this.queryParams);
      this.selectCity(websitesParam.provinceId);
      this.selectCountry(websitesParam.cityId);
      this.selectCertification(websitesParam.typeId);
      this.websitesParam.orderId = this.queryParams.orderId;
      this.websitesParam.certificationId = websitesParam.certificationId;
      this.websitesParam.certificationNum = websitesParam.certificationNum;
      this.websitesParam.cityId = websitesParam.cityId;
      this.websitesParam.countryId = websitesParam.countryId;
    }

    if (window.location.pathname.indexOf('type/vertifyICP') >= 0) {
      this.isShow = false;
    }
  }
}

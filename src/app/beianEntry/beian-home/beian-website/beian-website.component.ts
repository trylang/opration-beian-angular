import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { BeianHomeService } from "../beian-home.service";
import { NzMessageService, NzModalRef, NzModalService } from "ng-zorro-antd";
import { BeianVerificationService } from '../common-serve/beian-verification.service';
import { PromptMessageService } from '../common-serve/prompt-message.service';
import { typeinfo, markinfo } from './baseinfo';
@Component({
  selector: 'app-beian-website',
  templateUrl: './beian-website.component.html',
  styleUrls: ['./beian-website.component.scss']
})
export class BeianWebsiteComponent implements OnInit, OnDestroy {
  navigationSubscription;

  constructor(
    public location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private beianHomeService: BeianHomeService,
    public promptMessage: PromptMessageService,
    private modal: NzModalService,
    private beianVerificationService: BeianVerificationService,
    private message: NzMessageService) {
    this.navigationSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.init();
      }
    })
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  // 网站列表参数
  websitesParam = {
    orderId: '',
    sponsorId: '',
    timestamp: new Date().getTime().toString(),
    websiteName: '',
    homeUrl: '',
    instanceIp: '',
    type: '',
    serviceContentList: [], // 网站服务内容
    language: {
      code: '',
      name: ''
    },
    languageCode: '',
    languageName: '',
    specialApproval: {
      code: '',
      name: ''
    },
    specialApprovalCode: '',
    specialApprovalName: '',
    note: '',
    domainList: [],
    herderAttribute: '1',
    headerName: '',
    headerTypeObj: {
      code: '',
      name: ''
    },
    headerType: '',
    headerTypeName: '',
    headerNum: '',
    telephone1: '',
    validateCode: '',
    telephone2: '',
    emergencyPhone: '',
    email: ''
  }

  btnDisabled = false;

  websitesListShow = false; // 只显示列表
  remarkShow = false; // 显示备注
  remarkObj = {};

  radio = {
    headerName: '',
    headerNum: '',
    telephone1: '',
    telephone2: '',
    email: ''
  };
  websiteId = ''; // 编辑时网站id
  domainList = []; // 存放domainList
  isEditOrder = false;
  isEdit = false;
  // addDomain = ''; // 值为addDomain为添加
  optionObj = {
    languageList: [],
    serviceContentList: [],
    specialApprovalList: [],
    certificationList: []
  };

  checkDomains = {};

  websites = [];
  continueWebsites = null;

  typeinfo = typeinfo;
  markinfo = markinfo;

  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1.code === o2.code : o1 === o2);

  private formatpath(info, way, param) {
    let path = info[way];
    if (new RegExp(/\${sponsorId}/).test(path)) {
      path = path.replace(/\${sponsorId}/, param.sponsorId);
    }
    return path;
  }

  goBack(): void {
    let params: any = { sponsorId: this.param.sponsorId, orderId: this.param.orderId, type: this.param.type };
    if (this.isEditOrder) params = { isEdit: true, ...params };
    if (this.param.mark) params = { mark: this.param.mark, ...params };
    if (this.websitesListShow) {
      this.router.navigate([this.remarkShow ? '/home/type/organizer/websitesreview' : '/home/type/organizer/websites'], { queryParams: params });
      return;
    }

    let back = '';
    if (this.param.mark) {
      back = this.formatpath(this.markinfo[this.param.mark], 'back', this.param);
    } else {
      back = this.formatpath(this.typeinfo[this.param.type], 'back', this.param);
    }

    this.router.navigate([back], { queryParams: params });
  }

  deleteDomainItem(index) {
    const isFirstItem = this.websitesParam.domainList[index];
    if (isFirstItem.isFirst == 1) {
      this.message.warning('此域名不能删除');
      return;
    }
    const seltype = this.typeinfo[this.param.type];
    if (seltype.domainmincount > 0 && seltype.domainmincount >= this.websitesParam.domainList.length) {
      this.message.warning(seltype.warningmsg);
      return;
    }
    this.websitesParam.domainList.splice(index, 1);
  }

  addDomainItem(domain) {
    this.websitesParam.domainList.push({
      id: '',
      isFirst: 0,
      domain
    })
  }

  confirmModal: NzModalRef;
  deleteWebsiteItem(datas) {
    if (this.websiteId == datas.id) {
      this.message.warning('当前网站处于编辑状态，不能删除');
      return;
    }
    this.confirmModal = this.modal.confirm({
      nzTitle: '确定要删除此网站么？',
      nzOnOk: () => {
        this.beianHomeService.deleteWebsite(datas.id).subscribe(data => {
          if (data.code == 0) {
            this.message.success('网站删除成功！');
            this.getWebsites({
              sponsorId: this.param.sponsorId,
              orderId: this.param.orderId,
              type: this.param.type
            }, websites => {
              if (websites.length == 0) {
                this.clearParams(this.websitesParam);
              } else if (websites.id) {
                this.getWebsiteDetail(websites.id)
              }
            });
          } else {
            this.message.error('网站删除失败！');
          }
        })
      }

    });
  }

  changeHandle(event) {
    console.log('parentevent', event);
    this.websitesParam.serviceContentList = event;
  }

  chackWords(words) {
    if (words.length < 3) {
      this.message.warning('网站名称要求三个字以上！');
    }
  };

  checkCardId(cardId) {
    if (this.websitesParam.headerTypeObj.code === 'idCard') {
      this.beianVerificationService.idcardCheck(cardId);
      if (this.beianVerificationService.idcardCheckResult() === 1) {
        this.message.create('warning', '请输入正确的证件号码!');
        return false;
      }
    }
    return true;
  };

  // 电话
  phoneFunction(val) {
    if (val === '') {
      this.message.warning('联系方式不能为空！');
      return false;
    }
    this.beianVerificationService.phoneCheck(val);
    if (this.beianVerificationService.phoneCheckResult() === 1) {
      this.message.create('warning', '请输入正确格式的手机号!');
      return false;
    }
    return true;
  }
  // 邮箱验证
  emailFunction() {
    if (this.websitesParam.email === '') {
      this.message.warning('邮件地址不能为空！');
      return false;
    }
    this.beianVerificationService.emailCheck(this.websitesParam.email);
    if (this.beianVerificationService.emailCheckResult() === 1) {
      this.message.create('warning', '请输入正确的邮件地址!');
      return false;
    }
    return true;
  }

  checkWebsite(index, domain) {
    if (!domain) return;
    if (this.checkDomains[index] && this.checkDomains[index].domain == domain) {
      this.message.warning('此域名已存在');
      return;
    }
    this.beianHomeService.checkDomain({
      domain: domain
    }).subscribe(data => {
      if (data.code == 0) {
        this.checkDomains[index] = {
          domain: domain,
          index: index,
          value: 1
        }; // 正确
        this.message.success('域名验证成功');
      } else {
        this.checkDomains[index] = {
          domain: domain,
          index: index,
          value: -1
        }; // 不正确
        this.message.warning(data.message);
      }
    })
  }

  checkParam(param) {
    const msgObj = {
      websiteName: '网站名称要求三个字以上！',
      homeUrl: '请填写网站首页URL',
      instanceIp: '请填写网站IP地址',
      serviceContentList: '请选择网站服务内容',
      languageCode: '请选择网站语言',
      headerName: '请填写负责人姓名',
      headerType: '请选择负责人证件类型',
      headerNum: '请填写负责人证件号码',
      telephone1: '请填写联系方式1（手机号）',
      validateCode: '请填写手机验证码',
      emergencyPhone: '请填写应急电话',
      email: '请填写电子邮箱地址'
    };

    let checkAry = [];

    if (param.herderAttribute == '1') {
      checkAry = Object.keys(msgObj).splice(0, 4);
    } else {
      checkAry = Object.keys(msgObj);
    }

    for (let key of checkAry) {
      const value = param[key];
      if (!value || (key == 'websiteName' && value.length < 3) || (key == 'serviceContentList' && value.length == 0)) {
        this.message.warning(msgObj[key]);
        return false;
      }
    }

    if (param.herderAttribute != '1' && !this.checkCardId(param.headerNum)) {
      return false;
    }

    if (param.herderAttribute != '1' && !this.emailFunction()) {
      return false;
    }

    if (param.herderAttribute != '1' && !this.phoneFunction(param.telephone1)) {
      return false;
    };

    if (param.herderAttribute != '1' && !this.phoneFunction(param.emergencyPhone)) {
      return false;
    };

    const lackdomain = this.domainList.some(item => {
      return !item.domain;
    })
    if (lackdomain) {
      this.message.warning('请填写完整域名信息');
      return false;
    }
    const domains: any = Object.values(this.checkDomains);
    const wrongWebsite = domains.find(item => item.value == -1);
    if (wrongWebsite) {
      this.message.warning(`第${wrongWebsite.index + 1}个域名填写错误`);
      return false;
    }
    return true;
  }

  clearParams(target) {

    const languageList = JSON.parse(JSON.stringify(this.optionObj.languageList));
    const specialApprovalList = JSON.parse(JSON.stringify(this.optionObj.specialApprovalList));
    const certificationList = JSON.parse(JSON.stringify(this.optionObj.certificationList));

    if (typeof target !== 'object' || !target) return target;
    function _deepClear(target) {
      for (let key in target) {
        if (Array.isArray(target[key])) target[key] = [];
        else if (Object.prototype.toString.call(target[key]) == '[object Object]') _deepClear(target[key]);
        else target[key] = '';
      }
    }
    _deepClear(target);

    // target.domainList = this.domainList;
    target.domainList = [];
    target.herderAttribute = '1';

    target.language = {};
    target.specialApproval = {};
    target.headerTypeObj = {};

    this.optionObj.serviceContentList = this.optionObj.serviceContentList.map(item => {
      return {
        ...item,
        checked: false
      };
    });

    this.optionObj.languageList = languageList;
    this.optionObj.specialApprovalList = specialApprovalList;
    this.optionObj.certificationList = certificationList;

  };

  // 点击网站下一步的操作
  websiteNext(type?): void {
    const _this = this;
    let param: any = this.isEditOrder ? { isEdit: true, ...this.param } : this.param;
    if (this.param.mark) param = { mark: this.param.mark, ...param };
    if (!type && this.websitesListShow && !this.remarkShow) { // 只显示列表
      this.router.navigate([this.typeinfo[this.param.type].next], { queryParams: param });
      return;
    } else if (!type && this.websitesListShow && this.remarkShow) {
      let next = '';
      if (this.param.mark) {
        next = this.formatpath(this.markinfo[this.param.mark], 'next', this.param);
      } else {
        next = this.formatpath(this.typeinfo[this.param.type], 'next', this.param);
      }

      this.router.navigate([next], { queryParams: param });
      return;
    }

    let websitesParam: any = this.websitesParam;
    if (this.websiteId && this.websites.length > 0) { // 编辑网站
      websitesParam.id = this.websiteId;
    }
    const obj = {};
    websitesParam = Object.assign(websitesParam, {
      orderId: this.param.orderId,
      sponsorId: this.param.sponsorId,
      // serviceContentList: JSON.parse(JSON.stringify(websitesParam.serviceContentList, function (key, value) {
      //   if (key == 'checked') {
      //     return undefined;
      //   } else {
      //     return value;
      //   }
      // })).concat((cur, next) => {
      //   obj[next.code] ? '' : obj[next.code] = true && cur.push(next);
      //   return cur;
      // }, []),
      serviceContentList: JSON.parse(JSON.stringify(websitesParam.serviceContentList, function (key, value) {
        if (key == 'checked') {
          return undefined;
        } else {
          return value;
        }
      })),
      herderAttribute: websitesParam.herderAttribute || '1',
      languageCode: websitesParam.language.code,
      languageName: websitesParam.language.name,
      specialApprovalCode: websitesParam.specialApproval.code,
      specialApprovalName: websitesParam.specialApproval.name,
      headerType: websitesParam.headerTypeObj.code,
      headerTypeName: websitesParam.headerTypeObj.name,
      timestamp: this.timestamp,
      type: this.param.type || ''
    });

    const filterParam = {
      id: websitesParam.id,
      orderId: websitesParam.orderId,
      sponsorId: websitesParam.sponsorId,
      websiteName: websitesParam.websiteName,
      homeUrl: websitesParam.homeUrl,
      serviceContentList: websitesParam.serviceContentList,
      code: websitesParam.code,
      name: websitesParam.name,
      languageCode: websitesParam.languageCode,
      languageName: websitesParam.languageName,
      specialApprovalCode: websitesParam.specialApprovalCode,
      specialApprovalName: websitesParam.specialApprovalName,
      note: websitesParam.note,
      domainList: websitesParam.domainList,
      herderAttribute: websitesParam.herderAttribute,
      headerName: websitesParam.headerName,
      headerType: websitesParam.headerType,
      headerTypeName: websitesParam.headerTypeName,
      headerNum: websitesParam.headerNum,
      telephone1: websitesParam.telephone1,
      telephone2: websitesParam.telephone2,
      emergencyPhone: websitesParam.emergencyPhone,
      email: websitesParam.email,
      type: websitesParam.type,
      instanceIp: websitesParam.instanceIp,
      validateCode: websitesParam.validateCode
    }

    if (!this.checkParam(websitesParam)) return;

    // this.addDomain = type;
    this.btnDisabled = true;
    function next(type, data, queryParams, message: string) {
      if (data.code == 0) {
        if (!_this.route.snapshot.queryParams.orderId) { // 我得备案进来没有orderid
          _this.param.orderId = data.result;
        }
        _this.message.success(message);
        if (type == 'addDomain' && _this.websites.length <= 2) {
          _this.clearParams(_this.websitesParam);
          _this.getWebsites({ sponsorId: queryParams.sponsorId, orderId: queryParams.orderId, type: _this.param.type });
          _this.router.navigate(['/home/type/organizer/websitesadd'], { queryParams });
        } else {
          _this.router.navigate([_this.remarkShow ? '/home/type/organizer/websitelistview' : '/home/type/organizer/websitelist'], { queryParams });
        }
      } else {
        _this.message.warning(data.message);
      }
      _this.btnDisabled = false;
    }
    this.beianHomeService.addWebsitesList(filterParam).subscribe(data => {
      next(type, data, param, this.websiteId || websitesParam.id ? '网站信息编辑成功' : '网站信息录入成功');
    })

  }

  // 获取下拉框列表
  getApprovalsTypes() {
    return new Promise(resolve => {
      this.beianHomeService.getApprovalsTypes().subscribe(data => {
        if (data.code == 0) {
          this.optionObj = Object.assign(this.optionObj, data.result);
          this.optionObj.languageList = [...data.result.languageList];
          this.optionObj.specialApprovalList = [...data.result.specialApprovalList];
          let serviceContentList = [...data.result.serviceContentList];
          if (serviceContentList) {
            this.optionObj.serviceContentList = serviceContentList.map(item => {
              return {
                ...item,
                checked: false
              };
            })
          }
          resolve(data.result);
        }
      })
    })

  }

  // 获取身份证类型接口
  getCertificates() {
    return new Promise(resolve => {
      const param = new Date().getTime().toString();
      this.beianHomeService.principalCertificateType(param).subscribe(data => {
        if (data.code == 0) {
          this.optionObj.certificationList = data.result;
          resolve(data.result);
        }
      })
    })

  }

  // 已填写的网站列表
  getWebsites(param, cb?): void {
    this.beianHomeService.getWebsites(param).subscribe(data => {
      if (data.code == 0) {
        this.websites = data.result;
        if (cb && data.result.length > 0) {
          cb(data.result[0]);
        } else if (cb && data.result.length == 0) {
          cb([]);
        }

        if (this.param.type == 10 || this.param.type == 11) { // 获取主体下有几个网站数量
          this.beianHomeService.getWebsites({
            sponsorId: this.param.sponsorId,
            type: this.param.type
          }).subscribe(data => {
            this.continueWebsites = data.result;
          })
        }
        
      }
    })
  }

  formatDetail(data) {
    let param = Object.assign(this.websitesParam, data);
    const sponsorAttr = ['headerName', 'headerType', 'headerNum', 'telephone1',
      'telephone2', 'emergencyPhone', 'email'];
    if (param.herderAttribute == 1) {
      sponsorAttr.forEach(item => {
        param[item] = '';
        this.remarkObj['new' + item] = '';
      });
    } else {
      sponsorAttr.forEach(item => {
        this.remarkObj[item] = '';
      });
    }

    if (param.serviceContentCode) {
      this.optionObj.serviceContentList = this.optionObj.serviceContentList.map(item => {
        if (param.serviceContentCode.indexOf(item.code) >= 0) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        return item;
      });
      let codeAry = param.serviceContentCode.split(',');
      let nameAry = param.serviceContentName.split(',');
      codeAry.forEach((item, index) => {
        param.serviceContentList.push({
          code: item,
          name: nameAry[index]
        })
      });
    }
    param.language = {
      code: param.languageCode,
      name: param.languageName
    };
    param.specialApproval = {
      code: param.specialApprovalCode,
      name: param.specialApprovalName
    };
    param.headerTypeObj = {
      code: param.headerType,
      name: param.headerTypeName
    };

    this.domainList = data.domainList || [];

    this.websitesParam = param;
  }

  // 获取网站详情
  async getWebsiteDetail(websiteId) {
    let data = null;
    if (this.ifReview('websitesreview')) {
      this.remarkShow = true;
      data = await this.getRemarkWebsiteDetail(websiteId);
    } else {
      data = await this.getCommonWebsiteDetail(websiteId);
    }

    return new Promise(resolve => {
      if (data) resolve(data);
    });
  }

  getCommonWebsiteDetail(websiteId) {
    return new Promise(resolve => {
      this.beianHomeService.websiteChangeNextShow({
        websiteId,
        timestamp: new Date().valueOf().toString()
      }).subscribe(data => {
        if (data.code == 0) {
          this.formatDetail(data.result.websiteEntity);
          resolve(data.result.websiteEntity);
        }
      })
    })

  }

  // 获取订单下有备注的网站详情
  getRemarkWebsiteDetail(websiteId) {
    return new Promise(resolve => {
      this.beianHomeService.getRemarkWebsiteDetail(websiteId).subscribe(data => {
        if (data.code == 0) {
          const remarks = data.result.remarks;
          remarks.forEach(item => {
            this.remarkObj[item.code] = item.remark;
            this.remarkObj['new' + item.code] = item.remark;
          });
          this.formatDetail(data.result);
          resolve(data.result)
        }
      })
    })
  }

  // 获取主办人
  getSponsorsUser(): void {
    this.beianHomeService.getSponsorsUser({
      id: this.param.sponsorId,
      timestamp: new Date().valueOf()
    }).subscribe(data => {
      if (data.code == 0) {
        data.result.isPersonal = JSON.parse(data.result.isPersonal);
        this.radio = { ...this.radio, ...data.result };
      }
    });
  }

  timestamp: any = '';
  countLabel = '获取手机验证码';
  private startCountdown(countdown: number) {
    setTimeout(() => {
      countdown -= 1000;
      this.countLabel = parseInt((countdown * 0.001).toString()) + 's 后可重新获取验证码';
      if (countdown > 0) {
        this.startCountdown(countdown);
      } else {
        this.countLabel = '获取手机验证码';
      }
    }, 1000);
  };

  // 手机验证码
  getVerifyCode(mobile): void {
    this.timestamp = new Date().valueOf();
    this.beianHomeService.getVerifyCode({
      mobile,
      timestamp: this.timestamp
    }).subscribe(data => {
      if (data.code == 0) {
        this.message.success('手机验证码已发送，请注意查收');
        this.startCountdown(60000);
      } else {
        this.message.warning(data.message);
      }
    })
  }

  getDomains(param) {
    return new Promise(resolve => {
      this.beianHomeService.getDomains(param).subscribe(data => {
        if (data.code == 0) {
          this.websitesParam.domainList = Object.assign(data.result);
          this.domainList = data.result;
          resolve(data.result);
        }
      })
    });
  }


  private ifReview(websitelist) {
    return window.location.pathname.indexOf(websitelist) >= 0;
  }

  param: any = {
    sponsorId: "",
    orderId: "",
    type: 1,
    isEdit: false // 订单修改
  }

  checkIfContinue() {
    if (this.continueWebsites && this.continueWebsites.length >= 0) {
      return (this.continueWebsites.length < (typeinfo[this.param.type].websitecount-1) || (this.websiteId && this.continueWebsites.length < typeinfo[this.param.type].websitecount)) && !this.websitesListShow;
    }
    return (this.websites.length < (typeinfo[this.param.type].websitecount-1) || (this.websiteId && this.websites.length < typeinfo[this.param.type].websitecount)) && !this.websitesListShow;
  };

  async init() {
    if (this.ifReview('websitelist')) {
      this.websitesListShow = true;
    }

    if (this.ifReview('websitesreview') || this.ifReview('websitelistview')) {
      this.remarkShow = true;
    }
    const ifAdd = this.ifReview('websitesadd');
    this.websiteId = this.route.snapshot.paramMap.get('websiteId');
    this.param = Object.assign(this.param, this.route.snapshot.queryParams);
    const param = {
      sponsorId: this.param.sponsorId,
      orderId: this.param.orderId,
      type: this.param.type
    }
    this.isEditOrder = JSON.parse(this.param.isEdit);
    this.getSponsorsUser();

    this.getWebsites(param, async (website) => {
      if (!ifAdd && !this.websiteId && website.id) {
        await this.getWebsiteDetail(website.id);
      }
      if ((param.orderId && this.websitesParam.domainList.length == 0) || !website.id) {
        this.getDomains(param);
      }

    });

    await this.getApprovalsTypes();
    await this.getCertificates();

    if (this.websiteId) { // 编辑
      await this.getWebsiteDetail(this.websiteId); // 域名顺序先domain后显示detail
      this.isEdit = true;

      if (param.orderId && this.websitesParam.domainList.length == 0) {
        this.getDomains(param);
      }

    }

  }
  
  async ngOnInit() {
  }

}

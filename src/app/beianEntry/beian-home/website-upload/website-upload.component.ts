import {Component, OnInit} from '@angular/core';
import {Environment} from '../../../../environments/environment';
import {NzNotificationService, UploadFile} from 'ng-zorro-antd';
import {NzMessageService} from 'ng-zorro-antd';
import {BeianHomeService} from '../beian-home.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Router} from '@angular/router';
import {BeforeUploadService} from '../common-serve/before-upload.service';


@Component({
  selector: 'app-website-upload',
  templateUrl: './website-upload.component.html',
  styleUrls: ['./website-upload.component.css']
})
export class WebsiteUploadComponent implements OnInit {
  constructor(private message: NzMessageService,
              private beianHomeService: BeianHomeService,
              private router: ActivatedRoute,
              private route: Router,
              private notification: NzNotificationService,
              private beforeUploadService: BeforeUploadService) {
  }

  // 显示预览，移除的图标
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };

  uploadUrl = `${Environment.application.bssAPI}/file/upload/thumbs`;
  previewImage = '';
  previewVisible = false;

  imgLoadUrl = Environment.application.bssFront;

  // 预览
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };
  otherPreviewImage = '';
  otherPreviewVisible = false;
  otherHandlePreview = (file: UploadFile) => {
    this.otherPreviewImage = file.url || file.thumbUrl;
    this.otherPreviewVisible = true;
  };

  // 放入上传的材料
  list = [];

  // 提交初审的提示信息
  submitNoteShow = false;

  // 主体或者网站提交数据
  sponsorOrWebsiteParams = {
    id: '',
    typeId: '',
    orderId: '',
    submitList: [],
    sponsorId:'',
    websiteId:[]
  };

  // 上传页面初始化时，获取相应的附件
  annexList = {
    orderId: '',
    timestamp: '',
    sponsorId: ''
  };
  // 主体id
  sponsorId;
  // 网站id
  websiteId;


  basicShowParams = {
    websiteName: '',
    headerName: '',
  };


  //备案材料展示
  certificateAuthUrl;  // 法人授权书
  websiteCheckUrl;  // 网站备案信息真实性核验单

  // 主办单位负责人
  organizer;

  // 订单的id
  private orderId: any;
  // url栏数据
  info;
  // 判断企业还是个人
  isPersonal;
  // 备注
  remarks = [];
  // 网站信息修改跳转到这里，获取后台的数据
  websiteDetailParams = {
    websiteId: '',
    timestamp: ''
  };

  beforeUpload = (file: UploadFile) => {
    this.beforeUploadService.beforeUpload(file);
    if (this.beforeUploadService.beforeUploadCodeReturn() === 1) {
      return false;
    }
  }

  // 提交初审的取消
  submitCancel(): void {
    this.submitNoteShow = false;
  }

  // 提交初审的确认
  submitOk(): void {
    if (this.checked === false) {
      this.message.warning('请先勾选协议！');
      return;
    }

    // 用来判断上传的类型参数够不够
    let typeArr = [];
    this.list.forEach(data => {
      typeArr.push(data.fileAttribute);
    });

    let res = typeArr.find((val, index, arr) => {
      return val == 'idcardFace';
    });
    if (res == undefined) {
      this.message.warning('请上传身份正面！');
      return;
    }

    let idcardReverseRes = typeArr.find((val, index, arr) => {
      return val == 'idcardReverse';
    });
    if (idcardReverseRes == undefined) {
      this.message.warning('请上传身份证反面！');
      return;
    }

    // let websiteCheckRes = typeArr.find((val,index,arr)=>{
    //   return val == '';
    // })
    // if (websiteCheckRes == undefined ) {
    //   this.message.warning('请上传网站备案信息真实性核验单！');
    //   return;
    // }

    this.websiteHandle();
  }

  // 网站提交
  websiteHandle(): void {
    this.sponsorOrWebsiteParams.submitList = this.list;
    this.sponsorOrWebsiteParams.typeId = '9';
    this.sponsorOrWebsiteParams.id = this.websiteId;
    this.sponsorOrWebsiteParams.orderId = this.orderId;
    this.sponsorOrWebsiteParams.websiteId.push(this.websiteId);
    this.sponsorOrWebsiteParams.sponsorId = this.sponsorId;
    this.beianHomeService.sponsorOrWebsiteReturn(this.sponsorOrWebsiteParams).subscribe(data => {
      if (data.code === '0') {
        this.submitNoteShow = false;
        this.route.navigate(['/home/curtain'], {queryParams: {orderId: this.orderId}});
      } else {
        this.message.warning(data.message);
      }
    });
  }

  // 提交初审
  submitAudit(): void {
    this.submitNoteShow = true;
  }

  // 核验单下载
  downloadCheckFile(): void {
    window.open(this.websiteCheckUrl);
  }

  // 授权书模板
  certificateFile(): void {
    window.open(this.certificateAuthUrl);
  }


  // 返回上一步函数
  returnFunction(): void {
    this.route.navigate([`/list/${this.websiteId}/website/change`], {
      queryParams: {
        websiteId: this.websiteId,
        sponsorId: this.sponsorId,
        type: 9
      },
    });
  }

  mark
  // 网站的备注的信息
  websiteRemarks = [];
  // 网站数据
  websiteFileList = [];

  otherReg = /\b(otherData*.)/;
  httpReg = /\b(http:\/\/*.)/;
  domainReg = /\b(domainCertificate*.)/;

  // 材料数据
  otherDataFileList: any = {};
  oldOtherDataFileList: any = {};
  otherDataFileNumber = [];
  otherDataFileShow = {};
  curOtherFileList = {
    otherData0: [],
    otherData1: []
  };
  otherDataIdList: any = {};

  // 域名数据
  domainFileList: any = {};
  oldDomainFileList: any = {};
  domainFileNumber = [];
  domainFileShow: any = {};
  curDomainFileList: any = {};
  domainDataIdList: any = {};
  // domainDataRemark:any = {};
  domainDataRemark = {
    domainCertificate: {
      id: '',
      code: 'domainCertificate0',
      remarkName: '域名材料'
    }
  };

  // 网站具体数据
  fileListObj = {
    idcardFace: [],
    idcardReverse: [],
    domainCertificate: [],
    certificateAuth: [],
    websiteCheck: [],
    preApproval: [],
    otherData: []
  };

  //  为了保存用户已经上传的证件，便于用户点击取消时数据回填
  oldFileListObj = {
    idcardFace: [],
    idcardReverse: [],
    domainCertificate: [],
    certificateAuth: [],
    websiteCheck: [],
    preApproval: [],
    otherData: []
  };
  /**
   * 文件列表对象
   * */
  curFileListObj = {
    idcardFace: [],
    idcardReverse: [],
    domainCertificate: [],
    certificateAuth: [],
    websiteCheck: [],
    preApproval: [],
    otherData: []
  };
  fileIdList = {
    idcardFace: [],
    idcardReverse: [],
    domainCertificate: [],
    certificateAuth: [],
    websiteCheck: [],
    preApproval: [],
    otherData: []
  };

  // 稍后删除
  otherDataRemark = {
    otherData: {
      id: '',
      code: 'otherData0',
      remarkName: '其他材料'
    }
  };

  /**
   * 网站其他材料备注,用户数据恢复
   * */
  oldOtherDataRemark: any;

  oldDomainDataRemark: any;


  fileMessageShow = {
    idcardFace: false, // 身份证正面
    idcardReverse: false, // 身份证背面
    domainCertificate: false, //
    certificateAuth: false,
    websiteCheck: false,
    businessLicence: false,
    preApproval: false,
    otherData: false
  };

  // 网站数据处理
  websiteDataHandle(fileList, remarks): void {
    let fileTypeArr = [];
    let otherFileTypeArr = [];
    let domainFileTypeArr = [];
    fileList.forEach(fileItem => {
      // 其他材料
      if (this.otherReg.test(fileItem.fileAttribute)) {
        if (otherFileTypeArr.indexOf(fileItem.fileAttribute) < 0) {
          otherFileTypeArr.push(fileItem.fileAttribute);
          this.otherDataIdList[fileItem.fileAttribute] = [{id: fileItem.id}];
          this.otherDataFileNumber.push(fileItem.fileAttribute);
          this.otherDataFileList[fileItem.fileAttribute] = [{name: fileItem.name, url: fileItem.fuleUrl}];
          this.curOtherFileList[fileItem.fileAttribute] = [({
            id: fileItem.id,
            name: fileItem.name,
            url: fileItem.fuleUrl,
            size: fileItem.size
          })];

          this.otherDataFileShow[fileItem.fileAttribute] = false;
        } else {
          /**
           * 同时保存文件内容及缩略图*/
          this.curOtherFileList[fileItem.fileAttribute].push({
            id: fileItem.id,
            name: fileItem.name,
            url: fileItem.fuleUrl,
            size: fileItem.size
          });
          this.otherDataFileList[fileItem.fileAttribute][0]['thumbUrl'] = fileItem.fuleUrl;
          this.otherDataIdList[fileItem.fileAttribute][0]['thumbId'] = fileItem.id;
        }

      } else if (this.domainReg.test(fileItem.fileAttribute)) {
        /*域名材料*/
        if (domainFileTypeArr.indexOf(fileItem.fileAttribute) < 0) {
          domainFileTypeArr.push(fileItem.fileAttribute);
          this.domainDataIdList[fileItem.fileAttribute] = [{id: fileItem.id}];
          this.domainFileNumber.push(fileItem.fileAttribute);
          this.domainFileList[fileItem.fileAttribute] = [{name: fileItem.name, url: fileItem.fuleUrl}];
          this.curDomainFileList[fileItem.fileAttribute] = [({
            id: fileItem.id,
            name: fileItem.name,
            url: fileItem.fuleUrl,
            size: fileItem.fileSize
          })];
          this.domainFileShow[fileItem.fileAttribute] = false;
        } else {
          /**
           * 同时保存文件内容及缩略图*/
          this.curDomainFileList[fileItem.fileAttribute].push({
            id: fileItem.id,
            name: fileItem.name,
            url: fileItem.fuleUrl,
            size: fileItem.fileSize
          });
          this.domainFileList[fileItem.fileAttribute][0]['thumbUrl'] = fileItem.fuleUrl;
          this.domainDataIdList[fileItem.fileAttribute][0]['thumbId'] = fileItem.id;
        }

      } else {
        // 非其他及域名材料
        if (fileTypeArr.indexOf(fileItem.fileAttribute) < 0) {
          fileTypeArr.push(fileItem.fileAttribute);
          this.fileIdList[fileItem.fileAttribute] = [{id: fileItem.id}];
          this.fileListObj[fileItem.fileAttribute] = [{
            name: fileItem.name,
            url: fileItem.fuleUrl,
            fileAttribute: fileItem.fileAttribute,
            fileAttribute2: fileItem.fileAttribute2
          }];
          this.oldFileListObj[fileItem.fileAttribute] = [{
            name: fileItem.name,
            url: fileItem.fuleUrl,
            fileAttribute: fileItem.fileAttribute,
            fileAttribute2: fileItem.fileAttribute2
          }];
          this.curFileListObj[fileItem.fileAttribute].push({
            id: fileItem.id,
            name: fileItem.name,
            url: fileItem.fuleUrl,
            size: fileItem.fileSize
          });
        } else {
          /**
           * 同时保存文件内容及缩略图
           * */
          this.curFileListObj[fileItem.fileAttribute].push({
            id: fileItem.id,
            name: fileItem.name,
            url: fileItem.fuleUrl,
            size: fileItem.fileSize
          });
          this.fileListObj[fileItem.fileAttribute][0]['thumbUrl'] = fileItem.fuleUrl;
          this.oldFileListObj[fileItem.fileAttribute][0]['thumbUrl'] = fileItem.fuleUrl;
          this.fileIdList[fileItem.fileAttribute][0]['thumbId'] = fileItem.id;
        }
      }

    });
    this.oldOtherDataFileList = JSON.parse(JSON.stringify(this.otherDataFileList));
    this.oldDomainFileList = JSON.parse(JSON.stringify(this.domainFileList));

    for (let i = 0; i < this.domainFileNumber.length; i++) {
      this.domainDataRemark['domainCertificate' + i] = {'id': '', 'code': 'domainCertificate' + i, 'remarkName': '网站域名证书'};
    }
    for (let i = 0; i < this.otherDataFileNumber.length; i++) {
      this.domainDataRemark['otherData' + i] = {'id': '', 'code': 'otherData' + i, 'remarkName': '网站其他材料'};
    }
    if (remarks.length != 0) {
      remarks.forEach(remarkItem => {
        if (this.domainReg.test(remarkItem.code)) {
          this.domainDataRemark[remarkItem.code].id = remarkItem.id;
        }
        if (this.otherReg.test(remarkItem.code)) {
          this.otherDataRemark[remarkItem.code].id = remarkItem.id;
        }
      });
    }
    this.oldOtherDataRemark = JSON.parse(JSON.stringify(this.otherDataRemark));
    this.oldDomainDataRemark = JSON.parse(JSON.stringify(this.domainDataRemark));
  }

  /**
   * 图片上传、删除操作
   * */
  // 域名证书和网站真实性核验单特殊处理
  specialHandleChange(info: any, name: string) {
    if (info.type === 'removed') {
      let originalUrl = info.file.url || info.file.response.result['original'].url;
      let thumbUrl = '';
      if (this.httpReg.test(info.file.thumbUrl)) {
        thumbUrl = info.file.thumbUrl || info.file.response.result['thumbnail'].url;
      } else {
        thumbUrl = info.file.response.result['thumbnail'].url;
      }
      this.beianHomeService.deleteFiles([Base64.encode(originalUrl), Base64.encode(thumbUrl)]).subscribe(data => {
        if (data.code === '0') {
          // 删除两个
          this.list.forEach((value, index) => {
            if (value.fileAttribute === info.file.fileAttribute) {
              this.list.splice(index, 2);
            }
          });
          this.fileListObj[name] = [];
          this.curFileListObj[name] = [];
          this.message.success(data.message);
        } else {
          this.message.warning(data.message);
        }
      });
    } else {
      if (info.file.response && info.file.response.code == '0') {
        this.curFileListObj[name] = [];
        let originalFileObj = {
          id: this.fileIdList[name][0].id,
          name: info.file.response.result['original'].name,
          size: info.file.response.result['original'].size,
          url: info.file.response.result['original'].url,
          moduleId: this.websiteId,
          fileAttribute: name,
          fileAttribute2: 'original'
        };
        this.list.push(originalFileObj);
        this.curFileListObj[name].push(originalFileObj);
        let thumbFileObj = {
          id: this.fileIdList[name][0].thumbId,
          name: info.file.response.result['thumbnail'].name,
          size: info.file.response.result['thumbnail'].size,
          url: info.file.response.result['thumbnail'].url,
          moduleId: this.websiteId,
          fileAttribute: name,
          fileAttribute2: 'thumbnail'
        };
        this.list.push(thumbFileObj);
        this.curFileListObj[name].push(thumbFileObj);
      } else if (info.file.response && info.file.response.code != '0') {
        this.notification.create('error', '上传失败，请稍后重试', '错误信息：' + info.file.response.message, {nzDuration: 10000});
      }
    }
  }

  fileHandleChange(info: any, name: string) {
    if (info.type === 'removed') {
      let originalUrl = info.file.url || info.file.response.result['original'].url;
      let thumbUrl = '';
      if (this.httpReg.test(info.file.thumbUrl)) {
        thumbUrl = info.file.thumbUrl || info.file.response.result['thumbnail'].url;
      } else {
        thumbUrl = info.file.response.result['thumbnail'].url;
      }
      this.beianHomeService.deleteFiles([Base64.encode(originalUrl), Base64.encode(thumbUrl)]).subscribe(data => {
        if (data.code === '0') {
          // 删除两个
          this.list.forEach((value, index) => {
            if (value.fileAttribute === info.file.fileAttribute) {
              this.list.splice(index, 2);
            }
          });
          this.fileListObj[name] = [];
          this.curFileListObj[name] = [];
          this.message.success(data.message);
        } else {
          this.message.warning(data.message);
        }
      });
    } else {
      if (info.file.response && info.file.response.code == '0') {
        this.curFileListObj[name] = [];
        let originalFileObj = {
          id: this.fileIdList[name][0].id,
          name: info.file.response.result['original'].name,
          size: info.file.response.result['original'].size,
          url: info.file.response.result['original'].url,
          moduleId: this.websiteId,
          fileAttribute: name,
          fileAttribute2: 'original'
        };
        this.list.push(originalFileObj);
        this.curFileListObj[name].push(originalFileObj);
        let thumbFileObj = {
          id: this.fileIdList[name][0].thumbId,
          name: info.file.response.result['thumbnail'].name,
          size: info.file.response.result['thumbnail'].size,
          url: info.file.response.result['thumbnail'].url,
          moduleId: this.websiteId,
          fileAttribute: name,
          fileAttribute2: 'thumbnail'
        };
        this.list.push(thumbFileObj);
        this.curFileListObj[name].push(thumbFileObj);
      } else if (info.file.response && info.file.response.code != '0') {
        this.notification.create('error', '上传失败，请稍后重试', '错误信息：' + info.file.response.message, {nzDuration: 10000});
      }
    }
  }

  otherFileHandleChange(info: any, name: string, type) {
    if (info.type === 'removed') {
      let originalUrl = info.file.url || info.file.response.result['original'].url;
      let thumbUrl = '';
      if (this.httpReg.test(info.file.thumbUrl)) {
        thumbUrl = info.file.thumbUrl || info.file.response.result['thumbnail'].url;
      } else {
        thumbUrl = info.file.response.result['thumbnail'].url;
      }
      this.beianHomeService.deleteFiles([Base64.encode(originalUrl), Base64.encode(thumbUrl)]).subscribe(data => {
        if (data.code === '0') {
          // 删除两个
          this.list.forEach((value, index) => {
            if (value.fileAttribute === name) {
              this.list.splice(index, 2);
            }
          });
          if (type == 'other') {
            this.otherDataFileList[name] = [];
            this.curOtherFileList[name] = [];
          }
          if (type == 'domain') {
            this.domainFileList[name] = [];
            this.curDomainFileList[name] = [];
          }
          this.message.success(data.message);
        } else {
          this.message.warning(data.message);
        }
      });
    } else {
      if (info.file.response && info.file.response.code == '0') {
        this.curOtherFileList[name] = [];
        let originalFileObj = {
          id: type == 'other' ? this.otherDataIdList[name][0].id : this.domainDataIdList[name][0].id,
          name: info.file.response.result['original'].name,
          size: info.file.response.result['original'].size,
          url: info.file.response.result['original'].url,
          moduleId: this.websiteId,
          fileAttribute: name,
          fileAttribute2: 'original'
        };
        if (type == 'other') {
          this.list.push(originalFileObj);
          this.curOtherFileList[name].push(originalFileObj);
        } else {
          this.list.push(originalFileObj);
          this.curDomainFileList[name].push(originalFileObj);
        }
        let thumbFileObj = {
          id: type == 'other' ? this.otherDataIdList[name][0].thumbId : this.domainDataIdList[name][0].thumbId,
          name: info.file.response.result['thumbnail'].name,
          size: info.file.response.result['thumbnail'].size,
          url: info.file.response.result['thumbnail'].url,
          moduleId: this.websiteId,
          fileAttribute: name,
          fileAttribute2: 'thumbnail'
        };
        // this.curOtherFileList[name].push(thumbFileObj);
        if (type == 'other') {
          this.list.push(thumbFileObj);
          this.curOtherFileList[name].push(thumbFileObj);
        } else {
          this.list.push(thumbFileObj);
          this.curDomainFileList[name].push(thumbFileObj);
        }
      } else if (info.file.response && info.file.response.code != '0') {
        this.notification.create('error', '上传失败，请稍后重试', '错误信息：' + info.file.response.message, {nzDuration: 10000});
      }
    }
  }

  // 网站修改下一步上传
  websiteNextShow(): void {
    this.websiteDetailParams.websiteId = this.websiteId;
    this.websiteDetailParams.timestamp = new Date().getTime().toString();
    this.beianHomeService.websiteChangeNextShow(this.websiteDetailParams).subscribe(data => {
      if (data.code === '0') {
        this.websiteRemarks = data.result.remarks;
        this.websiteFileList = data.result.websiteEntity.fileList;

        // 处理法人授权书
        /*this.websiteFileList.forEach(templateDetail => {
          if (templateDetail.fileAttribute == "legalAuthorization") {
            this.certificateAuthUrl = templateDetail.fuleUrl;
          }
        });*/
        // 所有的数据
        this.list = JSON.parse(JSON.stringify(this.websiteFileList));
        this.basicShowParams.websiteName = data.result.websiteEntity.websiteName;
        this.basicShowParams.headerName = data.result.websiteEntity.headerName;
        this.websiteDataHandle(this.websiteFileList, this.websiteRemarks);
      } else {
        this.message.warning(data.message);
      }
    });
  }

  checked;
  infoShow = false;
  infoTwoShow = false;

  // 更新单选框
  updateCheckedFunction(info): void {
    this.checked = info;
  }

  wordOpen(): void {
    this.infoShow = true;
  }

  wordTwoOpen(): void {
    this.infoTwoShow = true;
  }

  getTemplateData(): void {
    this.beianHomeService.initGetUploadData(this.annexList).subscribe(data => {
      data.result.fileList.forEach(templateDetail => {
        if (templateDetail.fileAttribute == "legalAuthorization") {
          // 法人授权书
          this.certificateAuthUrl = templateDetail.fuleUrl;
        }
      });
    });
  }

  ngOnInit() {
    this.checked = false;
    this.router.queryParams.subscribe((params: Params) => {
      this.orderId = params['orderId'];
    });
    this.annexList.orderId = this.orderId;

    this.info = Object.assign({}, this.router.snapshot.queryParams);
    this.info.isEdit = this.info.isEdit ? JSON.parse(this.info.isEdit) : false;
    this.annexList.timestamp = new Date().getTime().toString();
    this.router.queryParams.subscribe((params: Params) => {
      this.annexList.sponsorId = params['sponsorId'];
    });
    this.sponsorId = this.annexList.sponsorId;

    this.router.queryParams.subscribe((params: Params) => {
      this.websiteId = params['websiteId'];
    });

    this.websiteNextShow();
    this.getTemplateData();

  }

}

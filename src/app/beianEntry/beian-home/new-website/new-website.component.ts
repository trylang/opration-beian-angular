import {Component, OnInit} from '@angular/core';
import {Environment} from '../../../../environments/environment';
import {UploadFile} from 'ng-zorro-antd';
import {NzMessageService} from 'ng-zorro-antd';
import {BeianHomeService} from '../beian-home.service';
import {ActivatedRoute, Params} from '@angular/router';
import {Router} from '@angular/router';
import {UploadSampleService} from '../common-serve/upload-sample.service';
import {BeforeUploadService} from '../common-serve/before-upload.service';


@Component({
  selector: 'app-new-website',
  templateUrl: './new-website.component.html',
  styleUrls: ['./new-website.component.css']
})
export class NewWebsiteComponent implements OnInit {

  constructor(private message: NzMessageService,
              private beianHomeService: BeianHomeService,
              private router: ActivatedRoute,
              private route: Router,
              private uploadSampleService: UploadSampleService,
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
  checked;
  infoShow = false;
  infoTwoShow = false;

  imgLoadUrl = Environment.application.bssFront;

  // 预览
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  // 放入上传的材料
  list = [];

  // 提交初审的提示信息
  submitNoteShow = false;

  // 提交初审数据
  submitAuditDataParams = {
    submitList: [],
    id: '',  // 主体id
    typeId: '', // 订单类型
    orderId: '',
    sponsorId: '',
    websiteId: []
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


  // 所有的网站数据
  websitesData = [{
    // 身份证正面
    idCard: [{
      url: '',
      id: ''
    }],
    // 身份证反面
    idCardReverse: [{
      url: '',
      id: ''
    }],
    // 法人授权书
    LegalAuthorization: [{
      url: '',
      id: ''
    }],
    // 网站信息真实性核验单
    check: [{
      url: '',
      id: ''
    }],
    // 域名证书
    domainCertificate: [{
      url: '',
      id: ''
    }],
    // 网站负责人
    headerName: '',
    // 网站的id
    id: '',
    // 网站前置审批材料
    mainData: [{
      url: '',
      id: ''
    }],
    // 其他材料
    otherData: [{
      url: '',
      id: ''
    }],
    otherDataList: [
      {
        fileList: []
      }
    ],
    domainList: [
      {
        domain: '',
        id: '',
        isFirst: 0,
        fileList: []
      }
    ],
    // 手机号
    telephone1: '',
    // 网站的名字
    websiteName: ''
  }];

  //备案材料展示
  certificateAuthUrl;  // 法人授权书
  websiteCheckUrl;  // 网站备案信息真实性核验单

  // 模板文件
  templateFile;

  // 主办单位负责人
  organizer;
  // 主办单位
  mainWork;

  // 订单的id
  private orderId: any;
  // url栏数据
  info;
  // 备案主体类型
  certificationId;

  // 备案主体负责人参数
  headerType;
  // 备案主体负责人证件类型
  headerTypeName;
  // 域名
  domainList = [];
  // 网站的长度
  websitesLength;
  // 判断流程
  type;

  httpReg = /\b(http:\/\/*.)/;

  beforeUpload = (file: UploadFile) => {
    this.beforeUploadService.beforeUpload(file);
    if (this.beforeUploadService.beforeUploadCodeReturn() === 1) {
      return false;
    }
  }

  // 主办单位参数
  organizerParams = {
    name: '',
    url: '',
    size: '',
    fileAttribute: '',
    fileAttribute2: '',
    moduleId: ''
  };
  organizerThumbnailParams = {
    name: '',
    url: '',
    size: '',
    fileAttribute: '',
    fileAttribute2: '',
    moduleId: ''
  };
  // 主办单位证件
  businessLicenceFunction(info:any):void {
    this.organizerParams.moduleId = this.sponsorId;
    this.organizerThumbnailParams.moduleId = this.sponsorId;
    this.organizerParams.fileAttribute = this.certificationId;
    this.organizerThumbnailParams.fileAttribute = this.certificationId;
    // 上传数据处理
    if (info.type === "removed") {
      const originalUrl = info.file.url || info.file.response.result['original'].url;
      let thumbUrl = '';
      if (this.httpReg.test(info.file.thumbUrl)) {
        thumbUrl = info.file.thumbUrl || info.file.response.result['thumbnail'].url;
      } else {
        thumbUrl = info.file.response.result['thumbnail'].url;
      }
      this.beianHomeService.deleteFiles([Base64.encode(originalUrl), Base64.encode(thumbUrl)]).subscribe(data => {
        if (data.code === '0') {
          this.list.forEach((value, index) => {
            if (value.fuleUrl === info.file.thumbUrl) {
              this.list.splice(index, 2);
            }
          });
        } else {
          this.message.warning(data.message);
        }
      });
    } else {
      if (info.file.response) {
        // 原图
        this.organizerParams.name = info.file.response.result.original.name;
        this.organizerParams.url = info.file.response.result.original.url;
        this.organizerParams.size = info.file.response.result.original.size;
        this.organizerParams.fileAttribute2 = 'original';
        this.list.push(JSON.parse(JSON.stringify(this.organizerParams)));

        // 缩略图
        this.organizerThumbnailParams.name = info.file.response.result.thumbnail.name;
        this.organizerThumbnailParams.url = info.file.response.result.thumbnail.url;
        this.organizerThumbnailParams.size = info.file.response.result.thumbnail.size;
        this.organizerThumbnailParams.fileAttribute2 = 'thumbnail';
        this.list.push(JSON.parse(JSON.stringify(this.organizerThumbnailParams)));
      }
    }
  }

  // 主办单位负责人身份证正面
  organizerFileParams = {
    name: '',
    url: '',
    size: '',
    fileAttribute: '',
    fileAttribute2: '',
    moduleId: ''
  };
  organizerFileThumbnailParams = {
    name: '',
    url: '',
    size: '',
    fileAttribute: '',
    fileAttribute2: '',
    moduleId: ''
  };
  organizerFileFunction(info:any):void {
    this.organizerFileParams.moduleId = this.sponsorId;
    this.organizerFileThumbnailParams.moduleId = this.sponsorId;
    this.organizerFileParams.fileAttribute = 'idcardFace';
    this.organizerFileThumbnailParams.fileAttribute = 'idcardFace';
    if (info.type === "removed") {
      const originalUrl = info.file.url || info.file.response.result['original'].url;
      let thumbUrl = '';
      if(this.httpReg.test(info.file.thumbUrl)) {
        thumbUrl = info.file.thumbUrl || info.file.response.result['thumbnail'].url;
      } else {
        thumbUrl = info.file.response.result['thumbnail'].url;
      }
      this.beianHomeService.deleteFiles([Base64.encode(originalUrl), Base64.encode(thumbUrl)]).subscribe(data => {
        if (data.code === '0') {
          this.list.forEach((value, index) => {
            if (value.fuleUrl === info.file.thumbUrl) {
              this.list.splice(index, 2);
            }
          });
        } else {
          this.message.warning(data.message);
        }
      });
    } else {
      if (info.file.response) {
        // 原图
        this.organizerFileParams.name = info.file.response.result.original.name;
        this.organizerFileParams.url = info.file.response.result.original.url;
        this.organizerFileParams.size = info.file.response.result.original.size;
        this.organizerFileParams.fileAttribute2 = 'original';
        this.list.push(JSON.parse(JSON.stringify(this.organizerFileParams)));

        // 缩略图
        this.organizerFileThumbnailParams.name = info.file.response.result.thumbnail.name;
        this.organizerFileThumbnailParams.url = info.file.response.result.thumbnail.url;
        this.organizerFileThumbnailParams.size = info.file.response.result.thumbnail.size;
        this.organizerFileThumbnailParams.fileAttribute2 = 'thumbnail';
        this.list.push(JSON.parse(JSON.stringify(this.organizerFileThumbnailParams)));
      }
    }
  }

  // 主办单位负责人身份证反面
  organizerFileReverseParams = {
    name: '',
    url: '',
    size: '',
    fileAttribute: '',
    fileAttribute2: '',
    moduleId: ''
  };
  organizerFileReverseThumbnailParams = {
    name: '',
    url: '',
    size: '',
    fileAttribute: '',
    fileAttribute2: '',
    moduleId: ''
  };
  organizerFileReverseFunction(info:any):void {
    this.organizerFileReverseParams.moduleId = this.sponsorId;
    this.organizerFileReverseThumbnailParams.moduleId = this.sponsorId;
    this.organizerFileReverseParams.fileAttribute = 'idcardReverse';
    this.organizerFileReverseThumbnailParams.fileAttribute = 'idcardReverse';
    if (info.type === "removed") {
      const originalUrl = info.file.url || info.file.response.result['original'].url;
      let thumbUrl = '';
      if(this.httpReg.test(info.file.thumbUrl)) {
        thumbUrl = info.file.thumbUrl || info.file.response.result['thumbnail'].url;
      } else {
        thumbUrl = info.file.response.result['thumbnail'].url;
      }
      this.beianHomeService.deleteFiles([Base64.encode(originalUrl), Base64.encode(thumbUrl)]).subscribe(data => {
        if (data.code === '0') {
          this.list.forEach((value, index) => {
            if (value.fuleUrl === info.file.thumbUrl) {
              this.list.splice(index, 2);
            }
          });

        } else {
          this.message.warning(data.message);
        }
      });
    } else {
      if (info.file.response) {
        // 原图
        this.organizerFileReverseParams.name = info.file.response.result.original.name;
        this.organizerFileReverseParams.url = info.file.response.result.original.url;
        this.organizerFileReverseParams.size = info.file.response.result.original.size;
        this.organizerFileReverseParams.fileAttribute2 = 'original';
        this.list.push(JSON.parse(JSON.stringify(this.organizerFileReverseParams)));

        // 缩略图
        this.organizerFileReverseThumbnailParams.name = info.file.response.result.thumbnail.name;
        this.organizerFileReverseThumbnailParams.url = info.file.response.result.thumbnail.url;
        this.organizerFileReverseThumbnailParams.size = info.file.response.result.thumbnail.size;
        this.organizerFileReverseThumbnailParams.fileAttribute2 = 'thumbnail';
        this.list.push(JSON.parse(JSON.stringify(this.organizerFileReverseThumbnailParams)));
      }
    }
  }

  // 特殊材料,主体负责人
  specialMessageParams = {
    name: '',
    url: '',
    size: '',
    fileAttribute: '',
    fileAttribute2: '',
    moduleId: ''
  }
  specialMessageThumbnailParams = {
    name: '',
    url: '',
    size: '',
    fileAttribute: '',
    fileAttribute2: '',
    moduleId: ''
  }

  specialFileFunction(info:any):void {
    this.specialMessageParams.moduleId = this.sponsorId;
    this.specialMessageThumbnailParams.moduleId = this.sponsorId;
    this.specialMessageParams.fileAttribute = this.headerType;
    this.specialMessageThumbnailParams.fileAttribute = this.headerType;
    if (info.type === "removed") {
      const originalUrl = info.file.url || info.file.response.result['original'].url;
      let thumbUrl = '';
      if (this.httpReg.test(info.file.thumbUrl)) {
        thumbUrl = info.file.thumbUrl || info.file.response.result['thumbnail'].url;
      } else {
        thumbUrl = info.file.response.result['thumbnail'].url;
      }
      this.beianHomeService.deleteFiles([Base64.encode(originalUrl), Base64.encode(thumbUrl)]).subscribe(data => {
        if (data.code === '0') {
          this.list.forEach((value, index) => {
            if (value.fuleUrl === info.file.thumbUrl) {
              this.list.splice(index, 2);
            }
          });
        } else {
          this.message.warning(data.message);
        }
      });
    } else {
      if (info.file.response) {
        // 原图
        this.specialMessageParams.name = info.file.response.result.original.name;
        this.specialMessageParams.url = info.file.response.result.original.url;
        this.specialMessageParams.size = info.file.response.result.original.size;
        this.specialMessageParams.fileAttribute2 = 'original';
        this.list.push(JSON.parse(JSON.stringify(this.specialMessageParams)));

        // 缩略图
        this.specialMessageThumbnailParams.name = info.file.response.result.thumbnail.name;
        this.specialMessageThumbnailParams.url = info.file.response.result.thumbnail.url;
        this.specialMessageThumbnailParams.size = info.file.response.result.thumbnail.size;
        this.specialMessageThumbnailParams.fileAttribute2 = 'thumbnail';
        this.list.push(JSON.parse(JSON.stringify(this.specialMessageThumbnailParams)));
      }
    }
  }

  // 网站身份证正面
  idCardParams = {
    name: '',
    url: '',
    size: '',
    fileAttribute: '',
    fileAttribute2: '',
    moduleId: '',
    uid:''
  };
  idCardThumbnailParams = {
    name: '',
    url: '',
    size: '',
    fileAttribute: '',
    fileAttribute2: '',
    moduleId: '',
    uid:''
  };

  idCardFunction(info: any, moduleId): void {
    this.idCardParams.moduleId = moduleId;
    this.idCardThumbnailParams.moduleId = moduleId;
    this.idCardParams.fileAttribute = 'idcardFace';
    this.idCardThumbnailParams.fileAttribute = 'idcardFace';
    this.idCardParams.uid = info.file.uid;
    this.idCardThumbnailParams.uid = info.file.uid;
    if (info.type === 'removed') {
      let originalUrl = info.file.response.result['original'].url;
      let thumbUrl = info.file.response.result['thumbnail'].url;
      this.beianHomeService.deleteFiles([Base64.encode(originalUrl), Base64.encode(thumbUrl)]).subscribe(data => {
        if (data.code === '0') {
          this.list.forEach((value, index) => {
            if (value.uid === info.file.uid) {
              this.list.splice(index, 2);
            }
          });
        } else {
          this.message.warning(data.message);
        }
      });
    } else {
      if (info.file.response) {
        // 原图
        this.idCardParams.name = info.file.response.result.original.name;
        this.idCardParams.url = info.file.response.result.original.url;
        this.idCardParams.size = info.file.response.result.original.size;
        this.idCardParams.fileAttribute2 = 'original';
        this.list.push(JSON.parse(JSON.stringify(this.idCardParams)));

        // 缩略图
        this.idCardThumbnailParams.name = info.file.response.result.thumbnail.name;
        this.idCardThumbnailParams.url = info.file.response.result.thumbnail.url;
        this.idCardThumbnailParams.size = info.file.response.result.thumbnail.size;
        this.idCardThumbnailParams.fileAttribute2 = 'thumbnail';
        this.list.push(JSON.parse(JSON.stringify(this.idCardThumbnailParams)));

      }
    }
  }


  // 网站身份证反面
  idCardReverseParams = {
    name: '',
    url: '',
    size: '',
    fileAttribute: '',
    fileAttribute2: '',
    moduleId: '',
    uid:''
  };
  idCardReverseThumbnailParams = {
    name: '',
    url: '',
    size: '',
    fileAttribute: '',
    fileAttribute2: '',
    moduleId: '',
    uid:''
  };

  idCardReverseFunction(info: any, moduleId): void {
    this.idCardReverseParams.moduleId = moduleId;
    this.idCardReverseThumbnailParams.moduleId = moduleId;
    this.idCardReverseParams.fileAttribute = 'idcardReverse';
    this.idCardReverseThumbnailParams.fileAttribute = 'idcardReverse';
    this.idCardReverseParams.uid = info.file.uid;
    this.idCardReverseThumbnailParams.uid = info.file.uid;
    if (info.type === 'removed') {
      let originalUrl = info.file.response.result['original'].url;
      let thumbUrl = info.file.response.result['thumbnail'].url;
      this.beianHomeService.deleteFiles([Base64.encode(originalUrl), Base64.encode(thumbUrl)]).subscribe(data => {
        if (data.code === '0') {
          this.list.forEach((value, index) => {
            if (value.uid === info.file.uid) {
              this.list.splice(index, 2);
            }
          });
        } else {
          this.message.warning(data.message);
        }
      });
    } else {
      if (info.file.response) {
        // 原图
        this.idCardReverseParams.name = info.file.response.result.original.name;
        this.idCardReverseParams.url = info.file.response.result.original.url;
        this.idCardReverseParams.size = info.file.response.result.original.size;
        this.idCardReverseParams.fileAttribute2 = 'original';
        this.list.push(JSON.parse(JSON.stringify(this.idCardReverseParams)));

        // 缩略图
        this.idCardReverseThumbnailParams.name = info.file.response.result.thumbnail.name;
        this.idCardReverseThumbnailParams.url = info.file.response.result.thumbnail.url;
        this.idCardReverseThumbnailParams.size = info.file.response.result.thumbnail.size;
        this.idCardReverseThumbnailParams.fileAttribute2 = 'thumbnail';
        this.list.push(JSON.parse(JSON.stringify(this.idCardReverseThumbnailParams)));

      }
    }
  }

  // 网站域名证书
  domainCertificateFunction(info: any, moduleId, i): void {
    const domainCertificateParams = {
      name: '',
      url: '',
      size: '',
      fileAttribute: '',
      fileAttribute2: '',
      moduleId: '',
      uid:''
    };
    const domainCertificateThumbnailParams = {
      name: '',
      url: '',
      size: '',
      fileAttribute: '',
      fileAttribute2: '',
      moduleId: '',
      uid:''
    };
    domainCertificateParams.moduleId = moduleId;
    domainCertificateThumbnailParams.moduleId = moduleId;
    domainCertificateParams.fileAttribute = 'domainCertificate' + i;
    domainCertificateThumbnailParams.fileAttribute = 'domainCertificate' + i;
    domainCertificateParams.uid = info.file.uid;
    domainCertificateThumbnailParams.uid = info.file.uid;
    if (info.type === 'removed') {
      let originalUrl = info.file.response.result['original'].url;
      let thumbUrl = info.file.response.result['thumbnail'].url;
      this.beianHomeService.deleteFiles([Base64.encode(originalUrl), Base64.encode(thumbUrl)]).subscribe(data => {
        if (data.code === '0') {
          this.list.forEach((value, index) => {
            if (value.uid === info.file.uid) {
              this.list.splice(index, 2);
            }
          });
        } else {
          this.message.warning(data.message);
        }
      });
    } else {
      if (info.file.response) {
        // 原图
        domainCertificateParams.name = info.file.response.result.original.name;
        domainCertificateParams.url = info.file.response.result.original.url;
        domainCertificateParams.size = info.file.response.result.original.size;
        domainCertificateParams.fileAttribute2 = 'original';
        this.list.push(JSON.parse(JSON.stringify(domainCertificateParams)));

        // 缩略图
        domainCertificateThumbnailParams.name = info.file.response.result.thumbnail.name;
        domainCertificateThumbnailParams.url = info.file.response.result.thumbnail.url;
        domainCertificateThumbnailParams.size = info.file.response.result.thumbnail.size;
        domainCertificateThumbnailParams.fileAttribute2 = 'thumbnail';
        this.list.push(JSON.parse(JSON.stringify(domainCertificateThumbnailParams)));

      }
    }
  }

  // 法人授权书
  LegalAuthorizationParams = {
    name: '',
    url: '',
    size: '',
    fileAttribute: '',
    fileAttribute2: '',
    moduleId: '',
    uid:''
  };
  LegalAuthorizationThumbnailParams = {
    name: '',
    url: '',
    size: '',
    fileAttribute: '',
    fileAttribute2: '',
    moduleId: '',
    uid:''
  };

  LegalAuthorizationFunction(info: any, moduleId): void {
    this.LegalAuthorizationParams.moduleId = moduleId;
    this.LegalAuthorizationThumbnailParams.moduleId = moduleId;
    this.LegalAuthorizationParams.fileAttribute = 'certificateAuth';
    this.LegalAuthorizationThumbnailParams.fileAttribute = 'certificateAuth';
    this.LegalAuthorizationParams.uid = info.file.uid;
    this.LegalAuthorizationThumbnailParams.uid = info.file.uid;
    if (info.type === 'removed') {
      let originalUrl = info.file.response.result['original'].url;
      this.beianHomeService.deleteFiles([Base64.encode(originalUrl)]).subscribe(data => {
        if (data.code === '0') {
          this.list.forEach((value, index) => {
            if (value.uid === info.file.uid) {
              this.list.splice(index, 2);
            }
          });
        } else {
          this.message.warning(data.message);
        }
      });
    } else {
      if (info.file.response) {
        // 原图
        this.LegalAuthorizationParams.name = info.file.response.result.original.name;
        this.LegalAuthorizationParams.url = info.file.response.result.original.url;
        this.LegalAuthorizationParams.size = info.file.response.result.original.size;
        this.LegalAuthorizationParams.fileAttribute2 = 'original';
        this.list.push(JSON.parse(JSON.stringify(this.LegalAuthorizationParams)));

        // 缩略图
        this.LegalAuthorizationThumbnailParams.name = info.file.response.result.thumbnail.name;
        this.LegalAuthorizationThumbnailParams.url = info.file.response.result.thumbnail.url;
        this.LegalAuthorizationThumbnailParams.size = info.file.response.result.thumbnail.size;
        this.LegalAuthorizationThumbnailParams.fileAttribute2 = 'thumbnail';
        this.list.push(JSON.parse(JSON.stringify(this.LegalAuthorizationThumbnailParams)));
      }
    }
  }

  // 真实性核验单
  checkParams = {
    name: '',
    url: '',
    size: '',
    fileAttribute: '',
    fileAttribute2: '',
    moduleId: '',
    uid:''
  };

  checkFunction(info: any, moduleId): void {
    this.checkParams.moduleId = moduleId;
    this.checkParams.fileAttribute = 'websiteCheck';
    this.checkParams.uid = info.file.uid;
    if (info.type === 'removed') {
      let originalUrl = info.file.response.result['original'].url;
      this.beianHomeService.deleteFiles([Base64.encode(originalUrl)]).subscribe(data => {
        if (data.code === '0') {
          this.list.forEach((value, index) => {
            if (value.uid === info.file.uid) {
              this.list.splice(index, 1);
            }
          });
        } else {
          this.message.warning(data.message);
        }
      });
    } else {
      if (info.file.response) {
        // 原图
        this.checkParams.name = info.file.response.result.original.name;
        this.checkParams.url = info.file.response.result.original.url;
        this.checkParams.size = info.file.response.result.original.size;
        this.checkParams.fileAttribute2 = 'original';
        this.list.push(this.checkParams);

      }
    }
  }

  // 前置审批材料
  mainDataParams = {
    name: '',
    url: '',
    size: '',
    fileAttribute: '',
    fileAttribute2: '',
    moduleId: '',
    uid:''
  };
  mainDataThumbnailParams = {
    name: '',
    url: '',
    size: '',
    fileAttribute: '',
    fileAttribute2: '',
    moduleId: '',
    uid:''
  };

  mainDataFunction(info: any, moduleId): void {
    this.mainDataParams.moduleId = moduleId;
    this.mainDataThumbnailParams.moduleId = moduleId;
    this.mainDataParams.fileAttribute = 'preApproval';
    this.mainDataThumbnailParams.fileAttribute = 'preApproval';
    this.mainDataParams.uid = info.file.uid;
    this.mainDataThumbnailParams.uid = info.file.uid;
    if (info.type === 'removed') {
      let originalUrl = info.file.response.result['original'].url;
      let thumbUrl = info.file.response.result['thumbnail'].url;
      this.beianHomeService.deleteFiles([Base64.encode(originalUrl), Base64.encode(thumbUrl)]).subscribe(data => {
        if (data.code === '0') {
          this.list.forEach((value, index) => {
            if (value.uid === info.file.uid) {
              this.list.splice(index, 2);
            }
          });
        } else {
          this.message.warning(data.message);
        }
      });
    } else {
      if (info.file.response) {
        // 原图
        this.mainDataParams.name = info.file.response.result.original.name;
        this.mainDataParams.url = info.file.response.result.original.url;
        this.mainDataParams.size = info.file.response.result.original.size;
        this.mainDataParams.fileAttribute2 = 'original';
        this.list.push(JSON.parse(JSON.stringify(this.mainDataParams)));

        // 缩略图
        this.mainDataThumbnailParams.name = info.file.response.result.thumbnail.name;
        this.mainDataThumbnailParams.url = info.file.response.result.thumbnail.url;
        this.mainDataThumbnailParams.size = info.file.response.result.thumbnail.size;
        this.mainDataThumbnailParams.fileAttribute2 = 'thumbnail';
        this.list.push(JSON.parse(JSON.stringify(this.mainDataThumbnailParams)));

      }
    }
  }

  // 其他材料
  otherDataFunction(info: any, moduleId, i): void {
    const otherDataParams = {
      name: '',
      url: '',
      size: '',
      fileAttribute: '',
      fileAttribute2: '',
      moduleId: '',
      uid: ''
    };
    const otherDataThumbnailParams = {
      name: '',
      url: '',
      size: '',
      fileAttribute: '',
      fileAttribute2: '',
      moduleId: '',
      uid: ''
    };
    otherDataParams.moduleId = moduleId;
    otherDataThumbnailParams.moduleId = moduleId;
    otherDataParams.fileAttribute = 'otherData' + i;
    otherDataThumbnailParams.fileAttribute = 'otherData' + i;
    otherDataParams.uid = info.file.uid;
    otherDataThumbnailParams.uid = info.file.uid;
    if (info.type === 'removed') {
      let originalUrl = info.file.response.result['original'].url;
      let thumbUrl = info.file.response.result['thumbnail'].url;
      this.beianHomeService.deleteFiles([Base64.encode(originalUrl), Base64.encode(thumbUrl)]).subscribe(data => {
        if (data.code === '0') {
          this.list.forEach((value, index) => {
            if (value.uid === info.file.uid) {
              this.list.splice(index, 2);
            }
          });
        } else {
          this.message.warning(data.message);
        }
      });
    } else {
      if (info.file.response) {
        // 原图
        otherDataParams.name = info.file.response.result.original.name;
        otherDataParams.url = info.file.response.result.original.url;
        otherDataParams.size = info.file.response.result.original.size;
        otherDataParams.fileAttribute2 = 'original';
        this.list.push(JSON.parse(JSON.stringify(otherDataParams)));

        // 缩略图
        otherDataThumbnailParams.name = info.file.response.result.thumbnail.name;
        otherDataThumbnailParams.url = info.file.response.result.thumbnail.url;
        otherDataThumbnailParams.size = info.file.response.result.thumbnail.size;
        otherDataThumbnailParams.fileAttribute2 = 'thumbnail';
        this.list.push(JSON.parse(JSON.stringify(otherDataThumbnailParams)));

      }
    }
  }

  // 提交初审的取消
  submitCancel(): void {
    this.submitNoteShow = false;
  }

  // 更新单选框
  updateCheckedFunction(info): void {
    this.checked = info;
  }

  // 提交初审的确认
  submitOk(): void {
    if (this.checked === false) {
      this.message.warning('请先勾选协议！');
      return;
    }

    let typeArr = [];
    this.list.forEach(data => {
      typeArr.push(data.fileAttribute);
    });

    let res = typeArr.find((val,index,arr)=>{
      return val == 'idcardFace';
    })
    if (res == undefined ) {
      this.message.warning('请上传身份证正面！');
      return;
    }

    let idcardReverseMark = typeArr.find((val,index,arr)=>{
      return val == 'idcardReverse';
    })
    if (idcardReverseMark == undefined ) {
      this.message.warning('请上传身份证反面！');
      return;
    }
    this.submitHandle();
  }


  // 官网提交
  submitHandle(): void {
    // 主体id
    this.submitAuditDataParams.submitList = this.list;
    this.submitAuditDataParams.orderId = this.orderId;
    this.submitAuditDataParams.sponsorId = this.sponsorId;
    this.beianHomeService.submitAuditData(this.submitAuditDataParams).subscribe(data => {
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

  // 授权书模板
  certificateFile(): void {
    window.open(this.certificateAuthUrl);
  }

  // 基础数据处理
  baseDataHandle(data): void {
    // 主体id
    this.submitAuditDataParams.id = data.result.sponsorEntity.id;
    // 订单类型
    this.submitAuditDataParams.typeId = data.result.typeId;

    // 网站数据
    this.websitesData = data.result.sponsorEntity.websiteList;

    this.websitesData.forEach(item => {
      // 身份证正面
      item.idCard = [];
      // 身份证反面
      item.idCardReverse = [];
      // 域名证书
      item.domainCertificate = [];
      // 法人授权书
      item.LegalAuthorization = [];
      // 网站信息真实性核验单
      item.check = [];
      // 网站前置审批材料
      item.mainData = [];
      // 其他材料
      item.otherDataList = [];
      item.otherData = [];
      const index = 0;
      item.otherDataList.push({fileList: []});
      item.domainList.forEach(i => {
        i.fileList = [];
      });
    });
    // 模板文件
    /*this.templateFile = data.result.fileList;
    this.templateFile.forEach(templateDetail => {
      if (templateDetail.fileAttribute === 'certificateAuth') {
        // 法人授权书
        this.certificateAuthUrl = this.templateFile.fuleUrl;
      }
      if (templateDetail.fileAttribute === 'websiteCheck') {
        // 网站备案信息真实性核验单
        this.websiteCheckUrl = this.templateFile.fuleUrl;
      }
    });*/

  }

  // 获取后台数据
  getData(): void {
    this.beianHomeService.initGetUploadData(this.annexList).subscribe(data => {
      if (data.code === '0') {
        // 主办单位负责人
        this.organizer = data.result.sponsorEntity.headerName;
        // 主办单位
        this.mainWork = data.result.sponsorEntity.typeName;
        this.certificationId = data.result.sponsorEntity.certificationId;
        this.headerType = data.result.sponsorEntity.headerType;
        this.headerTypeName = data.result.sponsorEntity.headerTypeName;
        this.websitesLength = data.result.sponsorEntity.websiteList.length;

        const websiteIdArr = [];
        data.result.sponsorEntity.websiteList.forEach(item =>{
          websiteIdArr.push(item.id);
        })
        this.submitAuditDataParams.websiteId = websiteIdArr;
        // 获取后台的数据处理
        this.baseDataHandle(data);
        // 主体数据
        this.getSponsorData();
      } else {
        this.message.warning(data.message);
      }

    });
  }

  sponsorReceivedData = {
    headerName:'',  // 主办单位负责人
    typeName:'',    // 主办单位
    certificationId:'',  // 证件类型
    headerType:'',   // 主体负责人的证件类型参数
    headerTypeName:'',   // 主体负责人的证件类型参数名字
    certificationName:'',  // 单位性质
    isPersonal:'',
    fileList:[]

  }

  // 原件扫描件路径
  originalScanUrl;

  personShow = false;

  // 非身份证的证件类型
  specialType = false;

  // 原件扫描件
  businessLicenceList = [];
  // 主办单位身份证正面
  organizerFileList = [];
  // 主办单位身份证反面
  organizerFileReverseList = [];
  // 特殊类型证件
  specialCardList = [];



  // 主体数据
  getSponsorData(): void {
    this.beianHomeService.sponsorChangeNextShow(this.sponsorId).subscribe(data =>{
      if (data.code === '0') {
        this.sponsorReceivedData = data.result.sponsorEntity;
        // 原件扫描件数据处理，处理不同的团体对应不用的原件扫描件模板
        this.uploadSampleService.originalScanFunction(data.result.sponsorEntity.typeId);
        this.originalScanUrl = this.uploadSampleService.originalScanResult();
        // 文件数组
        this.list = data.result.sponsorEntity.fileList;

        // 企业主体
        if (this.sponsorReceivedData.isPersonal === 'false') {
          this.personShow = false;
          // 判断传回来的类型是身份证或者其他
          if (data.result.sponsorEntity.headerType === 'idCard') {
            this.specialType = true;
          }
          this.companyReturnShowFunction(data.result.sponsorEntity.fileList);
        }
        // 个人主体
        if(this.sponsorReceivedData.isPersonal == 'true') {
          // 执行隐藏主办单位
          this.personShow = true;
          // 判断传回来的类型是身份证或者其他
          if (data.result.sponsorEntity.headerType === 'idCard'){
            this.specialType = true;
          }
          this.personReturnShwoFunction(data);
        }

      } else {
        this.message.warning(data.message);
      }
    });
  }

  // 企业主体数据回显处理
  companyReturnShowFunction(fileList): void {
    // 处理一直显示文件上传中
    if(fileList.length == '0'){
      return;
    }

    // 这里有个人主体和企业主体
    const businessLicenceList = [ {
      url: '',
      thumbUrl: ''
    }];
    // 主办单位身份证正面
    const organizerFileList = [{
      url: '',
      thumbUrl: ''
    }];
    // 主办单位身份证反面
    const organizerFileReverseList = [{
      url: '',
      thumbUrl: ''
    }];
    // 特殊类型的展示
    const specialCardList = [{
      url:'',
      thumbUrl:''
    }];

    this.businessLicenceList = businessLicenceList;
    this.organizerFileList = organizerFileList;
    this.organizerFileReverseList = organizerFileReverseList;
    this.specialCardList = specialCardList;
    fileList.forEach(item => {
      if (item.fileAttribute == this.certificationId) {
        if (item.fileAttribute2 == 'thumbnail') {
          this.businessLicenceList[0].url = item.fuleUrl;
        } else {
          this.businessLicenceList[0].thumbUrl = item.fuleUrl;
        }
      }
      if (item.fileAttribute == 'idcardFace') {
        if (item.fileAttribute2 == 'thumbnail') {
          this.organizerFileList[0].url = item.fuleUrl;
        } else {
          this.organizerFileList[0].thumbUrl = item.fuleUrl;
        }

      }
      if (item.fileAttribute == 'idcardReverse') {
        if (item.fileAttribute2 == 'thumbnail') {
          this.organizerFileReverseList[0].url = item.fuleUrl;
        } else {
          this.organizerFileReverseList[0].thumbUrl = item.fuleUrl;
        }
      }

      if (item.fileAttribute == this.headerType) {
        if (item.fileAttribute2 == 'thumbnail') {
          this.specialCardList[0].url = item.fuleUrl;
        } else {
          this.specialCardList[0].thumbUrl = item.fuleUrl;
        }
      }
    });
  }
  // 个人主体数据回显处理
  personReturnShwoFunction(data): void {
    // 处理一直显示文件上传中
    if(data.result.sponsorEntity.fileList.length == 0){
      return;
    }
    // 一开始要给数组赋值,阻止最后判空失败
    this.list = data.result.sponsorEntity.fileList;

    // 主办单位身份证正面
    const organizerFileList = [{
      url: '',
      thumbUrl: ''
    }];
    // 主办单位身份证反面
    const organizerFileReverseList = [{
      url: '',
      thumbUrl: ''
    }];

    this.organizerFileList = JSON.parse(JSON.stringify(organizerFileList));
    this.organizerFileReverseList = JSON.parse(JSON.stringify(organizerFileReverseList));

    const fileShowList = data.result.sponsorEntity.fileList;
    fileShowList.forEach(item => {
      if (item.fileAttribute == 'idcardFace') {
        if (item.fileAttribute2 == 'thumbnail') {
          this.organizerFileList[0].url = item.fuleUrl;
        } else {
          this.organizerFileList[0].thumbUrl = item.fuleUrl;
        }
      }
      if (item.fileAttribute == 'idcardReverse') {
        if (item.fileAttribute2 == 'thumbnail') {
          this.organizerFileReverseList[0].url = item.fuleUrl;
        } else {
          this.organizerFileReverseList[0].thumbUrl = item.fuleUrl;
        }
      }
    });
  }



  // 返回上一步函数
  returnFunction(): void {
    let param = {sponsorId: this.info.sponsorId, orderId: this.info.orderId , type: this.type};
    this.route.navigate(['/home/type/organizer/websitelist'], {queryParams: this.info.isEdit ? {isEdit: true, ...param} : param});
  }

  // 其他材料数组
  otherDataList = [];

  addOther(index) {
    this.websitesData[index].otherDataList.push({fileList: []});
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
    this.router.queryParams.subscribe((params: Params) => {
      this.type = params['type'];
    });
    this.info = Object.assign({}, this.router.snapshot.queryParams);
    this.info.isEdit = this.info.isEdit ? JSON.parse(this.info.isEdit) : false;
    // 官网侧流程
    this.annexList.timestamp = new Date().getTime().toString();

    // 获取路径中的orderId
    this.router.queryParams.subscribe((params: Params) => {
      this.annexList.orderId = params['orderId'];
    });
    this.orderId = this.annexList.orderId;

    this.router.queryParams.subscribe((params: Params) => {
      this.annexList.sponsorId = params['sponsorId'];
    });
    this.sponsorId = this.annexList.sponsorId;

    this.checked = false;

    this.getData();
    this.getTemplateData();
  }


}


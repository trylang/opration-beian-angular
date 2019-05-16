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
  selector: 'app-auditfail-upload',
  templateUrl: './auditfail-upload.component.html',
  styleUrls: ['./auditfail-upload.component.css']
})
export class AuditfailUploadComponent implements OnInit {
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };

  /**
   * 相应的参数
   */
  type;
  mark;

  homeUrl;
  isSub = true;
  certificate_fileList = {
    fileList: [],
    Customary: {
      size: 0,
      name: '',
      fuleUrl: '',
      moduleId: '',
      id: '',
    },
    Narrowed: {
      size: 0,
      name: '',
      fuleUrl: '',
      moduleId: '',
      id: '',
    }
  };
  /*第一块的内容*/
  Relevant_association_fileList = {
    fileList: [],
    Customary: {
      size: 0,
      name: '',
      fuleUrl: '',
      moduleId: '',
      id: '',
    },
    /*第二块的内容*/
    Narrowed: {
      size: 0,
      name: '',
      fuleUrl: '',
      moduleId: '',
      id: '',
    },
    response: {}
  };

  imgLoadUrl = Environment.application.bssFront;
  originalScanUrl;
  websitesData = [];
  // submitAuditDataParams;
  getHomeCertificationName;
  previewImage: string | undefined = '';
  previewVisible = false;
  infoShow = false;
  infoTwoShow = false;
  originalScan;
  annexList = {
    orderId: '',
    timestamp: '',
    sponsorId: ''
  };
  organizer;
  mainWork;
  certificationId;
  headerType;
  personShow;
  newTypeMark;
  labelName;
  orderId;
  templateFile;
  websiteCheckUrl;
  list = [];
  typeArr = [];
  certificateAuthUrl;  // 法人授权书
  submitNoteShow = false;
  checked = false;
  bodyId;
  typeId;
  certificationName;
  headerTypeName;
  sponsorName;
  bodyOneType;
  bodyTwoType;
  bodyOneErrorMessage;
  bodyTwoErrorMessage;
  bodyIdCardFaceErrMes;
  bodyIdCardReverseErrMes;
  headerName;
  isPersonal = false;
  bodyIdCardFace = {
    fileList: [],
    Customary: {
      fileAttribute: '',
      fileAttribute2: '',
      fuleUrl: '',
      id: '',
      moduleId: '',
      name: '',
      size: 0
    },
    Narrowed: {
      fileAttribute: '',
      fileAttribute2: '',
      fuleUrl: '',
      id: '',
      moduleId: '',
      name: '',
      size: 0
    }
  };
  bodyIdcardReverse = {
    fileList: [],
    Customary: {
      fileAttribute: '',
      fileAttribute2: '',
      fuleUrl: '',
      id: '',
      moduleId: '',
      name: '',
      size: 0
    },
    Narrowed: {
      fileAttribute: '',
      fileAttribute2: '',
      fuleUrl: '',
      id: '',
      moduleId: '',
      name: '',
      size: 0
    }
  };

  uploadUrl = `${Environment.application.bssAPI}/file/upload/thumbs`;
  submitAuditDataParams: any = {
    submitList: [],
    id: '',  // 主体id
    typeId: '', // 订单类型
    orderId: ''
  };

  isPersonalMark;
  websitesArr;

  constructor(private message: NzMessageService,
              private beianHomeService: BeianHomeService,
              private router: ActivatedRoute,
              private route: Router,
              private uploadSampleServie: UploadSampleService,
              private beforeUploadServie: BeforeUploadService) {
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  getData(): void {
    this.beianHomeService.getAuditfailData(this.orderId).subscribe(data => {
      if (data.code === '0') {
        const websiteIdArr = [];
        if (data.result.websites) {
          data.result.websites.forEach(item =>{
            websiteIdArr.push(item.id);
          });
        }
        this.websitesArr = websiteIdArr;
        // 原件扫描件数据处理，处理不同的团体对应不用的原件扫描件模板
        this.uploadSampleServie.originalScanFunction(data.result.sponsorInfo.typeId);
        this.originalScanUrl = this.uploadSampleServie.originalScanResult();
        // the company type name
        this.certificationName = data.result.sponsorInfo.certificationName;
        this.headerTypeName = data.result.sponsorInfo.headerTypeName;
        this.sponsorName = data.result.sponsorInfo.sponsorName;
        this.headerName = data.result.sponsorInfo.headerName;
        this.typeId = data.result.orderInfo.typeId;
        this.bodyId = data.result.sponsorInfo.id;

        // 法人授权书
        // if (data.result.websites) {
        //   data.result.websites[0].fileList.forEach(templateDetail => {
        //     if (templateDetail.fileAttribute == "legalAuthorization") {
        //       this.certificateAuthUrl = templateDetail.fuleUrl;
        //     }
        //   });
        // }

        if (data.result.sponsorInfo.isPersonal === 'false') {
          this.isPersonal = false;
        } else {
          this.isPersonal = true;
        }
        // the company type
        this.bodyOneType = data.result.sponsorInfo.certificationId;
        // the sponsor type
        this.bodyTwoType = data.result.sponsorInfo.headerType;
        data.result.sponsorInfo.remarkList.forEach(item => {
          if (item.code === this.bodyOneType) {
            this.bodyOneErrorMessage = item.remark;
          }
          if (item.code === this.bodyTwoType) {
            this.bodyTwoErrorMessage = item.remark;
          }
          if (item.code === 'idcardFace') {
            this.bodyIdCardFaceErrMes = item.remark;
          }
          if (item.code === 'idcardReverse') {
            this.bodyIdCardReverseErrMes = item.remark;
          }
        });
        if (data.result.sponsorInfo.isPersonal === 'true') {
          this.isPersonalMark = true;
        }
        data.result.sponsorInfo.fileList.forEach(item => {
          if (item.fileAttribute === data.result.sponsorInfo.certificationId) {
            this.certificate_fileList.fileList[0] = {};
          }

          if (data.result.sponsorInfo.headerType === 'idCard') {
            if (item.fileAttribute === 'idcardFace') {
              this.bodyIdCardFace.fileList[0] = {};
            }

            if (item.fileAttribute === 'idcardReverse') {
              this.bodyIdcardReverse.fileList[0] = {};
            }
          }
          if (item.fileAttribute === data.result.sponsorInfo.headerType) {
            this.Relevant_association_fileList.fileList[0] = {};
          }
        });
        data.result.sponsorInfo.fileList.forEach(item => {
          if (item.fileAttribute === data.result.sponsorInfo.certificationId) {
            if (item.fileAttribute2 === 'thumbnail') {
              this.certificate_fileList.fileList[0].url = item.fuleUrl;
              this.certificate_fileList.Narrowed = item;
            }
            if (item.fileAttribute2 === 'original') {
              this.certificate_fileList.fileList[0].orUrl = item.fuleUrl;
              this.certificate_fileList.Customary = item;
            }
          }
          if (data.result.sponsorInfo.headerType === 'idCard') {
            if (item.fileAttribute === 'idcardFace') {
              if (item.fileAttribute2 === 'thumbnail') {
                this.bodyIdCardFace.fileList[0].url = item.fuleUrl;
                this.bodyIdCardFace.Narrowed = item;
              }
              if (item.fileAttribute2 === 'original') {
                this.bodyIdCardFace.fileList[0].orUrl = item.fuleUrl;
                this.bodyIdCardFace.Customary = item;
              }
            }

            if (item.fileAttribute === 'idcardReverse') {
              if (item.fileAttribute2 === 'thumbnail') {
                this.bodyIdcardReverse.fileList[0].url = item.fuleUrl;
                this.bodyIdcardReverse.Narrowed = item;
              }
              if (item.fileAttribute2 === 'original') {
                this.bodyIdcardReverse.fileList[0].orUrl = item.fuleUrl;
                this.bodyIdcardReverse.Customary = item;
              }
            }
          }
          if (item.fileAttribute === data.result.sponsorInfo.headerType) {
            if (item.fileAttribute2 === 'thumbnail') {
              this.Relevant_association_fileList.fileList[0].url = item.fuleUrl;
              this.Relevant_association_fileList.Narrowed = item;
            }
            if (item.fileAttribute2 === 'original') {
              this.Relevant_association_fileList.fileList[0].orUrl = item.fuleUrl;
              this.Relevant_association_fileList.Customary = item;
            }
          }
        });
        // the websites data
        data.result.websites.forEach((item, index) => {
          const currtentObj = {
            id: item.id,
            homeUrl: item.homeUrl,
            //  homeUrl:item.homeUrl,
            idcardFace: {
              fileList: [],
              Customary: {},
              Narrowed: {},
              mark: ''
            },
            idcardReverse: {
              fileList: [],
              Customary: {},
              Narrowed: {},
              mark: ''
            },
            certificateAuth: {
              fileList: [],
              Customary: {},
              Narrowed: {},
              mark: ''
            },
            preApproval: {
              fileList: [],
              Customary: {},
              Narrowed: {},
              mark: ''
            },
            domainList: [],
            websiteCheck: {
              fileList: [],
              Customary: {},
              Narrowed: {},
              mark: ''
            },
            otherDataList: []

          };
          item.fileList.forEach((data, num) => {
            if (data.fileAttribute === 'idcardFace') {
              if (data.fileAttribute2 === 'thumbnail') {
                currtentObj.idcardFace.fileList[0] = {};
                currtentObj.idcardFace.fileList[0].url = data.fuleUrl;
                currtentObj.idcardFace.fileList[0].orUrl = item.fileList[num - 1].fuleUrl;
                for (let i = 0; i < item.remarks.length; i++) {
                  if (item.remarks[i].code === 'idcardFace') {
                    currtentObj.idcardFace.mark = item.remarks[i].remark;
                  }
                }
                currtentObj.idcardFace.Narrowed = data;
              }
              if (data.fileAttribute2 === 'original') {
                currtentObj.idcardFace.Customary = data;
              }
            }
            if (data.fileAttribute === 'idcardReverse') {
              if (data.fileAttribute2 === 'thumbnail') {
                currtentObj.idcardReverse.fileList[0] = {};
                currtentObj.idcardReverse.fileList[0].url = data.fuleUrl;
                currtentObj.idcardReverse.fileList[0].orUrl = item.fileList[num - 1].fuleUrl;
                for (let i = 0; i < item.remarks.length; i++) {
                  if (item.remarks[i].code === 'idcardReverse') {
                    currtentObj.idcardReverse.mark = item.remarks[i].remark;
                  }
                }
                currtentObj.idcardReverse.Narrowed = data;
              }
              if (data.fileAttribute2 === 'original') {
                currtentObj.idcardReverse.Customary = data;
              }
            }

            if (data.fileAttribute === 'certificateAuth') {
              if (data.fileAttribute2 === 'thumbnail') {
                currtentObj.certificateAuth.fileList[0] = {};
                currtentObj.certificateAuth.fileList[0].url = data.fuleUrl;
                currtentObj.certificateAuth.fileList[0].orUrl = item.fileList[num - 1].fuleUrl;
                for (let i = 0; i < item.remarks.length; i++) {
                  if (item.remarks[i].code === 'idcardReverse') {
                    currtentObj.certificateAuth.mark = item.remarks[i].remark;
                  }
                }
                currtentObj.certificateAuth.Narrowed = data;
              }
              if (data.fileAttribute2 === 'original') {
                currtentObj.certificateAuth.Customary = data;
              }
            }
            if (data.fileAttribute === 'preApproval') {
              if (data.fileAttribute2 === 'thumbnail') {
                currtentObj.preApproval.fileList[0] = {};
                currtentObj.preApproval.fileList[0].url = data.fuleUrl;
                currtentObj.preApproval.fileList[0].orUrl = item.fileList[num - 1].fuleUrl;
                for (let i = 0; i < item.remarks.length; i++) {
                  if (item.remarks[i].code === 'preApproval') {
                    currtentObj.preApproval.mark = item.remarks[i].remark;
                  }
                }
                currtentObj.preApproval.Narrowed = data;
              }
              if (data.fileAttribute2 === 'original') {
                currtentObj.preApproval.Customary = data;
              }
            }
            if (data.fileAttribute === 'websiteCheck') {
              if (data.fileAttribute2 === 'thumbnail') {
                currtentObj.websiteCheck.fileList[0] = {};
                currtentObj.websiteCheck.fileList[0].url = data.fuleUrl;
                currtentObj.websiteCheck.fileList[0].orUrl = item.fileList[num - 1].fuleUrl;
                for (let i = 0; i < item.remarks.length; i++) {
                  if (item.remarks[i].code === 'websiteCheck') {
                    currtentObj.websiteCheck.mark = item.remarks[i].remark;
                  }
                }
                currtentObj.websiteCheck.Narrowed = data;
              }
              if (data.fileAttribute2 === 'original') {
                currtentObj.websiteCheck.Customary = data;
              }
            }
            if (data.fileAttribute.indexOf('otherData') !== -1) {
              const curr = {
                fileList: [],
                Narrowed: {},
                Customary: {},
                mark: ''
              };
              if (data.fileAttribute2 === 'thumbnail') {
                curr.fileList[0] = {};
                curr.fileList[0].url = data.fuleUrl;
                curr.fileList[0].orUrl = item.fileList[num - 1].fuleUrl;
                for (let i = 0; i < item.remarks.length; i++) {
                  if (item.remarks[i].code === data.fileAttribute) {
                    curr.mark = item.remarks[i].remark;
                  }
                }
                curr.Narrowed = data;
                curr.Customary = item.fileList[num - 1];
              }
              if (data.fileAttribute2 === 'original') {
                curr.Customary = data;
                curr.fileList[0] = {};
                curr.fileList[0].url = item.fileList[num + 1].fuleUrl;
                curr.fileList[0].orUrl = data.fuleUrl;
                for (let i = 0; i < item.remarks.length; i++) {
                  if (item.remarks[i].code === data.fileAttribute) {
                    curr.mark = item.remarks[i].remark;
                  }
                }
                curr.Narrowed = item.fileList[num + 1];
                curr.Customary = data;
              }
              currtentObj.otherDataList.push(curr);
            }
            if (data.fileAttribute.indexOf('domain') !== -1) {
              const curr = {
                fileList: [],
                Narrowed: {},
                Customary: {},
                mark: ''
              };
              curr.fileList[0] = {};
              if (data.fileAttribute2 === 'thumbnail') {
                curr.fileList[0].url = data.fuleUrl;
                curr.fileList[0].orUrl = item.fileList[num - 1].fuleUrl;
                for (let i = 0; i < item.remarks.length; i++) {
                  if (item.remarks[i].code === data.fileAttribute) {
                    curr.mark = item.remarks[i].remark;
                  }
                }
                curr.Narrowed = data;
                curr.Customary = item.fileList[num - 1];
              }
              if (data.fileAttribute2 === 'original') {
                curr.fileList[0].url = item.fileList[num + 1].fuleUrl;
                curr.fileList[0].orUrl = data.fuleUrl;
                for (let i = 0; i < item.remarks.length; i++) {
                  if (item.remarks[i].code === data.fileAttribute) {
                    curr.mark = item.remarks[i].remark;
                  }
                }
                curr.Narrowed = item.fileList[num + 1];
                curr.Customary = data;
              }
              currtentObj.domainList.push(curr);
            }
          });
          if (currtentObj.domainList.length === 0) {
            currtentObj.domainList.push({fileList: []});
          }
          if (currtentObj.otherDataList.length === 0) {
            currtentObj.otherDataList.push({fileList: []});
          }
          for (let i = 1; i < currtentObj.domainList.length; i++) {
            currtentObj.domainList.splice(i, 1);
          }
          for (let i = 1; i < currtentObj.otherDataList.length; i++) {
            currtentObj.otherDataList.splice(i, 1);
          }
          this.websitesData.push(currtentObj);
        });
        console.log(this.websitesData);


      } else {
        this.message.warning(data.message);
      }

    });
  }

  sponsorShow = true;
  getWebsiteData(): void {
    this.sponsorShow = false;
    this.beianHomeService.getAuditWebsiteData(this.orderId).subscribe(data => {
      if (data.code === '0') {
        const websiteIdArr = [];
        if (data.result.websites) {
          data.result.websites.forEach(item =>{
            websiteIdArr.push(item.id);
          });
        }
        this.websitesArr = websiteIdArr;

        this.typeId = data.result.orderInfo.typeId;

        // the websites data
        data.result.websites.forEach((item, index) => {
          const currtentObj = {
            id: item.id,
            homeUrl: item.homeUrl,
            //  homeUrl:item.homeUrl,
            idcardFace: {
              fileList: [],
              Customary: {},
              Narrowed: {},
              mark: ''
            },
            idcardReverse: {
              fileList: [],
              Customary: {},
              Narrowed: {},
              mark: ''
            },
            certificateAuth: {
              fileList: [],
              Customary: {},
              Narrowed: {},
              mark: ''
            },
            preApproval: {
              fileList: [],
              Customary: {},
              Narrowed: {},
              mark: ''
            },
            domainList: [],
            websiteCheck: {
              fileList: [],
              Customary: {},
              Narrowed: {},
              mark: ''
            },
            otherDataList: []

          };
          item.fileList.forEach((data, num) => {
            if (data.fileAttribute === 'idcardFace') {
              if (data.fileAttribute2 === 'thumbnail') {
                currtentObj.idcardFace.fileList[0] = {};
                currtentObj.idcardFace.fileList[0].url = data.fuleUrl;
                currtentObj.idcardFace.fileList[0].orUrl = item.fileList[num - 1].fuleUrl;
                for (let i = 0; i < item.remarks.length; i++) {
                  if (item.remarks[i].code === 'idcardFace') {
                    currtentObj.idcardFace.mark = item.remarks[i].remark;
                  }
                }
                currtentObj.idcardFace.Narrowed = data;
              }
              if (data.fileAttribute2 === 'original') {
                currtentObj.idcardFace.Customary = data;
              }
            }
            if (data.fileAttribute === 'idcardReverse') {
              if (data.fileAttribute2 === 'thumbnail') {
                currtentObj.idcardReverse.fileList[0] = {};
                currtentObj.idcardReverse.fileList[0].url = data.fuleUrl;
                currtentObj.idcardReverse.fileList[0].orUrl = item.fileList[num - 1].fuleUrl;
                for (let i = 0; i < item.remarks.length; i++) {
                  if (item.remarks[i].code === 'idcardReverse') {
                    currtentObj.idcardReverse.mark = item.remarks[i].remark;
                  }
                }
                currtentObj.idcardReverse.Narrowed = data;
              }
              if (data.fileAttribute2 === 'original') {
                currtentObj.idcardReverse.Customary = data;
              }
            }

            if (data.fileAttribute === 'certificateAuth') {
              if (data.fileAttribute2 === 'thumbnail') {
                currtentObj.certificateAuth.fileList[0] = {};
                currtentObj.certificateAuth.fileList[0].url = data.fuleUrl;
                currtentObj.certificateAuth.fileList[0].orUrl = item.fileList[num - 1].fuleUrl;
                for (let i = 0; i < item.remarks.length; i++) {
                  if (item.remarks[i].code === 'idcardReverse') {
                    currtentObj.certificateAuth.mark = item.remarks[i].remark;
                  }
                }
                currtentObj.certificateAuth.Narrowed = data;
              }
              if (data.fileAttribute2 === 'original') {
                currtentObj.certificateAuth.Customary = data;
              }
            }
            if (data.fileAttribute === 'preApproval') {
              if (data.fileAttribute2 === 'thumbnail') {
                currtentObj.preApproval.fileList[0] = {};
                currtentObj.preApproval.fileList[0].url = data.fuleUrl;
                currtentObj.preApproval.fileList[0].orUrl = item.fileList[num - 1].fuleUrl;
                for (let i = 0; i < item.remarks.length; i++) {
                  if (item.remarks[i].code === 'preApproval') {
                    currtentObj.preApproval.mark = item.remarks[i].remark;
                  }
                }
                currtentObj.preApproval.Narrowed = data;
              }
              if (data.fileAttribute2 === 'original') {
                currtentObj.preApproval.Customary = data;
              }
            }
            if (data.fileAttribute === 'websiteCheck') {
              if (data.fileAttribute2 === 'thumbnail') {
                currtentObj.websiteCheck.fileList[0] = {};
                currtentObj.websiteCheck.fileList[0].url = data.fuleUrl;
                currtentObj.websiteCheck.fileList[0].orUrl = item.fileList[num - 1].fuleUrl;
                for (let i = 0; i < item.remarks.length; i++) {
                  if (item.remarks[i].code === 'websiteCheck') {
                    currtentObj.websiteCheck.mark = item.remarks[i].remark;
                  }
                }
                currtentObj.websiteCheck.Narrowed = data;
              }
              if (data.fileAttribute2 === 'original') {
                currtentObj.websiteCheck.Customary = data;
              }
            }
            if (data.fileAttribute.indexOf('otherData') !== -1) {
              const curr = {
                fileList: [],
                Narrowed: {},
                Customary: {},
                mark: ''
              };
              if (data.fileAttribute2 === 'thumbnail') {
                curr.fileList[0] = {};
                curr.fileList[0].url = data.fuleUrl;
                curr.fileList[0].orUrl = item.fileList[num - 1].fuleUrl;
                for (let i = 0; i < item.remarks.length; i++) {
                  if (item.remarks[i].code === data.fileAttribute) {
                    curr.mark = item.remarks[i].remark;
                  }
                }
                curr.Narrowed = data;
                curr.Customary = item.fileList[num - 1];
              }
              if (data.fileAttribute2 === 'original') {
                curr.Customary = data;
                curr.fileList[0] = {};
                curr.fileList[0].url = item.fileList[num + 1].fuleUrl;
                curr.fileList[0].orUrl = data.fuleUrl;
                for (let i = 0; i < item.remarks.length; i++) {
                  if (item.remarks[i].code === data.fileAttribute) {
                    curr.mark = item.remarks[i].remark;
                  }
                }
                curr.Narrowed = item.fileList[num + 1];
                curr.Customary = data;
              }
              currtentObj.otherDataList.push(curr);
            }
            if (data.fileAttribute.indexOf('domain') !== -1) {
              const curr = {
                fileList: [],
                Narrowed: {},
                Customary: {},
                mark: ''
              };
              curr.fileList[0] = {};
              if (data.fileAttribute2 === 'thumbnail') {
                curr.fileList[0].url = data.fuleUrl;
                curr.fileList[0].orUrl = item.fileList[num - 1].fuleUrl;
                for (let i = 0; i < item.remarks.length; i++) {
                  if (item.remarks[i].code === data.fileAttribute) {
                    curr.mark = item.remarks[i].remark;
                  }
                }
                curr.Narrowed = data;
                curr.Customary = item.fileList[num - 1];
              }
              if (data.fileAttribute2 === 'original') {
                curr.fileList[0].url = item.fileList[num + 1].fuleUrl;
                curr.fileList[0].orUrl = data.fuleUrl;
                for (let i = 0; i < item.remarks.length; i++) {
                  if (item.remarks[i].code === data.fileAttribute) {
                    curr.mark = item.remarks[i].remark;
                  }
                }
                curr.Narrowed = item.fileList[num + 1];
                curr.Customary = data;
              }
              currtentObj.domainList.push(curr);
            }
          });
          if (currtentObj.domainList.length === 0) {
            currtentObj.domainList.push({fileList: []});
          }
          if (currtentObj.otherDataList.length === 0) {
            currtentObj.otherDataList.push({fileList: []});
          }
          for (let i = 1; i < currtentObj.domainList.length; i++) {
            currtentObj.domainList.splice(i, 1);
          }
          for (let i = 1; i < currtentObj.otherDataList.length; i++) {
            currtentObj.otherDataList.splice(i, 1);
          }
          this.websitesData.push(currtentObj);
        });
        console.log(this.websitesData);


      } else {
        this.message.warning(data.message);
      }
    });
  }

  certificateFile(): void {
    window.open(this.certificateAuthUrl);
  }

  beforeUpload = (file: UploadFile) => {
    this.beforeUploadServie.beforeUpload(file);
    if (this.beforeUploadServie.beforeUploadCodeReturn() === 1) {
      return false;
    }
  }

  removeFile(originalUrl, thumbUrl) {
    this.beianHomeService.deleteFiles([Base64.encode(originalUrl), Base64.encode(thumbUrl)]).subscribe(res => {

    });
  }

  removeFileFunc(info: any): void {
    console.log(info);
    if (info.type === 'removed') {
      if (info.file.response !== undefined) {
        let originalUrl = info.file.response.result['original'].url;
        let thumbUrl = info.file.response.result['thumbnail'].url;
        this.removeFile(originalUrl, thumbUrl);
      } else {
        if (info.file.orUrl !== undefined) {
          let originalUrl = info.file.orUrl;
          let thumbUrl = info.file.url;
          this.removeFile(originalUrl, thumbUrl);
        } else {
          let originalUrl = info.file.url;
          let thumbUrl = info.file.url;
          this.removeFile(originalUrl, thumbUrl);
        }

      }
    }
  }

  otherDataFunction(info: any, moduleId, i): void {
    console.log(info, i, '测试数据');
    const otherDataParams = {
      name: '',
      url: '',
      size: 0,
      fileAttribute: '',
      fileAttribute2: '',
      moduleId: '',
      uid: ''
    };
    const otherDataThumbnailParams = {
      name: '',
      url: '',
      size: 0,
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
      this.removeFile(originalUrl, thumbUrl);
    }
  }

  addOther(index) {
    this.websitesData[index].otherDataList.push({fileList: []});
  }

  wordOpen(): void {
    this.infoShow = true;
  }

  wordTwoOpen(): void {
    this.infoTwoShow = true;
  }

  submitAudit(): void {
    this.submitNoteShow = true;
  }


  submitOk(): void {
    if (this.checked === false) {
      this.message.warning('请先勾选协议！');
      return;
    }
    if (this.certificate_fileList.fileList.length < 0) {
      this.message.warning('请先勾选协议！');
      return;
    }
    /*   if (this.certificate_fileList.fileList.length < 0) {
         this.message.warning('社会团体法人登记证书为必填项！');
         return;
       }
       if (this.Relevant_association_fileList.fileList < 0) {
         this.message.warning('社会团体相关资料为必填项！');
         return;
       }*/

    this.list = [];
    /*this.list.push()*/

    /*第一块*/
    if (this.certificate_fileList.fileList.length !== 0) {
      if (this.certificate_fileList.fileList[0].response !== undefined) {
        const originalObj = {
          size: 0,
          name: '',
          url: '',
          moduleId: '',
          fileAttribute: this.bodyOneType,
          fileAttribute2: 'original'
        };
        const thumbnailObj = {
          size: 0,
          name: '',
          url: '',
          moduleId: '',
          fileAttribute: this.bodyOneType,
          fileAttribute2: 'thumbnail'
        };
        originalObj.size = this.certificate_fileList.fileList[0].response.result.original.size;
        originalObj.name = this.certificate_fileList.fileList[0].response.result.original.name;
        originalObj.url = this.certificate_fileList.fileList[0].response.result.original.url;
        originalObj.moduleId = this.bodyId;
        thumbnailObj.size = this.certificate_fileList.fileList[0].response.result.thumbnail.size;
        thumbnailObj.name = this.certificate_fileList.fileList[0].response.result.thumbnail.name;
        thumbnailObj.url = this.certificate_fileList.fileList[0].response.result.thumbnail.url;
        thumbnailObj.moduleId = this.bodyId;
        this.list.push(originalObj);
        this.list.push(thumbnailObj);
      } else {
        const originalObj = {
          size: 0,
          name: '',
          url: '',
          moduleId: '',
          fileAttribute: this.bodyOneType,
          fileAttribute2: 'original'
        };
        const thumbnailObj = {
          size: 0,
          name: '',
          url: '',
          moduleId: '',
          fileAttribute: this.bodyOneType,
          fileAttribute2: 'thumbnail'
        };
        originalObj.size = this.certificate_fileList.Customary.size;
        originalObj.name = this.certificate_fileList.Customary.name;
        originalObj.url = this.certificate_fileList.Customary.fuleUrl;
        originalObj.moduleId = this.bodyId;
        thumbnailObj.size = this.certificate_fileList.Narrowed.size;
        thumbnailObj.name = this.certificate_fileList.Narrowed.name;
        thumbnailObj.url = this.certificate_fileList.Narrowed.fuleUrl;
        thumbnailObj.moduleId = this.bodyId;
        this.list.push(originalObj);
        this.list.push(thumbnailObj);
      }
    } else {
      // ???
      // this.message.warning(this.headerName + '的' + this.certificationName + '为必填项');
      // return;
    }


    /* 第二块*/
    if (this.bodyTwoType !== 'idCard') {
      if (this.Relevant_association_fileList.fileList.length !== 0) {
        if (this.Relevant_association_fileList.fileList[0].response !== undefined) {
          const originalObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: this.bodyTwoType,
            fileAttribute2: 'original'
          };
          const thumbnailObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: this.bodyTwoType,
            fileAttribute2: 'thumbnail'
          };
          originalObj.size = this.Relevant_association_fileList.fileList[0].response.result.original.size;
          originalObj.name = this.Relevant_association_fileList.fileList[0].response.result.original.name;
          originalObj.url = this.Relevant_association_fileList.fileList[0].response.result.original.url;
          originalObj.moduleId = this.bodyId;
          thumbnailObj.size = this.Relevant_association_fileList.fileList[0].response.result.thumbnail.size;
          thumbnailObj.name = this.Relevant_association_fileList.fileList[0].response.result.thumbnail.name;
          thumbnailObj.url = this.Relevant_association_fileList.fileList[0].response.result.thumbnail.url;
          thumbnailObj.moduleId = this.bodyId;
          this.list.push(originalObj);
          this.list.push(thumbnailObj);
        } else {
          const originalObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: this.bodyTwoType,
            fileAttribute2: 'original'
          };
          const thumbnailObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: this.bodyTwoType,
            fileAttribute2: 'thumbnail'
          };
          originalObj.size = this.Relevant_association_fileList.Customary.size;
          originalObj.name = this.Relevant_association_fileList.Customary.name;
          originalObj.url = this.Relevant_association_fileList.Customary.fuleUrl;
          originalObj.moduleId = this.bodyId;
          thumbnailObj.size = this.Relevant_association_fileList.Narrowed.size;
          thumbnailObj.name = this.Relevant_association_fileList.Narrowed.name;
          thumbnailObj.url = this.Relevant_association_fileList.Narrowed.fuleUrl;
          thumbnailObj.moduleId = this.bodyId;
          this.list.push(originalObj);
          this.list.push(thumbnailObj);
        }
      } else {
        if (this.headerTypeName != undefined) {
          this.message.warning(this.headerTypeName + '为必填项');
          return;
        }

      }
    } else {
      if (this.bodyIdCardFace.fileList.length !== 0) {
        if (this.bodyIdCardFace.fileList[0].response !== undefined) {
          const originalObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'idcardFace',
            fileAttribute2: 'original'
          };
          const thumbnailObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'idcardFace',
            fileAttribute2: 'thumbnail'
          };
          originalObj.size = this.bodyIdCardFace.fileList[0].response.result.original.size;
          originalObj.name = this.bodyIdCardFace.fileList[0].response.result.original.name;
          originalObj.url = this.bodyIdCardFace.fileList[0].response.result.original.url;
          originalObj.moduleId = this.bodyId;
          thumbnailObj.size = this.bodyIdCardFace.fileList[0].response.result.thumbnail.size;
          thumbnailObj.name = this.bodyIdCardFace.fileList[0].response.result.thumbnail.name;
          thumbnailObj.url = this.bodyIdCardFace.fileList[0].response.result.thumbnail.url;
          thumbnailObj.moduleId = this.bodyId;
          this.list.push(originalObj);
          this.list.push(thumbnailObj);
        } else {
          const originalObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'idcardFace',
            fileAttribute2: 'original'
          };
          const thumbnailObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'idcardFace',
            fileAttribute2: 'thumbnail'
          };
          originalObj.size = this.bodyIdCardFace.Customary.size;
          originalObj.name = this.bodyIdCardFace.Customary.name;
          originalObj.url = this.bodyIdCardFace.Customary.fuleUrl;
          originalObj.moduleId = this.bodyId;
          thumbnailObj.size = this.bodyIdCardFace.Narrowed.size;
          thumbnailObj.name = this.bodyIdCardFace.Narrowed.name;
          thumbnailObj.url = this.bodyIdCardFace.Narrowed.fuleUrl;
          thumbnailObj.moduleId = this.bodyId;
          this.list.push(originalObj);
          this.list.push(thumbnailObj);
        }
      } else {

        this.message.warning('身份证必填项！');
        return;
      }

      if (this.bodyIdcardReverse.fileList.length !== 0) {
        if (this.bodyIdcardReverse.fileList[0].response !== undefined) {
          const originalObj = {
            size: 0,
            name: 0,
            url: '',
            moduleId: '',
            fileAttribute: 'idcardReverse',
            fileAttribute2: 'original'
          };
          const thumbnailObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'idcardReverse',
            fileAttribute2: 'thumbnail'
          };
          originalObj.size = this.bodyIdcardReverse.fileList[0].response.result.original.size;
          originalObj.name = this.bodyIdcardReverse.fileList[0].response.result.original.name;
          originalObj.url = this.bodyIdcardReverse.fileList[0].response.result.original.url;
          originalObj.moduleId = this.bodyId;
          thumbnailObj.size = this.bodyIdcardReverse.fileList[0].response.result.thumbnail.size;
          thumbnailObj.name = this.bodyIdcardReverse.fileList[0].response.result.thumbnail.name;
          thumbnailObj.url = this.bodyIdcardReverse.fileList[0].response.result.thumbnail.url;
          thumbnailObj.moduleId = this.bodyId;
          this.list.push(originalObj);
          this.list.push(thumbnailObj);
        } else {
          const originalObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'idcardReverse',
            fileAttribute2: 'original'
          };
          const thumbnailObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'idcardReverse',
            fileAttribute2: 'thumbnail'
          };
          originalObj.size = this.bodyIdcardReverse.Customary.size;
          originalObj.name = this.bodyIdcardReverse.Customary.name;
          originalObj.url = this.bodyIdcardReverse.Customary.fuleUrl;
          originalObj.moduleId = this.bodyId;
          thumbnailObj.size = this.bodyIdcardReverse.Narrowed.size;
          thumbnailObj.name = this.bodyIdcardReverse.Narrowed.name;
          thumbnailObj.url = this.bodyIdcardReverse.Narrowed.fuleUrl;
          thumbnailObj.moduleId = this.bodyId;
          this.list.push(originalObj);
          this.list.push(thumbnailObj);
        }
      } else {
        console.log(2);
        this.message.warning('身份证必填项！');
        return;
      }
    }


    this.isSub = true;
    this.websitesData.forEach(item => {
      if (item.idcardFace.fileList.length !== 0) {
        if (item.idcardFace.fileList[0].response !== undefined) {
          const originalObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'idcardFace',
            fileAttribute2: 'original'
          };
          const thumbnailObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'idcardFace',
            fileAttribute2: 'thumbnail'
          };
          originalObj.size = item.idcardFace.fileList[0].response.result.original.size;
          originalObj.name = item.idcardFace.fileList[0].response.result.original.name;
          originalObj.url = item.idcardFace.fileList[0].response.result.original.url;
          originalObj.moduleId = item.id;
          thumbnailObj.size = item.idcardFace.fileList[0].response.result.thumbnail.size;
          thumbnailObj.name = item.idcardFace.fileList[0].response.result.thumbnail.name;
          thumbnailObj.url = item.idcardFace.fileList[0].response.result.thumbnail.url;
          thumbnailObj.moduleId = item.id;
          this.list.push(originalObj);
          this.list.push(thumbnailObj);
        } else {
          const originalObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'idcardFace',
            fileAttribute2: 'original'
          };
          const thumbnailObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'idcardFace',
            fileAttribute2: 'thumbnail'
          };
          originalObj.size = item.idcardFace.Customary.size;
          originalObj.name = item.idcardFace.Customary.name;
          originalObj.url = item.idcardFace.Customary.fuleUrl;
          originalObj.moduleId = item.id;
          thumbnailObj.size = item.idcardFace.Narrowed.size;
          thumbnailObj.name = item.idcardFace.Narrowed.name;
          thumbnailObj.url = item.idcardFace.Narrowed.fuleUrl;
          thumbnailObj.moduleId = item.id;
          this.list.push(originalObj);
          this.list.push(thumbnailObj);
        }
      } else {
        console.log(3);
        this.isSub = false;
        this.message.warning('身份证必填项！');
        return;
      }
      if (item.preApproval.fileList.length !== 0) {
        if (item.preApproval.fileList[0].response !== undefined) {
          const originalObj = {
            size: '',
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'preApproval',
            fileAttribute2: 'original'
          };
          const thumbnailObj = {
            size: '',
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'preApproval',
            fileAttribute2: 'thumbnail'
          };
          originalObj.size = item.preApproval.fileList[0].response.result.original.size;
          originalObj.name = item.preApproval.fileList[0].response.result.original.name;
          originalObj.url = item.preApproval.fileList[0].response.result.original.url;
          originalObj.moduleId = item.id;
          thumbnailObj.size = item.preApproval.fileList[0].response.result.thumbnail.size;
          thumbnailObj.name = item.preApproval.fileList[0].response.result.thumbnail.name;
          thumbnailObj.url = item.preApproval.fileList[0].response.result.thumbnail.url;
          thumbnailObj.moduleId = item.id;
          this.list.push(originalObj);
          this.list.push(thumbnailObj);
        } else {
          const originalObj = {
            size: '',
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'preApproval',
            fileAttribute2: 'original'
          };
          const thumbnailObj = {
            size: '',
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'preApproval',
            fileAttribute2: 'thumbnail'
          };
          originalObj.size = item.preApproval.Customary.size;
          originalObj.name = item.preApproval.Customary.name;
          originalObj.url = item.preApproval.Customary.fuleUrl;
          originalObj.moduleId = item.id;
          thumbnailObj.size = item.preApproval.Narrowed.size;
          thumbnailObj.name = item.preApproval.Narrowed.name;
          thumbnailObj.url = item.preApproval.Narrowed.fuleUrl;
          thumbnailObj.moduleId = item.id;
          this.list.push(originalObj);
          this.list.push(thumbnailObj);
        }
      }
      if (item.idcardReverse.fileList.length !== 0) {
        if (item.idcardReverse.fileList[0].response !== undefined) {
          const originalObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'idcardReverse',
            fileAttribute2: 'original'
          };
          const thumbnailObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'idcardReverse',
            fileAttribute2: 'thumbnail'
          };
          originalObj.size = item.idcardReverse.fileList[0].response.result.original.size;
          originalObj.name = item.idcardReverse.fileList[0].response.result.original.name;
          originalObj.url = item.idcardReverse.fileList[0].response.result.original.url;
          originalObj.moduleId = item.id;
          thumbnailObj.size = item.idcardReverse.fileList[0].response.result.thumbnail.size;
          thumbnailObj.name = item.idcardReverse.fileList[0].response.result.thumbnail.name;
          thumbnailObj.url = item.idcardReverse.fileList[0].response.result.thumbnail.url;
          thumbnailObj.moduleId = item.id;
          this.list.push(originalObj);
          this.list.push(thumbnailObj);
        } else {
          const originalObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'idcardReverse',
            fileAttribute2: 'original'
          };
          const thumbnailObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'idcardReverse',
            fileAttribute2: 'thumbnail'
          };
          originalObj.size = item.idcardReverse.Customary.size;
          originalObj.name = item.idcardReverse.Customary.name;
          originalObj.url = item.idcardReverse.Customary.fuleUrl;
          originalObj.moduleId = item.id;
          thumbnailObj.size = item.idcardReverse.Narrowed.size;
          thumbnailObj.name = item.idcardReverse.Narrowed.name;
          thumbnailObj.url = item.idcardReverse.Narrowed.fuleUrl;
          thumbnailObj.moduleId = item.id;
          this.list.push(originalObj);
          this.list.push(thumbnailObj);
        }
      } else {
        this.isSub = false;
        this.message.warning('身份证必填项！');
        return;
      }
      if (item.certificateAuth.fileList.length !== 0) {
        if (item.certificateAuth.fileList[0].response !== undefined) {
          const originalObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'certificateAuth',
            fileAttribute2: 'original'
          };
          const thumbnailObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'certificateAuth',
            fileAttribute2: 'thumbnail'
          };
          originalObj.size = item.certificateAuth.fileList[0].response.result.original.size;
          originalObj.name = item.certificateAuth.fileList[0].response.result.original.name;
          originalObj.url = item.certificateAuth.fileList[0].response.result.original.url;
          originalObj.moduleId = item.id;
          thumbnailObj.size = item.certificateAuth.fileList[0].response.result.thumbnail.size;
          thumbnailObj.name = item.certificateAuth.fileList[0].response.result.thumbnail.name;
          thumbnailObj.url = item.certificateAuth.fileList[0].response.result.thumbnail.url;
          thumbnailObj.moduleId = item.id;
          this.list.push(originalObj);
          this.list.push(thumbnailObj);
        } else {
          const originalObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'certificateAuth',
            fileAttribute2: 'original'
          };
          const thumbnailObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'certificateAuth',
            fileAttribute2: 'thumbnail'
          };
          originalObj.size = item.certificateAuth.Customary.size;
          originalObj.name = item.certificateAuth.Customary.name;
          originalObj.url = item.certificateAuth.Customary.fuleUrl;
          originalObj.moduleId = item.id;
          thumbnailObj.size = item.certificateAuth.Narrowed.size;
          thumbnailObj.name = item.certificateAuth.Narrowed.name;
          thumbnailObj.url = item.certificateAuth.Narrowed.fuleUrl;
          thumbnailObj.moduleId = item.id;
          this.list.push(originalObj);
          this.list.push(thumbnailObj);
        }
      }
      if (item.websiteCheck.fileList.length !== 0) {
        if (item.websiteCheck.fileList[0].response !== undefined) {
          const originalObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'websiteCheck',
            fileAttribute2: 'original'
          };
          const thumbnailObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'websiteCheck',
            fileAttribute2: 'thumbnail'
          };
          originalObj.size = item.websiteCheck.fileList[0].response.result.original.size;
          originalObj.name = item.websiteCheck.fileList[0].response.result.original.name;
          originalObj.url = item.websiteCheck.fileList[0].response.result.original.url;
          originalObj.moduleId = item.id;
          thumbnailObj.size = item.websiteCheck.fileList[0].response.result.thumbnail.size;
          thumbnailObj.name = item.websiteCheck.fileList[0].response.result.thumbnail.name;
          thumbnailObj.url = item.websiteCheck.fileList[0].response.result.thumbnail.url;
          thumbnailObj.moduleId = item.id;
          this.list.push(originalObj);
          this.list.push(thumbnailObj);
        } else {
          const originalObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'websiteCheck',
            fileAttribute2: 'original'
          };
          const thumbnailObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'websiteCheck',
            fileAttribute2: 'thumbnail'
          };
          originalObj.size = item.websiteCheck.Customary.size;
          originalObj.name = item.websiteCheck.Customary.name;
          originalObj.url = item.websiteCheck.Customary.fuleUrl;
          originalObj.moduleId = item.id;
          thumbnailObj.size = item.websiteCheck.Narrowed.size;
          thumbnailObj.name = item.websiteCheck.Narrowed.name;
          thumbnailObj.url = item.websiteCheck.Narrowed.fuleUrl;
          thumbnailObj.moduleId = item.id;
          this.list.push(originalObj);
          this.list.push(thumbnailObj);
        }
      }
      if (item.websiteCheck.fileList.length !== 0) {
        if (item.websiteCheck.fileList[0].response !== undefined) {
          const originalObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'websiteCheck',
            fileAttribute2: 'original'
          };
          const thumbnailObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'websiteCheck',
            fileAttribute2: 'thumbnail'
          };
          originalObj.size = item.websiteCheck.fileList[0].response.result.original.size;
          originalObj.name = item.websiteCheck.fileList[0].response.result.original.name;
          originalObj.url = item.websiteCheck.fileList[0].response.result.original.url;
          originalObj.moduleId = item.id;
          thumbnailObj.size = item.websiteCheck.fileList[0].response.result.thumbnail.size;
          thumbnailObj.name = item.websiteCheck.fileList[0].response.result.thumbnail.name;
          thumbnailObj.url = item.websiteCheck.fileList[0].response.result.thumbnail.url;
          thumbnailObj.moduleId = item.id;
          this.list.push(originalObj);
          this.list.push(thumbnailObj);
        } else {
          const originalObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'websiteCheck',
            fileAttribute2: 'original'
          };
          const thumbnailObj = {
            size: 0,
            name: '',
            url: '',
            moduleId: '',
            fileAttribute: 'websiteCheck',
            fileAttribute2: 'thumbnail'
          };
          originalObj.size = item.websiteCheck.Customary.size;
          originalObj.name = item.websiteCheck.Customary.name;
          originalObj.url = item.websiteCheck.Customary.fuleUrl;
          originalObj.moduleId = item.id;
          thumbnailObj.size = item.websiteCheck.Narrowed.size;
          thumbnailObj.name = item.websiteCheck.Narrowed.name;
          thumbnailObj.url = item.websiteCheck.Narrowed.fuleUrl;
          thumbnailObj.moduleId = item.id;
          this.list.push(originalObj);
          this.list.push(thumbnailObj);
        }
      }
      if (item.otherDataList.length !== 0) {
        item.otherDataList.forEach((d, index) => {
          if (d.fileList.length !== 0) {
            if (d.fileList[0].response !== undefined) {
              const originalObj = {
                size: 0,
                name: '',
                url: '',
                moduleId: '',
                fileAttribute: 'otherData' + index,
                fileAttribute2: 'original'
              };
              const thumbnailObj = {
                size: 0,
                name: '',
                url: '',
                moduleId: '',
                fileAttribute: 'otherData' + index,
                fileAttribute2: 'thumbnail'
              };
              originalObj.size = d.fileList[0].response.result.original.size;
              originalObj.name = d.fileList[0].response.result.original.name;
              originalObj.url = d.fileList[0].response.result.original.url;
              originalObj.moduleId = item.id;
              thumbnailObj.size = d.fileList[0].response.result.thumbnail.size;
              thumbnailObj.name = d.fileList[0].response.result.thumbnail.name;
              thumbnailObj.url = d.fileList[0].response.result.thumbnail.url;
              thumbnailObj.moduleId = item.id;
              this.list.push(originalObj);
              this.list.push(thumbnailObj);
            } else {
              const originalObj = {
                size: 0,
                name: '',
                url: '',
                moduleId: '',
                fileAttribute: 'otherData' + index,
                fileAttribute2: 'original'
              };
              const thumbnailObj = {
                size: 0,
                name: '',
                url: '',
                moduleId: '',
                fileAttribute: 'otherData' + index,
                fileAttribute2: 'thumbnail'
              };
              originalObj.size = d.Customary.size;
              originalObj.name = d.Customary.name;
              originalObj.url = d.Customary.fuleUrl;
              originalObj.moduleId = item.id;
              thumbnailObj.size = d.Narrowed.size;
              thumbnailObj.name = d.Narrowed.name;
              thumbnailObj.url = d.Narrowed.fuleUrl;
              thumbnailObj.moduleId = item.id;
              this.list.push(originalObj);
              this.list.push(thumbnailObj);
            }
          }
        });
      }

      if (item.domainList.length !== 0) {
        item.domainList.forEach((d, index) => {
          if (d.fileList.length !== 0) {
            if (d.fileList[0].response !== undefined) {
              const originalObj = {
                size: 0,
                name: '',
                url: '',
                moduleId: '',
                fileAttribute: 'domainCertificate' + index,
                fileAttribute2: 'original'
              };
              const thumbnailObj = {
                size: 0,
                name: '',
                url: '',
                moduleId: '',
                fileAttribute: 'domainCertificate' + index,
                fileAttribute2: 'thumbnail'
              };
              originalObj.size = d.fileList[0].response.result.original.size;
              originalObj.name = d.fileList[0].response.result.original.name;
              originalObj.url = d.fileList[0].response.result.original.url;
              originalObj.moduleId = item.id;
              thumbnailObj.size = d.fileList[0].response.result.thumbnail.size;
              thumbnailObj.name = d.fileList[0].response.result.thumbnail.name;
              thumbnailObj.url = d.fileList[0].response.result.thumbnail.url;
              thumbnailObj.moduleId = item.id;
              this.list.push(originalObj);
              this.list.push(thumbnailObj);
            } else {
              const originalObj = {
                size: 0,
                name: '',
                url: '',
                moduleId: '',
                fileAttribute: 'domainCertificate' + index,
                fileAttribute2: 'original'
              };
              const thumbnailObj = {
                size: 0,
                name: '',
                url: '',
                moduleId: '',
                fileAttribute: 'domainCertificate' + index,
                fileAttribute2: 'thumbnail'
              };
              originalObj.size = d.Customary.size;
              originalObj.name = d.Customary.name;
              originalObj.url = d.Customary.fuleUrl;
              originalObj.moduleId = item.id;
              thumbnailObj.size = d.Narrowed.size;
              thumbnailObj.name = d.Narrowed.name;
              thumbnailObj.url = d.Narrowed.fuleUrl;
              thumbnailObj.moduleId = item.id;
              this.list.push(originalObj);
              this.list.push(thumbnailObj);
            }
          }
        });
      }

    });

    console.log(this.list);

    this.list.forEach(data => {
      this.typeArr.push(data.fileAttribute);
    });

    const params = {
      id: this.bodyId,
      typeId: this.typeId,
      submitList: this.list,
      sponsorId: this.annexList.sponsorId,
      websiteId: this.websitesArr,
      orderId: this.orderId
    };
    console.log(this.list,'测试数据');
    if (this.isSub) {
       this.beianHomeService.subAuditfailInfo(params, this.orderId).subscribe(item => {
         if (item.code === '0') {
           this.submitNoteShow = false;
           this.route.navigate(['/home/curtain'], {queryParams: {orderId: this.orderId}});
         } else {
           this.message.warning(item.message);
         }
       });
    }

  }

  updateCheckedFunction(info): void {
    this.checked = info;
  }

  submitCancel(): void {
    this.submitNoteShow = false;
  }

  // 返回上一步
  returnFunction(): void {
    // 这里需要处理变更主体的情况
    if (this.type == '6') {
      this.route.navigate(['/order/sponsor'], {
        queryParams: {
          orderId: this.orderId,
          sponsorId: this.annexList.sponsorId,
          mark: this.mark,
          type: this.type,
          isEdit: false
        }
      });
    } else {
      this.route.navigate(['/home/type/organizer/websitesreview'], {
        queryParams: {
          orderId: this.orderId,
          sponsorId: this.annexList.sponsorId,
          mark: this.mark,
          type: this.type,
          isEdit: false
        }
      });
    }
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

    this.router.queryParams.subscribe((params: Params) => {
      this.mark = params['mark'];
    });
    this.annexList.timestamp = new Date().getTime().toString();
    // 获取路径中的orderId
    this.router.queryParams.subscribe((params: Params) => {
      this.annexList.orderId = params['orderId'];
    });
    this.orderId = this.annexList.orderId;

    this.router.queryParams.subscribe((params: Params) => {
      this.annexList.sponsorId = params['sponsorId'];
    });
    if (this.type === '9') {
      this.getWebsiteData();
    } else {
      this.getData();
    }
    this.getTemplateData();
  }
}


import { Component, OnInit } from '@angular/core';
import {Environment} from "../../../../environments/environment";
import {UploadFile} from "ng-zorro-antd";
import {NzMessageService} from "ng-zorro-antd";
import {BeianHomeService} from "../beian-home.service";
import {ActivatedRoute,Params} from "@angular/router";
import {Router} from "@angular/router";
import {BeianVerificationService} from '../common-serve/beian-verification.service';
import {UploadSampleService} from '../common-serve/upload-sample.service';
import {BeforeUploadService} from '../common-serve/before-upload.service';


@Component({
  selector: 'app-sponsor-upload',
  templateUrl: './sponsor-upload.component.html',
  styleUrls: ['./sponsor-upload.component.css']
})
export class SponsorUploadComponent implements OnInit {

  constructor(private message: NzMessageService,
              private beianHomeService: BeianHomeService,
              private router: ActivatedRoute,
              private route: Router,
              private beianVerificationService: BeianVerificationService,
              private uploadSampleService: UploadSampleService,
              private beforeUploadService: BeforeUploadService) { }

  // 显示预览，移除的图标
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon : true,
    hidePreviewIconInNonImage: true
  };
  httpReg = /\b(http:\/\/*.)/;

  uploadUrl = `${Environment.application.bssAPI}/file/upload/thumbs`;
  previewImage = '';
  previewVisible = false;

  imgLoadUrl = Environment.application.bssFront;
  // 放入上传的材料
  list = [];

  // 提交初审的提示信息
  submitNoteShow = false;

  // 主体或者网站提交数据
  sponsorOrWebsiteParams = {
    id:'',
    typeId:'',
    orderId:'',
    submitList:[],
    sponsorId:'',
    websiteId:[]
  };

  // 上传页面初始化时，获取相应的附件
  annexList = {
    orderId:'',
    timestamp:'',
    sponsorId:''
  };
  // 主体id
  sponsorId;
  // 网站id
  websiteId;

  // 主办单位负责人
  organizer;
  // 主办单位
  mainWork;

  // 原件扫描件
  businessLicenceList = [];
  // 主办单位身份证正面
  organizerFileList = [];
  // 主办单位身份证反面
  organizerFileReverseList = [];
  // 特殊类型证件
  specialCardList = [];

  // 原件扫描件的样例
  originalScan;
  // 原件扫描件路径
  originalScanUrl;

  // 用来判断上传的类型参数够不够
  typeArr = [];
  // 订单的id
  private orderId:any;
  // url栏数据
  info;
  // 判断企业还是个人
  isPersonal;
  // 备注
  remarks=[];

  // 非身份证的证件类型
  specialType = false;
  // 当为true时，隐藏了主办单位扫描件
  personShow = false;

  // 左侧信息提示，证件类型名字
  leftLabelMessage;
  // 证件类型的回传参数
  certificationId;
  // 主体负责人的证件类型参数
  headerType;
  // 主体负责人的证件类型参数名字
  headerTypeName;

  checked;
  infoShow = false;
  infoTwoShow = false;

  // 预览
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }

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
        this.list.push(this.organizerParams);

        // 缩略图
        this.organizerThumbnailParams.name = info.file.response.result.thumbnail.name;
        this.organizerThumbnailParams.url = info.file.response.result.thumbnail.url;
        this.organizerThumbnailParams.size = info.file.response.result.thumbnail.size;
        this.organizerThumbnailParams.fileAttribute2 = 'thumbnail';
        this.list.push(this.organizerThumbnailParams);
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
        this.list.push(this.organizerFileParams);

        // 缩略图
        this.organizerFileThumbnailParams.name = info.file.response.result.thumbnail.name;
        this.organizerFileThumbnailParams.url = info.file.response.result.thumbnail.url;
        this.organizerFileThumbnailParams.size = info.file.response.result.thumbnail.size;
        this.organizerFileThumbnailParams.fileAttribute2 = 'thumbnail';
        this.list.push(this.organizerFileThumbnailParams);
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
      // let originalUrl = info.file.response.result['original'].url;
      // let thumbUrl = info.file.response.result['thumbnail'].url;
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
        this.list.push(this.organizerFileReverseParams);

        // 缩略图
        this.organizerFileReverseThumbnailParams.name = info.file.response.result.thumbnail.name;
        this.organizerFileReverseThumbnailParams.url = info.file.response.result.thumbnail.url;
        this.organizerFileReverseThumbnailParams.size = info.file.response.result.thumbnail.size;
        this.organizerFileReverseThumbnailParams.fileAttribute2 = 'thumbnail';
        this.list.push(this.organizerFileReverseThumbnailParams);
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
        this.list.push(this.specialMessageParams);

        // 缩略图
        this.specialMessageThumbnailParams.name = info.file.response.result.thumbnail.name;
        this.specialMessageThumbnailParams.url = info.file.response.result.thumbnail.url;
        this.specialMessageThumbnailParams.size = info.file.response.result.thumbnail.size;
        this.specialMessageThumbnailParams.fileAttribute2 = 'thumbnail';
        this.list.push(this.specialMessageThumbnailParams);
      }
    }
  }



  // 提交初审的取消
  submitCancel(): void {
    this.submitNoteShow = false;
  }
  // 提交初审的确认
  submitOk():void {
    if (this.checked === false) {
      this.message.warning('请先勾选协议！');
      return;
    }
    this.list.forEach(data =>{
      this.typeArr.push(data.fileAttribute);
    })
    // 个人
    if(this.isPersonal == 'true') {
      // 身份证
      if (this.specialType == true){
        if(this.typeArr.indexOf('idcardFace') == -1){
          this.message.warning('请上传身份证正面！');
          return;
        }
        if(this.typeArr.indexOf('idcardReverse') == -1){
          this.message.warning('请上传身份证反面！');
          return;
        }
      }
      // 其他
      if (this.specialType == false){
        if(this.typeArr.indexOf(this.headerType) == -1){
          // this.message.warning('请上传相关资料！');
          this.message.create('warning', '请上传' + this.headerTypeName);
          return;
        }
      }
    }

    // 主体企业
    if(this.isPersonal == 'false'){
      if (this.typeArr.indexOf(this.certificationId) == -1) {
        this.message.create('warning','请上传' + this.leftLabelMessage);
        return;
      }
      // 身份证
      if (this.specialType == true){
        if(this.typeArr.indexOf('idcardFace') == -1){
          this.message.warning('请上传身份证正面！');
          return;
        }
        if(this.typeArr.indexOf('idcardReverse') == -1){
          this.message.warning('请上传身份证反面！');
          return;
        }
      }
      // 其他
      if (this.specialType == false){
        if(this.typeArr.indexOf(this.headerType) == -1){
          this.message.create('warning', '请上传' + this.headerTypeName);
          return;
        }
      }
    }
    this.sponsorHandle();
  }

  // 主体提交
  sponsorHandle():void {
    this.sponsorOrWebsiteParams.submitList = this.list;
    this.sponsorOrWebsiteParams.typeId = '6';
    this.sponsorOrWebsiteParams.id = this.sponsorId;
    this.sponsorOrWebsiteParams.orderId = this.orderId;
    this.sponsorOrWebsiteParams.sponsorId = this.sponsorId;
    this.beianHomeService.sponsorOrWebsiteReturn(this.sponsorOrWebsiteParams).subscribe(data => {
      if(data.code === '0'){
        this.submitNoteShow = false;
        this.route.navigate(['/home/curtain'], {queryParams: {orderId: this.orderId}});
      }else {
        this.message.warning(data.message);
      }
    });
  }

  // 提交初审
  submitAudit():void {
    this.submitNoteShow = true;
  }

  // 返回上一步函数
  returnFunction(): void {
    this.route.navigate(['/list']);
  }

  // 企业主体数据回显处理
   companyReturnShowFunction(fileList): void {
     // 一开始要给数组赋值,阻止最后判空失败
     this.list = fileList;

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

    this.businessLicenceList = JSON.parse(JSON.stringify(businessLicenceList));
    this.organizerFileList = JSON.parse(JSON.stringify(organizerFileList));
    this.organizerFileReverseList = JSON.parse(JSON.stringify(organizerFileReverseList));
    this.specialCardList = JSON.parse(JSON.stringify(specialCardList));
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
      } else {
        this.organizerFileReverseList = [];
      }

      if (item.fileAttribute == this.headerType) {
        if (item.fileAttribute2 == 'thumbnail') {
          this.specialCardList[0].url = item.fuleUrl;
        } else {
          this.specialCardList[0].thumbUrl = item.fuleUrl;
        }
      }
    });
    if (this.businessLicenceList[0].url === '') {
      this.businessLicenceList = [];
    }
    if (this.organizerFileList[0].url === '') {
      this.organizerFileList = [];
    }
    // if (this.organizerFileReverseList[0].url === '') {
    //   this.organizerFileReverseList = [];
    // }
    if (this.specialCardList[0].url === '') {
      this.specialCardList = [];
    }
  }
  // 个人主体数据回显处理
  personReturnShwoFunction(data): void {
    // 一开始要给数组赋值,阻止最后判空失败
    this.list = data.result.sponsorInfo.fileList;

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

    this.organizerFileList = JSON.parse(JSON.stringify(organizerFileList));
    this.organizerFileReverseList = JSON.parse(JSON.stringify(organizerFileReverseList));
    this.specialCardList = JSON.parse(JSON.stringify(specialCardList));

    const fileShowList = data.result.sponsorInfo.fileList;
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
      if (item.fileAttribute == this.headerType) {
        if (item.fileAttribute2 == 'thumbnail') {
          this.specialCardList[0].url = item.fuleUrl;
        } else {
          this.specialCardList[0].thumbUrl = item.fuleUrl;
        }
      }
    });
    if (this.organizerFileList[0].url === '') {
      this.organizerFileList = [];
    }
    if (this.organizerFileReverseList[0].url === '') {
      this.organizerFileReverseList = [];
    }
    if (this.specialCardList[0].url === '') {
      this.specialCardList = [];
    }
  }


  // 主体修改下一步跳转到本页面上传
  sponsorNextShow(): void {
    this.beianHomeService.getAuditfailData(this.orderId).subscribe(data => {
      if (data.code === '0') {
        // 主办单位负责人
        this.organizer = data.result.sponsorInfo.headerName;
        // 主办单位
        this.mainWork = data.result.sponsorInfo.typeName;
        // 证件类型
        this.certificationId = data.result.sponsorInfo.certificationId;
        // 主体负责人的证件类型参数
        this.headerType = data.result.sponsorInfo.headerType;
        // 主体负责人的证件类型参数名字
        this.headerTypeName = data.result.sponsorInfo.headerTypeName;
        // 单位性质
        this.leftLabelMessage = data.result.sponsorInfo.certificationName;

        this.isPersonal = data.result.sponsorInfo.isPersonal;
        this.list = data.result.sponsorInfo.fileList;
        // 原件扫描件数据处理，处理不同的团体对应不用的原件扫描件模板
        this.uploadSampleService.originalScanFunction(data.result.sponsorInfo.typeId);
        this.originalScanUrl = this.uploadSampleService.originalScanResult();

        // 企业主体
        if (this.isPersonal == 'false') {
          this.personShow = false;
          // 判断传回来的类型是身份证或者其他
          if (data.result.sponsorInfo.headerType === 'idCard') {
            this.specialType = true;
          }
          this.companyReturnShowFunction(data.result.sponsorInfo.fileList);
        }
        // 个人主体
        if(this.isPersonal == 'true') {
          // 执行隐藏主办单位
          this.personShow = true;
          // 判断传回来的类型是身份证或者其他
          if (data.result.sponsorInfo.headerType === 'idCard'){
            this.specialType = true;
          }
          this.personReturnShwoFunction(data);
        }

      } else {
        this.message.warning(data.message);
      }
    });
  }

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

  ngOnInit() {
    // 获取订单id
    this.router.queryParams.subscribe((params: Params) => {
      this.orderId = params['orderId'];
    });

    this.info = Object.assign({}, this.router.snapshot.queryParams);
    this.info.isEdit = this.info.isEdit ? JSON.parse(this.info.isEdit) : false;
    this.annexList.timestamp =  new Date().getTime().toString();

    // 说明是主体修改
    this.router.queryParams.subscribe((params: Params) => {
      this.annexList.sponsorId = params['sponsorId'];
    });
    this.sponsorId = this.annexList.sponsorId;
    this.checked = false;
    this.sponsorNextShow();

  }


}

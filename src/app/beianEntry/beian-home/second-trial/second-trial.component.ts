import { Component, OnInit } from '@angular/core';
import {Environment} from "../../../../environments/environment";
import {UploadFile} from "ng-zorro-antd";
import {NzMessageService} from "ng-zorro-antd";
import {BeianHomeService} from "../beian-home.service";
import {ActivatedRoute, Params} from '@angular/router';
import {Router} from '@angular/router';
import {BeforeUploadService} from '../common-serve/before-upload.service';

@Component({
  selector: 'app-second-trial',
  templateUrl: './second-trial.component.html',
  styleUrls: ['./second-trial.component.css']
})
export class SecondTrialComponent implements OnInit {

  constructor(private message:NzMessageService,
              private beianHomeService:BeianHomeService,
              private activatedRoute:ActivatedRoute,
              private route:Router,
              private beforeUploadService:BeforeUploadService) { }

  // 显示预览，移除的图标
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon : true,
    hidePreviewIconInNonImage: true
  };

  uploadUrl = `${Environment.application.bssAPI}/file/upload/thumbs`;

  imgLoadUrl = Environment.application.bssFront;

  websitesData = [
    // {
    //   curtainList:[]
    // }
  ];

  // 网站的数量
  websitesLength;

  previewImage = '';
  previewVisible = false;

  // 返回后台的数据:原图
  auditData = {
    name:'',
    url:'',
    size:'',
    fileAttribute:'',
    fileAttribute2:'',
    moduleId:'',
    uid:''
  };

  // 返回后台的数据：缩略图
  thumbnailData = {
    name:'',
    url:'',
    size:'',
    fileAttribute:'',
    fileAttribute2:'',
    moduleId:'',
    uid:''
  }

  // 提交初审数据
  submitAuditDataParams = {
    submitList:[],
    id:'',  // 主体id
    typeId:'',  // 订单类型
    orderId:'',
    sponsorId:'',
    websiteId:[]
  }

  // 提交复审的提示信息
  submitNoteShow = false;

  // 放入上传的材料
  private list = [];

  // 订单id
  orderId;
  // 主体id
  sponsorId;
  // 判断跳转到哪个页面
  information;
  // 订单类型
  typeId;

  // 预览
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }
  // 跳转到幕布信息页面
  curtainJumpFunction():void {
    this.route.navigate([`/home/curtain`]);
  }

  beforeUpload = (file: UploadFile) => {
    this.beforeUploadService.beforeUpload(file);
    if (this.beforeUploadService.beforeUploadCodeReturn() === 1) {
      return false;
    }
  }

  // 复审幕布照片
  curtainFunction(info:any,moduleId):void {
    this.auditData.moduleId = moduleId;
    this.thumbnailData.moduleId = moduleId;
    this.auditData.fileAttribute = 'curtainPhoto';
    this.thumbnailData.fileAttribute = 'curtainPhoto';
    this.auditData.uid = info.file.uid;
    this.thumbnailData.uid = info.file.uid;
    this.uploadDataHandle(info);
  }

  // 上传数据处理
  uploadDataHandle(info:any):void {

    if (info.type === "removed") {
      let originalUrl = info.file.response.result['original'].url;
      let thumbUrl = info.file.response.result['thumbnail'].url;
      this.beianHomeService.deleteFiles([Base64.encode(originalUrl), Base64.encode(thumbUrl)]).subscribe(data => {
        if (data.code === '0') {
          this.list.forEach((value, index) => {
            if (value.uid === info.file.uid) {
              this.list.splice(index, 2);
            }
          });
          console.log(this.list);
        } else {
          this.message.warning(data.message);
        }
      });
    } else {
      if (info.file.response) {
        // 原图
        this.auditData.name = info.file.response.result.original.name;
        this.auditData.url = info.file.response.result.original.url;
        this.auditData.size = info.file.response.result.original.size;
        this.auditData.fileAttribute2 = 'original';
        this.list.push(JSON.parse(JSON.stringify(this.auditData)));

        // 缩略图
        this.thumbnailData.name = info.file.response.result.thumbnail.name;
        this.thumbnailData.url = info.file.response.result.thumbnail.url;
        this.thumbnailData.size = info.file.response.result.thumbnail.size;
        this.thumbnailData.fileAttribute2 = 'thumbnail';
        this.list.push(JSON.parse(JSON.stringify(this.thumbnailData)));

      }
    }
  }

  // 获得复审初始化数据
  getSecondTrialData():void {
    this.beianHomeService.initSecondTrialData(this.orderId).subscribe(data =>{
      if (data.code === '0'){
        this.submitAuditDataParams.websiteId = data.result.list.map(item => item.id);
        // 网站数据
        this.websitesData = data.result.list;
        // 判断提交后的跳转页面
        this.information = data.result.information;
        this.typeId = data.result.typeId;
        this.websitesLength = data.result.list.length;
        this.websitesData.forEach(item =>{
          // 网站列表
          item.curtainList = [];
        })
      } else {
        this.message.warning(data.message);
      }

    })
  }

  // 提交复审的取消
  submitCancel():void {
    this.submitNoteShow = false;
  }
  // 提交复审的确认
  submitOk():void {
    this.submitHandle();
  }

  // 提交
  submitHandle():void {
    this.submitAuditDataParams.typeId = this.typeId;
    this.submitAuditDataParams.submitList = this.list;
    this.submitAuditDataParams.sponsorId = this.sponsorId;
    if ((this.list.length/2).toString() != this.websitesLength){
      this.message.warning('缺少上传材料！')
      return;
    }
    this.beianHomeService.submitSecondTrialData(this.submitAuditDataParams).subscribe(data => {
      if(data.code === '0'){
        this.submitNoteShow = false;
        if (this.information === '1'){
          this.route.navigate([`/home/review/message`]);
        }
        if (this.information === '0') {
          this.route.navigate([`/home/review/base`]);
        }
      }else {
        this.message.warning(data.message);
      }
    })
  }
  // 返回到订单详情页面
  secondTrialReturn():void {
    this.route.navigate([`order`]);
  }
  // 提交复审
  submitAudit():void {
    this.submitNoteShow = true;
  }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.sponsorId = params['sponsorId'];
    });
    this.submitAuditDataParams.id = this.sponsorId;

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.orderId = params['orderId'];
    });
    this.submitAuditDataParams.orderId = this.orderId;

    this.getSecondTrialData();
  }

}

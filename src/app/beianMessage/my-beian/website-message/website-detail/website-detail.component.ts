import {Component, OnInit} from '@angular/core';
import {MyBeianService} from '../../my-beian.service';
import {NzMessageService} from 'ng-zorro-antd';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-website-detail',
  templateUrl: './website-detail.component.html',
  styleUrls: ['./website-detail.component.css']
})
export class WebsiteDetailComponent implements OnInit {

  constructor(private myBeianService: MyBeianService,
              private message: NzMessageService,
              private activatedRoute: ActivatedRoute) {
  }

  // 获取网站详情的参数
  getWebsiteDetailParams = {
    timestamp: '',
    websiteId: ''
  };
  // 网站信息
  websiteData = {
    websiteName: '',  //	网站名称
    homeUrl: '',  //	网站首页url
    headerName: '',  //	负责人
    headerType: '',  //	负责人证件类型
    headerTypeName: '',  //	负责人证件类型名字
    serviceContentCode: '',  //	网站服务内容code
    serviceContentName: '',  //	网站服务内容名称
    languageCode: '',  //	网站语言code
    languageName: '',  //	网站语言名称
    specialApprovalCode: '',  //	前置或专项审批内容code
    specialApprovalName: '',  //	前置或专项审批内容
    note: '',  //	备注
    headerNum: '',  //	负责人证件号码
    telephone1: '',  //	联系电话1
    telephone2: '',  //	联系电话2
    emergencyPhone: '',  //	应急电话
    email: '',  //	电子邮件地址
    instanceIp: '',  //	网站ip地址

    fileList: {
      filename: '',  //	附件名称
      code: '',  //	编码
      url: '',  //	地址url
    },  //	附件集合
  };
  // 域名列表
  domainList;
  // 域名拼成串
  domainData;
  // 文件列表
  fileList;

  dataObj = {
    idcardFace: '身份证正面',
    idcardReverse: '身份证反面',
    certificateAuth: '法人授权书',
    websiteCheck: '网站内容真实性核验单',
    preApproval: '前置审批材料',
    curtainPhoto: '幕布照片'
  };
  // the website data
  websitesData;

  // the preview images url
  previewImage;
  // the preview params
  previewVisible = false;

  getWebsiteDetail(): void {
    this.getWebsiteDetailParams.timestamp = new Date().getTime().toString();
    this.myBeianService.websiteDetail(this.getWebsiteDetailParams).subscribe(data => {
      if (data.code === '0') {
        this.websiteData = data.result;
        this.domainData = data.result.domain;
        // the file list
        this.websitesData = data.result.fileList;
      } else {
        this.message.warning(data.message);
      }
    });
  }

  previewFn(imgUrl): void {
    this.previewVisible = true;
    this.previewImage = imgUrl;
  }

  ngOnInit() {
    // init the domain
    this.domainData = '';
    this.getWebsiteDetailParams.websiteId = this.activatedRoute.snapshot.params['id'];
    this.getWebsiteDetail();
  }

}

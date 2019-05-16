import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MyBeianService} from "../../my-beian/my-beian.service";
import {NzMessageService} from "ng-zorro-antd";
import {Router} from '@angular/router';

@Component({
    selector: 'sponsorconfirm',
    templateUrl: './sponsorconfirm.component.html',
    styleUrls: ['./sponsorconfirm.component.css']
})
export class SponsorconfirmComponent implements OnInit {

  // 主体的id
  public sponsorId:any;
  public orderId:any;
  public mark:any;
  public type:any;

  constructor(private myBeianService: MyBeianService,
              private message: NzMessageService,
              private router:ActivatedRoute,
              private route:Router) { }

  // 主体详情参数
  sponsorDetailParams = {
    sponsorId:'',
    timestamp:''
  }
  // 获取的详情信息数据
  dataSet = {
    id:'',     //	主体id
    provincId:'',     //主办单位所属区域
    provinceName:'',     //主办单位所属区域名称
    cityId:'',     //主办单位市辖区
    cityName:'',     //主办单位市辖区名称
    countryId:'',     //所属县(区)
    countryName:'',     //所属区名称
    typeId:'',     //主办单位性质id
    typeName:'',     //主办单位性质名称
    certificationId:'',     //主办单位证件类型id
    certificationName:'',     //主办单位证件类型名称
    certificationNum:'',     //主办单位证件号码
    sponsorName:'',     //主办单位或主办人名称
    productCode:'',     //产品类型
    sponsorAddress:'',     //主办单位证件住所
    sponsorMailAddress:'',     //主办单位通讯地址
    sponsorGovern:'',     //投资人或主管单位
    headerName:'',     //负责人
    headerType:'',     //负责人证件类型
    headerTypeName:'',     //负责人证件类型名字
    headerNum:'',     //负责人证件号码
    telephone1:'',     //联系电话1
    telephone2:'',     //联系电话2
    emergencyPhone:'',     //应急电话
    email:'',     //电子邮件地址
    areaPhone:'',     //区号
  }

  // 获取主体详情信息
  getSponsorDetail(): void {
    this.sponsorDetailParams.sponsorId = this.sponsorId;
    this.sponsorDetailParams.timestamp = new Date().getTime().toString();
    this.myBeianService.sponsorDetail(this.sponsorDetailParams).subscribe(data =>{
      if (data.code === '0'){
        this.dataSet = data.result.sponsorEntity;
      } else {
        this.message.warning(data.message);
      }
    });
  }
  sponsorDataVerification(): void {
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
  }

  // 主体改变
  sponsorChangeReturn():void {
    this.route.navigate([`/order`]);
  }

  ngOnInit() {
    const queryParams = this.router.snapshot.queryParams;
    this.sponsorId = queryParams['sponsorId'];
    this.type = queryParams['type'];
    this.orderId = queryParams['orderId'];
    this.mark = queryParams['mark'];
    this.getSponsorDetail();
  }

}


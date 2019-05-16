import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MyBeianService} from "../my-beian.service";
import {NzMessageService} from "ng-zorro-antd";
import {Router} from '@angular/router';

@Component({
  selector: 'app-new-beian',
  templateUrl: './new-beian.component.html',
  styleUrls: ['./new-beian.component.css']
})
export class NewBeianComponent implements OnInit {

  // 主体的id
  public sponsorId:string;

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

  type;

  // 获取主体详情信息
  getSponsorDetail():void {
    this.sponsorDetailParams.sponsorId = this.sponsorId;
    this.sponsorDetailParams.timestamp = new Date().getTime().toString();
    this.myBeianService.sponsorDetail(this.sponsorDetailParams).subscribe(data =>{
      if (data.code === '0'){
        // 获取返回数据
        this.dataSet = data.result.sponsorEntity;
      } else {
        this.message.warning(data.message);
      }
    });
  }
  // 信息确认
  sponsorDataVerification():void {
    this.route.navigate([`/home/type/organizer/websitesadd`], {queryParams: {sponsorId: this.sponsorId , type: this.type}});
  }

  ngOnInit() {
    // 主体id
    this.sponsorId = this.router.snapshot.params['id'];
    this.type = this.router.snapshot.queryParams['type'];
    // 主体详情数据
    this.getSponsorDetail();
  }

}

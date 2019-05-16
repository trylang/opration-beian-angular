import { Component, OnInit } from '@angular/core';
import {MyBeianService} from "../my-beian.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-product-verification',
  templateUrl: './product-verification.component.html',
  styleUrls: ['./product-verification.component.css']
})
export class ProductVerificationComponent implements OnInit {

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
    emergency_phone:'',     //应急电话
    email:'',     //电子邮件地址
    areaPhone:'',     //区号
  }

  // 产品回传参数
  productReturnParams = {
    sponsorId:'',
    domain:'',
    instanceIp:''
  }


  // 产品点击返回时的信息
  productReturn():void {

  }
  // 提交产品验证数据
  submitProductVerification():void {
    if (this.productReturnParams.domain === '') {
      this.message.warning('域名不可为空！');
      return;
    }
    if (this.productReturnParams.instanceIp === '') {
      this.message.warning('实例ip不可为空！');
      return;
    }
    this.myBeianService.productVerification(this.productReturnParams).subscribe(data=>{
      if (data.code === '0') {
        // 页面可以继续往下跳转到网站页面,把主体的id传过去
        this.route.navigate(['/home/type/organizer/websites'], {queryParams: {sponsorId: this.productReturnParams.sponsorId}});
      } else {
        this.message.warning(data.message);
      }
    })

  }
  // 域名验证是否为空
  domainVerification():void {
    if (this.productReturnParams.domain === '') {
      this.message.warning('域名不可为空！');
    }
  }
  // ip验证是否为空
  instanceIpVerification():void {
    if (this.productReturnParams.instanceIp === '') {
      this.message.warning('实例ip不可为空！');
    }
  }


  ngOnInit() {
    // 主体id
    this.sponsorId = this.router.snapshot.params['id'];
    // console.log(this.sponsorId);
  }

}

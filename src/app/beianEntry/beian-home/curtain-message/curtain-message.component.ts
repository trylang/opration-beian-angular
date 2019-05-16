import { Component, OnInit } from '@angular/core';
import {BeianHomeService} from "../beian-home.service";
import {NzMessageService} from "ng-zorro-antd";
import {BeianVerificationService} from "../common-serve/beian-verification.service";
import {ActivatedRoute, Params} from "@angular/router";
import {Router} from "@angular/router";

@Component({
  selector: 'app-curtain-message',
  templateUrl: './curtain-message.component.html',
  styleUrls: ['./curtain-message.component.css']
})
export class CurtainMessageComponent implements OnInit {

  constructor(private beianHomeService:BeianHomeService,
              private message:NzMessageService,
              private beianVerificationService:BeianVerificationService,
              private router:ActivatedRoute,
              private route:Router) { }
  // 幕布是否显示
  curtainShow = false;

  optionObj = {
    citysData: {
      provinceList: [],
      cityList: [],
      contryList: []
    }
  };

  citysData = {
    city: [],
    country: []
  };
  // 幕布回传参数
  curtainReturnParams = {
    orderId:'',   //	订单id
    provinceCode:'',   //	主办单位所属区域
    provinceName:'',   //	主办单位所属区域名称
    cityCode:'',   //	主办单位市辖区
    cityName:'',   //	主办单位市辖区名称
    countryCode:'',   //	所属县(区)
    countryName:'',   //	所属区名称
    address:'',   //	详细地址
    receivedName:'',   //	收货人姓名
    receivePhone:'',   //	收货手机号
  }
  // 订单的id
  public orderId:any;

  // 展示填写幕布的区域
  addressFunction(): void {
    this.curtainReturnParams.provinceCode = '';
    this.curtainReturnParams.provinceName = '';
    this.curtainReturnParams.cityCode = '';
    this.curtainReturnParams.cityName = '';
    this.curtainReturnParams.countryCode = '';
    this.curtainReturnParams.countryName = '';
    this.curtainReturnParams.address = '';
    this.curtainReturnParams.receivedName = '';
    this.curtainReturnParams.receivePhone = '';
    this.curtainShow = true;
  }
  // 省份数据
  private provinceData:any;
  // 城市数据
  private cityData:any;
  // 城区的数据
  private countryData:any;

  selectCity(code) {
    this.curtainReturnParams.cityCode = '';
    this.curtainReturnParams.countryCode = '';
    this.citysData.city = this.optionObj.citysData.cityList.filter(item => item.parentCode == code);
  };

  selectCountry(code) {
    this.curtainReturnParams.countryCode = '';
    this.citysData.country = this.optionObj.citysData.contryList.filter(item => item.parentCode == code);
  };

  // 获取省市县
  getCitys(): void {
    this.beianHomeService.getCitys().subscribe(data => {
      if (data.code == 0) {
        this.optionObj.citysData = data.result;
        this.provinceData = data.result.provinceList;
        this.cityData = data.result.cityList;
        this.countryData = data.result.contryList;
      }
    })
  }

  // 依据城市的code,获取中文名称
  areaFunction():void {
    this.provinceData.forEach(item =>{
      if (item.code === this.curtainReturnParams.provinceCode) {
        this.curtainReturnParams.provinceName = item.name;
      }
    })
    this.cityData.forEach(item =>{
      if (item.code === this.curtainReturnParams.cityCode) {
        this.curtainReturnParams.cityName = item.name;
      }
    })
    this.countryData.forEach(item =>{
      if (item.code === this.curtainReturnParams.countryCode) {
        this.curtainReturnParams.countryName = item.name;
      }
    })
  }

  // 确认提交幕布信息
  submitCurtainMessage(): void {
    this.areaFunction();
    this.curtainReturnParams.orderId = this.orderId;
    let phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if(this.curtainReturnParams.provinceCode === ''
      ||this.curtainReturnParams.cityCode === ''
      ||this.curtainReturnParams.countryCode === ''){
      this.message.warning('请选择收货人居住区域！')
    }else if (this.curtainReturnParams.address === ''
      ||this.curtainReturnParams.receivedName === ''
      ||this.curtainReturnParams.receivePhone === ''
      ||!phoneReg.test(this.curtainReturnParams.receivePhone)){
    } else {
      this.beianHomeService.curtainMessage(this.curtainReturnParams).subscribe(data =>{
        if (data.code ==='0') {
          // 工信部要求天津、甘肃、西藏、宁夏、海南、新疆、青海、浙江、四川、福建、陕西、重庆、广西、云南、山东、河南、安徽、湖南、山西、黑龙江、内蒙古、湖北省市
          // var provinceCodeArr = [120000,620000,540000,640000,460000,650000,630000,330000,510000,350000,610000,500000,450000,530000,370000,410000,340000,430000,140000,230000,150000,420000];
          // if(provinceCodeArr.indexOf(parseInt(this.curtainReturnParams.provinceCode)) == -1){
          //   this.route.navigate([`/home/review/base`]);
          // } else {
          //   this.route.navigate([`/home/review/message`]);
          // }
          this.curtainShow = false;
          this.message.success('操作成功！');


        }else {
          this.message.warning(data.message);
        }
      })
    }


  }
  // 取消提交幕布信息
  cancelCurtainMessage(): void {
    this.curtainShow = false;
  }
  // 详细地址验证
  addressDetailVerification ():void {
    if (this.curtainReturnParams.address === '') {
      this.message.warning("请填写详细地址！");
    }
  }
  // 名字验证
  nameVerification():void {
    if (this.curtainReturnParams.receivedName === '') {
      this.message.warning("请填写收货人姓名！");
    }
  }
  // 手机号验证
  phoneVerification():void {
    if (this.curtainReturnParams.receivePhone === '') {
      this.message.warning("请填写手机号！");
    } else {
      this.beianVerificationService.phoneCheck(this.curtainReturnParams.receivePhone);
      if (this.beianVerificationService.phoneCheckResult() === 1) {
        this.message.create('warning', '请输入正确格式的手机号!');
      }
    }
  }

  // 返回订单页面
  returnOrder():void {
    this.route.navigate(['/order']);
  }

  ngOnInit() {
    this.router.queryParams.subscribe((params: Params) => {
      this.orderId = params['orderId'];
    });
    this.getCitys();
  }

}

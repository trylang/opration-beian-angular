import {Component, OnInit} from '@angular/core';
import {MyBeianService} from '../my-beian.service';
import {NzMessageService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {NatureTypeService} from '../../common-serve/nature-type.service';

@Component({
  selector: 'app-sponsor-detail',
  templateUrl: './sponsor-detail.component.html',
  styleUrls: ['./sponsor-detail.component.css']
})
export class SponsorDetailComponent implements OnInit {

  constructor(private myBeianService: MyBeianService,
              private message: NzMessageService,
              private router: ActivatedRoute,
              private natureTypeService: NatureTypeService) {
  }

  // 主体详情参数
  sponsorDetailParams = {
    sponsorId: '',
    timestamp: '',
  };

  dataSet = {
    typeName: '',
    certificationName: '',
    certificationNum: '',
    provinceName: '',
    cityName: '',
    countryName: '',
    sponsorName: '',
    sponsorAddress: '',
    sponsorMailAddress: '',
    sponsorGovern: '',
    headerName: '',
    headerTypeName: '',
    headerNum: '',
    telephone1: '',
    telephone2: '',
    emergencyPhone: '',
    email: ''
  };
  // file list
  fileList;
  // sponsor id
  sponsorId;
  // preview images url
  previewImage;
  // the preview mark is false
  previewVisible = false;

  dataObj = this.natureTypeService.dataObj;

  // sponsor images
  mainBodyImages = [];

  previewFn(imgUrl): void {
    this.previewVisible = true;
    this.previewImage = imgUrl;
  }

  getSponsorDetail(): void {
    this.sponsorDetailParams.sponsorId = this.sponsorId;
    this.sponsorDetailParams.timestamp = new Date().getTime().toString();
    this.myBeianService.sponsorDetail(this.sponsorDetailParams).subscribe(data => {
      if (data.code === '0') {
        this.dataSet = data.result.sponsorEntity;
        this.mainBodyImages = data.result.sponsorEntity.fileList;
      } else {
        this.message.warning(data.message);
      }
    });
  }

  ngOnInit() {
    this.sponsorId = this.router.snapshot.params['id'];
    this.getSponsorDetail();
  }

}

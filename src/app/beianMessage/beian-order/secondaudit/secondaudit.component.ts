import { Component, OnInit } from '@angular/core';
import { NzMessageService, UploadFile } from "ng-zorro-antd";
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BeianHomeService } from '../../../beianEntry/beian-home/beian-home.service';
import { BeianOrderService } from '../beian-order.service';
import { Environment } from "../../../../environments/environment";
import { BaseService } from '../../../server/base';


@Component({
  selector: 'app-secondaudit',
  templateUrl: './secondaudit.component.html',
  styleUrls: ['./secondaudit.component.scss']
})
export class SecondauditComponent implements OnInit {

  uploadUrl = `${Environment.application.bssAPI}/file/upload/thumbs`;

  constructor(
    private beianHomeService: BeianHomeService,
    private beianOrderService: BeianOrderService,
    private message: NzMessageService,
    public location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private baseService: BaseService
  ) { }

  websites = [];

  curtainPhotoDetail = {
    file: {},
    remark: {}
  };

  rejectInfo = {
    index: 4,
    label: '复审驳回',
    title: '复审拒绝',
    message: ''
  };

  // 显示预览，移除的图标
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  imgLoadUrl = Environment.application.bssFront;

  submit() {
    const list = [];
    this.websites.forEach(website => {
      list.push({ ...this.curtainPhotoDetail.file[website.websiteName][`curtainPhoto_original`] }, { ...this.curtainPhotoDetail.file[website.websiteName][`curtainPhoto_thumbnail`] });
    });
    let params = {
      id: this.param.sponsorId,
      sponsorId: this.param.sponsorId,
      orderId: this.param.orderId,
      websiteId: this.websites.map(item => item.id),
      typeId: this.param.type,
      submitList: list.map(item => {
        return {
          moduleId: item.moduleId,
          name: item.name,
          id: item.id,
          url: item.url || item.fuleUrl,
          size: item.size,
          fileAttribute: item.fileAttribute,
          fileAttribute2: item.fileAttribute2
        }
      })
    };

    this.beianOrderService.submitSecond(this.param.orderId, params).subscribe(data => {
      if (data.code == 0) {
        this.message.success('复审提交成功');
        this.router.navigate(['/order']);
      } else {
        this.message.warning(data.message);
      }
    })
  };

  beforeUpload = (file: UploadFile, website, item) => {
    return this.baseService.beforeUpload(file);
  };

  private formatData(file, website, item) {
    if (file.response.code == 0) {
      const result = file.response.result;
      for (let key in result) {
        if (key === 'thumbnail') item.url = result[key].url;
        this.curtainPhotoDetail.file[website.websiteName][`${item.fileAttribute}_${key}`]
          = { ...this.curtainPhotoDetail.file[website.websiteName][`${item.fileAttribute}_${key}`], ...result[key] };
      };
    }
  }

  handlePreview = (info: { file: UploadFile }, website, item) => {
    item.previewVisible = true;
  };

  handleRemove = (info: { file: UploadFile }, website, item) => {
    let original = '';
    let thumb = '';
    for (let key in this.curtainPhotoDetail.file[website.websiteName]) {
      let curtainPhoto = this.curtainPhotoDetail.file[website.websiteName][key];
      if (curtainPhoto.fileAttribute2 === 'original') original = curtainPhoto.url;
      if (curtainPhoto.fileAttribute2 === 'thumbnail') thumb = curtainPhoto.url;
    }
    this.beianHomeService.deleteFiles([Base64.encode(original), Base64.encode(thumb)]).subscribe(data => {
      if (data.code == 0) {
        item.fileList = [];
        for (let key in this.curtainPhotoDetail.file[website.websiteName]) {
          let curtainPhoto = this.curtainPhotoDetail.file[website.websiteName][key];
          delete curtainPhoto.id;
        }
        this.message.success('删除成功');
      } else {
        this.message.warning(data.message);
      }
    })
  };

  handleChange(info: { file: UploadFile }, website, item): void {
    switch (info.file.status) {
      case 'uploading':
        item.loading = true;
        break;
      case 'done':
        item.loading = false;
        this.formatData(info.file, website, item);
        break;
      case 'error':
        this.message.error('Network error');
        item.loading = false;
        break;
    }
  }

  // 订单详情
  getOrderDetail(orderId) {
    this.beianOrderService.getSecondDetail(orderId).subscribe(data => {
      if (data.code == 0 && data.result.length > 0) {
        const secondwebsites = data.result.map(website => {
          const fileList = website.fileList.filter(item => item.fileAttribute == 'curtainPhoto');
          return { ...website, fileList };
        });
        secondwebsites.forEach(website => {
          this.curtainPhotoDetail.file[website.websiteName] = {};
          this.curtainPhotoDetail.remark[website.websiteName] = {};
          if (website.fileList.length == 0) {
            website.fileList.push({
              fileAttribute: 'curtainPhoto',
              fileAttribute2: 'original',
              moduleId: website.id
            }, {
                fileAttribute: 'curtainPhoto',
                fileAttribute2: 'thumbnail',
                moduleId: website.id
              })
          }
          website.fileList.forEach(item => {
            this.curtainPhotoDetail.file[website.websiteName][`${item.fileAttribute}_${item.fileAttribute2}`] = item;
            if (item.fileAttribute2 == 'thumbnail') {
              item.moduleId = website.id;
              item.fileAttribute = item.fileAttribute;
              item.fileAttribute2 = item.fileAttribute2;
              item.size = item.size;
              item.name = item.name;
              

              item.previewVisible = false;
              item.loading = false;
              item.fileList = item.name ? [{
                uid: item.id,
                name: item.name || item.fileName,
                status: 'done',
                url: item.url || item.fuleUrl
              }] : [];
              item.beforeUpload = (file: UploadFile) => {
                return this.beforeUpload(file, website, item);
              };
              item.handlePreviewFunc = (info: { file: UploadFile }) => {
                this.handlePreview(info, website, item);
              };
              item.handleRemoveFunc = (info: { file: UploadFile }) => {
                this.handleRemove(info, website, item);
              };
              item.handleChange = (info: { file: UploadFile }) => {
                this.handleChange(info, website, item);
              };
            }
            item.url = item.fuleUrl;
          });
          website.list = website.fileList.filter(item => item.fileAttribute2 === 'thumbnail');
          website.remarks.forEach(remark => {
            this.curtainPhotoDetail.remark[website.websiteName][remark.code] = remark.remark;
          })
        });
        this.websites = [...secondwebsites];
      }
    })
  }

  // 订单状态
  getOrderStatus(orderId) {
    this.beianOrderService.getOrderStatus(orderId).subscribe(data => {
      if (data.code == 0) {
        this.rejectInfo.message = data.result.recheckRemark;
      }
    })
  }

  param: any = {};
  ngOnInit() {
    this.param = this.route.snapshot.queryParams;
    this.getOrderDetail(this.param.orderId);
    this.getOrderStatus(this.param.orderId);
  }

}

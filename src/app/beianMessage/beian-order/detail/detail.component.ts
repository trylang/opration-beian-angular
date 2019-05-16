import { Component, OnInit } from '@angular/core';
import { NzMessageService } from "ng-zorro-antd";
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { throwError as observableThrowError} from 'rxjs';

import { BeianOrderService } from '../beian-order.service';
import { detailAry,  itemAry, sponsorImgsAry, websiteImgsAry} from '../baseInfo';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  constructor(
    private beianOrderService: BeianOrderService,
    private message: NzMessageService,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
  ) {}

  detailAry: any = JSON.parse(JSON.stringify((detailAry)));
  itemAry: any = JSON.parse(JSON.stringify((itemAry)));
  sponsorImgsAry: any = JSON.parse(JSON.stringify((sponsorImgsAry)));
  websiteImgsAry: any = JSON.parse(JSON.stringify((websiteImgsAry)));

  getObj(type, name ='网站信息', item) {
    return {
      title: name,
      type: type,
      itemAry: item
    };
  };
  
  detailInfo: any = {
    orderInfo: {id: '', orderStatus: ''},
    sponsorInfo: {},
    sponsor_imgs: {},
  };
  getOrderDetail(orderId) {
    this.beianOrderService.getOrderDetail(orderId).subscribe(data => {
      if (data.code == 0) {
        this.detailInfo = Object.assign(this.detailInfo, data.result);
        if (data.result.sponsorInfo && data.result.sponsorInfo.fileList.length > 0) {
          data.result.sponsorInfo.fileList.forEach(item => {
            this.detailInfo.sponsor_imgs[item.fileAttribute] = item.fuleUrl;
            if (item.fileAttribute2 == 'original') {
              this.sponsorImgsAry.itemAry.push({
                label: this.identity[item.fileAttribute],
                value: item.fileAttribute
              });
            }
          })
          this.detailAry.push(this.sponsorImgsAry);
        }
        if (data.result.websites) {
          data.result.websites.forEach(item => {
            this.detailInfo['website_' + item.websiteName] = item;
            item.websiteImgsAry = [];
            this.detailAry.push(this.getObj('website_' + item.websiteName, item.websiteName + '网站信息', this.itemAry));
            if (item.fileList.length > 0) {
              this.detailInfo['website_imgs_'+ item.websiteName] = {};
              item.fileList.forEach(img => {
                this.detailInfo['website_imgs_'+ item.websiteName][img.fileAttribute] = img.fuleUrl;
                if (img.fileAttribute2 == 'original') {
                  item.websiteImgsAry.push({
                    label: this.identity[img.fileAttribute],
                    value: img.fileAttribute
                  });
                }
                
              });
              this.detailAry.push(this.getObj('website_imgs_'+ item.websiteName,  item.websiteName + '材料', item.websiteImgsAry));
            }

          })
        }
      }
    })
  }

  identity = {};
  getJson() {
    return new Promise(resolve => {
      return this.http.get('assets/data/identity.json').subscribe(data => {
        this.identity = data;
        resolve(data);
      });
      // return this.http.get('assets/data/identity.json').pipe(tap(data => {
      //   this.identity = data;
      //   resolve(data);
      // }), catchError(this.handleError()));
    });
  }

  private handleError() {
    return (error: any) => {
      const message = error.message || error.error;
      console.error('An error occurred', error);
      return observableThrowError(message);
    }
  }

  async ngOnInit() {
    let orderId = this.route.snapshot.paramMap.get('orderId');
    await this.getJson();
    this.getOrderDetail(orderId);  
  }

}

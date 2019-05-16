import {Component, OnInit} from '@angular/core';
import {MyBeianService} from '../my-beian.service';
import {NzMessageService} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';

@Component({
  selector: 'app-website-message',
  templateUrl: './website-message.component.html',
  styleUrls: ['./website-message.component.css']
})
export class WebsiteMessageComponent implements OnInit {

  constructor(private myBeianService: MyBeianService,
              private message: NzMessageService,
              private router: ActivatedRoute,
              private route: Router) {
  }

  // websites request params
  websiteParams = {
    start: 1,
    length: 10,
    sponsorId: '',
    timestamp: ''
  };
  // sponsor show params
  sponsorEntityShowParams = {
    sponsorId: '',   //	主体id
    subjectRecordNumber: '',   //	ICP主体备案号
    sponsorName: '',   //	主办单位或主办人名称
    headerName: '',  //	负责人
    subjectIcpStatus: '',   //	ICP主体备案状态 1已备案 2未备案
    subjectIcpStatusName: '',   //	ICP主体备案状态 1已备案 2未备案
    status: '',   //	主体状态 sponsorcancel注销主体中，normal其他正常状态
  };

  // websites show params
  websitesShowParams = {
    id: '',	//	网站id
    name: '',	//	网站名称
    headerName: '',	//	负责人
    icpRegistered: '',	//	ICP主体备案号
    icpRegisteredStatus: '',	//	ICP网站备案状态 1已备案 2未备案
    icpWebsiteStatusName: '',	//	ICP网站备案状态 1已备案 2未备案
    websiteStatus: '',	//	webcancel注销网站中，insertcancel取消接入中，normal其他正常状态
    icpWebsiteCode: ''
  };

  pageIndex;
  pageSize;
  totalElements;
  isLoading;
  sponsorId;
  // the website id
  websiteId;

  // 页码改变
  pageChange(): void {
    this.getWebsiteData();
    this.isLoading = false;
  }

  /**
   * According to the requirements, determine whether you can jump
   * @param id
   * @param mark
   * params :modifyWebsiteMark,logoutWebsiteMark,cancelAccessMark
   */
  jumpToChangePage(id, mark): void {
    this.myBeianService.verifyNextStep().subscribe(data => {
      if (data.code === '0' && data.result === true) {
        // if (mark === 'modifyWebsiteMark') {
        //   this.route.navigate([`/list/${id}/website/change`], {queryParams: {websiteId: id, sponsorId: this.sponsorId, type: 9}});
        // }
        if (mark === 'logoutWebsiteMark') {
          this.route.navigate([`/list/${id}/website/logout`]);
        }
        if (mark === 'cancelAccessMark') {
          this.route.navigate([`/list/${id}/cancel`]);
        }
      } else {
        this.message.warning(data.message);
      }
    });
  }

  /**
   * see the sponsor detail
   */
  sponsorDetail(websiteId): void {
    this.route.navigate([`/list/${this.sponsorId}/sponsor/detail`],{queryParams: {type: 9,websiteId: websiteId}});
  }

  // get websites data
  getWebsiteData(): void {
    this.isLoading = true;
    this.websiteParams.start = (Number(this.pageIndex) - 1) * Number(this.pageSize);
    this.websiteParams.length = this.pageSize;
    this.websiteParams.timestamp = new Date().getTime().toString();
    this.websiteParams.sponsorId = this.router.snapshot.params['id'];
    this.myBeianService.websiteData(this.websiteParams).subscribe(data => {
      if (data.code === '0') {
        this.totalElements = data.result.list.iTotalDisplayRecords;
        this.websiteParams.start = data.result.list.start / data.result.list.length + 1;
        this.websiteParams.length = data.result.list.length;
        // sponsor message
        this.sponsorEntityShowParams = data.result.sponsorEntity;
        // websites params
        this.websiteParams = data.result.list.data || [];
        this.websitesShowParams.name = this.websitesShowParams.name;
        this.websitesShowParams.headerName = this.websitesShowParams.headerName;
        this.websitesShowParams.icpWebsiteStatusName = this.websitesShowParams.icpWebsiteStatusName;
        this.websitesShowParams.websiteStatus = this.websitesShowParams.websiteStatus;
        this.isLoading = false;
      } else {
        this.message.warning(data.message);
      }

    });
  }

  /**
   * Verify if you can do next
   * @param dataParams
   * @param mark
   * params as list:
   *
   * addWebisteMark
   * accessBeianMark
   * logoutSponsorMark
   * changeSponsorMark
   */
  verifyNextStepFunction(mark): void {
    this.myBeianService.verifyNextStep().subscribe(data => {
      console.log(data.result, 'fsdfds');
      if (data.result === true) {
        if (mark === 'addWebisteMark') {
          this.route.navigate([`/list/${this.sponsorId}/website/new`],{queryParams: {type: 10}});
        }
        if (mark === 'accessBeianMark') {
          // routerLink="./{{data.id}}/sponsor/access"
          this.route.navigate([`/list/${this.sponsorId}/sponsor/access`],{queryParams: {type: 11}});
        }
        //  routerLink="./{{data.id}}/sponsor/logout"
        if (mark === 'logoutSponsorMark') {
          this.route.navigate([`/list/${this.sponsorId}/sponsor/logout`]);
        }
        // routerLink="./{{data.id}}/sponsor/change"
        if (mark === 'changeSponsorMark') {
          this.route.navigate([`/list/${this.sponsorId}/sponsor/change`],{queryParams: {type: 6}});
        }
      } else {
        this.message.warning(data.message);
      }
    });
  }

  ngOnInit() {
    this.sponsorId = this.router.snapshot.params['id'];
    this.isLoading = true;
    this.pageIndex = 1;
    this.pageSize = 10;
    this.websiteParams = {
      start: this.pageIndex,
      length: this.pageSize,
      sponsorId: '',
      timestamp: ''
    };
    this.getWebsiteData();
  }
}

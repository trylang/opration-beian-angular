import {Component, OnInit} from '@angular/core';
import {MyBeianService} from './my-beian.service';
import {NzMessageService} from 'ng-zorro-antd';
import {NzNotificationService} from 'ng-zorro-antd';
import {Router} from '@angular/router';

@Component({
  selector: 'app-my-beian',
  templateUrl: './my-beian.component.html',
  styleUrls: ['./my-beian.component.css']
})
export class MyBeianComponent implements OnInit {

  constructor(private myBeianService: MyBeianService,
              private message: NzMessageService,
              private notification: NzNotificationService,
              private route: Router) {
  }

  // beian request params
  myBeianListParams = {
    start: 1,
    length: 10,
    timestamp: ''
  };
  // verify the sponsor
  isOperationManager;
  // page params
  pageIndex;
  pageSize;
  totalElements;
  // all data
  dataSet;
  // page change event
  pageChange(): void {
    this.getMyBeianList();
  }

  // get my beian list
  getMyBeianList(): void {
    this.myBeianListParams.start = (Number(this.pageIndex) - 1) * Number(this.pageSize);
    this.myBeianListParams.length = this.pageSize;
    this.myBeianListParams.timestamp = new Date().getTime().toString();
    this.myBeianService.myBeianList(this.myBeianListParams).subscribe(data => {
      if (data.code === '0') {
        this.totalElements = data.result.iTotalDisplayRecords;
        this.myBeianListParams.start = data.result.start / data.result.length + 1;
        this.myBeianListParams.length = data.result.length;
        this.dataSet = data.result.data || [];
        this.isOperationManager = data.result.isOperationManager;
      } else {
        this.message.warning(data.message);
      }
    });
  }

  // Verify if the subject can be created
  createSubject(): void {
    this.myBeianService.verifySubject().subscribe(data => {
      if (data.code === '0') {
        this.route.navigate([`/home/type`]);
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
  verifyNextStepFunction(dataParams, mark): void {
    this.myBeianService.verifyNextStep().subscribe(data => {
      if (data.result === true) {
        if (mark === 'addWebisteMark') {
          this.route.navigate([`/list/${dataParams.id}/website/new`],{queryParams: {type: 10}});
        }
        if (mark === 'accessBeianMark') {
          // routerLink="./{{data.id}}/sponsor/access"
          this.route.navigate([`/list/${dataParams.id}/sponsor/access`],{queryParams: {type: 11}});
        }
        //  routerLink="./{{data.id}}/sponsor/logout"
        if (mark === 'logoutSponsorMark') {
          this.route.navigate([`/list/${dataParams.id}/sponsor/logout`]);
        }
        // routerLink="./{{data.id}}/sponsor/change"
        if (mark === 'changeSponsorMark') {
          this.route.navigate([`/list/${dataParams.id}/sponsor/change`],{queryParams: {type: 6}});
        }
      } else {
        this.message.warning(data.message);
      }
    });
  }

  ngOnInit() {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.myBeianListParams = {
      start: this.pageIndex,
      length: this.pageSize,
      timestamp: ''
    };
    this.getMyBeianList();
  }

}

import { Component, OnChanges, SimpleChanges, Input, Output,EventEmitter } from '@angular/core';
// import { NzMessageService, NzModalRef, NzModalService } from "ng-zorro-antd";
// import { BeianVerificationService } from '../../common-serve/beian-verification.service';
// import { PromptMessageService } from '../../common-serve/prompt-message.service';
// import { typeinfo, markinfo } from '../baseinfo';

@Component({
  selector: 'service-content',
  templateUrl: './service-content.component.html',
  styleUrls: ['../beian-website.component.scss', './service-content.component.scss']
})
export class ServiceContentComponent implements OnChanges {

  @Input()
  list: any;

  @Input()
  remark: string;

  @Output()
  handleService = new EventEmitter();

  constructor() { };

  simpleServiceList = [{
    code: "2019022600000000033",
    name: "单位门户网站",
    checked: false
  }, {
    code: "2019022600000000028",
    name: "综合门户",
    checked: false
  }, {
    code: "2019022600000000031",
    name: "博客/个人空间",
    checked: false
  }, {
    code: "2019022600000000061",
    name: "其他",
    checked: false
  }];

  serviceContentList = [...this.simpleServiceList];

  ifMore = false;

  toggle(type) {
    this.ifMore = (type === 'more' ? true : false);
    this.serviceContentList = (type === 'fold' ? [...this.simpleServiceList] : [...this.list]);
  }

  changeHandle(event) {
    const codeList = event.map(item => item.code);
    const serviceList = [this.list, this.simpleServiceList];
    serviceList.forEach(service => {
      service.forEach(item => {
        item.checked = codeList.includes(item.code) ? true: false;
      })
    });

    this.handleService.emit(event);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['list'] && changes['list'].currentValue) {
      this.list = changes['list'].currentValue;

      this.list.forEach(item => {
        this.simpleServiceList.forEach(simple => {
          if (item.code === simple.code && item.checked === true) {
            simple.checked = true;
          }
        })
      })
    }

    if (changes['remark'] && changes['remark'].currentValue) {
      this.remark = changes['remark'].currentValue;
    }

  }
}
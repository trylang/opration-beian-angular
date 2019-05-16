import { Component, EventEmitter, Input, Output } from '@angular/core';
 
@Component({
  selector: 'common-header',
  templateUrl: './commonheader.component.html',
  styleUrls: ['./commonheader.component.scss']
})
export class CommonheaderComponent { 
  @Input()
  set status(status: object) {
    this.statusInfo = status;
    this.getFullStatus(status);
  }
  get status(): object {return {}}
  current: number;
  statusInfo: any;
  steps = [{
    label: '选择验证产品',
    status: 'finish',
  }, {
    label: '填写主体及网站信息',
    status: 'finish',
  }, {
    label: '进行初审',
    status: 'finish',
  }, {
    label: '进行复审',
    status: 'wait',
  }, {
    label: '提交管局审核',
    status: 'wait',
  }, {
    label: '备案成功',
    status: 'wait',
  }];

  getStatus(index) {
    if (index == this.current) return 'process';
    return index > this.current ? 'wait': 'finish';
  }

  getFullStatus(status) {
    this.current = status.index;
    this.steps.splice(status.index, 0, {
      label: status.label,
      status: 'process'
    });

  }

}
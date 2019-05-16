import { Component, OnInit } from '@angular/core';
import { BeianOrderService } from './beian-order.service';
import {NzMessageService} from 'ng-zorro-antd';
import { nextAction } from './baseInfo';

@Component({
  selector: 'app-beian-order',
  templateUrl: './beian-order.component.html',
  styleUrls: ['./beian-order.component.scss']
})
export class BeianOrderComponent implements OnInit {

  constructor(private message: NzMessageService, private beianOrderService: BeianOrderService) {
    this.getTypes();
    this.getOrders();
  }

  reviewStatus = 'init';
  isVisible = false;
  id: string;

  paramObj = {
    typeId: '',
    statusId: '',
    orderId: ''
  }

  optionObj = {
    types: [{id: '', type: '全部'}],
    status: []
  }

  results = {
    data: [],
    iTotalRecords: 0
  };
  numberReg = /^[0-9]*$/;
  orderErrorTipShow = false;

  showModal(id) {
    this.isVisible = true;
    this.id = id;
  }

  handleOk(): void {
    this.cancelOrder(this.id);
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  selectStatus(event) {
    this.optionObj.status = [];
    this.paramObj.statusId = '';
    this.getStatus(event);
  }

  searchOrder(type?) {
    if (type === 'reload') {
      this.paramObj = {
        typeId: '',
        statusId: '',
        orderId: ''
      };
    }
    if (!this.numberReg.test(this.paramObj.orderId)) {
      this.orderErrorTipShow = true;
    } else {
      this.orderErrorTipShow = false;
      this.getOrders({start: 0, ...this.paramObj});
    }
  }

  getTypes() {
    this.beianOrderService.getTypes().subscribe(data => {
      if (data.code == 0) {
        this.optionObj.types = [...this.optionObj.types, ...data.result];
      }
    })
  }

  getStatus(typeId) {
    this.beianOrderService.getStatus(typeId).subscribe(data => {
      if (data.code == 0) {
        this.optionObj.status = data.result;
      }
    })
  }

  pageIndexChange(index): void {
    this.getOrders({start: (index-1)*10, ...this.paramObj})
  }

  getOrders(param?) {
    let params = { start: 0, length: 10, ...param};
    this.beianOrderService.getOrders(params).subscribe(data => {
      if (data.code == '0') {
        data.result.data.forEach(item => {
          item.nextLabel = nextAction[item.statusId] ? nextAction[item.statusId].label : '-';
          if (nextAction[item.statusId] && typeof nextAction[item.statusId].link == 'object') {
            const linkinfo = nextAction[item.statusId].link;
            item.nextLink = linkinfo[item.typeId];
          } else {
            item.nextLink = nextAction[item.statusId] ? nextAction[item.statusId].link : '';
          }
          
        });
        this.results.data = data.result.data;
        this.results.iTotalRecords = data.result.iTotalRecords;
      }
    })
  }

  cancelOrder(id) {
    this.beianOrderService.cancelOrder(id).subscribe(data => {
      if (data.code == 0) {
        this.message.success('撤销备案成功');
        this.getOrders();
      } else {
        this.message.warning(data.message);
      }
    })
  }

  ngOnInit() {
    
  }

}

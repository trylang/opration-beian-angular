import { Component, OnInit } from '@angular/core';
import { NzMessageService } from "ng-zorro-antd";
import { Router, ActivatedRoute } from '@angular/router';

import { BeianOrderService } from '../beian-order.service';

@Component({
  selector: 'app-manageaudit',
  templateUrl: './manageaudit.component.html',
  styleUrls: ['./manageaudit.component.scss']
})
export class ManageauditComponent implements OnInit {

  constructor(
    private beianOrderService: BeianOrderService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    let orderId = this.route.snapshot.paramMap.get('orderId');
    // this.param = Object.assign(this.param, this.route.snapshot.queryParams);
  }

}

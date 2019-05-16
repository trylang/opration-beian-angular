import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-no-sms-reminder',
  templateUrl: './no-sms-reminder.component.html',
  styleUrls: ['./no-sms-reminder.component.css']
})
export class NoSmsReminderComponent implements OnInit {

  constructor(public route:Router) { }
  // 定时器时长
  timer = 5;
  timer1;

  timerFunction():void {
    // const that = this;
    // this.timer1 = setInterval(function () {
    //   that.timer--;
    //   if (that.timer <= 0) {
    //     clearInterval(that.timer1);
    //     this.route.navigate([`list`]);
    //   }
    // }, 1000);

    // 稍后需要问下上面的跳转
    this.timer1 = setInterval(()=>{
      this.timer--;
      if (this.timer<=0) {
        clearInterval(this.timer1);
        // 跳转
        this.route.navigate([`list`]);
      }
    },1000)
  }

  ngOnInit() {
    // 初始化时加载定时器，完事就跳转到我的备案页面
    this.timerFunction();
  }


}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as echarts from 'echarts';


@Component({
  selector: 'app-special-content',
  templateUrl: './special-content.component.html',
  styleUrls: ['./special-content.component.css']
})
export class SpecialContentComponent implements OnInit {




  constructor( ) { }



  ngOnInit() {
    let str = 'this.organizerParam.sponsorName';
    let idx = str.lastIndexOf('.');

  }

}

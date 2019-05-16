import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  config: any;
  constructor(private route: ActivatedRoute,
              private titleService: Title) {
  }
  ngOnInit() {
    this.config = this.route.snapshot.data;
// Sets the page title
    this.titleService.setTitle(this.config.title);
  }

}

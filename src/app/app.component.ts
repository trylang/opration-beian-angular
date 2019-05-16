import {Component, OnInit} from '@angular/core';
import {WebsocketService} from '@global/shared/websocket/websocket-service';
import {Environment} from '../environments/environment';
import {NavHeaderService} from '@global/layout/default/nav-header/nav-header.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private websocketService: WebsocketService) {

  }

  ngOnInit() {
    this.websocketService.connect(Environment.application.websocketServer);
    NavHeaderService.environment = Environment.application;
  }
}

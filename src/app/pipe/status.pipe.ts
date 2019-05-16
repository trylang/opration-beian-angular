import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscriber, throwError as observableThrowError, observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PipeService } from './pipe.service';

@Pipe({ name: 'status' })
export class StatusPipe implements PipeTransform {
  constructor(
    private http: HttpClient,
    private pipeService: PipeService
  ) { }

  getStatus(url): Observable<any> {
    return this.http.get(`assets/status/${url}.json`).pipe(
      tap(response => {
        const key = 'status' + url;
        this.pipeService.statusData[key] = response;
        return response;
      }),
      catchError(this.handleError())
    )
  }

  private handleError() {
    return (error: any) => {
      const message = error.message || error.error;
      console.error('An error occurred', error);
      return observableThrowError(message);
    }
  }

  private trans(datas, val, label) {
    let cssClass = '', res = '', flag = false;
    for (const key in datas) {
      const data = datas[key];
      if (data.status === val) {
        flag = true;
        switch (data.color) {
          case 'yellow':
            cssClass = 'label-status-warning';
            break;
          case 'red':
            cssClass = 'label-status-danger';
            break;
          case 'blue':
            cssClass = 'label-status-info';
            break;
          case 'green':
            cssClass = 'label-status-success';
            break;
          case 'otherYellow':
            cssClass = 'label-status-warning-other';
            label = data.label;
            break;
          case 'gray':
            cssClass = 'label-status-default';
            break;
          default:
            cssClass = 'label-status-info';
            break;
        }
      }
    }
    res = `<span class="label-status iconfont icon-zhuangtai ${cssClass}">${label}</span>`;
    return res;
  }

  transform(value, url, label): Observable<any>{
    return new Observable((observer: Subscriber<any>) => {
      const key = 'status' + url;
    if (this.pipeService.noGetStatusUrl[key]) {
      if (this.pipeService.statusData && this.pipeService.statusData[key]) {
        const datas = this.pipeService.statusData[key];
        observer.next(this.trans(datas, value, label));
      } else {
        const time = setInterval(() => {
          if (this.pipeService.statusData && this.pipeService.statusData[key]) {
            let datas = this.pipeService.statusData[key];
            observer.next(this.trans(datas, value, label));
            clearInterval(time);
          }
        }, 1);
      }
    } else {
      this.getStatus(url).subscribe(data => {
        observer.next(this.trans(data, value, label));
      });
      this.pipeService.noGetStatusUrl[key] = true;
    }
    })
    
  }
}

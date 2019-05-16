import { Injectable } from '@angular/core';
import { Environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BeianOrderService {
  constructor(private http: HttpClient) { }

  // 备案类型下拉列表
  getTypes(): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/orders/types`;
    return this.http.get(url).pipe(tap(response => response),
      catchError(this.handleError()));
  }

  // 备案状态下拉列表
  getStatus(typeId): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/orders/status`;
    return this.http.get(url, {
      params: {
        typeId
      }
    }).pipe(tap(response => response),
      catchError(this.handleError()));
  }

  // 备案订单列表
  getOrders(param): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/orders`;
    return this.http.get(url, {
      params: param
    }).pipe(tap(response => response),
      catchError(this.handleError()));
  }

  // 备案订单详情
  cancelOrder(orderId): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/orders/${orderId}`;
    return this.http.delete(url).pipe(tap(response => response),
      catchError(this.handleError()));
  }

  // 撤销备案订单
  getOrderDetail(orderId): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/orders/${orderId}`;
    return this.http.get(url).pipe(tap(response => response),
      catchError(this.handleError()));
  }

  // 备案复审提交
  submitSecond(orderId, param): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/orders/${orderId}/reviews`;
    return this.http.post(url, param).pipe(tap(response => response),
      catchError(this.handleError()));
  }

  // 备案订单驳回状态
  getOrderStatus(orderId): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/orders/orderinfo/${orderId}`;
    return this.http.get(url).pipe(tap(response => response),
      catchError(this.handleError()));
  }


  // 主体详情
  sponsorDetail(params): Observable<any> {
    const url = Environment.application.bssAPI + `/beian/orders/${params.orderId}/sponsor`;
    return this.http.get(url, params.timestamp).pipe(tap(response => response),
      catchError(this.handleError())
    )
  }
  // 复审页面数据获取
  getSecondDetail(orderId): Observable<any> {
    const url = Environment.application.bssAPI + `/beian/orders/recheckRemark/${orderId}`;
    return this.http.get(url).pipe(tap(response => response),
      catchError(this.handleError())
    )
  }
  // 初审驳回备注
  firstReject(params): Observable<any> {
    const url = Environment.application.bssAPI + `/beian/orders/orderinfo/${params.orderId}`;
    return this.http.get(url, params.timestamp).pipe(tap(response => response),
      catchError(this.handleError())
    )
  }
  // 省市区下拉列表
  getCitys(): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/provinces`;
    return this.http.get(url).pipe(tap(res => res), catchError(this.handleError()));
  }
  //负责人证件类型
  principalCertificateType(param): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/user/certificates`;
    return this.http.get(url, param).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }
  //获取主办单位性质下拉列表， 证件类型下拉列表
  getWebsiteBeianType(): Observable<any> {
    const url = Environment.application.bssAPI + `/beian/sponsors/certificates`;
    return this.http.get(url).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }
  // 手机验证码获取
  phoneCode(codeRequestParams): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        mobile: codeRequestParams.mobile,
        timestamp: codeRequestParams.timestamp,
      }
    });
    const url = `${Environment.application.bssAPI}/beian/verify`;
    return this.http.get(url, { params }).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }
  /*我的主体中，修改主体*/
  changeSponsorData(params): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/${params.sponsorId}`;
    return this.http.post(url, params).pipe(tap(response => response),
      catchError(this.handleError())
    )
  }

  //主办单位信息保存
  sponsorMessageKeep(param): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors`;
    return this.http.patch(url, param).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  private handleError() {
    return (error: any): Observable<any> => {
      return observableThrowError(error);
    }
  }
}

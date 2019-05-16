import { Injectable } from '@angular/core';
import {Environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError as observableThrowError} from 'rxjs';
import {catchError,tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MyBeianService {

  constructor(private http: HttpClient) { }


  // 我的备案列表
  myBeianList(param): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        timestamp: param.timestamp,
        start:param.start,
        length:param.length
      }
    });
    const url = Environment.application.bssAPI + '/beian/sponsors';
    // const url = `http://117.50.44.72:7300/mock/5c85fdb142c56f375f4db6fe/operation/operation/beian/sponsors`
    return this.http.get(url,{params}).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }
  // 主体信息
  subjectData(params):Observable<any> {
    const url = Environment.application.bssAPI + `/beian/sponsors/${params.sponsorId}`;
    return this.http.get(url,params.timestamp).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 网站数据
  websiteData(params):Observable<any> {
    // const url =  `http://117.50.44.72:7300/mock/5c85fdb142c56f375f4db6fe/operation/operation/beian/sponsors/websites`;
    const url = Environment.application.bssAPI + `/beian/sponsors/${params.sponsorId}/websites`;
    return this.http.get(url,params).pipe(tap(response => response),
      catchError(this.handleError())
    )
  }

  // 主体详情
  sponsorDetail(params):Observable<any> {
    const url = Environment.application.bssAPI + `/beian/sponsors/${params.sponsorId}`;
    return this.http.get(url,params.timestamp).pipe(tap(response => response),
      catchError(this.handleError())
    )
  }

  // 网站详情
  websiteDetail(websiteDetailParams):Observable<any> {
    const url = Environment.application.bssAPI + `/beian/sponsors/websites/${websiteDetailParams.websiteId}`;
    const params = new HttpParams({
      fromObject: {
        timestamp: websiteDetailParams.timestamp,
        websiteId:websiteDetailParams.websiteId,
      }
    });
    return this.http.get(url,{params}).pipe(tap(response => response),
      catchError(this.handleError())
    )
  }
  // 网站信息变更的初始化数据
  websiteChangeDetail(websiteDetailParams):Observable<any> {
    const params = new HttpParams({
      fromObject: {
        timestamp: websiteDetailParams.timestamp,
        websiteId: websiteDetailParams.websiteId,
      }
    });
    const url = Environment.application.bssAPI + `/beian/sponsors/websites/${websiteDetailParams.websiteId}/middledetails`;
    return this.http.get(url,{params}).pipe(tap(response => response),
      catchError(this.handleError())
    )
  }

  // 省市区下拉列表
  getCitys():Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/provinces`;
    return this.http.get(url).pipe(tap(res => res), catchError(this.handleError()));
  }

  //负责人证件类型
  principalCertificateType(param): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/user/certificates`;
    return this.http.get(url,param).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  //获取主办单位性质下拉列表， 证件类型下拉列表
  getWebsiteBeianType():Observable<any> {
    const url = Environment.application.bssAPI + `/beian/sponsors/certificates`;
    return this.http.get(url).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 手机验证码获取
  phoneCode(codeRequestParams):Observable<any> {
    const params = new HttpParams({
      fromObject: {
        mobile: codeRequestParams.mobile,
        timestamp: codeRequestParams.timestamp,
      }
    });
    const url = `${Environment.application.bssAPI}/beian/verify`;
    return this.http.get(url,{params}).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  /*我的主体中，修改主体*/
  changeSponsorData(params):Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/${params.id}`;
    return this.http.put(url,params).pipe(tap(response => response),
      catchError(this.handleError())
    )
  }

  // 注销主体
  sponsorLogout(params):Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/${params.sponsorId}/cancelsponsors`;
    return this.http.put(url,params).pipe(tap(response => response),
      catchError(this.handleError())
    )
  }
  // 获取网站的手机号
  phoneNumberFunction(phoneParams):Observable<any> {
    const params = new HttpParams({
      fromObject: {
        timestamp: phoneParams.timestamp,
        websiteId: phoneParams.websitedId,
      }
    });
    const url = Environment.application.bssAPI + `/beian/websites/${phoneParams.websitedId}/telphone`;
    return this.http.get(url,{params}).pipe(tap(response => response),
      catchError(this.handleError())
    )
  }

  // 提交取消验证的数据
  submitCancelAccessData(params):Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/websites/${params.websiteId}/access`;
    return this.http.put(url,params).pipe(tap(response => response),
      catchError(this.handleError())
    )
  }

  // 网站信息注销
  websiteLogout(params):Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/websites/cancelWebsites/${params.websiteId}`;
    return this.http.put(url,params.password).pipe(tap(response => response),
      catchError(this.handleError())
    )
  }

  // 密码验证
  passwordVerification(params):Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/passwords`;
    return this.http.patch(url,params).pipe(tap(response => response),
      catchError(this.handleError())
    )
  }

  // 产品验证
  productVerification(params):Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/domain/instances`;
    return this.http.patch(url,params).pipe(tap(response => response),
      catchError(this.handleError())
    )
  }

  // 网站页面下拉列表接口
  getApprovalsTypes(): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/starts/websites/approvals/types`;
    return this.http.get(url).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 已经验证的域名列表
  getDomains(param): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/websites/domains`;
    return this.http.get(url, {
      params: param
    }).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 网站信息变更
  myBeianWebsiteChange(params):Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/websites/${params.id}`;
    return this.http.put(url,params).pipe(tap(response => response),
      catchError(this.handleError())
    )
  }
  // 注销备案验证
  // cancelPasswordVerification(params):Observable<any> {
  //   const url = `${Environment.application.bssAPI}/beian/sponsors/${params.sponsorId}/cancelsponsors`;
  //   return this.http.put(url,params).pipe(tap(response => response),
  //     catchError(this.handleError())
  //   )
  // }

  // 验证是否可以添加主体
  verifySubject(): Observable <any> {
    const url = `${Environment.application.bssAPI}/beian/user/sponsors`;
    return this.http.get(url).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // Verify if you can go to the next step
  verifyNextStep(): Observable <any> {
    const url = `${Environment.application.bssAPI}/beian/orders/getOrderFulfil`;
    return this.http.get(url).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  private handleError() {
    return (error: any): Observable<any> => {
      return observableThrowError(error);
    };
  }


}

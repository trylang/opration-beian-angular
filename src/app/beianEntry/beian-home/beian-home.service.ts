import { Injectable } from '@angular/core';
import {Environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {animationFrameScheduler, Observable, throwError as observableThrowError} from 'rxjs';
import {catchError, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BeianHomeService {

  constructor(private http: HttpClient) { }

  // 已填写的网站列表
  addWebsitesList(params):Observable<any> {
    const url = Environment.application.bssAPI + `/beian/sponsors/websites`;
    return this.http.post(url, params).pipe(tap(response => response),
      catchError(this.handleError()))
  }

  // 删除上传文件 // TODO 等待接口
  deleteUploadFile(fileUrl): Observable<any> {
    const url = `${Environment.application.bssAPI}/file/delete`;
    const options = {
      body: {
        fileUrl: fileUrl
      }
    };
    return this.http.request('delete', url, options).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  //  提交初审
  submitAuditData(params):Observable<any> {
    // console.log(params);
    const url = `${Environment.application.bssAPI}/beian/orders/${params.orderId}/views`;
    return this.http.post(url, params).pipe(tap(response => response),
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

  // 网站页面下拉列表接口
  getApprovalsTypes(): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/starts/websites/approvals/types`;
    return this.http.get(url).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 身份证类型接口
  getCertificates(): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/certificates`;
    return this.http.get(url).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }


  //负责人证件类型
  principalCertificateType(param): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/user/certificates`;
    return this.http.get(url,param).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 获取主体负责人信息
  getSponsorsUser(param): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/users`;
    return this.http.get(url, {
      params: param
    }).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 获取手机验证码
  getVerifyCode(param): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/verify`;
    return this.http.get(url, {
      params: param
    }).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 省市区下拉列表
  getCitys():Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/provinces`;
    return this.http.get(url).pipe(tap(res => res), catchError(this.handleError()));
  }

  // 新增接入密码验证
  vertifySubject(param): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/passwords`;
    return this.http.patch(url, param).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 已经验证的域名列表
  getDomains(param): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/websites/domains`;
    return this.http.get(url, {
      params: param
    }).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 查询可用的域名
  getAvailableDomains(param): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/available/domains`;
    return this.http.get(url,param).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }


  // 已填写的网站列表
  getWebsites(param): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/websites`;
    return this.http.get(url, {
      params: param
    }).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 已经填写的网站列表删除
  deleteWebsite(websiteId: string): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/websites/${websiteId}`;
    return this.http.delete(url).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 已添加的网站编辑
  editWebsite(websiteId: string, param: any): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/websites/${websiteId}`;
    return this.http.patch(url, param).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 网站详情（订单修改结果）
  getRemarkWebsiteDetail(websiteId: string): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        timestamp: new Date().valueOf().toString()
      }
    });
    const url = `${Environment.application.bssAPI}/beian/orders/websites/${websiteId}`;
    return this.http.get(url, { params }).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 已添加的网站详情
  getWebsiteDetail(websiteId: string): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/websites/${websiteId}`;
    return this.http.get(url).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  //主体类型验证并保存
  addType(param): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors`;
    return this.http.post(url, param).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }
//主办单位信息保存
  sponsorMessageKeep(param): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors`;
    return this.http.patch(url, param).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }
  //获取主办单位详情
  getSponsorDetails(detailParam): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        id: detailParam.id,
        timestamp: detailParam.timestamp,
      }
    });
    const url = `${Environment.application.bssAPI}/beian/sponsors/middledetails`;
    return this.http.get(url,{params}).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 主体下网站列表
  getWebsiteListBySponsorId(sponsorId): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/${sponsorId}/websites`;
    return this.http.get(url).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 验证域名
  vertifyDomain(param): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/websites/domains`;
    return this.http.post(url, param).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }
  // 验证域名
  checkDomain(param): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/domain`;
    return this.http.get(url, {
      params: param
    }).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 添加实例ip
  addInstanceIP(param): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/instances`;
    return this.http.post(url, param).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }
   //auditfail获取资料信息
  getAuditfailData(orderId): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/orders/${orderId}`;
    return this.http.get(url).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }
  // 网站驳回数据
  getAuditWebsiteData(orderId): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/orders/website/${orderId}`;
    return this.http.get(url).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }
  //提交初审  beian/orders/{orderId}/views
  subAuditfailInfo(param,orderId) : Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/orders/${orderId}/views`;
    return this.http.post(url, param).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }
  // 上传页面初始化获得数据
  initGetUploadData(dataParams):Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/attachments`;
    // const url = 'http://117.50.44.72:7300/mock/5c85fdb142c56f375f4db6fe/operation/operation/beian/attachments';
    const params = new HttpParams({
      fromObject: {
        orderId: dataParams.orderId,
        timestamp: dataParams.timestamp,
        sponsorId:dataParams.sponsorId
      }
    });
    return this.http.get(url,{params}).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 图片验证码
  pictureVerificationCode(params):Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/validate/images`;
    return this.http.get(url, {
      params: params,
      responseType: 'blob'
    }).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 图片验证码
  validateCodeAndDomain(params):Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/validatecodeanddomain`;
    return this.http.post(url, params).pipe(tap(response => response),
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

  // 幕布信息提交
  curtainMessage(params):Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/curtains/managers`;
    return this.http.post(url, params).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 主体修改，跳往上传
  sponsorChangeNextShow(sponsorId):Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/${sponsorId}`;
    return this.http.get(url).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }
  sponsorChangeNextNewShow(sponsorId):Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/sponsors/${sponsorId}`;
    return this.http.get(url).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }
  // 主体下的网站信息修改，到了上传
  // websiteChangeNextShow(websiteId):Observable<any> {
  //   const url = `${Environment.application.bssAPI}/beian/sponsors/websites/${websiteId}/middledetails`;
  //   return this.http.get(url).pipe(tap(response => response),
  //     catchError(this.handleError())
  //   );
  // }

  websiteChangeNextShow(websiteDetailParams):Observable<any> {
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
  // 区号查询
  areaNumberSearch(areaNumberSearchParams):Observable<any> {
    const params = new HttpParams({
      fromObject: {
        cityId: areaNumberSearchParams.cityId,
        timestamp: areaNumberSearchParams.timestamp,
      }
    });
    const url = `${Environment.application.bssAPI}/beian/sponsors/areaphone`;
    return this.http.get(url,{params}).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }
  // 主体和网站修改跳转到这里，进行提交（上传页面）
  sponsorOrWebsiteReturn(params):Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/orders/${params.orderId}/reviseviews`;
    return this.http.put(url, params).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 复审获取网站信息
  initSecondTrialData(orderId):Observable<any> {
    const url = `${Environment.application.bssAPI}/beian/orders/${orderId}/reviseviews/websites`;
    return this.http.get(url).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }
  // 提交复审信息
  submitSecondTrialData(params):Observable<any> {
    // console.log(params,'service');
    const url = `${Environment.application.bssAPI}/beian/orders/${params.orderId}/reviews`;
    return this.http.post(url, params).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  // 批量删除图片接口
  deleteFiles(fileArr): Observable<any> {
    const url = `${Environment.application.bssAPI}/file/deleteall`;
    const options = {
      body:  fileArr
    };
    return this.http.request('delete', url, options).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }
  // 开始备案调用接口
  startJump(timestamp): Observable<any> {
    const url = `${Environment.application.bssAPI}/beian`;
    const params = new HttpParams({
      fromObject: {
        timestamp: timestamp
      }
    });
    return this.http.get(url,{params}).pipe(tap(response => response),
      catchError(this.handleError())
    );
  }

  private handleError() {
    return (error: any): Observable<any> => {
      return observableThrowError(error);
    };
  }
}

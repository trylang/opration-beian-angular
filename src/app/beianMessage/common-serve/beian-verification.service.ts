import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BeianVerificationService {

  constructor() { }

  // the email verification
  emailCheckCode;
  // the phone verification
  phoneCheckCode;
  // idcard verification
  idcardCode;
  // http verification
  httpCode;

  // the email verification
  emailCheck(emailCheck){
    const reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if (!reg.test(emailCheck)){
      this.emailCheckCode = 1;
    }else {
      this.emailCheckCode = 0;
    }
  }
  // return the email verification code
  emailCheckResult(){
    return this.emailCheckCode;
  }

  // the phone verification
  // 支持中国电信获得199号段，中国移动得到198号段，中国联通得到166号段。
  phoneCheck(phoneCheck){
    const reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (!reg.test(phoneCheck)){
      this.phoneCheckCode = 1;
    }else {
      this.phoneCheckCode = 0;
    }
  }
  // return the phone verification code
  phoneCheckResult(){
    return this.phoneCheckCode;
  }

  // ID card verification
  idcardCheck(idcardNumber) {
    const reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    if (!reg.test(idcardNumber)) {
      this.idcardCode = 1;
    } else {
      this.idcardCode = 0;
    }
  }

  // return the phone verification code
  idcardCheckResult(){
    return this.idcardCode;
  }

  // http verification
  httpCheck(httpParams) {
    const httpReg = /\b(http:\/\/*.)/;
    if (!httpReg.test(httpParams)) {
      this.httpCode = 1;
    } else {
      this.httpCode = 0;
    }
  }

  // return the httpcode result
  httpCheckResult(){
    return this.httpCode;
  }


}

import {Injectable} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {BeianVerificationService} from './beian-verification.service';

@Injectable({
  providedIn: 'root'
})
export class PromptInformationService {

  constructor(private message: NzMessageService,
              private beianVerificationService: BeianVerificationService) {
  }

  /**
   * handle the prompt information
   *
   * The application scenarios are as follows:
   * '' verification; blur verification
   */

  warningObj = {
    subjectArea: '主办单位或主办人名称不能为空！',
    sponsorAddress: '主办单位证件住所不能为空！',
    sponsorMailAddress: '主办单位通讯住址不能为空！',
    sponsorGovern: '投资人或主管单位不能为空！',
    headerName: '负责人姓名不能为空！',
    headerNum: '负责人证件号码不能为空！',
    phoneData: '联系方式不能为空！',
    verificationCode: '验证码不能为空！',
    emergencyPhone: '应急联系方式（手机号）不能为空！',
    emailAddress: '邮件地址不能为空！'
  };

  specialWarningObj = {
    emergencyPhone: '请输入正确格式的手机号！',
    phoneData: '请输入正确格式的手机号!',
    emailAddress: '请输入正确的邮件地址!'
  }

  /**
   * the first param is a sign,the second param is input value
   * @param verificationParam
   * @param param
   */
  blurVerificationFunction(verificationParam, param) {
    if (param === '' || param === undefined) {
      switch (verificationParam) {
        case 'subjectArea':
          this.warningMessageFunction(verificationParam);
          break;
        case 'sponsorAddress':
          this.warningMessageFunction(verificationParam);
          break;

        case 'sponsorMailAddress':
          this.warningMessageFunction(verificationParam);
          break;
        case 'sponsorGovern':
          this.warningMessageFunction(verificationParam);
          break;
        case 'headerName':
          this.warningMessageFunction(verificationParam);
          break;
        case 'headerNum':
          this.warningMessageFunction(verificationParam);
          break;
        case 'phoneData':
          this.warningMessageFunction(verificationParam);
          break;
        case 'verificationCode':
          this.warningMessageFunction(verificationParam);
          break;
        case 'emergencyPhone':
          this.warningMessageFunction(verificationParam);
          break;
        case 'emailAddress':
          this.warningMessageFunction(verificationParam);
          break;
        default:
          break;
      }
    } else {
      switch (verificationParam) {
        case 'phoneData':
          this.beianVerificationService.phoneCheck(param);
          if (this.beianVerificationService.phoneCheckResult() === 1) {
            this.warningMessageSpecialFunction(verificationParam);
          }
          break;
        case 'emergencyPhone':
          this.beianVerificationService.phoneCheck(param);
          if (this.beianVerificationService.phoneCheckResult() === 1) {
            this.warningMessageSpecialFunction(verificationParam);
          }
          break;
        case 'emailAddress':
          this.beianVerificationService.emailCheck(param);
          if (this.beianVerificationService.emailCheckResult() === 1) {
            this.warningMessageSpecialFunction(verificationParam);
          }
          break;
      }
    }
  }

  /**
   * '' and null verification,Popup messages
   * @param verificationParam
   */
  warningMessageFunction(verificationParam) {
    this.message.warning(this.warningObj[verificationParam]);
  }

  /**
   * phone number and email verification
   */
  warningMessageSpecialFunction(verificationParam) {
    this.message.warning(this.specialWarningObj[verificationParam]);

  }
}

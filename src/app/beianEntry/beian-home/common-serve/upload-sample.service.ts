import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UploadSampleService {

  constructor() { }

  // the original scan images url
  originalScanUrl;

  /**
   * handle the original scan images
   * @param originalScan
   */
  originalScanFunction(originalScan) {
    switch (originalScan) {
      // 国防结构
      case '2019021900000000011':
        this.originalScanUrl = 'beian-guofangjigou.png';
        break;
      // 政府机关
      case '2019021900000000012':
        this.originalScanUrl = 'zhengfujiguan.png';
        break;
      // 事业单位
      case '2019021900000000013':
        this.originalScanUrl = 'beian-shiyedanwei.png';
        break;
      // 企业
      case '2019021900000000014':
        this.originalScanUrl = 'beian-qiyeyingyezhizhao.png';
        break;
      // 个人
      case '2019021900000000015':
        this.originalScanUrl = 'beian-renxiang.png';
        break;
      // 社会团体
      case '2019021900000000016':
        this.originalScanUrl = 'shehuituanti.png';
        break;
      // 民办非企业单位
      case '2019021900000000017':
        this.originalScanUrl = 'minbanfeiqiye.png';
        break;
      // 基金会
      case '2019021900000000018':
        this.originalScanUrl = 'jijinhui.png';
        break;
      // 律师执业机构
      case '2019021900000000019':
        this.originalScanUrl = 'lvshizhiyejigou.png';
        break;
      // 外国在华文化中心
      case '2019021900000000020':
        this.originalScanUrl = 'waiguozaihuazhongxin.png';
        break;
      // 群众性团体组织
      case '2019021900000000021':
        this.originalScanUrl = 'qunzhongxingtuanti.png';
        break;
      // 司法鉴定机构
      case '2019021900000000022':
        this.originalScanUrl = 'beian-sifajigou.png';
        break;
      // 宗教团体
      case '2019021900000000023':
        this.originalScanUrl = 'zongjiaotuanti.png';
        break;
      // 境外机构  下面没有图片
      case '2019021900000000024':
        this.originalScanUrl = 'shehuituanti.png';
        break;
      // 医疗机构
      case '2019021900000000025':
        this.originalScanUrl = 'shehuituanti.png';
        break;
      // 公证机构
      case '2019021900000000026':
        this.originalScanUrl = 'shehuituanti.png';
        break;
      default:
        this.originalScanUrl = 'shehuituanti.png';
    }
  }

  originalScanResult() {
    return this.originalScanUrl;
  }
}

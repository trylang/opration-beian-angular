import { Injectable } from '@angular/core';
import {UploadFile} from 'ng-zorro-antd';
import {NzMessageService} from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class BeforeUploadService {

  constructor(private message: NzMessageService) { }

  /**
   * handle the images before upload
   *
   * as demand changes,why not use this function
   * @param {UploadFile} file
   * @returns {boolean}
   */
  beforeUploadCode = 0;
  beforeUpload = (file: UploadFile) => {
    if (file.name.length > 100) {
      this.message.warning('文件名字的长度大于100！');
      this.beforeUploadCode = 1;
    }
    // processing by byte
    if (file.size > 4194304) {
      this.message.create('warning', '您上传的文件过大(限制最大为4M)');
      this.beforeUploadCode = 1;
    }
    const fileNameLength = file.name.split('.').length - 1;
    const fileType = file.name.split('.')[fileNameLength];
    if (fileType === 'jpg') {
      return this.beforeUploadCode = 0;
    } else {
      this.message.create('warning', '您需要上传jpg格式的文件！');
      this.beforeUploadCode = 1;
    }
  }

  beforeUploadCodeReturn() {
    return this.beforeUploadCode;
  }
}

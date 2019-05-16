import { Injectable } from '@angular/core';
import { NzMessageService, UploadFile } from "ng-zorro-antd";


@Injectable({
  providedIn: 'root'
})
export class BaseService {
  constructor(private message: NzMessageService,) {}

  beforeUpload = (file: UploadFile) => {
    // 处理图片的名字长度大于100
    if (file.name.length > 100) {
      this.message.warning('文件名字的长度大于100！');
      return false;
    }
    // 这是按字节来算的
    if (file.size > 4194304) {
      this.message.create('warning', '您上传的文件过大(限制最大为4M)');
      return false;
    }
    const fileNameLength = file.name.split('.').length -1;
    const fileType = file.name.split('.')[fileNameLength];
    if (fileType === 'jpg') {
      return true;
    } else {
      this.message.create('warning', '您需要上传jpg格式的文件!');
      return false;
    }
  };
}

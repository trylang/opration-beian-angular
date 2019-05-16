import {Component, OnInit} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {MyBeianService} from '../my-beian.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-password-verification',
  templateUrl: './password-verification.component.html',
  styleUrls: ['./password-verification.component.css']
})
export class PasswordVerificationComponent implements OnInit {

  constructor(private myBeianService: MyBeianService,
              private message: NzMessageService,
              private router: ActivatedRoute,
              private route: Router) {
  }

  // the beian verification params return
  beianPasswordParams = {
    id: '',   // 主体id
    subjectIcpPassword: '',   // 密码
    subjectRecordNumber: ''
  };
  public sponsorId: string;
  // the model show or hidden
  passWordVisible = false;
  // the model message
  warningMessage;

  // beian password verification
  passwordVerification(): void {
    this.beianPasswordParams.id = this.sponsorId;

    if (this.beianPasswordParams.subjectIcpPassword === '' || this.beianPasswordParams.subjectIcpPassword === undefined) {
      this.message.warning('ICP备案密码不可为空！');
      return;
    }
    if (this.beianPasswordParams.subjectRecordNumber === ''|| this.beianPasswordParams.subjectRecordNumber === undefined) {
      this.message.warning('主体备案号不可为空！');
      return;
    }

    this.myBeianService.passwordVerification(this.beianPasswordParams).subscribe(data => {
      if (data.code === '0') {
        this.route.navigate([`/home/type/organizer/websitesadd`], {queryParams: {sponsorId: this.sponsorId, type: 11}});
      } else {
        this.passWordVisible = true;
        this.warningMessage = data.message;
      }
    });
  }

  // icp password verification
  icpPasswordFunction(): void {
    if (this.beianPasswordParams.subjectIcpPassword === '') {
      this.message.warning('请输入icp备案密码');
    }
  }

  // icp sponsor number
  sponsorNumber(): void {
    if (this.beianPasswordParams.subjectRecordNumber === '') {
      this.message.warning('主体备案号不可为空！');
    }
  }

  // Return to the previous step
  previousStepFunction(): void {
    this.route.navigate([`/list/${this.sponsorId}/sponsor/access`], {queryParams: {type: 11}});
  }

  // get sponsor Data
  getData(): void {
    const getSponsorParams = {
      sponsorId: '',
      timestamp: '',
    };
    getSponsorParams.sponsorId = this.sponsorId;
    getSponsorParams.timestamp = new Date().getTime().toString();
    this.myBeianService.sponsorDetail(getSponsorParams).subscribe(data => {
      if (data.code === '0') {
        this.beianPasswordParams.subjectRecordNumber = data.result.sponsorEntity.subjectRecordNumber;
        this.beianPasswordParams.subjectIcpPassword = data.result.sponsorEntity.subjectIcpPassword;
      } else {
        this.message.warning(data.message);
      }
    });
  }

  ngOnInit() {
    this.sponsorId = this.router.snapshot.params['id'];
    this.getData();
  }

}

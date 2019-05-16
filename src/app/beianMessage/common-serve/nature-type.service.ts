import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NatureTypeService {

  constructor() { }

  dataObj = {
    idcardFace: '身份证正面',
    idcardReverse: '身份证反面',
    troopsCode: '部队代号',
    troopsOutLicense: '军队对外有偿服务许可证',
    'office-organizeCode': '组织机构代码证',
    unifySociety: '统一社会信用代码证书',
    'institution-organizeCode': '组织机构代码证',
    careerUnit: '事业单位法人证书',
    businessLicence: '营业执照（个人或企业）',
    'business-organizeCode': '组织机构代码证',
    residentRepresentativeOffice: '外国企业常驻代表机构登记证',
    passport: '护照',
    taiWanIdCardPass: '台湾居民来往大陆通行证',
    HKMacaoPeoplePass: '港澳军民来往内地同行证',
    foreignerCertificate: '外国人永久居住身份证',
    sociogroup: '社会团体法人登记证书',
    'sociogroup-organizeCode': '组织机构代码证',
    'units-organizeCode': '组织机构代码证',
    organizationUnit: '民办非企业单位登记证书',
    socialServiceAgency: '社会服务机构登记证书',
    voluntarySchool: '民办学校办学许可证',
    foundation: '基金会法人登记证书',
    'foundation-organizeCode': '组织机构代码证',
    lawOffice: '律师事务所执业许可证',
    'lawyer-organizeCode': '组织机构代码证',
    culturalCenter: '外国在华文化中心登记证',
    intersocRegistration: '外国政府旅游部门常驻代表机构批准登记证',
    membersChildrenLicense: '北京市外国驻华使馆人员子女学校办学许可证',
    'incorporation-unifySociety': '统一社会信用代码证书',
    expertTestimony: '司法鉴定许可证',
    religiousActivities: '宗教活动场所登记证',
    externalInstitution: '境外机构证件',
    medicalInstitution: '医疗机构执业许可证',
    notaryOffice: '公证机构执业证',
    certificateOfficers: '军官证',
    TaiwanCompatriots: '台胞证',
    HKMacaoCome: '港澳居民来往内地同行证',
    foreignerIdCard: '外国人永久居住证'
  };
}

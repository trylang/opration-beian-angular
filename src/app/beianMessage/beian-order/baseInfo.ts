export const nextAction = {
  'check': {
    'label': '完善初审信息，选择验视产品',
    'link': '/home/type'
  },
  'add': {
    'label': '完善初审信息，填写主体及网站信息',
    'link': '/home/type/organizer'
  },
  'upload': {
    'label': '完善初审信息，上传备案资料',
    'link': '/home/type/organizer/websites/upload/upload'
  },
  'trail': { //初审中
    'label': '-',
    'link': ''
  },
  'trailfail': { // 初审驳回
    'label': '修改初审信息，再次提交初审',
    'link': {
      '1': '/order/sponsor', // 首次备案
      '2': '/order/sponsor', // 新增网站
      '3': '/order/sponsor', // 新增接入
      '6': '/order/sponsor', // 变更主体
      '9': '/order/sponsorconfirm', // 变更网站
      '10': '/order/sponsorconfirm', // 增加网站
      '11': '/order/sponsorconfirm', // 继续接入
    }
  },
  'trailsuccess': { // 初审成功，未提交复审
    'label': '完善复审信息，提交复审',
    'link': '/home/review'
  },
  'reviewfail': { // 复审驳回
    'label': '修改复审信息，再次提交复审',
    'link': '/order/secondaudit'
  },
  'review': { // 复审中
    'label': '-',
    'link': ''
  },
  'approval': { // 管局审核
    'label': '-',
    'link': ''
  },
  '管局审核驳回': {
    'label': '修改备案资料，重新提交',
    'link': '/order/manageaudit'
  },
  '备案成功': {
    'label': '-',
    'link': ''
  },
  '备案超时': {
    'label': '-',
    'link': ''
  },
  '撤销备案': {
    'label': '-',
    'link': ''
  }
};

export const detailAry = [{
  title: '主办单位信息',
  type: 'sponsorInfo',
  itemAry: [{
    label: '主办单位性质：',
    value: 'typeName'
  }, {
    label: '负责人姓名：',
    value: 'headerName'
  }, {
    label: '主办单位证件类型：',
    value: 'certificationName'
  }, {
    label: '负责人证件类型：',
    value: 'headerTypeName'
  }, {
    label: '主办单位证件号码：',
    value: 'certificationNum'
  }, {
    label: '负责人证件号码：',
    value: 'headerNum'
  }, {
    label: '主办单位所属区域：',
    value: 'provinceName'
  }, {
    label: '联系方式1（手机号）：',
    value: 'telephone1'
  }, {
    label: '主办单位或主办人名称：',
    value: 'sponsorName'
  }, {
    label: '联系方式2（座机）：',
    value: 'telephone2'
  }, {
    label: '主办单位证件住所：',
    value: 'sponsorAddress'
  }, {
    label: '应急联系方式（手机号）：',
    value: 'emergencyPhone'
  }, {
    label: '主办单位通讯地址：',
    value: 'sponsorMailAddress'
  }, {
    label: '电子邮件地址：',
    value: 'email'
  }, {
    label: '投资人或主办单位：',
    value: 'sponsorGovern'
  }]
}];

export const itemAry = [{
  label: '网站名称：',
  value: 'websiteName'
}, {
  label: '负责人姓名：',
  value: 'headerName'
}, {
  label: '已验证域名：',
  value: 'domain'
}, {
  label: '负责人证件类型：',
  value: 'headerTypeName'
}, {
  label: '网站首页URL：',
  value: 'homeUrl'
}, {
  label: '负责人证件号码：',
  value: 'headerNum'
}, {
  label: '网站服务内容：',
  value: 'serviceContentName'
}, {
  label: '联系方式1（手机号）：',
  value: 'telephone1'
}, {
  label: '网站语言选择：',
  value: 'languageName'
}, {
  label: '联系方式2（座机）：',
  value: 'telephone2'
}, {
  label: '前置或专项审批内容：',
  value: 'specialApprovalName'
}, {
  label: '应急联系方式（手机号）：',
  value: 'emergencyPhone'
}, {
  label: '备注：',
  value: 'note'
}, {
  label: '电子邮件地址：',
  value: 'email'
}, {
  label: '网站IP地址：',
  value: 'instanceIp'
}];

export const sponsorImgsAry = {
  title: '备案材料',
  type: 'sponsor_imgs',
  itemAry: []
};

export const websiteImgsAry = [];

/**
 * 项目通用配置
 */

(function(win) {


  var conf = {

    //项目web基础地址
    baseProject: '/crm-front',

    //接口基础地址
    basePath: 'http://192.168.254.241:40002/crm-portal',

    //验证码图片地址
    imgCodeUrl: '/getValidateCode',

    //登录凭证cookie名称
    cookieName: 'x-auth-token',

    //登录接口
    login: '/login',

    //退出登录接口
    loginout: '/loginout',

    //查询来电号码信息
    queryComeRingInfo: '/comering/queryComeRingInfo',

    //查询当前用户信息接口
    queryUserInfo: '/sys/user/queryUserInfo',

    //修改密码接口
    updatePassword: '/sys/user/updatePassword',

    //获取页面权限
    getPagePermission: '/getPagePermission',

    //首页-获取导航菜单接口
    getUserMenu: '/getUserMenu',

    //中心库-查询上一跟进人
    selectPreviousFollowUp: '/centlib/selectPreviousFollowUp',

    //中心库-查询组别成员
    selectGroupCommissioner: '/centlib/selectGroupCommissioner',

    //中心库-用户数据列表查询
    selectCentlibData: '/centlib/selectCentlibData',

    //中心库-客户导入
    customerImport: '/excelIO/customerImport',

    //团队库-用户数据列表查询
    selectTeamData: '/team/selectTeamData',

    //中心库、团队库excel导出接口
    exportExcel: '/exportExcel/centTemExportExcelFile',

    //中心库、团队库回收全部接口
    recoveryAllCustomer: '/recovery/recoveryAllCustomer',

    //客户调配接口
    insertAllocateCustomers: '/allocatecustomers/insertAllocateCustomers',

    //客户回收接口
    recoveryCustomer: '/recovery/recoveryCustomer',

    //退出客户-获取退出客户数据列表接口
    selectSignOutCustomer: '/signoutcustomer/selectSignOutCustomer',

    //分组设置-分组列表数据查询
    selectGroupData: '/groupingSets/selectGroupData',

    //分组设置-新增分组
    newGroup: '/groupingSets/newGroup',

    //分组设置-删除分组
    deleteGroupSets: '/groupingSets/deleteGroupSets',

    //我的客户-获取我的客户数据列表接口
    selectMyCumtomer: '/mycustomer/selectMyCumtomer',

    //客户管理通用-设置分组
    customerGroupSets: '/groupingSets/customerGroupSets',

    //客户基本信息-查询客户基本信息
    selectCustomerBasic: '/customerDetails/selectCustomerBasic',

    //客户基本信息-保存客户回访
    saveReturnVisitRecord: '/customReview/saveReturnVisitRecord',

    //客户基本信息-查询电话分类
    selectTelephoneClassification: '/conversation/selectTelephoneClassification',

    //客户基本信息-保存客服跟进
    saveCustomerReturn: '/customerFollowUp/saveCustomerReturn',

    //客户基本信息-检查客户归属
    checkCustomerAscription: '/customerDetails/checkCustomerAscription',

    //客户基本信息-查询客服跟进
    selectCustomerFollowUpData: '/customerFollowUp/selectCustomerFollowUpData',

    //客户基本信息-查询回访记录
    selectCustomReviewData: '/customReview/selectCustomReviewData',

    //客户基本信息-查询调配记录
    selectDistributionRecord: '/allocatecustomers/selectDistributionRecord',

    //客户基本信息-查询资产总览
    selectAssetPandect: '/assetsPandect/selectAssetPandect',

    //客户基本信息-查询资金明细
    selectCapitalDetails: '/assetsPandect/selectCapitalDetails',

    //客户基本信息-查询金荷包明细
    selectGoldPouchDetail: '/goldPouch/selectGoldPouchDetail',

    //客户基本信息-查询金荷包收益
    selectGoldPouchProfit: '/goldPouch/selectGoldPouchProfit',

    //客户基本信息-查询资金流入记录
    selectCapitalInflowRecord: '/assetsPandect/selectCapitalInflowRecord',

    //客户基本信息-查询提现记录
    selectWithdrawalRecord: '/assetsPandect/selectWithdrawalRecord',

    //客户基本信息-查询红包记录
    selectRedPackRecord: '/assetsPandect/selectRedPackRecord',

    //客户基本信息-奖品提现记录
    selectPrizeRecords: '/assetsPandect/selectPrizeRecords',

    //客户基本信息-绑卡记录
    bindRecord: '/customer/bankcard/bindRecord',

    //订单信息-新手
    novicelist: '/customer/orderInfo/novicelist',

    //订单信息-金荷包
    currentlist: '/customer/orderInfo/currentlist',

    //订单信息-保价金
    pledgelist: '/customer/orderInfo/pledgelist',

    //订单信息-稳盈金
    stabilizelist: '/customer/orderInfo/stabilizelist',

    //订单信息-定期金
    regularlist: '/customer/orderInfo/regularlist',

    //订单信息-特价金
    speciallist: '/customer/orderInfo/speciallist',

    //订单信息-看涨跌
    risefalllist: '/customer/orderInfo/risefalllist',

    //订单信息-购物订单
    bullionlist: '/customer/orderInfo/bullionlist',

    //订单信息-卖金订单
    goldSellList: '/customer/orderInfo/goldSellList',

    //订单信息-提金订单
    extractlist: '/customer/orderInfo/extractlist',

    //客户服务-客户搜索
    selectCustomer: '/customerSearch/selectCustomer',

    //客户服务-资金流入预警
    payWarning: '/customerservice/payWarning/findlist',

    //客户服务-提现预警
    withdrawalWwarning: '/withdrawalWwarning/selectWithdrawalWwarning',

    //客户服务-申请查询
    applyEnquiry: '/applyEnquiry/search',

    //客户服务-提现查询
    queryWithdrawalRecord: '/withdrawalQuery/queryWithdrawalRecord',

    //客户服务-充值查询
    queryRechargeRecord: '/rechargeQuery/queryRechargeRecord',

    //业绩报表查询
    querylist: '/telsalereport/querylist',

    //业绩报表导出
    export: '/telsalereport/export',

    //页面条件权限
    getPageCondition: '/getPageCondition',

    //全员营销业绩报表
    selectFullMarketingPerformance: '/fullMarketingPerformance/selectFullMarketingPerformance',

    //全员营销业绩导出
    fullMarketingPerformanceExportExcelFile: '/exportExcel/fullMarketingPerformanceExportExcelFile',

    //实时业绩报表查询
    selectRealTimeAchievement: '/realTimeAchievement/selectRealTimeAchievement',

    //实时业绩报表导出
    realTimeAchievementExportExcelFile: '/exportExcel/realTimeAchievementExportExcelFile',

    //渠道系数更新
    updateChannelCoefficient: '/channelCoefficient/updateChannelCoefficient',

    //渠道系数
    selectChannelCoefficient: '/channelCoefficient/selectChannelCoefficient',

    //待办-阅读状态更新
    updateStatusCollection: '/updateReadingCollection/updateStatusCollection',

    //待办-未接来电
    selectDidNotCallData: '/didNotCall/selectDidNotCallData',

    //待办-资金流入预警
    selectCapitalInflowReminderData: '/capitalInflowReminder/selectCapitalInflowReminderData',

    //待办-预约提醒
    selectReservationRemindingData: '/reservationReminding/selectReservationRemindingData',

    //待办-预约提醒-延时提醒
    updateDelayTimeRemind: '/reservationReminding/updateDelayTimeRemind',

    //待办-提现提醒
    selectWithdrawalRemindData: '/withdrawalRemind/selectWithdrawalRemindData',

    //待办-回款提醒
    selectReceivableReminderData: '/receivableReminder/selectReceivableReminderData',

    //待办-购买提醒
    selectBuyRemindingData: '/buyReminding/selectBuyRemindingData',

    //待办-卖金提醒
    selectSellingGoldRemindData: '/sellingGoldRemind/selectSellingGoldRemindData',

    //待办-充值失败提醒
    selectRechargeFailureRemindingData: '/rechargeFailureReminding/selectRechargeFailureRemindingData',

    //待办-充值失败提醒列表excel导出
    rechargeFailureRemindingExportExcelFile: '/exportExcel/rechargeFailureRemindingExportExcelFile',

    //待办-生日提醒
    selectBirthdayReminderData: '/birthdayReminder/selectBirthdayReminderData',

    //待办-红包提醒
    selectRedPacketRemindData: '/redPacketRemind/selectRedPacketRemindData',

    //查询所有提醒
    selectTodothingsMenu: '/allReminderCount/selectTodothingsMenu',

    //业绩轮播列表
    getRoastingData: '/roastingData/query',

    //通话记录-客服通话
    getCallRecords: '/callRecords/custSer/querylist',

    //通话记录-获取录音文件地址
    queryRecordFileUrl: '/callRecords/custSer/queryRecordFileUrl',

    //通话记录-客服通话导出
    exportCallRecords: '/callRecords/custSer/export',

    //通话记录-外销通话记录
    selectExternalCallRecordsData: '/runxun/callRecordsRX/selectExternalCallRecordsData',

    //通话记录-外销通话记录导出
    externalCallRecordsExportExcelFile: '/exportExcel/externalCallRecordsExportExcelFile',

    //通话记录-广信通话
    callRecordsGX: '/guangxin/callRecordsRX/selectExternalCallRecordsData',

    //通话记录-广信通话记录导出
    guangxinCallRecordsExportExcelFile: '/exportExcel/guangxinCallRecordsExportExcelFile',

    //工单列表
    selectWorkOrderListData: '/workOrderList/selectWorkOrderListData',

    //工单列表详情
    selectWorkOrderListDetails: '/workOrderList/selectWorkOrderListDetails',

    //工单列表导出
    workOrderListExportExcelFile: '/exportExcel/workOrderListExportExcelFile',

    //关闭工单
    closeWorkOrder: '/workOrderList/closeWorkOrder',

    //指派工单
    assignedWorkOrder: '/workOrderList/assignedWorkOrder',

    //更新工单
    updateWorkOrder: '/workOrderList/updateWorkOrder',

    //新增工单
    addWorkOrder: '/workOrderList/addWorkOrder',

    //查询工单分类
    selectWorkOrderClassification: '/workOrderList/selectWorkOrderClassification',

    //查询工单处理人
    selectDealingPeople: '/workOrderList/selectDealingPeople',

    //分类管理-获取通话分类
    queryTelType: '/categories/queryTelType',

    //分类管理-创建通话分类
    addTelType: '/categories/addTelType',

    //分类管理-重命名通话分类
    updateTelTypeName: '/categories/updateTypeName',

    //分类管理-删除通话分类
    delTelType: '/categories/delTelType',

    //分类管理-导出通话分类
    exportTelType: '/categories/exportTelType',

    //分类管理-工单分类查询
    queryWorkorderType: '/categories/queryWorkorderType',

    //分类管理-创建工单分类
    addWorkorderType: '/categories/addWorkorderType',

    //分类管理-重命名工单分类
    updateWorkorderTypeName: '/categories/updateWorkorderTypeName',

    //分类管理-删除工单分类
    delWorkorderType: '/categories/delWorkorderType',

    //分类管理-导出工单分类
    exportWorkorderType: '/categories/exportWorkorderType',

    //团队管理-查询团队数据
    selectTeamManageData: '/teamManage/selectTeamManageData',

    //团队管理-新增团队数据
    addTeam: '/teamManage/addTeam',

    //角色授权-角色列表
    queryRoleList: '/sys/role/queryRoleList',

    //角色授权-新增角色
    addRole: '/sys/role/addRole',

    //角色授权-删除角色
    delRole: '/sys/role/delRole',

    //角色授权-修改角色
    updateRole: '/sys/role/updateRole',

    //角色授权-获取角色权限菜单列表
    queryRoleMenu: '/sys/role/queryRoleMenu',

    //角色授权-保存授权菜单
    saveAccreditMenu: '/sys/role/accreditMenu',

    //账号管理-查询账号管理
    selectAccountManageData: '/accountManage/selectAccountManageData',

    //账号管理-查询角色
    queryRoleList: '/sys/role/queryRoleList',

    //账号管理-重置密码
    resetPassword: '/accountManage/resetPassword',

    //账号管理-限制或解除登录
    updateLoginStatus: '/accountManage/updateLoginStatus',

    //账号管理-解除、更改、绑定坐席号
    updateSeatNumber: '/accountManage/updateSeatNumber',

    //账号管理-查询新增账号用户
    selectNewAccount: '/accountManage/selectNewAccount',

    //账号管理-新增账号
    newAccount: '/accountManage/newAccount',

    //账号管理-角色授权
    accreditUserRole: '/sys/role/accreditUserRole',

    //账号管理-获取团队数据
    selectTeamManageData: '/teamManage/selectTeamManageData',

    //账号管理-设置团队
    setUserTeam: '/sys/user/setUserTeam',

    //账号管理-设置推广渠道号
    setChannelNumber: '/accountManage/setChannelNumber',

    //crm准入设置-查询crm准入设置列表
    selectCrmAccessSettingData: '/crmAccessSetting/selectCrmAccessSettingData',

    //crm准入设置-新增crm准入设置
    addCrmAccessSetting: '/crmAccessSetting/addCrmAccessSetting',

    //crm准入设置-更新crm准入设置
    updateCrmAccessSetting: '/crmAccessSetting/updateCrmAccessSetting',

    //crm准入设置-启用或禁用
    regularSwitch: '/crmAccessSetting/regularSwitch',

    //crm准入设置-渠道名称
    selectChannelName: '/crmAccessSetting/selectChannelName',

    //新手专享金-订单信息
    exclusivelist: '/customer/orderInfo/exclusivelist',
  };



  if (win.layui) {

    layui.define(function(exports) {

      exports('conf', conf);
    });

  } else {

    win.conf = conf;

  }

})(window)
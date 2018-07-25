layui.use(['table','layer','conf','utilFn','jquery'],function(){
    var table   = layui.table,
        layer   = layui.layer,
        conf    = layui.conf,
        $       = layui.jquery,
        utilFn  = layui.utilFn,
        laytpl  = layui.laytpl,
        jquery  = layui.jquery;

        utilFn.setHeader(conf,$)
        
    //表格配置
    var config = {
        elem: '#crmRole',
        id: 'crmRole',
        url: conf.basePath + conf.selectCrmAccessSettingData,
        method: 'post',
        page: {
            layout: ['limit', 'prev', 'page', 'next', 'count'],
            curr: 1,
            limits: [10, 20, 30, 50, 100, 200],
        },
        even: true,
        cols: [
            [
                {
                    type: 'numbers',
                    fixed: 'left',
                    width: 50
                }, {
                    field: 'isNew',
                    title: '客户类型',
                    fixed: 'left',
                    width: 100,
                    align: 'center',
                    templet: '#tp1',
                }, {
                    field: 'isRecommend',
                    title: '有无推荐人',
                    width: 120,
                    templet: '#tp2',
                    align: 'center'
                }, {
                    field: 'channelName',
                    title: '渠道',
                    width: 100,
                    templet: '#tp3',
                    align: 'center'
                }, {
                    field: 'dayCount',
                    title: '新注册天数',
                    width: 100,
                    align: 'center'
                }, {
                    field: 'accountAmount',
                    title: '现金余额低于',
                    width: 120,
                    align: 'center'
                }, {
                    field: 'totalGram',
                    title: '黄金资产低于',
                    width: 120,
                    align: 'center'
                }, {
                    field: 'isIn',
                    title: '是否启用规则',
                    width: 120,
                    templet: '#tp4',
                    align: 'center'
                }, {
                    field: 'lastDayCount',
                    title: '最近提现天数',
                    width: 120,
                    align: 'center'
                }, {
                    field: 'createTime',
                    title: '添加时间',
                    width: 120,
                    align: 'center',
                    templet: '#tp5'
                }, {
                    field: 'updateTime',
                    title: '更新时间',
                    width: 120,
                    align: 'center',
                    templet: '#tp6'
                }, {
                    title: '操作',
                    width: 160,
                    align: 'center',
                    templet:'#barDemo',
                }
            ]
        ],
        done:function(res,curr,count){
            if (app.roles.crmruleEnableUI.authorised == false && app.roles.crmruleUpdateUI.authorised == false) {
                $('.limitPage').addClass('hide');
                $('.limit').text('无权限')
            }
            if (app.roles.crmruleEnableUI.authorised == false){
                $('.forbidden').addClass('hide');
            }
            if (app.roles.crmruleUpdateUI.authorised == false) {
                $('.revise').addClass('hide');
            }
        }
    }
        
        var pageID = utilFn.getQueryString().id;
        //实例
        var app = new Vue({
            el:'#app',
            data:{
                info:{
                    isNew: '-1',//客户类型10：新客户，20：休眠客户，30：注册有投资
                    isRecommend: '-1',//是否有推荐人10：无推荐人，20：有推荐人
                    isIn: '-1',//是否启用规则10：不启用，20：启用
                    channelName: '-1',//0:无渠道，否则:推广渠道名称
                },
                channelNameData:{},//渠道名称
                queryCache:{},
                addRuleData:{
                    isNew: '10', //10：新客户，20：休眠客户，30：注册有投资
                    isRecommend: '10', //10：无推荐人，20：有推荐人
                    channelName: '',//0:无渠道，否则:推广渠道名称
                    dayCount:'',//新注册天数/休眠客户进入天数
                    accountAmount:'',//现金余额低于
                    totalGram:'',//黄金资产低于
                    isIn:'20',//是否启用规则，10：不启用，20：启用
                    lastDayCount:'',//最近提现天数
                },
                addRuleDataCache:{},//新增CRM页面缓存
                channelBox:'-1',
                changeInfoData:{},//当前工具条数据
                //修改
                countData:{
                    dayCount:'',
                    accountAmount:'',
                    totalGram:'',
                    lastDayCount:''
                },
                loading:true,
                countDataCache:{},
                //页面权限数据
                roles:{
                    crmRuleQuery:{},//查询
                    crmruleAddUI:{},//增加
                    crmruleEnableUI: {},//禁用启用
                    crmruleUpdateUI:{},//查询
                },
            },
            beforeMount:function(){
                var v = this;
                //获取渠道名称
                $.post(conf.basePath + conf.selectChannelName, function (res) {
                    //登录超时
                    if (res.code == -1) {
                        window.parent.location.href = "../login.html";
                    }
                    if (res.code == 0) {
                        v.channelNameData = res.data;
                    }
                })
                //获取页面条件权限
                $.ajax({
                    url:conf.basePath + conf.getPagePermission,
                    data: { id: pageID},
                    async:false,
                    type:'post',
                    success:function(res){
                        //登录超时，跳转到登录页面
                        if (res.code == -1) {
                            window.top.location.href = "../login.html";
                        };
                        //获取数据成功
                        if (res.code == 0) {
                            v.roles = res.data;
                        }
                    }
                })

                v.queryCache = JSON.parse(JSON.stringify(v.info));
                v.addRuleDataCache = JSON.parse(JSON.stringify(v.addRuleData));
                v.countDataCache = JSON.parse(JSON.stringify(v.countData));

            },
            mounted:function(){
                var v = this;
                
                //清除loading
                $('#loading').addClass('hide');
                $('#app').removeClass('hide');

                //表格加载
                table.render(config);
                
            },
            methods:{
                    
                //表格查询
                search:function(){
                    config.where = this.info;
                    table.reload('crmRole',config)
                },
                //表格重置
                reset:function(){
                    this.info = $.extend({},this.queryCache);
                    config.where = this.info;
                    table.reload('crmRole',config)
                },
                //新增CRM
                addRule:function(){
                    var v = this;
                    layer.open({
                        type:1,
                        title:'CRM准入规则',
                        skin: 'crm-model',
                        area: $(window).width() > 1366 ?['40%','68%']:['50%','70%'],
                        content:$('#rule')

                    })
                   
                },
                //检查参数
                checkParams:function(){
                    var v = this;
                    if (v.addRuleData.channelName == '') {
                        v.addRuleData.channelName = '-1';
                    }
                    if (!v.addRuleData.dayCount){
                        v.addRuleData.dayCount = '0'
                    }
                    if (!v.addRuleData.accountAmount){
                        v.addRuleData.accountAmount = '0'
                    }
                    if (!v.addRuleData.totalGram){
                        v.addRuleData.totalGram = '0'
                    }
                    if (!v.addRuleData.lastDayCount) {
                        v.addRuleData.lastDayCount = '0'
                    }
                },
                //新增保存
                saveBtn:function(){
                    var v = this;
                    v.checkParams();
                    $.ajax({
                        url: conf.basePath + conf.addCrmAccessSetting,
                        data: JSON.stringify(v.addRuleData),
                        type: 'post',
                        contentType:'application/json;charset=UTF-8',
                    }).done(function (res) {
                        //登录超时
                        if (res.code == -1) {
                            window.parent.location.href = "../login.html";
                        }

                        if (res.code == 0) {
                            v.addRuleData = $.extend({}, v.addRuleDataCache)
                            
                            v.layerPop('新增成功',res.code);

                            layer.closeAll('page');                                                                                

                            table.reload('crmRole',config);
                        }
                        if(res.code == 108){
                            v.layerPop(res.msg,res.code);

                            layer.closeAll('page');    

                            v.addRuleData = $.extend({}, v.addRuleDataCache)
                        }
                    })
                }, 
                //禁用或者启用
                openBtn:function(obj){
                    var v = this;
                    $.ajax({
                        url: conf.basePath + conf.regularSwitch,
                        data: JSON.stringify(obj),
                        type: 'post',
                        contentType: 'application/json;charset=UTF-8'

                    }).done(function (res) {
                        if (res.code == -1) {
                            window.parent.location.href = "../login.html";
                        }
                        if (res.code == 0) {
                            table.reload('crmRole', config);
                            v.layerPop('修改成功',res.code)
                        }
                    })
                },
                //修改
                changeInfo:function(){
                    this.countData = $.extend({}, this.countDataCache)
                    layer.open({
                        type:1,
                        title:'CRM准入规则',
                        skin:'crm-model',
                        area: $(window).width() > 1366 ?['40%','55%']:['50%','70%'],
                        content:$('#reviseInfo')
                    })
                },
                //修改按钮
                reviseBtn: function (obj){
                    var v = this;
                    if (v.countData.accountAmount==''){
                        v.countData.accountAmount = '0';
                    }
                    if (v.countData.totalGram==''){
                        v.countData.totalGram = '0';

                    }
                    if (v.countData.lastDayCount=='') {
                        v.countData.lastDayCount = '0';
                    }
                    if (v.countData.dayCount=='') {
                        v.countData.dayCount = '0';
                    }
                    var paramsData = {
                        isNew: v.changeInfoData.isNew,
                        id: v.changeInfoData.id,
                        dayCount: v.countData.dayCount,
                        accountAmount: v.countData.accountAmount,
                        totalGram: v.countData.totalGram,
                        lastDayCount: v.countData.lastDayCount
                    }
                    $.ajax({
                        url: conf.basePath + conf.updateCrmAccessSetting,
                        data: JSON.stringify(paramsData),
                        type:'post',
                        contentType:'application/json;charset=UTF-8',
                    }).done(function(res){
                        if (res.code == -1) {
                            window.parent.location.href = "../login.html";
                        }
                        if (res.code == 0) {
                            v.layerPop('修改成功',res.code)
                            layer.closeAll('page')
                            table.reload('crmRole',config)
                        }
                        
                    
                })
                },
                typeCN:function(res){
                   var text = { 10: '新客户', 20: '休眠客户', 30: '注册有投资' }; 
                    return text[res] || '';
                    
                },
                recomendCN:function(res){
                    var status = { 10: '无推荐人', 20: '有推荐人' }; return status[res] || '';
                },
                channelData:function(name){
                    if (name == '0') {
                        return '无'
                    }else if (name == -1) {
                        return '无'
                    }else{
                        return name;
                    }
                },
                //弹窗
                layerPop: function (title,res) {
                    layer.msg(title, {
                        icon: res==0?1:0,
                        shade: 0.2,
                        time: 2000
                    })
                }
            }
        })
        //获取工具条详情
    table.on('tool(crmRole)',function(obj){
        var data = obj.data;
        app.changeInfoData = data;
        var id = data.id;
        var isIn = data.isIn;
        if (isIn == '10') {
            var dataParam = { id: id, isIn: '20' };
        }else if(isIn == '20'){
            var dataParam = { id: id, isIn: '10' };
        }

        if (obj.event === 'enable'){
            app.openBtn(dataParam);
        }
        if (obj.event == 'revise'){
            app.changeInfo()
        }


    })
        
})
layui.use(['table', 'conf', 'utilFn'], function () {
    var table = layui.table;
    var conf = layui.conf;
    var utilFn = layui.utilFn;
    var $ = layui.$;

    //设置全局请求头
    utilFn.setHeader(conf, $);


    //列表查询表格配置
    var changeConfig = {
        elem: '#queryTable',
        id: 'queryTable',
        url: conf.basePath + conf.queryWithdrawalRecord,
        method: 'POST',
        page: {
            curr: 1,
            theme: '#299b96',
            limits: [10, 20, 30, 50, 100, 200],
            layout: ['limit', 'prev', 'page', 'next', 'count']
        },
        even: true,
        cols: [
            [
                { type: 'numbers', fixed: 'left', align: 'center', width: 50 },
                { field: '', title: '呼叫', align: 'center', width: 60, event: 'callOut', templet: '#tp10' },
                { field: 'withdrawId', title: '提现ID', align: 'center', width: 150 },                                
                { field: 'mobilePhone', title: "手机", align: 'center', width: 120, event: 'show',templet:'#tp9' },
                { field: 'realName', title: '真实姓名', align: 'center', width: 100 },
                { field: 'bankName', title: "银行名称", align: 'center', width: 100 },
                { field: 'cardNo', title: '银行卡号', align: 'center', width: 190 },
                { field: 'withdrawAmount', title: '提现余额', align: 'center', width: 190 },
                { field: 'feeAmount', title: '提现费', align: 'center', width: 190 },
                { field: 'factAmount', title: '到账金额', align: 'center', width: 190 },
                { field: 'payFeeAmount', title: '易宝手续费', align: 'center', width: 100 },
                { field: 'withdrawTime', title: '提现时间', align: 'center', width: 160 },
                { field: 'withdrawStatusTime', title: '到账时间', align: 'center', width: 160 },
                { field: 'withdrawStatus', title: '提现状态', align: 'center', width: 100, templet: "#tp1" },  
                { field: 'remark', title: '备注', align: 'center', width: 100 },                              
                { field: 'returnCode', title: '返回代码', align: 'center', width: 100 },                              
                { field: 'returnMsg', title: '返回消息', align: 'center', width: 160 },
                { field: 'easyFubaoStatus', title: '易宝状态', align: 'center', width: 160 },
                { field: 'auditTime', title: '审核时间', align: 'center', width: 160 },
                { field: 'clientType', title: '客户端类型', align: 'center', width: 100,templet: "#tp2"},
            ]
        ]

    };
   
    var app = new Vue({
        el: '#app',
        data: {
            table:{
                value:'',
            },
            roles:{},//权限
           
        }, 
        beforeMount: function () {
            var v = this;

            $.ajax({
                url: conf.basePath + conf.getPagePermission,
                type: 'post',
                data: { id: utilFn.getQueryString().id }
            }).done(function (res) {

                //登录超时
                if (res.code == -1) {
                    window.parent.location.href = '../login.html';
                }

                if (res.code == 0) {
                    v.roles = res.data;
                }
            })
        },
        methods: {
           searchData:function(){
               $('.search-box').removeClass('center');
               if (this.table.value) {
                    changeConfig.where=this.table;
                   table.render(changeConfig);
            
               }else{
                   layer.msg('请输入查询条件', {
                       icon: 0,
                       shade: 0.3,
                       time: 2000
                   })
               }
               
                
           } 
        }
    })

    //点击展示用户详情弹窗
    table.on('tool(queryTable)', function (obj) {

        //是否有显示客户详情的权限
        var flag = app.roles.unAssignBtnCstDetail.authorised;
        var layEvent = obj.event;

        if (flag) {
            var userData = obj.data;

            layer.open({
                type: 2,
                title: '客户详情',
                skin: 'crm-model',
                maxmin: true,
                area: ['90%', '90%'],
                scrollbar: false,
                content: `${conf.baseProject}/customerDetails/customerDetail.html?customerId=${userData.customerId}&from=withdrawalQuery&to=${app.roles.unAssignBtnCstDetail.id}&updateId=${userData.id}`
            });
        }
        if (layEvent === 'callOut') {
            window.parent.callout(obj.data.mobilePhone);
        }

    });

    //注册全局表格刷新
    window.searchData = app.searchData;



});


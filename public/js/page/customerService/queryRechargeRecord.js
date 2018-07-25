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
        url: conf.basePath + conf.queryRechargeRecord,
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
                { field: 'mobilePhone', title: "手机", align: 'center', width: 120, event: 'show', templet: '#tp9' },
                { field: 'realname', title: '真实姓名', align: 'center', width: 100 },
                { field: 'paymentId', title: "支付流水ID", align: 'center', width: 150 },
                { field: 'payMethod', title: '支付方式', align: 'center', width: 190,templet:'#tp11' },
                { field: 'bizType', title: '业务类型', align: 'center', width: 100,templet:'#tp12' },
                { field: 'bankName', title: '所属银行', align: 'center', width: 160 },
                { field: 'cardNo', title: '银行账号', align: 'center', width: 180 },
                { field: 'rechargeAmount', title: '支付金额', align: 'center', width: 160 },
                { field: 'feeAmount', title: '手续费', align: 'center', width: 160 },
                { field: 'rechargeTime', title: '申请时间', align: 'center', width: 180 },
                { field: 'rechargeStatusTime', title: '到账时间', align: 'center', width: 180 },
                { field: 'rechargeStatus', title: '状态', align: 'center', width: 100, templet: "#tp2" },
                { field: 'returnCode', title: '返回代码', align: 'center', width: 120 },
                { field: 'easyFubaoStatus', title: '易宝状态', align: 'center', width: 100 },
                { field: 'clientType', title: '来源终端', align: 'center', width: 100, templet: "#tp3" },
                { field: 'channelName', title: '渠道', align: 'center', width: 100 },
            ]
        ]

    };

    var app = new Vue({
        el: '#app',
        data: {
            table: {
                value: '',
            },
            roles: {},//权限

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
            searchData: function () {
                $('.search-box').removeClass('center');

                if (this.table.value) {

                    changeConfig.where = this.table;
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
                content: `${conf.baseProject}/customerDetails/customerDetail.html?customerId=${userData.customerId}&from=queryRechargeRecord&to=${app.roles.unAssignBtnCstDetail.id}&updateId=${userData.id}`
            });
        }
        
        if (layEvent === 'callOut') {
            window.parent.callout(obj.data.mobilePhone);
        }

    });

    //注册全局表格刷新
    window.searchData = app.searchData;



});


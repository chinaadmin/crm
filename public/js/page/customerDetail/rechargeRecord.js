layui.use(['table','utilFn','conf','jquery'],function(){
        var table = layui.table;
        var utilFn = layui.utilFn;
        var conf   = layui.conf;
        var $ = layui.$;

        //设置全局请求头

        utilFn.setHeader(conf,$);

        var config = {
            elem:'#capitalInflow',
            url: conf.basePath + conf.selectCapitalInflowRecord,
            method: 'POST',
            even: true,
            where: {
                customerId: utilFn.getQueryString().customerId,
            },
            page: {
                layout: ['limit', 'prev', 'page', 'next', 'count'],
                curr: 1,
                limits: [5, 10]
            },
            cols: [
                [
                    {
                        type: 'numbers',
                        width: 50,
                        fixed: 'left',
                        align: 'center'
                    },{
                        field: 'paymentId',
                        title: 'ID',
                        align: 'center',
                        width: 180
                    }, {
                        field: 'bizType',
                        title: '业务类型',
                        align: 'center',
                        width: 130,
                        templet: '#tpfirst',
                    }, {
                        field: 'payMethod',
                        title: '充值方式',
                        align: 'center',
                        width: 130,
                        templet:'#tpsecond',
                    }, {
                        field: 'bankName',
                        title: '所属银行',
                        align: 'center',
                        width: 100
                    }, {
                        field: 'cardNo',
                        title: '充值卡号',
                        align: 'center',
                        width: 200
                    }, {
                        field: 'payAmount',
                        title: '充值金额',
                        align: 'center',
                        width: 180
                    }, {
                        field: 'createTime',
                        title: '充值时间',
                        align: 'center',
                        width: 180
                    }, {
                        field: 'paymentStatus',
                        title: '状态',
                        align: 'center',
                        width: 140,
                        templet: '#tpthird',
                    }, {
                        field: 'returnCode',
                        title: '失败代码',
                        align: 'center',
                        width: 140
                    }, {
                        field: 'returnMsg',
                        title: '失败描述',
                        align: 'center',
                        width: 190
                    }, {
                        field: 'clientType',
                        title: '充值客户端',
                        align: 'center',
                        width: 140,
                        templet: '#tpforth',
                    }, {
                        field: 'mobilePhone',
                        title: '客户电话',
                        align: 'center',
                        width: 140
                    }, {
                        field: 'realName',
                        title: '真实姓名',
                        align: 'center',
                        width: 140
                    }
                ]
            ],
            done: function (res,curr,count) {
                //设置iframe自适应高度
                if (window.top !== window.self) {
                    window.parent.document.getElementById("rechargeRecord").height = 0;
                    window.parent.document.getElementById("rechargeRecord").height = document.body.scrollHeight;
                };
                if (res.code == -1 ) {
                    window.top.location.href="../login.html";
                }
            }

        }
        table.render(config);
})
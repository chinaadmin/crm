layui.use(['table','conf','utilFn','jquery'],function(){
        var table = layui.table;
        var conf = layui.conf;
        var utilFn = layui.utilFn;
        var jquery = layui.jquery;

        utilFn.setHeader(conf,$);

    document.onreadystatechange = subSomething;//当页面加载状态改变的时候执行这个方法. 
    function subSomething() {
        if (document.readyState == 'complete') {
            $('#loading').addClass('hide');
            $('#app').removeClass('hide');

        } //当页面加载状态 

    } 

        var config = {
            elem: '#withdrawRecord',
            url: conf.basePath + conf.selectWithdrawalRecord,
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
                    }, {
                        field: 'withdrawId',
                        title:'ID',
                        width: 150,
                        align: 'center'
                    }, {
                        field: 'mobilePhone',
                        title: '客户电话',
                        align: 'center',
                        width: 180
                    }, {
                        field: 'realName',
                        title: '真实姓名',
                        align: 'center',
                        width: 130,
                    }, {
                        field: 'bankName',
                        title: '银行名称',
                        align: 'center',
                        width: 130,
                    }, {
                        field: 'cardNo',
                        title: '卡号',
                        align: 'center',
                        width: 180
                    }, {
                        field: 'withdrawAmount',
                        title: '提现金额',
                        sort: true,
                        align: 'center',
                        width: 200
                    }, {
                        field: 'withdrawTime',
                        title: '提现申请时间',
                        sort: true,
                        align: 'center',
                        width: 180
                    }, {
                        field: 'withdrawStatusTime',
                        title: '提现支出时间',
                        sort: true,
                        align: 'center',
                        width: 180
                    }, {
                        field: 'returnMsg',
                        title: '提现返回消息',
                        sort: true,
                        align: 'center',
                        width: 140,
                        templet: '#tpthird',
                    }, {
                        field: 'auditTime',
                        title: '提现审核时间',
                        sort: true,
                        align: 'center',
                        width: 180
                    }, {
                        field: 'withdrawStatus',
                        title: '提现状态',
                        sort: true,
                        align: 'center',
                        width: 190,
                        templet:'#tpfirst'
                    }, {
                        field: 'clientType',
                        title: '客户端类型',
                        sort: true,
                        align: 'center',
                        width: 140,
                        templet: '#tpsecond',
                    }
                ]
            ],
            done: function (res,curr,count) {
                //设置iframe自适应高度
                if (window.top !== window.self) {
                    window.parent.document.getElementById("withdrawRecord").height = 0;
                    window.parent.document.getElementById("withdrawRecord").height = document.body.scrollHeight;
                };
                if(res.code == -1 ){
                    window.top.location.href="../login.html";
                }

            }
        };
        table.render(config);
        
})
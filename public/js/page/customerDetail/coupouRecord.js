layui.use(['table','conf','utilFn'],function(){
        var table = layui.table;
        var conf = layui.conf;
        var utilFn = layui.utilFn;

        //设置全局请求头
        utilFn.setHeader(conf,$);

    var config = {
            elem: '#coupouRecord',
            url: conf.basePath + conf.selectRedPackRecord,
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
                        field: 'name',
                        title: '红包名称',
                        width: 150,
                        align: 'center'
                    }, {
                        field: 'couponType',
                        title: '红包类型',
                        align: 'center',
                        width: 180,
                        templet:'#tpfirst'
                    }, {
                        field: 'faceValue',
                        title: '红包面额',
                        align: 'center',
                        width: 130,
                    }, {
                        field: 'periodNum',
                        title: '红包期数',
                        align: 'center',
                        width: 130,
                    }, {
                        field: 'amtMinLimit',
                        title: '启用~限购金额',
                        align: 'center',
                        width: 160,
                        templet:'#tp1'
                    }, {
                        field: 'deadlineLimit',
                        title: '启用期限',
                        align: 'center',
                        width: 200
                    }, {
                        field: 'startTime',
                        title: '开始时间',
                        align: 'center',
                        width: 180
                    }, {
                        field: 'endTime',
                        title: '结束时间',
                        align: 'center',
                        width: 180
                    }, {
                        field: 'status',
                        title: '使用状态',
                        align: 'center',
                        width: 140,
                        templet: '#tpsecond',
                    }, {
                        field: 'useTime',
                        title: '使用时间',
                        align: 'center',
                        width: 180
                    }, {
                        field: 'productCategory',
                        title: '使用产品',
                        align: 'center',
                        width: 190,
                        templet: '#tpthird'
                    }, {
                        field: 'platform',
                        title: '使用终端',
                        align: 'center',
                        width: 140,
                    }, {
                        field: 'amtCorrespond',
                        title: '投资金额',
                        align: 'center',
                        width: 140,
                    }
                ]
            ],
            done: function (res,curr,count) {
                //设置iframe自适应高度
                if (window.top !== window.self) {
                    window.parent.document.getElementById("coupouRecord").height = 0;
                    window.parent.document.getElementById("coupouRecord").height = document.body.scrollHeight;
                };
                if(res.code ==-1){
                    window.top.location.href="../login.html";
                }
            }
        }
        table.render(config);
            
})
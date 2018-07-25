layui.use(['table','conf','utilFn','jquery'],function(){
        var table = layui.table;
        var conf = layui.conf;
        var utilFn = layui.utilFn;
        var $ = layui.jquery;

        //设置全局请求头
        utilFn.setHeader(conf,$);

        //表格配置
        var config = {
            elem: '#prizeRecord',
            url: conf.basePath + conf.selectPrizeRecords,
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
                        field: 'prizeId',
                        title: '记录ID',
                        align: 'center',
                        width: 180
                    }, {
                        field: 'activityName',
                        title: '活动名称',
                        align: 'center',
                        width: 130,
                        
                    }, {
                        field: 'prizeType',
                        title: '奖品类型',
                        align: 'center',
                        width: 130,
                        templet: '#tpfirst',
                        
                    }, {
                        field: 'num',
                        title: '数量',
                        sort: true,
                        align: 'center',
                        width: 100
                    }, {
                        field: 'unitVal',
                        title: '单位价值',
                        sort: true,
                        align: 'center',
                        width: 200
                    }, {
                        field: 'status',
                        title: '状态',
                        sort: true,
                        align: 'center',
                        width: 200,
                        templet: '#tpsecond',
                    }, {
                        field: 'pickTime',
                        title: '领取时间',
                        sort: true,
                        align: 'center',
                        width: 180
                    }, {
                        field: 'pick',
                        title: '奖品',
                        sort: true,
                        align: 'center',
                        width: 180
                    }
                ]
            ],
            done: function (res,curr,count) {
                //设置iframe自适应高度
                if (window.top !== window.self) {
                    window.parent.document.getElementById("prizeRecord").height = 0;
                    window.parent.document.getElementById("prizeRecord").height = document.body.scrollHeight;
                };
                if(res.code == -1 ){
                    window.top.location.href="../login.html";
                }
            }

        };
        table.render(config);
            

})
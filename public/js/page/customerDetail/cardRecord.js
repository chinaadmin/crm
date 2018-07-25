layui.use(['table','conf','utilFn','jquery'],function(){
    var table  = layui.table,
        conf   = layui.conf,
        $      = layui.jquery,
        utilFn = layui.utilFn;

        //设置请求头
        utilFn.setHeader(conf,$);
        
        //获取客户ID
        var customerId = utilFn.getQueryString().customerId;

        //表格配置
        var config = {
            elem: '#cardRecord',
            id: 'cardRecord',
            url: conf.basePath + conf.bindRecord,
            method: 'post',
            page:{
                layout: ['limit','prev','page','next','count'],
                curr:1
            },
            where:{
                customerId:customerId
            },
            limits:[10,20,30,50,100,200],
            cols:[
                [
                    {
                        type:'numbers',
                        width: 50,
                        fixed: 'left',
                        align: 'center'
                    },{
                        field:'cardNo',
                        title: '卡号',
                        width: 150,
                        align: 'center'
                    },{
                        field:'bankName',
                        title: '所属银行',
                        width: 120,
                        align: 'center'
                    },{
                        field: 'bindTime',
                        title: '申请绑定时间',
                        width: 180,
                        align: 'center'
                    }, {
                        field: 'successTime',
                        title: '绑定时间',
                        width: 180,
                        align: 'center'
                    }, {
                        field: 'unbindTime',
                        title: '解绑时间',
                        width: 180,
                        align: 'center'
                    }, {
                        field: 'cardStatus',
                        title: '绑卡状态',
                        width: 120,
                        align: 'center',
                        templet:'#tp1'
                    }, {
                        field: 'returnOrderNo',
                        title: '易宝订单号',
                        width: 120,
                        align: 'center'
                    }, {
                        field: 'returnCode',
                        title: '返回代码',
                        width: 120,
                        align: 'center'
                    }, {
                        field: 'returnMsg',
                        title: '返回信息',
                        width: 120,
                        align: 'center'
                    }
                ]
            ],
            done: function (res, curr, count) {
                //设置iframe自适应高度
                if (window.top !== window.self) {
                    window.parent.document.getElementById("cardRecord").height = 0;
                    window.parent.document.getElementById("cardRecord").height = document.body.scrollHeight;
                };
            }
        };
        //查询缓存条件
        var queryCache = {};

        //实例
        var vm = new Vue({
            el: '#app',
            data: {
                loading:true,
                info: {
                    customerId: customerId,
                    cardStatus: '',//10-初始；21-成功；22-失败；23-已解绑
                    bankName: '',//所属银行
                    cardNo: ''//银行卡号
                },
            },
                beforeMount: function(){
                    queryCache = JSON.parse(JSON.stringify(this.info));
                },
                mounted: function(){
                    //表格初始化
                    table.render(config);
                    
                    //清除loading
                    $('#loading').addClass('hide');
                    $('#app').removeClass('hide');
                },
                methods: {
                    //表格查询重载
                    researchTable: function(){
                        config.where = this.info;
                        table.reload('cardRecord',config);
                    },
                    //表格重置
                    resetTable: function(){
                        this.info = $.extend({},queryCache);
                        config.where = this.info;
                        table.reload('cardRecord',config);
                    },
                },

            
        })
})
layui.use(['table', 'utilFn', 'conf', 'laydate', 'jquery'], function () {

    var table = layui.table;
    var utilFn = layui.utilFn;
    var conf = layui.conf;
    var laydate = layui.laydate;
    var $ = layui.jquery;

    utilFn.setHeader(conf, $);

    var customerId = utilFn.getQueryString().customerId;
    //表格配置
    var config = {
        elem: '#sellerOrder',
        id: 'sellerOrder',
        url: conf.basePath + conf.goldSellList,
        method: 'POST',
        even: true,
        where: {
            customerId: customerId,
        },
        page: {
            layout: ['limit', 'prev', 'page', 'next', 'count'],
            curr: 1,
            limits: [5,10]
        },
        cols: [
            [
                {
                    type: 'numbers',
                    fixed: 'left',
                    align: 'center',
                    width: 50
                },{
                    field: 'sellId',
                    title: '订单编号',
                    align: 'center',
                    width: 180,

                }, {
                    field: 'sellGram',
                    title: '卖出克重',
                    align: 'center',
                    width: 150,

                }, {
                    field: 'sellPrice',
                    title: '卖出金价',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'sellAmount',
                    title: '卖出金额',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'sellFee',
                    title: '卖出手续费',
                    align: 'center',
                    width: 150
                }, {
                    field: 'sellIncome',
                    title: '卖出收入金额',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'sellTime',
                    title: '卖出时间',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'sellStatus',
                    title: '交易状态',
                    align: 'center',
                    width: 150,
                    templet:'#tpfirst'
                }, {
                    field: 'clientType',
                    title: '卖出终端',
                    align: 'center',
                    width: 100,
                    templet: '#tpsecond'
                }
            ]
        ],
        done: function(res,curr,count){
            //设置iframe自适应高度
            if (window.top !== window.self) {
                window.parent.document.getElementById("sellerOrder").height = 0;
                window.parent.document.getElementById("sellerOrder").height = 382;
            };
            if (res.code == -1) {
                window.top.location.href="../login.html";
            }
        }
    }


    var vm = new Vue({
        el: '#app',
        data: {
            loading: true,
            table: {
                customerId: customerId,
                orderStatus: '',//状态：10-初始化 20-待支付 30-已支付 40-计息中 35-已支付&计息中 50-已结算 60-已回款 70-支付超时
                startTime: '',//开始时间
                endTime: '',//结束时间
            },
            queryCache: {},//缓存查询条件
        },
        beforeMount: function () {
            //深拷贝
            this.queryCache = JSON.parse(JSON.stringify(this.table));

            
        },
        mounted: function () {

            //日期组件初始化
            laydate.render({
                elem: '#buyStartTime',
                type: 'datetime',
                zIndex: 999999
            });
            laydate.render({
                elem: '#buyEndTime',
                type: 'datetime',
                zIndex: 999999
            });
            //清除loading
            $('#loading').addClass('hide');
            $('#app').removeClass('hide');
            
            table.render(config);//表格初始化
        },
        methods: {
            research: function () {
                
                this.table.startTime = $('#buyStartTime').val();
                this.table.endTime = $('#buyEndTime').val();

                config.where = this.table;

                table.reload('sellerOrder', config);
            },
            reset: function () {
                $('#buyStartTime').val('');
                $('#buyEndTime').val('');

                this.table = $.extend({}, this.queryCache);

                config.where = this.table;

                table.reload('sellerOrder', config);


            }
        }
    })

})
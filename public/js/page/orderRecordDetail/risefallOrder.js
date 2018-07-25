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
        elem: '#risefallOrder',
        id: 'risefallOrder',
        url: conf.basePath + conf.speciallist,
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
                    field: 'orderId',
                    title: '订单编号',
                    align: 'center',
                    width: 180,

                }, {
                    field: 'productId',
                    title: '产品ID',
                    align: 'center',
                    width: 180,

                }, {
                    field: 'productName',
                    title: '产品名称',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'buyPrice',
                    title: '订单金价',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'buyAmount',
                    title: '订单金额',
                    align: 'center',
                    width: 150
                }, {
                    field: 'annualRate',
                    title: '固定利率(%)',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'maxFloatRate',
                    title: '封顶浮动利率(%)',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'deadline',
                    title: '期限(天)',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'couponType',
                    title: '红包类型',
                    align: 'center',
                    width: 150,
                    templet:'#tpfirst'
                }, {
                    field: 'totalRewardIncome',
                    title: '红包收益总金额',
                    align: 'center',
                    width: 150,

                }, {
                    field: 'totalRewardIncome',
                    title: '红包收益总金额',
                    align: 'center',
                    width: 150,

                },{
                    field: 'minReceiveAmount',
                    title: '到期最小应回款总额',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'maxReceiveAmount',
                    title: '到期最大应回款总额',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'repaymentMode',
                    title: '回款方式',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'buyTime',
                    title: '购买时间',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'payTime',
                    title: '支付成功时间',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'startInterestDate',
                    title: '起息时间',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'endInterestDate',
                    title: '到期时间',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'payMethod',
                    title: '支付方式',
                    align: 'center',
                    width: 150,
                    templet: '#tpsecond'
                }, {
                    field: 'orderStatus',
                    title: '交易状态',
                    align: 'center',
                    width: 150,
                    templet: '#tpthird'
                }, {
                    field: 'buyEndPrice',
                    title: '申购截止金价',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'closedPrice',
                    title: '到期金价',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'realReceiveTime',
                    title: '实际回款时间',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'realRate',
                    title: '实际利率(%)',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'totalAmount',
                    title: '实际回款金额',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'interest',
                    title: '实际回款利息',
                    align: 'center',
                    width: 150,
                }
            ]
        ],
        done: function(res,count,curr){
            //设置iframe自适应高度
            if (window.top !== window.self) {
                window.parent.document.getElementById("risefallOrder").height = 0;
                window.parent.document.getElementById("risefallOrder").height = 382;
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

                table.reload('risefallOrder', config);
            },
            reset: function () {
                $('#buyStartTime').val('');
                $('#buyEndTime').val('');

                this.table = $.extend({}, this.queryCache);

                config.where = this.table;

                table.reload('risefallOrder', config);


            }
        }
    })

})
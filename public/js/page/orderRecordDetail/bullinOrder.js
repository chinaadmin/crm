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
        elem: '#bullinOrder',
        id: 'bullinOrder',
        url: conf.basePath + conf.bullionlist,
        method: 'POST',
        even: true,
        where: {
            customerId: customerId,
        },
        page: {
            layout: ['limit','prev','page', 'next', 'count'],
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
                }, {
                    field: 'orderId',
                    title: '订单编号',
                    align: 'center',
                    width: 180,

                }, {
                    field: 'productId',
                    title: '商品ID',
                    align: 'center',
                    width: 180,

                }, {
                    field: 'productName',
                    title: '商品名称',
                    align: 'center',
                    width: 180,
                } , {
                    field: 'productGram',
                    title: '克重(克)',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'orderNum',
                    title: '数量',
                    align: 'center',
                    width: 100,
                }, {
                    field: 'productPrice',
                    title: '单价',
                    align: 'center',
                    width: 150
                }, {
                    field: 'productExpressFee',
                    title: '运费',
                    align: 'center',
                    width: 100,
                }, {
                    field: 'productCostFee',
                    title: '加工费',
                    align: 'center',
                    width: 100,
                }, {
                    field: 'orderPrice',
                    title: '订单金额',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'couponType',
                    title: '红包类型',
                    align: 'center',
                    width: 150,
                    templet: '#tpfirst'
                }, {
                    field: 'totalRewardIncome',
                    title: '红包收益总金额',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'invoiceFlag',
                    title: '是否开票',
                    align: 'center',
                    width: 150,
                    templet: '#tpsecond'
                }, {
                    field: 'invoiceHead',
                    title: '发票信息',
                    align: 'center',
                    width: 180,

                }, {
                    field: 'logisticsCompany',
                    title: '配送物流',
                    align: 'center',
                    width: 150,
                    templet: '<div>顺丰</div>'
                }, {
                    field: 'expressName',
                    title: '收货人',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'expressPhone',
                    title: '收货人电话',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'regionRegionAddr',
                    title: '收货地址',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'customerRemark',
                    title: '客户备注',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'orderTime',
                    title: '购买时间',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'payTime',
                    title: '支付成功时间',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'payMethod',
                    title: '支付方式',
                    align: 'center',
                    width: 150,
                    templet: '#tpthird'
                }, {
                    field: 'orderStatus',
                    title: '交易状态',
                    align: 'center',
                    width: 150,
                    templet: '#tpforth'
                }, {
                    field: 'expressFlag',
                    title: '是否已发货',
                    align: 'center',
                    width: 100,
                    templet: '#tpfive'
                }, {
                    field: 'expressNo',
                    title: '物流单号',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'backRemark',
                    title: '拒绝退货备注',
                    align: 'center',
                    width: 150,
                }
            ]
        ],
        done: function(res,curr,count){
            //设置iframe自适应高度
            if (window.top !== window.self) {
                window.parent.document.getElementById("bullionOrder").height = 0;
                window.parent.document.getElementById("bullionOrder").height = 382;
            }
            if (res.code == -1) {
                window.top.location.href = '../login.html';
            }
        }
    };


    var vm = new Vue({
        el: '#app',
        data: {
            loading:true,
            table: {
                customerId: customerId,
                orderStatus: '',//10-待确认 20-待支付 30-支付中 31-支付超时 32-支付失败 33-客户取消 40-待收货 50-已收货 60-退货退款申请 61-退货退款已受理 62-退货退款完成 63-退货退款失败
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

                table.reload('bullinOrder', config);
            },
            reset: function () {
                $('#buyStartTime').val('');
                $('#buyEndTime').val('');

                this.table = $.extend({}, this.queryCache);

                config.where = this.table;

                table.reload('bullinOrder', config);


            }
        }
    })

})
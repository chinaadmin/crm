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
        elem: '#goldSellOrder',
        id: 'goldSellOrder',
        url: conf.basePath + conf.extractlist,
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
                    field: 'orderGram',
                    title: '克重',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'orderNum',
                    title: '数量',
                    align: 'center',
                    width: 150
                }, {
                    field: 'costFee',
                    title: '加工费',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'goldPrice',
                    title: '锁定金价',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'orderAmount',
                    title: '订单金额',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'orderTime',
                    title: '提金时间',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'acceptTime',
                    title: '受理时间',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'invoiceFlag',
                    title: '是否开票',
                    align: 'center',
                    width: 150,
                    templet: "#tpfirst"
                }, {
                    field: 'invoiceHead',
                    title: '发票信息',
                    align: 'center',
                    width: 150,
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
                    field: 'expressRegion',
                    title: '收货人省市区',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'expressAddr',
                    title: '收货地址',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'customerRemark',
                    title: '客户备注',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'orderStatus',
                    title: '交易状态',
                    align: 'center',
                    width: 150,
                    templet:'#tpsecond'
                }, {
                    field: 'expressFlag',
                    title: '是否已发货',
                    align: 'center',
                    width: 150,
                    templet: '#tpthird'
                }, {
                    field: 'expressNo',
                    title: '物流单号',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'backRemark',
                    title: '退货备注',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'clientType',
                    title: '提金终端',
                    align: 'center',
                    width: 100,
                    templet:'#tpforth'
                }
            ]
        ],
        done: function(res,curr,count){
            //设置iframe自适应高度
            if (window.top !== window.self) {
                window.parent.document.getElementById("goldSellOrder").height = 0;
                window.parent.document.getElementById("goldSellOrder").height = 382;
            };
            if(res.code == -1 ){
                window.top.location.href="../login.html";
            }

        }
    }


    var vm = new Vue({
        el: '#app',
        data: {
            loading:true,
            table: {
                customerId: customerId,
                orderStatus: '',//状态：10-待确认 20-待支付 25-支付中 30-已支付 40-待发货 50-已发货 60-确认超时 61-支付超时 62-产品变更 70-已取消 80-已退款 90-已完成 99-支付失败
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

                table.reload('goldSellOrder', config);
            },
            reset: function () {

                $('#buyStartTime').val('');
                $('#buyEndTime').val('');

                this.table = $.extend({}, this.queryCache);

                config.where = this.table;

                table.reload('goldSellOrder', config);


            }
        }
    })

})
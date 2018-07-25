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
        elem: '#pledgeOrder',
        id: 'pledgeOrder',
        url: conf.basePath + conf.pledgelist,
        method: 'POST',
        even: true,
        where: {
            customerId: customerId,
        },
        page: {
            layout: ['limit', 'prev', 'page', 'next', 'count'],
            curr: 1,
            limits: [5,10],
        },
        cols: [
            [
                {
                    type: 'numbers',
                    fixed: 'left',
                    align: 'center',
                    width: 50
                },{
                    field: 'buyId',
                    title: '订单编号',
                    align: 'center',
                    width: 180,

                }, {
                    field: 'buyGram',
                    title: '订单克重(克)',
                    align: 'center',
                    width: 180,

                }, {
                    field: 'buyAmount',
                    title: '订单金额',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'buyPrice',
                    title: '订单金价',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'annualRate',
                    title: '利率(%)',
                    align: 'center',
                    width: 150
                }, {
                    field: 'deadline',
                    title: '期限(天)',
                    align: 'center',
                    width: 150
                }, {
                    field: 'productType',
                    title: '回款方式',
                    align: 'center',
                    width: 180,
                    templet: '#tpforth'
                },  {
                    field: 'buyTime',
                    title: '购买时间',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'paymentSuccessTime',
                    title: '支付成功时间',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'beginInterestDate',
                    title: '起息日期',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'endInterestDate',
                    title: '到期时间',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'payMethod',
                    title: '支付方式',
                    align: 'center',
                    width: 150,
                    templet: '#tpfirst'
                }, {
                    field: 'payStatus',
                    title: '交易状态',
                    align: 'center',
                    width: 150,
                    templet: '#tpsecond'
                }, {
                    field: 'totalRewardIncome',
                    title: '红包收益总金额',
                    align: 'center',
                    width: 150,
                    
                }, {
                    field: 'couponType',
                    title: '红包类型',
                    align: 'center',
                    width: 150,
                    templet: '#tpthird'
                }, {
                    field: 'productName',
                    title: '产品名称',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'recievedInterest',
                    title: '到期收益',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'repayDate',
                    title: '实际回款时间',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'productId',
                    title: '产品ID',
                    align: 'center',
                    width: 180,
                }, {
                    field: 'returnMoneySum',
                    title: '到期应回款总额',
                    align: 'center',
                    width: 150,
                }, {
                    field: 'expireHandle',
                    title: '到期处理',
                    align: 'center',
                    width: 150,
                    templet:'#tpfifth',
                }
            ]
        ],
        done: function(res,curr,count){
            //设置iframe自适应高度
            if (window.top !== window.self) {
                window.parent.document.getElementById("pledgeOrder").height = 0;
                window.parent.document.getElementById("pledgeOrder").height = 382;
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
                payStatus: '',//状态 10-待支付 20-支付成功(托管中) 30-支付失败 40-已结算
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

                table.reload('pledgeOrder', config);
            },
            reset: function () {
                $('#buyStartTime').val('');
                $('#buyEndTime').val('');

                this.table = $.extend({}, this.queryCache);

                config.where = this.table;

                table.reload('pledgeOrder', config);


            }
        }
    })

})
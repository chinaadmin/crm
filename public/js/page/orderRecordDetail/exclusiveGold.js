layui.use(['conf', 'utilFn', 'layer', 'laydate', 'table'], function () {

    var $ = layui.$;
    var layer = layui.layer;
    var laydate = layui.laydate;
    var table = layui.table;
    var conf = layui.conf;
    var _ = layui.utilFn;

    //设置全局请求头
    _.setHeader(conf, $);

    var customerId = _.getQueryString().customerId;

    //表格渲染配置
    var config = {
        elem: '#exclusiveGold',
        id: 'exclusiveGold',
        url: conf.basePath + conf.exclusivelist,
        method: 'POST',
        where: {
            customerId: customerId,
        },
        page: {
            curr: 1,
            theme: '#299b96',
            limits: [10, 20, 30, 50, 100, 200],
            layout: ['limit', 'prev', 'page', 'next', 'count']
        },
        even: true,
        cols: [
            [
                { type: 'numbers', fixed: 'left' },
                { field: 'buyId', title: '订单编号', width: 100, align: 'center', sort: true },
                { field: 'buyGram', title: '订单克重', width: 80, align: 'center' },
                { field: 'buyAmount', title: '订单金额', width: 100, align: 'center' },
                { field: 'buyPrice', title: '订单金价', width: 100, align: 'center' },
                { field: 'annualRate', title: '利率/%', width: 100, align: 'center' },
                { field: 'deadline', title: '期限', width: 100, align: 'center' },
                { field: 'productType', title: '产品类型', width: 100, align: 'center',templet:'#tp1' },
                { field: 'buyTime', title: '购买时间', width: 180, align: 'center' },
                { field: 'paymentSuccessTime', title: '支付成功时间', width: 180, align: 'center' },
                { field: 'beginInterestDate', title: '起息日期', width: 180, align: 'center' },
                { field: 'endInterestDate', title: '到息日期', width: 180, align: 'center' },
                { field: 'payMethod', title: '支付方式', width: 120, align: 'center', templet: '#tp2' },
                { field: 'payStatus', title: '交易状态', width: 120, align: 'center', templet: '#tp3'},
                { field: 'totalRewardIncome', title: '红包收益总金额', width: 120, align: 'center' },
                { field: 'couponType', title: '红包类型', width: 120, align: 'center', templet: '#tp4'},
                { field: 'productName', title: '产品名称', width: 120, align: 'center' },
                { field: 'recievedInterest', title: '到期收益', width: 120, align: 'center' },
                { field: 'repayDate', title: '实际回款时间', width: 120, align: 'center' },
                { field: 'productId', title: '产品ID', width: 120, align: 'center' },
                { field: 'returnMoneySum', title: '到期应回款总额', width: 120, align: 'center' },
                { field: 'expireHandle', title: '到期处理', width: 120, align: 'center', templet: '#tp5'},
                { field: 'clientType', title: '买入终端', width: 120, align: 'center', templet: '#tp6' },
            ]
        ],
        done:function(res,curr,count){
            //设置iframe自适应高度
            if (window.top !== window.self) {
                window.parent.document.getElementById("exclusiveGold").height = 0;
                window.parent.document.getElementById("exclusiveGold").height = 382;
            }
            if (res.code == -1) {
                window.top.location.href = '../login.html';
            }
        }
    };


    //vue实例化
    var vm = new Vue({
        el: '#app',
        data: {
            queryCache: {}, //查询条件缓存

            query: {
                startTime: '', //来电开始日期 默认当前日期
                endTime:'', //来电结束日期 默认当前日期
                customerId: customerId,
                payStatus: '',
            }
        },
        beforeMount: function () {
            var v = this;

            v.queryCache = $.extend({}, v.query);
        },
        mounted: function () {
            var v = this;

            //日期组件初始化
            lay('.big').each(function () {

                var key = $(this).attr('id');

                laydate.render({
                    elem: this,
                    type: 'datetime',
                    zIndex: 99999999,
                    value: v.query[key],
                    done: function (value, date, endDate) {
                        v.query[key] = value;
                    }
                });

            });

            //清除loading
            $('#app').removeClass('hide');
            $('#loading').addClass('hide');

            //表格初始化
            table.render(config);
        },
        methods: {
            research: function () {
                var v = this;

                if (new Date(v.query.startDate).getTime() - new Date(v.query.endDate).getTime() > 0) {
                    layer.msg('请选择正确的开始结束日期！', { icon: 2, time: 1000 });
                    return;
                }

                config.where = v.query;

                table.reload('exclusiveGold', config);
            },
            reset:function(){
                var v = this;

                v.query = $.extend({}, v.queryCache);

                lay('.big').each(function(){
                    
                   $(this).val('');
                    
                })
                
                config.where = v.query;

                table.reload('exclusiveGold',config)
            }
        }
    })

    //注册全局表格刷新
    window.searchData = vm.searchData;

})
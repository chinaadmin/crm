layui.use(['table','element','laydate','layer','conf','utilFn','jquery'],function(){

    var table = layui.table;
    var element = layui.element;
    var laydate = layui.laydate;
    var layer  = layui.layer;
    var conf = layui.conf;
    var utilFn = layui.utilFn;
    var $ = layui.jquery;

    // 设置全局请求头

    utilFn.setHeader(conf,$);

    var customerId = utilFn.getQueryString().customerId;
    //明细记录表格配置
    var detailConfig = {
        elem:'#currentDetail',
        id: 'currentDetail',
        url: conf.basePath + conf.selectGoldPouchDetail,
        method: 'POST',
        even: true,
        where:{
            customerId: customerId,
        },
        page: {
            layout: ['limit', 'prev', 'page', 'next', 'count'],
            curr: 1,
            limits: [5,10]
        },
        cols:[
            [
                {
                    type:'numbers',
                    width: 50,
                    fixed:'left',
                    align:'center'
                },{
                    field: 'tradeTime',
                    title: '记录时间',
                    align: 'center',
                    width:200
                }, {
                    field: 'remainGram',
                    title: '剩余克重(克)',
                    align: 'center',
                    width: 150
                }, {
                    field: 'oppositeOrderId',
                    title: '交易对方订单号',
                    align: 'center',
                    width: 180
                } , {
                    field: 'tradeAmount',
                    title: '折算金价(元)',
                    align: 'center',
                    width: 150
                }, {
                    field: 'bizType',
                    title: '业务类型',
                    align: 'center',
                    width: 150,
                    templet: '#tp1'
                }, {
                    field: 'tradeGram',
                    title: '流入(克)',
                    align: 'center',
                    width: 150,
                    templet: '#tp2'
                }, {
                    field: 'tradeGram',
                    title: '流出(克)',
                    align: 'center',
                    width: 150,
                    templet: '#tp3'
                }
            ]
        ],
        done: function () {
            //设置iframe自适应高度
            if (window.top !== window.self) {
                window.parent.document.getElementById("currentDetail").height = 0;
                window.parent.document.getElementById("currentDetail").height = 382;
            }
        }
    };
    //收益记录表格配置
    var incomeConfig = {
        elem: '#currentIncome',
        id: 'currentIncome',
        url: conf.basePath + conf.selectGoldPouchProfit,
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
                    width: 50,
                    fixed: 'left',
                    align: 'center'
                },{
                    field: 'grantTime',
                    title: '回款时间',
                    align: 'center',
                    width: 200
                }, {
                    field: 'interest',
                    title: '回款金额',
                    align: 'center',
                    width: 150
                }, {
                    field: 'goldGram',
                    title: '计息克重(克)',
                    align: 'center',
                    width: 150
                }, {
                    field: 'goldPrice',
                    title: '计息金价(元)',
                    align: 'center',
                    width: 150
                }, {
                    field: 'principal',
                    title: '计息本金(元)',
                    align: 'center',
                    width: 150
                }, {
                    field: 'annualRate',
                    title: '计息利率(%)',
                    align: 'center',
                    width: 180
                }
            ]
        ],
        done: function (res,curr,count) {
            //设置iframe自适应高度
            if (window.top !== window.self) {
                window.parent.document.getElementById("currentDetail").height = 0;
                window.parent.document.getElementById("currentDetail").height = 382;

            };
            if(res.code == -1){
                window.top.location.href="../login.html";
            }
        }
    }
    //实例
    var vm = new Vue({
        el: '#app',
        data: {
            loading:true,
            //明细记录数据
            detail: {
                customerId: customerId,
                tradeTimeStart:'',//记录时间开始
                tradeTimeEnd:'',//记录时间结束
                bizType:'-1',//类型
            },
            //收益记录数据
            income: {
                customerId: customerId,
                grantTimeStart:'',//回款时间开始
                grantTimeEnd:'',//回款时间结束
            },
            detailQueryCache: {},//明细表格缓存查询条件
            incomeQueryCache: {},//收益记录缓存查询条件
            
        },
        beforeMount: function(){
            //明细记录查询
            this.detailQueryCache = JSON.parse(JSON.stringify(this.detail));

            //收益记录查询
            this.incomeQueryCache = JSON.parse(JSON.stringify(this.income));
            

        },
        mounted: function(){
            //清除loading
            $('#loading').addClass('hide');
            $('#app').removeClass('hide');
            
            //明细表格初始化
            table.render(detailConfig);

            //收益表格初始化
            table.render(incomeConfig);

            //日期初始化
            var nameArr = ['#recordStartTime', '#recordEndTime', '#returnStartTime', '#returnEndTime'];

                for(var i = 0; i < nameArr.length; i++){

                    laydate.render({
                        elem: nameArr[i],
                        type:'datetime',
                        zIndex:9999999,
                    })
            }
        },
        methods:{
            // 明细记录查询重载
            reSearch: function(){

                this.detail.tradeTimeStart = $('#recordStartTime').val();
                this.detail.tradeTimeEnd = $('#recordEndTime').val();
                detailConfig.where = this.detail;
                table.reload('currentDetail', detailConfig)

            },
            // 收益记录查询重载
            inQuiry:function(){

                this.income.grantTimeStart = $('#returnStartTime').val();
                this.income.grantTimeEnd = $('#returnEndTime').val();
                incomeConfig.where = this.income;
                table.reload('currentIncome',incomeConfig)
            },
            //明细记录重置
            reSet:function(){

                $('#recordStartTime').val('');
                $('#recordEndTime').val('')
                this.detail = $.extend({}, this.detailQueryCache);
                detailConfig.where = this.detail;

                table.reload('currentDetail', detailConfig);
            },
            //收益记录重置
            reBulid:function(){
                $('#returnStartTime').val('');
                $('#returnEndTime').val('');
                this.income = $.extend({}, this.incomeQueryCache);

                incomeConfig.where=this.income;

                table.reload('currentIncome', incomeConfig)
            }
        }
    })
})
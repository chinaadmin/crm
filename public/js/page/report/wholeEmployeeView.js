layui.use(['table','laydate','jquery','conf','utilFn'],function(){
    var table    = layui.table,
        laydate  = layui.laydate,
        $        = layui.jquery,
        conf     = layui.conf,
        utilFn   = layui.utilFn;


        //设置全局请求头
        utilFn.setHeader(conf,$);

        var config = {
            elem: "#wholeView",
            id: 'wholeView',
            url: conf.basePath + conf.selectFullMarketingPerformance,
            method:'post',
            even: true,
            page:{
                layout:['limit','prev','page','next','count'],
                curr: 1,
            },
            limits: [10, 20, 30, 50, 100, 200],
            cols:[
                [
                    {
                        type: 'numbers',
                        fixed:'left',
                        align: 'center',
                        width: 50
                    }, {
                        field: 'statisDate',
                        title: '记录时间',
                        align: 'center',
                        width: 110
                    }, {
                        field: 'mobilePhone',
                        title: '员工平台账号',
                        align: 'center',
                        width: 115
                    }, {
                        field: 'countDate',
                        title: '统计月份',
                        align: 'center',
                        width: 90
                    }, {
                        field: 'employeeName',
                        title: '员工姓名',
                        align: 'center',
                        width: 100
                    }
                    ,{
                        field: 'oneHundredReward',
                        title: '满3万奖励',
                        align: 'center',
                        width: 100
                    }
                    ,{
                        field: 'personRecSale',
                        title: '推荐人当月新增年化',
                        align: 'center',
                        width: 195
                    },{
                        field: 'personOwnerSale',
                        title: '员工当月新增年化',
                        align: 'center',
                        width: 195
                    }, {
                        field: 'personSumSale',
                        title: '当月新增年化总额',
                        align: 'center',
                        width: 195
                    }
                    , {
                        field: 'monthBonusTotal',
                        title: '当月奖励总额',
                        align: 'center',
                        width: 115
                    }

                ]
            ]
        }
        //查询缓存条件
        var queryCache = {};
        //实例
        var vm = new Vue({
            el: '#app',
            data: {
                loading: true,
                info :{
                    countStartDate: '',//统计日期
                    employeeName: ''//员工姓名
                },
            },
            beforeMount: function(){

                var v = this;
                //时间默认值
                var timeValue = v.getData('-');
                v.info.countStartDate = timeValue;

            },
            mounted: function(){

                //清除loading
                $('#loading').addClass('hide');
                $('#app').removeClass('hide');

                var v = this;

                //日期组件初始化
                laydate.render({
                    elem: '#startDate',
                    zIndex: 999999,
                    type: 'month',
                    change: function(value,date,endDate){//日期改变回调
                        v.info.countStartDate = value;
                      
                    }
                });

                //表格初始化
                v.info.countStartDate = v.getData('-');
                config.where = v.info;
                table.render(config);

                //深度拷贝
                queryCache = JSON.parse(JSON.stringify(v.info));

            },
            methods: {
                //获取年月日期
                getData: function(sper){

                    sper      = sper || 'CN';
                    var date  = new Date();
                    var year  = date.getFullYear();
                    var m     = date.getMonth()+1;
                    var month = m < 10 ? ('0' + m ) : m;

                    if(sper === 'CN') {
                        return year + '年' + month + '月';
                    }else {
                        return year + sper + month;
                    }
                },
                //查询重载
                research : function(){

                    config.where = this.info;
                    table.reload('wholeView',config);

                },
                //重置
                reset : function(){

                    this.info=$.extend({},queryCache);
                    this.info.countStartDate = this.getData('-');                                                       
                    config.where=this.info;
                    table.reload('wholeView',config);

                },
                exportFile : function(){

                    var v = this;
                    var token = utilFn.getCookie(conf.cookieName);
                    var fileUrl = `${conf.basePath + conf.fullMarketingPerformanceExportExcelFile}?__sid=${token}&${$.param(v.info)}&exportType=1`
                   
                    window.location.href=fileUrl;

                }

            }
        })
})
layui.use(['table','layer','conf','utilFn','jquery'],function(){
    var table  = layui.table,
        layer  = layui.layer,
        conf   = layui.conf,
        $      = layui.jquery,
        utilFn = layui.utilFn;

        //设置请求头
        utilFn.setHeader(conf,$)

        //表格配置
        var config = {
            elem: '#rateView',
            url: conf.basePath + conf.selectChannelCoefficient,
            id  : 'rateView',
            method: 'post',
            even: true,
            limits:[10,20,30,50,100,200],
            page:{
                layout:['limit','prev','page','next','count'],
                curr: 1,
            },
            cols: [
                [
                    {
                        type: 'numbers',
                        fixed: 'left',
                        align: 'center',
                        width: 50
                    },{
                        field: 'channelNum',
                        title: '渠道号',
                        align: 'center',
                        width: 110,
                        templet: '<div><a style="font-weight:700">{{d.channelNum}}</a></div>',
                        event: 'show',
                    },{
                        field: 'channelLevel',
                        title: '渠道系数',
                        align: 'center',
                        width: 150,
                    },{
                        field: 'channelRealName',
                        title: '渠道名称',
                        align: 'center',
                        width: 120
                    },{
                        field: 'status',
                        title: '状态',
                        align: 'center',
                        width: 100,
                        templet: '#tp1'
                    },{
                        field: 'createTime',
                        title: '创建时间',
                        align: 'center',
                        width: 180
                    },{
                        field: 'updateTime',
                        title: '更新时间',
                        align: 'center',
                        width: 180
                    }
                ]
            ]
        };

        var queryCache={};
        //vm实例
        var vm = new Vue({
            el:'#app',
            data:{
                loading:true,
                account: {
                    channelNum:"",//渠道号
                    channelRealName: "",//渠道名称
                },
                channelData: {},
            },
            beforeMount: function(){
                queryCache=JSON.parse(JSON.stringify(this.account));

            },
            mounted: function(){
                //清除loading
                $('#loading').addClass('hide');
                $('#app').removeClass('hide');
                //表格初始化
                table.render(config);
            },
            methods:{
                //查询表格
                researchTable: function(){
                    config.where=this.account;
                    table.reload('rateView',config);
                },
                //重置表格
                resetTable: function(){
                    this.account = $.extend({},queryCache);             
                    config.where=this.account;
                    table.reload('rateView',config);
                },
                //保存修改的渠道数值
                change: function(){
                    var v = this;
                    var param = {
                        id: v.channelData.id,
                        channelLevel: v.channelData.channelLevel,
                        status: v.channelData.status,
                    }
                    var k = v.channelData.channelLevel;
                    if (k > 1 || k < 0 ) {
                        layer.msg('渠道系数需在0-1之间',
                                    {
                                        icon:2,
                                        time: 2000,
                                    });                            
                    }else{
                        $.ajax({
                        url: conf.basePath + conf.updateChannelCoefficient,
                        type: 'post',
                        dataType: 'json',
                        contentType: 'application/json; charset=UTF-8',
                        data: JSON.stringify(param)
                     }).done(function(res){
                         //登录失败，返回登录页
                         if(res.code == -1){
                             window.parent.location.href="../login.html";
                         }
                         //登录成功
                         if (res.code == 0 ){
                             table.reload('rateView',config);
                             layer.msg('修改成功',
                                 {
                                     icon: 1,
                                     time: 2000,
                                 }) 
                         }
                     })
                    }

                    
                    
                }
            }
        });
        //点击展开渠道详情
            table.on('tool(rateView)',function(obj){

                    var data = obj.data;
                    vm.channelData = data;
                    var layEvent = obj.event;
                    

                if(layEvent === 'show') {

                    layer.open({
                        type: 1,
                        title: '渠道系数',
                        skin: 'crm-model',
                        area: $(window).width() > 1366 ?['30%','45%']:['30%','45%'],
                        content: $('#column')
                    })
                }
            })
        
})
layui.use(['utilFn','conf','jquery','table','element','laydate'],function(){
    var utilFn = layui.utilFn;
    var conf = layui.conf;
    var $ = layui.$;
    var element = layui.element;
    var table = layui.table;
    var laydate = layui.laydate;
    window.laydate = laydate;

    //设置局部请求头
    utilFn.setHeader(conf,$);

    
        //获取客户ID
        var customerId = utilFn.getQueryString().customerId;


        var vm = new Vue({
            el:'#app',
            data: {
                    customerId: customerId,
            },
            
            mounted:function(){
                var v = this;
                v.$nextTick(function(){
                    $('.layui-tab-title>li').eq(0).click();
                    element.init();
                })
            }
            });
    element.on('tab(filter)',function(data){

        var iframeUrl = $(this).attr('data-src') + customerId;

        var $iframe = $('.layui-tab-content>div').eq(data.index).find('iframe');

        if(!$iframe.attr('src')){

            $iframe.attr('src',iframeUrl);
        }
    })

})
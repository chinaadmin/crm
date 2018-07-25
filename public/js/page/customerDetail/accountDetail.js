layui.use(['table', 'layer', 'laydate', 'conf', 'utilFn'], function() {
  table = layui.table;
  layer = layui.layer;
  laydate = layui.laydate;
  conf = layui.conf;
  utilFn = layui.utilFn;


  //设置全局请求头

  utilFn.setHeader(conf, $);

  //表格配置

  var config = {
    elem: '#accountDetail',
    id: 'accountDetail',
    url: conf.basePath + conf.selectCapitalDetails,
    method: 'POST',
    even: true,
    where: {
      customerId: utilFn.getQueryString().customerId,
    },
    page: {
      layout: ['limit', 'prev', 'page', 'next', 'count'],
      curr: 1,
      limits: [5,10]
    },
    cols: [
      [{
        type: 'numbers',
        fixed: 'left',
        align: 'center',
        width: 50
      }, {
        field: 'tradeTime',
        title: '记录时间',
        align: 'center',
        width: 180,

      }, {
        field: 'bizTypeName',
        title: '业务类型',
        align: 'center',
        width: 180,

      }, {
        field: 'inAmount',
        title: '存入',
        align: 'center',
        width: 150,
      }, {
        field: 'outAmount',
        title: '支出',
        align: 'center',
        width: 150
      }, {
        field: 'freezeAmount',
        title: '冻结',
        align: 'center',
        width: 150
      }, {
        field: 'usableBalance',
        title: '可用余额',
        align: 'center',
        width: 100,
      }, {
        field: 'freezeBalance',
        title: '冻结余额',
        align: 'center',
        width: 150
      }, {
        field: 'bankName',
        title: '交易对方',
        align: 'center',
        width: 150
      }]
    ],
    done: function(res,curr,count) {

      $('#loading').addClass('hide');
      $('#content').removeClass('hide');

      //设置iframe自适应高度
      if (window.top !== window.self) {
        window.parent.document.getElementById("accountDetail").height = 0;
        window.parent.document.getElementById("accountDetail").height = 382;
      };
      if(res.code==-1){
         window.top.location.href="../login.html";
      }
     
    }
  }

  var vm = new Vue({
    el: '#app',
    data: {
      loading: true,
      table: {
        customerId: utilFn.getQueryString().customerId, //客户id
        tradeDateStart: '', //交易开始日期
        tradeDateEnd: '', //交易结束日期
        flowType: '-1', //流水类型
        bizType: '-1', //业务类型
      },
      queryCache: {}, //缓存查询条件
    },
    beforeMount: function() {

      //深拷贝
      this.queryCache = JSON.parse(JSON.stringify(this.table));

    },
    mounted: function() {
      //清除loading
      $('#app').removeClass('hide');
      $('#loading').addClass('hide');

      //日期插件初始化
      lay('.big').each(function(){
        laydate.render({
          elem: this,
          type:'datetime',
          trigger: 'click',
        });
      })
        // 初始化表格
      table.render(config);


    },
    methods: {
      //查询重载表格
      researchForm: function() {

        //交易时间格式化
        this.table.tradeDateStart = $('#recordStartTime').val();
        this.table.tradeDateEnd = $('#recordEndTime').val();
        config.where = this.table;

        table.reload('accountDetail', config);

      },
      //重置表格
      resetForm: function() {
        $('#recordStartTime').val('');
        $('#recordEndTime').val('');

        this.table = $.extend({}, this.queryCache);

        this.table.customerId = utilFn.getQueryString().customerId;

        config.where = this.table;

        table.reload('accountDetail', config)

      }
    }
  })

})
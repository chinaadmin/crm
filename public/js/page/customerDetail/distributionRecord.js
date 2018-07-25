layui.use(['table', 'layer', 'laydate', 'conf', 'utilFn', 'upload'], function() {
  table = layui.table;
  layer = layui.layer;
  laydate = layui.laydate;
  conf = layui.conf;
  utilFn = layui.utilFn;
  upload = layui.uplaod;

  //设置全局请求头

  utilFn.setHeader(conf, $);

  //表格配置

  var config = {
    elem: '#distributionRecord',
    url: conf.basePath + conf.selectDistributionRecord,
    method: 'POST',
    where: {
      'customerId': utilFn.getQueryString().customerId,//获取客户Id
      'target': utilFn.getQueryString().target,//获取来源页面
    },
    page: {
      layout: ['limit', 'prev', 'page', 'next', 'count'],
      curr: 1,
      limits: [5, 10]
    },
    cols: [
      [{
        type: 'numbers',
        fixed: 'left',
        align: 'center',
        width: 50
      }, {
        field: 'teamName',
        title: '组名',
        align: 'center',
        width: 180
      }, {
        field: 'type',
        title: '操作类型',
        align: 'center',
        width: 180,
        templet: '#type'
      }, {
        field: 'distributeName',
        title: '操作人',
        align: 'center',
        width: 100
      }, {
        field: 'loginName',
        title: '电销员账号',
        align: 'center',
        width: 180
      }, {
        field: 'distributeTime',
        title: '操作时间',
        align: 'center',
        width: 180
      }]
    ],
    done: function(res,curr,count) {

      $('#loading').addClass('hide');
      $('#content').removeClass('hide');

      //设置iframe自适应高度
      if (window.top !== window.self) {
        window.parent.document.getElementById("distributionRecord").height = 0;
        window.parent.document.getElementById("distributionRecord").height = document.body.scrollHeight;
      };
      //登录超时，跳转到登录页面
      if(res.code == -1 ){
        window.top.location.href="../login.html";
      }
    }
  };

  table.render(config);


})
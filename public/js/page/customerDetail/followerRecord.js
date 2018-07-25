layui.use(['table', 'utilFn', 'conf', 'jquery', 'laydate', 'upload', 'layer'], function() {
  var table = layui.table;
  var utilFn = layui.utilFn;
  var conf = layui.conf;
  var laydate = layui.laydate;
  var upload = layui.upload;
  var layer = layui.layer;
  $ = layui.jquery;

  //设置全局请求头

  utilFn.setHeader(conf, $);

  //表格配置

  var config = {
      elem: '#followerRecord',
      url: conf.basePath + conf.selectCustomerFollowUpData,
      method: 'POST',
      where: {
        customerId: utilFn.getQueryString().customerId,
      },
      page: {
        curr: 1,
        layout: ['limit', 'prev', 'page', 'next', 'count'],
        limits: [5, 10],
      },
      even: true,
      cols: [
        [{
            type: 'numbers',
            align: 'center',
            fixed: 'left',
            width: 50
          }, {
            field: 'mobile',
            title: '手机号码',
            align: 'center',
            width: 180
          }, {
            field: 'serviceType',
            title: '服务分类',
            align: 'center',
            width: 180
          }, {
            field: 'remark',
            title: '备注',
            align: 'center',
            width: 150
          }, {
            field: 'followUpName',
            title: '跟进人姓名',
            align: 'center',
            width: 100
          }, {
            field: 'createDate',
            title: '跟进时间',
            align: 'center',
            width: 180
          }

        ]
      ],
      done: function(res,curr,count) {

        $('#loading').addClass('hide');
        $('#content').removeClass('hide');

        //设置iframe自适应高度
        if (window.top !== window.self) {
          window.parent.document.getElementById("followerRecord").height = 0;
          window.parent.document.getElementById("followerRecord").height = document.body.scrollHeight;
        };
        if(res.code == -1 ){
          window.top.location.href="../login.html";
        }
      }
    }
    //表格初始化
  table.render(config);
})
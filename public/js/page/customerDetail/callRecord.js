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
    elem: '#callRecord',
    id: 'callRecord',
    url: conf.basePath + conf.selectCustomReviewData,
    method: 'POST',
    where: { 'customerId': utilFn.getQueryString().customerId,//获取客户ID
              'target': utilFn.getQueryString().target },//获取来源页面
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
        },
        {
          field: 'result',
          title: '跟进结果状态',
          align: 'center',
          templet: '#result',
          width: 175

        }, {
          field: 'investIntention',
          title: '投资意向',
          align: 'center',
          templet: '#investIntention',
          width: 90

        }, {
          field: 'visitTime',
          title: '回访时间',
          align: 'center',
          width: 170
        }, {
          field: 'nextVisitTime',
          title: '下次回访时间',
          align: 'center',
          width: 170
        }, {
          field: 'adminName',
          title: '回访人',
          align: 'center',
          width: 95
        }, {
          field: 'remark',
          title: '备注',
          align: 'center',
          width: 95
        }
      ]
    ],
    done: function(res,curr,count) {

      $('#loading').addClass('hide');
      $('#content').removeClass('hide');

      //设置iframe自适应高度
      if (window.top !== window.self) {
        window.parent.document.getElementById("callRecord").height = 0;
        window.parent.document.getElementById("callRecord").height = document.body.scrollHeight;
      };
      //登录超时，跳转到登录页面
      if(res.code ==-1){
        window.top.location.href="../login.html";
      }

    }
  };

  table.render(config);

});
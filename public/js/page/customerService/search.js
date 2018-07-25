layui.use(['conf', 'utilFn', 'table'], function() {

  var $ = layui.$;
  var table = layui.table;
  var conf = layui.conf;
  var _ = layui.utilFn;

  //设置全局请求头
  _.setHeader(conf, $);

  //表格渲染配置
  var tableConfig = {
    elem: '#dataTable',
    id: 'dataTable',
    url: conf.basePath + conf.selectCustomer,
    method: 'POST',
    where: {
      value: ''
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
        { field: '', title: '呼叫', type: 'space', width: 50, align: 'center', fixed: 'left', templet: '#tp1', event: 'call' },
        { field: 'mobilePhone', title: '手机号', width: 110, fixed: 'left', align: 'center', event: 'show', templet: '#tp2' },
        { field: 'realName', title: '姓名', width: 90, align: 'center' },
        { field: 'mobilePhoneLocation', title: '归属地', width: 150, align: 'center' },
        { field: 'customerStatus', title: '登录控制', width: 100, align: 'center', templet: '#tp3' },
        { field: 'accountAmount', title: '账户总额', width: 150, align: 'center', sort: true },
        { field: 'usableBalance', title: '现金账户余额', width: 150, align: 'center', sort: true },
        { field: 'currentGram', title: '金荷包克重', width: 150, align: 'center', sort: true },
        { field: 'registerTime', title: '注册时间', width: 120, align: 'center', templet: '#tp4' },
        { field: 'lastDate', title: '最近登录', width: 120, align: 'center', templet: '#tp5' },
      ]
    ]
  };


  //vue实例化
  var vm = new Vue({
    el: '#content',
    data: {
      roles: {}, //权限
      search: '',
    },
    beforeMount: function() {
      var v = this;

      $.ajax({
        url: conf.basePath + conf.getPagePermission,
        type: 'post',
        data: { id: _.getQueryString().id }
      }).done(function(res) {

        //登录超时
        if (res.code == -1) {
          window.parent.location.href = '../login.html';
        }

        if (res.code == 0) {
          v.roles = res.data;
        }
      })
    },
    methods: {
      searchData: function() {

        if (this.search) {

          $('.search-box').removeClass('center');

          tableConfig.where.value = this.search;
          //渲染表格
          table.render(tableConfig);
        } else {
          layer.msg('请输入查询条件', {
            icon: 2,
            shade: 0.1,
            time: 1000
          });
        }

      }
    }
  })

  //点击展示用户详情弹窗
  table.on('tool(dataTable)', function(obj) {

    //是否有显示客户详情的权限
    var flag = vm.roles.unAssignBtnCstDetail.authorised;
    var layEvent = obj.event;

    if (flag) {
      var userData = obj.data;

      layer.open({
        type: 2,
        title: '客户详情',
        skin: 'crm-model',
        maxmin: true,
        area: ['90%', '90%'],
        scrollbar: false,
        content: `${conf.baseProject}/customerDetails/customerDetail.html?customerId=${userData.customerId}&from=search&to=${vm.roles.unAssignBtnCstDetail.id}`
      });
    }
    if (layEvent === 'call') {
      window.parent.callout(obj.data.mobilePhone);
    }

  });

})
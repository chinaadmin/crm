layui.use(['conf', 'utilFn', 'table'], function() {

  var $ = layui.$;
  var table = layui.table;
  var conf = layui.conf;
  var _ = layui.utilFn;

  //设置全局请求头
  _.setHeader(conf, $);

  //表格渲染配置
  var baseConfig = {
    elem: '#dataTable',
    id: 'dataTable',
    url: conf.basePath + conf.withdrawalWwarning,
    method: 'POST',
    where: {
      tabName: '1',
      mobilePhone: '',
      realName: ''
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
        { field: '', title: '呼叫', type: 'space', width: 50, align: 'center', fixed: 'left', templet: '#tp1',event:'call' },
        { field: 'mobilePhone', title: '手机号', width: 110, fixed: 'left', align: 'center', event: 'show', templet: '#tp2' },
        { field: 'realName', title: '真实姓名', width: 90, align: 'center' },
        { field: 'gender', title: '性别', width: 80, align: 'center', templet: '#tp3' },
        { field: 'amount', title: '提现金额', width: 200, align: 'center', sort: true },
        { field: 'applyDateTime', title: '提现申请时间', width: 200, align: 'center', sort: true },
        { field: 'msg', title: '提现返回消息', width: 200, align: 'center', sort: true }
      ]
    ]
  };


  //已跟进列显示配置
  var showFields = [
    { field: 'follower', title: '跟进人', width: 110, align: 'center' },
    { field: 'followTime', title: '跟进时间', width: 200, align: 'center' },
  ];

  var baseConfig2 = JSON.parse(JSON.stringify(baseConfig));
  baseConfig2.cols[0] = baseConfig2.cols[0].concat(showFields);

  //vue实例化
  var vm = new Vue({
    el: '#content',
    data: {
      roles: {}, //权限
      tabState: '1',
      mobilePhone: '',
      realName: ''
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
    mounted: function() {
      table.render(baseConfig);
    },
    methods: {
      tabToggle: function(index) {
        this.tabState = index;
        this.mobilePhone = '';
        this.realName = '';

        this.searchData();
      },
      searchData: function() {
        var config = baseConfig;

        if (this.tabState == '2') {
          config = baseConfig2;
        }

        config.where.mobilePhone = this.mobilePhone;
        config.where.realName = this.realName;
        config.where.tabName = this.tabState;

        table.render(config);
      },
      reset: function() {
        this.mobilePhone = '';
        this.realName = '';

        this.searchData();
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
        content: `${conf.baseProject}/customerDetails/customerDetail.html?customerId=${userData.customerId}&from=withdraw&to=${vm.roles.unAssignBtnCstDetail.id}&updateId=${userData.id}`
      });
    }
    if (layEvent === 'call') {
      window.parent.callout(obj.data.mobilePhone);
    }

  });

  //注册全局表格刷新
  window.searchData = vm.searchData;

})
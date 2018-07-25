layui.use(['conf', 'utilFn', 'layer', 'laydate', 'table'], function() {

  var $ = layui.$;
  var layer = layui.layer;
  var laydate = layui.laydate;
  var table = layui.table;
  var conf = layui.conf;
  var _ = layui.utilFn;

  //设置全局请求头
  _.setHeader(conf, $);

  //表格渲染配置
  var config = {
    elem: '#dataTable',
    id: 'dataTable',
    url: conf.basePath + conf.selectDidNotCallData,
    method: 'POST',
    where: {
      customerNumber: '',
      callStartDate: _.getDate('-'),
      callEndDate: _.getDate('-'),
      status: '-1'
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
        { field: 'customerNumber', title: '客户号码', width: 110, fixed: 'left', align: 'center', event: 'show', templet: '#tp2' },
        { field: 'callDate', title: '来电日期', width: 120, align: 'center' },
        { field: 'callCount', title: '来电次数', width: 100, align: 'center', sort: true },
        { field: 'status', title: '状态', width: 120, align: 'center', templet: '#tp3' },
        { field: 'followUpName', title: '跟进人', width: 120, align: 'center' },
        { field: '', title: '操作', width: 200, align: 'center', toolbar: '#toolbar' }
      ]
    ]
  };


  //vue实例化
  var vm = new Vue({
    el: '#content',
    data: {
      roles: {}, //页面权限
      searchRoles: {}, //页面查询条件权限
      queryCache: {}, //查询条件缓存
      customerNumber: '',
      startDate: _.getDate('-'), //来电开始日期 默认当前日期
      endDate: _.getDate('-'), //来电结束日期 默认当前日期
      status: '-1',
      type: ''
    },
    beforeMount: function() {
      //获取页面相关权限
      this.getRoles('roles', conf.basePath + conf.getPagePermission);

      //获取页面查询条件权限
      this.getRoles('searchRoles', conf.basePath + conf.getPageCondition);

      this.queryCache = $.extend({}, config.where);
    },
    mounted: function() {
      var v = this;

      //日期组件初始化
      lay('.querydate').each(function() {

        var key = $(this).attr('id');

        laydate.render({
          elem: this,
          type: 'date',
          zIndex: 99999999,
          value: v[key],
          done: function(value, date, endDate) {
            v[key] = value;
          }
        });

      });

      table.render(config);
    },
    methods: {
      //获取权限
      getRoles: function(roleName, url) {
        var v = this;

        $.ajax({
          url: url,
          type: 'post',
          data: { id: _.getQueryString().id }
        }).done(function(res) {

          //登录超时
          if (res.code == -1) {
            window.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            v[roleName] = res.data;
          }
        })
      },
      searchData: function() {
        var v = this;

        if (new Date(v.startDate).getTime() - new Date(v.endDate).getTime() > 0) {
          layer.msg('请选择正确的开始结束日期！', { icon: 2, time: 1000 });
          return;
        };

        config.where.customerNumber = v.customerNumber;
        config.where.callStartDate = v.startDate;
        config.where.callEndDate = v.endDate;
        config.where.status = v.status;

        table.reload('dataTable', config);
      },
      reset: function() {
        var v = this;

        this.customerNumber = '';

        config.where = this.queryCache;

        $('#startDate').val(config.where.callStartDate);
        $('#endDate').val(config.where.callEndDate);

        table.reload('dataTable', config);
      }
    }
  })

  //点击展示用户详情弹窗
  table.on('tool(dataTable)', function(obj) {

    var data = obj.data;
    var customerStatus = data.customerId;


    //是否有显示客户详情的权限
    var flag = vm.roles.unAssignBtnCstDetail.authorised;
    var layEvent = obj.event;

    //检查是否为本人客户
    $.ajax({
      url: conf.basePath + conf.checkCustomerAscription,
      data: { customerId: customerStatus },
      type: 'POST',
      async: false,
      ContentType: "application/x-www-form-urlencoded"
    }).done(function(res) {

      vm.type = res;

    })

    //非本人客户不可查看
    if (vm.type == false) {
      layer.msg('非本人客户不可查看客户详情！', {
        icon: 0,
        time: 2000,
        shade: 0.3
      })

      vm.searchData();

      return;
    }

    //外呼
    if (layEvent === 'call') {
      window.parent.callout(obj.data.mobilePhone);
    }

    //展示详情
    if (flag) {
      var userData = obj.data;

      layer.open({
        type: 2,
        title: '客户详情',
        skin: 'crm-model',
        maxmin: true,
        area: ['90%', '90%'],
        scrollbar: false,
        content: `${conf.baseProject}/customerDetails/customerDetail.html?customerId=${userData.customerId}&from=unanswer&to=${vm.roles.unAssignBtnCstDetail.id}&updateId=${userData.id}`
      });
    }

  });

  //注册全局表格刷新
  window.searchData = vm.searchData;

})
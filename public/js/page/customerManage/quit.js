layui.use(['conf', 'utilFn', 'layer', 'table', 'jquery'], function() {

  var table = layui.table,
    layer = layui.layer,
    $ = layui.jquery,
    conf = layui.conf,
    utilFn = layui.utilFn;

  //设置请求头
  utilFn.setHeader(conf, $);

  //退出客户

  var config = {
    elem: '#demo',
    url: conf.basePath + conf.selectSignOutCustomer,
    page: {
      curr: 1,
      limits: [10, 20, 30, 50, 100, 200],
      layout: ['limit', 'prev', 'page', 'next', 'count'],
    },
    even: true,
    method: 'POST',
    id: 'idTest',
    cols: [
      [ //表头
        {
          type: 'numbers',
          fixed: 'left',
          align: 'center',
          width: 50
        }, {
          type: 'checkbox',
          fixed: 'left',
          align: 'center',
          width: 50
        }, {
          field: 'mobilePhone',
          title: '客户手机号',
          fixed: 'left',
          align: 'center',
          templet: '#titleTpl',
          event: 'show',
          width: 100
        }, {
          field: 'realName',
          title: '姓名',
          align: 'center',
          width: 50
        }, {
          field: 'registerTime',
          title: '注册时间',
          align: 'center',
          templet: '#tpfirst',
          width: 90
        }, {
          field: 'buyFirstTime',
          title: '首投时间',
          align: 'center',
          templet: '#tpsecond',
          width: 90
        }, {
          field: 'lastFollowTime',
          title: '上次回访',
          align: 'center',
          templet: '#tpthird',
          width: 90
        }, {
          field: 'flowStep',
          title: '退出方式',
          align: 'center',
          templet: '#statusTpl',
          width: 90
        }, {
          field: 'distributeTime',
          title: '退出时间',
          align: 'center',
          templet: '#tpforth',
          width: 90
        }
      ]
    ],
    done: function(res, curr, count) {
      if (res.code == -1) {
        window.location.href = '../login.html';
      }
    }
  }


  //ios浏览器兼容性处理
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    tableConfig.width = window.parent.document.body.clientWidth - 100;
  }


  var vm = new Vue({

    el: '#app',

    data: {
      loading: true,
      table: {
        cstMobile: '', //手机号码

        cstName: '', //姓名

        flowStep: '-1', //退出方式
      },
      queryCache: {}, //查询条件缓存
      roles: {
        unAssignBtnCstDetail: {} //客户详情
      },
      teamData: {}
    },
    beforeMount: function() {
      var pageId = utilFn.getQueryString().id;
      this.roles = this.getRoles(pageId);
    },
    mounted: function() {
      $('#app').removeClass('hide');
      $('#loading').addClass('hide');

      //缓存默认查询条件
      this.queryCache = JSON.parse(JSON.stringify(this.table));

      //表格初始化
      table.render(config);
    },
    methods: {
      //获取权限
      getRoles: function(id) {
        $.ajax({
          url: conf.basePath + conf.getPagePermission,
          type: 'post',
          data: { id: id },
          async: false,
        }).done(function(res) {
          if (res.code == 0) {
            data = res.data
          }
        })
        return data;
      },
      //清空
      emptyAll: function() {

        this.table = $.extend({}, this.queryCache);

        config.where = this.table;

        table.reload('idTest', config)

      },
      //查询重载
      searchAll: function() {

        config.where = this.table;

        table.reload('idTest', config);
      }
    }

  });
  table.on('tool(test)', function(obj) {

    var flag = vm.roles.unAssignBtnCstDetail.authorised;
    if (flag) {
      var userData = obj.data;
      layer.open({
        type: 2,
        title: '客户详情',
        skin: 'crm-model',
        area: ['90%', '90%'],
        maxmin: true,
        scrollbar: false,
        content: `${conf.baseProject}/customerDetails/customerDetail.html?customerId=${userData.customerId}&from=quitCustomer&to=${vm.roles.unAssignBtnCstDetail.id}`,

      })
    }

  })



});
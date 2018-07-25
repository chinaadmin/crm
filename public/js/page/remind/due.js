layui.use(['conf', 'utilFn', 'layer', 'laydate', 'table', 'util'], function() {

  var $ = layui.$;
  var layer = layui.layer;
  var laydate = layui.laydate;
  var table = layui.table;
  var util = layui.util;
  var conf = layui.conf;
  var _ = layui.utilFn;

  //设置全局请求头
  _.setHeader(conf, $);

  //表格渲染配置
  var config = {
    elem: '#dataTable',
    id: 'dataTable',
    url: conf.basePath + conf.selectReceivableReminderData,
    method: 'POST',
    where: {
      startDate: '',
      endDate: '',
      amountStart: '',
      amountEnd: '',
      phone: '',
      teamIds: [],
      adminIds: [],
      productType: '-1',
      isCrmInfo: '1', //是否查询crm数据 1 crm数据 2润迅数据 3广信数据
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
        { type: 'numbers', fixed: 'left' },
        { field: '', title: '呼叫', type: 'space', width: 50, align: 'center', fixed: 'left', templet: '#tp1', event: 'call' },
        { field: 'mobilePhone', title: '客户号码', width: 110, fixed: 'left', align: 'center', event: 'show', templet: '#tp2' },
        { field: 'custName', title: '客户姓名', width: 100, align: 'center' },
        { field: 'productType', title: '回款产品', width: 100, align: 'center', templet: '#tp3' },
        { field: 'amount', title: '回款订单金额', width: 180, align: 'center', sort: true },
        { field: 'dueDate', title: '回款日期', width: 110, align: 'center' },
        { field: 'teamName', title: '组别', width: 100, align: 'center' },
        { field: 'salesName', title: '电销员', width: 100, align: 'center' },
        { field: 'lastFollowTime', title: '最近回访时间', width: 110, align: 'center' }
      ]
    ],
    done: function(res, curr, count) {
      //如果有数据则插入合计
      if (count > 0) {
        var totalHtml = `<tr>
          <td class="text-center" colspan="5">合计(共${count}条)</td>
          <td class="text-center" colspan="1">${res.map.combined}</td>
          <td colspan="4"></td>
        </tr>`;

        $('.layui-table-main .layui-table tbody').append(totalHtml);
      }
    }
  };


  //vue实例化
  var vm = new Vue({
    el: '#content',
    data: {
      roles: {}, //页面权限
      searchRoles: {}, //页面查询条件权限
      queryCache: {}, //查询条件缓存
      //组别人员数据
      teamData: [],

      //组别专员-选择显示
      groupCommissioner: '',

      query: {
        phone: '',
        startDate: _.getDate('-'), //开始日期 默认当前日期
        endDate: '', //结束日期 默认当前日期
        amountStart: '',
        amountEnd: '',
        teamIds: [],
        adminIds: [],
        productType: '-1', //产品类型
        isCrmInfo: '1'
      },
      type: '',
    },
    components: {
      'vtree': window.vtree
    },
    beforeMount: function() {
      var v = this;

      v.query.endDate = v.getAfterDate();

      //获取页面相关权限
      v.getRoles('roles', conf.basePath + conf.getPagePermission);

      //获取页面查询条件权限
      v.getRoles('searchRoles', conf.basePath + conf.getPageCondition);

      //获取组别专员数据
      $.post(conf.basePath + conf.selectGroupCommissioner).done(function(res) {

        //登录超时
        if (res.code == -1) {
          window.parent.location.href = '../login.html';
        }

        if (res.code == 0) {
          v.teamData = res.data;
        }
      });
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
          value: v.query[key],
          done: function(value, date, endDate) {
            v.query[key] = value;
          }
        });

      });

      config.where.startDate = v.query.startDate;
      config.where.endDate = v.query.endDate;

      v.queryCache = $.extend({}, config.where);

      table.render(config);

      //清除loading
      $('#content').removeClass('hide');
      $('#loading').addClass('hide');
    },
    methods: {
      getAfterDate: function() {
        var d = new Date(this.query.startDate).getTime() + 30 * 24 * 60 * 60 * 1000;

        return util.toDateString(d, 'yyyy-MM-dd');
      },
      //获取权限
      getRoles: function(roleName, url) {
        var v = this;

        $.ajax({
          url: url,
          type: 'post',
          async: false,
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
      //打开选择组别专员
      openSelectTeam: function() {

        layer.open({
          type: 1,
          title: '组别专员',
          skin: 'crm-model',
          area: $(window).width() < 769 ? ['90%', '60%'] : ['30%', '40%'],
          content: $('#selectTeam')
        })
      },
      //选择组别专员回调
      selectTeam: function(data) {
        this.query.teamIds = _.compact(data.teamIds);
        this.query.adminIds = _.compact(data.userIds);

        this.groupCommissioner = data.teamNames + ' ' + data.userNames;

        layer.closeAll();
      },
      searchData: function() {
        var v = this;

        if (new Date(v.query.startDate).getTime() - new Date(v.query.endDate).getTime() > 0) {
          layer.msg('请选择正确的开始结束日期！', { icon: 2, time: 1000 });
          return;
        }

        config.where = v.query;

        table.reload('dataTable', config);
      },
      reset: function() {
        var v = this;

        v.query = $.extend({}, v.queryCache);

        v.groupCommissioner = '';

        $('.querydate').each(function() {
          var key = $(this).attr('id');
          $(this).val(v.query[key]);
        });

        v.$refs.vtree.clear();
        $('#selectTeam input[type="checkbox"]').prop('checked', false);

        config.where = v.queryCache;

        table.reload('dataTable', config);
      }
    }
  })

  //点击展示用户详情弹窗
  table.on('tool(dataTable)', function(obj) {

    //当前列数据
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
      window.parent.callout(data.mobilePhone);
    }

    //更新已读未读状态
    if (data.status == '0') {

      var param = { id: data.id, updatePageType: '4' }

      $.ajax({
        url: conf.basePath + conf.updateStatusCollection,
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        data: JSON.stringify(param)
      }).done(function(res) {

        //登录超时
        if (res.code == -1) {
          window.parent.location.href = '../login.html';
        }

        if (res.code == 0) {
          vm.searchData();
        }

      })
    }

    //展示详情
    if (flag) {
      var userData = data;

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
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
    url: conf.basePath + conf.selectReservationRemindingData,
    method: 'POST',
    where: {
      startDate: _.getDateTime('begin'),
      endDate: _.getDateTime('end'),
      phone: '',
      teamIds: [],
      adminIds: [],
      status: '',
      isData: '1',
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
        { field: 'warmTime', title: '预约时间', width: 180, align: 'center' },
        { field: 'teamName', title: '组别', width: 100, align: 'center' },
        { field: 'salesName', title: '电销员', width: 100, align: 'center' },
        { field: 'lastFollowTime', title: '最近回访时间', width: 180, align: 'center' },
        { field: '', title: '操作', width: 150, align: 'center', toolbar: '#toolbar' }
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
      layerIndex: '', //弹窗id
      //组别人员数据
      teamData: [],

      //组别专员-选择显示
      groupCommissioner: '',

      query: {
        phone: '',
        startDate: _.getDateTime('begin'), //来电开始日期 默认当前日期
        endDate: _.getDateTime('end'), //来电结束日期 默认当前日期
        teamIds: [],
        adminIds: [],
        status: '',
        isData: '1',
        isCrmInfo: '1'
      },


      loadTime: '', //当前数据延迟提醒时间
      updateId: '', //延迟提醒数据id
      updateTime: '', //延迟提醒修改时间
      type: ''
    },
    components: {
      'vtree': window.vtree
    },
    beforeMount: function() {
      var v = this;

      //获取页面相关权限
      v.getRoles('roles', conf.basePath + conf.getPagePermission);

      //获取页面查询条件权限
      v.getRoles('searchRoles', conf.basePath + conf.getPageCondition);

      v.queryCache = $.extend({}, config.where);

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
          type: 'datetime',
          zIndex: 99999999,
          value: v.query[key],
          done: function(value, date, endDate) {
            v.query[key] = value;
          }
        });

      });

      table.render(config);

      //清除loading
      $('#content').removeClass('hide');
      $('#loading').addClass('hide');
    },
    methods: {
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
        })

        v.$refs.vtree.clear();
        $('#selectTeam input[type="checkbox"]').prop('checked', false);

        config.where = v.queryCache;

        table.reload('dataTable', config);
      },
      //选择或输入延迟时间
      changeTime: function(time) {
        var d = new Date(this.loadTime).getTime() + (time * 60 * 1000);

        this.updateTime = util.toDateString(d);
      },
      //保存延时提醒时间
      updateRemindTime: function() {
        var v = this;

        var reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;

        if (v.updateTime != '' && new RegExp(reg).test(v.updateTime)) {
          var param = {
            id: [v.updateId],
            delayTime: v.updateTime
          };

          $.ajax({
            url: conf.basePath + conf.updateDelayTimeRemind,
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
              layer.msg('保存成功', { icon: 1, time: 1000 });

              setTimeout(function() {
                vm.searchData();
                layer.close(v.layerIndex);
              }, 1000);

              //清空选择
              v.updateId = '';
              v.updateTime = '';
            }
          })
        } else {
          layer.msg('请输入正确的时间格式！', { icon: 2, time: 1000 });
          return;
        }

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

    //展示客户详情
    if (layEvent === 'show' || layEvent === 'call') {
      //更新已读未读状态
      if (data.status == '0') {

        var param = { id: data.id, updatePageType: '2' }

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
    }

    //延迟提醒
    if (layEvent === 'update') {
      $('#updateBox').find('input[type="radio"]').removeAttr('checked');

      vm.loadTime = data.warmTime;
      vm.updateId = data.id;

      vm.updateTime = data.warmTime;

      vm.layerIndex = layer.open({
        type: 1,
        title: '延迟提醒',
        skin: 'crm-model',
        area: $(window).width() < 769 ? ['90%', '45%'] : ['50%', '25%'],
        content: $('#updateBox')
      })
    }

  });


  //注册全局表格刷新
  window.searchData = vm.searchData;

})
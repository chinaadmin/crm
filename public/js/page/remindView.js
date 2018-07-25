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

  //所有预约数据id
  var allIds = [];

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
      status: '1',
      isData: '1'
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
        { field: 'mobilePhone', title: '客户号码', width: 110, fixed: 'left', align: 'center', event: 'show', templet: '#tp2' },
        { field: 'custName', title: '客户姓名', width: 100, align: 'center' },
        { field: 'warmTime', title: '预约时间', width: 180, align: 'center' },
        { field: 'lastFollowTime', title: '最近回访时间', width: 180, align: 'center' },
        { field: '', title: '操作', width: 250, align: 'center', toolbar: '#toolbar' }
      ]
    ],
    done: function(res, curr, count) {
      vm.count = count;

      if (count > 0) {
        var data = res.data;

        for (let i = 0; i < data.length; i++) {
          allIds.push(data[i].id);
        }
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
      layerIndex: '', //弹窗id
      count: 0,

      query: {
        phone: '',
        startDate: _.getDateTime('begin'), //来电开始日期 默认当前日期
        endDate: _.getDateTime('end'), //来电结束日期 默认当前日期
        teamIds: [],
        adminIds: [],
        status: '1',
        isData: '1'
      },

      loadTime: '', //当前数据延迟提醒时间
      updateIds: [], //延迟提醒数据id
      updateTime: '', //延迟提醒修改时间
    },
    beforeMount: function() {
      this.queryCache = $.extend({}, config.where);
    },
    mounted: function() {
      table.render(config);
    },
    methods: {
      //打开延迟提醒弹窗
      openWindow: function() {
        this.layerIndex = layer.open({
          type: 1,
          title: '延迟提醒',
          skin: 'crm-model',
          area: $(window).width() < 769 ? ['90%', '45%'] : ['65%', '30%'],
          content: $('#updateBox')
        })
      },
      //选择或输入延迟时间
      changeTime: function(time) {
        var d = new Date(this.loadTime).getTime() + (time * 60 * 1000);

        this.updateTime = util.toDateString(d);
      },
      //保存延迟提醒时间
      updateRemindTime: function() {
        var v = this;

        var reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;

        if (v.updateTime != '' && new RegExp(reg).test(v.updateTime)) {
          var param = {
            id: v.updateIds,
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
                table.reload('dataTable', config);
                layer.close(v.layerIndex);
              }, 1000);

              //清空选择
              v.updateId = [];
              v.updateTime = '';
            }
          })
        } else {
          layer.msg('请输入正确的时间格式！', { icon: 2, time: 1000 });
          return;
        }

      },
      //延迟当前页所有提醒
      updateAll: function() {

        if (this.count == 0) {
          layer.msg('没有可以延迟的数据', { icon: 2, time: 1000 });
          return;
        } else {
          this.updateIds = allIds;

          this.openWindow();

          this.updateTime = this.loadTime = _.getDateTime('isNow');
        }

      }
    }
  })

  //点击展示用户详情弹窗
  table.on('tool(dataTable)', function(obj) {

    //当前列数据
    var data = obj.data;
    var layEvent = obj.event;

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
            table.reload('dataTable', config);
          }

        })
      }

      //展示详情
      var userData = data;
      window.parent.openCustomerDetail(userData.customerId, 'remindView');
    }

    //延迟提醒
    if (layEvent === 'update') {
      $('#updateBox').find('input[type="radio"]').removeAttr('checked');

      vm.loadTime = data.warmTime;
      vm.updateTime = data.warmTime;

      vm.updateIds.push(data.id);

      vm.openWindow();
    }

  });

})
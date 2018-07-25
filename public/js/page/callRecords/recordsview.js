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
    url: conf.basePath + conf.getCallRecords,
    method: 'POST',
    where: {
      callType: '1',
      realName: '',
      phoneNumber: '',
      callStartTime: _.getDateTime('begin'),
      callEndTime: _.getDateTime('end'),
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
        { field: 'start_time', title: '来电/外呼时间', width: 180, align: 'center' },
        { field: 'callType', title: '来电类型', width: 120, align: 'center', templet: '#tp2' },
        { field: 'customer_number', title: '来电/外呼号码', width: 120, align: 'center', },
        { field: 'mobilePhone', title: '客户手机号', width: 120, align: 'center' },
        { field: 'realName', title: '真实姓名', width: 120, align: 'center' },
        { field: 'gender', title: '性别', width: 100, align: 'center', templet: '#tp1' },
        { field: 'total_duration', title: '通话时长', width: 120, align: 'center', templet: '#tp3' },
        { field: 'accountAmount', title: '资产总额', width: 180, align: 'center' },
        { field: '', title: '录音', width: 180, align: 'center', toolbar: '#toolbar' },
      ]
    ]
  };


  //vue实例化
  var vm = new Vue({
    el: '#content',
    data: {
      recordFileUrl: '', //当前选中的录音文件地址
      query: {
        callType: '1',
        realName: '',
        phoneNumber: '',
        callStartTime: _.getDateTime('begin'),
        callEndTime: _.getDateTime('end'),
      }
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
      tabToggle: function(tabIndex) {
        this.query.callType = tabIndex.toString();

        this.reset();

        config.where = this.query;

        table.reload('dataTable', config);
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

        v.query.realName = '';
        v.query.phoneNumber = '';
        v.query.callStartTime = _.getDateTime('begin');
        v.query.callEndTime = _.getDateTime('end');

        config.where = v.query;

        table.reload('dataTable', config);
      },
      //获取录音文件地址
      getRecordFileUrl: function(id) {
        var v = this;

        var param = {
          id: id,
          callType: v.query.callType
        }

        $.post(conf.basePath + conf.queryRecordFileUrl, param).done(function(res) {
          //登录超时
          if (res.code == -1) {
            window.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            if (res.data.recordFileUrl) v.recordFileUrl = res.data.recordFileUrl;
          }
        })
      },
      //导出
      exportExcel: function() {
        var v = this;
        var token = _.getCookie(conf.cookieName);
        var fileUrl = `${conf.basePath+conf.exportCallRecords}?__sid=${token}&${$.param(v.query)}`;

        window.location.href = fileUrl;
      }
    }
  })

  //播放及下载录音
  table.on('tool(dataTable)', function(obj) {

    var data = obj.data;
    var layevent = obj.event;

    if (!data.record_file) {
      layer.msg('录音文件已失效', { icon: 2, time: 1500 });
    }

    //播放录音
    if (layevent === 'play') {

      //获取录音文件地址
      vm.getRecordFileUrl(data.id);

      layer.open({
        type: 1,
        title: '播放录音',
        skin: 'crm-model',
        area: $(window).width() < 769 ? ['90%', '25%'] : ['30%', '20%'],
        content: $('#playBox')
      })
    }

    //下载录音文件
    if (layevent === 'download' && vm.recordFileUrl) {
      window.open(vm.recordFileUrl, '_blank');
    }

  })

})
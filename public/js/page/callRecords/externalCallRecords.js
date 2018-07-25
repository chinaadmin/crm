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
    url: conf.basePath + conf.selectExternalCallRecordsData,
    method: 'POST',
    where: {
      realName: '',
      mobilePhone: '',
      outboundTimeStart: _.getDateTime('begin'),
      outboundTimeEnd: _.getDateTime('end'),
    },
    page: {
      curr: 1,
      theme: '#299b96',
      limits: [10, 20, 30, 50, 100, 200],
      layout: ['limit', 'prev', 'page', 'next', 'count']
    },
    even: true,
    cols: [
      [{
          type: 'numbers',
          fixed: 'left'
        },
        {
          field: 'outboundTime',
          title: '外呼时间',
          width: 180,
          align: 'center'
        },
        {
          field: 'mobilePhone',
          title: '外呼号码',
          width: 120,
          align: 'center',
        },
        {
          field: 'callType',
          title: '来电类型',
          width: 120,
          align: 'center',
          templet: '#tp2'
        },
        {
          field: 'realName',
          title: '称呼',
          width: 120,
          align: 'center'
        },
        {
          field: 'gender',
          title: '性别',
          width: 100,
          align: 'center',
          templet: '#tp1'
        },
        {
          field: 'callDuration',
          title: '通话时长',
          width: 120,
          align: 'center',
          templet: '#tp3'
        },
        {
          field: '',
          title: '录音',
          width: 180,
          align: 'center',
          toolbar: '#toolbar'
        },
      ]
    ]
  };


  //vue实例化
  var vm = new Vue({
    el: '#content',
    data: {
      recordFileUrl: '', //当前选中的录音文件地址
      query: {
        realName: '',
        mobilePhone: '',
        outboundTimeStart: _.getDateTime('begin'),
        outboundTimeEnd: _.getDateTime('end'),
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
      searchData: function() {
        var v = this;

        if (new Date(v.query.outboundTimeStart).getTime() - new Date(v.query.outboundTimeEnd).getTime() > 0) {
          layer.msg('请选择正确的开始结束日期！', {
            icon: 2,
            time: 1000
          });
          return;
        }

        config.where = v.query;

        table.reload('dataTable', config);
      },
      reset: function() {
        var v = this;

        v.query.realName = '';
        v.query.mobilePhone = '';
        v.query.outboundTimeStart = _.getDateTime('begin');
        v.query.outboundTimeEnd = _.getDateTime('end');

        config.where = v.query;

        table.reload('dataTable', config);
      },
      //获取录音文件地址
      getRecordFileUrl: function(id) {
        var v = this;

        var param = {
          id: id,
          callType: '2'
        }

        $.ajax({
          url: conf.basePath + conf.queryRecordFileUrl,
          method: 'post',
          async: false,
          data: param
        }).done(function(res) {
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
        var fileUrl = `${conf.basePath+conf.externalCallRecordsExportExcelFile}?__sid=${token}&${$.param(v.query)}`;

        window.location.href = fileUrl;
      }
    }
  })

  //播放及下载录音
  table.on('tool(dataTable)', function(obj) {

    var data = obj.data;
    var layevent = obj.event;

    //获取录音文件地址
    if (data.visitPath) {
      vm.recordFileUrl = data.visitPath;
    } else {
      vm.getRecordFileUrl(data.id);
    }

    //播放录音
    if (layevent === 'play') {

      if (vm.recordFileUrl != '') {
        layer.open({
          type: 1,
          title: '播放录音',
          skin: 'crm-model',
          area: $(window).width() < 769 ? ['90%', '25%'] : ['30%', '20%'],
          content: $('#playBox')
        })
      } else {
        layer.msg('录音文件播放地址失效!', {
          icon: 2,
          time: 1000
        });
      }

    }

    //下载录音文件
    if (layevent === 'download') {

      if (vm.recordFileUrl != '') {
        window.open(vm.recordFileUrl, '_blank');
      } else {
        layer.msg('录音文件下载地址失效!', {
          icon: 2,
          time: 1000
        });
      }

    }

  })

})
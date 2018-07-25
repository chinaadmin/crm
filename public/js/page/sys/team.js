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
    url: conf.basePath + conf.selectTeamManageData,
    method: 'POST',
    where: {
      name: '',
      orgId: '',
      startDate: '',
      endDate: '',
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
        { field: 'name', title: '团队名称', width: 120, align: 'center' },
        { field: 'description', title: '团队描述', width: 150, align: 'center', templet: '#tp2' },
        { field: 'orgName', title: '所属组织', width: 120, align: 'center', },
        { field: 'createTime', title: '创建时间', width: 180, align: 'center' }
      ]
    ]
  };


  //vue实例化
  var vm = new Vue({
    el: '#content',
    data: {
      roles: {}, //当前页面权限

      query: {
        name: '',
        orgId: '',
        startDate: '',
        endDate: '',
      },
      addTeamData: {
        name: '',
        orgId: '',
        description: '',
      }
    },
    beforeMount: function() {
      this.roles = this.getRole(_.getQueryString().id);
    },
    mounted: function() {
      var v = this;

      laydate.render({
        elem: '#searchDate',
        type: 'date',
        range: true,
        zIndex: 99999999
      });

      table.render(config);

      //清除loading
      $('#content').removeClass('hide');
      $('#loading').addClass('hide');
    },
    methods: {
      //获取页面权限
      getRole: function(id) {
        var data = '';

        $.ajax({
          url: conf.basePath + conf.getPagePermission,
          data: { id: id },
          async: false
        }).done(function(res) {
          if (res.code == 0) {
            data = res.data;
          }
        })

        return data;
      },
      searchData: function() {
        var v = this;

        //获取查询时间段
        var dateArr = $('#searchDate').val().split(' - ');

        v.query.startDate = dateArr[0];
        v.query.endDate = dateArr[1];

        if (new Date(v.query.startDate).getTime() - new Date(v.query.endDate).getTime() > 0) {
          layer.msg('请选择正确的开始日期', { icon: 2 });
          return;
        }

        config.where = v.query;

        table.reload('dataTable', config);
      },
      reset: function() {
        var v = this;

        v.query.name = '';
        v.query.orgId = '';
        v.query.startDate = '';
        v.query.endDate = '';

        $('#searchDate').val('');

        config.where = v.query;

        table.reload('dataTable', config);
      },
      openAddWin: function() {

        layer.open({
          type: 1,
          title: '新增团队',
          skin: 'crm-model',
          area: ['450px', '300px'],
          content: $('#editBox')
        })

      },
      addTeam: function() {
        var v = this;

        for (var k in v.addTeamData) {
          if (!v.addTeamData[k]) {
            layer.msg('请输入完整的信息!', { icon: 2, time: 1500 });
            return;
          }
        }

        $.ajax({
          url: conf.basePath + conf.addTeam,
          type: 'post',
          data: JSON.stringify(v.addTeamData),
          contentType: "application/json; charset=utf-8",
          dataType: 'json'
        }).done(function(res) {
          //登录超时
          if (res.code == -1) {
            window.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            table.reload('dataTable', config);

            //清除数据
            for (var k in v.addTeamData) {
              v.addTeamData[k] = '';
            }

            layer.msg('新增成功', { icon: 1, time: 1000 });

            setTimeout(function() {
              layer.closeAll();
            }, 1000);
          } else {
            layer.msg(res.msg, { icon: 2, time: 1000 });
            return;
          }

        })

      }
    }
  })

})
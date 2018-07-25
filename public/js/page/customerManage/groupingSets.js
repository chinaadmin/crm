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
    url: conf.basePath + conf.selectGroupData,
    method: 'POST',
    where: {
      groupName: '',
      creatorName: ''
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
          field: 'check',
          title: '选择',
          type: 'checkbox',
          width: 30,
          align: 'center'
        },
        {
          field: 'groupName',
          title: '分组名称',
          width: 120,
          align: 'center'
        },
        {
          field: 'groupDescription',
          title: '描述',
          width: 150,
          align: 'center'
        },
        {
          field: 'creator',
          title: '创建人',
          width: 120,
          align: 'center',
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: 200,
          align: 'center'
        }
      ]
    ]
  };


  //vue实例化
  var vm = new Vue({
    el: '#content',
    data: {
      roles: {}, //当前页面权限

      query: {
        groupName: '',
        creatorName: ''
      },
      addGroupData: {
        groupName: '',
        groupDescription: '',
      }
    },
    beforeMount: function() {
      this.roles = this.getRole(_.getQueryString().id);
    },
    mounted: function() {
      var v = this;

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
          data: {
            id: id
          },
          async: false
        }).done(function(res) {
          //登录超时
          if (res.code == -1) {
            window.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            data = res.data;
          }
        })

        return data;
      },
      searchData: function() {
        var v = this;

        config.where = v.query;

        table.reload('dataTable', config);
      },
      reset: function() {
        var v = this;

        v.query.groupName = '';
        v.query.creatorName = '';

        config.where = v.query;

        table.reload('dataTable', config);
      },
      openAddWin: function() {

        layer.open({
          type: 1,
          title: '新增分组',
          skin: 'crm-model',
          area: ['450px', '300px'],
          content: $('#editBox')
        })

      },
      addGroup: function() {
        var v = this;

        if (v.addGroupData.groupName == '' || v.addGroupData.groupDescription == '') {
          layer.msg('请输入分组信息!', {
            icon: 2,
            time: 1500
          });
          return;
        }

        $.ajax({
          url: conf.basePath + conf.newGroup,
          type: 'post',
          data: JSON.stringify(v.addGroupData),
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
            v.addGroupData.groupName = '';
            v.addGroupData.groupDescription = '';

            layer.msg('新增成功', {
              icon: 1,
              time: 1000
            });

            setTimeout(function() {
              layer.closeAll();
            }, 1000);
          } else {
            layer.msg(res.msg, {
              icon: 2,
              time: 1000
            });
            return;
          }

        })

      },
      //获取选中行数据
      getTableSelected: function() {
        var checkStatus = table.checkStatus('dataTable');

        return checkStatus.data;
      },
      //删除分组
      deleteGroup: function() {
        var v = this;

        var selectedData = this.getTableSelected();

        if (selectedData.length == 0) {

          this.tip('请选择一个分组！', 2);
          return;

        } else if (selectedData.length > 1) {

          this.tip('只能选择一个分组！', 2);
          return;

        } else {

          var param = {
            groupId: selectedData[0].id
          };

          $.post(conf.basePath + conf.deleteGroupSets, param).done(function(res) {

            //登录超时
            if (res.code == -1) {
              window.parent.location.href = '../login.html';
            }

            //分组下有客户数据则无法删除
            if (res.code == 108) {
              v.tip('此分组下有客户数据，无法删除！', 2);
            }

            if (res.code == 0) {
              v.tip('删除成功', 1);
              v.searchData();
            }

          })

        }

      },
      tip: function(msg, icon) {
        layer.msg(msg, {
          icon: icon,
          time: 1500,
          shade: [0.8, '#f0f0f2']
        });
      }
    }
  })

})
layui.use(['conf', 'utilFn', 'layer', 'table', 'tree'], function() {

  var $ = layui.$;
  var layer = layui.layer;
  var table = layui.table;
  var tree = layui.tree;
  var conf = layui.conf;
  var _ = layui.utilFn;

  //设置全局请求头
  _.setHeader(conf, $);

  //表格渲染配置
  var config = {
    elem: '#dataTable',
    id: 'dataTable',
    url: conf.basePath + conf.queryRoleList,
    method: 'POST',
    where: {
      roleName: '',
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
        { field: 'check', title: '选择', type: 'checkbox', width: 50, align: 'center' },
        { field: 'name', title: '角色名称', width: 200, align: 'center', event: 'edit', templet: '#tp1' },
        { field: 'description', title: '角色描述', width: 300, align: 'center' },
        { field: 'createTime', title: '创建时间', width: 180, align: 'center' }
      ]
    ]
  };


  //vue实例化
  var vm = new Vue({
    el: '#content',
    data: {
      roles: {}, //当前页面权限

      roleName: '', //查询条件-角色名称

      //编辑、新增和授权的角色对象
      edit: {
        roleId: '',
        roleName: '',
        description: ''
      },

      rolesData: [], //授权菜单数据
    },
    components: {
      'roletree': window.roletree
    },
    beforeMount: function() {
      this.roles = this.getRole(_.getQueryString().id);
    },
    mounted: function() {
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
      //返回表格选中id
      getTableCheckData: function() {
        var ids = [];

        var checkArr = table.checkStatus('dataTable').data;

        for (var i = 0; i < checkArr.length; i++) {
          ids.push(checkArr[i].id);
        }

        return ids;
      },
      searchData: function() {
        var v = this;

        config.where.roleName = v.roleName;

        table.reload('dataTable', config);
      },
      reset: function() {
        var v = this;

        config.where.roleName = '';

        table.reload('dataTable', config);
      },
      //打开新增角色弹屏
      openWin: function(title) {

        layer.open({
          type: 1,
          title: title,
          skin: 'crm-model',
          area: ['450px', '300px'],
          content: $('#editBox')
        })

      },
      //打开授权菜单弹屏
      openRolesWin: function() {
        var v = this;

        if (this.getTableCheckData().length > 1) {
          layer.msg('只能选择一个角色！', { icon: 2, time: 1500, shade: [0.8, '#f0f0f2'] });
          return;
        }

        var roleId = this.getTableCheckData()[0];

        if (!roleId) {
          layer.msg('请选择需要授权的角色！', { icon: 2, time: 1500, shade: [0.8, '#f0f0f2'] });
          return;
        }

        v.edit.roleId = roleId;

        $.post(conf.basePath + conf.queryRoleMenu, { roleId: roleId }).done(function(res) {
          //登录超时
          if (res.code == -1) {
            window.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            v.rolesData = res.data;

            for (let i = 0; i < v.rolesData.length; i++) {
              v.rolesData[i].spread = true;
            }

            //layui tree 组件初始化
            $('#tree').html('');

            tree({
              elem: '#tree',
              nodes: v.rolesData,
              check: 'checkbox'
            })

            layer.open({
              type: 1,
              title: '角色-授权',
              skin: 'crm-model',
              area: ['280px', '500px'],
              content: $('#roles')
            })


          }

        })

      },
      addRole: function() {
        this.edit.roleId = '';
        this.edit.roleName = '';
        this.edit.description = '';

        this.openWin('角色-增加');
      },
      //新增角色
      saveData: function() {
        var v = this;

        //校验数据完整
        if (v.edit.roleName === '' || v.edit.description === '') {
          layer.msg('请输入完整的数据！', { icon: 2, time: 1500 });
          return;
        }

        var param = $.extend({}, v.edit);
        var url = '';

        if (!param.roleId) {
          delete param.roleId;
          url = conf.basePath + conf.addRole;
        } else {
          url = conf.basePath + conf.updateRole;
        }

        $.post(url, param).done(function(res) {
          //登录超时
          if (res.code == -1) {
            window.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            layer.msg('操作成功', { icon: 1, time: 1500 }, function() {
              v.roleId = '';
              v.roleName = '';
              v.description = '';

              v.searchData();
              layer.closeAll();
            });
          } else {
            layer.msg(res.msg, { icon: 1, time: 1500 });
          }

        })

      },
      //删除角色
      delRoles: function() {
        var v = this;

        var roleIds = v.getTableCheckData();

        if (roleIds.length == 0) {
          layer.msg('请选择需要删除的角色!', { icon: 2, time: 1500 });
        } else {

          $.post(conf.basePath + conf.delRole, { roleIds: roleIds.join(',') }).done(function(res) {
            //登录超时
            if (res.code == -1) {
              window.parent.location.href = '../login.html';
            }

            if (res.code == 0) {
              layer.msg('删除成功', { icon: 1, time: 1500 }, function() {
                v.searchData();
              });
            }

          })


        }

      },
      //保存授权数据
      saveRoles: function() {
        var v = this;

        var roleIds = [];

        $('#roles input[type="checkbox"]').each(function() {
          if ($(this).prop('checked')) roleIds.push($(this).attr('data-roleid'));
        });

        var param = {
          roleId: v.edit.roleId,
          menuIds: roleIds.join(',')
        }

        $.post(conf.basePath + conf.saveAccreditMenu, param).done(function(res) {
          //登录超时
          if (res.code == -1) {
            window.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            layer.msg('保存成功', { icon: 1, time: 1500 }, function() {
              v.searchData();
              layer.closeAll();
            });
          }

        })
      }
    }
  })

  //授权一级菜单点击则二级菜单全选
  $(document).on('click', '#tree input', function() {
    var checkStatus = $(this).prop('checked');

    $(this).siblings('ul').find('input[type="checkbox"]').prop('checked', checkStatus);


    var childNum = $(this).parent().parent().find('input[type="checkbox"]:checked').length;
    var parentNum = $(this).parents('.layui-show').find('input[type="checkbox"]:checked').length;

    if (childNum == 0) {

      if (parentNum > 1) {
        $(this).parent().parent().siblings('input[type="checkbox"]').prop('checked', checkStatus);
      } else {
        nodeCheck($(this), false);
      }

    } else {
      nodeCheck($(this), true);
    }
  })

  //递归选中父级菜单
  function nodeCheck(item, checkStatus) {

    var $parentCheck = item.parent().parent().siblings('input[type="checkbox"]');

    if ($parentCheck.length != 0) {
      $parentCheck.prop('checked', checkStatus);

      nodeCheck($parentCheck, checkStatus);
    }
  }


  //点击编辑角色
  table.on('tool(dataTable)', function(obj) {

    //当前列数据
    var data = obj.data;
    var layEvent = obj.event;


    if (layEvent === 'edit') {

      if (vm.roles.roleUpdateUI.authorised) {
        vm.edit.roleId = data.id;
        vm.edit.roleName = data.name;
        vm.edit.description = data.description;

        vm.openWin('角色-编辑');
      }

    }

  });

})
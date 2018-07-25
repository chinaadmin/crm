layui.use(['conf', 'utilFn', 'layer', 'laydate', 'table'], function() {

  var $ = layui.$;
  var layer = layui.layer;
  var laydate = layui.laydate;
  var table = layui.table;
  var conf = layui.conf;
  var _ = layui.utilFn;
  var md5 = window.md5;

  //设置全局请求头
  _.setHeader(conf, $);

  //表格渲染配置
  var config = {
    elem: '#dataTable',
    id: 'dataTable',
    url: conf.basePath + conf.selectAccountManageData,
    method: 'POST',
    where: {
      loginName: '',
      realName: '',
      teamName: '',
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
        { field: 'loginName', title: '账号名称', width: 120, align: 'center' },
        { field: 'realName', title: '姓名', width: 120, align: 'center' },
        { field: 'accountClass', title: '账户分类', width: 150, align: 'center', templet: '#tp4' },
        { field: 'organName', title: '所属部门', width: 150, align: 'center', },
        { field: 'teamName', title: '所属团队', width: 150, align: 'center', },
        { field: 'dimissionStatus', title: '状态', width: 100, align: 'center', templet: '#tp1' },
        { field: 'status', title: '可登录状态', width: 100, align: 'center', templet: '#tp2' },
        { field: 'seatNo', title: '坐席号', width: 100, align: 'center' },
        { field: 'roleName', title: '角色', width: 200, align: 'center', templet: '#tp3' },
        { field: 'channelNumber', title: '推广渠道号', width: 180, align: 'center' },
        { field: '', title: '操作', width: 210, align: 'center', toolbar: '#toolbar' },
      ]
    ],
    done: function(res) {
      if (!vm.roles.accountBindingSeatUI.authorised) $('.bindingBtn').hide();
      if (!vm.roles.accountUnBindingSeatUI.authorised) $('.unbindingBtn').hide();
      if (!vm.roles.accountUpdateSeatUI.authorised) $('.changeBtn').hide();
    }
  };

  var config2 = {
    elem: '#dataTable2',
    id: 'dataTable2',
    url: conf.basePath + conf.queryRoleList,
    method: 'POST',
    where: {},
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
        { field: 'name', title: '角色', width: 300, align: 'center' }
      ]
    ]
  };


  //vue实例化
  var vm = new Vue({
    el: '#content',
    data: {
      roles: {}, //当前页面权限

      teamData: [], //团队选项数据
      accountData: [], //新增账号用户数据

      query: {
        loginName: '',
        realName: '',
        teamName: '',
      },

      controlId: '', //绑定、更改操作的坐席数据id
      bindingNo: '',

      changeIds: [],

      selectTeam: '', //选中的团队

      channelNum: '', //设置的渠道号

      addAccountType: '1', //1内部账号 2外部账号
      addAccountName: '', //添加的外部账号
      addAccountShowName: '', //添加的外部显示账号
      selectAccount: '', //选中的内部账号

      newPassWord: '',
      confirmPassWord: '',
    },
    beforeMount: function() {
      var v = this;

      v.roles = v.getRole(_.getQueryString().id);

      //获取组别专员数据
      $.ajax({
        url: conf.basePath + conf.selectTeamManageData,
        type: 'post',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify({ "page": "1", "limit": "10000" }),
        dataType: 'json'
      }).done(function(res) {

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

      table.render(config);
      table.render(config2);

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
      getTableCheckData: function(id) {
        var ids = [];

        var checkArr = table.checkStatus(id).data;

        for (var i = 0; i < checkArr.length; i++) {
          ids.push(checkArr[i].id);
        }

        return ids;
      },
      searchData: function() {
        var v = this;

        config.where = v.query;

        table.reload('dataTable', config);
      },
      reset: function() {
        var v = this;

        v.query.loginName = '';
        v.query.realName = '';
        v.query.teamName = '';

        config.where = v.query;

        table.reload('dataTable', config);
      },
      //打开弹窗
      openWin: function(title, id, width, height) {

        layer.open({
          type: 1,
          title: title,
          skin: 'crm-model',
          area: [width, height],
          content: $(id)
        })

      },
      //绑定、更改坐席号
      changeSeatNo: function(type) {
        var v = this;

        var param = {
          id: v.controlId,
          seatNo: v.bindingNo
        }

        //解除坐席则删除坐席号码
        if (type == 1) {
          delete param.seatNo;
        } else {
          if (!param.seatNo) {
            layer.msg('请填写坐席号！', { icon: 2, time: 1500, shade: [0.8, '#f0f0f2'] });
            return;
          }
        }

        $.ajax({
          url: conf.basePath + conf.updateSeatNumber,
          type: 'post',
          contentType: 'application/json;charset=utf-8',
          data: JSON.stringify(param),
          dataType: 'json'
        }).done(function(res) {

          //登录超时
          if (res.code == -1) {
            window.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            v.searchData();

            layer.msg('操作成功', { icon: 1, time: 1500 }, function() {
              v.bindingNo = '';
              layer.closeAll();
            });

          } else {
            layer.msg(res.msg, { icon: 2, time: 1500 });
          }

        })
      },
      //变更角色授权
      changeRole: function() {
        var v = this;

        v.changeIds = v.getTableCheckData('dataTable');

        if (v.changeIds.length == 0) {
          layer.msg('请先选择账号！', { icon: 2, time: 1500, shade: [0.8, '#f0f0f2'] });
          return;
        }

        if (v.changeIds.length > 1) {
          layer.msg('只能选择一个账号！', { icon: 2, time: 1500, shade: [0.8, '#f0f0f2'] });
          return;
        }

        if (v.changeIds.length > 0) {
          table.reload('dataTable2', config2);
          v.openWin('角色授权', '#roleBox', '450px', '450px');
        }

      },
      //保存角色授权
      saveRole: function() {
        var v = this;

        var param = {
          roleIds: v.getTableCheckData('dataTable2').join(','),
          userId: v.getTableCheckData('dataTable')[0]
        }

        if (param.roleIds.length <= 0) {
          layer.msg('请选择角色！', { icon: 2, time: 1500, shade: [0.8, '#f0f0f2'] });
          return;
        }

        $.post(conf.basePath + conf.accreditUserRole, param).done(function(res) {

          //登录超时
          if (res.code == -1) {
            window.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            layer.msg('操作成功', { icon: 1, time: 1500 }, function() {
              v.searchData();
              layer.closeAll();
            })
          } else {
            layer.msg(res.msg, { icon: 2, time: 1500 });
          }

        })

      },
      //变更团队
      changeTeam: function() {
        var v = this;

        if (v.getTableCheckData('dataTable').length == 0) {
          layer.msg('请选择账号！', { icon: 2, time: 1500, shade: [0.8, '#f0f0f2'] });
          return;
        }

        v.openWin('设置团队', '#teamBox', '450px', '170px');
      },
      //保存变更团队
      saveTeam: function() {
        var v = this;

        if (v.selectTeam == '') {
          layer.msg('请选择团队！', { icon: 2, time: 1500, shade: [0.8, '#f0f0f2'] });
          return;
        }

        var param = {
          teamId: v.selectTeam,
          userIds: v.getTableCheckData('dataTable').join(',')
        }

        $.post(conf.basePath + conf.setUserTeam, param).done(function(res) {

          //登录超时
          if (res.code == -1) {
            window.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            layer.msg('操作成功', { icon: 1, time: 1500 }, function() {
              v.selectTeam = '';
              v.searchData();
              layer.closeAll();
            })
          } else {
            layer.msg(res.msg, { icon: 2, time: 1500 });
          }

        })

      },
      //设置渠道号
      changeChannelNum: function() {
        var v = this;

        if (v.getTableCheckData('dataTable').length == 0) {
          layer.msg('请选择账号！', { icon: 2, time: 1500, shade: [0.8, '#f0f0f2'] });
          return;
        }

        v.openWin('设置渠道号', '#channelBox', '450px', '170px');
      },
      //保存渠道号
      saveChannelNum: function() {
        var v = this;

        var param = {
          channelNumber: v.channelNum,
          id: v.getTableCheckData('dataTable')
        }

        $.ajax({
          url: conf.basePath + conf.setChannelNumber,
          type: 'post',
          contentType: 'application/json;charset=utf-8',
          data: JSON.stringify(param),
          dataType: 'json'
        }).done(function(res) {

          //登录超时
          if (res.code == -1) {
            window.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            layer.msg('操作成功', { icon: 1, time: 1500 }, function() {
              v.channelNum = '';
              v.searchData();
              layer.closeAll();
            })
          } else {
            layer.msg(res.msg, { icon: 2, time: 1500 });
          }

        })

      },
      //新增用户
      addAccount: function() {
        var v = this;

        //获取新增用户数据
        $.post(conf.basePath + conf.selectNewAccount).done(function(res) {
          //登录超时
          if (res.code == -1) {
            window.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            v.accountData = res.data;

            v.$nextTick(function() {
              v.openWin('新增账号', '#accountBox', '450px', '270px');
            })
          }
        });
      },
      //保存新增用户
      saveAccount: function() {
        var v = this;
        var param;

        if (v.addAccountType == '1') {

          if (v.selectAccount == '') {
            layer.msg('请选择账号！', { icon: 2, time: 1500, shade: [0.8, '#f0f0f2'] });
            return;
          } else {
            param = {
              loginName: v.selectAccount,
              realName: '',
              accounType: v.addAccountType
            }
          }

        } else {

          if (v.addAccountName == '' || v.addAccountShowName == '') {
            layer.msg('请填写完整的账号信息！', { icon: 2, time: 1500, shade: [0.8, '#f0f0f2'] });
            return;
          } else {
            param = {
              loginName: v.addAccountName,
              realName: v.addAccountShowName,
              accounType: v.addAccountType
            }
          }

        }

        $.ajax({
          url: conf.basePath + conf.newAccount,
          type: 'post',
          contentType: 'application/json;charset=utf-8',
          data: JSON.stringify(param),
          dataType: 'json'
        }).done(function(res) {

          //登录超时
          if (res.code == -1) {
            window.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            layer.msg('操作成功', { icon: 1, time: 1500 }, function() {
              v.selectAccount = '';
              v.addAccountName = '';
              v.addAccountShowName = '';

              v.searchData();
              layer.closeAll();
            })
          } else {
            layer.msg(res.msg, { icon: 2, time: 1500 });
          }

        })

      },
      //重置密码
      changePwd: function() {
        var v = this;

        if (v.getTableCheckData('dataTable').length == 0) {
          layer.msg('请选择账号！', { icon: 2, time: 1500, shade: [0.8, '#f0f0f2'] });
          return;
        }

        v.openWin('重置密码', '#pwdBox', '450px', '220px');
      },
      //保存重置密码数据
      savePwd: function() {
        var v = this;

        var param = {
          id: v.getTableCheckData('dataTable'),
          newPassWord: v.newPassWord,
          confirmPassWord: v.confirmPassWord
        }

        if (param.newPassWord === '' || param.confirmPassWord === '') {
          layer.msg('请填写密码！', { icon: 2, time: 1500, shade: [0.8, '#f0f0f2'] });
          return;
        }

        if (param.newPassWord !== param.confirmPassWord) {
          layer.msg('两次密码不一致！', { icon: 2, time: 1500, shade: [0.8, '#f0f0f2'] });
          return;
        }

        if (param.newPassWord.length < 6 || param.confirmPassWord.length < 6) {
          layer.msg('密码长度不能小于6位！', { icon: 2, time: 1500, shade: [0.8, '#f0f0f2'] });
          return;
        }

        //密码加密
        param.newPassWord = md5(param.newPassWord);
        param.confirmPassWord = md5(param.confirmPassWord);


        $.ajax({
          url: conf.basePath + conf.resetPassword,
          type: 'post',
          contentType: 'application/json;charset=utf-8',
          data: JSON.stringify(param),
          dataType: 'json'
        }).done(function(res) {

          //登录超时
          if (res.code == -1) {
            window.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            layer.msg('操作成功', { icon: 1, time: 1500 }, function() {
              v.newPassWord = '';
              v.confirmPassWord = '';

              v.searchData();
              layer.closeAll();
            })
          } else {
            layer.msg(res.msg, { icon: 2, time: 1500 });
          }

        })

      },
      //限制登录
      updateLoginStatus: function(status) {
        var v = this;

        var param = {
          id: v.getTableCheckData('dataTable'),
          status: status
        }

        if (param.id.length == 0) {
          layer.msg('请选择账号！', { icon: 2, time: 1500, shade: [0.8, '#f0f0f2'] });
          return;
        }

        $.ajax({
          url: conf.basePath + conf.updateLoginStatus,
          type: 'post',
          contentType: 'application/json;charset=utf-8',
          data: JSON.stringify(param),
          dataType: 'json'
        }).done(function(res) {

          //登录超时
          if (res.code == -1) {
            window.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            layer.msg('操作成功', { icon: 1, time: 1500 }, function() {
              v.searchData();
            })
          } else {
            layer.msg(res.msg, { icon: 2, time: 1500 });
          }

        })

      }
    }
  })


  //绑定、解绑坐席号
  table.on('tool(dataTable)', function(obj) {

    //当前列数据
    var data = obj.data;
    var layEvent = obj.event;

    vm.controlId = data.id;

    //绑定坐席号
    if (layEvent === 'binding') {

      if (vm.roles.accountBindingSeatUI.authorised) {
        vm.openWin('绑定坐席号', '#bindingBox', '450px', '170px');
      } else {
        layer.msg('没有权限', { icon: 2, time: 1500, shade: [0.8, '#f0f0f2'] });
      }

    }

    //更改坐席号
    if (layEvent === 'change') {

      vm.bindingNo = data.seatNo;

      if (vm.roles.accountUpdateSeatUI.authorised) {
        vm.openWin('更改坐席号', '#bindingBox', '450px', '170px');
      } else {
        layer.msg('没有权限', { icon: 2, time: 1500, shade: [0.8, '#f0f0f2'] });
      }

    }

    //解绑坐席号
    if (layEvent === 'unbinding') {

      vm.bindingNo = data.seatNo;

      if (vm.roles.accountUnBindingSeatUI.authorised) {

        layer.confirm('确认解除坐位席？', { icon: 3, title: '提示', skin: 'crm-model' }, function(index) {
          vm.changeSeatNo(1);
          layer.close(index);
        });
      } else {
        layer.msg('没有权限', { icon: 2, time: 1500, shade: [0.8, '#f0f0f2'] });
      }

    }

  });

})
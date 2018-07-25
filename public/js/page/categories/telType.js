layui.use(['conf', 'utilFn', 'layer'], function() {

  var $ = layui.$;
  var layer = layui.layer;
  var conf = layui.conf;
  var _ = layui.utilFn;

  //设置全局请求头
  _.setHeader(conf, $);


  //vue实例化
  var vm = new Vue({
    el: '#content',
    data: {
      roles: {}, //当前页面权限

      activeArr: [], //显示下一级的分类
      telTypeList: [], //分类数据

      editType: '编辑类型', //0:新建一级分类,1:重命名,2:新建子类别
      postUrl: '', //发送请求地址

      editId: '', //父结点Id,创建一级分类不传
      typeName: '', //分类名称
    },
    beforeMount: function() {
      this.roles = this.getRole(_.getQueryString().id);

      this.getListData();
    },
    mounted: function() {

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
      //获取分类数据
      getListData: function() {
        var v = this;

        $.get(conf.basePath + conf.queryTelType).done(function(res) {

          //登录超时
          if (res.code == -1) {
            window.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            v.telTypeList = res.data;
          }

        })
      },
      //显示隐藏子级分类
      toggleChild: function(id) {
        var index = this.activeArr.indexOf(id);

        if (index == -1) {
          this.activeArr.push(id);
        } else {
          this.activeArr.splice(index, 1);
        }

      },
      //创建分类
      createType: function(editId, createType) {
        var v = this;

        v.editId = editId;

        var typeNameArr = ['新建一级分类', '重命名', '新建子类别'];
        var urlArr = [conf.addTelType, conf.updateTelTypeName, conf.addTelType];

        v.editType = typeNameArr[createType];
        v.postUrl = urlArr[createType];

        layer.open({
          type: 1,
          title: v.editType,
          skin: 'crm-model',
          area: ['340px', '170px'],
          content: $('#editBox')
        })

      },
      //保存分类数据
      saveEdit: function() {
        var v = this;

        if (v.typeName === '') {
          layer.msg('名称不能为空！', { icon: 2, time: 1000 });
          return;
        }

        var param;

        if (v.editType === '新建一级分类' || v.editType === '新建子类别') {
          param = {
            parentId: v.editId,
            typeName: v.typeName
          }
        } else {
          param = {
            id: v.editId,
            typeName: v.typeName
          }
        }

        $.post(conf.basePath + v.postUrl, param).done(function(res) {
          //登录超时
          if (res.code == -1) {
            window.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            v.typeName = '';
            layer.msg('保存成功', { icon: 1, time: 1000 });

            setTimeout(function() {
              v.getListData();
              layer.closeAll();
            }, 1000);
          } else {
            layer.msg(res.msg, { icon: 2, time: 1000 });
            return;
          }
        })
      },
      delType: function(id) {
        var v = this;

        layer.confirm('确认删除?', { icon: 3, title: '提示', skin: 'crm-model' }, function(index) {
          layer.close(index);

          $.post(conf.basePath + conf.delTelType, { id: id }).done(function(res) {
            //登录超时
            if (res.code == -1) {
              window.parent.location.href = '../login.html';
            }

            if (res.code == 0) {
              v.getListData();
              layer.msg('删除成功', { icon: 1, time: 1000 });

              setTimeout(function() {
                layer.close(index);
              }, 1000);
            } else {
              layer.msg(res.msg, { icon: 2, time: 1000 });
              return;
            }
          })

        });
      },
      //导出
      exportExcel: function() {
        var v = this;
        var token = _.getCookie(conf.cookieName);
        var fileUrl = `${conf.basePath+conf.exportTelType}?__sid=${token}`;

        window.location.href = fileUrl;
      }
    }
  })

})
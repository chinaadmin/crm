/**
 * 中心库js
 */

layui.use(['conf', 'utilFn', 'layer', 'jquery', 'table', 'laydate', 'upload'], function() {

  var $ = layui.$;
  var layer = layui.layer;
  var table = layui.table;
  var laydate = layui.laydate;
  var upload = layui.upload;
  var conf = layui.conf;
  var _ = layui.utilFn;

  //设置全局请求头
  _.setHeader(conf, $);


  //数据表格config
  var tableConfig = {
    elem: '#dataTable',
    id: 'dataTable',
    url: conf.basePath + conf.selectCentlibData,
    method: 'POST',
    where: {
      orderName: '-1',
      orderby: '-1',
      state: ''
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
          width: 30,
          fixed: 'left',
          align: 'center'
        },
        {
          field: 'check',
          title: '选择',
          type: 'checkbox',
          width: 30,
          fixed: 'left',
          align: 'center'
        },
        {
          field: 'mobilePhone',
          title: '手机号',
          width: 100,
          fixed: 'left',
          align: 'center',
          event: 'show',
          templet: '#tp1'
        },
        {
          field: 'realName',
          title: '姓名',
          width: 50,
          align: 'center'
        },
        {
          field: 'gender',
          title: '性别',
          width: 50,
          align: 'center',
          templet: '#tp2'
        },
        {
          field: 'age',
          title: '年龄',
          width: 50,
          align: 'center'
        },
        {
          field: 'mobilePhoneLocation',
          title: '归属地',
          width: 80,
          align: 'center'
        },
        {
          field: 'groupName',
          title: '客户分组',
          width: 100,
          align: 'center'
        },
        {
          field: 'lastDate',
          title: '最近登录',
          width: 90,
          align: 'center',
          templet: '#tp7'
        },
        {
          field: 'accountAmount',
          title: '账户总额',
          width: 90,
          align: 'center',
          sort: true
        },
        {
          field: 'usableBalance',
          title: '账户余额',
          width: 90,
          align: 'center',
          sort: true
        },
        {
          field: 'totalGram',
          title: '黄金克重',
          width: 90,
          align: 'center',
          sort: true
        },
        {
          field: 'currentGram',
          title: '金荷包',
          width: 90,
          align: 'center',
          sort: true
        },
        {
          field: 'risefallHold',
          title: '待收总额',
          width: 90,
          align: 'center',
          sort: true
        },
        {
          field: 'followUpResult',
          title: '跟进结果',
          width: 100,
          align: 'center',
          templet: '#tp3'
        },
        {
          field: 'followUpCount',
          title: '跟进数',
          width: 80,
          align: 'center',
          sort: true
        },
        {
          field: 'registerTime',
          title: '注册时间',
          width: 90,
          align: 'center',
          templet: '#tp4'
        },
        {
          field: 'buyFirstTime',
          title: '首投时间',
          width: 90,
          align: 'center',
          templet: '#tp5'
        },
        {
          field: 'firstRegularBuyTime',
          title: '首次投定',
          width: 90,
          align: 'center',
          templet: '#tp9'
        },
        {
          field: 'firstCallTime',
          title: '首次通话',
          width: 90,
          align: 'center',
          templet: '#tp10'
        },
        {
          field: 'lastFollowTime',
          title: '上次回访',
          width: 90,
          align: 'center',
          templet: '#tp6'
        },
        {
          field: 'distributeTime',
          title: '调配时间',
          width: 90,
          align: 'center',
          templet: '#tp8'
        },
        {
          field: 'loginCount',
          title: '登录次数',
          width: 90,
          align: 'center',
          sort: true
        },
        {
          field: 'userName',
          title: '跟进人',
          width: 50,
          align: 'center'
        },
        {
          field: 'channelName',
          title: '渠道',
          width: 50,
          align: 'center'
        },
        {
          field: 'source',
          title: '来源',
          width: 110,
          align: 'center',
          templet: '#tp11'
        },
        {
          field: 'createTime',
          title: '进入时间',
          width: 90,
          align: 'center',
          templet: '#tp12'
        },
      ]
    ],
    done: function(res, curr, count) {

      //登录超时
      if (res.code == -1) {
        window.location.href = '../login.html';
      }

      if (res.code == 0) {
        vm.count = res.count || 0;

        //账户相关数据同步
        if (res.map) {
          vm.account = res.map;
        } else {
          for (var k in vm.account) {
            if (vm.account.hasOwnProperty(k)) {
              vm.account[k] = 0;
            }
          }
        }
      }

    }
  };


  //分组表格渲染配置
  var config2 = {
    elem: '#dataTable2',
    id: 'dataTable2',
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
          width: 50,
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
      ]
    ]
  };

  //ios浏览器兼容性处理
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    tableConfig.width = window.parent.document.body.clientWidth - 100;
  }


  //查询条件缓存
  var queryCache = {};


  //vue 实例化
  var vm = new Vue({
    el: '#content',
    data: {

      /********查询列表相关 */
      //查询条件
      query: {
        state: '1', //客户状态
        cstMobile: '', //客户手机
        cstName: '', //客户姓名
        cstSex: '-1', //客户性别
        cstState: '-1', //客户状态  10:实名 20:未投资 30:已投资
        isNew: '-1', //客户类型 0:新客户，1:休眠客户
        p2pImport: '-1', //P2P导入 10:是 20:否
        homeLocation: '', //归属地
        rechargeState: '-1', //充值状态 21:充值成功 22:充值失败
        cstStartAge: '', //起始年龄
        cstEndAge: '', //结束年龄
        loginNumberStart: '', //登录次数开始
        loginNumberEnd: '', //登录次数结束
        orderName: '-1', //排序列 1:账户总额 2:最近登录时间 3:上次回访时间 4:首次投资时间
        orderby: '-1', //排序方式 -1:降序 2:升序
        registerStratDate: '', //注册开始时间
        registerEndDate: '', //注册结束时间
        firstStartDate: '', //首投开始时间
        firstEndDate: '', //首投结束时间
        rechargeStartDate: '', //充值开始时间
        rechargeEndDate: '', //充值结束时间
        loginStartDate: '', //登录开始时间
        loginEndDate: '', //登录结束时间
        allocateStartDate: '', //调配开始时间
        allocateEndDate: '', //调配结束时间
        accountStartBalance: '', //账户开始总额
        accountEndBalance: '', //账户结束总额
        channelType: '-1', //渠道类型 10:有 20:无
        channelName: '', //渠道名称
        recommenderType: '-1', //推荐人 10:有 20:无
        recommenderName: '', //推荐人名称
        visitStartDate: '', //上次回访开始时间
        visitEndDate: '', //上次回访结束时间
        followStartTimes: '', //跟进开始次数
        followEndTimes: '', //跟进结束次数
        lastFollowerName: '', //上一跟进人
        recycleType: '-1', //回收类型 1:自然回收 2:高层回收 3:主管回收 4:销售放弃
        nvestmentIntent: '-1', //投资意向 1:高意向 2:低意向
        followResultType: '-1', //跟进状态 1:待跟进 2:成交 3:无效
        followResult: '-1', //跟进结果
        teamIds: [], //组别id
        adminIds: [], //用户id
        centlibState: '-1', //团队状态
        allocateType: '-1', //分配类型
        firstRegularBuyTimeStart: '', //首次投定开始时间
        firstRegularBuyTimeEnd: '', //首次投定结束时间
        groupName: '', //分组名称
        intoType: '-1', //来源
      },
      /********查询列表相关 */

      //表格数据总条数
      count: 0,

      //组别专员-选择显示
      groupCommissioner: '',
      //跟进人数组
      lastFollowerArr: [],
      //select2实例
      select2: null,
      //组别人员数据
      teamData: [],

      /********查询相关 */
      //tab权限
      roles: {
        all: {}, //全部
        assign: {}, //已分配
        recycle: {}, //已回收
        unAssign: {}, //未分配
        unAssignBtnCstDetail: {} //客户详情
      },
      /********查询相关 */

      //tab状态
      tabState: 1, //1:未分配,2:已分配,3:回收,' ':全部
      //tab内权限
      tabRoles: {},

      //折叠查询
      queryMini: true,
      //layui table 实例
      table: null,
      //账号总额相关数据
      account: {
        accountAmount: 0, //账户总额
        usableBalance: 0, //账户余额
        currentGram: 0, //金荷包
        risefallHold: 0, //待收总额
        totalGram: 0 //黄金克重       
      },
      //excel导入
      importType: 1
    },
    components: {
      'vtree': window.vtree
    },
    watch: {
      'query.channelType': function(val) {
        if (val == -1) this.query.channelName = '';
      },
      'query.recommenderType': function(val) {
        if (val == -1) this.query.recommenderName = '';
      },
      'query.followResultType': function(val) {
        this.query.followResult = '-1';
      }
    },
    beforeMount: function() {
      var v = this;

      //获取tab权限
      var pageId = _.getQueryString().id;
      v.roles = v.getRole(pageId);

      //获取跟进人数据并初始化select2
      $.post(conf.basePath + conf.selectPreviousFollowUp).done(function(res) {

        //登录超时
        if (res.code == -1) {
          window.parent.location.href = '../login.html';
        }

        if (res.code == 0) {
          //请求成功
          v.lastFollowerArr = res.data;

          v.$nextTick(function() {
            this.select2 = $('#lastFollower').select2({
              width: '100%',
              containerCssClass: "form-item",
              placeholder: '上一跟进人',
              allowClear: true,
              multiple: false
            });
          })

        }
      });

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

      //默认获取第一个tab权限
      var tabId = $('.tab-ul li').first().attr('data-id');
      v.tabRoles = v.getRole(tabId);

      //默认第一个tab选中
      v.tabState = $('.tab-ul li').first().attr('data-tabstate');

      //日期组件初始化
      lay('.querydate').each(function() {

        var key = $(this).attr('id');

        laydate.render({
          elem: this,
          type: 'datetime',
          zIndex: 99999999,
          done: function(value, date, endDate) {
            v.query[key] = value;
          }
        });

      });

      //缓存查询条件
      queryCache = JSON.parse(JSON.stringify(this.query));

      //渲染数据表格
      tableConfig.where.state = $('.tab-ul li').first().attr('data-tabstate');
      table.render(tableConfig);
      table.render(config2);

      //清除loading
      $('#content').removeClass('hide');
      $('#loading').addClass('hide');
    },
    methods: {
      //获取权限
      getRole: function(id) {
        var data = '';

        $.ajax({
          url: conf.basePath + conf.getPagePermission,
          data: {
            id: id
          },
          async: false
        }).done(function(res) {
          if (res.code == 0) {
            data = res.data;
          }
        })

        return data;
      },
      //tab切换
      tabToggle: function(tab, tabId) {
        this.tabState = tab;
        this.tabRoles = this.getRole(tabId);

        //表格重载
        this.resetQuery();
      },
      //折叠查询
      queryToggle: function() {
        this.queryMini = !this.queryMini;
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
      //列表查询
      queryTable: function() {
        //上一跟进人
        this.query.lastFollowerName = this.select2.val();

        this.getTableData();
      },
      //查询重置
      resetQuery: function() {
        this.groupCommissioner = '';
        $('#lastFollower').val(null).trigger("change");

        //日期清空
        $('.querydate').each(function() {
          $(this).val('');
        });

        //树级组件数据清空
        this.$refs.vtree.clear();
        $('#selectTeam input[type="checkbox"]').prop('checked', false);

        this.query = $.extend({}, queryCache);
        this.queryTable.page = 1;

        this.getTableData();
      },
      //获取列表数据
      getTableData: function() {
        this.query.state = this.tabState;

        table.reload('dataTable', {
          where: this.query,
          page: tableConfig.page
        });
      },
      //获取选中行数据
      getTableSelected: function() {
        var checkStatus = table.checkStatus('dataTable');

        return checkStatus.data;
      },
      //调配
      action: function(type) {
        var v = this;

        //1未分配,2已分配,3回收
        var tabArr = ['', 'un_assigned', 'assigned', 'recycle'];

        var tabName = tabArr[this.tabState];


        //调配页地址及相关url参数
        var url = '';

        var urlParam = {
          type: type,
          target: 'central',
          tabName: tabName,
          count: 0
        }


        if (type == 'selected') {
          //调配选中
          var selectedRows = this.getTableSelected();
          var len = selectedRows.length;

          if (len == 0) {
            layer.msg('请先选择需要调配的客户资源', {
              icon: 2,
              shade: 0.1,
              time: 1000
            });

            return;
          } else {
            //需要调配的客户id数组
            var cstIds = [];

            for (var i = 0; i < len; i++) {
              cstIds.push(selectedRows[i].customerId);
            }

            urlParam.cstIds = cstIds;
            urlParam.count = cstIds.length;
            url = `allocate.html?${encodeURI(JSON.stringify(urlParam))}`;
          }
        } else {
          //调配所有
          if (v.count == 0) {
            layer.msg('没有可以调配的客户数据', {
              icon: 2,
              shade: 0.1,
              time: 1000
            });

            return;
          }

          urlParam.count = v.count;
          url = `allocate.html?${encodeURI(JSON.stringify($.extend(urlParam,v.query)))}`;
        }

        //打开调配页
        layer.open({
          type: 2,
          title: '调配',
          skin: 'crm-model',
          maxmin: true,
          area: ['60%', '60%'],
          content: url
        });

      },
      //客户回收
      recoveryCustomer: function(type) {

        var v = this;

        var selectedData = this.getTableSelected();
        var len = selectedData.length;

        if (len == 0) {
          layer.msg('请先选择待回收的客户资源', {
            icon: 2,
            shade: 0.1,
            time: 1000
          });
        } else {
          layer.confirm('选中的客户资料将被回收,确认回收？', {
              icon: 3,
              title: '提示',
              skin: 'crm-model'
            },
            function(index) {

              //回收数据组装
              var recoveryUsers = [];

              for (var i = 0; i < len; i++) {
                var reUser = {};
                reUser.customerId = selectedData[i].customerId;
                reUser.custName = selectedData[i].realName;
                reUser.lastFollowerId = selectedData[i].lastFollowerId;
                reUser.lastFollowerName = selectedData[i].lastFollowerName;
                reUser.recoveryType = type;

                recoveryUsers.push(reUser);
              }

              $.ajax({
                url: conf.basePath + conf.recoveryCustomer,
                type: 'post',
                async: false,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(recoveryUsers)
              }).done(function(res) {

                layer.close(index);

                //提示消息
                var msg = res.code == 0 ? '回收成功' : '回收失败,请稍后再试';

                layer.msg(msg, {
                  icon: msg == '回收成功' ? 1 : 2,
                  shade: 0.1,
                  time: 1000
                });

                //表格刷新
                v.getTableData();
              })
            });
        }

      },
      //回收全部
      recoveryAll: function() {
        var v = this;

        if (v.count == 0) {
          layer.msg('无可回收的客户资源！', {
            icon: 2,
            shade: 0.1,
            time: 1000
          });
        } else {
          layer.confirm(`${v.count}个客户资源将被回收,确认回收?`, {
              icon: 3,
              title: '提示',
              skin: 'crm-model'
            },
            function(index) {
              var param = {
                recoveryType: '1',
                cstQuery: v.query
              }

              $.ajax({
                url: conf.basePath + conf.recoveryAllCustomer,
                type: 'post',
                async: false,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(param)
              }).done(function(res) {

                //提示消息
                var msg = res.code == 0 ? '回收成功' : '回收失败,请稍后再试';

                layer.msg(msg, {
                  icon: msg == '回收成功' ? 1 : 2,
                  shade: 0.1,
                  time: 1000
                });

                //表格刷新
                v.getTableData();
              })
            })
        }

      },
      // 打开导入弹窗
      openImportWin: function() {
        layer.open({
          type: 1,
          title: '客户导入',
          skin: 'crm-model',
          area: ['450px', '230px'],
          content: $('#remind')
        })
      },
      //导入
      importExcel: function() {
        var v = this;
        var formData = new FormData();

        var fileObj = $('#exportExcel')[0].files[0];

        //上传文件类型校验
        if (!fileObj || fileObj.name.indexOf('.xlsx') == -1) {
          layer.msg('请选择正确的文件！', {
            icon: 2,
            shade: 0.1,
            time: 1000
          });

          $('#exportExcel').val('');
          return;
        } else {
          formData.append('importType', v.importType);
          formData.append('myfiles', fileObj);
        }

        //上传请求
        $.ajax({
          url: conf.basePath + conf.customerImport,
          type: 'post',
          cache: false,
          data: formData,
          processData: false,
          contentType: false
        }).done(function(res) {

          if (res.code == 0) {

            var msg = `成功导入：${res.map.quantityImported}条`;

            layer.msg(msg, {
              icon: res.code == 0 ? 1 : 2,
              shade: 0.1,
              time: 1000
            }, function() {
              $('#exportExcel').val('');
              v.getTableData();

              layer.closeAll();
            });

          } else {
            layer.msg(res.msg, {
              icon: 2,
              shade: 0.1,
              time: 1000
            });
          }

        }).fail(function(res) {

          layer.msg('上传失败,请稍后再试', {
            icon: 2,
            shade: 0.1,
            time: 1000
          });

        })

      },
      //导出
      exportExcel: function() {
        var v = this;
        var token = _.getCookie(conf.cookieName);
        var fileUrl = `${conf.basePath+conf.exportExcel}?__sid=${token}&${$.param(v.query,true)}&exportType=1`;

        window.location.href = fileUrl;
      },
      //打开分组设置弹窗
      openGroupSetsWin: function() {

        if (table.checkStatus('dataTable').data.length == 0) {
          layer.msg('请先选择账号！', {
            icon: 2,
            time: 1500,
            shade: [0.8, '#f0f0f2']
          });
          return;
        }

        table.reload('dataTable2', config2);

        layer.open({
          type: 1,
          title: '分组设置',
          skin: 'crm-model',
          area: ['500px', '450px'],
          content: $('#groupBox')
        })
      },
      //保存分组设置
      saveGroupSets: function() {
        var v = this;

        var selectCustomers = table.checkStatus('dataTable').data;
        var selectGroupData = table.checkStatus('dataTable2').data;

        var msg;

        if (selectGroupData.length == 0) {
          msg = '请选择一个分组！';
        } else if (selectGroupData.length >= 2) {
          msg = '只能选择一个分组！';
        }

        if (msg) {
          layer.msg(msg, {
            icon: 2,
            time: 1500,
            shade: [0.8, '#f0f0f2']
          });
          return;
        }

        var cstIds = [];

        selectCustomers.forEach(function(el) {
          cstIds.push(el.customerId);
        })

        //设置分组
        var param = {
          customerId: cstIds,
          groupId: selectGroupData[0].id
        }

        $.ajax({
          url: conf.basePath + conf.customerGroupSets,
          type: 'post',
          data: JSON.stringify(param),
          contentType: "application/json; charset=utf-8",
          dataType: 'json'
        }).done(function(res) {
          //登录超时
          if (res.code == -1) {
            window.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            //表格刷新
            v.getTableData();

            layer.msg('分组设置成功', {
              icon: 1,
              time: 1000
            }, function() {
              layer.closeAll();
              table.render(config2);
            });

          } else {
            layer.msg(res.msg, {
              icon: 2,
              time: 1000
            });
            return;
          }

        })

      }
    }
  });

  //点击展示用户详情弹窗
  table.on('tool(dataTable)', function(obj) {

    //是否有显示客户详情的权限
    var flag = vm.tabRoles.unAssignBtnCstDetail.authorised;

    if (flag) {
      var userData = obj.data;

      layer.open({
        type: 2,
        title: '客户详情',
        skin: 'crm-model',
        maxmin: true,
        area: ['90%', '90%'],
        scrollbar: false,
        content: `${conf.baseProject}/customerDetails/customerDetail.html?customerId=${userData.customerId}&from=center&to=${vm.roles.unAssignBtnCstDetail.id}`
      });
    }

  });


  //注册全局查询方法提供给调配页使用
  window.queryTable = vm.queryTable;

})
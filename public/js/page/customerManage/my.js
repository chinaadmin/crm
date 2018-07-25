layui.use(['conf', 'utilFn', 'layer', 'table', 'laydate', 'jquery', 'laytpl'], function() {

  var table = layui.table,
    layer = layui.layer,
    $ = layui.jquery,
    conf = layui.conf,
    utilFn = layui.utilFn,
    laydate = layui.laydate;

  //设置请求头
  utilFn.setHeader(conf, $);

  //表格配置
  var config = {

    elem: '#myCustomer',
    url: conf.basePath + conf.selectMyCumtomer,
    page: {
      layout: ['limit', 'prev', 'page', 'next', 'count'],
      curr: 1,
      limits: [10, 20, 30, 50, 100, 200],
    },
    even: true,
    method: 'POST',
    id: 'myCustomer',
    where:{
      'orderby': -1,
      'orderName': -1,
      'callStatus': 2
    },
    cols: [
      [ //表头
        { field:'', title: '呼叫',type:'space',width: 50,align: 'center',fixed: 'left',templet:'#tp1',event: 'call',},
        { type: 'numbers',fixed: 'left'},
        { field: 'mobilePhone',title: '手机号',align: 'center',fixed: 'left',width: 100,templet: '#titleTpl',event: 'show',},
        { field: 'realName',title: '姓名',align: 'center',width: 50},
        { field: 'gender',title: '性别',align: 'center',width: 50,templet: '#gender'},
        { field: 'age',title: '年龄',align: 'center',width: 50,},
        { field: 'mobilePhoneLocation',title: '归属地',align: 'center',width: 80},
        { field: 'groupName', title: '客户分组', align: 'center', width: 80},
        { field: 'lastDate',title: '最近登录',align: 'center',width: 90,templet: '#tpforth'},
        { field: 'accountAmount',title: '账户总额',align: 'center',width: 90,sort: true},
        { field: 'usableBalance',title: '账户余额',align: 'center',width: 90,sort: true},
        { field: 'currentGram',title: '金荷包',align: 'center',width: 90,sort: true},
        { field: 'risefallHold',title: '待收总额',align: 'center',width: 90,sort: true},
        { field: 'followUpResult',title: '跟进结果',align: 'center',width: 90,templet: '#followUp'},
        { field: 'followUpCount',title: '跟进数',align: 'center',width: 80},
        { field: 'registerTime',title: '注册时间',align: 'center',width: 90,templet: '#tpfirst'},
        { field: 'buyFirstTime',title: '首投时间',align: 'center',width: 90,templet: '#tpsecond'},
        { field: 'firstRegularBuyTime',title: '首次投定',align: 'center',width: 90,templet: '#tp2'},
        { field: 'lastFollowTime',title: '上次回访',align: 'center',width: 90,templet: '#tpthird'},
        { field: 'loginCount',title: '登录次数',align: 'center',width: 90,},
        { field: 'cstState',title: '客户状态',align: 'center',width: 95,templet: '#cstState'}
      ]
    ],
    //账户数据
    done: function(res, curr, count) {

      //登录超时
      if (res.code == -1) {
        window.location.href = '../login.html';
      }

      if (res.map == 0) {

        app.mount = res.map || 0;

      }
      if (res.map) {
        app.mount = res.map;
      } else {

        for (var i in app.mount) {

          if (app.mount.hasOwnProperty(i)) {

            app.mount[i] = 0;
          }

        }
      }

    }
  }

  //ios浏览器兼容性处理
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    config.width = window.parent.document.body.clientWidth - 100;
  }

  //查询条件缓存
  var queryCache = {};
  //vue实例化
  var app = new Vue({
    el: '#customer',
    //查询条件
    data: {
      loading: true,
      mount: {
        accountAmount: 0, //账户总额
        risefallHold: 0, //现金账户总额
        usableBalance: 0, //黄金资产总克重
        totalGram: 0, //金荷包克重
        currentGram: 0, //待收总额
      },
      table: {
        cstName: '', // 姓名
        cstStartAge: '', // 开始年龄
        cstEndAge: '', // 结束年龄
        cstSex: '-1', // 性别 10：男， 20：女
        homeLocation: '', // 归属地
        orderName: '-1', // 排序列 1 账户总额 2 最近登录时间 3 上次回访时间 4 首次投资时间
        orderby: '-1', // 排序方式 2 升序 3 降序
        cstMobile: '', // 手机号码
        rechargeState: '-1', // 充值状态 21 充值成功 22 充值失败
        followResult: '-1', // 跟进结果
        followResultType: '-1', //跟进状态 1 待跟进 2 成交 3 无效
        nvestmentIntent: '-1', // 投资意向 1 高意向 2 低意向
        followStartTimes: '', // 开始跟进次数
        followEndTimes: '', // 结束跟进次数
        loginNumberStart: '', // 开始登录次数
        loginNumberEnd: '', // 结束登录次数
        cstState: '-1', // 客户状态 10 未实名 20 已投资 30 为投资
        accountStartBalance: '', // 账户总额开始
        accountEndBalance: '', // 账户总额结束
        visitStartDate: '', // 上次回访开始时间
        visitEndDate: '', // 上次回访时间结束
        registerStratDate: '', // 注册时间开始
        registerEndDate: '', // 注册时间结束
        firstStartDate: '', // 首投时间开始
        firstEndDate: '', // 首投时间结束
        firstRegularBuyTimeStart:'',//首次投定时间开始
        firstRegularBuyTimeEnd:'',//首次投定时间结束
        allocateStartDate: '', // 调配时间开始
        allocateEndDate: '', // 调配时间结束
        rechargeStartDate: '', // 充值时间开始
        rechargeEndDate: '', // 充值时间结束
        loginStartDate: '', // 登录开始时间
        loginEndDate: '', // 登录结束时间
        channelType: '-1', // 渠道类型
        channelName: '', // 渠道
        isNew: '-1', //客户类型 0 新客户 1休眠客户
        recommenderType: '-1', // 推荐人类型
        followResultType: '-1', // 跟进结果类型
        lastFollowerName: '', //上一跟进人
        p2pImport: '-1', //p2p导流 10 是 20 否
        callStatus: '1',//通话状态 1.已拨 2.未拨
        groupName:'',//分组名称
      },
      teamData: [], //组别人员数据
      timeArr: [],
      nameArr: [],
      lastFollowerNameData: [],
      tabState: 1,
      roles: {
        unAssignBtnCstDetail: {}, //客户详情
      },
      groupCommissioner: '', //保存组别人员数据
      //折叠
      queryMini: true,
      //select2实例
      select2: null,
      status:'',
      isActive: true,

    },
    //注册树形结构插件
    components: {
      'vtree': window.vtree
    },
    watch: {
      'table.channelType': function(val) {
        if (val == -1) this.table.channelName = '';
      },
      'table.recommenderType': function(val) {
        if (val == -1) this.table.recommenderName = '';
      },
      'table.followResultType': function(val) {
        this.table.followResult = '-1';
      }
    },
    beforeMount: function() {
      var v = this;
      //获取权限
      var pageId = utilFn.getQueryString().id;
      v.roles = v.getRoles(pageId);

      //获取组别专员数据
      $.post(conf.basePath + conf.selectGroupCommissioner).done(function(res) {
        if (res.code == 0) {
          v.teamData = res.data;
        } else {
          layer.msg(res.msg, {
            icon: 2,
            shade: 0.1,
            time: 1000
          })
        }
      });
      //查询上一跟进人
      $.post(conf.basePath + conf.selectPreviousFollowUp).done(function(res) {
        if (res.code == 0) {
          v.lastFollowerNameData = res.data;
          v.$nextTick(function() {
            this.select2 = $('#lastFollower').select2({
              width: '100%',
              containerCssClass: "tel-box",
              placeholder: '上一跟进人',
              allowClear: true,
              multiple: false

            });
          })

        } else {
          layer.msg(res.msg, {
            icon: 2,
            shade: 0.1,
            time: 1000
          })
        }
      });

      
    },
    mounted: function() {
      //清除loading
      $('#customer').removeClass('hide');
      $('#loading').addClass('hide');

      //缓存默认查询条件
      queryCache = JSON.parse(JSON.stringify(this.table));


      //日期时间
      
      lay('.big').each(function () {
        laydate.render({
          elem: this,
          trigger: 'click',
          type:'datetime'
        });
      });

      //表格初始化
      table.render(config);

    },
    methods: {
      //获取权限
      getRoles: function(id) {
        $.ajax({
          url: conf.basePath + conf.getPagePermission,
          type: 'post',
          data: { id: id },
          async: false,
        }).done(function(res) {
          if (res.code == 0) {
            data = res.data;
          }
        })
        return data;
      },
      //tab切换
      tabToggle: function(tab) {
        this.tabState = tab;
      },
      //折叠查询
      queryToggle: function() {
        this.queryMini = !this.queryMini;
      },
      //弹框
      openSelectTeam: function() {
        layer.open({
          type: 1,
          title: '组别专员',
          skin: 'crm-model',
          area: ['30%', '40%'],
          content: $('#selectTeam')
        })
      },
      //导航切换
      callStatusChange(index){

        //已拨
        if (index == 1) {

          this.isActive = false;
            config.where.callStatus = 1;
            table.render(config);

        //未拨
        }else if(index == 2) {

          this.isActive = true;
          config.where.callStatus = 2;
          table.render(config);

        }

      },
      //查询重载列表
      researchForm: function() {

        //调配时间
        this.table.allocateStartDate = $('#adjustStartTime').val();
        this.table.allocateEndDate = $('#adjustEndTime').val();
        //上次回访时间
        this.table.visitStartDate = $('#lastVisitStart').val();
        this.table.visitEndDate = $('#lastVisitEnd').val();
        //充值时间
        this.table.rechargeStartDate = $('#rechargeStartTime').val();
        this.table.rechargeEndDate = $('#rechargeEndTime').val();
        //登录时间
        this.table.loginStartDate = $('#loginStartTime').val();
        this.table.loginEndDate = $('#loginEndTime').val();
        //首投时间
        this.table.firstStartDate = $('#firstThrowStartTime').val();
        this.table.firstEndDate = $('#firstThrowEndTime').val();
        //注册时间
        this.table.registerStratDate = $('#registerStartTime').val();
        this.table.registerEndDate = $('#registerEndTime').val();
        //首次投定
        this.table.firstRegularBuyTimeStart = $('#firstRegularStartTime').val();
        this.table.firstRegularBuyTimeEnd = $('#firstRegularEndTime').val();

        //上一跟进人
        this.table.lastFollowerName = this.select2.val();

        //通话状态
        if (this.isActive == true) {
          this.table.callStatus = 2;
        } else {
          this.table.callStatus = 1;
        }
        config.where = this.table;

        table.reload('myCustomer', config);
      },
      //清空表格
      resetForm: function() {
        this.groupCommissioner = '';
        $('#lastFollower').val(null).trigger("change");

        //日期清空
        var nameArr = ['#adjustStartTime', '#adjustEndTime', '#lastVisitStart', '#lastVisitEnd', '#rechargeStartTime', '#rechargeEndTime', '#loginStartTime', '#loginEndTime', '#firstThrowStartTime', '#firstThrowEndTime', '#registerStartTime', '#registerEndTime', '#firstRegularStartTime','#firstRegularEndTime'];

        for (var i = 0; i < nameArr.length; i++) {
          $(nameArr[i]).val('');
        }

        //树级组件数据清空
        this.$refs.vtree.clear();
        $('#selectTeam input[type="checkbox"]').prop('checked', false);

        this.table = $.extend({}, queryCache);

        //通话状态
        if (this.isActive == true) {
          this.table.callStatus = 2;
        } else {
          this.table.callStatus = 1;
        }
        config.where = this.table;

        table.reload('myCustomer', config)

      },
      //组别人员
      selectTeam: function(res) {
        this.table.teamIds = utilFn.compact(res.teamIds);
        this.table.adminIds = utilFn.compact(res.userIds);
        this.groupCommissioner = res.teamNames + ' ' + res.userNames;
        layer.closeAll();
      },
      checkCustomer:function(){

      }
    },
  });
  //点击展示用户详情弹窗
  table.on('tool(test)', function(obj) {

    var layEvent = obj.event;
    var flag = app.roles.unAssignBtnCstDetail.authorised;
    var data = obj.data;
    var customerStatus = data.customerId;

    //检查是否为本人客户
    $.ajax({
      url: conf.basePath + conf.checkCustomerAscription,
      data: { customerId: customerStatus },
      type: 'POST',
      async: false,
      ContentType: "application/x-www-form-urlencoded"
    }).done(function (res) {

      app.status = res;

    })

    //非本人客户不可查看
    if (app.status == false) {
      layer.msg('非本人客户不可查看客户详情！',{
        icon:0,
        time:2000,
        shade:0.3
      })
      
      app.researchForm();

      return;
    }

    if (flag) {
      var userData = obj.data;
      layer.open({
        type: 2,
        title: '客户详情',
        skin: 'crm-model',
        area: ['90%', '90%'],
        maxmin: true,
        scrollbar: false,
        content: `${conf.baseProject}/customerDetails/customerDetail.html?customerId=${userData.customerId}&from=myCustomer&to=${app.roles.unAssignBtnCstDetail.id}`,

      })

    }
    if (layEvent == 'call') {
      window.parent.callout(obj.data.mobilePhone);
    }

  })


});
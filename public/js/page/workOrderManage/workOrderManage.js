layui.use(['table', 'layer', 'laydate', 'conf', 'utilFn', 'jquery'], function() {
  var table = layui.table,
    layer = layui.layer,
    laydate = layui.laydate,
    conf = layui.conf,
    $ = layui.jquery,
    utilFn = layui.utilFn;

  //设置请求头
  utilFn.setHeader(conf, $)

  var config = {
    elem: '#workOrderList',
    url: conf.basePath + conf.selectWorkOrderListData,
    id: 'workOrderList',
    method: 'post',
    even: true,
    page: {
      layout: ['limit', 'prev', 'page', 'next', 'count'],
      curr: 1
    },
    limits: [10, 20, 30, 50, 100, 200],
    cols: [ [ {type: 'numbers',fixed: 'left', width: 50,align: 'center' },
      { type: 'checkbox', fixed: 'left', width: 50 },
      {title:'呼叫',fixed:'left',width:60,align:'center',event:'call',templet:'#tp8'},
      {field: 'id',title: '工单编号', width: 100,align: 'center'},
      {field: 'level',title: '等级',width: 60,align: 'center'}, 
      {field: 'mobilePhone',title: '客户号码',width: 210,align: 'center',templet: '#tp6',event:'detail'},
      {field: 'proDescription',title: '内容',width: 210,align: 'center',templet: '#tp5', event: 'show'}, 
      {field: 'custName',title: '姓名', width: 150,align: 'center'}, 
      {field: 'levelNames',title: '分类',width: 150,align: 'center'}, 
      {field: 'createName',title: '创建人',width: 110,align: 'center'}, 
      {field: 'createTime',title: '创建时间',width: 110,align: 'center',templet: '#tp1'}, 
      {field: 'handlerName',title: '当前处理人',width: 110,align: 'center'}, 
      {field: 'handlingTime',title: '预计处理时间',width: 120,align: 'center',templet: '#tp2'}, 
      {field: 'source',title: '来源',width: 100,align: 'center',templet:'#tp7'}, 
      {field: 'status',title: '状态',width: 80,align: 'center',templet: '#tp3'}, 
      {field: 'finishTime',title: '解决时间',width: 110,align: 'center',templet: '#tp4'}, ] ]
  }

  var queryCache = {};

  var queryCacheAdd = {};

  var assignmentOrderDataTw={};

  var pageID = utilFn.getQueryString().id;


  var vm = new Vue({
    el: '#app',
    data: {
      info: {
        startCreateTime: '', //创建时间开始
        endCreateTime: '', //创建时间结束
        mobilePhone: '', //客户号码
        status: '-1', //状态
        startFinishTime: '', //解决时间开始
        endFinishTime: '', //解决时间结束
        handlerMan: '', //处理人
        level: '-1', //等级
        startHandlingTime: '', //预计处理时间开始
        endHandlingTime: '', //预计处理时间结束
        source: '-1', //来源
      },

      readOnly: false, //已解决工单不可编辑
      //查看工单数据
      workOrderData: {
        custName: '',
        handlerId: '-1',
        handlingTime: '',
        id: '',
        level: '-1',
        levelIds: '',
        mobilePhone: '',
        otherPhone: '',
        proDescription: '',
        source: '-1',
        status: '-1',
        enclosure: [],
        historicalRecords: [],
      },
      workorderId:'',
      createTime:'',
      createName:'',
      remark:'',
      oldLevelIds:'',
      //新增工单数据
      addWorkOrderData: {
        mobilePhone:'',
        level:'-1',
        custName:'',
        otherPhone:'',
        levelIds:'',
        otherPhone:'',
        levelNames:'',
        handlerId:'-1',
        handlerName:'',
        handlingTime:'',
        proDescription:'',
        source:'-1',
        status:'-1',
      },
      // 指派工单数据
      assignmentOrderData:{
        handlerId:'-1',
        handlerName:'',
        handlingTime:'',
        remark:'',
        workorderId:'',
      },

      workOrderDataCopy: {},

      //查看工单分类
      typeTree1: [], //一级分类
      typeTree2: [], //二级分类
      typeTree3: [], //三级分类
      selectedTypeTree1: '-1', //选择的一级分类
      selectedTypeTree2: '-1', //选择的二级分类
      selectedTypeTree3: '-1', //选择的三级分类

      //新建工单分类
      newtypeTree1: [], //一级分类
      newtypeTree2: [], //二级分类
      newtypeTree3: [], //三级分类
      newselectedTypeTree1: '-1', //选择的一级分类
      newselectedTypeTree2: '-1', //选择的二级分类
      newselectedTypeTree3: '-1', //选择的三级分类

      //处理人数据
      dealingPeople: [],
      //增加dom结构循环
      items:['1'],
      loading:true,
      showReadData:{},
      roles:{
        unAssignBtnCstDetail:{}
      },
    },
    watch:{
      newselectedTypeTree1:function(val){
          if (val == -1) {
            this.newselectedTypeTree2=[];
            this.newtypeTree2=[];
          }else{
            this.getLevelData(val,'newtypeTree2')
          }
        this.newselectedTypeTree2 = -1;
      },
      newselectedTypeTree2:function(val){
          if(val == -1){
            this.newselectedTypeTree3 = [];
          }else{
            this.getLevelData(val,'newtypeTree3')
          }
          this.newselectedTypeTree3 = -1;
        }
    },
    beforeMount: function() {
        var v = this;
        queryCache = JSON.parse(JSON.stringify(this.info));

        queryCacheAdd = JSON.parse(JSON.stringify(this.addWorkOrderData));

        this.workOrderDataCopy = JSON.parse(JSON.stringify(this.workOrderData));

        assignmentOrderDataTw = JSON.parse(JSON.stringify(this.assignmentOrderData));

        //获取页面权限
        $.ajax({
          url: conf.basePath + conf.getPagePermission,
          data:{id:pageID},
          async:false,
          type:'post'
        }).done(function(res){
          //登录超时
          if (res.code == -1) {
            window.parent.location.href = "../login.html";
          }
          //获取成功
          if (res.code == 0) {
            v.roles = res.data;
          }
        })
        
    },
    mounted: function() {

          //时间插件初始化
          laydate.render({
            elem: '#expectTime',
            type: 'datetime',
          });

          lay('.big').each(function() {
            laydate.render({
              elem: this,
              type: 'datetime',
              trigger: 'click'
            });
          });

          laydate.render({
            elem: '#handlingTime',
            type: 'datetime',
          });

          laydate.render({
            elem: '#assignTime',
            type: 'datetime',
          });

          //数据表格渲染
          table.render(config);

          //loading
          $('#app').removeClass('hide');
          $('#loading').addClass('hide');

    },
    methods: {
      //处理时间
      getSplitTime: function(){

          //创建时间
        this.info.startCreateTime = $('#newStartTime').val();
        this.info.endCreateTime = $('#newEndTime').val();

          //解决时间
        this.info.startFinishTime = $('#resolutionStartTime').val();
        this.info.endFinishTime = $('#resolutionEndTime').val();

          //预计处理时间
        this.info.startHandlingTime = $('#expectStartTime').val();
        this.info.endHandlingTime = $('#expectEndTime').val();
      },
      //查询表格
      search: function() {
        
        this.getSplitTime();
        config.where = this.info;
        table.reload('workOrderList', config);
      },
      //重置表格
      reset: function() {
        var timeArr = ['#newStartTime', '#newEndTime', '#resolutionStartTime', '#resolutionEndTime', '#expectStartTime','#expectEndTime'];
        for (var i = 0; i < timeArr.length; i++) {
          $(timeArr[i]).val('');
        };
        this.info = $.extend({}, queryCache);
        config.where = this.info;
        table.reload('workOrderList', config);
      },
      //获取分类数据
      getLevelData: function(id, allName) {
        var v = this;
        $.ajax({
          url: conf.basePath + conf.selectWorkOrderClassification,
          data: { parentId: id },
          method: 'post',
        }).done(function(res) {
          //登录超时
          if (res.code == -1) {
            window.parent.location.href = "../login.html";
          }

          if (res.code == 0) {
            v[allName] = res.data;
          }

        })
      },
      //获取处理人下拉选项数据
      getDealingPeople: function() {
        var v = this;

        $.post(conf.basePath + conf.selectDealingPeople).done(function(res) {
          //登录超时
          if (res.code == -1) {
            window.parent.location.href = "../login.html";
          }

          if (res.code == 0) {
            v.dealingPeople = res.data;
          }
        })
      },
      //展示工单详情
      getWorkOrderData: function(id) {
        var v = this;

        //获取查看详情数据
        $.ajax({
          url: conf.basePath + conf.selectWorkOrderListDetails,
          data: { id: id },
          method: 'post',
        }).done(function(res) {
          //登录超时
          if (res.code == -1) {
            window.parent.location.href = "../login.html";
          }

          //获取成功
          if (res.code == 0) {

            v.workOrderData = res.data;
            v.workOrderData.enclosure = res.map.enclosure;
            v.workOrderData.historicalRecords = res.map.historicalRecords;

            v.dealingPeople = res.map.dealingPeople;
            v.typeTree1 = res.map.workOrderClassification;
            $('#expectTime').val(v.workOrderData.handlingTime);

            //分类下拉选项展示
            v.selectedTypeTree1 = v.workOrderData.levelIds.split(',')[0];
            v.getLevelData(v.selectedTypeTree1, 'typeTree2');

            v.selectedTypeTree2 = v.workOrderData.levelIds.split(',')[1] || '-1';
            v.getLevelData(v.selectedTypeTree2, 'typeTree3');
            console.log(v.typeTree3);

            v.selectedTypeTree3 = v.workOrderData.levelIds.split(',')[2] || '-1';

            v.readOnly = v.workOrderData.status == '0' ? true : false;

            //已解决时，转发及保存按钮隐藏
            if (v.workOrderData.status == '0') {
              $('#showReadBtn').addClass('hide');
            } else {
              $('#showReadBtn').removeClass('hide');
            }

            if (v.selectedTypeTree3 == '-1') {
              v.typeTree3 = [];
            }
            //保存分类选项
           v.oldLevelIds = v.workOrderData.levelIds;

           //loading
           $('#showLoading').addClass('hide');
           $('#showWorkOrder').removeClass('hide');

          }

        });
      },
      //分类选项联动
      typeSelect: function(treeId, type) {
        if (type == 1) {
          
          this.getLevelData(treeId, 'typeTree2');
          this.selectedTypeTree2 = '-1';
          this.typeTree2 = [];
          this.selectedTypeTree3 = '-1';
        }

        if (type == 2) {

          if (treeId == '-1') {
            this.selectedTypeTree3 = '-1';
            this.typeTree3 = [];
          } else {
            this.getLevelData(treeId, 'typeTree3');
            this.selectedTypeTree3 = '-1';
          }
        }
      },
      //记录文字拼接
      recordText: function(data) {
        //状态 1创建 2指派 3关闭
        var statusArr = [0, '创建', '指派', '关闭'];

        var text = '';

        if (data.status == 2) {
          text = `${data.createTime} 由 ${data.operatorName} ${statusArr[data.status]} ${data.beassignedName}`;
        } else {
          text = `${data.createTime} 由 ${data.operatorName} ${statusArr[data.status]}`;
        }

        return text;
      },
      //新建工单
      newOrder: function() {
        var v = this;
        v.workOrderData = $.extend({}, v.workOrderDataCopy);
        v.addWorkOrderData = $.extend({}, queryCacheAdd);
        $('#handlingTime').val('');
        v.newselectedTypeTree1= '-1';
        v.newselectedTypeTree2= '-1'; 
        v.newselectedTypeTree3= '-1';
        $('input[type=file]').val('');
        v.items = ['1'];
        

        //获取一级分类数据
        v.getLevelData('-1', 'newtypeTree1');

        //获取处理人数据
        v.getDealingPeople();

       var newIndex = layer.open({
          type: 1,
          title: '新建工单',
          skin: 'crm-model',
          area: $(window).width() > 1366 ? ['50%', '65%'] : ['70%', '80%'],
          content: $('#addWorkOrder')
        })
      },

      //文件上传
      checkSize: function (obj) {

        if (typeof ($(obj)[0]).files != 'undefined') {
          var maxUploadInfo = '50M';
          var sizeType = { 'K': 1024 * 1024, 'G': 1024 * 1024 * 1024 };
          var unit = maxUploadInfo.replace(/\d+/, '');
          var maxUploadSize = maxUploadInfo.replace(unit, '') * sizeType[unit];
          var fileSize = 0;
          $(obj).parents('#fileform').find(':file').each(function () {
            if ($(this).val()) fileSize += $(this)[0].files[0].size;
          })
          if (fileSize > maxUploadSize) alert('文件大小已经超过限制，可能不能成功上传');
        }
      },
      //增加文件
      addFile: function () {
        this.items.push('1');
      },
      //删除文件
      delFile: function () {
        if($(".fileBox").length == 1){
          return false;
        }else{
          this.items.shift();
        }
        
      },
      //更新数据
      updateData:function(){
        var v = this;
        var param = {
          id: v.workOrderData.id,
          custName: v.workOrderData.custName,
          proDescription: v.workOrderData.proDescription,
          oldLevelIds: v.oldLevelIds,
          levelNames: v.workOrderData.levelNames,
          mobilePhone: v.workOrderData.mobilePhone,
          level: v.workOrderData.level,
          otherPhone: v.workOrderData.otherPhone,
          levelIds: v.workOrderData.levelIds,
          handlerId: v.workOrderData.handlerId,
          handlerName: $('#workOrderName').find("option:selected").text(),
          handlingTime: $('#expectTime').val(),
          source: v.workOrderData.source,
          status: v.workOrderData.status

        }
        $.ajax({
          url: conf.basePath + conf.updateWorkOrder,
          type: 'post',
          data: JSON.stringify(param),
          contentType: 'application/json;charset=UTF-8'
        }).done(function (res) {
          //登录失败
          if (res.code == -1) {
            window.parent.location.href = "../login.html";
          }
          if (res.code == 0) {
            table.reload('workOrderList', config);
          }
        })
      },
      //转发
      transmitOrder:function(){

        var v = this;
        
        if(v.addParams() == false){
          return;
        }
        v.getSeTreeData();
        
        v.updateData();
        
        //调用指派工单
        layer.close(layer.index);
        this.assignOrder();

      },
      //关闭
      callClose:function(){
        var v = this;
        if (v.addParams() == false) {
          return;
        }
        
        v.getSeTreeData();

        v.updateData();

        //调用关闭工单
        layer.closeAll();
        this.closeOrder();
      },
      //获得联动数据
      getSeTreeData:function(){
        var v = this;
        var levelNames = '';
        var levelIds = '';

        if ($("#levelone").val() != -1) {
          levelNames += $("#levelone").find("option:selected").text();
          levelIds += $("#levelone").find("option:selected").val() + ",";

        }
        if ($("#leveltwo").val() != -1) {
          levelNames += "-";
          levelNames += $("#leveltwo").find("option:selected").text();
          levelIds += $("#leveltwo").find("option:selected").val() + ",";

        }
        if ($("#levelthree").val() != -1) {
          levelNames += "-";
          levelNames += $("#levelthree").find("option:selected").text();
          levelIds += $("#levelthree").find("option:selected").val();

        }
        v.workOrderData.levelIds = levelIds;
        v.workOrderData.levelNames = levelNames;
      },
      //检查输入是否为空
      checkParams: function () {
            var v = this;
            var mobilePhone = $('#mobilePhone').val();
            if (typeof (mobilePhone) == 'undefined' || mobilePhone.trim() == '') {
              v.layerPop('手机号不能为空!');
              return false;
            };
            if ($('#custName').val() == '') {
              v.layerPop('请输入客户姓名!');
              return false;
            };
            if ($('#firstLevel').find("option:selected").val() == '-1') {
              v.layerPop('请选择工单分类!');
              return false;
            };
            if ($('#level').find("option:selected").val() == '-1') {

              v.layerPop('请选择等级!');
              return false;
            };
            if ($('#status').find("option:selected").val() == '-1') {
              v.layerPop('请选择处理情况!');
              return false;
            };

            if ($("#source").find("option:selected").val() == '-1') {
              v.layerPop('请选择处理来源!');
              return false;
            };
            if ($('#handlingTime').val() == '') {
              v.layerPop('请输入预计处理时间');
              return false;
            };
            var proDescription = $("#proDescription").val();
            if (proDescription == '') {
              v.layerPop('问题描述不能为空');
              return false;
        };
      },
      //检查查看工单输入是否为空
      addParams:function(){
            var v = this;
            if (v.workOrderData.mobilePhone==''){
                v.layerPop('请输入客户号码');
                return false;
                }
            if (!v.workOrderData.custName) {
                v.layerPop('请输入客户姓名');
                return false;
            }
            if (v.selectedTypeTree1 == '-1') {
                v.layerPop('请选择工单分类');
                return false;
            }
            if (v.workOrderData.level == '-1') {
              v.layerPop('请选择等级');
              return false;
            }
            if (v.workOrderData.status == '-1') {
              v.layerPop('请选择处理状况');
              return false;
            }
            if (v.workOrderData.source == '-1') {
              v.layerPop('请选择来源');
              return false;
            }
            if (v.workOrderData.handlerId == '-1') {
              v.layerPop('请选择处理人');
              return false;
            }
            if (!$('#expectTime').val()) {
              v.layerPop('请选择处理时间');
              return false;
            }
            if (!v.workOrderData.proDescription) {
              v.layerPop('请输入问题描述');
              return false;
        }
      },
      //弹窗
      layerPop:function(title){
        layer.msg(title, {
          icon: 0,
          shade: 0.2,
          time: 2000
        })
      },
      //新增工单保存
      saveFormSubmit:function(){
              var v = this;
              if(v.checkParams() == false){
                return;
              };
              
              var levelNames = '';
              var levelIds = '';

              if ($("#firstLevel").val() != -1) {
                levelNames += $("#firstLevel").find("option:selected").text();
                levelIds += $("#firstLevel").find("option:selected").val() + ",";

              }
              if ($("#secondLevel").val() != -1) {
                levelNames += "-";
                levelNames += $("#secondLevel").find("option:selected").text();
                levelIds += $("#secondLevel").find("option:selected").val() + ",";

              }
              if ($("#thirdLevel").val() != -1) {
                levelNames += "-";
                levelNames += $("#thirdLevel").find("option:selected").text();
                levelIds += $("#thirdLevel").find("option:selected").val();

              }
              $("#levelIds").val(levelIds);
              $("#levelNames").val(levelNames);
                  
              $("#handlerName").val($("#handlerId").find("option:selected").text());

              var query = document.getElementById("add-form");
              var form = new FormData(query);

              $.ajax({

                url: conf.basePath + conf.addWorkOrder,
                type: 'post',
                data: form,
                processData: false,
                contentType: false,

              }).done(function (res) {
                //未登录
                if (res.code == -1) {

                  window.parent.location.href = "../login.html";
                }
                //保存成功
                if (res.code == 0) {

                  layer.msg('保存成功!', {
                    icon: 1,
                    shade: 0.2,
                    time: 2000
                  });

                  //刷新表格
                  table.reload('workOrderList', config);

                }
              })
          layer.closeAll();


      },
      //指派导航按钮
      assignOrderBtn:function(){
        var v = this;
        var checkStatus = table.checkStatus('workOrderList');

        if (checkStatus.data.length == 0) {
          layer.msg('请选择需要指派的工单', {
            icon: 0,
            shade: 0.2,
            time: 2000

          })
          return;
        }
        
        if (checkStatus.data.length > 1) {

          layer.msg('只能指派一条工单', {
            icon: 0,
            shade: 0.2,
            time: 2000

          })
          return ;
        }
        v.assignOrder();
      },
      //指派工单
      assignOrder: function() {
        
        var v = this;

        v.assignmentOrderData = $.extend({}, assignmentOrderDataTw);
        $('#assignTime').val('');
        v.getDealingPeople();

        var index=layer.open({
          type:1,
          title: '指派工单',
          skin: 'crm-model',
          area: $(window).width() > 1366 ?['40%','45%']:['50%', '50%'],
          content: $('#assignmentOrder')
        })

      },
      // 提交指派工单
      assignFormSubmit: function (){

        var v = this;
        var checkStatus = table.checkStatus('workOrderList');

        if (checkStatus.data.length > 1){

          layer.msg('只能指派一条工单',{
            icon:0,
            shade:0.2,
            time:2000

          })
          return false;
        }

        var handlerId = $('#handler').find("option:selected").val();
        var handlerName = $('#handler').find("option:selected").text();
        var handlingTime = $('#assignTime').val();
        var remark = $('#remark').val();

        if (v.assignmentOrderData.handlerId == -1) {

            layer.msg('请选择处理人！', {
              icon: 0,
              shade: 0.2,
              time: 2000
            })
            return false;
        }
        if (handlingTime == '') {

          layer.msg('请选择预计处理时间！', {
            icon: 0,
            shade: 0.2,
            time: 2000
          })
          return false;
        }
        if (v.assignmentOrderData.remark == '') {

          layer.msg('请输入备注！', {
            icon: 0,
            shade: 0.2,
            time: 2000
          })
          return false;
        }

       var assignmentOrderData= {

              handlerId: handlerId,
              handlerName: handlerName,
              handlingTime: handlingTime,
              remark: remark,
              workorderId: v.workorderId,

          };
        
        $.ajax({
          url: conf.basePath + conf.assignedWorkOrder,
          type:'post',
          data: JSON.stringify(assignmentOrderData),
          contentType: 'application/json;charset=UTF-8'
        }).done(function(res){

          //登录超时
          if (res.code == -1) {
            window.parent.location.href = "../login.html";
          }
          //获取数据成功
          if (res.code == 0) {
            layer.msg('指派成功!', {
              icon: 1,
              shade: 0.2,
              time: 2000
            });
            //重载表格
            table.reload('workOrderList',config); 
            v.workorderId='';
          }
        });
        layer.closeAll();
      },
      //关闭导航按钮
      closeOrderBtn:function(){
        var v = this;
        var checkStatus = table.checkStatus('workOrderList');
        if (checkStatus.data.length == 0) {
          this.layerPop('请选择需要关闭的工单')
          return ;
        } else if (checkStatus.data.length > 1) {
          this.layerPop('只能关闭一条工单')
          return ;
        }
        v.closeOrder();
      },
      //关闭工单
      closeOrder: function() {
            layer.open({
                  type: 1,
                  title: '关闭工单',
                  skin: 'crm-model',
                  area: $(window).width() > 1366 ?['40%','45%']:['50%', '50%'],
                  content: $('#closeOrder')
            })

            $('#content').val('');
      }, 
      //关闭工单按钮
      closeBtn:function(){
        var v = this;
        if (!v.workorderId) {
          
          layer.msg('请选择需要关闭的工单', {
            icon: 0,
            shade: 0.2,
            time: 2000

          })
          return;
        }

        var content = $('#content').val();
        var params = {
          remark : content,
          id     : v.workorderId,
        }
        if (content == '') {
          layer.msg('请输入备注', {
            icon: 0,
            shade: 0.2,
            time: 2000
          })
          return;
        }
        $.ajax({
          url: conf.basePath + conf.closeWorkOrder,
          type:'post',
          dataType:'json',
          contentType: 'application/json;charset=UTF-8',
          data: JSON.stringify(params)
        }).done(function(res){
          //登录超时
          if (res.code == -1) {
            window.parent.location.href = "../login.html";
          }
          //成功
          if (res.code == 0) {

            layer.closeAll();

            layer.msg('关闭成功',{
              icon:1,
              shade:0.2,
              time:2000
            })

            table.reload('workOrderList', config);
            v.workorderId='';        
          }
        })
      },
      //导出工单
      exportOrder: function() {

          var v = this;
          v.getSplitTime();
          var token = utilFn.getCookie(conf.cookieName);
          var fileUrl = `${conf.basePath + conf.workOrderListExportExcelFile}?__sid=${token}&${$.param(v.info)}&exportType=1`;
          window.location.href = fileUrl;
        
      },
      //查看备注
      showOrder: function() {
        var checkStatus = table.checkStatus('workOrderList');
        if(checkStatus.data.length != 1){
          layer.msg('请选择一条记录查看!',{
            icon:0,
            shade:0.2,
            time:2000,
          })
          return false;
        }else{
          layer.open({
          type:1,
          title: '查看备注',
          skin: 'crm-model',
          area: ['40%','30%'],
          content:$('#showRemark')
        })
      }
        
      }
    }
  });

  //展示查看详情
  table.on('tool(workOrderList)', function(obj) {
    
    
    var data = obj.data;
    var id = data.id;
    vm.workorderId = id;
    vm.createTime = data.createTime;
    vm.createName = data.createName;
    var layEvent = obj.event;
    
    if (layEvent === 'show') {

          vm.getWorkOrderData(id);
          layer.open({
          type: 1,
          title: '查看工单',
          skin: 'crm-model',
          area: $(window).width() > 1366 ? ['50%', '70%']: ['70%', '60%'],
          content: $('#showWorkOrder'),
        })
      }
      if(layEvent === 'call'){
          window.parent.callout(data.mobilePhone);  
      }
      if (layEvent === 'detail') {
        if(data.customerId){
              if (vm.roles.unAssignBtnCstDetail.authorised) {
                    layer.open({
                      type: 2,
                      title: '客户详情',
                      skin: 'crm-model',
                      area: ['90%', '90%'],
                      maxmin: true,
                      scrollbar: false,
                      content: `${conf.baseProject}/customerDetails/customerDetail.html?customerId=${data.customerId}&from=workOrder&to=${vm.roles.unAssignBtnCstDetail.id}`,

                      })
                  }
        }
      }
            
    
    

  })
  table.on('checkbox(workOrderList)', function (obj) {
    vm.remark = obj.data.remark;
    vm.workorderId = obj.data.id;
    vm.createTime = obj.data.createTime;
    vm.createName = obj.data.createName;
  });
})
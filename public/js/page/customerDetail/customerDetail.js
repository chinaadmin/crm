/**
 * 客户详情js
 */

layui.use(['conf', 'utilFn', 'layer', 'laydate', 'element'], function() {

  var $ = layui.$;
  var layer = window.parent.layer || layui.layer;
  var laydate = layui.laydate;
  var element = layui.element;
  var conf = layui.conf;
  var _ = layui.utilFn;

  //获取客户id及客户详情页id
  var urlParam = _.getQueryString();

  var customerId = urlParam.customerId;
  var fromPage = urlParam.from;
  var pageId = urlParam.to;
  var updateId = urlParam.updateId || '';

  //设置全局请求头
  _.setHeader(conf, $);

  //vue实例化
  var vm = new Vue({
    el: '#content',
    data: {
      target: '', //来源页面
      roles: {}, //权限数据
      userInfo: {}, //用户数据

      /**客户回访相关 start**/
      followResultType: '-1', //客户跟进状态
      followResult: '-1', //客户跟进结果
      nvestmentIntent: '-1', //投资意向
      isGiveUp: '0', //是否放弃，0为不是主动放弃，1为主动放弃
      nextVisitTime: '', //下次回访时间
      followRemark: '', //回访备注
      /**客户回访相关 end**/

      /**客户跟进相关 start**/
      telOptions1: [], //电话分类一级选项
      telOptions2: [], //电话分类二级选项
      telOptions3: [], //电话分类三级选项

      telSelected1: {
        id: '-1',
        name: ''
      }, //一级选定的选项
      telSelected2: {
        id: '-1',
        name: ''
      }, //二级选定的选项
      telSelected3: {
        id: '-1',
        name: ''
      }, //三级选定的选项
      remark: '', //客户跟进备注
      /**客户跟进相关 end**/

    },
    beforeMount: function() {
      this.target = fromPage

      //获取当前页面权限
      this.roles = this.getRole(pageId);

      //获取电话分类默认选项
      this.getTelOptions('-1', 'telOptions1');
    },
    mounted: function() {
      var v = this;

      //日期组件初始化
      laydate.render({
        elem: '#nextVisitTime',
        type: 'datetime',
        zIndex: 99999999,
        done: function(value, date) {
          vm.nextVisitTime = value;
        }
      });

      //获取客户详情数据
      v.getUserInfo(customerId, '0');

      v.$nextTick(function() {

        $('.layui-tab-title>li').eq(0).click();

      })

    },
    watch: {
      //跟进状态选择无效则视为主动放弃
      followResultType: function(val) {
        if (val == 3) {
          this.isGiveUp = '1';
          this.nextVisitTime = '';

          $('#nextVisitTime').val('');
        } else {
          this.isGiveUp = '0';
        }

        this.followResult = '-1';
      },
      //根据电话一级分类获取二级选项数据
      telSelected1: function(val) {
        //未选择则清空二级选项数据
        if (val.id == '-1') {
          this.telOptions2 = [];
        } else {
          this.getTelOptions(val.id, 'telOptions2');
          this.telSelectedName1 = val.name;
        }
        this.telSelected2 = {
          id: '-1',
          name: ''
        };
      },
      //根据电话二级分类获取三级选项数据
      telSelected2: function(val) {
        //未选择则清空三级选项数据
        if (val.id == '-1') {
          this.telOptions3 = [];
        } else {
          this.getTelOptions(val.id, 'telOptions3');
        }
        this.telSelected3 = {
          id: '-1',
          name: ''
        };
      }
    },
    computed: {
      customerStatus: function() {
        var stateObj = {
          '10': '未实名',
          '20': '已实名未投资',
          '30': '已投资'
        }

        return stateObj[this.userInfo.cusStatus];
      },
      crmInfo: function() {
        
        if (this.userInfo.isIntoCrm !== '0') {
          return this.userInfo.userName != '' && this.userInfo.userName != null ? '(电销客户:' + this.userInfo.userName + ')' : '(电销客户:无)';
        } else {
          return '(非电销客户)';
        }

      },
      male: function() {
        if (this.userInfo.gender) {
          return this.userInfo.gender == 10 ? '男' : '女';
        } else {
          return '';
        }
      }
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

          //登录超时
          if (res.code == -1) {
            window.parent.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            data = res.data;
          }
        })

        return data;
      },
      //获取用户信息
      getUserInfo: function(customerId, isRefresh) {
        var v = this;

        $.post(conf.basePath + conf.selectCustomerBasic, {
          customerId: customerId,
          isRefresh: isRefresh
        }).done(function(res) {

          //登录超时
          if (res.code == -1) {
            window.parent.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            v.userInfo = res.data;

            v.$nextTick(function() {
              $('#content').removeClass('hide');
              //tab组件初始化
              element.init();
            });
          }

        })
      },
      //刷新用户数据信息
      refreshUserInfo: function() {
        var v = this;

        layer.confirm('用户数据异常才可刷新,是否刷新?', {
          icon: 3,
          title: '提示',
          skin: 'crm-model'
        }, function(index) {
          v.getUserInfo(customerId, '1');

          layer.close(index);
        });
      },
      //外呼
      callout: function(tel) {
        window.parent.parent.callout(tel);
      },
      //转拨
      transferFn: function() {
        layer.prompt({
          title: '转拨',
          area: ['400px', '300px']
        }, function(value, index) {
          layer.close(index);

          window.parent.parent.transfer(value);
        })
      },
      //保存电销跟进
      saveReturnVisitRecord: function() {
        var v = this;

        //未选择回访结果则弹出提示
        if (v.followResult == '-1') {
          layer.msg('请选择回访结果', {
            icon: 2,
            shade: 0.1,
            time: 1000
          });
          return;
        }

        var param = {
          remark: v.followRemark, //回访备注
          customerId: customerId, //客户id
          result: v.followResult, //跟进结果状态
          nextVisitTime: v.nextVisitTime, //下次回访时间
          investIntention: v.nvestmentIntent, //投资意向  
          isGiveUp: v.isGiveUp, //是否放弃
          realName: v.userInfo.realName, //客户姓名
          type: '1',
          updateId: updateId
        }

        if (fromPage == 'withdraw') param.type = '3';
        if (fromPage == 'recharge') param.type = '2';
        if (fromPage == 'unanswer') param.type = '4';

        $.ajax({
          url: conf.basePath + conf.saveReturnVisitRecord,
          type: 'post',
          data: JSON.stringify(param),
          contentType: "application/json; charset=utf-8",
          dataType: 'json'
        }).done(function(res) {
          //登录超时
          if (res.code == -1) {
            window.parent.parent.location.href = '../login.html';
          }

          var msg = '';

          if (res.code == 0) {
            //提示消息
            msg = res.code == 0 ? '保存成功' : '保存失败,请稍后再试';

            //清空数据
            v.followRemark = '';
            v.followResult = '-1';
            v.nextVisitTime = '';
            v.nvestmentIntent = '-1';
            v.isGiveUp = '0';
            $('#nextVisitTime').val('');

            //tab刷新
            document.getElementById('callRecord').contentWindow.location.reload();
          } else {
            msg = res.msg;
          }

          layer.msg(msg, {
            icon: msg == '保存成功' ? 1 : 2,
            shade: 0.1,
            time: 1000
          });

        })

      },
      //获取电话分类选项
      getTelOptions: function(parentId, treeName) {
        var v = this;

        $.post(conf.basePath + conf.selectTelephoneClassification, {
          parentId: parentId
        }).done(function(res) {
          //登录超时
          if (res.code == -1) {
            window.parent.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            v[treeName] = res.data;
          }
        })
      },
      //保存客服跟进
      saveCustomerReturn: function() {
        var v = this;

        //未选择电话分类则弹出提示
        if (v.telSelected1.id == '-1') {
          layer.msg('请选择电话分类', {
            icon: 2,
            shade: 0.1,
            time: 1000
          });
          return;
        }

        var serviceType = _.compact([v.telSelected1.name, v.telSelected2.name, v.telSelected3.name]).join('-');
        var serviceTypeIdArr = [v.telSelected1.id, v.telSelected2.id, v.telSelected3.id].map(function(el) {
          return el = el == '-1' ? '' : el;
        })


        var param = {
          serviceType: serviceType, //回访备注
          remark: v.remark, //回访备注
          customerId: customerId, //客户id
          mobile: v.userInfo.mobilePhone, //客户手机号码
          type: '1',
          serviceTypeId: serviceTypeIdArr.join(','), //服务id
          updateId: updateId
        }

        if (fromPage == 'withdraw') param.type = '3';
        if (fromPage == 'recharge') param.type = '2';
        if (fromPage == 'unanswer') param.type = '4';


        $.ajax({
          url: conf.basePath + conf.saveCustomerReturn,
          type: 'post',
          data: JSON.stringify(param),
          contentType: "application/json; charset=utf-8",
          dataType: 'json'
        }).done(function(res) {
          //登录超时
          if (res.code == -1) {
            window.parent.parent.location.href = '../login.html';
          }

          var msg = '';
          if (res.code == 0) {
            //提示消息
            msg = res.code == 0 ? '保存成功' : '保存失败,请稍后再试';

            //清空数据
            v.remark = '';
            v.telSelected1 = {
              id: '-1',
              name: ''
            };
            v.telSelected2 = {
              id: '-1',
              name: ''
            };
            v.telSelected3 = {
              id: '-1',
              name: ''
            };

            //刷新父页面数据表格
            if (window.parent.searchData) window.parent.searchData();

            //tab刷新
            document.getElementById('followerRecord').contentWindow.location.reload();
          } else {
            msg = res.msg;
          }

          layer.msg(msg, {
            icon: msg == '保存成功' ? 1 : 2,
            shade: 0.1,
            time: 1000
          });

        })

      }
    }
  })


  element.on('tab(tab)', function(data) {

    var iframeUrl = $(this).attr('data-src') + customerId + '&target=' + vm.target;

    var $iframe = $('.layui-tab-content>div').eq(data.index).find('iframe');

    if (!$iframe.attr('src')) {
      $iframe.attr('src', iframeUrl);
    }
  });

});
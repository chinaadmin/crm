var vm; //vm实例
var layerIndex; //layer弹窗index，用来关闭

//统一设置请求头
_.setHeader();

//vue 定义
$(function() {

  vm = new Vue({
    el: '#wrapper',
    data: {
      showRemind: false, //展示预约提醒下拉列表
      //天润工具条相关--start
      toolbarIsLogin: false, //工具条是否登录
      hotLine: '', //热线号码
      cno: '', //坐席号
      pwd: '', //座席密码
      bindTel: '', //绑定电话
      bindType: 1, //1：手机或固话，2：分机
      initStatus: 'online', //座席初始状态 online：置闲，pause：置忙
      //天润工具条相关--end

      //权限--start
      permissions: {},
      //权限--end
      activeMenuUrl: '', //默认展示页的url
      activeMenuName: '', //默认展示页的名称
      //当前用户信息
      userInfo: {
        "loginName": "",
        "realName": "",
        "roleName": ""
      },
      menuList: [], //导航菜单列表

      showRmindList: false, //显示提醒列表
      remindList: [], //提醒列表
      remindCount: 0, //提醒总数

      //业绩轮播列表相关
      lastTime: '', //第一次请求可以不传，第二次请求以上传接口返回的值
      marqueevalue: '',
    },
    beforeMount: function() {
      var v = this;

      //获取用户信息
      $.get(conf.basePath + conf.queryUserInfo).done(function(res) {

        if (res.code == 0) {

          v.hotLine = res.data.hotLine;
          v.cno = res.data.seatNo;
          v.userInfo.loginName = res.data.loginName;
          v.userInfo.realName = res.data.realName;
          v.userInfo.roleName = res.data.roleName;

        } else if (res.code == -1) {
          //登录超时
          window.location.href = 'login.html';
        } else {
          layer.msg(res.msg, {
            icon: 2,
            shade: 0.1,
            time: 1000
          });
        }

      })

      //获取导航菜单
      $.ajax({
        url: conf.basePath + conf.getUserMenu,
        type: 'get',
        async: false
      }).done(function(res) {

        //响应码 0:成功,-1:登录超时,-2:没有权限,其他则响应对应错误码

        if (res.code == 0) {
          v.menuList = res.data;
          v.permissions = res.permissions;

          v.activeMenuUrl = v.menuList[0].children[0].href + '?id=' + v.menuList[0].children[0].id;
          v.activeMenuName = v.menuList[0].children[0].name;
        } else if (res.code == -1) {
          //登录超时
          window.location.href = 'login.html';
        } else {
          layer.msg(res.msg, {
            icon: 2,
            shade: 0.1,
            time: 1000
          });
        }

      })

      //获取提醒数据
      v.getRemindList();

      //获取未读预约提醒数量
      v.getAppointmentNum();

      //获取业绩轮播
      v.getRoastingList();
    },
    mounted: function() {
      var v = this;

      //dom更新则显示导航菜单
      $('#side-menu').removeClass('hide');

      //加载完dom开启定时任务
      var t = 1000 * 60 * 5;

      setTimeout(function() {
        v.getRemindList();
        v.getAppointmentNum();
        v.getRoastingList();

        setTimeout(arguments.callee, t);
      }, 0);
    },
    methods: {
      //获取提醒数据
      getRemindList: function() {
        _.setHeader();

        var v = this;

        $.post(conf.basePath + conf.selectTodothingsMenu).done(function(res) {

          //登录超时
          if (res.code == -1) {
            window.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            v.remindCount = 0;

            for (var i = 0; i < res.data.length; i++) {
              v.remindCount += res.data[i].count;
            }

            v.remindList = res.data;
          }

        })
      },
      //获取未读预约提醒数量
      getAppointmentNum: function() {
        _.setHeader();

        var param = {
          startDate: _.getDateTime('begin'),
          endDate: _.getDateTime('end'),
          phone: '',
          teamIds: [],
          adminIds: [],
          status: '1',
          isData: ''
        }

        $.ajax({
          url: conf.basePath + conf.selectReservationRemindingData,
          type: 'post',
          contentType: "application/json; charset=utf-8",
          dataType: 'json',
          data: JSON.stringify(param)
        }).done(function(res) {
          //登录超时
          if (res.code == -1) {
            window.parent.location.href = '../login.html';
          }

          if (res.code == 0 && res.count > 0) {
            layer.closeAll();

            //弹屏显示预约数据表格
            layer.open({
              type: 2,
              title: '预约提醒',
              skin: 'crm-model',
              maxmin: true,
              area: ['70%', '78%'],
              content: `${conf.baseProject}/remind/remindView.html`
            });
          }
        })

      },
      //获取业绩轮播数据
      getRoastingList: function() {
        var v = this;

        var param = {
          lastTime: v.lastTime
        }

        $.post(conf.basePath + conf.getRoastingData, param).done(function(res) {
          //登录超时
          if (res.code == -1) {
            window.parent.location.href = '../login.html';
          }

          if (res.code == 0) {
            v.lastTime = res.data.lastTime;

            if (res.data.hasData) {
              v.marqueevalue = '';
              var marqueeList = res.data.roastingList;

              for (var i = 0; i < marqueeList.length; i++) {
                var marq = marqueeList[i];
                var bizType = marq.bizType;
                var typeName = "新增或转化";
                var amount = marq.amount;
                var viewAmount = amount;
                if (amount >= 10000) {
                  viewAmount = Math.floor((amount / 10000) * 10) / 10 + "万";
                }
                v.marqueevalue += marq.salesName + typeName + viewAmount + "元；";
              }

              $("#rechargeMarquee").html(v.marqueevalue);
            }

          }
        })
      },
      showRemindList: function() {
        this.showRemind = !this.showRemind;
        this.getRemindList();
      },
      //导航菜单切换
      toggleMenu: function(e) {
        tagName = e.target.tagName.toLowerCase();

        var $node = tagName === 'a' ? $(e.target) : $(e.target).parent('a');
        var flag = $node.parent('li').hasClass('active');

        if (!$('body').hasClass('mini-navbar')) {
          if (flag) {
            $node.parent('li').removeClass('active');
            $node.next('ul').slideUp('slow');
          } else {
            $node.parent('li').addClass('active');
            $node.next('ul').slideDown('slow');
            $node.parent('li').siblings().removeClass('active');
            $node.parent('li').siblings().find('ul').slideUp('slow');
          }
        } else {
          $("body").removeClass("mini-navbar");
          $('.tr-tool>.navbar-minimalize').removeClass('fa-angle-right').addClass('fa-angle-left');

          $node.parents('li').addClass('active');
          $node.parents('li').siblings().removeClass('active');
          $node.parents('li').find('ul').show();
        }

      },
      //切换显示天润登录框
      openToolbarLoginBox: function() {
        var flag = $('.tr-login-box').hasClass('hide');

        if (flag) {
          $('.tr-login-box').removeClass('hide bounceOutUp').addClass('bounceInDown');
        } else {
          $('.tr-login-box').addClass('bounceOutUp');
          setTimeout(function() {
            $('.tr-login-box').addClass('hide');
          }, 300);
        }
      },
      //隐藏天润工具条登录框
      hideToolbarLoginBox: function() {
        $('.tr-login-box').addClass('bounceOutUp');
        setTimeout(function() {
          $('.tr-login-box').addClass('hide');
        }, 300);
      },
      //天润工具条登录
      toolbarLogin: function() {

        var param = {};

        param.hotLine = this.hotLine;
        param.cno = this.cno;
        param.pwd = this.pwd;
        param.bindTel = this.bindTel;
        param.bindType = this.bindType;
        param.initStatus = this.initStatus;


        if (!this.toolbarIsLogin) {

          layerIndex = layer.msg('正在登录中，请稍候', {
            icon: 16,
            shade: 0.1
          });

          executeAction('doLogin', param);

        } else {

          layer.msg('已登录！', {
            icon: 2,
            shade: 0.1,
            time: 1000
          });

        }

      },
      //天润工具条退出
      toolbarLoginOut: function() {

        var param = {};

        param.type = 1;

        if (this.toolbarIsLogin) {
          executeAction('doLogout', param);
        } else {
          layer.msg('请先登录！', {
            icon: 2,
            shade: 0.1,
            time: 1000
          });
        }

      },
      //天润工具条登录或失败回调提示
      loginTip: function(type, token) {
        //type 1.登录,2.退出

        var msg = type === 1 ? '登录' : '退出';

        if (token.code == 0) {

          layer.msg(msg + '成功', {
            icon: 1,
            shade: 0.1,
            time: 1000
          });

          vm.toolbarIsLogin = type === 1 ? true : false;

          layer.close(layerIndex);

          vm.hideToolbarLoginBox();

        } else {

          layer.msg(token.msg, {
            icon: 2,
            shade: 0.1,
            time: 1000
          });

        }

      },
      //坐席置忙
      toolbarPause: function() {

        var param = {};

        param.description = '坐席置忙';

        executeAction('doPause', param);

        this.initStatus = 'pause';

      },
      //坐席置闲
      toolbarUnPause: function() {

        executeAction('doUnpause');

        this.initStatus = 'online';
      },
      //置忙置闲提示
      pauseTip: function(type, token) {

        var msg = type === 1 ? '置忙' : '置闲';

        if (token.code == 0) {
          layer.msg('坐席' + msg + '成功！', {
            icon: 1,
            shade: 0.1,
            time: 1000
          });
        } else {
          layer.msg(token.msg, {
            icon: 2,
            shade: 0.1,
            time: 1000
          });
        }
      },
      //取消外呼
      stopCall: function() {
        stopCallout();
      },
      //通话挂断
      hangUpCall: function() {
        hangUp();
      },
      //修改密码
      changePwd: function() {
        layer.open({
          skin: 'crm-model',
          title: '修改密码',
          content: $('#changeForm').html(),
          btnAlign: 'c',
          btn: ['保存', '取消'],
          yes: function(index, layero) {
            var newPwd = layero.find('.newPwd').val();
            var newPwd2 = layero.find('.newPwd2').val();

            if (newPwd === '' || newPwd2 === '') {
              layero.find('.alert').removeClass('hide').text('请输入正确的密码');
              return;
            }

            if (newPwd != newPwd2) {
              layero.find('.alert').removeClass('hide').text('两次输入不一致');
              return;
            }

            var param = {
              newPwd: md5(newPwd),
              configPwd: md5(newPwd2)
            }

            //设置请求头
            _.setHeader();

            $.ajax({
              url: conf.basePath + conf.updatePassword,
              type: 'post',
              data: param,
              async: false
            }).done(function(res) {
              if (res.code == 0) {
                layero.find('.alert').addClass('alert-success').removeClass('alert-danger hide').text('密码修改成功');

                setTimeout(function() {
                  layer.close(index);
                }, 1000);
              } else {
                layero.find('.alert').removeClass('hide').text('修改失败,请稍后再试');
                return;
              }
            })

          }
        })
      },
      //退出登录
      loginout: function() {
        $.post(conf.basePath + conf.loginout).done(function(res) {
          _.clearCookie(conf.cookieName);
          window.location.href = 'login.html';
        })
      }
    }
  })

})



//天润工具条登录完成回调
function cbLogin(token) {
  // console.log(token);

  vm.loginTip(1, token);
}

//天润工具条退出回调
function cbLogout(token) {
  //console.log(token);

  vm.loginTip(2, token);
}

//坐席置忙回调
function cbPause(token) {
  // console.log(token);

  vm.pauseTip(1, token);
}

//坐席置闲回调
function cbUnpause(token) {
  // console.log(token);

  vm.pauseTip(2, token);
}

//外呼
function callout(tel) {

  if (!vm.toolbarIsLogin) {
    layer.msg('请先登录！', {
      icon: 2,
      shade: 0.1,
      time: 1000
    });
  }

  var param = {};
  param.tel = tel;
  param.callType = '3'; //3点击外呼
  executeAction("doPreviewOutCall", param);
}

//外呼完成回调
function cbPreviewOutCall(token) {
  // if (token.code == 0) {
  //   layer.msg('正在外呼', { time: 1000 });
  // } else {
  //   layer.msg(token.msg, { time: 1000 });
  // }
}

//取消外呼
function stopCallout() {
  executeAction('doPreviewOutcallCancel');
}

//取消外呼完成回调
function cbPreviewOutCallCancel(token) {
  if (token.code == 0) {
    layer.alert('外呼取消成功', {
      time: 1000,
      shade: 0,
      offset: 'rb'
    });
  } else {
    layer.alert(token.msg, {
      time: 1000,
      shade: 0,
      offset: 'rb'
    });
  }
}

//通话挂断
function hangUp() {
  executeAction('doUnLink');
}

//通话挂断完成回调
function cbUnLink(token) {
  if (token.code == 0) {
    layer.alert('挂断成功', {
      time: 1000,
      shade: 0,
      offset: 'rb'
    });
  } else {
    layer.alert(token.msg, {
      time: 1000,
      shade: 0,
      offset: 'rb'
    });
  }
}

//通话转移
function transfer(tel) {

  if (!vm.toolbarIsLogin) {
    layer.msg('请先登录！', {
      icon: 2,
      shade: 0.1,
      time: 1000
    });
  }

  var param = {
    transferObject: tel, //转移目标号码
    objectType: '0',
  }

  executeAction('doTransfer', param);
}

//通话转移完成回调
function cbTransfer(token) {

  if (token.code == 0) {
    layer.alert('通话转移成功', {
      time: 1000,
      shade: 0,
      offset: 'rb'
    });
  } else {
    layer.alert(token.msg, {
      time: 1000,
      shade: 0,
      offset: 'rb'
    });
  }
}

//座席状态监听

var isPopUpInfo = false; //是否弹屏
var cstId = ""; //客户id

function cbThisStatus(token) {

  /**
   * 工具条相应数据eventName详细属性:
   * online:空闲状态,pause:置忙状态,stateRinging:响铃状态,comeRinging:呼入响铃状态
   * normalBusy:进入正常通话状态,addBusy:直接进入通话状态,outRinging:外呼响铃状态
   **/

  //呼入响铃
  if (token.eventName == "comeRinging" && token.name == "ringing") {

    isPopUpInfo = false; //是否弹屏
    cstId = ""; //客户id

    var tipMsg = token.customerNumber + "客户呼入";
    var param = {
      "phone": token.customerNumber
    };

    //测试响铃弹屏
    // tip(tipMsg);

    //查询客户信息
    $.post(conf.basePath + conf.queryComeRingInfo, param, function(res) {

      if (res.code == 0) {

        var data = res.data;

        if (data.accountType == 1) { //电销
          if (data.izCustomer && data.izIntoCrm) {
            tipMsg = token.customerNumber + "客户属于电销员" + data.userName;
          } else {
            tipMsg = token.customerNumber + "非电销客户";
          }
          if (data.izOwnCust) {
            isPopUpInfo = true;
          }
        } else { //客服
          if (data.izCustomer) {
            isPopUpInfo = true;
          }
        }

        if (data.customerId != '') {
          cstId = data.customerId;
        }
      }

      tip(tipMsg);
    });
  }

  //正常通话
  if (token.eventName == "normalBusy" && token.name == "status") {
    if (isPopUpInfo) {
      tip("来电号码：" + token.customerNumber + "已接听");

      //弹屏显示客户详情
      layer.open({
        type: 2,
        title: '客户详情',
        skin: 'crm-model',
        maxmin: true,
        area: ['90%', '90%'],
        content: `${conf.baseProject}/customerDetails/customerDetail.html?customerId=${cstId}&from=index&to=${vm.permissions.unAssignBtnCstDetail.id}`
      });

    } else {
      tip("来电号码：" + token.customerNumber);
    }
    cstId = "";
  }

  //咨询接听
  if (token.eventName == "consultLink" && token.name == "consultLink") {
    tip("咨询号码" + token.consultObject + "已接听");
  }

  //咨询失败
  if (token.eventName == "normalBusy" && token.name == "consultError") {
    tip("咨询失败");
  }

  //客户挂断，整理开始：呼入、空闲时外呼
  if (token.eventName == "neatenStart") {
    tip("已挂机，开始整理");
  }

  //客户挂断，整理结束：呼入、空闲时外呼
  if (token.eventName == "neatenEnd") {
    tip("整理结束");
  }

  //外呼时座席响铃:3、点击外呼
  if (token.eventName == "outRinging" && token.name == "ringing" && token.callType == "3") {
    tip("外呼号码：" + token.customerNumber);
  }

  //座席接听后外呼客户:3、点击外呼
  if (token.eventName == "waitLink" && token.callType == "3") {
    tip("座席接听，开始呼叫客户");
  }

  //外呼客户:3、点击外呼
  if (token.eventName == "outBusy" && token.name == "previewOutcallBridge" && token.callType == "3") {
    tip("外呼号码：" + token.customerNumber + "已接听");
  }

  //空闲时外呼，客户无应答，座席挂机
  if (token.eventName == "onlineUnlink") {
    tip("已挂机");
  }

  //置忙时外呼，客户挂断或无应答，座席挂机
  if (token.eventName == "pauseUnlink") {
    tip("已挂机");
  }

  //通话被转移
  if (token.eventName == "consulterOrTransferBusy") {
    tip('已转移')
  }

}

//座席状态监听消息提示
function tip(msg, times) {

  layer.alert(msg, {
    title: '提示信息',
    offset: 'rb',
    shade: 0,
    time: 2000
  });

}

//显示客户详情
function openCustomerDetail(cstId, fromPage) {

  if (vm.permissions.unAssignBtnCstDetail.authorised) {
    layer.open({
      type: 2,
      title: '客户详情',
      skin: 'crm-model',
      maxmin: true,
      area: ['90%', '90%'],
      content: `${conf.baseProject}/customerDetails/customerDetail.html?customerId=${cstId}&from=${fromPage}&to=${vm.permissions.unAssignBtnCstDetail.id}`
    });
  }

}
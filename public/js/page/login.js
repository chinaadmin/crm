/**
 * 登录页js
 */

$(function() {

  //定义画布宽高和生成点的个数
  var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight,
    POINT = 35;

  var canvas = document.getElementById('BGcanvas');
  canvas.width = WIDTH,
    canvas.height = HEIGHT;

  var context = canvas.getContext('2d');
  context.strokeStyle = '#c1c1c1',
    context.strokeWidth = 1,
    context.fillStyle = '#fff';

  var circleArr = [];

  //线条：开始xy坐标，结束xy坐标，线条透明度
  function Line(x, y, _x, _y, o) {
    this.beginX = x,
      this.beginY = y,
      this.closeX = _x,
      this.closeY = _y,
      this.o = o;
  }

  //点：圆心xy坐标，半径，每帧移动xy的距离
  function Circle(x, y, r, moveX, moveY) {
    this.x = x,
      this.y = y,
      this.r = r,
      this.moveX = moveX,
      this.moveY = moveY;
  }

  //生成max和min之间的随机数
  function num(max, _min) {
    var min = arguments[1] || 0;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // 绘制原点
  function drawCricle(cxt, x, y, r, moveX, moveY) {
    var circle = new Circle(x, y, r, moveX, moveY)
    cxt.beginPath()
    cxt.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI)
    cxt.closePath()
    cxt.fill();
    return circle;
  }


  //初始化生成原点
  function init() {
    circleArr = [];
    for (var i = 0; i < POINT; i++) {
      circleArr.push(drawCricle(context, num(WIDTH), num(HEIGHT), num(15, 2), num(10, -10) / 40, num(10, -10) / 40));
    }
    draw();
  }

  //每帧绘制
  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < POINT; i++) {
      drawCricle(context, circleArr[i].x, circleArr[i].y, circleArr[i].r);
    }
    for (var i = 0; i < POINT; i++) {
      for (var j = 0; j < POINT; j++) {
        if (i + j < POINT) {
          var A = Math.abs(circleArr[i + j].x - circleArr[i].x),
            B = Math.abs(circleArr[i + j].y - circleArr[i].y);
          var lineLength = Math.sqrt(A * A + B * B);
          var C = 1 / lineLength * 7 - 0.009;
          var lineOpacity = C > 0.03 ? 0.03 : C;
        }
      }
    }
  }


  //运动绘制
  function run() {
    for (var i = 0; i < POINT; i++) {
      var cir = circleArr[i];
      cir.x += cir.moveX;
      cir.y += cir.moveY;
      if (cir.x > WIDTH) cir.x = 0;
      else if (cir.x < 0) cir.x = WIDTH;
      if (cir.y > HEIGHT) cir.y = 0;
      else if (cir.y < 0) cir.y = HEIGHT;

    }
    draw();
  }

  var vm = new Vue({
    el: '#login',
    data: {
      userName: _.getCookie('loginName'), //账号
      passWord: '', //密码
      rememberme: true, //记住用户名
      imgCode: '', //验证码
      imgCodeUrl: conf.basePath + conf.imgCodeUrl, //验证码图片地址
      infoTxt: '' //提示消息
    },
    mounted: function() {

      //canvas初始化
      init();

      //设置运行
      setInterval(function() {
        run();
      }, 10);

      $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
      });

      //验证插件初始化
      var config = $.validator.config;

      config.errorPlacement = function(error, element) {
        //自定义错误信息放置位置
        //element.parent('div').append(error);
      }

      $("#loginForm").validate(config);
    },
    methods: {
      //刷新验证码
      refresh: function() {
        this.imgCodeUrl = conf.basePath + conf.imgCodeUrl + '?date=' + new Date().getTime();
      },
      //登录
      login: function() {

        //表单校验
        var flag = $("#loginForm").valid();

        if (flag) {

          var v = this;

          var param = {
            username: v.userName,
            password: md5(md5(md5(v.passWord) + v.userName)),
            validateCode: v.imgCode
          }

          v.rememberme = $('#rememberme').is(':checked');

          $.post(conf.basePath + conf.login, param).done(function(res) {

            //登录成功
            if (res.code == 0) {

              var token = res.data[conf.cookieName];

              _.clearCookie(conf.cookieName);
              _.setCookie(conf.cookieName, token, 24 * 60 * 60);

              //记住账号
              if (v.rememberme) {
                _.setCookie('loginName', param.username, 24 * 60 * 60);
              } else {
                _.clearCookie('loginName');
              }

              window.location.href = 'index.html';

            } else {
              v.infoTxt = res.msg;
            }

          }).fail(function() {
            v.infoTxt = '登录失败，请稍后再试';
          })

        }

      }
    }
  })

})
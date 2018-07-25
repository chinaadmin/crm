/**
 * 公用基础方法
 */

(function(win) {

  /**
   * 去除数组中的假值元素(null,undefined,'')
   *
   * var a =[1,null,3,undefined,5,'',[]]
   * compact(a) => [1,3,5]
   *
   */
  var compact = function(arr) {
    var outArr = [];
    for (var v in arr) {
      if (arr[v] && arr[v].length != 0) outArr.push(arr[v]);
    }
    return outArr;
  };

  /**
   * 金额格式化
   * 
   * @param {number} money  需要格式化的数字
   * @param {number} n      需要保留的小数位
   */
  var moneyFormat = function(money, n) {

    n = n > 0 && n <= 20 ? n : 2;
    money = parseFloat((money + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";

    var l = money.split(".")[0].split("").reverse();
    var r = money.split(".")[1];
    var t = "";

    for (var i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }

    return t.split("").reverse().join("") + "." + r;

  };


  /**
   * 格式化的金额还原
   * 
   * @param {string} money  需要还原的金额字符串 
   */
  var moneyRest = function(money) {
    return parseFloat(money.replace(/[^\d\.-]/g, ""));
  };


  /**
   * 获取url参数
   * 'http://www.baidu.com?leo'
   * getQueryString() => 'leo'
   *
   * 'http://www.baidu.com?name=leo&age=25'
   * getQueryString() => {'name':'leo','age':'25'}
   */
  var getQueryString = function() {
    var reg_url = decodeURI(window.location.search);
    var reg_arr = [];
    var url_obj = {};

    if (!reg_url) return

    if (reg_url.indexOf('&') !== -1 || reg_url.indexOf('=') !== -1) {
      reg_arr = reg_url.substr(1).split('&');
      for (var v in reg_arr) {
        var key = reg_arr[v].split('=')[0],
          value = reg_arr[v].split('=')[1];

        url_obj[key] = value;
      }
      return url_obj;
    } else {

      return reg_url.substr(1);

    }
  };


  /**
   * 获取日期
   * 
   * @param {string} sper  分隔符,默认返回-年-月-日格式
   */
  var getDate = function(sper) {

    sper = sper || 'CN';

    var date = new Date();
    var year = date.getFullYear();
    var m = date.getMonth() + 1;
    var month = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    var day = d < 10 ? ('0' + d) : d;

    if (sper === 'CN') {
      return year + '年' + month + '月' + day + '日';
    } else {
      return year + sper + month + sper + day;
    }

  };


  /**
   * 获取时间
   * 
   * @param {string} sper  分隔符,默认返回-时-分-秒格式 
   */
  var getTime = function(sper) {

    sper = sper || 'CN';

    var time = new Date();
    var h = time.getHours();
    var hours = h < 10 ? ('0' + h) : h;
    var m = time.getMinutes();
    var minutes = m < 10 ? ('0' + m) : m;
    var s = time.getSeconds();
    var seconds = s < 10 ? ('0' + s) : s;

    if (sper === 'CN') {
      return hours + '时' + minutes + '分' + seconds + '秒';
    } else {
      return hours + sper + minutes + sper + seconds;
    }

  };

  /**
   * 获取日期时间
   * @param {string} time  时间段 isNow:当前时间,begin:00:00:00,end:23:59:59  
   */
  var getDateTime = function(time) {

    if (time === 'isNow') return getDate('-') + ' ' + getTime(':');

    if (time === 'begin') return getDate('-') + ' ' + '00:00:00';

    if (time === 'end') return getDate('-') + ' ' + '23:59:59';
  }


  /**
   * 来获得一个当前时间的整数时间戳
   */
  var now = function() {

    var date = getDate('-').toString();
    var times = getTime(':').toString();

    return (date.replace(/-/g, '') + times.replace(/:/g, ''));

  };


  /**
   * 定时执行方法
   * 
   * @param {function} callback  执行方法
   * @param {number} time  执行间隔时间
   * @param {number} endTime  结束时间[为空将一直执行]
   * @param {function} endCallback  结束后的执行方法
   */
  var schedule = function(callback, time, endTime, endCallback) {

    if (time && callback) {

      if (endTime) {
        var t = setInterval(function() {
          callback();
        }, time);

        setTimeout(function() {
          clearInterval(t);
          if (endCallback) endCallback();
        }, time + endTime);

      } else {
        setInterval(callback, time);
      }

    }

  };


  /**
   * 设置cookie
   * 
   * @param {string} name   cookie名称
   * @param {string} value  cookie值
   * @param {number} time   cookie过期时间,单位秒
   */
  var setCookie = function(name, value, time) {
    var d = new Date();
    var expires;

    d.setTime(d.getTime() + (time * 1000));
    expires = "expires=" + d.toUTCString();

    window.document.cookie = name + "=" + value + "; " + expires;
  };


  /**
   * 根据name获取cookie值，若无则返回空
   * 
   * @param {string} cname  cookie名称
   */
  var getCookie = function(cname) {
    var name = cname + "=";
    var ca = window.document.cookie.split(';');

    for (var i = 0; i < ca.length; i++) {
      var c = ca[i].trim();
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }

    return "";
  };


  /**
   * 根据名称删除cookie
   * @param {string} name  需要删除的cookie名称 
   */
  var clearCookie = function(name) {
    setCookie(name, "", -1);
  };


  /**
   * 计算过去时间到指定时间已经历多少年和天
   * @param {*} hisTime 
   * @param {*} nowTime 
   */
  var dateDiff = function(hisTime, nowTime) {

    if (!hisTime) return '';

    var now = nowTime !== undefined && nowTime !== '' ? nowTime.getTime() : new Date().getTime(),
      diffValue = now - hisTime.getTime(),
      result = '',
      minute = 1000 * 60,
      hour = minute * 60,
      day = hour * 24,
      halfamonth = day * 15,
      month = day * 30,
      year = month * 12;

    var _year = diffValue / year,
      _day = (diffValue / day) - (parseInt(_year) * 365);

    if (_year >= 1) result += parseInt(_year) + "年";
    if (_day >= 1) result += parseInt(_day) + "天";

    return result;
  };

  /**
   * 设置公用请求头
   * @param {*} config 项目配置文件
   * @param {*} $ jq 
   */
  var setHeader = function(config, jq) {
    var $ = jq || window.$;
    var conf = config || window.conf;

    if ($ && conf) {
      var headers = {};

      headers[conf.cookieName] = getCookie(conf.cookieName)

      $.ajaxSetup({
        headers: headers
      })
    }
  }



  var utilFn = {};

  utilFn.compact = compact;
  utilFn.moneyFormat = moneyFormat;
  utilFn.moneyRest = moneyRest;
  utilFn.getQueryString = getQueryString;
  utilFn.getDate = getDate;
  utilFn.getTime = getTime;
  utilFn.getDateTime = getDateTime;
  utilFn.now = now;
  utilFn.schedule = schedule;
  utilFn.setCookie = setCookie;
  utilFn.getCookie = getCookie;
  utilFn.clearCookie = clearCookie;
  utilFn.dateDiff = dateDiff;
  utilFn.setHeader = setHeader;


  if (win.layui) {

    layui.define(function(exports) {

      exports('utilFn', utilFn);
    });

  } else {

    win._ = utilFn;

  }

})(window)
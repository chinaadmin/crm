/**
 * jquery.validate 常用规则配置
 */

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery", "jquery.validate"], factory);
  } else {
    factory(jQuery);
  }
}(function($) {

  $.validator.config = {
    debug: true, //验证完成不做提交操作
    //失去焦点验证
    onfocusout: function(element) {
      $(element).valid();
    },
    errorPlacement: function(error, element) {
      //自定义错误信息放置位置
      error.appendTo(element.parents('p').next('p').find('span'));
    },
    rules: {
      userName: {
        required: true
      },
      phone: {
        required: true,
        number: true,
        isMobile: true
      },
      passWord: {
        required: true,
        rangelength: [5, 20]
      },
      imgCode: {
        required: true,
        maxlength: 4,
        minlength: 4
      },
      IDcard: {
        required: true,
        isIDcard: true
      }
    },
    messages: {
      userName: {
        required: '账号不能为空'
      },
      phone: { required: '手机号不能为空' },
      passWord: {
        required: '密码不能为空',
        rangelength: '登录密码须为5-20位字母、数字的组合'
      },
      imgCode: {
        required: '请输入验证码',
        maxlength: '请输入正确的验证码',
        minlength: '请输入正确的验证码'
      },
      IDcard: { required: '身份证不能为空' }
    }
  }

}));
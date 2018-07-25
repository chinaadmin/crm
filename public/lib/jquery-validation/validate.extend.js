(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery", "jquery.validate"], factory);
  } else {
    factory(jQuery);
  }
}(function($) {

  /*
   * Translated default messages for the jQuery validation plugin.
   * Locale: ZH (Chinese, 中文 (Zhōngwén), 汉语, 漢語)
   */
  $.extend($.validator.messages, {
    required: "请输入正确的信息",
    remote: "请修正此字段",
    email: "请输入有效的电子邮件地址",
    url: "请输入有效的网址",
    date: "请输入有效的日期",
    dateISO: "请输入有效的日期 (YYYY-MM-DD)",
    number: "请输入有效的数字",
    digits: "只能输入数字",
    creditcard: "请输入有效的信用卡号码",
    equalTo: "你的输入不相同",
    extension: "请输入有效的后缀",
    maxlength: $.validator.format("最多可以输入 {0} 个字符"),
    minlength: $.validator.format("最少要输入 {0} 个字符"),
    rangelength: $.validator.format("请输入长度在 {0} 到 {1} 之间的字符串"),
    range: $.validator.format("请输入范围在 {0} 到 {1} 之间的数值"),
    max: $.validator.format("请输入不大于 {0} 的数值"),
    min: $.validator.format("请输入不小于 {0} 的数值")
  });

  /**
   * 手机号码验证
   */
  $.validator.addMethod("isMobile", function(value, element) {
    var length = value.length;
    var regPhone = /^1([3578]\d|4[57])\d{8}$/;
    return this.optional(element) || (length == 11 && regPhone.test(value));
  }, "请填写正确的手机号码");

  /**
   * 身份证验证
   */
  $.validator.addMethod('isIDcard', function(value, element) {
    var regIDcard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return this.optional(element) || regIDcard.test(value);
  }, "请填写正确的身份证号码");

}));
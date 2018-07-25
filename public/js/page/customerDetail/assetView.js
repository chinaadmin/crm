layui.use(['table', 'conf', 'utilFn', 'upload', 'jquery'], function() {
  table = layui.table;
  conf = layui.conf;
  utilFn = layui.utilFn;
  $ = layui.jquery;

  //设置全局请求头

  utilFn.setHeader(conf, $);

  //表格配置

  var vm = new Vue({
    el: '#app',
    data: {
      loading: true,
      table: {
        // customerId: utilFn.getQueryString().id,//客户ID
        assetTotal: 0.00, //资产总额
        goldValue: 0.00, //黄金总现金价值
        freezeGram: 0.00, //冻结资产(克数)
        usableBalance: 0.00, //可用余额
        freezeBalance: 0.00, //黄金冻结资产
        totalGram: 0.00, //黄金总克重
        currentGram: 0.00, //金荷包总克重
        regularGram: 0.00, //定期金总克重
        pledgeGram: 0.00, //稳赢金总克重
        interestTotal: 0.00, //累计总收益
        interestYestoryTotal: 0.00, //昨日总收益
        pledgeInterestTotal: 0.00, //产品利率累计收益
        pledgeRecievedInterest: 0.00, //稳赢金代收收益
        pledgeInterestYesterday: 0.00, //保价金昨日收益
        pledgeGoldValue: 0.00, //稳赢金总金额
        noviceGram: 0.00, //新手金总克重
        noviceRecievedInterest: 0.00, //新手金今日待发放收益
        noviceInterestYesterday: 0.00, //新手金昨日收益
        noviceTotalInterest: 0.00, //新手金收益合计
        regularInterestTotal: 0.00, //定期金累计收益
        regularInterestYesterday: 0.00, //定期金昨日收益
        regularFloatGoldValue: 0.00, //定期金浮动盈亏现金价值
        regularRecievedInterest: 0.00, //定期金今日待发放收益
        currentInterestTotal: 0.00, //产品利率累计收益
        currentInterestYesterday: 0.00, //金荷包昨日收益
        currentFloatGoldValue: 0.00, //金荷包浮动盈亏现金价值
        currentRecievedInterest: 0.00, //金荷包今日待发放收益
        risefallTotal: 0.00, //看涨跌总额
        risefallMinIncome: 0.00, //看涨跌总额最小收益
        risefallMaxIncome: 0.00, //看涨跌总额最大收益
        risefallTotalIncome: 0.00, //看涨跌累计收益
        recommendIncomeDueIn: 0.00, //推荐奖励代收收益
        recommendIncomeReceived: 0.00, //推荐奖励收益合计
        cashCouponCurrent: 0.00, //现金红包活期金使用累计金额
        cashCouponRegular: 0.00, //现金红包累计收益
        cashCouponPledge: 0.00, //现金红包累计收益
        cashCouponRisefall: 0.00, //现金红包累计收益
        cashCouponBullion: 0.00, //金饰现金红包收益合计
        raiseInterestCouponRegular: 0.00, //累计加息收益
        raiseInterestCouponCurrent: 0.00, //累计加息收益
        raiseInterestCouponPledge: 0.00, //累计加息收益
        raiseInterestCouponRisefall: 0.00, //累计加息收益
        raiseInterestCouponDueInRegular: 0.00, //定期金待收加息收益
        raiseInterestCouponDueInPledge: 0.00, //稳盈金加息待收收益
        raiseInterestCouponDueInRisefall: 0.00, //看涨跌加息待收收益
        raiseInterestCouponYesterdayCurrent: 0.00, //昨日红包加息收益
        allTotalIncome: 0.00, //投资收益总计
        specialGram: 0.00, //特价金总克重
      }

    },
    beforeMount: function() {
      var v = this;
      $.ajax({
        url: conf.basePath + conf.selectAssetPandect,
        type: 'POST',
        data: { 'customerId': utilFn.getQueryString().customerId },
        success: function(res) {
          if (res.code == 0) {
            v.table = res.data;
          } else if(res.code ==-1){
            window.top.location.href="../login.html";
          }
        }
      })
    },
    mounted: function(res) {
        $('#app').removeClass('hide');
        $('#loading').addClass('hide');
      if (window.top !== window.self) {
        window.parent.document.getElementById("assetView").height = 0;
        window.parent.document.getElementById("assetView").height = 750;
      };
    }
  })

})
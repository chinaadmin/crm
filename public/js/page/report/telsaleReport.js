layui.use(['table', 'jquery', 'laydate', 'conf', 'utilFn'], function() {
  var table = layui.table,
    $ = layui.jquery,
    laydate = layui.laydate,
    conf = layui.conf,
    utilFn = layui.utilFn;

  //设置请求头
  utilFn.setHeader(conf, $);

  //获取页面ID
  var pageID = utilFn.getQueryString().id;
  // 表格配置
  var config = {
    elem: "#telsaleReport",
    id: 'telsaleReport',
    url: conf.basePath + conf.querylist,
    method: 'post',
    even: true,
    page: {
      layout: ['limit', 'prev', 'page', 'next', 'count'],
      curr: 1,
    },
    limits: [10, 20, 30, 50, 100, 200],
    cols: [
      [
        {type: 'numbers', fixed: 'left', align: 'center', width: '50'}, 
        {field: 'realName',title: '电销员',align: 'center',width: '80'},
        {field: 'teamName',title: '组别',align: 'center',width: '100'},
        {field: 'transferPeople',title: '转化数',align: 'center',width: '50'},
        {field: 'payAmount',title: '新增额',align: 'center',width: '60'},
        {field: 'crmSale',title: '转化充值额',align: 'center', width: '90'},
        {field: 'followCount',title: '跟进数',align: 'center',width: '50'},
        {field: 'withdrawAmount',title: '提现额', align: 'center',width: '90'},
        {field: 'sellAmount', title: '卖金额',align: 'center',width: '80'},
        {field: 'investmentAmount', title: '投资额(金荷包)', align: 'center', width: '100' },
        {field: 'totalInvestment', title: '投资总额', align: 'center', width: '100' },
        {field: 'currentcrmSale',title: '当日新增年化',align: 'center',width: '90'},
        {field: 'totalGram',title: '在保黄金克重',align: 'center',width: '90'},
        {field: 'holdcash',title: '在保投资产品',align: 'center',width: '90'},
        {field: 'countDate',title: '统计日期', align: 'center', width: '100' }
      ]
    ],
    done: function(res, curr, count) {
      var totalHtml = `<tr>
                    <td class="text-center" colspan="3">合计(共${count}条)</td>                
                    <td class="text-center" colspan="1">${res.map.transferPeopleTotal}</td>
                    <td class="text-center" colspan="1">${res.map.payAmountTotal}</td>
                    <td class="text-center" colspan="1">${res.map.crmSaleTotal}</td>
                    <td class="text-center" colspan="1">${res.map.followCountTotal}</td>
                    <td class="text-center" colspan="1">${res.map.withdrawAmountTotal}</td>
                    <td class="text-center" colspan="1">${res.map.sellAmountTotal}</td>
                    <td class="text-center" colspan="1">${res.map.investmentAmount}</td>
                    <td class="text-center" colspan="1">${res.map.totalInvestment}</td>
                    <td class="text-center" colspan="1">${res.map.currentcrmSaleTotal}</td>
                    <td class="text-center" colspan="1">${res.map.totalGramTotal}</td>
                    <td class="text-center" colspan="1">${res.map.holdcashTotal}</td>
                    <td class="text-center" colspan="1"></td>
                    </tr>`;
      //如果有数据则插入合计
      if (count > 0) $('.layui-table-main .layui-table tbody').append(totalHtml);
    }

  };



  //缓存数据
  var queryCache = {};
  var nameCache = {};
  // vm实例
  var vm = new Vue({
    el: '#app',
    data: {
      loading: true,
      info: {
        startDate: '', //开始时间
        endDate: '', //结束时间
        telRealName: '', //组员姓名
        teamId: '', //组别Id
      },
      timeValue: '',
      group: {}, //查询组别成员数据
      roles: {}, //获取页面权限
    },
    beforeMount: function() {
      var v = this;
      //缓存查询条件
      queryCache = JSON.parse(JSON.stringify(v.info));
      // nameCache = JSON.parse(JSON.stringify(v.name));

      //获取组别专员接口
      $.post(conf.basePath + conf.selectGroupCommissioner).done(function(res) {
        //登录超时，跳转到登录页面
        if (res.code == -1) {
          window.top.location.href = "../login.html";
        };
        //获取数据成功
        if (res.code == 0) {
          v.group = res.data;
        }
      });

      //获取页面条件权限接口
      $.post(conf.basePath + conf.getPageCondition, { id: pageID }, function(res) {
        //登录超时，跳转到登录页面
        if (res.code == -1) {
          window.top.location.href = "../login.html";
        };
        //获取数据成功
        if (res.code == 0) {
          v.roles = res.data;
        }
      });

      //获取默认时间
      v.info.startDate = v.getDate('-');
      v.info.endDate = v.getDate('-');

      
    },
    mounted: function() {
      $('#loading').addClass('hide');
      $('#app').removeClass('hide');
      var v = this;

      //日期组件初始化

      lay('.big').each(function () {
        laydate.render({
          elem: this,
          trigger: 'click',
          value:v.getDate('-')
        });
      });

      

      //表格初始化
      config.where = this.info;
      table.render(config);
    },
    methods: {
      //时间
      getDate: function(sper) {

        sper = sper || 'CN';

        var date = new Date();
        var year = date.getFullYear();
        var m = date.getMonth() + 1;
        var month = m < 10 ? ('0' + m) : m;
        var d = date.getDate() - 1;
        var day = d < 10 ? ('0' + d) : d;

        if (sper === 'CN') {
          return year + '年' + month + '月' + day + '日';
        } else {
          return year + sper + month + sper + day;
        }

      },
      //表格查询重载
      research: function() {
        this.info.startDate = $('#staticStartDate').val();
        this.info.endDate = $('#staticEndDate').val();
        config.where = {
          startDate: this.info.startDate,
          endDate: this.info.endDate,
          teamId: this.info.teamId,
          telRealName: this.info.telRealName,
        };
        table.reload('telsaleReport', config);
      },
      //表格重置
      reset: function() {
        this.info = $.extend({}, queryCache);

        //时间重置为最新日期
        $('#staticStartDate').val(this.getDate('-'));
        $('#staticEndDate').val(this.getDate('-'));
        this.info.startDate = this.getDate('-');
        this.info.endDate = this.getDate('-');

        config.where = {
          startDate: this.info.startDate,
          endDate: this.info.endDate,
          teamId: this.info.teamId,
          telRealName: this.info.telRealName,
        }

        table.reload('telsaleReport', config);
      },
      //导出表格
      exportFile: function() {
        var v = this;
        var params = {
          teamId: v.info.teamId,
          telRealName: v.info.telRealName,
          startDate: v.info.startDate,
          endDate: v.info.endDate,
        }
        var token = utilFn.getCookie(conf.cookieName);
        var fileUrl = `${conf.basePath + conf.export}?__sid=${token}&${$.param(params)}&exportType=1`
        window.location.href = fileUrl;
      }
    }
  });

window.setTable=vm.setTable;
})
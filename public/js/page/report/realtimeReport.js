layui.use(['table', 'jquery', 'laydate', 'conf', 'utilFn'], function () {
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
        elem: "#realtimeReport",
        id: 'realtimeReport',
        url: conf.basePath + conf.selectRealTimeAchievement,
        method: 'post',
        even: true,
        page: {
            layout: ['limit', 'prev', 'page', 'next', 'count'],
            curr: 1,
        },
        limits: [10, 20, 30, 50, 100, 200],
        cols: [
            [
                {type: 'numbers',fixed: 'left',align: 'center',width: '50'},
                {field: 'realName',title: '电销员',align: 'center',width: '80'},
                {field: 'teamName',title: '组别',align: 'center',width: '100'},
                {field: 'transferPeople',title: '转化数',align: 'center',width: '50'},
                {field: 'payAmount',title: '新增额',align: 'center',width: '60'},
                {field: 'crmSale',title: '转化充值额',align: 'center', width: '90'},
                {field: 'followCount',title: '跟进数',align: 'center',width: '50'},
                {field: 'withdrawAmount',title: '提现额',align: 'center',width: '80'},
                {field: 'sellAmount',title: '卖金额',align: 'center',width: '80'},
                {field: 'investmentAmount', title: '投资额(金荷包)', align: 'center', width: '100'},
                {field: 'totalInvestment',title: '投资总额',align: 'center',width: '100'},
                {field: 'currentcrmSale',title: '当日新增年化',align: 'center',width: '90'},
                {field: 'totalGramAfterDist',title: '在保黄金克重',align: 'center',width: '90'},
                {field: 'holdcashAfterDist',title: '在保投资产品',align: 'center',width: '90'},
                {field: 'updateTime',title: '最近更新时间',align: 'center',width: '120'}
            ]
        ],
        done: function (res, curr, count) {
            if (res.map) {
                var totalHtml = `<tr>
                        <td class="text-center" colspan="3">合计(共${count}条)</td>80                
                        <td class="text-center" colspan="1">${res.map.transferPeople}</td>
                        <td class="text-center" colspan="1">${res.map.payAmount}</td>
                        <td class="text-center" colspan="1">${res.map.crmSale}</td>
                        <td class="text-center" colspan="1">${res.map.followCount}</td>
                        <td class="text-center" colspan="1">${res.map.withdrawAmount}</td>
                        <td class="text-center" colspan="1">${res.map.sellAmount}</td>
                        <td class="text-center" colspan="1">${res.map.investmentAmount}</td>
                        <td class="text-center" colspan="1">${res.map.totalInvestment}</td>
                        <td class="text-center" colspan="1">${res.map.currentcrmSale}</td>
                        <td class="text-center" colspan="1">${res.map.totalGramAfterDist}</td>
                        <td class="text-center" colspan="1">${res.map.holdcashAfterDist}</td>
                        <td class="text-center" colspan="1"></td>
                        </tr>`;
                //如果有数据则插入合计
                if (count > 0) $('.layui-table-main .layui-table tbody').append(totalHtml);
            }
            
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
                realName: '', //组员姓名
                teamName: '-1', //组别Id
            },
            timeValue: '',
            group: {}, //查询组别成员数据
            roles: {}, //获取页面权限
        },
        beforeMount: function () {
            var v = this;
            //缓存查询条件
            queryCache = JSON.parse(JSON.stringify(v.info));
            // nameCache = JSON.parse(JSON.stringify(v.name));

            //获取组别专员接口
            $.post(conf.basePath + conf.selectGroupCommissioner).done(function (res) {
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
            $.post(conf.basePath + conf.getPageCondition, { id: pageID }, function (res) {
                //登录超时，跳转到登录页面
                if (res.code == -1) {
                    window.top.location.href = "../login.html";
                };
                //获取数据成功
                if (res.code == 0) {
                    v.roles = res.data;
                }
            });


        },
        mounted: function () {
            $('#loading').addClass('hide');
            $('#app').removeClass('hide');

            //表格初始化
            config.where = this.info;
            table.render(config);
        },
        methods: {
            //表格查询重载
            research: function () {
                config.where = {
                    realName: this.info.realName,
                    teamName: this.info.teamName,
                };
                table.reload('realtimeReport', config);
            },
            //表格重置
            reset: function () {
                this.info = $.extend({}, queryCache);

                config.where = {
                    realName: this.info.realName,
                    teamName: this.info.teamName,
                }

                table.reload('realtimeReport', config);
            },
            //导出表格
            exportFile: function () {
                var v = this;
                var params = {
                    realName: v.info.realName,
                    teamName: v.info.teamName,
                }
                var token = utilFn.getCookie(conf.cookieName);
                var fileUrl = `${conf.basePath + conf.realTimeAchievementExportExcelFile}?__sid=${token}&${$.param(params)}&exportType=1`
                window.location.href = fileUrl;
            }
        }
    });

    window.setTable = vm.setTable;
})
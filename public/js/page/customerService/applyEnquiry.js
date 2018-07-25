layui.use(['table','conf','utilFn'],function(){
    var table   = layui.table;
    var    conf = layui.conf;
    var utilFn  = layui.utilFn;
    var    $    = layui.$;

    //设置全局请求头
    utilFn.setHeader(conf, $);


        //列表查询表格配置
    var changeConfig = {
        elem:'#changeTable',
        id:'changeTable',
        url: conf.basePath + conf.applyEnquiry,
        method: 'POST',
        page: {
            curr: 1,
            theme: '#299b96',
            limits: [10, 20, 30, 50, 100, 200],
            layout: ['limit', 'prev', 'page', 'next', 'count']
        },
        even: true,
        cols:[
            [
                { type:  'numbers',fixed:'left',align:'center',width:50},
                { field: '', title: '呼叫', align: 'center', width: 60, event: 'callOut', templet:'#tp10'},
                { field: 'mobilePhone',title:"手机",align:'center',width:120,event:'show',templet:'#tp9'},
                { field: 'realName', title: '真实姓名', align: 'center', width: 100 },
            ]
        ]

    }
    
    //变更申请表格字段
    var showUp = [
            { field: 'auditStatus', title: "审批状态", align: 'center', width: 180, templet: '#tp3' },
            { field: 'applyType', title: '申请类型', align: 'center', width: 120, templet: '#tp1' },
            { field: 'changeType', title: '变更类型', align: 'center', width: 120, templet: '#tp2' },
            { field: 'createTime', title: '申请时间', align: 'center', width: 160 },
            { field: 'clientType', title: '客户端类型', align: 'center', width: 100, templet: '#tp5' },
            { field: 'euquiryType', title: '查询类型', align: 'center', width: 130, templet: '#tp6' },
            { field: 'approveRemark', title: '审批备注', align: 'center', width: 130 },
         ];
    
    //转账充值列表
    var showTransfer =[
        { field: 'rechargeStatus', title: '申请状态', align: 'center', width: 130, templet: '#tp8' },
        { field: 'payMethod', title: '充值方式', align: 'center', width: 120, templet: '#tp7' },
        { field: 'rechargeAmount', title: '充值金额', align: 'center', width: 120 },
        { field: 'createTime', title: '申请时间', align: 'center', width: 160 },
        { field: 'clientType', title: '客户端类型', align: 'center', width: 100, templet: '#tp5' },
        { field: 'euquiryType', title: '查询类型', align: 'center', width: 130, templet: '#tp6' },
        { field: 'approveRemark', title: '审批备注', align: 'center', width: 130 },
    ]
         
    var baseConfig2 = JSON.parse(JSON.stringify(changeConfig));
    baseConfig2.cols[0] = baseConfig2.cols[0].concat(showUp);

    var baseConfig3 = JSON.parse(JSON.stringify(changeConfig));
    baseConfig3.cols[0] = baseConfig3.cols[0].concat(showTransfer);
    
    //实例
    var app = new Vue({
        el:'#app',
        data:{
            roles:{},//权限
            table:{
                
                phoneOrName:'',
                euquiryType: ''//查询类型 1变更申请 2 转账充值申请
            },
            tabState: '1',
            
        },
        beforeMount:function(){
            var v = this;

            //获取列表权限
            $.ajax({
                url: conf.basePath + conf.getPagePermission,
                type: 'post',
                data: { id: utilFn.getQueryString().id }
            }).done(function (res) {

                //登录超时
                if (res.code == -1) {
                    window.parent.location.href = '../login.html';
                }

                if (res.code == 0) {
                    v.roles = res.data;
                }
            })
        },
        methods:{
            //切换
            tabToggle:function(index){

                this.tabState = index;
                
                // this.table.phoneOrName = '';

                this.searchData();
            },
            //搜索
            searchData:function(){

                $('.search-box').removeClass('center');
                $('.search-box').removeClass('left');
                if (this.table.phoneOrName) {
                    var config = changeConfig;

                    if(this.tabState == '1'){
                    config = baseConfig2;
                    }

                    if(this.tabState == '2'){
                        config = baseConfig3;
                    }
                    this.table.euquiryType = this.tabState;
                    config.where = this.table;

                    table.render(config);
                }else{
                    layer.msg('请输入查询条件',{
                        icon:0,
                        shade:0.3,
                        time:2000
                    })
                }
                
            }
        }
    })

    //点击展示用户详情弹窗
    table.on('tool(changeTable)', function (obj) {

        //是否有显示客户详情的权限
        var flag = app.roles.unAssignBtnCstDetail.authorised;
        var layEvent = obj.event;

        if (flag) {
            var userData = obj.data;

            layer.open({
                type: 2,
                title: '客户详情',
                skin: 'crm-model',
                maxmin: true,
                area: ['90%', '90%'],
                scrollbar: false,
                content: `${conf.baseProject}/customerDetails/customerDetail.html?customerId=${userData.customerId}&from=applyEnquiry&to=${app.roles.unAssignBtnCstDetail.id}&updateId=${userData.id}`
            });
        }
        if (layEvent === 'callOut') {
            window.parent.callout(obj.data.mobilePhone);
        }

    });

    //注册全局表格刷新
    window.searchData = app.searchData;



});


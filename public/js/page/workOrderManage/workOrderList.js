layui.use(['table','layer','laydate','conf','utilFn','jquery'],function(){
    var table   = layui.table,
        layer   = layui.layer,
        laydate = layui.laydate,
        conf    = layui.conf,
        $       = layui.jquery,
        utilFn  = layui.utilFn;

        //设置请求头
        utilFn.setHeader(conf,$)

        var config = {
            elem: '#workOrderList',
            url: conf.basePath + conf.selectWorkOrderListData,            
            id: 'workOrderList',
            method: 'post',
            even:true,
            page:{
                layout:['limit','prev','page','next','count'],
                curr: 1
            },
            limits:[10,20,30,50,100,200],
            cols:
                [
                    [
                        {
                            type:'checkbox',
                            fixed: 'left',
                            width: 50
                        },{
                            type:'numbers',
                            fixed:'left',
                            width: 50,
                            align: 'center'
                        },{
                            field: 'id',
                            title:'工单编号',
                            width: 100,
                            align: 'center'
                        },{
                            field: 'level',
                            title:'等级',
                            width: 60,
                            align: 'center'
                        }, {
                            field: 'proDescription',
                            title: '内容',
                            width: 210,
                            align: 'center',
                            templet:'#tp5',
                            event:'show'
                        }, {
                            field: 'custName',
                            title: '姓名',
                            width: 150,
                            align: 'center'
                        }, {
                            field: 'levelNames',
                            title: '分类',
                            width: 150,
                            align: 'center'
                        }, {
                            field: 'createName',
                            title: '创建人',
                            width: 110,
                            align: 'center'
                        }, {
                            field: 'createTime',
                            title: '创建时间',
                            width: 110,
                            align: 'center',
                            templet: '#tp1'
                        }, {
                            field: 'handlerName',
                            title: '当前处理人',
                            width: 110,
                            align: 'center'
                        }, {
                            field: 'handlingTime',
                            title: '预计处理时间',
                            width: 120,
                            align: 'center',
                            templet:'#tp2'
                        },  {
                            field: 'source',
                            title: '来源',
                            width: 100,
                            align: 'center'
                        }, {
                            field: 'status',
                            title: '状态',
                            width: 80,
                            align: 'center',
                            templet:'#tp3'
                        }, {
                            field: 'finishTime',
                            title: '解决时间',
                            width: 110,
                            align: 'center',
                            templet:'#tp4'
                        },
                    ]
                ]
        }

        var queryCache={};
        var vm = new Vue({
            el:'#app',
            data:{
                info: {
                    startCreateTime:'', //创建时间开始
                    endCreateTime: '', //创建时间结束
                    mobilePhone: '',//客户号码
                    status: '-1',//状态
                    startFinishTime: '',//解决时间开始
                    endFinishTime: '',//解决时间结束
                    handlerMan:'',//处理人
                    level: '-1', //等级
                    startHandlingTime: '',//预计处理时间开始
                    endHandlingTime: '',//预计处理时间结束
                    source: '-1',//来源
                },
                columnData:{},//查看工单数据
                showData:{},//查看工单附件数据
                solutionData:{},//处理人
                fenleiId:{},//分类id
                personOption1:[],//工单分类一级选项
                personOption2: [],//工单分类二级选项
                personOption3: [],//工单分类三级选项                
                personData1: '-1',//工单分类1级选定的选项
                personData2: '-1',//工单分类2级选定的选项
                personData3: '-1',//工单分类3级选定的选项
            },
            watch:{
                personData1:function(val){
                    console.log(val);
                    if (val == -1) {
                        this.personData2 = [];
                        this.personOption2 = {};
                    }else{
                        this.getLevelData(val,'personOption2');
                    }
                    this.personData2='-1';
                },
                personData2:function(val){
                    if (val == -1) {
                        this.personData3 = [];
                    } else {                                              
                        this.getLevelData(val,' personOption3');
                    }
                    this.personData3= '-1';
                }
            } ,
            beforeMount:function(){
                var v = this;
                queryCache = JSON.parse(JSON.stringify(v.info));
            },
            mounted:function(){
                
                
                //时间插件初始化
                laydate.render({
                    elem: '#expectTime',
                    type: 'datetime',
                });
                lay('.test-item').each(function () {
                    laydate.render({
                        elem: this,
                        range: true,
                        type: 'datetime',
                        trigger: 'click'
                    });
                });
                //数据表格渲染
                table.render(config);

            },
            methods:{
                //查询表格
                search:function(){
                    var reTime = $('#resolutionTime').val();
                    var etTime = $('#expectaTime').val();
                    var nwTime = $('#newTime').val();

                    //创建时间
                    this.info.startCreateTime = nwTime.split(' - ')[0];
                    this.info.endCreateTime = nwTime.split(' - ')[1];

                    //解决时间
                    this.info.startFinishTime = reTime.split(' - ')[0];
                    this.info.endFinishTime = reTime.split(' - ')[1];

                    //预计处理时间
                    this.info.startHandlingTime = etTime.split(' - ')[0];
                    this.info.endHandlingTime = etTime.split(' - ')[1];
                    
                    config.where=this.info;
                    table.reload('workOrderList',config);
                },
                //重置表格
                reset:function(){
                    var timeArr = ['#resolutionTime', '#expectaTime','#newTime'];
                    for (var i=0;i<timeArr.length;i++){
                        $(timeArr[i]).val('');
                    };
                    this.info = $.extend({},queryCache);
                    config.where=this.info;
                    table.reload('workOrderList',config);

                },
                //处理数据格式
                splitArr:function(data){
                    var v = this;
                    v.fenleiId = data.split(',');

                },
                //获取分类数据
                getLevelData:function(id,allName){
                            var v = this;
                        $.ajax({
                            url: conf.basePath + conf.selectWorkOrderClassification,
                            data: { parentId: id },
                            method: 'post',
                        }).done(function (res) {
                            //登录失败,返回登录页
                            if (res.code == -1) {
                                window.parent.location.href = "../login.html";
                            }
                            //登录成功
                            if (res.code == 0) {
                                v[allName] = res.data;
                                console.log(v[allName])
                                
                            }
                        
                        })
                },
                //获取处理人数据
                getSolutionData: function(){
                    var v = this;
                    $.ajax({
                        url: conf.basePath + conf.selectDealingPeople,
                        method: 'post'
                    }).done(function(res){
                        //登录失败,返回登录页
                        if (res.code == -1) {
                            window.parent.location.href = "../login.html";
                        }
                        //登录成功
                        if (res.code == 0) {
                            v.solutionData = res.data;
                        }
                    })
                },
                //新建工单
                newOrder:function(){
                    $('#saveWork').removeClass('hide');
                    $('#checkWork').addClass('hide');
                    layer.open({
                        type: 1,
                        title: '查看工单',
                        skin: 'crm-model',
                        area: ['70%', '70%'],
                        content: $('#column')
                    })
                    this.getSolutionData();

                },
                //指派工单
                assignOrder:function(){

                },
                //关闭工单
                closeOrder:function(){

                },
                //导出工单
                exportOrder:function(){

                },
                //查看备注
                showOrder:function(){

                },
                //转发
                transmit: function(){

                }
            }
        });

        //展示查看详情
    table.on('tool(workOrderList)',function(obj){
        var saveWork = $('#saveWork.hide')
        if (saveWork) {
            $('#saveWork').removeClass('hide');
        }

            var data = obj.data;
            var id   = data.id;
            var layEvent = obj.event;

            if(layEvent === 'show'){

                layer.open({
                    type: 1,
                    title: '查看工单',
                    skin: 'crm-model',
                    area: ['70%', '70%'],
                    content: $('#column')
                })
            };
            //获取查看详情数据
            $.ajax({
                url: conf.basePath + conf.selectWorkOrderListDetails,
                data:{id:id},
                method: 'post',
            }).done(function(res){
                //登录失败,返回登录页
                if(res.code == -1){
                    window.parent.location.href="../login.html";
                }
                //登录成功
                if(res.code == 0){
                    vm.showData = res.map;
                    vm.columnData = res.data;
                    var workId = vm.columnData.levelIds;
                    vm.splitArr(workId);


                    //获取分类数据
                    vm.getLevelData(-1,'personOption1');
                    
                    vm.getLevelData(vm.fenleiId[0], 'personOption2');
                    
                    vm.getLevelData(vm.fenleiId[1], 'personOption3');
                    vm.$nextTick(function(){
                        vm.personData1 = vm.fenleiId[0];
                        console.log(vm.personData1);
                        vm.personData2 = vm.fenleiId[1];
                        console.log(vm.personData2);

                        vm.personData3 = vm.fenleiId[2];
                        console.log(vm.personData3);
                    })

                    //状态
                    var aa = vm.showData.historicalRecords;
                    for (let x = 0; x < aa.length; x++) {
                        if (aa.length != 0) {
                            if (aa[x].createTime != '' && aa[x].operatorName!=''){
                                var html = '';
                                     html += '<span style="padding-left:10px;">' + aa[x].createTime + '</span><span>' + aa[x].operatorName + '</span>';
                                $('#history').html(html);
                            } else if (aa[x].createTime==''){
                                var html = '';
                                    html += '<span style="padding-left:10px">' + aa[x].operatorName + '</span>';
                                $('#history').html(html);
                            } else if (aa[x].createTime == '') {
                                var html = '';
                                html += '<span style="padding-left:10px"><span>由</span>' + aa[x].operatorName + '</span>';
                                $('#history').html(html);
                            }
                            
                        }
                        
                    }
                    

                    //获取处理人数据
                    vm.getSolutionData();
                    
                }
                
            });     
    })
})
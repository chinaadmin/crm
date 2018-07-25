/**
 * 调配页js
 */


var conf = window.conf;
var _ = window._;

//统一设置请求头
_.setHeader();

//获取url参数对象
var urlParam = JSON.parse(_.getQueryString());

//待分配数据总条数
$('#count').val(urlParam.count);

$('#max').text('最多可分配数：' + urlParam.count);

var cstCount = urlParam.count;

$('#count').change(function() {
  gridUtil.averagDistributedLoad('#dispatcherTableGrid', $(this).val());
  cstCount = $(this).val();
})

//生成调配表格
$(function() {
  var closeStatus = urlParam.target == 'team' ? true : false;

  gridUtil.initGrid('#dispatcherTableGrid', conf.basePath + conf.selectGroupCommissioner, closeStatus);
});


//选择自动计算平均数
function averagDistributedLoad(object) {

  var checked = $(object).prop('checked');

  if (cstCount < 1) {
    window.parent.layer.msg('当前没有调配的客户', {
      icon: 2,
      shade: 0.1,
      time: 1000
    });
    return;
  }

  if (checked) {
    gridUtil.averagDistributedLoad('#dispatcherTableGrid', cstCount);
  } else {
    gridUtil.clear('#dispatcherTableGrid');
  }
}

//分配
function saveAllocateFun(el) {

  if (cstCount == '0' || cstCount == '') {
    window.parent.layer.msg('当前调配客户数为0', {
      icon: 2,
      shade: 0.1,
      time: 1000
    });
    return;
  }

  var dataArray = gridUtil.getDataSelected('#dispatcherTableGrid');

  if (!dataArray) {
    window.parent.layer.msg('请选择调配的团队或电销员', {
      icon: 2,
      shade: 0.1,
      time: 1000
    });
    return;
  }

  var total = staticCount(dataArray);

  if (total > urlParam.count) {
    window.parent.layer.msg('当前调配客户数超限额，请检查', {
      icon: 2,
      shade: 0.1,
      time: 1000
    });
    return;
  }

  //拼装传输数据

  var param = {
    type: urlParam.type,
    target: urlParam.target,
    tabName: urlParam.tabName,
    cstQuery: {},
    customerId: [],
    groupList: []
  };

  //如果是调配全部则传入查询参数
  if (param.type == 'all') {
    param.cstQuery = urlParam;
  } else {
    param.customerId = urlParam.cstIds;
  }


  //拼装人员调配数据
  dataArray.forEach(function(el, index) {

    var teamId = '';

    if (el.realName == '') teamId = el.teamId;

    if (isLeaf(index, teamId, dataArray) && el.count != 0) {
      param.groupList.push(el);
    }

  });


  //提交请求
  $.ajax({
    url: conf.basePath + conf.insertAllocateCustomers,
    type: 'post',
    data: JSON.stringify(param),
    contentType: "application/json; charset=utf-8",
    dataType: 'json',
    beforeSend: function() {
      $(el).attr('disabled', true).addClass('disabled').text('正在调配中,请稍后...');
    }
  }).done(function(res) {

    var msg = res.code == 0 ? '调配成功' : '调配失败,请稍后再试';

    window.parent.layer.closeAll();

    //执行调配页的列表刷新
    window.parent.queryTable();

    window.parent.layer.msg(msg, {
      icon: msg == '调配成功' ? 1 : 2,
      shade: 0.1,
      time: 1000
    });

  });

}

//计算总数
function staticCount(array) {
  var total = 0;
  for (var i = 0; i < array.length; i++) {
    var teamId = '';

    if (array[i].realName == '') teamId = array[i].teamId;

    if (isLeaf(i, teamId, array)) {
      total += parseInt(array[i].count);
    }
  }
  return total;
}

function isLeaf(index, teamId, array) {
  for (var i = 0; i < array.length; i++) {
    if (i != index) {
      if (array[i].teamId == teamId) {
        return false;
      }
    }
  }
  return true;
}
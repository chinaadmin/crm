var gridUtil = {
  initGrid: function(id, url, isExpandAll) {
    $.post(url, function(data) {
      gridUtil.createTable(id);
      gridUtil.createThead(id);
      gridUtil.createTbody(id, data);

      if (isExpandAll) {
        gridUtil.expandAll(id);
      }
    });


  },
  createTable: function(id) {
    var table = '<table class="allocate-table">';
    table += '</table>';
    $(id).append(table);
  },
  createThead: function(id) {
    var thead = ' <thead><tr><td width="50%" align="center"><span>销售团队</span></td>';
    thead += '<td align="center" width="10%"><input type="checkbox" onclick="gridUtil.selectAll(\'' + id + '\',this)"/></td>';
    thead += '<td width="40%" align="center"><span>分配客户数</span></td></thead>';
    $(id).find('table').append(thead);
  },
  createTfood: function(id) {
    var tfood = '<tfoot><tr><td colspan="3" align="center"><input type="button" value="确任分派" id="saveAllocate"/></td></tr></tfoot>';
    $(id).find('table').append(tfood);
  },
  createTbody: function(id, data) {
    var tbody = "<tbody></tbody>";
    $(id).find('table').append(tbody);
    if (data) {
      this.createGrid(id, data, 'data');
    } else {
      $(id).find('table tbody').append('<tr><td colspan="3" align="center" style="color:blue;">暂无调配客户的数据，请稍候</td></tr>');
    }
  },
  createGrid: function(id, data, field) {
    if (this.isEmpty(data) || this.isEmpty(id) || this.isEmpty(field)) {
      return;
    }
    var jsonObject = data;
    var array = jsonObject[field];
    for (var i = 0; i < array.length; i++) {
      if (array[i].children.length != 0) {
        //根结点
        var trRows = this.createTrRowsGrid(array[i], array[i].children, id);
        $(id).find('table tbody').append(trRows);
      }
    }
  },
  createTrRow: function(object, isRoot, id) {
    var style = isRoot ? "" : "style='display:none;'";
    var tr = "<tr " + style + "><td style='padding-left:20%;'>";
    if (isRoot) {
      tr += '<span class="tree" onclick="gridUtil.expandRootAll(\'' + id + '\',\'' + object.teamId + '\',this)">+</span>';
      tr += '<span>' + object.teamName + '(' + object.children.length + ')</span>';
      tr += "<input type='hidden' data-teamId='" + object.teamId + "' value='" + object.teamId + "' name='root'/> </td>";
    } else {
      tr += '<span>' + object.realName + '</span>';
      tr += "<input type='hidden' value='" + object.userId + "' name='" + object.teamId + "'/> </td>";
    }

    tr += "<td align='center'>" + this.createCheckBox() + " </td>";
    tr += "<td align='center'>" + this.createInputText() + "</td></tr>";
    return tr;
  },
  createTrRowsGrid: function(object, array, id) {
    var trRowsSet = this.createTrRow(object, true, id);
    for (var i = 0; i < array.length; i++) {
      if (array[i].parentId == object.id) {
        trRowsSet += this.createTrRow(array[i], false, id);
      }
    }
    return trRowsSet;
  },
  createCheckBox: function() {
    return "<input type='checkbox' onchange='gridUtil.clearSingle(this);'/>";
  },
  createInputText: function() {
    return "<input type='text' size='30' name='cstCount' onkeyup='gridUtil.dynamicChange(this);'/>";
  },
  dynamicChange: function(object) {

  },
  clearSingle: function(object) {
    var checked = $(object).prop('checked');
    if (!checked) {
      $(object).parent().next().find('input[type="text"]').val('0');
    }
    var inputNode = $(object).parent().prev().find('input[type="hidden"]').get(0);
    var spanNode = $(inputNode).prev().prev();
    if (spanNode && $(spanNode).text() == '-') {
      var id = $(inputNode).val();
      var tbody = $(object).parent().parent().parent();
      var childrenArray = $(tbody).find('input[name="' + id + '"]');
      for (var i = 0; i < childrenArray.length; i++) {
        var nextNode = $(childrenArray[i]).parent().next();
        var nextSecondNode = $(childrenArray[i]).parent().next().next();
        $(nextNode).find('input[type="checkbox"]').prop('checked', checked);
        if (!checked) {
          $(nextSecondNode).find('input[type="text"]').val('0');
        }
      }
    }
    this.averagDistributedLoad('#dispatcherTableGrid', cstCount);
  },
  getDataSelected: function(elementId) {
    var rowsSelectedArray = this.getAllSelectedRows(elementId)
    if (rowsSelectedArray.length < 1) {
      return null;
    }
    var dataArray = [];
    for (var i = 0; i < rowsSelectedArray.length; i++) {
      var inputNode = $(rowsSelectedArray[i]).find('input[type="hidden"]');
      var preNode = $(inputNode).prev();
      var id = $(inputNode).val();
      var parentId = $(inputNode).attr('name');
      var name = $(preNode).text();
      var cstCount = $(rowsSelectedArray[i]).find('input[type="text"]').val();

      var param = {
        'count': cstCount ? cstCount : 0,
        'teamId': parentId,
        'userId': id,
        'realName': name
      }

      //判断是否为组
      if (parentId == 'root') {
        param.teamId = $(inputNode).attr('data-teamId');
        param.userId = '';
        param.realName = '';
      }

      dataArray.push(param);
    }
    return dataArray;
  },
  getAllSelectedRows: function(elementId) {
    var inputCheckboxArray = $(elementId).find('table tbody').find('input[type="checkbox"]');
    var trArray = [];
    for (var i = 0; i < inputCheckboxArray.length; i++) {
      var checked = $(inputCheckboxArray[i]).prop('checked');
      if (checked) {
        trArray.push($(inputCheckboxArray[i]).parent().parent());
      }
    }
    return trArray;
  },
  selectAll: function(elementId, object) {
    var checked = $(object).prop('checked');
    var trArray = $(elementId).find('table tbody tr');
    for (var i = 0; i < trArray.length; i++) {
      var css = $(trArray[i]).css('display');
      if (css == 'none') {
        continue;
      }
      $(trArray[i]).find('input[type="checkbox"]').prop("checked", checked);
    }
    this.averagDistributedLoad('#dispatcherTableGrid', cstCount);
    if (!checked) {
      $(object).parent().parent().parent().parent().find('tbody').find('input[type="text"]').val('0');
    }
  },
  expandRootAll: function(elementId, id, object) {
    var text = $(object).text();
    if (text == '+') {
      $(object).text('-');
      $(elementId).find('table tbody').find('input[name="' + id + '"]').parent().parent().show();
    } else {
      $(object).text('+');
      $(elementId).find('table tbody').find('input[name="' + id + '"]').parent().parent().hide();
      $(elementId).find('table tbody').find('input[name="' + id + '"]').parent().parent().find('input[type="checkbox"]').prop('checked', false);
      $(elementId).find('table tbody').find('input[name="' + id + '"]').parent().parent().find('input[type="text"]').val('');
    }
  },
  expandAll: function(elementId) {
    var trArray = $(elementId).find('table tbody tr');
    for (var i = 0; i < trArray.length; i++) {
      var inputNode = $(trArray[i]).find('input[type="hidden"]').get(0);
      if (inputNode && $(inputNode).attr('name') == 'root') {
        var firstTd = $(trArray[i]).find('td').get(0);
        var firstSpan = $(firstTd).find('span').get(0);
        $(firstSpan).html('-');
      } else {
        $(trArray[i]).show();
      }
    }
  },
  averagDistributedLoad: function(elementId, cstCount) {
    //平均分配
    var rowsArray = this.getSelectedRows(elementId);
    var valueArray = []; //{id cstCount}
    var index = 0;
    var length = rowsArray.length;
    if (length < 1 || cstCount < 1) {
      return;
    }
    for (var i = 0; i < cstCount; i++) {
      var node = rowsArray[index++];
      var input = $(node).find('input[type="hidden"]');
      var id = $(input).val();
      var arrayIndex = this.getArrayIndex(id, valueArray);
      if (arrayIndex != -1) {
        var srcCstCount = valueArray[arrayIndex].cstCount;
        valueArray[arrayIndex] = { 'id': id, 'cstCount': srcCstCount + 1 };
      } else {
        valueArray.push({ 'id': id, 'cstCount': 1 });
      }
      if (index == length) {
        index = 0;
      }
    }
    this.updateGridCell(rowsArray, valueArray)
  },
  updateGridCell: function(rowsArray, valueArray) {
    for (var i = 0; i < rowsArray.length; i++) {
      var node = rowsArray[i];
      var input = $(node).find('input[type="hidden"]');
      var id = $(input).val();
      var parentId = $(input).attr('name');
      var index = this.getArrayIndex(id, valueArray);
      var cstCount = index == -1 ? 0 : valueArray[index].cstCount;
      $(node).find('input[name="cstCount"]').val(cstCount);
      if (parentId != -1) {
        this.udpateGridParentCell(node, parentId);
      }
    }
  },
  udpateGridParentCell: function(row, parentId) {
    var tbody = $(row).parent();
    var inputNode = $(tbody).find('input[value="' + parentId + '"]').get(0);
    var parentNode = $(inputNode).parent().parent();
    if (parentNode && parentNode.length > 0) {
      //存在父节点
      var checked = $(parentNode).find('input[type="checkbox"]').prop('checked');
      if (checked) {
        //选中
        var childrenNodeArray = $(tbody).find('input[name="' + parentId + '"]');
        var cstCount = 0;
        for (var i = 0; i < childrenNodeArray.length; i++) {
          var childrenNode = $(childrenNodeArray[i]).parent().parent();
          var value = $(childrenNode).find('input[type="text"]').val();
          value = value ? parseInt(value) : 0;
          cstCount += value;
        }
        $(parentNode).find('input[type="text"]').val(cstCount);
      }
    }
  },
  getArrayIndex: function(id, array) {
    for (var j = 0; j < array.length; j++) {
      if (array[j].id && id == array[j].id) {
        return j;
      }
    }
    return -1;
  },
  getSelectedRows: function(elementId) {
    var inputCheckboxArray = $(elementId).find('table tbody').find('input[type="checkbox"]');
    var rowsArray = [];
    for (var i = 0; i < inputCheckboxArray.length; i++) {
      var checked = $(inputCheckboxArray[i]).prop('checked');
      var trElement = $(inputCheckboxArray[i]).parent().parent();
      if (checked && !this.hasChildrenNodeSelected(trElement)) {
        rowsArray.push(trElement);
      }
    }
    return rowsArray;
  },
  hasChildrenNodeSelected: function(element) {
    //子节点是否选中
    var id = $(element).find('input[type="hidden"]').val();
    var nodeArray = $(element).parent().find('input[name="' + id + '"]');
    for (var i = 0; i < nodeArray.length; i++) {
      var nextNode = $(nodeArray[i]).parent().next();
      var checked = $(nextNode).find('input[type="checkbox"]').prop('checked');
      if (checked) {
        return true;
      }
    }
    return false;
  },
  clear: function(id) {
    $(id).find('table tbody').find('input[type="text"]').val('0');
  },
  isEmpty: function(data) {
    return !data ? true : false;
  },
  toJson: function(data) {
    return eval('(' + data + ')');
  }
};
/**
 * tree组件
 */

(function() {
  var tm = `<div id="v-tree">
              <ul>
                <li v-for="(item,index) in rowdata">
                  <div class="tree-title">
                    <div class="lf">
                      <i class="fa" :class="{'fa-minus-square-o':activeTree.indexOf(index) != -1,'fa-plus-square-o':activeTree.indexOf(index) == -1}" @click="treeClick(index)"></i>
                      <span v-text="item.teamName" @click="treeClick(index)"></span>
                    </div>
                    <div class="rt">
                      <input type="checkbox" @click.stop="teamClick(index,item.teamId,item.teamName)"/>
                    </div> 
                  </div> 
                  <ul class="tree-content" v-show="activeTree.indexOf(index) != -1">
                    <li v-for="child in item.children">
                      <div class="lf">
                        <span v-text="child.realName"></span>
                      </div>
                      <div class="rt">
                        <input type="checkbox" @click.stop="userClick(index,child.userId,child.realName)"/>
                      </div>  
                    </li>
                  </ul>
                </li>
              </ul>
              <div class="col-xs-12 text-center m-t m-b">
                <button class="btn btn-primary" type="button" @click="getResult">保存</button>
              </div>
            </div>`;


  var teamIds = []; //组id
  var teamNames = []; //组名
  var userIds = []; //用户id
  var userNames = [] //用户名

  var caCheIds = []; //缓存用户id
  var caCheNames = []; //缓存用户名

  //组件
  var tree = Vue.extend({
    template: tm,
    props: {
      rowdata: {
        type: [Array],
        required: true
      },
      showchild: {
        type: [Boolean],
        required: true
      },
      callback: {
        default: function() {
          return function callback() {
            // todo
          }
        }
      }
    },
    data: function() {
      return {
        activeTreeArr: [] //显示的父级index
      }
    },
    computed: {
      activeTree: function() {
        return this.activeTreeArr;
      }
    },
    beforeUpdate: function() {

      var len = this.rowdata.length;

      if (teamIds.length != 0 || teamNames.length != 0 || userIds.length != 0 || userNames.length != 0) {
        return;
      }

      for (var i = 0; i < len; i++) {
        teamIds.push('');
        teamNames.push('');
        userIds.push([]);
        userNames.push([]);
        caCheIds.push([]);
        caCheNames.push([]);

        if (this.showchild) this.activeTree.push(i);
      }

    },
    methods: {
      //组件数据清空
      clear: function() {

        this.activeTree = [];

        teamIds = [];
        teamNames = [];

        for (var i = 0; i < this.rowdata.length; i++) {
          userIds[i] = [];
          userNames[i] = [];
          caCheIds[i] = [];
          caCheNames[i] = [];
        }

      },
      //数组去除假值元素及空数组
      compact: function(arr) {
        var outArr = [];
        for (var v in arr) {
          if (arr[v] && arr[v].length != 0) outArr.push(arr[v]);
        }
        return outArr;
      },
      //树级展开
      treeClick: function(index) {
        var i = this.activeTree.indexOf(index);

        if (i == -1) {
          this.activeTree.push(index);
        } else {
          this.activeTree.splice(i, 1);
        }
      },
      //选择组
      teamClick: function(arrIndex, teamId, teamName) {
        var index = teamIds.indexOf(teamId);

        if (index == -1) {
          teamIds[arrIndex] = teamId;
          teamNames[arrIndex] = teamName;
        } else {
          teamIds[arrIndex] = '';
          teamNames[arrIndex] = '';

          //还原已选择的组员数据
          userIds[arrIndex] = caCheIds[arrIndex];
          userNames[arrIndex] = caCheNames[arrIndex];
        }
      },
      //选择组员
      userClick: function(arrIndex, userId, userName) {

        //是否已存在用户数组
        var idIndex = userIds[arrIndex].indexOf(userId);
        var nameIndex = userNames[arrIndex].indexOf(userName);

        if (idIndex == -1) {
          userIds[arrIndex].push(userId);
        } else {
          userIds[arrIndex].splice(idIndex, 1);
        }

        if (nameIndex == -1) {
          userNames[arrIndex].push(userName);
        } else {
          userNames[arrIndex].splice(nameIndex, 1);
        }

      },
      getResult: function() {

        for (let i = 0; i < teamIds.length; i++) {
          //选择了组则清空选择当前组的组员，放入缓存
          if (teamIds[i] && teamIds[i] != '') {
            caCheIds[i] = userIds[i];
            caCheNames[i] = userNames[i];

            userIds[i] = [];
            userNames[i] = [];
          }
        }

        var result = {
          teamIds: this.compact(teamIds),
          teamNames: this.compact(teamNames).join(','),
          userIds: this.compact(userIds).join(',').split(','),
          userNames: this.compact(userNames).join(',')
        }

        //返回选择的数据
        this.callback(result);

      }
    }
  })

  window.vtree = tree;

})()
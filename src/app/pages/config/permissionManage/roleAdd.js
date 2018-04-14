/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        }
    }).controller('roleAddCtrl', roleAddCtrl);

    /** @ngInject */
    function roleAddCtrl($scope, $rootScope, httpFactory, lotteryConst, custNotify) {
        var numId = [];
        $scope.tree = [];
        $scope.entity = {
            roleName: null,
            description: null,
            resIds: null
        };


        if ($rootScope.edit == 'edit') {
            $scope.title="修改角色";
            httpFactory.getList(lotteryConst.aresAccount + '/role/get?roleId=' + $rootScope.cid, 'GET', null, null).then(function (data) {
                $scope.entity.roleName = data.data.name;
                $scope.entity.description = data.data.description;
                $scope.entity.resIds = data.data.resIds;
                Array.prototype.push.apply(numId, data.data.resIds);
                //console.log($scope.entity.resIds)

            });
        } else {
            $scope.entity.roleName = '';
            $scope.entity.description = '';
            $scope.entity.resIds = '';
            $scope.title="新增角色";

        }

        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            for (var i = 0; i < $scope.entity.resIds.length; i++) {
                $(".name" + $scope.entity.resIds[i]).prop("checked", true);
                setCheckedFlagTrue($scope.entity.resIds[i]);

            }


           function setCheckedFlagTrue(param) {
               for (var k = 0; k < $scope.tree.length; k++) {
                   if ($scope.tree[k].id == param) {
                       $scope.tree[k].checkedFlag = true;
                       //console.log($scope.tree[k].checkedFlag);
                         return
                   }
                   if ($scope.tree[k].nodes.length > 0) {
                       for (var j = 0; j < $scope.tree[k].nodes.length; j++) {
                           if ($scope.tree[k].nodes[j].id == param) {
                               $scope.tree[k].nodes[j].checkedFlag = true;
                               return
                           }
                           if ($scope.tree[k].nodes[j].nodes.length > 0) {
                               for (var v = 0; v < $scope.tree[k].nodes[j].nodes.length; v++) {
                                   if ($scope.tree[k].nodes[j].nodes[v].id == param) {
                                      // console.log(v)
                                       $scope.tree[k].nodes[j].nodes[v].checkedFlag = true;
                                       return

                                   }
                               }
                           }
                       }
                   }

               }
           }

        });

        httpFactory.getList(lotteryConst.aresAccount+"/res/list", "GET").then(function (data) {
            var lists = data.data.rows;

            function createTreeData(nodes, id) {
                var id = id || 0;
                for (var i = 0; i < lists.length; i++) {
                    var node = lists[i];

                    if (node.parentId == id) {
                        var newNode = {
                            id: node.id,
                            text: node.name,
                            nodes: [],
                            flag: false,
                            checkedFlag: false,
                            idName: "name" + node.id
                        };
                        nodes.push(newNode);
                        createTreeData(newNode.nodes, newNode.id);
                    }
                }
            }

            createTreeData($scope.tree);


        });

        $scope.showLevelOne = function (e, self) {
            e.stopPropagation();
            self.item.flag == false ? self.item.flag = true : self.item.flag = false;
        };
        $scope.showLeveTwo = function (e, self) {
            e.stopPropagation();
            self.key.flag == false ? self.key.flag = true : self.key.flag = false;
        };
        $scope.showLeveThree = function (e) {
            e.stopPropagation();

        };
        $scope.selectAll = function (e, self) {
            var arr = [];
            var nodes = self.item.nodes;
            e.stopPropagation();
            e.preventDefault();
            $("#" + self.item.id).find("input").each(function (i, el) {
                arr.push(Number($(this).attr("data-id")));

            })
            if (self.item.checkedFlag) {
                $("#" + self.item.id).find(".two_le_in").prop("checked", false);
                $("#" + self.item.id).find(".one_le_in").prop("checked", false);
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].checkedFlag = false;
                    if (nodes[i].nodes.length > 0) {
                        for (var k = 0; k < nodes[i].nodes.length; k++) {
                            nodes[i].nodes[k].checkedFlag = false;
                        }
                    }
                }
                self.item.checkedFlag = false;
                removeArrValue(arr);
                $scope.entity.resIds = numId.toString();
                //console.log(numId);
                //console.log($scope.entity.resIds);

            } else {
                $("#" + self.item.id).find(".two_le_in").prop("checked", true);
                $("#" + self.item.id).find(".one_le_in").prop("checked", true);
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].checkedFlag = true;
                    if (nodes[i].nodes.length > 0) {
                        for (var k = 0; k < nodes[i].nodes.length; k++) {
                            nodes[i].nodes[k].checkedFlag = true
                        }
                    }
                }
                self.item.checkedFlag = true;
                Array.prototype.push.apply(numId, arr);
                numId =unique(numId);
                $scope.entity.resIds = numId.toString();
                //console.log(numId);
                //console.log($scope.entity.resIds);

            }


        };
        $scope.selectCurrent = function (e, self) {
            var arr = [];
            var selectArr = [];
            var selectArr2=[];
            var selectFlag;
            var selectFlag2;
            var parentNodes = self.key.nodes;
            var parentsNodes=self.item.nodes;
            e.stopPropagation();
            e.preventDefault();
            function isSelect(item) {
                return item == true
            }

            $("#" + self.k.id).find("input").each(function (i, el) {
                arr.push(Number($(this).attr("data-id")));

            });

            if (self.k.checkedFlag) {
                $("#" + self.k.id).find(".three_le_in").prop("checked", false);
                self.k.checkedFlag = false;
                for (var i = 0; i < parentNodes.length; i++) {
                    selectArr.push(parentNodes[i].checkedFlag)
                }

                selectFlag = selectArr.some(isSelect);


                if (selectFlag) {
                    $("#" + self.item.id).find(".one_le_in").prop("checked", true);
                    $("#" + self.key.id).find(".two_l_input").prop("checked", true);
                    self.key.checkedFlag = true;
                    self.item.checkedFlag = true;
                    numId.push(self.item.id, self.key.id);
                    numId = unique(numId);
                    $scope.entity.resIds = numId.toString();
                   // console.log($scope.entity.resIds)

                } else {
                    //$("#" + self.item.id).find(".one_le_in").prop("checked", false);
                    $("#" + self.key.id).find(".two_l_input").prop("checked", false);
                    self.key.checkedFlag = false;
                    //self.item.checkedFlag = false;
                    removeArrValue([ self.key.id]);
                    //$scope.entity.resIds = numId.toString();

                }
                for (var i = 0; i < parentsNodes.length; i++) {
                    selectArr2.push(parentsNodes[i].checkedFlag)
                }
                selectFlag2 = selectArr2.some(isSelect);
                if(selectFlag2){

                }else {
                    $("#" + self.item.id).find(".one_le_in").prop("checked", false);
                    removeArrValue([ self.item.id]);
                    self.item.checkedFlag = false;
                }
                removeArrValue(arr);
                $scope.entity.resIds = numId.toString();
                //console.log(numId)
                //console.log($scope.entity.resIds)


            } else {
                $("#" + self.k.id).find(".three_le_in").prop("checked", true);
                self.k.checkedFlag = true;
                for (var i = 0; i < parentNodes.length; i++) {
                    selectArr.push(parentNodes[i].checkedFlag)
                }

                selectFlag = selectArr.some(isSelect);
                if (selectFlag) {
                    $("#" + self.item.id).find(".one_le_in").prop("checked", true);
                    $("#" + self.key.id).find(".two_l_input").prop("checked", true);
                    self.key.checkedFlag = true;
                    self.item.checkedFlag = true;
                    numId.push(self.item.id, self.key.id);
                    numId =unique(numId);
                    $scope.entity.resIds = numId.toString();


                } else {
                    //$("#" + self.item.id).find(".one_le_in").prop("checked", false);
                    $("#" + self.key.id).find(".two_l_input").prop("checked", false);
                    self.key.checkedFlag = false;
                    //self.item.checkedFlag = false;
                    removeArrValue([ self.key.id]);
                    $scope.entity.resIds = numId.toString();

                }
                Array.prototype.push.apply(numId, arr);
                $scope.entity.resIds = numId.toString();
                //console.log(numId);
               //console.log($scope.entity.resIds);

            }


        };
        $scope.selectChild = function (e, self) {
            var arr = [];
            var selectArr = [];
            var nodes = self.key.nodes;
            var selectFlag;
            var parentNodes = self.item.nodes;

            function isSelect(item) {
                return item == true
            }

            e.stopPropagation();
            e.preventDefault();
            ;$("#" + self.key.id).find("input").each(function (i, el) {
                arr.push(Number($(this).attr("data-id")));

            });

            if (self.key.checkedFlag) {

                $("#" + self.key.id).find(".three_le_in").prop("checked", false);
                $("#" + self.key.id).find(".two_l_input").prop("checked", false);
                self.key.checkedFlag = false;
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].checkedFlag = false;
                }
                for (var i = 0; i < parentNodes.length; i++) {
                    selectArr.push(parentNodes[i].checkedFlag)
                }
                selectFlag = selectArr.some(isSelect);

                if (selectFlag) {
                    $("#" + self.item.id).find(".one_le_in").prop("checked", true);
                    self.item.checkedFlag = true;
                    numId.push(self.item.id);
                    numId =unique(numId);
                    $scope.entity.resIds = numId.toString();
                } else {
                    $("#" + self.item.id).find(".one_le_in").prop("checked", false);
                    self.item.checkedFlag = false;
                    removeArrValue([self.item.id]);
                    $scope.entity.resIds = numId.toString();

                }
                removeArrValue(arr);
                $scope.entity.resIds = numId.toString();
                //console.log(numId);
                //console.log($scope.entity.resIds);

            } else {
                $("#" + self.key.id).find(".three_le_in").prop("checked", true);
                $("#" + self.key.id).find(".two_l_input").prop("checked", true);
                self.key.checkedFlag = true;
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].checkedFlag = true;

                }


                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].checkedFlag = false;
                }
                for (var i = 0; i < parentNodes.length; i++) {
                    selectArr.push(parentNodes[i].checkedFlag)
                }
                selectFlag = selectArr.some(isSelect);
                if (selectFlag) {
                    $("#" + self.item.id).find(".one_le_in").prop("checked", true);
                    self.item.checkedFlag = true;
                    numId.push(self.item.id);
                    numId = unique(numId);
                    $scope.entity.resIds = numId.toString();

                } else {
                    $("#" + self.item.id).find(".one_le_in").prop("checked", false);
                    self.item.checkedFlag = true;
                    removeArrValue([self.item.id]);
                    $scope.entity.resIds = numId.toString();
                }
                Array.prototype.push.apply(numId, arr);
                $scope.entity.resIds = numId.toString();
                //console.log(numId);
               //console.log($scope.entity.resIds);
            }


        };
        $scope.onSave = function () {
            if ($rootScope.edit == 'edit') {
                update();
            } else {
                save();
            }
        };

        function update() {
            var data = {
                roleName: $scope.entity.roleName,
                description: $scope.entity.description,
                resIds: $scope.entity.resIds
            };
            data.roleId = $rootScope.cid;
            var url = lotteryConst.aresAccount + '/role/update?' + assemReqParams(data);
            httpFactory.getList(url, 'POST', null, null).then(function (data) {
                custNotify.success(lotteryConst.msgEdit.success, '提示:');
                $scope.$dismiss();
                $rootScope.roleSearch();
            }, function(err){
                custNotify.error(lotteryConst.msgSelect.fail,  '提示:');
            });
        }

        function removeArrValue(param) {
            function getArrIndexof(param) {
                var indexArr = [];
                for (var i = 0; i < numId.length; i++) {
                    if (param.length == 1) {
                        if (numId[i] == param[0]) {
                            indexArr.push(i)
                        }
                    } else {
                        for (var k = 0; k < param.length; k++) {
                            if (numId[i] == param[k]) {
                                indexArr.push(i)

                            }

                        }
                    }

                }
                return indexArr
            }

            var resultArr = getArrIndexof(param).reverse();

            if (resultArr.length == 1) {
                numId.splice(resultArr[0], 1)
            } else {
                for (var i = 0; i < resultArr.length; i++) {
                    numId.splice(resultArr[i], 1)
                }
            }

        }

          function unique (arr) {
              arr.sort();
            var re = [arr[0]];
            for (var i = 1; i < arr.length; i++) {
                if (arr[i] !== re[re.length - 1]) {
                    re.push(arr[i]);
                }
            }
            return re;
        }

        function save() {
            var data = {
                roleName: $scope.entity.roleName,
                description: $scope.entity.description,
                resIds: $scope.entity.resIds
            };
            var url = lotteryConst.aresAccount + '/role/add?' + assemReqParams(data);
            httpFactory.getList(url, 'POST', null, null).then(function (data) {
                custNotify.success(lotteryConst.msgAdd.success, '提示:');
                $scope.$dismiss();
                $rootScope.roleSearch();
            }, function(err){
                custNotify.error(lotteryConst.msgSelect.fail,  '提示:');
            });
        }

        function assemReqParams(params) {
            var paramsConcat = "";
            if (params.roleName) {
                paramsConcat += ("roleName=" + params.roleName);
            }
            if(params.description) {
                paramsConcat += ("&description=" + params.description);
            }
            if (params.resIds) {
                paramsConcat += ("&resIds=" + params.resIds);
            }
            if(params.roleId) {
                paramsConcat += ("&roleId=" + params.roleId);
            }
            return paramsConcat;
        }

    }
})();


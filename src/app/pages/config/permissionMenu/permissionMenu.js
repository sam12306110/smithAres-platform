/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('permissionMenuCtrl', permissionMenuCtrl);

    /** @ngInject */
    function permissionMenuCtrl($scope, $rootScope, httpFactory, lotteryConst, custNotify, $uibModal, common,todoService) {

        $scope.selectArr=[];
        $scope.selectParam = {
            lottery: [],
            status: lotteryConst.status,
            statusSelected: null
        };



        /*-----------------资源--------------------*/
        /**
         * 条件搜索
         */
        $rootScope.resSearch = function () {
            if ($scope.selectParam.statusSelected) {
                $scope.queryParam.status = $scope.selectParam.statusSelected.id;
            }

            httpFactory.getList(lotteryConst.aresAccount + '/res/list', 'GET', null, null).then(function (data) {
               var lists = data.data.rows;
               //console.log(lists)
                $scope.tree = [];
                function createTreeData(nodes, id) {
                    var id = id || 0;
                    for (var i = 0; i < lists.length; i++) {
                        var node = lists[i];

                        if (node.parentId == id) {
                            var newNode = {
                                id: node.id,
                                name: node.name,
                                nodes: [],
                                type: node.type,
                                level: node.level,
                                leaf:node.leaf,
                                staticUrl:node.staticUrl,
                                reqUri:node.reqUri,
                                icon:node.icon,
                                createTime:node.createTime,
                                description:node.description,
                                flag: false,
                                checkedFlag: false,
                                parentId:node.parentId,
                                engKey:node.engKey

                            };
                            nodes.push(newNode);
                            createTreeData(newNode.nodes, newNode.id);
                        }
                    }
                }

                createTreeData($scope.tree);
            }, function (data) {

            });
        };


        $scope.showLevel = function (e, self) {
            e.stopPropagation();
            !self.flag ? self.flag = true : self.flag = false;
        };
        // $scope.openResEdit = function (edit, cid) {
        //     $rootScope.cid = cid;
        //     $scope.open('app/pages/config/permissionMenu/permissionMenuAdd.html', 'md', edit);
        //
        // };
        // $scope.openResMenuEdit = function (edit, itemObj) {
        //     $rootScope.itemObj = itemObj;
        //     $scope.open('app/pages/config/permissionMenu/permissionMenuAdd.html', 'lg', edit);
        // };
        $rootScope.resSearch();
        function open(page, size) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size
            });
            modalInstance.result.then(function (result) {
                //$scope.tree = [];
               $rootScope.resSearch();
            }, function (reason) {
                //console.log(reason);
                //$scope.tree = [];
                $rootScope.resSearch();
            });
        }
        $scope.selectCurrent=function (e,curr,parent) {
            var currId=curr.id;
            e.stopPropagation();
            e.preventDefault();
            $scope.selectArr=[];
            for(var i=0; i<parent.length;i++){
                if(parent[i].nodes.length>0){
                    for(var j=0;j<parent[i].nodes.length;j++){
                        parent[i].nodes[j].checkedFlag=false;
                    }
                }
            }
            if(curr.checkedFlag){
                $scope.selectArr=[];
                for(var i=0;i<parent.length;i++){
                    parent[i].checkedFlag=false;
                }
            }else {
                for(var i=0;i<parent.length;i++){
                    if(parent[i].id==currId){
                        parent[i].checkedFlag=true;
                        $scope.selectArr.push(curr);

                    }else {
                        parent[i].checkedFlag=false;
                    }
                }
            }

        };

       $scope.selectChild=function (e,curr,parent) {
            var currId=curr.id;
            e.stopPropagation();
            e.preventDefault();
           $scope.selectArr=[];
            for(var k=0;k<parent.length;k++){
                parent[k].checkedFlag=false;
            }
            if(curr.checkedFlag){
                $scope.selectArr=[];
                for(var i=0; i<parent.length;i++){
                    if(parent[i].nodes.length>0){
                        for(var j=0;j<parent[i].nodes.length;j++){
                            parent[i].nodes[j].checkedFlag=false;
                        }
                    }
                }
            }else {
                $scope.selectArr.push(curr);
                for(var i=0; i<parent.length;i++){
                    if(parent[i].nodes.length>0){
                        for(var j=0;j<parent[i].nodes.length;j++){
                            if(parent[i].nodes[j].id==currId){
                                parent[i].nodes[j].checkedFlag=true;

                            }else {
                                parent[i].nodes[j].checkedFlag=false;
                            }

                        }
                    }
                }
            }
        }

        
        $scope.openRerMenuAdd = function (selectArr) {
            if(selectArr.length>0){
                todoService.set({
                    edit: null,
                    item: selectArr,
                    flag:false

                });
            }else {
                todoService.set({
                    flag:true,
                    edit: null
                });
            }



            open('app/pages/config/permissionMenu/permissionMenuAdd.html', 'lg');
        };
        $scope.openResEdit =function (edit,item,parentItem) {
            var parentItem=parentItem ||"";
            todoService.set({
                edit: "edit",
                item: item,
                parentItem:parentItem

            });
            open('app/pages/config/permissionMenu/permissionMenuAdd.html', 'lg');
        }


    }

})();


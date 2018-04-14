/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('periodManageAddCtrl', periodManageAddCtrl);

    /** @ngInject */
    function periodManageAddCtrl($scope, $rootScope, httpFactory, lotteryConst, custNotify,todoService) {
        var url = lotteryConst.aresAccount;
        $scope.resultFlag= todoService.get().flag;
        $scope.resultData=todoService.get().item;
        $scope.edit=todoService.get().edit;
        $scope.level='';
        $scope.leafNodes=1;
        $scope.status=1;
        $scope.typeMenu=1;
        $scope.parentName='';
        $scope.selectParam = {
            name: "",
            engKey: "",
            parentId:"",
            type:$scope.typeMenu,
            level:'',
            leaf:$scope.leafNodes,
            resUri:"",
            status:$scope.status,
            sort:"",
            description:"",
            staticUrl:"",
            icon:""
        };
        console.log($scope.edit);
        function assignmentFrom(obj) {
            $scope.selectParam.parentId=obj.parentId;
            $scope.selectParam.engKey=obj.engKey;
            $scope.selectParam.level=obj.level;
            $scope.selectParam.name=obj.name;
            $scope.selectParam.description=obj.description;
            $scope.selectParam.icon=obj.icon;
            $scope.selectParam.resUri=obj.resUri;
            $scope.selectParam.staticUrl=obj.staticUrl;
        }

        if($scope.edit=="edit"){
            var parentItem=todoService.get().parentItem;
            $scope.title="修改权限";
            //console.log(Object.prototype.toString.call($scope.resultData));
            assignmentFrom($scope.resultData)

            if($scope.selectParam.level==1){
                $scope.level="一级"
            }
            if($scope.selectParam.level==2){
                $scope.level="二级"
            }
            if($scope.selectParam.level==3){
                $scope.level="三级"
            }
            if(!!parentItem){
                $scope.parentName=parentItem.name
            }
            $scope.selectParam.resId=$scope.resultData.id
            //console.log($scope.resultData);
            //console.log(parentItem)
        }else {
            $scope.title="新增权限";
            if($scope.resultFlag){
                $scope.selectParam.parentId=0;
                $scope.selectParam.level=1;
                $scope.level="一级";
            }else {
                //console.log($scope.resultData[0].id);
                //console.log($scope.resultData[0].level+1);
                //console.log($scope.resultData[0].name);
                $scope.selectParam.parentId=$scope.resultData[0].id;
                $scope.parentName=$scope.resultData[0].name;
                $scope.selectParam.level=$scope.resultData[0].level+1;
                if($scope.selectParam.level==2){
                    $scope.level="二级"
                }
                if($scope.selectParam.level==3){
                    $scope.level="三级"
                }
            }

        }

        $scope.onSave = function () {
            if($scope.edit=="edit"){
                //console.log($scope.selectParam)
                $.ajax({
                    url: url + '/res/update',
                    type: 'POST',
                    data: $scope.selectParam,
                    timeout:15000
                }).done(function (res) {
                    custNotify.success(lotteryConst.msgAdd.success, '提示:');
                    $scope.$dismiss();

                }).fail(function () {
                    custNotify.error('操作提示' + data, '新增失败！');
                });
            }else {
                $.ajax({
                    url: url + '/res/add',
                    type: 'POST',
                    data: $scope.selectParam,
                    timeout:15000
                }).done(function (res) {
                    custNotify.success(lotteryConst.msgAdd.success, '提示:');
                    $scope.$dismiss();

                }).fail(function () {
                    custNotify.error('操作提示' + data, '新增失败！');
                });
            }

        };
    }
})();


/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('editDomian', editDomian);

    /** @ngInject */
    function editDomian($scope, httpFactory, lotteryConst, todoService, custNotify) {
        $scope.selectParam = {
            memberLevelSelected: null,
            memberLevel: [],
            rsUrl: [],
            ringhtRsUrl: []
        };
        $scope.entity = {
            agnetId:'',
            cids:[]

        };
       var headers={
            "Content-Type":"application/x-www-form-urlencoded"
        };
       var data= todoService.get().data;

       console.log(data);
        if(data.domains){
            $scope.selectParam. ringhtRsUrl=data.domains
        }
        //获取域名列表
        httpFactory.getList(lotteryConst.aresPathPlat + '/domain/listAgent', 'GET', null, null).then(function (result) {
            //console.log(result.data)
            if (result.data) {
                $scope.selectParam.rsUrl = result.data;
                //console.log(result.data)

            }
            //console.log($scope.selectParam.memberLevel)
        }, function (data) {

        });
        //移除当前的域名
        $scope.removeCurrentEl=function (item) {
            $scope.selectParam.rsUrl=$scope.selectParam.rsUrl.filter(function (el) {
                return el.value !==item.value
            });
            $scope.selectParam.ringhtRsUrl.push(item)

        };
        $scope.removeCurrentEl2=function (item) {
            $scope.selectParam.ringhtRsUrl=$scope.selectParam.ringhtRsUrl.filter(function (el) {
                return el.value !==item.value
            });
            $scope.selectParam.rsUrl.push(item)

        };

       $scope.onSave = function () {
           if(data.agentId){
               $scope.entity.agnetId=data.agentId;
           }
            if($scope.selectParam.ringhtRsUrl){
                for(var i=0;i<$scope.selectParam.ringhtRsUrl.length;i++){
                    $scope.entity.cids.push($scope.selectParam.ringhtRsUrl[i].id)
                }
            }
           /* if(!$scope.entity.cids.length){
                $scope.$dismiss();
                return false
            }*/


            httpFactory.getList(lotteryConst.aresPathPlat + '/domain/updateDomainByAgent', 'POST', headers,httpFactory.generateRequestFromJson($scope.entity) ).then(function (result) {
                custNotify.success('修改成功！', '提示:');
                $scope.$dismiss();
            }, function (result) {
                custNotify.error('修改失败！', '提示:');
            });
        }
    }
})();
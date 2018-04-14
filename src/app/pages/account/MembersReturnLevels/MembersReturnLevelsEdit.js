/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('MembersReturnLevelsEdit', MembersReturnLevelsEdit);

    /** @ngInject */
    function MembersReturnLevelsEdit($scope, httpFactory, lotteryConst, custNotify, todoService, common, $filter) {
        var url = lotteryConst.uaaPathPlat ;

        $scope.entity = {
            cids:todoService.get().cid.toString(),
            levelId:''
        };
        $scope.selectParam = {


        };

        //获取会员层级列表

        httpFactory.getList(lotteryConst.uaaPathPlat + '/memberLevel/getSelectList', 'GET', null, null).then(function (result) {
            //console.log(result)
            if (result.data) {
                $scope.selectParam.memberLevel = result.data;

            }
            //console.log($scope.selectParam.memberLevel)
        }, function (data) {

        });



        $scope.onSave = function () {
            if(!$scope.selectParam.memberLevelSelected){
                custNotify.warning('操作提示', '请选择会员层级！');
                return false
            }
            if( $scope.selectParam.memberLevelSelected){
                $scope.entity.levelId=$scope.selectParam.memberLevelSelected.id;
            }
            var headers={
                "Content-Type":"application/x-www-form-urlencoded"
            }
            httpFactory.getList(lotteryConst.uaaPath + '/api/plat/memberLevel/levelBackUpdate?cids=' + todoService.get().cid.toString() + '&levelId=' + $scope.selectParam.memberLevelSelected.id, 'POST', headers, null).then(function (result) {
                custNotify.success('操作提示', '新增成功！');
                $scope.$dismiss();
            }, function (data) {
                custNotify.error('操作提示', '新增失败！');
            });
        };


    }

})();


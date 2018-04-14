/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('editLevel', editLevel);

    /** @ngInject */
    function editLevel($scope, httpFactory, lotteryConst, todoService, custNotify) {
        $scope.selectParam = {
            memberLevelSelected: null,
            memberLevel: []
        };


        $scope.entity = todoService.get().item;
        httpFactory.getList(lotteryConst.uaaPathPlat + '/memberLevel/getSelectList', 'GET', null, $scope.entity).then(function (result) {
            if (result.data) {
                $scope.selectParam.memberLevel = result.data;
                $scope.selectParam.memberLevel.forEach(function (row) {
                    if (row.id == $scope.entity.cid) {
                        $scope.selectParam.memberLevelSelected = row;
                    }
                    if (!$scope.selectParam.memberLevelSelected) {
                        $scope.selectParam.memberLevelSelected = $scope.selectParam.memberLevel[0];
                    }
                });
            }
        }, function (data) {

        });
        $scope.onSave = function () {
            var memberId = todoService.get().memberId;
            if ($scope.selectParam.memberLevelSelected) {
                var levelId = $scope.selectParam.memberLevelSelected.id;
            }
            httpFactory.getList(lotteryConst.uaaPath + '/apis/data/member/levelChange/' + memberId + '/' + levelId, 'GET', null, null).then(function (result) {
                custNotify.success('修改成功！', '提示:');
                $scope.$dismiss();
            }, function (result) {
                custNotify.error('修改失败！', '提示:');
            });
        }
    }
})();
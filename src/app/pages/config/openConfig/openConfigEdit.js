/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('openConfigEdit', openConfigEdit);

    /** @ngInject */
    function openConfigEdit($scope, httpFactory, lotteryConst, custNotify, todoService) {
        var url = lotteryConst.aresPath + '/openConfig';
        $scope.selectParam = {
            lottery: lotteryConst.lottery,
            lotterySelected: null
        };
        $scope.entity = {
            lotteryId: null,
            name: null,
            waitOpenTime: null,
            officialOpenTime: null,
            closeBeforeEndTime: null,
            openCheckTime: null
        };


        $scope.selectParam.lotterySelected = $scope.selectParam.lottery[0];
        $scope.edit = todoService.get().edit;
        if (todoService.get().item) {
            $scope.entity = todoService.get().item;
            $scope.selectParam.lottery.forEach(function (row) {
                if ($scope.entity.lotteryId == row.id) {
                    $scope.selectParam.lotterySelected = row;
                }
            });
            $scope.titleName = "修改开奖参数";
        } else {
            $scope.titleName = "新增开奖参数";
        }


        $scope.onSave = function () {
            if ($scope.selectParam.lotterySelected) {
                $scope.entity.lotteryId = $scope.selectParam.lotterySelected.id;
                $scope.entity.name = $scope.selectParam.lotterySelected.value;
            }
            $scope.entity.waitOpenTime = $scope.entity.waitOpenTime || 0;
            $scope.entity.officialOpenTime = $scope.entity.officialOpenTime || 0;
            $scope.entity.closeBeforeEndTime = $scope.entity.closeBeforeEndTime || 0;
            $scope.entity.openCheckTime = $scope.entity.openCheckTime || 0;
            httpFactory.getList(url + '/save', 'POST', null, $scope.entity).then(function (result) {
                custNotify.success(lotteryConst.msgAdd.success, '提示:');
                $scope.$dismiss();
            }, function (data) {
                custNotify.error('新增失败！', '提示:');
            });
        };

    }

})();


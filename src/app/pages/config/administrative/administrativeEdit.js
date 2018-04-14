/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('administrativeEdit', administrativeEdit);

    /** @ngInject */
    function administrativeEdit($scope, httpFactory, lotteryConst, custNotify, todoService) {
        var url = lotteryConst.aresPathPlat + '/administrative';
        $scope.entity = {};
        $scope.edit = todoService.get().edit;
        if (todoService.get().item) {
            $scope.entity = todoService.get().item;
            $scope.entity.percentage = $scope.entity.percentage / 100;
            $scope.titleName = "修改行政成本";
        } else {
            $scope.titleName = "新增行政成本";
        }

        $scope.onSave = function () {
            if ($scope.entity.name == null || $scope.entity.percentage == null) {
                return;
            }
            var entity = {
                cid: $scope.entity.cid,
                percentage: $scope.entity.percentage * 100,
                name: $scope.entity.name
            };
            httpFactory.getList(url + '/save', 'POST', null, entity).then(function (result) {
                if (result.data === -1) {
                    custNotify.warning('名称重复', '提示：');
                    return false;
                }
                custNotify.success('操作成功', '提示：');
                $scope.$dismiss();
            }, function () {
                custNotify.error('操作失败', '提示：');
            });
        };
    }

})();


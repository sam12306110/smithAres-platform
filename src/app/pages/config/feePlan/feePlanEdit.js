/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('feePlanEdit', feePlanEdit);

    /** @ngInject */
    function feePlanEdit($scope, httpFactory, lotteryConst, custNotify, todoService) {
        var url = lotteryConst.aresPathPlat + '/feePlan';
        $scope.edit = todoService.get().edit;
        $scope.entity = {};
        if (todoService.get().item) {
            $scope.entity = todoService.get().item;
            $scope.entity.depositFeePer = $scope.entity.depositFeePer / 100;
            $scope.entity.depositFeeLimit = $scope.entity.depositFeeLimit / 100;
            $scope.entity.withdrawalFeePer = $scope.entity.withdrawalFeePer / 100;
            $scope.entity.withdrawalFeeLimit = $scope.entity.withdrawalFeeLimit / 100;
            $scope.titleName = "修改手续费设定";
        } else {
            $scope.titleName = "新增手续费设定";
        }

        $scope.onSave = function () {
            if ($scope.entity.name == null || $scope.entity.depositFeePer == null || $scope.entity.depositFeeLimit == null || $scope.entity.withdrawalFeePer == null || $scope.entity.withdrawalFeeLimit == null) {
                return;
            }
            var entity = {
                cid: $scope.entity.cid,
                name: $scope.entity.name,
                depositFeePer: $scope.entity.depositFeePer * 100,
                depositFeeLimit: $scope.entity.depositFeeLimit * 100,
                withdrawalFeePer: $scope.entity.withdrawalFeePer * 100,
                withdrawalFeeLimit: $scope.entity.withdrawalFeeLimit * 100
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


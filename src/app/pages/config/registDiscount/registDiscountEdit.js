/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('registDiscountEdit', registDiscountEdit);

    /** @ngInject */
    function registDiscountEdit($scope, httpFactory, lotteryConst, custNotify, todoService) {
        var url = lotteryConst.aresPathPlat + '/registDiscount';
        $scope.entity = {};
        $scope.edit = todoService.get().edit;
        if (todoService.get().item) {
            $scope.entity = todoService.get().item;
            $scope.entity.discountedPrice = $scope.entity.discountedPrice / 100;
            $scope.titleName = "修改注册优惠";
        } else {
            $scope.titleName = "新增注册优惠";
        }

        $scope.onSave = function () {
            if ($scope.entity.name == null || $scope.entity.discountedPrice == null || $scope.entity.auditMultiple == null) {
                return;
            }
            var entity = {
                cid: $scope.entity.cid,
                name: $scope.entity.name,
                discountedPrice: $scope.entity.discountedPrice * 100,
                auditMultiple: $scope.entity.auditMultiple
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


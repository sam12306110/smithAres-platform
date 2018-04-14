/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('chaseOrderDetailCtrl', chaseOrderDetailCtrl);

    /** @ngInject */
    function chaseOrderDetailCtrl(lotteryConst, $scope, httpFactory,
                                  chaseOrderOfficialConfigVarHolder, custNotify,
                                  $uibModal, common,
                                  $rootScope) {

        $scope.getDetail = function () {
            var queryParam = {
                orderId: chaseOrderOfficialConfigVarHolder.orderId,
            }
            httpFactory.getList(chaseOrderOfficialConfigVarHolder.getChaseOrderDetailURL(), 'GET', null,
                queryParam
            ).then(function (data) {
                $scope.order = data.data.order
            }, function (data) {
                custNotify.error("错误提示", "加载详情失败");
                $scope.$dismiss();
            });
        }

        $scope.stopChase = function () {
            custNotify.error("功能待完善", "TODO");
        }

        $scope.openOrderDetail = function (orderId) {
            //我不想用rootscope，但详情页是这么实现的
            $rootScope.orderId = orderId;
            common.open('app/pages/plan/order/official/orderOfficialEdit.html', 'lg');
        }

        $scope.getDetail();

    }
})();





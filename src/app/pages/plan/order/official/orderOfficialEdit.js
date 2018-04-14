/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('orderOfficialEditCtrl', orderOfficialEditCtrl);

    /** @ngInject */
    function orderOfficialEditCtrl($scope, httpFactory, lotteryConst, todoService, custNotify) {
        var url = lotteryConst.hemes + '/apis/order/management';

        httpFactory.getList(url + '/orderDetail', 'GET', null, {
            orderId: todoService.get().orderId
        }).then(function (data) {
            $scope.detail = data.data.order
        }, function (data) {

        });
        var lock = false;
        $scope.cancelOrder = function (orderId) {
            $.ajax({
                url: url + '/repeal',
                data: {
                    orderId: orderId
                },
                type: 'post',
                dataType: 'json',
                success: function (result) {
                    if (result.err == 'SUCCESS') {
                        custNotify.success( '撤单成功！','提示');
                    } else {
                        custNotify.error( result.cnMsg || '无法撤单','提示');
                    }
                    $scope.$dismiss()
                },
                error: function (error) {
                    custNotify.error( '撤单失败！','提示');
                }
            });
        };

    }
})();
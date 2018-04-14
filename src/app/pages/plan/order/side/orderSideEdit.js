/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('orderSideEditCtrl', orderSideEditCtrl);

    /** @ngInject */
    function orderSideEditCtrl($scope, httpFactory, lotteryConst, todoService, custNotify) {
        var url = lotteryConst.hemes + '/apis/order/management';
        $scope.agentFlag=!lotteryConst.agentFlag
        $scope.selectParam = {
            lottery: lotteryConst.lottery,
            lotterySelected: null,
            payoffGroup: lotteryConst.payoffGroup
        };
        $scope.plays = lotteryConst.plays;

        if (todoService.get().edit == 'show' || todoService.get().edit == 'edit') {
            httpFactory.getList(url + '/view', 'GET', null, {
                id: todoService.get().cid
            }).then(function (data) {
                $scope.list = data.data;
            }, function (data) {

            });
        }

        $scope.detail = todoService.get().detail;
        httpFactory.getList(url + '/orderDetail', 'GET', null, {
            orderId: $scope.detail.orderId
        }).then(function (data) {
            $scope.detail = data.data.order
        }, function (data) {

        });
        $scope.oddsItem = []


        $scope.cancelOrder = function (orderId) {
            httpFactory.getList(url + '/repeal?orderId='+orderId, 'POST', null,null).then(function (result) {
                if (result.err == 'SUCCESS') {
                    custNotify.success('撤单成功！', '提示');
                } else {
                    custNotify.error(result.cnMsg || '无法撤单', '提示');
                }
                $scope.$dismiss()
            }, function (error) {
                custNotify.error('撤单失败！', '提示');
            });
           /* $.ajax({
                url: url + '/repeal',
                data: {
                    orderId: orderId
                },
                type: 'post',
                dataType: 'json',
                success: function (result) {
                    if (result.err == 'SUCCESS') {
                        custNotify.success('撤单成功！', '提示');
                    } else {
                        custNotify.error(result.cnMsg || '无法撤单', '提示');
                    }
                    $scope.$dismiss()
                },
                error: function (error) {
                    custNotify.error('撤单失败！', '提示');
                }
            });*/
        };
    }

})();
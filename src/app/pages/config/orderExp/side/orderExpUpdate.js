/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('orderExpSideUpdate', orderExpSideUpdate);

    /** @ngInject */
    function orderExpSideUpdate($scope, $rootScope, httpFactory, lotteryConst, $stateParams,
                                orderExpVarHolderSide, custNotify) {

        var riskManageBasePath = lotteryConst.riskManageBasePath;
        var orderExpPath = "/risk/orderExp";

        function getOrderExpResourcePath() {
            return riskManageBasePath + orderExpPath;
        }


        $scope.viewParam = {
            lotteryId: null,
            lotteryName: null,
            betMaxWinPay: null,
            betNumAllPercent: null,
            continueWinCount: null,
            continueWinPeriod: null,
            betMaxPrize: null,
            betMaxWinCountInOnePcode: null,
        };
        $scope.copyItemToView = function () {
            $scope.viewParam.lotteryId = orderExpVarHolderSide.item.lotteryId;
            $scope.viewParam.lotteryName = orderExpVarHolderSide.item.name;
            $scope.viewParam.betMaxWinPay = orderExpVarHolderSide.item.betMaxWinPay;
            $scope.viewParam.betNumAllPercent = orderExpVarHolderSide.item.betNumAllPercent;
            $scope.viewParam.continueWinCount = orderExpVarHolderSide.item.continueWinCount;
            $scope.viewParam.continueWinPeriod = orderExpVarHolderSide.item.continueWinPeriod;
            if (orderExpVarHolderSide.item.betMaxPrize != null ||
                orderExpVarHolderSide.item.betMaxPrize != undefined) {
                $scope.viewParam.betMaxPrize = orderExpVarHolderSide.item.betMaxPrize / 100;
            }
            $scope.viewParam.betMaxWinCountInOnePcode = orderExpVarHolderSide.item.betMaxWinCountInOnePcode;
        }
        $scope.copyItemToView();
        $scope.requestParam = {
            lotteryId: null,
            lotteryName: null,
            betMaxWinPay: null,
            betNumAllPercent: null,
            continueWinCount: null,
            continueWinPeriod: null,
            betMaxPrize: null,
            betMaxWinCountInOnePcode: null,
        };
        $scope.copyViewToRequest = function () {
            $scope.requestParam.lotteryId = $scope.viewParam.lotteryId;
            $scope.requestParam.lotteryName = $scope.viewParam.lotteryName;
            $scope.requestParam.betMaxWinPay = $scope.viewParam.betMaxWinPay;
            $scope.requestParam.betNumAllPercent = $scope.viewParam.betNumAllPercent;
            $scope.requestParam.continueWinCount = $scope.viewParam.continueWinCount;
            $scope.requestParam.continueWinPeriod = $scope.viewParam.continueWinPeriod;
            if ($scope.viewParam.betMaxPrize != null ||
                $scope.viewParam.betMaxPrize != undefined) {
                $scope.requestParam.betMaxPrize = $scope.viewParam.betMaxPrize * 100;
            }
            $scope.requestParam.betMaxWinCountInOnePcode = $scope.viewParam.betMaxWinCountInOnePcode;
        };

        $scope.onUpdate = function () {
            $scope.copyViewToRequest();
            httpFactory.getListByForm(orderExpVarHolderSide.getOrderExpResourcePath() + '/updateOrderExpConfig',
                'POST',
                $scope.requestParam
            ).then(function (data) {
                custNotify.success(lotteryConst.msgAdd.success, '提示:');
                $scope.$dismiss();
                $rootScope.onOrderExpSearch();
            }, function (data) {
                custNotify.error(lotteryConst.msgSelect.fail,  '提示:');
            });
        };

    }
})();


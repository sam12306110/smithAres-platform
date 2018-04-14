/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('orderExpUpdateCtrl', orderExpUpdateCtrl);

    /** @ngInject */
    function orderExpUpdateCtrl($scope, $rootScope, httpFactory, lotteryConst, $stateParams,
                                orderExpVarHolder, custNotify) {

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
            $scope.viewParam.lotteryId = orderExpVarHolder.item.lotteryId;
            $scope.viewParam.lotteryName = orderExpVarHolder.item.name;
            $scope.viewParam.betMaxWinPay = orderExpVarHolder.item.betMaxWinPay;
            $scope.viewParam.betNumAllPercent = orderExpVarHolder.item.betNumAllPercent;
            $scope.viewParam.continueWinCount = orderExpVarHolder.item.continueWinCount;
            $scope.viewParam.continueWinPeriod = orderExpVarHolder.item.continueWinPeriod;
            if (orderExpVarHolder.item.betMaxPrize != null ||
                orderExpVarHolder.item.betMaxPrize != undefined) {
                $scope.viewParam.betMaxPrize = orderExpVarHolder.item.betMaxPrize / 100;
            }
            $scope.viewParam.betMaxWinCountInOnePcode = orderExpVarHolder.item.betMaxWinCountInOnePcode;
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
            //Request -> FormData
            $scope.copyViewToRequest();

            $scope.copyViewToRequest();
            httpFactory.getList(orderExpVarHolder.getOrderExpResourcePath() + '/updateOrderExpConfig',
                'POST',
                $scope.requestParam
            ).then(function (data) {
                custNotify.success(lotteryConst.msgAdd.success, '提示:');
                $scope.$dismiss();
                // var orderExpModule = angular.module('BlurAdmin.pages.config.orderExp');
                // orderExpModule.onSearch();
                $rootScope.onOrderExpSearch();
            }, function (data) {
                custNotify.error(lotteryConst.msgSelect.fail, '提示:');
            });
        };

    }
})();


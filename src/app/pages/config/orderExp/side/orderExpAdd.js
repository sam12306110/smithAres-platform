/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('orderExpSideAdd', orderExpSideAdd);

    /** @ngInject */
    function orderExpSideAdd($scope, $rootScope, httpFactory, lotteryConst, custNotify,
                             orderExpVarHolder) {


        $scope.selectParam = {
            lottery: lotteryConst.lottery,
            selectedLottery: null,
            lotteryName: null
        };


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

        $scope.requestParam = {
            lotteryId: null,
            lotteryName: null,
            betMaxWinPay: null,
            betNumAllPercent: null,
            continueWinCount: null,
            continueWinPeriod: null,
            betMaxPrize: null,
            betMaxWinCountInOnePcode: null,
            sideType: 2
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
        }
        $scope.onSave = function () {
            //TODO:如果参数不正确，直接前端提示
            if ($scope.selectParam.selectedLottery == null) {
                custNotify.error("参数错误", "请选择彩种类型")
                return;
            } else {
                var selectLottery = $scope.selectParam.selectedLottery;
                $scope.viewParam.lotteryId = selectLottery.id;
                $scope.viewParam.lotteryName = selectLottery.value;
            }
            $scope.copyViewToRequest();
            //Request -> FormData
            var heads = {
                "Content-Type":"application/x-www-form-urlencoded"
            }
            var lotteryId =
                httpFactory.getList(orderExpVarHolder.getOrderExpResourcePath() + '/save',
                    'POST',
                    heads,
                    httpFactory.generateRequestFromJson($scope.requestParam)
                ).then(function (data) {
                    custNotify.success(lotteryConst.msgAdd.success, '提示:');
                    $scope.$dismiss();
                    // var orderExpModule = angular.module('BlurAdmin.pages.config.orderExp');
                    // orderExpModule.onSearch();
                    $rootScope.onOrderExpSearch();
                }, function (data) {
                    custNotify.success(lotteryConst.msgAdd.fail, '提示:');
                });
        };
    }
})();


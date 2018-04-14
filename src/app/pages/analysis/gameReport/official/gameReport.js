/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('gameReportCtrl', gameReportCtrl);

    /** @ngInject */
    function gameReportCtrl($scope, $rootScope, httpFactory, lotteryConst, custNotify, $uibModal) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        $scope.selectParam = {
            lottery: []
        };

        $scope.queryParam = {};

        var queryParam = {
            condition: null
        };


        /**
         * 条件搜索
         */
        $rootScope.onSearch = function () {

            $scope.queryParam.page = 1;
            $scope.queryParam.count = 20;
            $scope.queryParam.sideType = 1;
            $scope.queryParam.startPdate = 20171008;
            $scope.queryParam.endPdate = 20171017;
            queryParam.condition = JSON.stringify($scope.queryParam);

            httpFactory.getList(lotteryConst.hermes + '/apis/order/orderSummary/searchForAllLottery', 'GET', null, queryParam).then(function (data) {
                $scope.list = data.data.list;
                $scope.allTotal = data.data.total;
                $scope.subTotal = calculateSubTotal(data.data.list);
            }, function (data) {

            });
        };

        $rootScope.onSearch();

        $scope.onReset = function () {
            $scope.selectParam.lotterySelected = null;

        };

        /**
         * 计算小计数据
         * @param list
         */
        function calculateSubTotal(list) {
            var totalBetAmount = 0;
            var totalPayoff = 0;
            var totalGainLost = 0;
            angular.forEach(list, function (_data, index, array) {
                totalBetAmount += _data.totalBetAmount;
                totalPayoff += _data.totalPayoff;
                totalGainLost += _data.totalGainLost;
            });
            return {
                totalBetAmount: totalBetAmount,
                totalPayoff: totalPayoff,
                totalGainLost: totalGainLost
            };
        }

    }
})();


/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('daysGameReportCtrl', daysGameReportCtrl);

    /** @ngInject */
    function daysGameReportCtrl($scope, $rootScope, httpFactory, lotteryConst, $stateParams, $state) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        $scope.selectParam = {
            lottery: [], startTime: '', endTime: ''
        };

        $scope.queryParam = {
            startTime: '', endTime: ''
        };

        var queryParam = {
            condition: null
        };

        var lotteryIdList = [$stateParams.lotteryId];
        //日期控件 事件ngRepeatFinished作用是延迟加载
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            var sodateStart = new common.soDate(); // 声明一个新的日期控件
            sodateStart.init({//初始化控件
                $id: 'startTime',//input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss'// 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.selectParam.startTime = res
            });
            var sodateEnd = new common.soDate();// 声明一个新的日期控件
            sodateEnd.init({//初始化控件
                $id: 'endTime',//input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss'// 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.selectParam.endTime = res
            });
        });

        /**
         * 条件搜索
         */
        $rootScope.onSearch = function () {

            $scope.queryParam.page = 1;
            $scope.queryParam.count = 20;
            $scope.queryParam.sideType = 1;
            $scope.queryParam.startPdate = 20171008;
            $scope.queryParam.endPdate = 20171017;
            // {"page":1,"count":10,"sideType":1,"startPdate":20171008,"endPdate":20171018,"lotteryIdList":[1]}
            $scope.queryParam.lotteryIdList = lotteryIdList;
            if ($scope.selectParam.startTime !== null) {
                $scope.queryParam.startTime = new Date($scope.selectParam.startTime).getTime();
            }
            if ($scope.selectParam.endTime !== null) {
                $scope.queryParam.endTime = new Date($scope.selectParam.endTime).getTime();
            }
            queryParam.condition = JSON.stringify($scope.queryParam);

            httpFactory.getList(lotteryConst.hermes + '/apis/order/orderSummary/searchForOneLottery', 'GET', null, queryParam).then(function (data) {
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

        $scope.open = function (lotteryId, pdate) {
            var reqParam = {lotteryId: lotteryId, pdate: 20171009};
            $state.go('analysis/gameReport/official/pcodesGameReport', reqParam);
        }
    }
})();


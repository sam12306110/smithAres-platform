/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('retirementCurrentReport', retirementCurrentReport);

    /** @ngInject */
    function retirementCurrentReport($scope, httpFactory, lotteryConst, custNotify, $interval, todoService, common, $sce,$uibModal) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        // var url = lotteryConst.payConfigPath;/**/

        function initPage() {
            $scope.selectParam = {
                retirementStatus: lotteryConst.retirementStatus,
                retirementStatusSelected: {id: null, value: '全部'},
                agentPeriod: [{id: 1, value: '2017年04期'}],
                agentPeriodSelected: {id: null, value: '全部'},
                retirementJudge: lotteryConst.retirementJudge,
                retirementJudgeSelected: {id: null, value: '全部'}
            };
            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize//分页行数*分页必须
            };
            $scope.subtotal = {
                memberNum: 1203,
                lastValidBettingAmount: 190000000,
                lastPeriodProfitAndLoss: 18000000,
                currentValidBettingAmount: 290000000,
                currentPeriodProfitAndLoss: 2200000,
                currentCost: 1300000,
                lastPeriodUnsettlement: 0,
                retirementAmount: 174000,
                actualRetirement: 40000
            };
            $scope.sumtotal = {
                memberNum: 4032,
                lastValidBettingAmount: 890000000,
                lastPeriodProfitAndLoss: 78000000,
                currentValidBettingAmount: 680000000,
                currentPeriodProfitAndLoss: 59000000,
                currentCost: 13000000,
                lastPeriodUnsettlement: 492000,
                retirementAmount: 890000,
                actualRetirement: 3200000
            };
        }

        initPage();

        $scope.onReset = function () {
            initPage();
        };
        /**
         * 条件搜索
         */
        function open(page, size) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size
            });
            modalInstance.result.then(function (result) {
                $scope.onSearch();
            }, function (reason) {
                $scope.onSearch();
            });
        }
        // 跳转退佣方案
        $scope.openRetirementProgram = function (RetirementId) {
            todoService.set({
                edit: false,
                item: {
                    cid: RetirementId
                }
            });
            open('app/pages/config/rebateProgram/rebateProgramEdit.html', 'md');
        };
        $scope.onSearch = function (e) {
            $scope.entity = [
                {
                    agentAccount: "asdfsad",
                    memberNum: 388,
                    lastValidBettingAmount: 23000000,
                    lastPeriodProfitAndLoss: 350000,
                    currentValidBettingAmount: 34000000,
                    currentPeriodProfitAndLoss: 450000,
                    currentCost: 30000,
                    retirementName: "退佣方案1",
                    lastPeriodUnsettlement: 0,
                    retirementAmount: 50000,
                    actualRetirement: 0,
                    retirementJudge: 3,
                    status: 0
                }, {
                    agentAccount: "ghgdf",
                    memberNum: 200,
                    lastValidBettingAmount: 38000000,
                    lastPeriodProfitAndLoss: 390000,
                    currentValidBettingAmount: 38000000,
                    currentPeriodProfitAndLoss: 59000,
                    currentCost: 80000,
                    retirementName: "退佣方案1",
                    lastPeriodUnsettlement: 0,
                    retirementAmount: -9000,
                    actualRetirement: 0,
                    retirementJudge: 1,
                    status: 1
                }, {
                    agentAccount: "ertertew",
                    memberNum: 290,
                    lastValidBettingAmount: 42000000,
                    lastPeriodProfitAndLoss: 400000,
                    currentValidBettingAmount: 44000000,
                    currentPeriodProfitAndLoss: 500000,
                    currentCost: 60000,
                    retirementName: "退佣方案1",
                    lastPeriodUnsettlement: 0,
                    retirementAmount: 3000,
                    actualRetirement: 0,
                    retirementJudge: 2,
                    status: 3
                }, {
                    agentAccount: "iuytrt",
                    memberNum: 454,
                    lastValidBettingAmount: 28000000,
                    lastPeriodProfitAndLoss: 200000,
                    currentValidBettingAmount: 28000000,
                    currentPeriodProfitAndLoss: 300000,
                    currentCost: 30000,
                    retirementName: "退佣方案1",
                    lastPeriodUnsettlement: 0,
                    retirementAmount: 30000,
                    actualRetirement: 30000,
                    retirementJudge: 3,
                    status: 2
                }
            ];
            $scope.currentSummary = {
                agentPeriod: "2017年04期", //代理期数
                agentNum: 1440, //代理数量
                currentSumBettingAmount: 680000000, // 当期总投注额
                currentSumValidBettingAmount: 680000000, // 当期总有效投注额
                currentSumPeriodProfitAndLoss: 680000000, //当期总损益
                currentSumCost: 13000000, //当期总费用
                lastPeriodUnsettlementSum: 0, //上期未结算
                currentPeriodRetirementSum: 890000 //当期可获退佣
            };

            if (!e) {
                $scope.queryParam.page = 1;
            }

            // httpFactory.getList(url + '/momey/statistics/inout', 'GET', null, $scope.queryParam).then(function (result) {
            var result = {
                data: {currentPage: 1, total: 1}

            };

            /**
             * 分页开始
             */
            $scope.queryParam.page = result.data.currentPage;//获取的当前页currentPage赋值给查询方法的当前页参数page
            common.soPage({
                $id: 'page',
                total: result.data.total,//总条数
                size: $scope.queryParam.rows,//每页条数
                nowPage: $scope.queryParam.page
            }, function (btn) {// 回调方法，返回当前页码
                $scope.queryParam.page = btn;//重新赋值当前页
                $scope.onSearch(1);// 获取list的方法
            });// 分页
            /**
             * 分页结束
             */
            // }, function (data) {
            //
            // });
        };
        // $scope.onSearch();

    }
})();


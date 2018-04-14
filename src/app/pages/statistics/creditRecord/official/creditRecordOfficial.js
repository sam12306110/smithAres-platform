/**
 * @author Clion
 * created on 2017-10-30
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('creditRecordOfficial', creditRecordOfficial);

    /** @ngInject */
    function creditRecordOfficial($scope, httpFactory, lotteryConst, $uibModal, todoService, common) {
        $scope.pageSize = lotteryConst.pageSize; // 页面默认加载10条
        var url = lotteryConst.aresAnalysisPath + '/creditRecord';

        function initPage() {
            $scope.selectParam = {
                status: lotteryConst.lotteryStatus,
                statusSelected: {id: null, value: '全部'}
            };
            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: lotteryConst.pageSize,//分页行数*分页必须
                lotteryId: null,
                platAccount: null,
                platName: null,
                settlePlanId: null,
                sideType: 1
            };
        }

        initPage();

        $scope.onSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if ($scope.selectParam.lotterySelected != null) {
                $scope.queryParam.lotteryId = $scope.selectParam.lotterySelected.id;
            }
            if ($scope.selectParam.statusSelected != null) {
                $scope.queryParam.status = $scope.selectParam.statusSelected.id;
            }
            httpFactory.getList(url + '/list', 'GET', null, $scope.queryParam).then(function (result) {
                $scope.list = result.data.rows;
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
            }, function (data) {

            });
        };
        $scope.onSearch();

        $scope.onReset = function () {
            initPage();
        };

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

        $scope.openEdit = function (item) {
            todoService.set({
                edit: null,
                item: item
            });
            //open('app/pages/statistics/cashStat/side/cashAuditSide.html', 'lg');
        };
        $scope.openShow = function (item) {
            todoService.set({
                edit: null,
                item: item
            });
            //open('app/pages/lottery/odds/side/oddsSideShow.html', 'lg');
        };
        $scope.openAdd = function () {
            // open('app/pages/lottery/odds/side/oddsSideAdd.html', 'lg');
        };
    }

})();


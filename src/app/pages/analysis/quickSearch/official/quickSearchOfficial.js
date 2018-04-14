/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('quickSearchOfficial', quickSearchOfficial);

    /** @ngInject */
    function quickSearchOfficial($scope, common, httpFactory, lotteryConst, custNotify, $uibModal) {
        var url = lotteryConst.aresPath + '/lotteryNumRecord';

        function initPage() {
            $scope.pageSize = lotteryConst.pageSize; //页面显示行
            $scope.selectParam = {
                dateType: lotteryConst.dateType,
                dateTypeSelected: null,
                sourceType: lotteryConst.sourceType,
                sourceTypeSelected: null,
                lottery: [{id: null, value: '全部'}].concat(lotteryConst.lottery),
                lotterySelected: null
            };

            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                lotteryId: null
            };
            $scope.queryParam1 = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                lotteryId: null
            };

        }

        initPage();
        /**
         * 条件搜索
         */
        $scope.onSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if ($scope.selectParam.lotterySelected) {
                $scope.queryParam.lotteryId = $scope.selectParam.lotterySelected.id;
            }
            httpFactory.getList(url + '/list', 'GET', null, $scope.queryParam).then(function (result) {
                $scope.entity = result.data.rows;
                /**
                 * 分页开始
                 */
                $scope.queryParam.page = result.data.currentPage;//获取的当前页currentPage赋值给查询方法的当前页参数page
                common.soPage({
                    $id: 'page-1',
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
        $scope.onReset = function () {
        };
        $scope.$watch('selectParam.lotterySelected', function (n, o) {
            $scope.onSearch();
        });
        var url1 = lotteryConst.aresPath + '/lotteryNumSource';

        $scope.onSearch1 = function (e) {
            if (!e) {
                $scope.queryParam1.page = 1;
            }
            if ($scope.selectParam.lotterySelected) {
                $scope.queryParam.lotteryId = $scope.selectParam.lotterySelected.id;
            }
            httpFactory.getList(url1 + '/list', 'GET', null, null).then(function (result) {
                $scope.entity = result.data.rows;
                /**
                 * 分页开始
                 */
                $scope.queryParam1.page = result.data.currentPage;//获取的当前页currentPage赋值给查询方法的当前页参数page
                common.soPage({
                    $id: 'page-2',
                    total: result.data.total,//总条数
                    size: $scope.queryParam1.rows,//每页条数
                    nowPage: $scope.queryParam1.page
                }, function (btn) {// 回调方法，返回当前页码
                    $scope.queryParam1.page = btn;//重新赋值当前页
                    $scope.onSearch(1);// 获取list的方法
                });// 分页
                /**
                 * 分页结束
                 */
            }, function (data) {

            });
        };
        $scope.openTab = function (index) {
            $scope.onReset();
            if (index === 1) {
                $scope.onSearch();
            }
            if (index === 2) {
                $scope.onSearch1();
            }
        };

        /**
         * 状态修改
         * @param id
         * @param status
         */
        $scope.onStatus = function (id, status) {
            status = status === 0 ? 1 : 0;
            httpFactory.getList(url1 + '/onStatus?id=' + id + '&status=' + status, 'POST', null, null).then(function (result) {
                custNotify.success(lotteryConst.msgEdit.success, '提示:');
                $scope.onSearch1();
            }, function (data) {
                custNotify.error(lotteryConst.msgSelect.fail,  '提示:');
            });
        };

        function open(page, size) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size
            });
            modalInstance.result.then(function (result) {
                $scope.onSearch1();
            }, function (reason) {
                $scope.onSearch1();
            });
        }


        $scope.openEdit = function () {
            open('app/pages/drawCenter/sourceManage/lotteryNumSourceEdit.html', 'md');
        };

    }
})();


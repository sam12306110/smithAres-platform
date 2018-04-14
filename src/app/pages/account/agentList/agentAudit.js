/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('agentAudit', agentAudit);

    /** @ngInject */
    function agentAudit($scope, httpFactory, lotteryConst, custNotify, $uibModal, todoService, common,$interval) {
        var url = lotteryConst.aresAccount + '/agent';
        $scope.pageSize = lotteryConst.pageSize; //页面显示行

        function initPage() {
            $scope.selectParam = {
                auditStatus: lotteryConst.auditStatus,
                auditStatusSelected: {id: null, value: '全部'},
                cycled: {msg: '不更新', val: 0},
                cycle: lotteryConst.cycle
            };

            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                auditStatus: null,
                isAudit:1
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
            if ($scope.selectParam.auditStatusSelected) {
                $scope.queryParam.auditStatus = $scope.selectParam.auditStatusSelected.id;
            }
            httpFactory.getList(url + '/listByAudit', 'GET', null, $scope.queryParam).then(function (result) {
                $scope.entity = result.data.rows;
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


        $scope.openEdit = function (edit, item) {
            todoService.set({
                edit: edit,
                item: item
            });
            open('app/pages/account/agentList/agentAuditEdit.html', 'lg');
        };

        /**
         * 自动更新
         */
        if (!todoService.get().interval) {
            todoService.set({interval: null})
        }
        $scope.$watch('selectParam.cycled', function (newVal) {
            $interval.cancel(todoService.get().interval);
            if ($scope.selectParam.cycled.val) {
                todoService.get().interval = $interval(function () {
                    $scope.onSearch();
                }, $scope.selectParam.cycled.val * 1000);
            }
        });
    }
})();


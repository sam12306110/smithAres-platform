/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('memberLevel', memberLevel);

    /** @ngInject */
    function memberLevel($scope, httpFactory, lotteryConst, custNotify, $uibModal, todoService, common) {
        var url = lotteryConst.uaaPathPlat + '/memberLevel';
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        function initPage() {
            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                name: null
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
            httpFactory.getList(url + '/list', 'GET', null, $scope.queryParam).then(function (result) {
                if (result.data) {
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
                } else {
                    $scope.entity = null;
                }
            }, function (result) {
                $scope.entity = null;
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
            open('app/pages/account/memberLevel/memberLevelEdit.html', 'md');
        };

        $scope.openRebateProgramView = function (rebateProgramId) {
            todoService.set({
                edit: false,
                item: {
                    cid: rebateProgramId
                }
            });
            open('app/pages/config/rebateProgram/rebateProgramEdit.html', 'md');
        };
        $scope.openAccessDiscountView = function (accessDiscountId) {
            todoService.set({
                edit: false,
                item: {
                    cid: accessDiscountId
                }
            });
            open('app/pages/config/accessDiscount/accessDiscountEdit.html', 'lg');
        };
    }
})();


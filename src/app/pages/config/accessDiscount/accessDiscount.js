/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('accessDiscount', accessDiscount);

    /** @ngInject */
    function accessDiscount($scope, httpFactory, lotteryConst, custNotify, $uibModal, todoService, common) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url = lotteryConst.aresPathPlat + '/accessDiscount';

        function initPage() {
            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize//分页行数*分页必须
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

        /**
         * 状态修改
         */
        $scope.onStatus = function (item) {
            var entity = {
                id: item.cid,
                status: item.status === 0 ? 1 : 0
            };
            httpFactory.getList(url + '/onStatus', 'GET', null, entity).then(function (result) {
                if (result.data) {
                    if (result.data > 0) {
                        custNotify.success('修改成功！', '操作提示');
                        $scope.onSearch();
                    }
                    if (result.data == -1) {
                        custNotify.warning('该方案已经被使用，无法直接停用。', '操作提示');
                    }
                    if (result.data == -2) {
                        custNotify.warning('服务器出现异常，请联系管理员。', '操作提示');
                    }
                }
            }, function (data) {
                custNotify.error('服务器出现未知错误！', '系统提示');
            });
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
            open('app/pages/config/accessDiscount/accessDiscountEdit.html', 'lg');
        };
    }
})();


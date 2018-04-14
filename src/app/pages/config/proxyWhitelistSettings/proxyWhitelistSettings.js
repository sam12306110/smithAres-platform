/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('proxyWhitelistSettings', proxyWhitelistSettings);

    /** @ngInject */
    function proxyWhitelistSettings($scope, lotteryConst, custNotify, httpFactory, $uibModal, todoService,common) {
        $scope.pageSize = lotteryConst.pageSize;
        var url = lotteryConst.aresPathPlat;

        function initPage() {
            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                domain: null,
                ip: null
            };
        }


        initPage();
        $scope.onSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            httpFactory.getList(url + '/whiteips/list', 'GET', null, $scope.queryParam).then(function (result) {
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
                }
            }, function (data) {
            });
        };
        $scope.onSearch();
        $scope.onReset = function () {
            initPage();
        };


        $scope.onStatus = function (e) {
            var queryParam = {
                status: e.status ? 0 : 1,
                id: e.id
            };
            httpFactory.getListByForm(url + '/whiteips/updateStatus', 'POST', queryParam).then(function (result) {
                if (result.err == 'SUCCESS') {
                    custNotify.success('状态修改成功', '提示！');
                    $scope.onSearch();
                } else {
                    custNotify.error('状态修改失败:' + result.msg, '提示！');
                }
            }, function (data) {
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

        $scope.openEdit = function (e, item) {
            todoService.set({
                edit: e,
                item: item
            });

            open('app/pages/config/proxyWhitelistSettings/proxyWhitelistSettingsEdit.html', 'md');
        };
    }
})();

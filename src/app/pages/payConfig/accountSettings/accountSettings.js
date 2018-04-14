/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('accountSettingsCtrl', accountSettingsCtrl);

    /** @ngInject */
    function accountSettingsCtrl($scope, lotteryConst, httpFactory, todoService,custNotify, $uibModal, common) {
        var url = lotteryConst.payConfigPath + '/income';
        $scope.selectParam = {
            statues: [{id: -1, value: '全部'}, {id: 1, value: '启用中'}, {id: 0, value: '停用中'}],
            statued: {id: -1, value: '全部'}
        };
        $scope.queryParam = {
            page: 1,//当前页*分页必须
            rows: lotteryConst.pageSize,//分页行数*分页必须
            status: $scope.selectParam.statued.id
        };
        $scope.onSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            $scope.queryParam.status = $scope.selectParam.statued.id
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
        $scope.onSearch()

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
            open('app/pages/payConfig/accountSettings/accountSettingsEdit.html', 'lg');
        };
        $scope.openAdd = function () {
            open('app/pages/payConfig/accountSettings/accountSettingsAdd.html', 'lg');
        };
        $scope.onSave = function (e) {
            var queryParam = {
                "status": e.status ? 0 : 1,
                "id": e.id
            }
            httpFactory.getList(url + '/status', 'GET', null, queryParam).then(function (result) {
                custNotify.success('状态修改成功', '提示！');
                $scope.onSearch();
            }, function (data) {

            });
        };
    }
})();

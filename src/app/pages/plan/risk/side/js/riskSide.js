/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('riskSideCtrl', riskSideCtrl);

    /** @ngInject */
    function riskSideCtrl($scope, $rootScope, httpFactory, lotteryConst, custNotify, $uibModal) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url = lotteryConst.aresPath + '/riskSide';
        $scope.selectParam = {
            status: lotteryConst.status,
            statusSelected: []
        };
        $scope.queryParam = {
            name: null,
            status: null,
            modifyUsername: null,
            settleType: 1
        };

        /**
         * 条件搜索
         */
        $rootScope.onSearch = function () {
            if ($scope.selectParam.statusSelected) {
                $scope.queryParam.status = $scope.selectParam.statusSelected.id;
            }
            httpFactory.getList(url + '/list', 'GET', null, $scope.queryParam).then(function (data) {
                $scope.list = data.rows;
            }, function (data) {

            });
        };
        $rootScope.onSearch();
        $scope.onReset = function () {
            $scope.selectParam.statusSelected = null;
            $scope.queryParam.modifyUsername = null;
            $scope.queryParam.name = null;
            $scope.queryParam.status = null;
        };

        /**
         * 状态修改
         * @param id
         * @param status
         */
        $scope.onStatus = function (id, status) {
            status = status === 0 ? 1 : 0;
            httpFactory.getList(url + '/onStatus?id=' + id + '&status=' + status, 'POST', null, null).then(function (data) {
                $rootScope.onSearch();
                custNotify.success('操作提示', '修改成功！');
            }, function (data) {
                custNotify.error('系统提示', '服务器出现未知错误！');
            });
        };
        $scope.open = function (page, size) {
            $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
        };

        $scope.openTab = function (index) {
            $scope.queryParam.settleType = index;
            $scope.onReset();
            $rootScope.onSearch();
        };
        $scope.openEdit = function (edit, item) {
            $rootScope.edit = edit;
            $rootScope.item = item;
        }

    }
})();


/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('platOfficialCtrl', platOfficialCtrl);

    /** @ngInject */
    function platOfficialCtrl($scope, $rootScope, httpFactory, lotteryConst, custNotify, $uibModal, common) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url = lotteryConst.aresAccount + '/platinfo';
        $scope.selectParam = {
            settleType: lotteryConst.settleType,
            settleTypeSelected: null,
            status: lotteryConst.status,
            statusSelected: null
        };

        $scope.queryParam = {
            page: 1,//当前页*分页必须
            rows: $scope.pageSize//分页行数*分页必须
        };
        var total = 0;//总条目数*分页必须


        /**
         * 条件搜索
         */
        $rootScope.onSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if ($scope.selectParam.statusSelected) {
                $scope.queryParam.status = $scope.selectParam.statusSelected.id;
            }
            if ($scope.selectParam.settleTypeSelected) {
                $scope.queryParam.settleType = $scope.selectParam.settleTypeSelected.id;
            }
            httpFactory.getList(lotteryConst.aresAccount + '/platinfo/list?sideType=1', 'GET', null, $scope.queryParam).then(function (data) {
                $scope.list = data.data.rows;

                /**
                 * 分页开始
                 */
                if (data.data.total) {
                    total = data.data.total;                // 总条目数
                }
                $scope.queryParam.page = data.data.currentPage;//获取的当前页currentPage赋值给查询方法的当前页参数page
                common.soPage({
                    $id: 'page-1',
                    total: total,//总条数
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
        $rootScope.onSearch();
        $scope.onReset = function () {
            $scope.queryParam.platAccount = null
            $scope.queryParam.platName = null
            $scope.queryParam.settlePlanName = null
            $scope.selectParam.lotterySelected = null;
            $scope.selectParam.statusSelected = null;
            $scope.queryParam.modifyUsername = null;
            scope.selectParam.settleTypeSelected = null;
        };

        /**
         * 状态修改
         * @param id
         * @param status
         */
        $scope.onStatus = function (id, status) {
            status = status === 0 ? 1 : 0;
            httpFactory.getList(lotteryConst.aresAccount + '/platinfo/onStatus?id=' + id + '&status=' + status, 'POST', null, null).then(function (data) {
                console.log(data);
                custNotify.success(lotteryConst.msgEdit.success, '提示:');
                $scope.onSearch();
            }, function (data) {
                custNotify.error(lotteryConst.msgSelect.fail,  '提示:');
            });
        };
        $scope.open = function (page, size, edit) {
            $rootScope.edit = edit;
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

        $scope.openEdit = function (platInfoId) {
            $rootScope.platInfoId = platInfoId;
            $scope.open('app/pages/account/plat/official/platOfficialEdit.html', 'lg', 'edit');
        };

        $scope.modifyStatus = function (platInfoId, status) {
            status = status === 0 ? 1 : 0;
            httpFactory.getList(lotteryConst.aresAccount + '/platinfo/status/set?platInfoId=' + platInfoId + '&status=' + status, 'POST', null, null).then(function (data) {
                console.log(data);
                custNotify.success(lotteryConst.msgEdit.success, '提示:');
                $rootScope.onSearch();
            }, function (data) {
                custNotify.error(lotteryConst.msgSelect.fail,  '提示:');
            });
        };
    }
})();


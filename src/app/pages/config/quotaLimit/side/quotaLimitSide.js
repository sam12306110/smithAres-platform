/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('quotaLimitSide', quotaLimitSide);

    /** @ngInject */
    function quotaLimitSide($scope, httpFactory, lotteryConst, custNotify, $uibModal, common, todoService) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url = lotteryConst.aresPath + '/quotaLimit';

        function initPage() {
            $scope.selectParam = {
                status: lotteryConst.status,
                statusSelected: {id: null, value: '全部'},
                lottery: [{id: null, value: '全部', sideType: 2}].concat(lotteryConst.lottery),
                lotterySelected: {id: null, value: '全部', sideType: 2}
            };
            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                lotteryId: null,
                status: null,
                modifyUsername: null,
                sideType: 2
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
            if ($scope.selectParam.statusSelected) {
                $scope.queryParam.status = $scope.selectParam.statusSelected.id;
            }
            if ($scope.selectParam.lotterySelected) {
                $scope.queryParam.lotteryId = $scope.selectParam.lotterySelected.id;
            }
            httpFactory.getList(url + '/list', 'GET', null, $scope.queryParam).then(function (result) {
                $scope.entity = result.data.rows;
                /**
                 * 分页开始
                 */
                $scope.queryParam.page = result.data.currentPage;// 获取的当前页currentPage赋值给查询方法的当前页参数page
                common.soPage({
                    $id: 'page',
                    total: result.data.total,// 总条数
                    size: $scope.queryParam.rows,// 每页条数
                    nowPage: $scope.queryParam.page
                }, function (btn) {// 回调方法，返回当前页码
                    $scope.queryParam.page = btn;// 重新赋值当前页
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
         * @param id
         * @param status
         */
        $scope.onStatus = function (id, status) {
            status = status === 0 ? 1 : 0;
            httpFactory.getList(url + '/onStatus?id=' + id + '&status=' + status, 'POST', null, null).then(function (data) {
                console.log(data);
                custNotify.success(lotteryConst.msgEdit.success, '提示:');
                $scope.onSearch();
            }, function (data) {
                custNotify.error('服务器出现未知错误！', '提示:');
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
            open('app/pages/config/quotaLimit/side/quotaLimitSideEdit.html', 'md');
        };
    }


})();


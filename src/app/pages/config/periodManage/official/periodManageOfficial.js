/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('periodManageOfficialCtrl', periodManageOfficialCtrl);

    /** @ngInject */
    function periodManageOfficialCtrl($scope, httpFactory, common, lotteryConst, custNotify, $uibModal, todoService) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url = lotteryConst.aresPath + '/periodManage';

        function initPage() {
            $scope.selectParam = {
                status: lotteryConst.status,
                statusSelected: {id: null, value: '全部'}
            };

            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                name: null,
                status: null,
                createUsername: null,
                sideType: 1
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
                custNotify.success(lotteryConst.msgEdit.success, '提示:');
                $scope.onSearch();
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
                $scope.onSearch();
            }, function (reason) {
                $scope.onSearch();
            });
        }


        $scope.openEdit = function (edit, item) {
            // todoService.toData = {
            //     edit: edit,
            //     item: item
            // };
            open('app/pages/config/periodManage/official/periodManageOfficialEdit.html', 'md');
        };
    }
})();


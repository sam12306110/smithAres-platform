/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('settlePlanSide', settlePlanSide);

    /** @ngInject */
    function settlePlanSide($scope, httpFactory, lotteryConst, custNotify, common, $uibModal, todoService) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url = lotteryConst.aresPath + '/settlePlan';

        function initPage() {
            $scope.selectParam = {
                status: lotteryConst.status,
                statusSelected: {id: null, value: '全部'}
            };
            $scope.queryParam = {
                name: null,
                status: null,
                modifyUsername: null,
                settleType: 1,
                sideType: 2,
                page: 1,
                rows: $scope.pageSize
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
                    $id: 'page-' + $scope.queryParam.settleType,
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
                $scope.onSearch();
                custNotify.success( '修改成功！','提示:');
            }, function (data) {
                custNotify.error( '服务器出现未知错误！','提示:');
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

        $scope.openTab = function (index) {
            $scope.onReset();
            $scope.queryParam.settleType = index;
            $scope.onSearch();
        };
        $scope.openEdit = function (edit, item) {
            todoService.set({
                edit: edit,
                item: item,
                settleType: $scope.queryParam.settleType
            });
            open('app/pages/config/settlePlan/side/settlePlanSideEdit.html', $scope.queryParam.settleType == 1 ? 'lg' : 'md');
        };

    }

    angular.module('BlurAdmin.pages').controller('settlePlanSideEdit', settlePlanSideEdit);

    function settlePlanSideEdit($scope, httpFactory, custNotify, todoService, lotteryConst) {
        var url = lotteryConst.aresPath + '/settlePlan';
        $scope.entity = {
            settleType: null,
            name: null,
            mantainFee: null,
            cashItems: [],
            creditItem: null,
            sideType: 2
        };
        $scope.entity.settleType = todoService.get().settleType;

        $scope.cashItems = [];
        $scope.edit = todoService.get().edit;
        if (todoService.get().item) {
            httpFactory.getList(url + '/view', 'GET', null, {id: todoService.get().item.cid}).then(function (result) {
                $scope.entity = result.data;
            }, function (data) {
            });
        }

        $scope.onSave = function () {
            httpFactory.getList(url + '/save', 'POST', null, $scope.entity).then(function (data) {
                custNotify.success( '新增成功！','提示:');
                $scope.$dismiss();
            }, function (data) {
                custNotify.error( '新增失败！','提示:');
            });
        };
    }
})();


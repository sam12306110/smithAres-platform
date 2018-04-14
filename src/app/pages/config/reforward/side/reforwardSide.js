/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('reforwardSide', reforwardOfficial);

    /** @ngInject */
    function reforwardOfficial($scope, todoService, httpFactory, lotteryConst, common, custNotify, $uibModal) {
        $scope.pageSize = lotteryConst.pageSize; // 页面显示行
        var url = lotteryConst.aresPath + '/reforward';

        function initPage() {
            $scope.selectParam = {
                lottery: [{id: null, value: '全部', sideType: 2}].concat(lotteryConst.lottery),
                status: lotteryConst.status,
                lotterySelected: {id: null, value: '全部', sideType: 2},
                statusSelected: null
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
                    $id: 'reforward-page',
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
            httpFactory.getList(url + '/onStatus?id=' + id + '&status=' + status, 'POST', null, null).then(function (result) {
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
            });
        }

        $scope.openEdit = function (edit, item) {
            todoService.set({
                edit: edit,
                item: item
            });
            open('app/pages/config/reforward/official/reforwardOfficialEdit.html', 'md');
        };
    }

    angular.module('BlurAdmin.pages').controller('reforwardSideEdit', reforwardOfficialEdit);

    /** @ngInject */
    function reforwardOfficialEdit($scope, $rootScope, httpFactory, lotteryConst, custNotify, todoService) {
        var url = lotteryConst.aresPath + '/reforward';
        $scope.entity = null;
        $scope.payoffGroup = lotteryConst.payoffGroup;

        $scope.list = [];
        $scope.entity = {
            itemPO: [],
            sideType: 2
        };

        if (todoService.get().item) {
            var item = todoService.get().item;
            httpFactory.getList(url + '/view', 'GET', null, {id: item.cid}).then(function (result) {
                $scope.entity = result.data;
            }, function (data) {

            });
        }
        if (todoService.get().edit) {
            $scope.edit = todoService.get().edit;
        }


        $scope.onSave = function () {
            console.log($scope.entity);
            httpFactory.getList(url + '/save', 'POST', null, $scope.entity).then(function (result) {
                custNotify.success(lotteryConst.msgEdit.success, '提示:');
                $scope.$dismiss();
            }, function (data) {
                custNotify.error('操作提示', '修改失败！');
            });
        };

    }

})();


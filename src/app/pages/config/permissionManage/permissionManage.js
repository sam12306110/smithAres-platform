/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('permissionManageCtrl', periodManageCtrl);

    /** @ngInject */
    function periodManageCtrl($scope, $rootScope, httpFactory, lotteryConst, custNotify, $uibModal, common) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        function init() {
            $scope.selectParam = {
                lottery: [],
                status: lotteryConst.status,
                statusSelected: null
            };

            $scope.queryParam = {
                status: null,
                roleId: null,
                account: null,
                nickName: null,
                modifyAccount: null,
                page: 1,//当前页*分页必须
                rows: $scope.pageSize//分页行数*分页必须
            };
        }

        init();

        /*角色列表*/
        httpFactory.getList(lotteryConst.aresAccount + '/role/role_map ', 'GET', null, {}).then(function (data) {
            $scope.selectParam.role = [{id: null, roleName: "请选择"}].concat(data.data);
        }, function (data) {
        });

        /**
         * 条件搜索
         */
        $rootScope.userSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if ($scope.selectParam.statusSelected) {
                $scope.queryParam.status = $scope.selectParam.statusSelected.id;
            }
            if ($scope.selectParam.roleSelected) {
                $scope.queryParam.roleId = $scope.selectParam.roleSelected.id;
            }

            httpFactory.getList(lotteryConst.aresAccount + '/user/list', 'GET', null, $scope.queryParam).then(function (result) {
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
                    $scope.userSearch(1);// 获取list的方法
                });// 分页
                /**
                 * 分页结束
                 */
            }, function (result) {

            });
        };


        $rootScope.userSearch();

        $scope.onReset = function () {
            init();
        };

        /**
         * 用户状态修改
         * @param id
         * @param status
         */
        $scope.modifyUserStatus = function (id, status) {
            status = status === 0 ? 1 : 0;
            httpFactory.getList(lotteryConst.aresAccount + '/user/update/status?userId=' + id + '&status=' + status, 'POST', null, null).then(function (data) {
                console.log(data);
                custNotify.success(lotteryConst.msgEdit.success, '提示:');
                $scope.userSearch();
            }, function (data) {
                custNotify.error(lotteryConst.msgSelect.fail,  '提示:');
            });
        };


        /*-----------------角色--------------------*/
        /**
         * 条件搜索
         */
        $rootScope.roleSearch = function (queryParam) {
            if (!queryParam) {
                $scope.queryParam.page = 1;
            }
            if ($scope.selectParam.statusSelected) {
                $scope.queryParam.status = $scope.selectParam.statusSelected.id;
            }

            httpFactory.getList(lotteryConst.aresAccount + '/role/list', 'GET', null, $scope.queryParam).then(function (result) {
                $scope.entity = result.data.rows;
                /**
                 * 分页开始
                 */
                $scope.queryParam.page = result.data.currentPage;//获取的当前页currentPage赋值给查询方法的当前页参数page
                common.soPage({
                    $id: 'page1',
                    total: result.data.total,//总条数
                    size: $scope.queryParam.rows,//每页条数
                    nowPage: $scope.queryParam.page
                }, function (btn) {// 回调方法，返回当前页码
                    $scope.queryParam.page = btn;//重新赋值当前页
                    $scope.roleSearch(1);// 获取list的方法
                });// 分页
                /**
                 * 分页结束
                 */
            }, function (result) {

            });
        };



        $scope.openTab = function (index) {
            init();
            if (index == 1) {
                $scope.queryParam.page = 1;
                $rootScope.userSearch();
            } else if (index == 2) {
                $scope.queryParam.page = 1;
                $rootScope.roleSearch();
            }
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

        $scope.openUserEdit = function (edit, cid) {
            $rootScope.userId = cid;
            $scope.open('app/pages/config/permissionManage/userAdd.html', 'md', edit);
        };


        $scope.openRoleEdit = function (edit, cid) {
            $rootScope.cid = cid;
            $scope.open('app/pages/config/permissionManage/roleAdd.html', 'lg', edit);
        };


    }
})();


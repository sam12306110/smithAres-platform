/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    //管理中`心ip
    angular.module('BlurAdmin.pages').controller('hostileOrderCtrl', hostileOrderCtrl);

    /** @ngInject */
    function hostileOrderCtrl($scope, httpFactory, riskOfficialConfigVarHolder,
                              custNotify, common, todoService, $uibModal) {

        //
        //翻页属性值
        $scope.currentPage = 1;
        $scope.pageSize = 20;
        $scope.numPages = null;


        $scope.invalidStatus = -1;

        $scope.viewParam = {
            orderId: null,
            memberName: null,
            startTime: null,
            endTime: null,
        }
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            var sodateStart = new common.soDate()
            sodateStart.init({
                $id: 'startTime2',
                formart: 'yyyy/MM/dd HH:mm:ss'// yyyy/MM/dd HH:mm:ss
            }, function (res) {
                $scope.viewParam.startTime = res;
            });
            var sodateEnd = new common.soDate()
            sodateEnd.init({
                $id: 'endTime2',
                formart: 'yyyy/MM/dd HH:mm:ss'// yyyy/MM/dd HH:mm:ss
            }, function (res) {
                $scope.viewParam.endTime = res;
            });
        });
        $scope.getQueryParam = function (page) {
            //翻页怎么做?
            var queryParamForSearch = {
                condition: null,
            };
            var condition = {
                page: page,
                count: 20,
                orderId: null,
                memberName: null,
                betStartTime: null,
                betEndTime: null,
                sideType: 1,
            };

            function copyViewToCondition(condition) {
                if ($scope.viewParam.orderId != null
                    || $scope.viewParam.orderId != undefined) {
                    condition.orderId = $scope.viewParam.orderId;
                }
                if ($scope.viewParam.memberName != null
                    || $scope.viewParam.memberName != undefined) {
                    condition.memberName = $scope.viewParam.memberName;
                }

                if ($scope.viewParam.startTime != null
                    || $scope.viewParam.startTime != undefined) {
                    //获取的单位是毫秒
                    condition.betStartTime = new Date($scope.viewParam.startTime).getTime();
                }
                if ($scope.viewParam.endTime != null
                    || $scope.viewParam.endTime != undefined) {
                    condition.betEndTime = new Date($scope.viewParam.endTime).getTime();
                }
                console.log(condition)
            }

            copyViewToCondition(condition);
            queryParamForSearch.condition = JSON.stringify(condition);
            return queryParamForSearch;
        }

        $scope.search = function (page) {
            $scope.currentPage = page;//真正搜索的才是当前页
            var queryParamForSearch = $scope.getQueryParam(page);
            httpFactory.getList(riskOfficialConfigVarHolder.listHostileRecordURL(),
                'GET',
                null,
                queryParamForSearch
            ).then(function (result) {
                var err = result.err;
                if (err == "SUCCESS") {
                    var data = result.data;
                    $scope.list = data.rows;
                    var total = data.total;
                    if (page == 1) {
                        $scope.numPages = common.calNumPages(total, $scope.pageSize);
                    }
                    common.soPage({
                        $id: 'page2',
                        total: total,//总条数
                        size: $scope.pageSize,//每页条数
                        nowPage: $scope.currentPage
                    }, function (btn) {// 回调方法，返回当前页码
                        $scope.search(btn);// 获取list的方法
                    });// 分页
                } else {
                    custNotify.error('获取列表失败！', '操作提示');
                }
            }, function (result) {
                custNotify.error('获取列表失败！', '操作提示');
            });
        }

        $scope.search();
        $scope.selectPage = function (page) {
            $scope.search(common.getValidPage(page, $scope.numPages))
        }

        $scope.exportForHostileOrder = function () {
            var queryParamForSearch = $scope.getQueryParam();
            httpFactory.getList(riskOfficialConfigVarHolder.exportRiskOrderURL(),
                'GET',
                null,
                queryParamForSearch
            ).then(function (result) {
                custNotify.info("导出结束", "提示:");
            }, function (result) {
                custNotify.error('导出失败！', '提示:');
            });
        };


        $scope.onReset = function () {
            $scope.viewParam.orderId = null;
            $scope.viewParam.memberName = null;
            $scope.viewParam.auditSelectStatus = null;
            $scope.viewParam.modifyUserName = null;
            $scope.viewParam.startTime = null;
            $scope.viewParam.endTime = null;
        };


        $scope.onExport = function () {
            $scope.exportForHostileOrder();
        }

        //页面对应参数
        $scope.onSearch = function () {
            $scope.selectPage(1);
        }

        $scope.$on(riskOfficialConfigVarHolder.actions.clickHostileOrderCtrl, function () {
            $scope.selectPage(1);
        })

        /**
         * 打开详情
         */

        function open(page, size) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size
            });
            modalInstance.result.then(function (result) {
                if (todoService.get().type == 1) {
                    $scope.search($scope.currentPage);
                } else {
                    $scope.search($scope.currentPage);
                }
            }, function (reason) {
                if (todoService.get().type == 1) {
                    $scope.search($scope.currentPage);
                } else {
                    $scope.search($scope.currentPage);
                }
            });
        }

        $scope.openDetail = function (e, t) {
            todoService.set({
                orderId: e,
                type: t,
                cid: 0
            });
            open('app/pages/plan/order/official/orderOfficialEdit.html', 'lg');
        }

    }


})();


/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('riskOrderCtrl', riskOrderCtrl);


    function riskOrderCtrl($scope, httpFactory, riskOfficialConfigVarHolder, custNotify,
                           $uibModal, common, todoService) {

        //
        //翻页属性值
        $scope.currentPage = 1;
        $scope.pageSize = 20;
        $scope.numPages = null;

        $scope.invalidStatus = -1;
        $scope.viewParam = {
            orderId: null,
            memberName: null,
            auditSelectStatus: null,
            modifyUserName: null,
            startTime: null,
            endTime: null,
        }
        /**
         * 拼装参数
         * @param page
         * @returns {{condition: null}}
         */

        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            var sodateStart = new common.soDate()
            sodateStart.init({
                $id: 'startTime',
                formart: 'yyyy/MM/dd HH:mm:ss'// yyyy/MM/dd HH:mm:ss
            }, function (res) {
                $scope.viewParam.startTime = res;
            });
            var sodateEnd = new common.soDate()
            sodateEnd.init({
                $id: 'endTime',
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
                count: $scope.pageSize,
                orderId: null,
                memberName: null,
                status: null,
                modifyUserName: null,
                betStartTime: null,
                betEndTime: null,
                sideType: 1,
            };

            /**
             * copy
             * @param condition
             */
            function copyViewToCondition(condition) {
                if ($scope.viewParam.orderId != null
                    || $scope.viewParam.orderId != undefined) {
                    condition.orderId = $scope.viewParam.orderId;
                }
                if ($scope.viewParam.memberName != null
                    || $scope.viewParam.memberName != undefined) {
                    condition.memberName = $scope.viewParam.memberName;
                }

                if ($scope.viewParam.auditSelectStatus != null
                    || $scope.viewParam.auditSelectStatus != undefined) {
                    if ($scope.viewParam.auditSelectStatus.code != $scope.invalidStatus) {
                        condition.status = $scope.viewParam.auditSelectStatus.code;
                    }
                }
                if ($scope.viewParam.modifyUserName != null
                    || $scope.viewParam.modifyUserName != undefined) {
                    condition.modifyUserName = $scope.viewParam.modifyUserName;
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
            }

            copyViewToCondition(condition);
            queryParamForSearch.condition = JSON.stringify(condition);
            return queryParamForSearch;
        }

        /**
         * 搜索
         * @param page
         */
        $scope.search = function (page) {
            $scope.currentPage = page;//真正搜索的才是当前页
            var queryParamForSearch = $scope.getQueryParam(page);
            httpFactory.getList(riskOfficialConfigVarHolder.listRiskOrderURL(),
                'GET',
                null,
                queryParamForSearch
            ).then(function (result) {
                var err = result.err;
                if (err == "SUCCESS") {
                    var data = result.data;
                    $scope.list = data.list;
                    var total = data.total;
                    if (page == 1) {
                        $scope.numPages = common.calNumPages(total, $scope.pageSize);
                    }
                    common.soPage({
                        $id: 'page',
                        total: total,//总条数
                        size: $scope.pageSize,//每页条数
                        nowPage: page
                    }, function (btn) {// 回调方法，返回当前页码
                        $scope.search(btn);// 获取list的方法
                    });// 分页
                } else {
                    custNotify.error('操作提示', '获取列表失败！');
                }
            }, function (result) {
                custNotify.error('操作提示', '获取列表失败！');
            });
        }
        /**
         * selectPage
         * @param page
         */
        $scope.selectPage = function (page) {
            $scope.search(common.getValidPage(page, $scope.numPages))
        }


        /**
         * 获取订单list
         */
        $scope.getStatusList = function () {
            httpFactory.getList(riskOfficialConfigVarHolder.getRiskOrderStatusListURL(),
                'GET',
                null,
                null
            ).then(function (result) {
                var tmp = result.orderStatusList;
                tmp.unshift({"code": $scope.invalidStatus, "desc": "全部"})
                $scope.statusList = tmp;
            }, function (result) {
                custNotify.error('操作提示', '获取状态列表失败！');
            });
        }

        /**
         * 导出
         */
        $scope.exportForRiskOrder = function () {
            var queryParamForSearch = $scope.getQueryParam();
            httpFactory.getList(riskOfficialConfigVarHolder.exportRiskOrderURL(),
                'GET',
                null,
                queryParamForSearch
            ).then(function (result) {
                custNotify.info("操作提示", "导出结束");
            }, function (result) {
                custNotify.error('操作提示', '导出失败！');
            });
        };

        /**
         * 接收时间
         */
        $scope.$on(riskOfficialConfigVarHolder.actions.clickRiskOrderCtrl, function () {
            $scope.selectPage(1);
        })


        /**
         * 锁定
         * @param item
         */
        $scope.onLock = function (item) {
            if (item.orderId == null || item.orderId == undefined) {
                custNotify.error("操作错误", "没有订单id")
                return;
            }
            var updateParam = {
                orderId: null,
                status: null
            };
            updateParam.orderId = item.orderId;
            //锁定
            updateParam.status = riskOfficialConfigVarHolder.riskOrderStatus.LOCKED;


            httpFactory.getListByForm(riskOfficialConfigVarHolder.updateRiskOrderStatusURL(),
                'POST',
                updateParam
            ).then(function (result) {
                if (result.status == 999) {
                    custNotify.error(result.reasonForShow, result.reason);
                    return;
                }
                custNotify.info("操作提示", "锁定成功");
                $scope.refresh();
            }, function (result) {
                if (result.status != null
                    && result.reasonForShow != null
                    && result.reason != null) {
                    custNotify.error(result.reasonForShow, result.reason);
                    return;
                }
                custNotify.error('操作提示', '锁定失败');
            });
        }

        /**
         * 审核
         * @param item
         */
        $scope.onAudit = function (item) {
            riskOfficialConfigVarHolder.auditItem = item;
            riskOfficialConfigVarHolder.refreshMethod = $scope.refresh;
            $scope.open("app/pages/plan/risk/official/riskOfficialAudit.html", "md");
        }

        /**
         * 导出
         */
        $scope.onExport = function () {
            $scope.exportForRiskOrder();
        }

        /**
         * 重置
         */
        $scope.onReset = function () {
            $scope.viewParam.orderId = null;
            $scope.viewParam.memberName = null;
            $scope.viewParam.auditSelectStatus = null;
            $scope.viewParam.modifyUserName = null;
            $scope.viewParam.startTime = null;
            $scope.viewParam.endTime = null;
        };

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


        $scope.refresh = function () {
            $scope.selectPage(1);
        }

        /**
         * 加载module需要执行的参数
         */
        $scope.getStatusList();

        $scope.selectPage(1)
    }

})();


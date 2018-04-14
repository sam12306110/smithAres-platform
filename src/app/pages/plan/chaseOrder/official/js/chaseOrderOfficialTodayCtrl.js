/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('chaseOrderOfficialTodayCtrl', chaseOrderOfficialTodayCtrl);


    function chaseOrderOfficialTodayCtrl(lotteryConst, $scope, httpFactory,
                                         chaseOrderOfficialConfigVarHolder, custNotify,
                                         $uibModal, common,
                                         $rootScope, $q) {

        //
        //翻页属性值
        $scope.currentPage = 1;
        $scope.pageSize = 20;
        $scope.numPages = null;
        //页面参数
        $scope.viewParam = {
            //彩种
            selectedLottery: null,
            lotteryList: null,
            //
            orderId: null,
            memberName: null,
            startTime: null,
            endTime: null,
            //平台
            selectedPlat: null,
            platList: null,
            //来源
            selectedSource: null,
            sourceList: null,
            //状态
            selectedStatus: null,
            statusList: null,
        }


        /**
         * 拼装参数
         * @param page
         * @returns {{condition: null}}
         */
        $scope.getQueryParam = function (page) {
            //翻页怎么做?
            var queryParamForSearch = {
                condition: null,
            };
            var condition = {
                page: page,
                rows: $scope.pageSize,
                lotteryId: null,
                orderId: null,
                memberName: null,
                betStartTime: null,
                betEndTime: null,
                platInfoId: null,
                source: null,
                status: null,
            };

            /**
             * copy
             * @param condition
             */
            function copyViewToCondition(condition) {
                if ($scope.viewParam.selectedLottery != null
                    || $scope.viewParam.selectedLottery != undefined) {
                    if ($scope.viewParam.selectedLottery.id != chaseOrderOfficialConfigVarHolder.invalidInt) {
                        condition.lotteryId = $scope.viewParam.selectedLottery.id;
                    }
                }

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
                    condition.betStartTime = $scope.viewParam.startTime.getTime();
                }
                if ($scope.viewParam.endTime != null
                    || $scope.viewParam.endTime != undefined) {
                    condition.betEndTime = $scope.viewParam.endTime.getTime();
                }
                //platInfoId: null
                if ($scope.viewParam.selectedPlat != null
                    || $scope.viewParam.selectedPlat != undefined) {
                    if ($scope.viewParam.selectedPlat.cid != chaseOrderOfficialConfigVarHolder.invalidInt) {
                        condition.platInfoId = $scope.viewParam.selectedPlat.cid;
                    }
                }
                //source: null,/
                if ($scope.viewParam.selectedSource != null
                    || $scope.viewParam.selectedSource != undefined) {
                    if ($scope.viewParam.selectedSource.code != chaseOrderOfficialConfigVarHolder.invalidInt) {
                        condition.source = $scope.viewParam.selectedSource.code;
                    }

                }
                //status: null,
                if ($scope.viewParam.selectedStatus != null
                    || $scope.viewParam.selectedStatus != undefined) {
                    if ($scope.viewParam.selectedStatus.code != chaseOrderOfficialConfigVarHolder.invalidInt) {
                        condition.status = $scope.viewParam.selectedStatus.code;
                    }
                }
            }

            copyViewToCondition(condition);
            if (condition.platInfoId == null ||
                condition.platInfoId == undefined) {
                throw "没有选择平台商";
            }
            queryParamForSearch.condition = JSON.stringify(condition);
            return queryParamForSearch;
        }

        /**
         * 搜索订单list
         * @param page
         */
        $scope.search = function (page) {
            $scope.currentPage = page;
            var queryParamForSearch = null;
            try {
                queryParamForSearch = $scope.getQueryParam(page);
                httpFactory.getList(chaseOrderOfficialConfigVarHolder.getTodayChaseOrderListURL(),
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
                    } else {
                        custNotify.error('操作提示', '获取列表失败！');
                    }
                }, function (result) {
                    custNotify.error('操作提示', '获取列表失败！');
                });
            } catch (err) {
                custNotify.error('错误提示', err);
            }

        }


        /**
         * selectPage
         * @param page
         */
        $scope.selectPage = function (page) {
            $scope.search(common.getValidPage(page, $scope.numPages))
        }

        /**
         * 导出
         */
        $scope.export = function () {
            var queryParamForSearch = $scope.getQueryParam();
            httpFactory.getList(chaseOrderOfficialConfigVarHolder.getTodayChaseOrderExportURL(),
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
        $scope.$on(chaseOrderOfficialConfigVarHolder.actions.clickChaseOrderTodayListCtrl, function () {
            $scope.selectPage(1);
        })


        /**
         * 导出
         */
        $scope.onExport = function () {
            $scope.export();
        }

        /**
         * 重置
         */
        $scope.onReset = function () {
            $scope.viewParam.selectedLottery = null;
            $scope.viewParam.orderId = null;
            $scope.viewParam.memberName = null;
            $scope.viewParam.selectedStatus = null;
            $scope.viewParam.selectedSource = null;
            $scope.viewParam.selectedStatus = null;
        };

        /**
         * 打开追号订单详情页
         * @param orderId
         */
        $scope.openDetail = function (orderId) {
            chaseOrderOfficialConfigVarHolder.openChaseDetail(orderId);
        }


        $scope.refresh = function () {
            $scope.selectPage(1);
        }


        /**
         * 获取订单有效状态list
         */
        $scope.getOrderStatus = function () {
            //如果后面要改成http，也可以直接改这，而不用改其他地方
            $scope.$on(chaseOrderOfficialConfigVarHolder.actions.statusLoadEvent, function (d, data) {
                $scope.viewParam.statusList = data;
            });
        };

        /**
         * 获取彩种信息
         */
        $scope.getLottery = function () {
            $scope.$on(chaseOrderOfficialConfigVarHolder.actions.lotteryLoadEvent, function (d, data) {
                $scope.viewParam.lotteryList = data;
            });
        }


        /**
         * 获取订单来源列表
         */
        $scope.getSourceType = function () {
            $scope.$on(chaseOrderOfficialConfigVarHolder.actions.sourceTypeLoadEvent, function (d, data) {
                $scope.viewParam.sourceList = data;
            });
        }

        /**
         * 获取平台商列表
         */
        $scope.getPlat = function () {
            $scope.$on(chaseOrderOfficialConfigVarHolder.actions.platLoadEvent, function (d, data) {
                $scope.viewParam.platList = data;
            });
        }

        /**
         * 初始化入口方法
         */
        $scope.init = function () {
            $scope.getOrderStatus()
            $scope.getLottery()
            $scope.getSourceType()
            $scope.getPlat()
        }
        //
        $scope.init();
        // $scope.selectPage(1)
    }

})();


/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('chaseOrderOfficialTabCtrl', chaseOrderOfficialTabCtrl);


    function chaseOrderOfficialTabCtrl($scope,
                                       chaseOrderOfficialConfigVarHolder,
                                       custNotify,
                                       httpFactory,
                                       lotteryConst) {

        //事件broadcast start
        $scope.clickChaseOrderTodayListCtrl = function () {
            //由于必须选平台商,所以这里不下发event
            // $scope.$broadcast(chaseOrderOfficialConfigVarHolder.actions.clickChaseOrderTodayListCtrl);
        }

        $scope.clickChaseOrderOfficialHistoryListCtrl = function () {
            //由于必须选平台商,所以这里不下发event
            // $scope.$broadcast(chaseOrderOfficialConfigVarHolder.actions.clickChaseOrderOfficialHistoryListCtrl);
        }
        //事件broadcast end


        //两个tab都需要的请求数据,在这里弄

        //页面参数
        $scope.viewParam = {
            //彩种
            lotteryList: null,
            //平台
            platList: null,
            //来源
            sourceList: null,
            //状态
            statusList: null
        }

        /**
         * 获取订单有效状态list
         */
        $scope.getOrderStatus = function () {
            httpFactory.getList(lotteryConst.hemes + '/order/config/listValidChaseStatus',
                'GET',
                null,
                null)
                .then(function (data) {
                    $scope.viewParam.statusList = data.data.chaseStatusList;
                    //处理完成后，通知下层模块
                    // $scope.viewParam.statusList.unshift({"code": chaseOrderOfficialConfigVarHolder.invalidStatus,
                    //     "mes": "全部"})
                    $scope.$broadcast(chaseOrderOfficialConfigVarHolder.actions.statusLoadEvent,
                        $scope.viewParam.statusList);
                }, function (err) {
                    custNotify.error("获取配置失败", "获取订单状态失败")
                });
        };

        /**
         * 获取彩种信息
         */
        $scope.getLottery = function () {
            httpFactory.getList(lotteryConst.aresPath + '/lottery/getLotteryList?sideType=1', 'GET', null, {}).then(function (data) {
                $scope.viewParam.lotteryList = data.data;
                // $scope.viewParam.lotteryList.unshift({"id": chaseOrderOfficialConfigVarHolder.invalidStatus,
                //     "value": "全部"})
                //处理完成后，通知下层模块
                $scope.$broadcast(chaseOrderOfficialConfigVarHolder.actions.lotteryLoadEvent, $scope.viewParam.lotteryList);
            }, function (err) {
                custNotify.error("获取配置失败", "彩种获取失败")
            });
        }


        /**
         * 获取订单来源列表
         */
        $scope.getSourceType = function () {
            httpFactory.getList(lotteryConst.hemes + '/order/config/listValidSource',
                'GET',
                null,
                {}).then(function (data) {
                $scope.viewParam.sourceList = data.data.sourceTypeList;
                // $scope.viewParam.sourceList.unshift({"code": chaseOrderOfficialConfigVarHolder.invalidStatus, "mes": "全部"})

                //处理完成后，通知下层模块
                $scope.$broadcast(chaseOrderOfficialConfigVarHolder.actions.sourceTypeLoadEvent,
                    $scope.viewParam.sourceList);
            }, function (data) {
                custNotify.error("获取配置失败", "获取订单来源失败")
            });
        }

        /**
         * 获取平台商列表
         */
        $scope.getPlat = function () {
            httpFactory.getList(lotteryConst.aresAccount + '/platinfo/plat_map?sideType=1',
                'GET',
                null, {}).then(function (data) {
                $scope.viewParam.platList = data.data;
                // $scope.viewParam.platList.unshift({"cid": chaseOrderOfficialConfigVarHolder.invalidStatus, "name": "全部"})

                //处理完成后，通知下层模块
                $scope.$broadcast(chaseOrderOfficialConfigVarHolder.actions.platLoadEvent,
                    $scope.viewParam.platList);
            }, function (data) {
                custNotify.error("获取配置失败", "获取平台商列表失败")
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

        /**
         * 加载module需要执行的参数
         */
        $scope.init();
    }


})();


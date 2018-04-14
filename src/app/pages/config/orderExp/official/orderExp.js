/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('orderExpCtrl', orderExpCtrl);

    /** @ngInject */
    function orderExpCtrl($scope, $rootScope, httpFactory, common,
                          lotteryConst, custNotify, $uibModal,
                          orderExpVarHolder) {
        $scope.pageSize = 20;


        $scope.selectParam = {
            lottery: [],
            status: orderExpVarHolder.status,
            lotterySelected: null,
            statusSelected: null,
        };

        $scope.queryParam = {
            page: 1,//当前页*分页必须
            rows: $scope.pageSize,//分页行数*分页必须
            modifyUsername: null
        };


        $scope.selectParam = {
            lottery: [{
                id: null,
                value: '全部',
                sideType: 1
            }].concat(lotteryConst.lottery),
            lotterySelected: {id: null, value: '全部'},
            status: orderExpVarHolder.status,
            statusSelected: null
        };


        /**
         * 条件搜索
         */
        $rootScope.onOrderExpSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1
            }
            var status;
            var queryParamForSearch = {
                condition: null,
            };
            if ($scope.selectParam.statusSelected) {
                var statusTmp = $scope.selectParam.statusSelected.id;
                if (statusTmp != -1) {
                    status = statusTmp;
                }
            }
            var lotteryId;
            if ($scope.selectParam.lotterySelected) {
                var lotteryIdTmp = $scope.selectParam.lotterySelected.id;
                if (lotteryIdTmp != -1) {
                    lotteryId = lotteryIdTmp;
                }
            }
            var modifyUserName;
            if ($scope.queryParam.modifyUsername != null || $scope.queryParam.modifyUsername != undefined
                || $scope.queryParam.modifyUsername != "") {
                modifyUserName = $scope.queryParam.modifyUsername;
            }
            //TODO:翻页怎么实现
            var page = 1;
            var count = 50;
            var searchCondition = {
                status: status,
                page: page,
                count: count,
                lotteryId: lotteryId,
                modifyUserName: modifyUserName,
                sideType: 1,
            };

            queryParamForSearch.condition = JSON.stringify(searchCondition);
            var testUrl1 = orderExpVarHolder.getOrderExpResourcePath() + '/list';
            httpFactory.getList(testUrl1, 'GET', null, queryParamForSearch)
                .then(function (response) {
                    var err = response.err;
                    if (err == "SUCCESS") {
                        var data = response.data;
                        var total = data.total;
                        if (total > 0) {
                            $scope.list = data.rows;
                        } else {
                            $scope.list = [];
                        }
                        common.soPage({
                            $id: 'page',
                            total: total,
                            size: $scope.queryParam.rows,
                            nowPage: $scope.queryParam.page
                        }, function (btn) {
                            $scope.queryParam.page = btn;
                            $scope.onOrderExpSearch(1)
                        })
                    } else {
                        //TODO:api错误返回调整
                        custNotify.error("获取配置失败", "获取配置失败");
                    }
                }, function (response) {
                    custNotify.error(lotteryConst.msgSelect.fail,  '提示:');
                });
        };
        //默认不调用
        $rootScope.onOrderExpSearch();
        $scope.onReset = function () {
            $scope.selectParam.lotterySelected = null;
            $scope.selectParam.statusSelected = null;
            // alert( $scope.queryParam.modifyUsername);
            $scope.queryParam.modifyUsername = null;
        };

        /**
         * 状态修改
         * @param id
         * @param status
         */
        $scope.onStatus = function (lotteryId, status) {
            status = status === 0 ? 1 : 0;
            var queryParamForSearch = {
                lotteryId: lotteryId,
                status: status
            };
            httpFactory.getList(orderExpVarHolder.getOrderExpResourcePath() + '/updateOrderExpStatus', 'GET', null, queryParamForSearch).then(function (data) {
                custNotify.success(lotteryConst.msgEdit.success, '提示:');
                $rootScope.onOrderExpSearch();
            }, function (data) {
                custNotify.error(lotteryConst.msgSelect.fail,  '提示:');
            });
        };
        $scope.open = function (page, size) {
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
        $scope.modifyOrderExp = function (modify, item) {
            orderExpVarHolder.modify = modify;
            orderExpVarHolder.item = item;
            $scope.open("app/pages/config/orderExp/official/orderExpUpdate.html", "md");
        }
    }
})();


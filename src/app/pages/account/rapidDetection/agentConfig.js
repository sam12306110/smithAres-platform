/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('agentConfig', agentConfig);

    /** @ngInject */
    function agentConfig($scope, httpFactory, lotteryConst, todoService, custNotify) {
        var headers = {
            "Content-Type": "application/json"
        };


        function initPage() {
            $scope.selectParam = {
                domain: null, //域名列表
                domainSelected: null,
                memberLevelSelected: {id: 0, value: '请选择'},
                memberLevel: [{id: 0, value: '请选择'}],
                retirementSelected: {id: 0, value: '请选择'},
                retirement: [{id: 0, value: '请选择'}],
                administrativeSelected: {id: 0, value: '请选择'},
                administrative: [{id: 0, value: '请选择'}],
                feePlanSelected: {id: 0, value: '请选择'},
                feePlan: [{id: 0, value: '请选择'}],
                registDiscountSelected: {id: 0, value: '请选择'},
                registDiscount: [{id: 0, value: '请选择'}],
                preferentialCostCheck: 0,
                rebateCostCheck: 0
            };
        }

        initPage();
        var data = todoService.get().data;
        if (data.memberLevel) {
            $scope.selectParam.memberLevelSelected = {id: data.memberLevel.cid, value: data.memberLevel.name};
        }
        $scope.selectParam.preferentialCostCheck = data.preferentialCost;
        $scope.selectParam.rebateCostCheck = data.rebateCost;

        //获取会员层级列表
        httpFactory.getList(lotteryConst.uaaPathPlat + '/memberLevel/getSelectList', 'GET', null, null).then(function (result) {
            if (result.data) {
                $scope.selectParam.memberLevel = $scope.selectParam.memberLevel.concat(result.data);
                $scope.selectParam.memberLevel.forEach(function (row) {
                    if (row.id == data.memberLevelId) {
                        $scope.selectParam.memberLevelSelected = row;
                    }
                });
            }
        }, function () {
            custNotify.error("服务器发生未知异常，请联系管理员！", "提示：");
        });

        // 获取退佣方案
        httpFactory.getList(lotteryConst.aresPathPlat + '/retirement/getSelectList', 'GET', null, null).then(function (result) {
            if (result.data) {
                $scope.selectParam.retirement = $scope.selectParam.retirement.concat(result.data);
                $scope.selectParam.retirement.forEach(function (row) {
                    if (row.id == data.retirementId) {
                        $scope.selectParam.retirementSelected = row;
                    }
                });
            }
        }, function () {
            custNotify.error("服务器发生未知异常，请联系管理员！", "提示：");
        });
        // 获取行政成本
        httpFactory.getList(lotteryConst.aresPathPlat + '/administrative/getSelectList', 'GET', null, null).then(function (result) {
            if (result.data) {
                $scope.selectParam.administrative = $scope.selectParam.administrative.concat(result.data);
                $scope.selectParam.administrative.forEach(function (row) {
                    if (row.id == data.administrativeId) {
                        $scope.selectParam.administrativeSelected = row;
                    }
                });
            }
        }, function () {
            custNotify.error("服务器发生未知异常，请联系管理员！", "提示：");
        });
        // 获取手续费
        httpFactory.getList(lotteryConst.aresPathPlat + '/feePlan/getSelectList', 'GET', null, null).then(function (result) {
            if (result.data) {
                $scope.selectParam.feePlan = $scope.selectParam.feePlan.concat(result.data);
                $scope.selectParam.feePlan.forEach(function (row) {
                    if (row.id == data.feePlanId) {
                        $scope.selectParam.feePlanSelected = row;
                    }
                });
            }
        }, function () {
            custNotify.error("服务器发生未知异常，请联系管理员！", "提示：");
        });
        // 获取注册优惠
        httpFactory.getList(lotteryConst.aresPathPlat + '/registDiscount/getSelectList', 'GET', null, null).then(function (result) {
            if (result.data) {
                $scope.selectParam.registDiscount = $scope.selectParam.registDiscount.concat(result.data);
                $scope.selectParam.registDiscount.forEach(function (row) {
                    if (row.id == data.registerDiscountId) {
                        $scope.selectParam.registDiscountSelected = row;
                    }
                });
            }
        }, function () {
            custNotify.error("服务器发生未知异常，请联系管理员！", "提示：");
        });


        $scope.onSave = function () {
            if (!$scope.selectParam.memberLevelSelected ||  $scope.selectParam.memberLevelSelected.id <=0 ) {
                custNotify.warning('请选择会员层级', '提示:');
                return;
            }
            if (!$scope.selectParam.retirementSelected ||  $scope.selectParam.retirementSelected.id <=0) {
                custNotify.warning('请选择退佣方案', '提示:');
                return;
            }
            if (!$scope.selectParam.administrativeSelected ||  $scope.selectParam.administrativeSelected.id <=0) {
                custNotify.warning('请选择行政方案', '提示:');
                return;
            }
            if (!$scope.selectParam.feePlanSelected ||  $scope.selectParam.feePlanSelected.id <=0) {
                custNotify.warning('请选择手续费', '提示:');
                return;
            }

            var entity = {
                cid: null,
                memberLevelId: null
            };
            if (data.agentId) {
                entity.cid = data.agentId;
            }
            if ($scope.selectParam.memberLevelSelected) {
                entity.memberLevelId = $scope.selectParam.memberLevelSelected.id;
            }
            if ($scope.selectParam.memberLevelSelected) {
                entity.memberLevelId = $scope.selectParam.memberLevelSelected.id;
            }
            if ($scope.selectParam.retirementSelected) {
                entity.retirementId = $scope.selectParam.retirementSelected.id;
            }
            if ($scope.selectParam.administrativeSelected) {
                entity.administrativeId = $scope.selectParam.administrativeSelected.id;
            }
            if ($scope.selectParam.feePlanSelected) {
                entity.feePlanId = $scope.selectParam.feePlanSelected.id;
            }
            if ($scope.selectParam.registDiscountSelected) {
                entity.registerDiscountId = $scope.selectParam.registDiscountSelected.id;
            }
            entity.preferentialCost = $scope.selectParam.preferentialCostCheck;
            entity.rebateCost = $scope.selectParam.rebateCostCheck;
            httpFactory.getList(lotteryConst.aresAccount + '/agent/chgInfo', 'POST', headers, entity).then(function () {
                custNotify.success('修改成功！', '提示:');
                $scope.$dismiss();
            }, function () {
                custNotify.error('修改失败！', '提示:');
            });
        };

    }
})();
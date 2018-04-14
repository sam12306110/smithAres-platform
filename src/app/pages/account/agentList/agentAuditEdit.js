/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('agentAuditEdit', agentAuditEdit);

    /** @ngInject */
    function agentAuditEdit($scope, httpFactory, lotteryConst, custNotify, todoService, common, $filter) {
        var url = lotteryConst.aresAccount + '/agent';

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
                ringhtRsUrl: [],
                preferentialCostCheck: 0,
                rebateCostCheck: 0
            };

        }

        initPage(); //初始化页面参数


        $scope.edit = todoService.get().edit;
        $scope.entity = todoService.get().item;
        if ($scope.edit) {
            $scope.titleName = "审核账号";
        } else {
            $scope.titleName = "查看账号";
        }
        if ($scope.entity) {
            $scope.selectParam.preferentialCostCheck = $scope.entity.preferentialCost;
            $scope.selectParam.rebateCostCheck = $scope.entity.rebateCost;
        }
        // 获取会员层级
        httpFactory.getList(lotteryConst.uaaPathPlat + '/memberLevel/getSelectList', 'GET', null, null).then(function (result) {
            if (result.data) {
                $scope.selectParam.memberLevel = $scope.selectParam.memberLevel.concat(result.data);
                $scope.selectParam.memberLevel.forEach(function (row) {
                    if (row.id == $scope.entity.memberLevelId) {
                        $scope.selectParam.memberLevelSelected = row;
                    }
                });
            }
        }, function (result) {
            custNotify.error("服务器发生未知异常，请联系管理员！", "提示：");
        });
        // 获取退佣方案
        httpFactory.getList(lotteryConst.aresPathPlat + '/retirement/getSelectList', 'GET', null, null).then(function (result) {
            if (result.data) {
                $scope.selectParam.retirement = $scope.selectParam.retirement.concat(result.data);
                $scope.selectParam.retirement.forEach(function (row) {
                    if (row.id == $scope.entity.retirementId) {
                        $scope.selectParam.retirementSelected = row;
                    }
                });
            }
        }, function (result) {
            custNotify.error("服务器发生未知异常，请联系管理员！", "提示：");
        });
        // 获取行政成本
        httpFactory.getList(lotteryConst.aresPathPlat + '/administrative/getSelectList', 'GET', null, null).then(function (result) {
            if (result.data) {
                $scope.selectParam.administrative = $scope.selectParam.administrative.concat(result.data);
                $scope.selectParam.administrative.forEach(function (row) {
                    if (row.id == $scope.entity.administrativeId) {
                        $scope.selectParam.administrativeSelected = row;
                    }
                });
            }
        }, function (result) {
            custNotify.error("服务器发生未知异常，请联系管理员！", "提示：");
        });
        // 获取手续费
        httpFactory.getList(lotteryConst.aresPathPlat + '/feePlan/getSelectList', 'GET', null, null).then(function (result) {
            if (result.data) {
                $scope.selectParam.feePlan = $scope.selectParam.feePlan.concat(result.data);
                $scope.selectParam.feePlan.forEach(function (row) {
                    if (row.id == $scope.entity.feePlanId) {
                        $scope.selectParam.feePlanSelected = row;
                    }
                });
            }
        }, function (result) {
            custNotify.error("服务器发生未知异常，请联系管理员！", "提示：");
        });
        // 获取注册优惠
        httpFactory.getList(lotteryConst.aresPathPlat + '/registDiscount/getSelectList', 'GET', null, null).then(function (result) {
            if (result.data) {
                $scope.selectParam.registDiscount = $scope.selectParam.registDiscount.concat(result.data);
                $scope.selectParam.registDiscount.forEach(function (row) {
                    if (row.id == $scope.entity.registerDiscountId) {
                        $scope.selectParam.registDiscountSelected = row;
                    }
                });
            }
        }, function (result) {
            custNotify.error("服务器发生未知异常，请联系管理员！", "提示：");
        });
        //获取域名列表

        httpFactory.getList(lotteryConst.aresPathPlat + '/domain/listAgent', 'GET', null, null).then(function (result) {
            if (result.data) {
                $scope.selectParam.rsUrl = result.data;
            }
        }, function (data) {
            custNotify.error("服务器发生未知异常，请联系管理员！", "提示：");
        });
        /**
         * 获取当前代理的域名
         */
        httpFactory.getList(lotteryConst.aresPathPlat + '/domain/findDomainList', 'GET', null, {agentId: $scope.entity.cid}).then(function (result) {
            if (result.data) {
                $scope.selectParam.ringhtRsUrl = result.data;
            }
        }, function (result) {
            custNotify.error("服务器发生未知异常，请联系管理员！", "提示：");
        });
        //移除当前的域名
        $scope.removeCurrentEl = function (item) {

            $scope.selectParam.rsUrl = $scope.selectParam.rsUrl.filter(function (el) {
                return el.value !== item.value;
            });
            $scope.selectParam.ringhtRsUrl.push(item);

        };
        $scope.removeCurrentEl2 = function (item) {

            $scope.selectParam.ringhtRsUrl = $scope.selectParam.ringhtRsUrl.filter(function (el) {
                return el.value !== item.value;
            });
            $scope.selectParam.rsUrl.push(item);

        };

        function getDomainSelect() {
            httpFactory.getList(lotteryConst.aresPathPlat + '/domain/listAgent', 'GET', null, null).then(function (result) {
                if (result.data) {
                    $scope.selectParam.domain = result.data;
                } else {
                    $scope.selectParam.domain = [{id: null, value: "暂无数据"}];
                }
            }, function (result) {
                custNotify.error("服务器发生未知异常，请联系管理员！", "提示：");
            });
        }

        getDomainSelect();

        $scope.onSave = function (auditStatus) {
            if (auditStatus === 1) {
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


                if ($scope.selectParam.memberLevelSelected) {
                    $scope.entity.memberLevelId = $scope.selectParam.memberLevelSelected.id;
                }
                if ($scope.selectParam.retirementSelected) {
                    $scope.entity.retirementId = $scope.selectParam.retirementSelected.id;
                }
                if ($scope.selectParam.administrativeSelected) {
                    $scope.entity.administrativeId = $scope.selectParam.administrativeSelected.id;
                }
                if ($scope.selectParam.feePlanSelected) {
                    $scope.entity.feePlanId = $scope.selectParam.feePlanSelected.id;
                }

                if ($scope.selectParam.registDiscountSelected) {
                    $scope.entity.registerDiscountId = $scope.selectParam.registDiscountSelected.id;
                }
                $scope.entity.preferentialCost = $scope.selectParam.preferentialCostCheck;
                $scope.entity.rebateCost = $scope.selectParam.rebateCostCheck;
                if ($scope.selectParam.ringhtRsUrl && auditStatus == 1) {
                    var domains = [];
                    $scope.selectParam.ringhtRsUrl.forEach(function (row) {
                        domains.push(row.id);
                    });
                    $scope.entity.domains = domains;
                }
            }

            $scope.entity.auditStatus = auditStatus;
            httpFactory.getList(url + '/save', 'POST', null, $scope.entity).then(function (result) {
                custNotify.success('审核成功！', '提示:');
                $scope.$dismiss();
            }, function (result) {
                custNotify.error('审核失败！', '提示：');
            });

        };
    }

})();


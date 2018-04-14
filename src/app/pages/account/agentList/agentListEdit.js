/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('agentListEdit', agentListEdit);

    /** @ngInject */
    function agentListEdit($scope, httpFactory, lotteryConst, custNotify, todoService, common, $filter) {
        var url = lotteryConst.aresAccount + '/agent';

        function initPage() {
            $scope.selectParam = {
                rsUrl: [],
                ringhtRsUrl: [],
                bankNameSelect: '',
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
            $scope.entity = {
                isAudit: 0,
                memberLevelId: 0, //会员默认层级
                retirementId: 0, //退佣方案
                administrativeId: 0,//行政成本
                feePlanId: 0,//行政成本
                registerDiscountId: 0,//会员注册优惠
                preferentialCost:0,  //优惠成本 （0 没有 1 有）
                rebateCost: 0,               //返水成本（0 没有 1 有）
                domains: []
            };


        }

        initPage();

        $scope.edit = todoService.get().edit;
        if ($scope.edit) {

            $scope.titleName = "新增代理账号";
        } else {


        }
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
            custNotify.error("服务器发生未知异常，请联系管理员！", "提示：")
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
            custNotify.error("服务器发生未知异常，请联系管理员！", "提示：")
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
            custNotify.error("服务器发生未知异常，请联系管理员！", "提示：")
        });

        //获取域名列表
        httpFactory.getList(lotteryConst.aresPathPlat + '/domain/listAgent', 'GET', null, null).then(function (result) {
            if (result.data) {
                $scope.selectParam.rsUrl = result.data;
            }
        }, function (data) {

        });
        //获取会员层级列表
        httpFactory.getList(lotteryConst.uaaPathPlat + '/memberLevel/getSelectList', 'GET', null, null).then(function (result) {
            if (result.data) {
                $scope.selectParam.memberLevel = $scope.selectParam.memberLevel.concat(result.data);
            }
        }, function (data) {
            custNotify.error("服务器发生未知异常，请联系管理员！", "提示：")
        });
        //获取银行列表
        httpFactory.getList(lotteryConst.payConfigPath + '/income/banks', 'GET', null, null).then(function (data) {
            $scope.selectParam.banks = data.data;
        }, function (data) {
            custNotify.error('系统提示', '服务器出现未知错误！');
        });

        //验证代理账号不能为中文
        $scope.checkagentAccount = function () {
            return !/^[^\u4e00-\u9fa5]+$/.test($scope.entity.agentAccount);
        };
        //验证密码
        $scope.checkpassword = function () {
            return !/^[0-9A-Za-z]{6,20}$/.test($scope.entity.loginPwd);
        };
        //验证确认密码
        $scope.checkIsEqual = function () {
            if (!/^[0-9A-Za-z]{6,20}$/.test($scope.entity.confirmPassword)) {
                return true;
            } else {
                return $scope.selectParam.confirmPassword != $scope.entity.loginPwd;
            }

        };
        //验证真实姓名
        $scope.checkrealyName = function () {
            return !/^[\u4e00-\u9fa5]{2,8}$/.test($scope.entity.agentName);
        };
        //验证银行卡号
        $scope.checkBankNum = function () {
            return !/^([1-9]{1})(\d{15,18})$/.test($scope.entity.bankNo);
        };
        //验证电话号码
        $scope.checktelphone = function () {
            return !/^1[34578]\d{9}$/.test($scope.entity.phone);
        };
        //验证电子邮箱
        $scope.checkeMails = function () {
            if (!$scope.entity.email) {
                return false;
            }
            return !/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test($scope.entity.email);
        };
        //qq验证
        $scope.checkQQ = function () {
            if (!$scope.entity.qq) {
                return false;
            }
            return !/^[1-9][0-9]{4,12}$/.test($scope.entity.qq);
        };
        //微信验证
        $scope.checkweixin = function () {
            if (!$scope.entity.wechat) {
                return false;
            }
            return !/^[a-zA-Z\d_]{5,}$/.test($scope.entity.wechat);
        };

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

        $scope.onSave = function () {
            if ($scope.entity.agentAccount== null || $scope.entity.loginPwd== null|| $scope.selectParam.confirmPassword==null||$scope.entity.agentName==null||
                $scope.entity.bankNo ==null||$scope.entity.phone==null || $scope.entity.bank==null
            ) {
                return;
            }
            if (!$scope.selectParam.bankNameSelect) {
                custNotify.warning('请输入银行名称', '提示:');
                return;
            }
            if ($scope.checkagentAccount() || $scope.checkpassword() || $scope.checkIsEqual() || $scope.checkrealyName() || $scope.checkBankNum() || $scope.checktelphone() || $scope.checkeMails() || $scope.checkQQ() || $scope.checkweixin()) {
                custNotify.warning('参数错误', '提示:');
                return;
            }

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
            if ($scope.selectParam.bankNameSelect) {
                $scope.entity.bankName = $scope.selectParam.bankNameSelect.bankName
            }

            if ($scope.selectParam.ringhtRsUrl) {
                for (var i = 0; i < $scope.selectParam.ringhtRsUrl.length; i++) {
                    $scope.entity.domains.push($scope.selectParam.ringhtRsUrl[i].id);
                }
            }
            httpFactory.getList(url + '/save', 'POST', null, $scope.entity).then(function (result) {
                if (result.data) {
                    custNotify.success('新增成功！', '提示:');
                    $scope.$dismiss();
                } else {
                    custNotify.warning('代理账号已存在！', '提示:');
                }
            }, function (result) {
                custNotify.error('新增失败', '提示:');
            });
        };
    }
})();


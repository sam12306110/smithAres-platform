/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('manualWithdrawal', manualWithdrawal);

    /** @ngInject */
    function manualWithdrawal($scope, httpFactory, lotteryConst, custNotify, $uibModal, todoService, $filter) {
        function initPage() {
            $scope.selectParam = {
                depositType: lotteryConst.depositType,
                depositTypeSelected: null,
                withdrawalType: lotteryConst.withdrawalType,
                withdrawalTypeSelected: null
            };
            $scope.selectParam.depositTypeSelected = $scope.selectParam.depositType[0];
            $scope.selectParam.withdrawalTypeSelected = $scope.selectParam.withdrawalType[0];

            $scope.checkMode = [
                {id: 1, value: '存款优惠', isCheck: false},
                {id: 2, value: '汇款优惠', isCheck: false}
            ];
            $scope.entity = null;

            $scope.queryParam = {
                memberName: null
            };

            $scope.charge = {
                chargeAmount: null,
                chargeRemark: null,
                depDiscount: null,
                depRemark: null,
                remDiscount: null,
                remRemark: null
            };
            $scope.draw = {
                chargeAmount: null,
                chargeRemark: null
            };
            $scope.depositText = null;
        }
        initPage();

        $scope.onSearch = function () {
            if(!$scope.queryParam.memberName) {
                return;
            }
            httpFactory.getList(lotteryConst.hermesApi + '/balance/get', 'GET', null, $scope.queryParam).then(function (result) {
                if (result.data) {
                    $scope.entity = result.data;
                    $scope.entity.amount = $filter('number')($scope.entity.amount / 100, 2);
                    if ($scope.entity.discount) {
                        httpFactory.getList(lotteryConst.aresPathPlat + '/accessDiscount/artificialView', 'GET', null, {cid: $scope.entity.discount.cid}).then(function (result) {
                            $scope.accessDiscountItem = result.data;
                            if ($scope.accessDiscountItem) {
                                $scope.depositText = $scope.accessDiscountItem.minDepositAmount / 100 + '~' + $scope.accessDiscountItem.maxDepositAmount / 100;
                            } else {
                                $scope.depositText = "";
                            }
                        }, function (data) {

                        });
                    } else {

                    }
                } else {
                    $scope.entity = result.data;
                    custNotify.warning('找不到该账号！', '温馨提示');
                }
            }, function (data) {

            });
        };

        /**
         * 人工存款
         */
        $scope.onCharge = function () {
            if(!$scope.charge.chargeAmount){
                return;
            }
            if ($scope.entity.memberId == null) {
                custNotify.warning('请输入正确的会员账号！', '温馨提示');
                return
            }
            if ($scope.charge.chargeAmount<0 ||$scope.charge.depDiscount<0 ||$scope.charge.remDiscount<0) {
                custNotify.warning('请输入正整数！', '温馨提示');
                return
            }
            if ($scope.accessDiscountItem) {
                if ($scope.charge.chargeAmount < $scope.accessDiscountItem.minDepositAmount / 100 || $scope.charge.chargeAmount > $scope.accessDiscountItem.maxDepositAmount / 100) {
                    custNotify.warning('请输入金额在' + $scope.depositText + '之间', '温馨提示');
                    return
                }
            }
            var entity = {
                memberName: "",
                memberId: null,
                actionType: null,
                chargeAmount: 0,
                chargeRemark: null,
                depDiscount: 0,
                depRemark: null,
                remDiscount: 0,
                remRemark: null
            };
            entity.actionType = $scope.selectParam.depositTypeSelected.id;
            entity.memberId = $scope.entity.memberId;
            entity.memberName = $scope.entity.memberName;
            entity.chargeAmount = $scope.charge.chargeAmount * 100 || 0;
            entity.chargeRemark = $scope.charge.chargeRemark;
            $scope.checkMode.forEach(function (item) {
                if (item.isCheck) {
                    if (item.id === 1) {
                        entity.depDiscount = $scope.charge.depDiscount * 100 || 0;
                        entity.depRemark = $scope.charge.depRemark;
                    }
                    if (item.id === 2) {
                        entity.remDiscount = $scope.charge.remDiscount * 100 || 0;
                        entity.remRemark = $scope.charge.remRemark;
                    }
                }
            });
            if ($scope.charge.chargeAmount <= 0) {
                custNotify.warning('请输入大于0的整数！', '温馨提示');
                return
            }
            todoService.set({
                entity: entity,
                type: 0
            });
            open('app/pages/funds/manualWithdrawal/manualWithdrawalPop.html', 'sm');
        };

        function open(page, size) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size
            });
            modalInstance.result.then(function (result) {
                //$scope.onSearch();
                initPage()
            }, function (reason) {
                //$scope.onSearch();
                initPage()
            });
        }

        $scope.onDraw = function () {
            if ($scope.entity.memberId == null) {
                custNotify.success('找不到该账号！', '温馨提示');
                return
            }
            if(!$scope.draw.drawAmount){
                return;
            }
            if ($scope.draw.drawAmount<0) {
                custNotify.warning('请输入正整数！', '温馨提示');
                return
            }
            var entity = {
                memberName: '',
                memberId: null,
                actionType: null,
                drawAmount: 0,
                drawRemark: null
            };

            entity.memberId = $scope.entity.memberId;
            entity.memberName = $scope.entity.memberName;
            entity.actionType = $scope.selectParam.withdrawalTypeSelected.id;
            entity.drawAmount = $scope.draw.drawAmount * 100 || 0;
            entity.drawRemark = $scope.draw.drawRemark;
            if ($scope.draw.drawAmount <= 0) {
                custNotify.warning('请输入大于0的整数！', '温馨提示');
                return
            }
            todoService.set({
                entity: entity,
                type: 1
            });
            open('app/pages/funds/manualWithdrawal/manualWithdrawalPop.html', 'sm');
        };


        $scope.openTab = function (index) {
            initPage();
        };

        $scope.onCancel = function () {
            initPage();
        };
        $scope.$watch('checkMode[0].isCheck', function (newVal) {
            if (!$scope.checkMode[0].isCheck) {
                $scope.charge.depDiscount = null;
                $scope.charge.depRemark = null;
            } else {
                if ($scope.selectParam.depositTypeSelected.id == 10 && $scope.accessDiscountItem) {
                    // $scope.charge.chargeAmount	galen_53
                    if ($scope.accessDiscountItem.preferentialStandards / 100 <= $scope.charge.chargeAmount) {
                        $scope.charge.depDiscount = $scope.charge.chargeAmount * $scope.accessDiscountItem.discountPercentage / 10000;
                    } else {
                        $scope.charge.depDiscount = null;
                    }
                }
            }
        });
        $scope.$watch('checkMode[1].isCheck', function (newVal) {
            if (!$scope.checkMode[1].isCheck) {
                $scope.charge.remDiscount = null;
                $scope.charge.remRemark = null;
            }
        });
        $scope.$watch('selectParam.depositTypeSelected', function (newVal) {
            $scope.checkMode[0].isCheck = false;
            $scope.charge.depDiscount = null;
            $scope.charge.remDiscount = null;
            if ($scope.accessDiscountItem) {
                $scope.depositText = $scope.accessDiscountItem.minDepositAmount / 100 + '~' + $scope.accessDiscountItem.maxDepositAmount / 100;
            } else {
                $scope.depositText = "";
            }
        });


        function isPositiveNum(num) {
            var re = /^[0-9]*$/;
            return re.test(num);
        }
    }
})();




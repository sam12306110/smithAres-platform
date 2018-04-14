/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').directive('ngInput', [function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attrs) {
                element.on('input', oninput);
                scope.$on('$destroy', function () {//销毁的时候取消事件监听
                    element.off('input', oninput);
                });

                function oninput(event) {
                    scope.$evalAsync(attrs['ngInput'], {$event: event, $value: this.value});
                }
            }
        };
    }]).controller('accessDiscountEdit', accessDiscountEdit);

    /** @ngInject */
    function accessDiscountEdit($scope, httpFactory, lotteryConst, custNotify, todoService, $filter) {
        var url = lotteryConst.aresPathPlat + '/accessDiscount';
        $scope.onlineFlowFirst = {
            depositType: 1,
            ifFirst: 1
        };
        $scope.onlineFlowEach = {
            depositType: 1,
            ifFirst: 0
        };
        $scope.companyFlowFirst = {
            depositType: 2,
            ifFirst: 1
        };
        $scope.companyFlowEach = {
            depositType: 2,
            ifFirst: 0
        };

        $scope.artificial = {
            depositType: 3,
            ifFirst: 0
        };
        $scope.flat = false;

        $scope.entity = {};
        $scope.exceptHundred = function (obj) {
            for (var k in obj) {
                if (k == 'preferentialStandards' || k == 'discountPercentage' || k == 'maxDepositAmount' || k == 'minDepositAmount' || k == 'normalAuditQuota' || k == "normalAuditRate") {
                    obj[k] = obj[k] / 100;
                }

            }
        };
        $scope.multiplyHundred = function (obj) {
            for (var k in obj) {
                if (k == 'preferentialStandards' || k == 'discountPercentage' || k == 'maxDepositAmount' || k == 'minDepositAmount' || k == 'normalAuditQuota' || k == "normalAuditRate") {
                    obj[k] = obj[k] * 100;
                }
            }
        };


        $scope.edit = todoService.get().edit;
        if (todoService.get().item) {
            $scope.entity = todoService.get().item;
            httpFactory.getList(url + '/view', 'GET', null, {cid: $scope.entity.cid}).then(function (result) {
                $scope.entity = result.data;
                if ($scope.entity) {
                    $scope.entity.dispFee = $scope.entity.dispFee / 100;
                    $scope.entity.dispFeeLimit = $scope.entity.dispFeeLimit / 100;
                    $scope.entity.dispCapped = $scope.entity.dispCapped / 100;
                    $scope.entity.dispLower = $scope.entity.dispLower / 100;
                    $scope.entity.dailyAmountLimit = $scope.entity.dailyAmountLimit / 100;
                    if ($scope.entity.itemPO && $scope.entity.itemPO.length > 0) {
                        $scope.onlineFlowFirst = $filter('filter')($scope.entity.itemPO, {depositType: 1, ifFirst: 1})[0];
                        $scope.onlineFlowFirst.ifNormalAudit = $scope.onlineFlowFirst.ifNormalAudit == 1;
                        $scope.exceptHundred($scope.onlineFlowFirst);
                        $scope.onlineFlowEach = $filter('filter')($scope.entity.itemPO, {depositType: 1, ifFirst: 0})[0];
                        $scope.onlineFlowEach.ifNormalAudit = $scope.onlineFlowFirst.ifNormalAudit == 1;
                        $scope.exceptHundred($scope.onlineFlowEach);
                        $scope.companyFlowFirst = $filter('filter')($scope.entity.itemPO, {depositType: 2, ifFirst: 1})[0];
                        $scope.companyFlowFirst.ifNormalAudit = $scope.onlineFlowFirst.ifNormalAudit == 1;
                        $scope.exceptHundred($scope.companyFlowFirst);
                        $scope.companyFlowEach = $filter('filter')($scope.entity.itemPO, {depositType: 2, ifFirst: 0})[0];
                        $scope.companyFlowEach.ifNormalAudit = $scope.onlineFlowFirst.ifNormalAudit == 1;
                        $scope.exceptHundred($scope.companyFlowEach);
                        $scope.artificial = $filter('filter')($scope.entity.itemPO, {depositType: 3, ifFirst: 0})[0];
                        $scope.exceptHundred($scope.artificial);
                    }
                }
            }, function (data) {
            });
            $scope.titleName = "修改出入款方案";
        } else {
            $scope.titleName = "新增出入款方案";
        }

        $scope.onSave = function () {
            if ($scope.entity.title == null || $scope.entity.dispCapped == null || $scope.entity.dispLower == null) {
                return;
            }


            var entity = {
                cid: $scope.entity.cid,
                title: $scope.entity.title,
                dispFee: $scope.entity.dispFee * 100,
                dispFeeLimit: $scope.entity.dispFeeLimit * 100,
                dispCapped: $scope.entity.dispCapped * 100,
                dispLower: $scope.entity.dispLower * 100,
                freeCount: $scope.entity.freeCount,
                repeatFeeCount: $scope.entity.repeatFeeCount,
                dailyAmountLimit: $scope.entity.dailyAmountLimit * 100,
                itemPO: []
            };
            var onlineFlowFirst = $scope.onlineFlowFirst;
            onlineFlowFirst.ifNormalAudit = onlineFlowFirst.ifNormalAudit == true ? 1 : 0;
            $scope.multiplyHundred(onlineFlowFirst);
            entity.itemPO.push(onlineFlowFirst);
            var onlineFlowEach = $scope.onlineFlowEach;
            onlineFlowEach.ifNormalAudit = onlineFlowEach.ifNormalAudit == true ? 1 : 0;
            $scope.multiplyHundred($scope.onlineFlowEach);
            entity.itemPO.push($scope.onlineFlowEach);
            var companyFlowFirst = $scope.companyFlowFirst;
            companyFlowFirst.ifNormalAudit = companyFlowFirst.ifNormalAudit == true ? 1 : 0;
            $scope.multiplyHundred(companyFlowFirst);
            entity.itemPO.push(companyFlowFirst);
            var companyFlowEach = $scope.companyFlowEach;
            companyFlowEach.ifNormalAudit = companyFlowEach.ifNormalAudit == true ? 1 : 0;
            $scope.multiplyHundred(companyFlowEach);
            entity.itemPO.push(companyFlowEach);
            var artificial = $scope.artificial;
            $scope.multiplyHundred(artificial);
            entity.itemPO.push(artificial);

            httpFactory.getList(url + '/save', 'POST', null, entity).then(function (result) {
                if (result.data == null) {
                    custNotify.warning('方案名称重复！', '提示:');
                    return;
                }
                custNotify.success(lotteryConst.msgAdd.success, '提示:');
                $scope.$dismiss();
            }, function () {
                custNotify.error('新增失败！', '提示:');
            });
        };

        $scope.$watch('mForm', function (newVal) {
            console.log($scope.mForm.$)
        });
    }
})();


/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('refundBillDetails', refundBillDetails);

    /** @ngInject */
    function refundBillDetails($scope, httpFactory, lotteryConst, custNotify, todoService, $filter) {
        var url = lotteryConst.aresPathPlat + '/retirement';
        $scope.itemPO = [];
        $scope.entity = {};
        $filter('filter')(lotteryConst.lottery, {sideType: 2}).forEach(function (row) {
            var item = {cid: null, lotteryId: null, retirementId: null, percentage: 0, value: null, lotteryType: null};
            item.lotteryId = row.id;
            item.value = row.value;
            item.lotteryType = row.lotteryType;
            $scope.itemPO.push(item);
        });


        $scope.edit = todoService.get().edit;
        console.log($scope.edit);
        if (todoService.get().item) {
            var item = todoService.get().item;
            httpFactory.getList(url + '/view', 'GET', null, {cid: item.cid}).then(function (result) {
                if (result.data) {
                    $scope.entity = result.data;
                    $scope.entity.currentEffBet = $scope.entity.currentEffBet / 100;
                    $scope.entity.currentProfit = $scope.entity.currentProfit / 100;
                    $scope.itemPO.forEach(function (item) {
                        $scope.entity.itemPO.forEach(function (row) {
                            if (item.lotteryId == row.lotteryId) {
                                item.cid = row.cid;
                                item.retirementId = row.retirementId;
                                item.percentage = row.percentage / 100;
                            }
                        });
                    });
                }
            }, function (result) {

            });
            $scope.titleName = "修改退佣方案";
        } else {
            $scope.titleName = "新增退佣方案";
        }

        $scope.onSave = function () {
            if ($scope.entity.name == null || $scope.entity.effMemberNum == null || $scope.entity.currentEffBet == null || $scope.entity.currentProfit == null) {
                return;
            }
            var checkFlag = false;
            $scope.itemPO.forEach(function (row) {
                if (row.percentage == undefined)
                    checkFlag = true;
            });
            if (checkFlag) {
                return;
            }

            var entity = {
                cid: $scope.entity.cid,
                name: $scope.entity.name, //退佣方案名称
                effMemberNum: $scope.entity.effMemberNum, //有效会员数量
                currentEffBet: $scope.entity.currentEffBet * 100, //当期有效投注额
                currentProfit: $scope.entity.currentProfit * 100, //当期盈利金额
                itemPO: []
            };
            $scope.itemPO.forEach(function (row) {
                var item = {cid: null, retirementId: null, lotteryId: null, percentage: 0};
                item.cid = row.cid;
                item.retirementId = row.retirementId;
                item.lotteryId = row.lotteryId;
                item.percentage = row.percentage == null ? 0 : row.percentage * 100;
                entity.itemPO.push(item);
            });
            httpFactory.getList(url + '/save', 'POST', null, entity).then(function (result) {
                if (result.data == -1) {
                    custNotify.warning('名称重复', '提示：');
                    return false;
                }
                custNotify.success('操作成功', '提示：');
                $scope.$dismiss();
            }, function () {
                custNotify.error('操作失败', '提示：');
            });
        };
    }

})();


/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('quotaLimitSideEdit', quotaLimitSideEdit);

    /** @ngInject */
    function quotaLimitSideEdit($scope, httpFactory, custNotify, lotteryConst, todoService) {
        var url = lotteryConst.aresPath + '/quotaLimit';
        $scope.selectParam = {
            lottery: lotteryConst.lottery,
            lotterySelected: null
        };
        $scope.selectParam.lotterySelected = $scope.selectParam.lottery[1];
        $scope.entity = {
            cid: null,
            lotteryId: null,
            name: null,
            cancelStartAmount: null,
            cancelFeeRate: null,
            periodLimitAmount: null,
            chaseCountLimit: null,
            manulOrderCountLimit: null,
            continueOrderIntval: null,
            managerCancelTime: null,
            moneyMode: null
        };
        $scope.moneyMode = [
            {id: 'y', value: '元', isCheck: false},
            {id: 'j', value: '角', isCheck: false},
            {id: 'f', value: '分', isCheck: false}
        ];
        $scope.edit = todoService.get().edit;
        if (todoService.get().item) {
            $scope.entity = todoService.get().item;
            $scope.moneyMode.forEach(function (record) {
                if ($scope.entity.moneyMode.indexOf(record.id) >= 0) {
                    record.isCheck = true;
                }
            });
            $scope.selectParam.lottery.forEach(function (record) {
                if (record.id == $scope.entity.lotteryId) {
                    $scope.selectParam.lotterySelected = record;
                }
            });
            $scope.entity.cancelFeeRateClone = $scope.entity.cancelFeeRate / 100;
            $scope.titleName = "修改投注配置";
        } else {
            $scope.titleName = "新增投注配置";
        }


        $scope.onSave = function () {
            var moneyMode = '';
            $scope.moneyMode.forEach(function (item) {
                if (item.isCheck) {
                    item.id += ',';
                    moneyMode += item.id;
                }
            });
            $scope.entity.moneyMode = moneyMode.substring(0, moneyMode.length - 1);

            if ($scope.selectParam.lotterySelected != null) {
                $scope.entity.lotteryId = $scope.selectParam.lotterySelected.id;
                $scope.entity.name = $scope.selectParam.lotterySelected.value;
            }
            $scope.entity.cancelFeeRate = $scope.entity.cancelFeeRateClone * 100 || 0;
            $scope.entity.cancelStartAmount = $scope.entity.cancelStartAmount || 0;
            $scope.entity.periodLimitAmount = $scope.entity.periodLimitAmount || 0;
            $scope.entity.chaseCountLimit = $scope.entity.chaseCountLimit || 0;
            $scope.entity.manulOrderCountLimit = $scope.entity.manulOrderCountLimit || 0;
            $scope.entity.continueOrderIntval = $scope.entity.continueOrderIntval || 0;
            $scope.entity.managerCancelTime = $scope.entity.managerCancelTime || 0;
            $scope.entity.sideType = 2;
            httpFactory.getList(url + '/save', 'POST', null, $scope.entity).then(function (result) {
                $scope.$dismiss();
                custNotify.success('新增成功！', '提示:');
            }, function (data) {
                custNotify.error('新增失败！', '提示:');
            });
        };
    }
})();


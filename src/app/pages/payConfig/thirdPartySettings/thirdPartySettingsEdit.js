/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('thirdPartySettingsEdit', thirdPartySettingsEdit);

    /** @ngInject */
    function thirdPartySettingsEdit($scope, lotteryConst, custNotify, httpFactory, todoService) {
        var url = lotteryConst.payConfigPath + '/thirdpay';
        $scope.item = todoService.get().item;
        $scope.selectParam = {
            memberLevelSelected:todoService.get().item.userLevels,
            memberLevel:null,
            stopAmount:todoService.get().item.stopAmount/100,
            warnAmount:todoService.get().item.warnAmount/100
        };
        //获取会员层级列表
        httpFactory.getList(lotteryConst.uaaPathPlat + '/memberLevel/getSelectList', 'GET', null, null).then(function (result) {
            //console.log(result)
            if (result.data) {
                $scope.selectParam.memberLevel = result.data;
                $scope.memberLevel=$scope.selectParam.memberLevel;

            }
            //console.log($scope.selectParam.memberLevel)
        }, function (data) {

        });
        $scope.onSave = function () {
            $scope.item.stopAmount=$scope.selectParam.stopAmount*100;
            $scope.item.warnAmount=$scope.selectParam.warnAmount*100;
            $scope.item.userLevels=$scope.selectParam. memberLevelSelected;
            for (var i in $scope.item) {
                var e = $scope.item[i]
                switch (i) {
                    case 'merchantName':
                        if (e == null || e == '') {
                            custNotify.error('操作提示', '请输入商家名称！');
                            return
                        }
                        break;
                    case 'merchantNo':
                        if (e == null || e == '') {
                            custNotify.error('操作提示', '请输入商户号！');
                            return
                        }
                        break;
                    case 'stopAmount':
                        if (e == null || e == '') {
                            custNotify.error('操作提示', '请输入停用金额！');
                            return
                        }
                        if (typeof e !== 'number') {
                            custNotify.error('操作提示', '停用金额必须是数字！');
                            return
                        }
                        break;
                    case 'warnAmount':
                        if (e == null || e == '') {
                            custNotify.error('操作提示', '请输入预警金额！');
                            return
                        }
                        if (typeof e !== 'number') {
                            custNotify.error('操作提示', '预警金额必须是数字！');
                            return
                        }
                        break;
                    case 'merchantKey':
                        if (e == null || e == '') {
                            custNotify.error('操作提示', '请输入商家密钥！');
                            return
                        }
                        break;
                    case 'merchantPublicKey':
                        if (e == null || e == '') {
                            custNotify.error('操作提示', '请输入商家公钥！');
                            return
                        }
                        break;
                }
            }
            httpFactory.getList(url + '/edit', 'POST', null, $scope.item).then(function (result) {
                $scope.$dismiss()
                custNotify.success(lotteryConst.msgEdit.success, '提示:');
            }, function (data) {
                custNotify.error('查询失败', '提示！');
            });
        }

    }
})();

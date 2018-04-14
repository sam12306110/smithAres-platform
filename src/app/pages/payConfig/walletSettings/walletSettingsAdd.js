/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('walletSettingsAdd', walletSettingsAdd);

    /** @ngInject */
    function walletSettingsAdd($scope, lotteryConst, custNotify, todoService, httpFactory, common) {
        var url = lotteryConst.payConfigPath + '/walletpay';
        $scope.item = todoService.get().item;
        $scope.typeStr = '微信';
        if ($scope.item === 1) {
            $scope.typeStr = '支付宝';
        }
        $scope.selectParam = {
            currency: 'CNY',
            accountNo: null,
            accountName: null,
            realName: null,
            qrCode: null,
            accountType: $scope.item
        }
        common.initUpImg({
            $id: 'upImg',
            upload: lotteryConst.imgUrl + '/photo/upload'
        }, function (res) {
            if (res.code === 0) {
                $scope.selectParam.qrCode = res.picid;
                custNotify.success('操作提示', '图片上传成功！');
            } else {
                custNotify.error('操作提示', '图片上传失败！');
            }
        })
        $scope.onSave = function () {
            if (!$scope.selectParam.qrCode) {
                custNotify.warning('请上传图片', '提示！');
                return
            }
            httpFactory.getList(url + '/add', 'POST', null, $scope.selectParam).then(function (result) {
                $scope.$dismiss()
                custNotify.success(lotteryConst.msgAdd.success, '提示:');
            }, function (data) {
                custNotify.error('查询失败', '提示！');
            });
        }
    }
})();

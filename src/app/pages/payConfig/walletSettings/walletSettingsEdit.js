/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('walletSettingsEdit', walletSettingsEdit);

    /** @ngInject */
    function walletSettingsEdit($scope, lotteryConst, custNotify, httpFactory, todoService, common) {
        var url = lotteryConst.payConfigPath + '/walletpay';
        $scope.item = todoService.get().item;
        $scope.typeStr = '微信';
        if ($scope.item.accountType === 1) {
            $scope.typeStr = '支付宝';
        }
        common.initUpImg({
            $id: 'upImg',
            upload: lotteryConst.imgUrl + '/photo/upload'
        }, function (res) {
            if (res.code === 0) {
                $scope.item.qrCode = res.picid;
                custNotify.success('操作提示', '图片上传成功！');
            } else {
                custNotify.error('操作提示', '图片上传失败！');
            }
        })
        $scope.onSave = function () {
            if (!$scope.item.qrCode) {
                custNotify.warning('请上传图片', '提示！');
                return
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

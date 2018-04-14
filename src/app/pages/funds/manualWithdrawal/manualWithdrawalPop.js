/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('manualWithdrawalPop', manualWithdrawalPop);

    /** @ngInject */
    function manualWithdrawalPop($scope, httpFactory, lotteryConst, todoService, custNotify) {
        var lock = true;
        var type = todoService.get().type;
        $scope.onSave = function () {
            var entity = todoService.get().entity;
            if (type == 0) {
                if (lock) {
                    lock = false;
                    httpFactory.getList(lotteryConst.payConfigPath + '/system/charge', 'POST', null, entity).then(function (result) {
                        lock = true;
                        custNotify.success('操作提示', '存款成功！');
                        $scope.$dismiss();

                    }, function (result) {
                        lock = true;
                        custNotify.error('操作提示', '存款失败！');
                    });
                } else {
                    custNotify.error('操作提示', '客官别急嘛！');
                }
            } else {
                var entity = todoService.get().entity;
                if (lock) {
                    lock = false;
                    httpFactory.getList(lotteryConst.payConfigPath + '/system/draw', 'POST', null, entity).then(function (result) {
                        console.log(result);
                        custNotify.success('取款成功！', '提示:');
                        $scope.$dismiss();
                        lock = true;
                    }, function (result) {
                        console.log(result);
                        custNotify.error('取款失败！', '提示:');
                        lock = true;
                    });
                }
            }
        }
    }
})();
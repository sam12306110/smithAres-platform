/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('proxyWhitelistSettingsEdit', proxyWhitelistSettingsEdit);

    /** @ngInject */
    function proxyWhitelistSettingsEdit($scope, httpFactory, lotteryConst, custNotify, todoService) {
        var url = lotteryConst.aresPathPlat + '/whiteips';
        $scope.editTitle = "";
        if (todoService.get().edit) {
            $scope.entity = todoService.get().item;
            $scope.editTitle = "修改";
            url += '/edit';
        } else {
            $scope.editTitle = "新增";
            url += '/save';
        }

        $scope.onSave = function () {
            if ($scope.entity.domain == null || $scope.entity.ip == null) {
                return;
            }
            var entity = {
                id: $scope.entity.id,
                domain: $scope.entity.domain,
                ip: $scope.entity.ip
            };
            httpFactory.getList(url, 'POST', headers, entity).then(function (result) {
                if (result.err == 'SUCCESS') {
                    custNotify.success($scope.editTitle + '成功', '提示：');
                    $scope.$dismiss();
                } else {
                    custNotify.error(result.msg, '提示！');
                }
            }, function (result) {
                custNotify.error($scope.editTitle + '失败:' + result.msg, '提示：')
            });
        };
    }

})();


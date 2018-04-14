/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('memberOutCheckCancel', memberOutCheckCancel);

    /** @ngInject */
    function memberOutCheckCancel($scope, httpFactory, custNotify, lotteryConst, todoService) {
        var url = lotteryConst.payConfigPath + '/draw';

        var item = todoService.get().item;
        $scope.remark = item.remark;
        $scope.onSave = function () {
            var entity = {
                id: item.cid,
                state: item.state,
                remark: $scope.remark
            };
            httpFactory.getList(url + '/audit', 'GET', null, entity).then(function (result) {
                $scope.$dismiss();
                custNotify.success('操作提示', '操作成功！');
            }, function (data) {
                custNotify.error('操作提示', '操作失败！');
            });
        };
    }

})();


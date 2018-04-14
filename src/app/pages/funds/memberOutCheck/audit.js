/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('audit', audit);

    /** @ngInject */
    function audit($scope, httpFactory, custNotify, lotteryConst, todoService) {
        var url = lotteryConst.payConfigPath + '/memberChargeBet';
        var item = todoService.get().item;
        $scope.onSearch = function () {
            var entity = {
                memberId: item.memberId,
                chargeTime:item.createTime
            };
            httpFactory.getList(url + '/list', 'GET', null, entity).then(function (result) {
                $scope.entity = result.data
            }, function (data) {
                custNotify.error('操作提示', '操作失败！');
            });
        };
        $scope.onSearch();
    }

})();


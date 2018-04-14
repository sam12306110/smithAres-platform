/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('platSideEditCtrl', platSideEditCtrl);

    /** @ngInject */
    function platSideEditCtrl($scope, $rootScope, httpFactory, lotteryConst, custNotify, $filter, todoService) {
        var url = lotteryConst.uaaPath + '/apis/plat/data';

        $scope.item = todoService.get().item
        $scope.downLine = function () {
            httpFactory.getList(url + '/bank/view', 'POST', null, {memberId: main.memberId}).then(function (data) {
                if (data.msg === 'success') {
                    custNotify.success('强制下线成功', '提示:');
                    return
                }
            }, function (data) {
                custNotify.error(lotteryConst.msgSelect.fail, '提示:');
            });
        }
    }
})();


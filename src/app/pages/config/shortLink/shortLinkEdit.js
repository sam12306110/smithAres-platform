/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('shortLinkEdit', shortLinkEdit);

    /** @ngInject */
    function shortLinkEdit($scope, httpFactory, lotteryConst, custNotify, todoService) {
        var url = lotteryConst.aresPath + '/shortLink';


        $scope.onSave = function () {
            httpFactory.getList(url + '/save', 'POST', null, $scope.entity).then(function (data) {
                custNotify.success(lotteryConst.msgAdd.success, '提示:');
                $scope.$dismiss();
            }, function (data) {
                custNotify.success(lotteryConst.msgAdd.fail, '提示:');
                custNotify.success(lotteryConst.msgAdd.success, '提示:');
            });
        };

    }

})();


/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('lotteryNumSourceEdit', lotteryNumSourceEdit);

    /** @ngInject */
    function lotteryNumSourceEdit($scope, httpFactory, lotteryConst, custNotify, todoService) {
        var url = lotteryConst.aresPath + '/lotteryNumSource';
        $scope.selectParam = {
            lottery: lotteryConst.lottery,
            lotterySelected: null
        };
        $scope.selectParam.lotterySelected = $scope.selectParam.lottery[0];


        $scope.onSave = function () {
            if ($scope.selectParam.lotterySelected != null) {
                $scope.entity.lotteryId = $scope.selectParam.lotterySelected.id;
                $scope.entity.lotteryName = $scope.selectParam.lotterySelected.value;
            }
            httpFactory.getList(url + '/save', 'POST', null, $scope.entity).then(function (result) {
                custNotify.success(lotteryConst.msgAdd.success, '提示:');
                $scope.$dismiss();
            }, function (data) {
                custNotify.success(lotteryConst.msgAdd.fail, '提示:');
            });
        };
    }

})();


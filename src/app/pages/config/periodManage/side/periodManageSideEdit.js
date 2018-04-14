/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('periodManageSideEdit', periodManageSideEdit);

    /** @ngInject */
    function periodManageSideEdit($scope, httpFactory, lotteryConst, custNotify) {
        var url = lotteryConst.aresPath + '/periodManage';
        $scope.selectParam = {
            lottery: lotteryConst.lottery,
            lotterySelected: null
        };

        $scope.entity = {
            name: null,
            startTime: null,
            endTime: null
        };

        $scope.onSave = function () {
            var saveData = {
                name: null,
                startTime: null,
                endTime: null,
                sideType: 2
            };
            if ($scope.entity.name != null) {
                saveData.name = $scope.entity.name;
            }

            if ($scope.entity.startTime != null) {
                saveData.startTime = Number(new Date($scope.entity.startTime).getTime());
            }

            if ($scope.entity.endTime != null) {
                saveData.endTime = Number(new Date($scope.entity.endTime).getTime());
            }


            httpFactory.getList(url + '/save', 'POST', null, saveData).then(function (result) {
                custNotify.success(lotteryConst.msgAdd.success, '提示:');
                $scope.$dismiss();
            }, function (data) {
                custNotify.success(lotteryConst.msgAdd.fail, '提示:');
            });
        };
    }
})();


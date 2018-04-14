/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('activityView', activityView);

    /** @ngInject */
    function activityView($scope, httpFactory, lotteryConst, custNotify, todoService, common, $filter) {
        $scope.entity = todoService.get().item;
        $scope.entity.titlePic = lotteryConst.imgUrl + '/photo/pic/' + $scope.entity.titlePic + '/0';
    }
})();


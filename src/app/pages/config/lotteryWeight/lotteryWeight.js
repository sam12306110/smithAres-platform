/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('lotteryWeight', lotteryWeight);

    /** @ngInject */
    function lotteryWeight($scope, httpFactory, lotteryConst, todoService,$uibModal) {
        var url = lotteryConst.aresPathPlat + '/lotteryWeight';
        $scope.imgPath = lotteryConst.imgUrl + '/photo/pic/';
        $scope.pageSize = 100;
        $scope.queryParam = {
            page: 1,//当前页*分页必须
            rows: $scope.pageSize,//分页行数*分页必须
            sideType:2
        };
        /**
         * 条件搜索
         */
        $scope.onSearch = function (e) {
            httpFactory.getList(url + '/list', 'GET', null, $scope.queryParam).then(function (result) {
                $scope.entity = result.data.rows;
            }, function (data) {

            });
        };
        $scope.onSearch();


        function open(page, size) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size
            });
            modalInstance.result.then(function (result) {
                $scope.onSearch();
            }, function (reason) {
                $scope.onSearch();
            });
        }


        $scope.openEdit = function (edit, item) {
            todoService.set({
                edit: edit,
                item: item
            });
            open('app/pages/config/lotteryWeight/lotteryWeightEdit.html', 'md');
        };
    }


})();


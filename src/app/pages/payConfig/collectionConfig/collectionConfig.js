/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('collectionConfig', collectionConfig);

    /** @ngInject */
    function collectionConfig($scope, lotteryConst, custNotify, httpFactory,$uibModal,todoService) {
        var url = lotteryConst.payConfigPath + '/receipt';
        $scope.selectParam = {
            lottery: lotteryConst.lottery,
            lotterySelected: null
        };
        $scope.selectParam.lotterySelected = $scope.selectParam.lottery[0];
        $scope.queryParam = {};

        $scope.onSearch = function () {
            httpFactory.getList(url + '/list', 'GET', null, $scope.queryParam).then(function (result) {
                console.log(result.data)
                $scope.entity = result.data;
            }, function (data) {

            });
        };
        $scope.onSearch();

        $scope.onSave = function (e) {
            var queryParam = {
                "status": e.status ? 0 : 1,
                "id": e.id,
                "flag":e.flag
            };
            httpFactory.getList(url + '/editstatus', 'GET', null, queryParam).then(function (result) {
                custNotify.success('状态修改成功', '提示！');
                $scope.onSearch();
            }, function (data) {

            });
        };

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

        $scope.openEdit = function (e,item) {
            todoService.set({
                edit: e,
                item:item
            });

            open('app/pages/payConfig/collectionConfig/collectionConfigEdit.html', 'md');
        };
    }
})();

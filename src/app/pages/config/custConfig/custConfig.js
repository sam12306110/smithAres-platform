/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('custConfig', custConfig);

    /** @ngInject */
    function custConfig($scope, httpFactory, lotteryConst, common, custNotify, $uibModal, todoService, $filter) {
        var url = lotteryConst.aresPathPlat + '/custConfig';
        $scope.entity = {
            h5CustUrl: ''
        };
        /**
         * 条件搜索
         */
        $scope.onSearch = function () {
            httpFactory.getList(url + '/view', 'GET', null, null).then(function (result) {
                if(result.data) {
                    $scope.entity = result.data;
                }
            }, function (data) {

            });
        };
        $scope.onSearch();

        $scope.onSave = function () {
            httpFactory.getList(url + '/save', 'POST', null, $scope.entity).then(function (result) {
                custNotify.success( '修改成功！','提示:');
                $scope.onSearch();
            }, function (data) {
                custNotify.error('修改失败！','提示:');
            });
        };

    }
})();




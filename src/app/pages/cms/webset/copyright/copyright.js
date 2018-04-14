/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('copyright', copyright);

    /** @ngInject */
    function copyright($scope, httpFactory, lotteryConst, common, custNotify, $uibModal, todoService, $filter) {
        var url = lotteryConst.aresCmsPath + '/copyright';
        $scope.queryParam = {
            type: 1
        };
        $scope.onSearch = function () {
            httpFactory.getList(url + '/list', 'GET', null, $scope.queryParam).then(function (result) {
                $scope.entity = result.data.rows;
            }, function (data) {

            });
        };
        $scope.onSearch();
        $scope.openTab = function (index) {
            $scope.queryParam.type = index;
            $scope.onSearch();
        };

        /**
         * 状态修改
         * @param id
         * @param status
         */
        $scope.onStatus = function (item) {
            item.status = item.status === 0 ? 1 : 0;
            httpFactory.getList(url + '/save', 'POST',null, item).then(function (result) {
                custNotify.success('操作提示', '修改成功！');
                $scope.onSearch();
            }, function (data) {
                custNotify.error('系统提示', '服务器出现未知错误！');
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


        $scope.openEdit = function (edit, item) {
            todoService.set({
                edit: edit,
                item: item
            });
            open('app/pages/cms/webset/copyright/copyrightEdit.html', 'lg');
        };
    }

})();




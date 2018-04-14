/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('registerConfig', registerConfig);

    /** @ngInject */
    function registerConfig($scope, httpFactory, lotteryConst, custNotify, common, $uibModal, todoService) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url = lotteryConst.aresPathPlat + '/registerConfig';
        $scope.selectParam = {
            regType: 1
        };

        $scope.entity = [];
        $scope.changeFun = function (t, e) {
            if (t == 0 && e.ifRequired) {
                e.ifView = e.ifRequired
            }
            if (t == 1 && !e.ifView) {
                e.ifRequired = e.ifView
            }
        };

        /**
         * 条件搜索
         */
        $scope.onSearch = function () {
            httpFactory.getList(url + '/list', 'GET', null, $scope.selectParam).then(function (result) {
                $scope.entity = result.data.rows;
                $scope.entity.forEach(function (t) {
                    t.ifView = t.ifView == 0 ? false : true;
                    t.ifRequired = t.ifRequired == 0 ? false : true;
                    t.ifDisabled = t.ifDisabled == 0 ? false : true;
                });
            }, function (data) {

            });
        };
        $scope.onSearch();

        $scope.openTab = function (regType) {
            $scope.selectParam.regType = regType;
            $scope.onSearch();
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
            open('app/pages/config/registerConfig/registerConfigPop.html', 'sm');
        };
    }


    angular.module('BlurAdmin.pages').controller('registerConfigPop', registerConfigPop);

    /** @ngInject */
    function registerConfigPop($scope, httpFactory, lotteryConst, custNotify, todoService) {
        var url = lotteryConst.aresPathPlat + '/registerConfig';
        $scope.edit = todoService.get().edit;
        $scope.entity = todoService.get().item;
        $scope.onSave = function () {
            $scope.entity.forEach(function (t, i) {
                t.ifView = t.ifView == false ? 0 : 1;
                t.ifRequired = t.ifRequired == false ? 0 : 1;
                t.ifDisabled = t.ifDisabled == false ? 0 : 1;
            });
            httpFactory.getList(url + '/save', 'POST', null, $scope.entity).then(function (data) {
                custNotify.success('修改成功！', '提示:');
                $scope.$dismiss();
            }, function (data) {
                custNotify.error('修改失败！', '提示:');
            });
        };
    }
})();


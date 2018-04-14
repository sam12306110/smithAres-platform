/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('memberOfficialCtrl', memberOfficialCtrl);

    /** @ngInject */
    function memberOfficialCtrl($scope, $rootScope, httpFactory, lotteryConst, custNotify, $uibModal) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url = lotteryConst.uaaPath + '/apis/data/member';
        $scope.init = function () {
            $scope.selectParam = {
                status: lotteryConst.statusLock,
                statusSelected: null,
                lottery: [{id: null, value: '全部', sideType: 1}].concat(lotteryConst.lottery),
                lotterySelected: {id: null, value: '全部', sideType: 1}
            };
            $scope.queryParam = {
                lotteryId: null,
                status: null,
                modifyUsername: null
            };
        }

        /**
         * 条件搜索
         */
        $rootScope.onSearch = function () {
            if ($scope.selectParam.statusSelected) {
                $scope.queryParam.status = $scope.selectParam.statusSelected.id;
            }
            if ($scope.selectParam.lotterySelected) {
                $scope.queryParam.lotteryId = $scope.selectParam.lotterySelected.id;
            }
            httpFactory.getList(url + '/list', 'GET', null, $scope.queryParam).then(function (data) {
                var d = null;
                for (var i = 0; i < data.rows.length; i++) {
                    d = data.rows[i];
                    if (d.balance) {
                        d.balance = (d.balance / 100).toFixed(2);
                    }
                    else {
                        d.balance = '0.00';
                    }
                }
                $scope.list = data.rows;
            }, function (data) {

            });
        };
        $rootScope.onSearch();
        $scope.onReset = function () {
            $scope.selectParam.lotterySelected = null;
            $scope.queryParam.lotteryId = null;
            $scope.selectParam.statusSelected = null;
            $scope.queryParam.status = null;
            $scope.queryParam.modifyUsername = null;
        };

        /**
         * 状态修改
         * @param id
         * @param status
         */
        $scope.onStatus = function (id, status) {
            status = status === 0 ? 1 : 0;
            httpFactory.getList(url + '/statusChange/' + id + '/' + status, 'GET', null, null).then(function (data) {
                console.log(data);
                custNotify.success(lotteryConst.msgEdit.success, '提示:');
                $scope.onSearch();
            }, function (data) {
                custNotify.error(lotteryConst.msgSelect.fail, '提示:');
            });
        };
    }

})();


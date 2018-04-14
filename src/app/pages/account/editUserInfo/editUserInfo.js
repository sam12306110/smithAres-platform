/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('editUserInfo', editUserInfo);

    /** @ngInject */
    function editUserInfo($scope, $rootScope, httpFactory, lotteryConst, custNotify, $cookieStore, common) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url = lotteryConst.uaaPath + '/apis/plat/data';
        var url2 = lotteryConst.payConfigPath + '/member';

        $scope.queryParam = {
            appid: null,
            username: null
        }
        var item = {}
        /**
         * 条件搜索
         */
        $rootScope.onSearch = function (e) {
            $scope.main = {};
            if ($scope.queryParam.username === '' || $scope.queryParam.username === null) {
                custNotify.error(lotteryConst.msgSelect.nullSeq, '提示:');
                return
            }
            var appid = $cookieStore.get('appid')
            httpFactory.getList(url + '/member/info', 'GET', null, $scope.queryParam).then(function (data) {
                var main = data.data
                if (data.msg.length > 0) {
                    custNotify.error(lotteryConst.msgSelect.fail, '提示:');
                    return
                }
                httpFactory.getList(url2 + '/bank/view', 'GET', null, {memberId: main.memberId}).then(function (data) {
                    $scope.main = data.data
                    $scope.main.mail = main.mail;
                    if (data.msg.length > 0) {
                        custNotify.error(lotteryConst.msgSelect.fail, '提示:');
                        return
                    }
                    custNotify.success(lotteryConst.msgSelect.success, '提示:');
                }, function (data) {
                    custNotify.error(lotteryConst.msgSelect.fail, '提示:');
                });
                custNotify.success(lotteryConst.msgSelect.success, '提示:');
            }, function (data) {
                custNotify.error(lotteryConst.msgSelect.fail, '提示:');
            });
        };
        $scope.openEdit = function (platInfoId) {
            $rootScope.platInfoId = platInfoId;
            $scope.open('app/pages/account/plat/side/platSideEdit.html', 'lg', 'edit');
        };
    }
})();


/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('msgEdit', msgEdit);

    /** @ngInject */
    function msgEdit($scope, $rootScope, httpFactory, lotteryConst, custNotify, $http) {
        var url = lotteryConst.aresCmsPath + '/msg';

        function initPage() {
            $scope.selectParam = {
                memberLevel: null,
                memberLevelSelected: null
            };
            httpFactory.getList(lotteryConst.uaaPathPlat + '/memberLevel/getSelectList', 'GET', null, null).then(function (result) {
                if (result.data) {
                    $scope.selectParam.memberLevel = result.data;
                }
            }, function (data) {

            });
        }

        initPage()


        $scope.onSave = function () {
            httpFactory.getList(url + '/member/save', 'POST', null, $scope.entity).then(function (data) {
                custNotify.success(lotteryConst.msgSelect.success, '提示:');
            }, function (data) {
                custNotify.error(lotteryConst.msgSelect.fail, '提示:');
            });
        };


        $scope.onUpload = function () {
            var fileInput = document.getElementById('file');
            fileInput.click();
            $(fileInput).on('change', function () {
                var fd = new FormData();
                var file = document.querySelector('input[type=file]').files[0];
                fd.append('file', file);
                $http({
                    method: 'POST',
                    url: url,
                    data: fd,
                    headers: {'Content-Type': undefined},
                    transformRequest: angular.identity
                }).success(function (result) {
                    if (result.data == 1) {
                        custNotify.success('操作提示', '导入成功！');
                        $scope.$dismiss();
                    } else {
                        custNotify.error('操作提示', '导入失败！');
                    }
                });
            });
        };
    }
})();


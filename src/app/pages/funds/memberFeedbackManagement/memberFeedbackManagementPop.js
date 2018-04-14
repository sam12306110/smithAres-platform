/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('memberFeedbackManagementPop', memberFeedbackManagementPop);

    /** @ngInject */
    function memberFeedbackManagementPop($scope, httpFactory, lotteryConst, todoService, custNotify) {
        var num = todoService.get().num;
        var url=lotteryConst.hermesApis;
        $scope.onSave = function () {

            httpFactory.getList(url + '/cash_back_config/set?status='+ num, 'POST', null, null).then(function (result) {
                if(result.err=='SUCCESS'){
                    if(!num){
                        custNotify.success('关闭自动返水！', '提示:');
                        $scope.$dismiss("success");
                    }else {
                        custNotify.success('打开自动返水！', '提示:');
                        $scope.$dismiss("success");
                    }
                }
                if(result.err=='FAILED'){
                    custNotify.error(result.cnMsg, '提示:');
                    $scope.$dismiss("failed");

                }

            }, function (data) {
                custNotify.error('操作失败', '提示:');
            });


        }
    }
})();
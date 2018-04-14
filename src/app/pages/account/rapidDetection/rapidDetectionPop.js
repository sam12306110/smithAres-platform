/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('rapidDetectionPop', rapidDetectionPop);

    /** @ngInject */
    function rapidDetectionPop($scope, $rootScope, httpFactory, lotteryConst, custNotify, todoService) {
///apis/payment/plat/update

        var url = lotteryConst.uaaPath + '/api/plat/data/member';
        var url2 = lotteryConst.apiRoot + '/arespayment/apis/payment/plat';
        var url3=lotteryConst.aresAccount + '/agent/reset';

        $scope.entity = {
            newPassword: ''
        };
         //console.log(todoService.get().main.agentId);
         //console.log(todoService.get().types);
        $scope.changePassword = function () {
            var requestUrl;
            var num = todoService.get().num;
            var types = todoService.get().types;
            var item = {};
            item.memberId = todoService.get().main.memberId;
            item.agentId = todoService.get().main.agentId;
            item.newPassword = $scope.entity.newPassword;
            item.password = $scope.entity.newPassword;
            if(types=='member'){
                requestUrl=url + '/password?memberId=' + item.memberId + '&newPassword=' + item.newPassword;
            }
            if(types=='agent'){
                requestUrl=url3 + '/pwd?agentId=' + item.agentId + '&password=' + item.password;

            }
            switch (num) {
                case 0:
                    if(!(/^\w{6,20}$/.test($scope.entity.newPassword))){
                        custNotify.error('密码长度必须是6-20位', '提示');
                        return
                    }

                    // /api/plat/data/member/password
                    httpFactory.getList(requestUrl, 'POST', null, item).then(function (data) {
                        if (data.err === 'SUCCESS') {
                            custNotify.success('密码修改成功', '提示:');
                            $scope.$dismiss();
                        }
                    }, function (data) {
                        custNotify.error(lotteryConst.msgSelect.fail, '提示:');
                    });
                    break;
                case 1:
                    if(!(/^\d{4}$/.test($scope.entity.newPassword))){
                        custNotify.error('密码必须是4位数字', '提示');
                        return
                    }
                    var data = {
                        memberPaymentVo: {
                            "memberId": item.memberId,
                            "tradePassword": $scope.entity.newPassword
                        }
                    }
                    // /apis/payment/plat/update
                    httpFactory.getList(url2 + '/update?memberId=' + item.memberId + '&tradePassword=' + $scope.entity.newPassword, 'POST', null, data.memberPaymentVo).then(function (data) {
                        if (data.err === 'SUCCESS') {
                            custNotify.success('密码修改成功', '提示:');
                            $scope.$dismiss();
                        }
                    }, function (data) {
                        custNotify.error(lotteryConst.msgSelect.fail, '提示:');
                    });
                    break;
                default:
                    custNotify.error('未知错误', '提示')
                    break
            }

        }
    }
})();


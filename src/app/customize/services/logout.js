/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('logoutCtrl', logoutCtrl);

    /** @ngInject */
    function logoutCtrl($scope, $cookieStore,httpFactory, lotteryConst) {
        $scope.logout = function () {
            $cookieStore.put('access_token1', '');
            window.location.href = 'auth.html';
        };
        $scope.openOnline=function () {
            window.location.href = '#/statistics/OnlineMemberInquiries';
        }
       var agentFlag=lotteryConst.agentFlag;
        if(localStorage.logoTitle){
            $scope.headerName=localStorage.logoTitle
        }

        function getMemberNum() {
            httpFactory.getList(lotteryConst.uaaPathPlat + '/member/onlines', 'GET', null, null).then(function (result) {
                $scope.MemberNum=result.data;
                //console.log(result)
            }, function (result) {

            });
        };

        if(!!agentFlag){
            $scope.agentFlag=false;

        }else {
            $scope.agentFlag=true;
            getMemberNum();
            window.setInterval(getMemberNum,8000);
        }



    }

})();


/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('accountSettingsAdd', accountSettingsAdd);

    /** @ngInject */
    function accountSettingsAdd($scope, lotteryConst, custNotify, httpFactory, todoService) {
        var url = lotteryConst.payConfigPath + '/income';
        $scope.item = todoService.get().item;
        $scope.selectParam = {
            bankNameList: null,
            bankNamed: null,
            memberLevel:null
        }
        $scope.queryParam = {
            currency: "CNY",//
            cardOwnerName: null,
            bankCode: null,
            bankName: null,
            cardNo: null,//
            registerBankInfo: null,//
            stopAmount: null,//
            warnAmount: null,//
            transferRemark: null,//
            userLevels:[]

        }
        $scope.getBankList = function () {
            httpFactory.getList(url + '/banks', 'get', null, $scope.queryParam).then(function (result) {
                $scope.selectParam.bankNameList = result.data;
            }, function (data) {

            });
        };
        //获取会员层级列表
        httpFactory.getList(lotteryConst.uaaPathPlat + '/memberLevel/getSelectList', 'GET', null, null).then(function (result) {
            //console.log(result)
            if (result.data) {
                $scope.selectParam.memberLevel = result.data;
                $scope.memberLevel=$scope.selectParam.memberLevel;

            }
            //console.log($scope.selectParam.memberLevel)
        }, function (data) {

        });
        $scope.getBankList()
        $scope.lanjie=false
        $scope.onSave = function () {
            if($scope.lanjie){
                return
            }
            if ($scope.selectParam.bankNamed) {
                $scope.queryParam.bankCode = $scope.selectParam.bankNamed.bankCode || '';
                $scope.queryParam.bankName = $scope.selectParam.bankNamed.bankName || '';
            } else {
                custNotify.error('操作提示', '请选择银行！');
                return
            }
            if($scope.selectParam.memberLevelSelected){
                $scope.queryParam.userLevels=$scope.selectParam.memberLevelSelected
            }
            if($scope.queryParam.stopAmount&&$scope.queryParam.warnAmount){
                $scope.queryParam.stopAmount=$scope.queryParam.stopAmount*100;
                $scope.queryParam.warnAmount=$scope.queryParam.warnAmount*100
            }
            for (var i in $scope.queryParam) {
                var e = $scope.queryParam[i]
                switch (i) {
                    case 'cardOwnerName':
                        if (e == null || e == '') {
                            custNotify.error('操作提示', '请输入商家名称！');
                            return
                        }
                        break;
                    case 'registerBankInfo':
                        if (e == null || e == '') {
                            custNotify.error('操作提示', '请输入开户行！');
                            return
                        }
                        break;
                    case 'cardNo':
                        if (e == null || e == '') {
                            custNotify.error('操作提示', '请输入银行账号！');
                            return
                        }
                        break;
                    case 'warnAmount':
                        if (e == null || e == '') {
                            custNotify.error('操作提示', '请输入预警金额！');
                            return
                        }
                        if (typeof e !== 'number') {
                            custNotify.error('操作提示', '预警金额必须是数字！');
                            return
                        }
                        break;
                    case 'stopAmount':
                        if (e == null || e == '') {
                            custNotify.error('操作提示', '请输入停用金额！');
                            return
                        }
                        if (typeof e !== 'number') {
                            custNotify.error('操作提示', '停用金额必须是数字！');
                            return
                        }
                        break;
                    case  'userLevels' :
                        if(e==null||e==''){
                            custNotify.error('操作提示', '请选择会员层级！');
                            return
                        }
                        break
                }
            }
            httpFactory.getList(url + '/add', 'POST', null, $scope.queryParam).then(function (result) {
                $scope.lanjie=true;
                $scope.$dismiss()
                custNotify.success(lotteryConst.msgAdd.success, '提示:');
            }, function (data) {
                $scope.lanjie=true;
                custNotify.error('查询失败', '提示！');
            });
        }
    }
})();

/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('thirdPartySettingsAdd', thirdPartySettingsAdd);

    /** @ngInject */
    function thirdPartySettingsAdd($scope, lotteryConst, custNotify, httpFactory, todoService) {
        var url = lotteryConst.payConfigPath + '/thirdpay';
        $scope.item = todoService.get().item;
        $scope.selectParam = {
            paymentList: null,
            paymented: null,
            paymentTypeList: null,
            paymentTyped: null
        }
        $scope.queryParam = {
            "currency": "CNY",
            "merchantName": null,
            "merchantNo": null,
            "paymentId": null,
            "paymentTypeId": null,
            "stopAmount": null,
            "warnAmount": null,
            "merchantKey": null,
            "merchantPublicKey": null,
            "thirdTerminalId": null,
            "merchantDomain": null,
             "userLevels":[]
        }
        $scope.selectSearch = function () {
            console.log(JSON.stringify($scope.selectParam.paymented))
        }
        $scope.getPayment = function () {
            httpFactory.getList(url + '/payment/list', 'GET', null, null).then(function (result) {
                $scope.selectParam.paymentList = result.data;
            }, function (data) {
                custNotify.error('查询失败', '提示！');
            });
        }
        $scope.getPayment()
        $scope.$watch('selectParam.paymented', function () {
            if (!$scope.selectParam.paymented) {
                return
            }
            var data = {paymentId: $scope.selectParam.paymented.paymentId}
            httpFactory.getList(url + '/payment/type', 'GET', null, data).then(function (result) {
                $scope.selectParam.paymentTypeList = []
                $scope.selectParam.paymentTypeList.push(result.data);
                $scope.selectParam.paymentTyped = result.data;
            }, function (data) {
                custNotify.error('查询失败', '提示！');
            });
        });
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
        $scope.onSave = function () {
            /**
             *
             币种 currey string  默认CNY
             商家名称 merchantName string  必须
             商户号 merchantNo string 必须
             支付系统id paymentId int 必须
             支付系统名称  paymentName string 必须
             支付方式id paymentTypeId  int 必须
             支付方式名称 paymentTypeName string  必须
             停用金额  stopAmount  long  必须 单位元
             预警金额  warnAmount long  必须  单位元
             商家密钥  merchantKey string 必须
             商家公钥 merchantPublicKey 必填
             终端ID  thirdTerminalId  必填
             商城域名  merchantDomain  必填
             *
             */
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
                    case 'merchantName':
                        if (e == null || e == '') {
                            custNotify.error('操作提示', '请输入商家名称！');
                            return
                        }
                        break;
                    case 'merchantNo':
                        if (e == null || e == '') {
                            custNotify.error('操作提示', '请输入商户号！');
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
                    case 'merchantKey':
                        if (e == null || e == '') {
                            custNotify.error('操作提示', '请输入商家密钥！');
                            return
                        }
                        break;
                    case 'merchantPublicKey':
                        if (e == null || e == '') {
                            custNotify.error('操作提示', '请输入商家公钥！');
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
            if (!$scope.selectParam.paymentTyped && !$scope.selectParam.paymented) {
                custNotify.error('操作提示', '请选择支付方式！');
                return
            } else {
                $scope.queryParam.paymentTypeId = $scope.selectParam.paymentTyped.paymentTypeId
                $scope.queryParam.paymentTypeName = $scope.selectParam.paymentTyped.paymentName
                $scope.queryParam.paymentId = $scope.selectParam.paymented.paymentId
                $scope.queryParam.paymentName = $scope.selectParam.paymented.paymentName
            }

            httpFactory.getList(url + '/add', 'POST', null, $scope.queryParam).then(function (result) {
                $scope.$dismiss()
                custNotify.success(lotteryConst.msgAdd.success, '提示:');
            }, function (data) {
                custNotify.error('查询失败', '提示！');
            });
        }
    }
})();

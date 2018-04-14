/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('accountSettingsEdit', accountSettingsEdit);

    /** @ngInject */
    function accountSettingsEdit($scope, lotteryConst, custNotify, httpFactory, todoService) {
        var url = lotteryConst.payConfigPath + '/income';
        $scope.selectParam = {
            memberLevelSelected:todoService.get().item.userLevels,
            memberLevel:null,
            stopAmount:todoService.get().item.stopAmount/100,
            warnAmount:todoService.get().item.warnAmount/100
        };
        $scope.item = todoService.get().item;
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
        $scope.lanjie=false;
        $scope.onSave = function () {
            if($scope.lanjie){
                return
            }
            $scope.item.stopAmount=$scope.selectParam.stopAmount*100;
            $scope.item.warnAmount=$scope.selectParam.warnAmount*100;
            $scope.item.userLevels=$scope.selectParam. memberLevelSelected;
            for (var i in $scope.item) {
                var e = $scope.item[i]
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
            httpFactory.getList(url + '/edit', 'POST', null, $scope.item).then(function (result) {
               if(result.data==null){
                   custNotify.error('操作失败', '提示！');
                   $scope.lanjie=true;
                   return false
               }
                $scope.lanjie=true;
                $scope.$dismiss()
                custNotify.success(lotteryConst.msgEdit.success, '提示:');
            }, function (data) {
                $scope.lanjie=true;
                custNotify.error('查询失败', '提示！');
            });
        }

    }
})();

/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('collectionConfigEdit', collectionConfigEdit);

    /** @ngInject */
    function collectionConfigEdit($scope, httpFactory, lotteryConst, custNotify,todoService) {
        var url=lotteryConst.payConfigPath+ '/receipt/';
        var urlRequest;
        $scope.entity = {

        };
        $scope.selectParam = {


        };
        if(todoService.get().edit){
            $scope.titleName = "修改快捷支付";
            //console.log(todoService.get().item);
            if(todoService.get().item){
                $scope.entity.rsName=todoService.get().item.rsName;
                $scope.entity.rsUrl=todoService.get().item.rsUrl;
                $scope.entity.id=todoService.get().item.id;

            }
        }else {
            $scope.titleName = "新增快捷支付";

        }

      $scope.checkUrl=function () {
            if(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test($scope.entity.rsUrl)){
                return false;
            }else {
                return true;

            }
        };
        $scope.onSave = function () {
            if(!$scope.entity.rsName){
                custNotify.warning('操作提示', '请输入收款方式！');
                return false
            }
            if(!$scope.entity.rsUrl){
                custNotify.warning('操作提示', '请输入收款域名！');
                return false
            }
            ;
            if($scope.checkUrl()){
                custNotify.warning('操作提示', '请输入正确格式的收款域名！');
                return false
            }

           /* var headers={
                "Content-Type":"application/x-www-form-urlencoded"

            }*/
           if(!todoService.get().edit){
               urlRequest=url+ 'add?rsName='+$scope.entity.rsName+'&rsUrl='+$scope.entity.rsUrl;
           }else {
               urlRequest=url+ 'edit?rsName='+$scope.entity.rsName+'&rsUrl='+$scope.entity.rsUrl + '&id='+$scope.entity.id;

           }
            httpFactory.getList(urlRequest, 'POST', null, null).then(function (result) {

                if(result.err=='update fail'){
                    custNotify.error(result.msg, '提示！')
                }else if( result.err=='SUCCESS') {
                    custNotify.success('操作提示', '新增成功')

                }
                $scope.$dismiss();
            }, function (data) {
                custNotify.error('操作提示', '新增失败！');
            });
        };


    }

})();


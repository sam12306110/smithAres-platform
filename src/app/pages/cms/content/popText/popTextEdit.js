/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('popTextEdit', popTextEdit);

    /** @ngInject */
    function popTextEdit($scope, httpFactory, lotteryConst, custNotify, todoService, common, $filter) {
        var url = lotteryConst.aresCmsPath + '/popText';
        //日期控件 事件ngRepeatFinished作用是延迟加载
        $scope.entity = {
            title: '',
            content: ''
        };



        $scope.edit = todoService.get().edit;
        $scope.num = todoService.get().num;
        if (todoService.get().item) {
            $scope.entity = todoService.get().item;
            $scope.titleName = "修改首页弹屏";
        } else {
            $scope.titleName = "新增首页弹屏";

        }


        $scope.onSave = function () {
            if (!$scope.entity.title) {
                custNotify.success('请输入标题！', '操作提示');
                return
            }
            if (!$scope.entity.content) {
                custNotify.success('请输入内容！', '操作提示');
                return
            }
            httpFactory.getList(url + '/save', 'POST', null, $scope.entity).then(function (result) {
                custNotify.success('操作提示', '新增成功！');
                $scope.$dismiss();
            }, function (data) {
                custNotify.error('操作提示', '新增失败！');
            });
        };


    }

})();


/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('noticeEdit', noticeEdit);

    /** @ngInject */
    function noticeEdit($scope, httpFactory, lotteryConst, custNotify, todoService, common, $filter) {
        var url = lotteryConst.aresCmsPath + '/notice';
        //日期控件 事件ngRepeatFinished作用是延迟加载




        $scope.edit = todoService.get().edit;
        $scope.num = todoService.get().num;
        if (todoService.get().item) {
            $scope.entity = todoService.get().item;
            if ($scope.num == 1) {
                $scope.titleName = "预览公告";
            } else if ($scope.num == 2) {
                $scope.titleName = "修改公告";
            }
        } else {
            $scope.titleName = "新增公告";
            $scope.entity = {
                title: '',
                content: '',
                weight: ''
            };
        }


        $scope.onSave = function () {
            if (!$scope.entity.title) {
                custNotify.success('请输入标题！', '操作提示');
                return
            }
            if ($scope.entity.weight === '') {
                custNotify.success('请输入权重！', '操作提示');
                return
            }
            if ($scope.entity.weight < 0 || $scope.entity.weight >= 100 || isNaN($scope.entity.weight)) {
                custNotify.success('权重只能是0-99之间的整数！', '操作提示');
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


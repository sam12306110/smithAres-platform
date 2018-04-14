/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('msgTemplateEdit', msgTemplateEdit);

    /** @ngInject */
    function msgTemplateEdit($scope, todoService, httpFactory, lotteryConst, custNotify, $filter) {
        var url = lotteryConst.aresCmsPath + '/msgTemplate';

        $scope.edit = todoService.get().edit;
        if (todoService.get().item) {
            $scope.entity = todoService.get().item;
            $scope.titleName = "站内信模板";
        } else {
            $scope.titleName = "新增站内信模板";
            $scope.entity={
                title:'',
                content:'',
                weight:''
            };
        }

        $scope.onSave = function () {
            httpFactory.getList(url + '/save', 'POST', null, $scope.entity).then(function (result) {
                custNotify.success('操作提示', '成功！');
                $scope.$dismiss();
            }, function (data) {
                custNotify.error('操作提示', '失败！');
            });
        };

    }
})();


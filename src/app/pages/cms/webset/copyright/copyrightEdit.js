/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        }
    }).controller('copyrightEdit', copyrightEdit);

    /** @ngInject */
    function copyrightEdit($scope, httpFactory, lotteryConst, custNotify, todoService) {
        var url = lotteryConst.aresCmsPath + '/copyright';

        $scope.titleName = "修改文案";
        $scope.edit = todoService.get().edit;
        $scope.entity = todoService.get().item;
        window.editorContent=$scope.entity.content;



        window.addEventListener('message',function(e){
            var result=e.data;
            $scope.entity.content=result;

        },false);
        $scope.onSave = function () {

            httpFactory.getList(url + '/save', 'POST', null, $scope.entity).then(function (result) {
                custNotify.success('操作提示', '新增成功！');
                $scope.$dismiss();
            }, function (data) {
                custNotify.error('操作提示', '新增失败！');
            });
        };



    }

})();


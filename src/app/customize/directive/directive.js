/**
 * @author v.lugovsky
 * created on 10.12.2016
 */
(function () {
    'use strict';
    angular.module('BlurAdmin.theme.inputs')
        .directive('soDate', soDate);

    function soDate($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        };
    }

    angular.module('BlurAdmin.theme.inputs').directive('ckeditor', function () {
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, ngModel) {
                var ckeditor = CKEDITOR.replace(element[0], {});
                if (!ngModel) {
                    return;
                }
                ckeditor.on('instanceReady', function () {
                    ckeditor.setData(ngModel.$viewValue);
                });
                ckeditor.on('pasteState', function () {
                    scope.$apply(function () {
                        ngModel.$setViewValue(ckeditor.getData());
                    });
                });
                ngModel.$render = function (value) {
                    ckeditor.setData(ngModel.$viewValue);
                };
            }
        };
    });

    angular.module('BlurAdmin.theme.inputs')
        .directive('ngDisabledClick', soDisabled);

    function soDisabled($timeout) {
        return {
            scope: {
                ngDisabledClick: '&'
            },
            link: function (scope, element, attrs) {
                $timeout(function () {
                    element.on(
                        "click", function () {
                            var funName = $(this).attr('ng-disabled-click')
                            scope.$apply(function () {
                                //在scope中调用处理函数，将jQuery时间映射到$event对象上
                            })
                        })
                });
            }
        };
    }

})();

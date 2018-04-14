/**
 * 自定义通知服务
 * @author Ivan
 * created on 2017-9-18
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.customize').service('custNotify', custNotify);

    /** @ngInject */
    function custNotify(toastr) {
        return {
            success: function (title, message) {
                var m = message, t = title;
                var message, title;
                if (title.indexOf('提示') < 0) {
                    title = t
                    message = m
                } else {
                    title = m
                    message = t
                }
                toastr.success(title, message, {
                    "autoDismiss": false,
                    "positionClass": "toast-top-center",
                    "type": "success",
                    "timeOut": "2000",
                    "extendedTimeOut": "2000",
                    "allowHtml": false,
                    "closeButton": true,
                    "tapToDismiss": false,
                    "progressBar": true,
                    "newestOnTop": false,
                    "maxOpened": 0,
                    "preventDuplicates": false,
                    "preventOpenDuplicates": false
                })
            }, info: function (title, message) {
                var m = message, t = title;
                var message, title;
                if (title.indexOf('提示') < 0) {
                    title = t
                    message = m
                } else {
                    title = m
                    message = t
                }
                toastr.info(title, message, {
                    "autoDismiss": false,
                    "positionClass": "toast-top-center",
                    "type": "info",
                    "timeOut": "2000",
                    "extendedTimeOut": "2000",
                    "allowHtml": false,
                    "closeButton": true,
                    "tapToDismiss": false,
                    "progressBar": true,
                    "newestOnTop": false,
                    "maxOpened": 0,
                    "preventDuplicates": false,
                    "preventOpenDuplicates": false
                })
            }, warning: function (title, message) {
                var m = message, t = title;
                var message, title;
                if (title.indexOf('提示') < 0) {
                    title = t
                    message = m
                } else {
                    title = m
                    message = t
                }
                toastr.warning(title, message, {
                    "autoDismiss": false,
                    "positionClass": "toast-top-center",
                    "type": "warning",
                    "timeOut": "2000",
                    "extendedTimeOut": "2000",
                    "allowHtml": false,
                    "closeButton": true,
                    "tapToDismiss": false,
                    "progressBar": true,
                    "newestOnTop": false,
                    "maxOpened": 0,
                    "preventDuplicates": false,
                    "preventOpenDuplicates": false
                })
            }, error: function (title, message) {
                var m = message, t = title;
                var message, title;
                if (title.indexOf('提示') < 0) {
                    title = t
                    message = m
                } else {
                    title = m
                    message = t
                }
                toastr.error(title, message, {
                    "autoDismiss": false,
                    "positionClass": "toast-top-center",
                    "type": "error",
                    "timeOut": "2000",
                    "extendedTimeOut": "2000",
                    "allowHtml": false,
                    "closeButton": true,
                    "tapToDismiss": false,
                    "progressBar": true,
                    "newestOnTop": false,
                    "maxOpened": 0,
                    "preventDuplicates": false,
                    "preventOpenDuplicates": false
                })
            }
        };
    }
})();

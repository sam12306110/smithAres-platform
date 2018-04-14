/**
 * @author a.demeshko
 * created on 23.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.customize').factory('httpInterceptor', function ($q, $injector, $cookieStore) {
        return {
            'responseError': function (response) {
                var text = '';
                switch (response.status) {
                    case 401:
                        text = '证书失效：账号已注销';
                        // alert(text);
                        window.location.href = 'auth.html';
                        break;
                    case 404:
                        text = '找不到该页面';
                        // alert(text);
                        window.location.href = 'auth.html';
                        break;
                    case 409:
                        text = '证书失效：账号在其他地方登入';
                        // alert(text);
                        window.location.href = 'auth.html';
                        break;
                }
                return $q.reject(response);
            },
            'response': function (response) {
                var text = '';
                switch (response.status) {
                    case 401:
                        text = '证书失效：账号已注销';
                        // alert(text);
                        window.location.href = 'auth.html';
                        break;
                    case 404:
                        text = '找不到该页面';
                        // alert(text);
                        window.location.href = 'auth.html';
                        break;
                    case 409:
                        text = '证书失效：账号在其他地方登入';
                        // alert(text);
                        window.location.href = 'auth.html';
                        break;
                }
                return response;
            },
            'request': function (config) {
                var access_token = $cookieStore.get('access_token1');
                if (access_token == null || access_token == '') {
                    window.location.href = 'auth.html';
                }
                config.headers["Authorization"] = 'bearer ' + access_token;
                return config;
            },
            'requestError': function (config) {
                return $q.reject(config);
            }
        };
    });

    angular.module('BlurAdmin.customize').config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    }])

})();

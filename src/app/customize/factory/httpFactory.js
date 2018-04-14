/**
 * @author a.demeshko
 * created on 23.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.customize').factory('httpFactory', function ($http, $q) {
        var factory = {};

        factory.getList = function (endpoint, method, headers, params) {
            var defer = $q.defer();
            if (method == 'GET') {
                $http({
                    url: endpoint,
                    method: "GET",
                    headers: headers,
                    params: params,
                    timeout: 30000
                }).success(function (data) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    // defer.resolve(data);
                    defer.reject(data);
                });
            } else {
                $http({
                    url: endpoint,
                    method: method,
                    headers: headers,
                    data: params,
                    timeout: 30000
                }).success(function (data) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    // defer.resolve(data);
                    defer.reject(data);

                });
            }
            return defer.promise;
        };

        factory.getListByForm = function (endpoint, method, params) {
            var defer = $q.defer();
            var headers = {
                "Content-Type": "application/x-www-form-urlencoded"
            };

            if (method == 'GET') {
                $http({
                    url: endpoint,
                    method: "GET",
                    headers: headers,
                    params: factory.generateRequestFromJson(params),
                    timeout: 30000
                }).success(function (data) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    // defer.resolve(data);
                    defer.reject(data);
                });
            } else {
                $http({
                    url: endpoint,
                    method: method,
                    headers: headers,
                    data: factory.generateRequestFromJson(params),
                    timeout: 30000
                }).success(function (data) {
                    defer.resolve(data);
                }).error(function (data, status, headers, config) {
                    // defer.resolve(data);
                    defer.reject(data);

                });
            }
            return defer.promise;
        };


        factory.generateRequestFromJson = function generateRequestFromJson(obj) {
            var str = [];
            for (var p in obj) {
                if (obj[p] == null) {
                    continue;
                }
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
        };
        return factory;
    });
})();

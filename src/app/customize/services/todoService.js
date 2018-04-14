/**
 * @author Ivan
 * created on 2017-9-18
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.customize').service('todoService', todoService);

    /** @ngInject */
    function todoService() {
        var savedData = {};

        function set(data) {
            savedData = data;
        }

        function get() {
            return savedData;
        }

        return {
            set: set,
            get: get
        }
    }
})();

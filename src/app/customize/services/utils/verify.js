/**
 * @author Ivan
 * created on 2017-9-18
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.customize').service('verify', verify);

    /** @ngInject */

    function verify() {
        /**
         * 校验数值是否为空或者小于0
         * @param text
         * @returns {boolean}
         */
        this.positiveInt = function (text) {
            return text == null || text < 0;
        }

    }
})();


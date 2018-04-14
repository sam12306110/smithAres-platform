/**
 * @author v.lugovsky
 * created on 10.12.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.inputs')
      .directive('baSwitcherCopy', baSwitcherCopy);

  /** @ngInject */
  function baSwitcherCopy() {
    return {
      templateUrl: 'app/customize/directive/baSwitcher/baSwitcherCopy.html',
      scope: {
        switcherStyle: '@',
        switcherValue: '='
      }
    };
  }

})();

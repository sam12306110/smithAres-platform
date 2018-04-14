/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .directive('contentTop', contentTop);

    /** @ngInject */
    function contentTop($location, $state) {
        return {
            restrict: 'E',
            templateUrl: 'app/theme/components/contentTop/contentTop.html',
            link: function ($scope) {
                $scope.$watch(function () {
                    $scope.activePageTitle = $state.current.title;
                });
            }
        };
    }

    //Lateral navigation
    angular.module('BlurAdmin.theme.components')
        .directive('lateralNav', lateralNav);

    function lateralNav($timeout) {
        return {
            restrict: 'E',
            // templateUrl: 'app/theme/components/contentTop/contentTop.html',
            templateUrl: 'app/pages/lateralNav/lateralNav.html',
            link: function ($scope) {
                $scope.$watch(function () {
                    // $scope.activePageTitle = $state.current.title;
                });
            }
        };
    }
})();
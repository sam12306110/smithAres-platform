/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('riskOrderTabCtrl', riskOrderTabCtrl);


    function riskOrderTabCtrl($scope, riskOfficialConfigVarHolder, custNotify) {

        //事件broadcast start
        $scope.clickRiskOrderCtrl = function () {
            $scope.$broadcast(riskOfficialConfigVarHolder.actions.clickRiskOrderCtrl);
        }

        $scope.clickHostileOrderCtrl = function () {
            $scope.$broadcast(riskOfficialConfigVarHolder.actions.clickHostileOrderCtrl);
        }
        //事件broadcast end
        var pageX = 0;
        var pageY = 0;
        $(document).unbind('mousemove')
        $(document).mousemove(function (e) {
            var xy_keleyi_com = "x坐标:" + e.pageX + ",y坐标：" + e.pageY;
            pageX = e.pageX;
            pageY = e.pageY;
        })
        $scope.popObjArr = [];
        $scope.onMouseenter = function (e) {
            $scope.popObjArr = [];
            var obj = JSON.parse(e)
            for (var i in obj) {
                $scope.popObjArr.push({k: i, v: obj[i]})
            }
            $('#so-pop').offset({top: pageY, left: pageX + 10}).show()
        }
        $scope.onMouseout = function () {
            $('#so-pop').hide()
        }
    }


})();


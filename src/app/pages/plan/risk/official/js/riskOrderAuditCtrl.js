/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('riskOrderAuditCtrl', riskOrderAuditCtrl);

    //外网ip限制
    function riskOrderAuditCtrl($scope, httpFactory, riskOfficialConfigVarHolder,
                                custNotify, $uibModal) {

        $scope.viewParam = {
            remark: null,
        }

        $scope.formatUpdateParam = function (item, status) {
            var updateParam = {
                orderId: null,
                status: null,
                remark: null,
            }
            updateParam.orderId = item.orderId;
            updateParam.status = status;
            if ($scope.viewParam.remark != null ||
                $scope.viewParam.remark != undefined) {
                updateParam.remark = $scope.viewParam.remark;
            }
            return updateParam;
        }


        $scope.refresh = function () {
            $scope.$dismiss();
            // $scope.selectPage(1);
            riskOfficialConfigVarHolder.refreshMethod();
        }

        $scope.onPass = function () {
            var item = riskOfficialConfigVarHolder.auditItem;
            if (item.orderId == null || item.orderId == undefined) {
                custNotify.error("操作错误", "没有订单id")
                return;
            }

            var updateParam = $scope.formatUpdateParam(item,
                riskOfficialConfigVarHolder.riskOrderStatus.PASS);


            httpFactory.getList(riskOfficialConfigVarHolder.updateRiskOrderStatusURL(),
                'POST',
                updateParam
            ).then(function (result) {
                custNotify.info("操作提示", "审核通过成功");
                $scope.refresh();
            }, function (result) {
                custNotify.error('操作提示', '审核失败！');
                $scope.refresh();
            });
            $scope.$dismiss();
            riskOfficialConfigVarHolder.refreshMethod();
        };


        $scope.onNotPass = function () {
            var item = riskOfficialConfigVarHolder.auditItem;
            if (item.orderId == null || item.orderId == undefined) {
                custNotify.error("操作错误", "没有订单id")
                return;
            }

            var updateParam = $scope.formatUpdateParam(item,
                riskOfficialConfigVarHolder.riskOrderStatus.NOT_PASS);


            httpFactory.getListByForm(riskOfficialConfigVarHolder.updateRiskOrderStatusURL(),
                'POST',
                updateParam
            ).then(function (result) {
                custNotify.info("操作提示", "审核不通过成功");
                $scope.refresh();
            }, function (result) {
                custNotify.error('操作提示', '审核失败！');
                $scope.refresh();
            });

        }
    }


})();


/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('domainEdit', domainEdit);

    /** @ngInject */
    function domainEdit($scope, httpFactory, lotteryConst, custNotify) {
        var url = lotteryConst.aresPathPlat + '/domain';
        $scope.titleName = "添加域名";
        $scope.entity = {
            domain: null,
            type: null
        };
        $scope.selectParam = {
            domainType: lotteryConst.domainType,
            domainTypeSelected: null
        };

        $scope.onSave = function () {
            if ($scope.entity.domains == null) {
                return;
            }
            if (!$scope.selectParam.domainTypeSelected) {
                custNotify.warning('请选择域名类型', '提示：');
                return;
            }

            var entity = {
                type: $scope.selectParam.domainTypeSelected.id,
                domains:$scope.entity.domains.split(",")
            };


            httpFactory.getList(url + '/saveByBatch', 'POST', {"Content-Type": "application/x-www-form-urlencoded"}, httpFactory.generateRequestFromJson(entity)).then(function (result) {
                if (result.data>=0) {
                    custNotify.success('操作提示', '新增成功！');
                    $scope.$dismiss();
                }
            }, function () {
                custNotify.error('操作提示', '新增失败！');
            });
        };
    }

})();


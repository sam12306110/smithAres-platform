/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('memberLevelEdit', memberLevelEdit);

    /** @ngInject */
    function memberLevelEdit($scope, httpFactory, lotteryConst, custNotify, todoService, common, $filter) {
        var url = lotteryConst.uaaPathPlat + '/memberLevel';

        function initPage() {
            $scope.entity = {
                accessDiscountId: 0,
                rebateProgramId: 0
            };
            $scope.selectParam = {
                accessDiscount: [],
                accessDiscountSelected: null,
                rebateProgram: [],
                rebateProgramSelected: null
            };

        }

        initPage();

        $scope.edit = todoService.get().edit;
        if (todoService.get().item) {
            $scope.entity = todoService.get().item;


            $scope.titleName = "修改会员层级";
        } else {
            $scope.titleName = "会员分层设定详情";

        }
        httpFactory.getList(lotteryConst.aresPathPlat + '/accessDiscount' + '/getSelectList', 'GET', null,null).then(function (result) {
            $scope.selectParam.accessDiscount = result.data;
            $scope.selectParam.accessDiscount.forEach(function (row) {
                if (row.id == $scope.entity.accessDiscountId) {
                    $scope.selectParam.accessDiscountSelected = row;
                }
            });
        }, function (data) {

        });
        httpFactory.getList(lotteryConst.aresPathPlat + '/rebateProgram' + '/getSelectList', 'GET', null, null).then(function (result) {
            $scope.selectParam.rebateProgram = result.data;
            $scope.selectParam.rebateProgram.forEach(function (row) {
                if (row.id == $scope.entity.rebateProgramId) {
                    $scope.selectParam.rebateProgramSelected = row;
                }
            });
        }, function (data) {

        });

        $scope.onSave = function () {
            if (!$scope.entity.name) {
                custNotify.warning('请输入层级名称！', '提示:');
                return;
            }
            if (!$scope.selectParam.accessDiscountSelected) {
                custNotify.warning('请设置出入款优惠方案！', '提示:');
                return;
            }

            if ($scope.selectParam.accessDiscountSelected) {
                $scope.entity.accessDiscountId = $scope.selectParam.accessDiscountSelected.id
            }
            if ($scope.selectParam.rebateProgramSelected) {
                $scope.entity.rebateProgramId = $scope.selectParam.rebateProgramSelected.id
            }

            httpFactory.getList(url + '/save', 'POST', null, $scope.entity).then(function (result) {
                if (result.data == -1) {
                    custNotify.warning('层级名称重复！', '提示:');
                    return
                }
                custNotify.success('修改成功！', '提示:');
                $scope.$dismiss();
            }, function (data) {
                custNotify.error('操作提示', '新增失败！');
            });
        };
    }
})();


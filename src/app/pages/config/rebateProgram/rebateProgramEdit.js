/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('rebateProgramEdit', rebateProgramEdit);

    /** @ngInject */
    function rebateProgramEdit($scope, httpFactory, lotteryConst, custNotify, todoService, common, $filter) {
        var url = lotteryConst.aresPathPlat + '/rebateProgram';
        $scope.itemPO = [];

        $filter('filter')(lotteryConst.lottery, {sideType: 2}).forEach(function (row) {
            var item = {cid: null, lotteryId: null, rebateProgramId: null, percentage: 0, value: null, lotteryType: null};
            item.lotteryId = row.id;
            item.value = row.value;
            item.lotteryType = row.lotteryType;
            $scope.itemPO.push(item);
        });


        $scope.edit = todoService.get().edit;
        if (todoService.get().item) {
            var item = todoService.get().item;
            httpFactory.getList(url + '/view', 'GET', null, {cid: item.cid}).then(function (result) {
                if (result.data) {
                    $scope.entity = result.data;
                    $scope.itemPO.forEach(function (item) {
                        $scope.entity.itemPO.forEach(function (row) {
                            if (item.lotteryId == row.lotteryId) {
                                item.cid = row.cid;
                                item.rebateProgramId = row.rebateProgramId;
                                item.percentage = row.percentage / 100;
                            }
                        });
                    });
                }
            }, function (result) {

            });
            $scope.titleName = "修改返水方案";
        } else {
            $scope.titleName = "新增返水方案";
        }

        $scope.onSave = function () {
            if ($scope.entity.name == null) {
                return;
            }
            var checkFlag = false;
            $scope.itemPO.forEach(function (row) {
                if (row.percentage == undefined)
                    checkFlag = true;
            });
            if (checkFlag) {
                return;
            }

            var entity = {
                cid: $scope.entity.cid,
                name: $scope.entity.name, //方案名称
                itemPO: []
            };
            $scope.itemPO.forEach(function (row) {
                var item = {cid: null, rebateProgramId: null, lotteryId: null, percentage: 0};
                item.cid = row.cid;
                item.rebateProgramId = row.rebateProgramId;
                item.lotteryId = row.lotteryId;
                item.percentage = row.percentage * 100;
                entity.itemPO.push(item);
            });
            httpFactory.getList(url + '/save', 'POST', null, entity).then(function (result) {
                if (result.data == -1) {
                    custNotify.warning('名称重复', '提示：');
                    return false;
                }
                custNotify.success('操作成功', '提示：');
                $scope.$dismiss();
            }, function (data) {
                custNotify.error('操作成功', '提示：');
            });
        };


    }

})();


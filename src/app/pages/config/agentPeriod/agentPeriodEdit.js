/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('agentPeriodEdit', agentPeriodEdit);

    /** @ngInject */
    function agentPeriodEdit($scope, httpFactory, lotteryConst, custNotify, common) {
        var url = lotteryConst.aresPathPlat + '/agentPeriod';
        $scope.titleName = "新增期数";
        $scope.selectParam = {};
        $scope.entity = {};
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            var sodateStart = new common.soDate(); // 声明一个新的日期控件
            sodateStart.init({//初始化控件
                $id: 'startTime',//input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss'// 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.selectParam.startTime = res;
            });
            var sodateEnd = new common.soDate();// 声明一个新的日期控件
            sodateEnd.init({//初始化控件
                $id: 'endTime',//input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss'// 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.selectParam.endTime = res;
            });
        });

        $scope.onSave = function () {
            if ($scope.entity.name == null || $scope.selectParam.startTime == null || $scope.selectParam.endTime == null) {
                return;
            }
            var saveData = {
                name: $scope.entity.name,
                beginTime: new Date($scope.selectParam.startTime).getTime(),
                endTime: new Date($scope.selectParam.endTime).getTime()
            };
            httpFactory.getList(url + '/save', 'POST', null, saveData).then(function (result) {
                if (result.data == -1) {
                    custNotify.warning('名称重复', '提示：');
                    return false;
                }
                if (result.data == -2) {
                    custNotify.warning('已存在时间段', '提示：');
                    return false;
                }
                custNotify.success('操作成功', '提示：');
                $scope.$dismiss();
            }, function () {
                custNotify.error('操作失败', '提示：');
            });
        };
    }

})();


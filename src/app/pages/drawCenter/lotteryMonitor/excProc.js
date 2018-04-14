/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('excProcCtrl', excProcCtrl);

    /** @ngInject */
    function excProcCtrl($scope, httpFactory, lotteryConst, todoService, common, custNotify, $filter) {
        var url = lotteryConst.aresAnalysisPath + '/prizeNumber';
        var fixedCode = lotteryConst.fixedCode;
        $scope.selectParam = {
            fixedCode: [],
            fixedCodeSelected: null,
            ptime: null
        };

        function initPage() {
            $scope.selectParam.ptime = null;
            $scope.entity = {
                comments: null,
                numbers: null
            };
        }

        $scope.item = todoService.get().item;
        var flag = getTimeRange($scope.item);
        if (flag) {
            fixedCode.forEach(function (row) {
                if (row.type == 1) {
                    $scope.selectParam.fixedCode.push(row);
                }
            })
        }else{
            $scope.selectParam.fixedCode = fixedCode;
        }

        function getTimeRange(e) {
            var startTime = e.startTime || 0;
            var endTime = e.endTime || 0;
            var newTime = new Date().getTime();
            return startTime < newTime && newTime < endTime;
        }

        $scope.selectParam.fixedCodeSelected = $scope.selectParam.fixedCode[0];

        //日期控件 事件ngRepeatFinished作用是延迟加载
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {

            var sodateStart = new common.soDate(); // 声明一个新的日期控件
            sodateStart.init({//初始化控件
                $id: 'ptime',//input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss'// 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.selectParam.ptime = res;
            });
            sodateStart.init({//初始化控件
                $id: 'ptime1',//input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss'// 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.selectParam.ptime = res;
            });
        });

        $scope.onSave = function () {
            var entity = {
                cid: $scope.item.cid,
                comments: $scope.entity.comments || '',
                fixedCode: 0,
                numbers: $scope.entity.numbers,
                ptime: null,
                status: null
            };
            if ($scope.selectParam.fixedCodeSelected) {
                entity.fixedCode = $scope.selectParam.fixedCodeSelected.id;
            }
            if ($scope.selectParam.ptime) {
                entity.ptime = new Date($scope.selectParam.ptime).getTime();
            }

            httpFactory.getList(url + '/errorFixed', 'POST', null, entity).then(function (result) {
                $scope.$dismiss();
                custNotify.success('操作提示', '处理成功！');
            }, function (data) {
                custNotify.error('操作提示', '处理失败！');
            });
        };
        $scope.$watch("selectParam.fixedCodeSelected", function (newVal) {
            initPage();
        });
    }

})();


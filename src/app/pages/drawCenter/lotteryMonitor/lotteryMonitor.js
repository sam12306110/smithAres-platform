/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('lotteryMonitorCtrl', periodManageCtrl);

    /** @ngInject */
    function periodManageCtrl($scope, httpFactory, lotteryConst, custNotify, $uibModal, common, todoService, $interval) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url = lotteryConst.aresAnalysisPath + '/prizeNumber';

        function initPage() {
            $scope.selectParam = {
                lottery: [{id: null, value: '全部', sideType: 2}].concat(lotteryConst.lottery),
                lotterySelected: {id: null, value: '全部'},
                startTime: '',
                endTime: '',
                cycled: {msg: '不更新', val: 0},
                cycle: lotteryConst.cycle
            };
            $scope.queryParam = {
                startTime: '',
                endTime: '',
                page: 1,
                rows: $scope.pageSize
            };
        }

        initPage();

        var interval;
        $scope.$watch('selectParam.cycled', function (newVal) {
            $interval.cancel(interval);
            if ($scope.selectParam.cycled.val) {
                interval = $interval(function () {
                    $scope.onSearch();
                }, $scope.selectParam.cycled.val * 1000);
            }
        });
        $scope.$on('$destroy', function () {
            $interval.cancel(interval);
        });

        //日期控件 事件ngRepeatFinished作用是延迟加载
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
        /*开奖监控列表*/
        $scope.onSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if ($scope.selectParam.lotterySelected) {
                $scope.queryParam.lotteryId = $scope.selectParam.lotterySelected.id;
            }
            if ($scope.selectParam.startTime) {
                $scope.queryParam.startTime = new Date($scope.selectParam.startTime).getTime();
            }
            if ($scope.selectParam.endTime) {
                $scope.queryParam.endTime = new Date($scope.selectParam.endTime).getTime();
            }
            httpFactory.getList(url + '/monitorList', 'GET', null, $scope.queryParam).then(function (result) {
                $scope.entity = result.data.rows;
                /**
                 * 分页开始
                 */
                $scope.queryParam.page = result.data.currentPage;//获取的当前页currentPage赋值给查询方法的当前页参数page
                common.soPage({
                    $id: 'page',
                    total: result.data.total,//总条数
                    size: $scope.queryParam.rows,//每页条数
                    nowPage: $scope.queryParam.page
                }, function (btn) {// 回调方法，返回当前页码
                    $scope.queryParam.page = btn;//重新赋值当前页
                    $scope.onSearch(1);// 获取list的方法
                });// 分页
                /**
                 * 分页结束
                 */
            }, function (data) {

            });
        };

        $scope.onSearch();

        $scope.onReset = function () {
            initPage();
        };


        function open(page, size) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size
            });
            modalInstance.result.then(function (result) {
                $scope.onSearch();
            }, function (reason) {
                $scope.onSearch();
            });
        }
    }
})();


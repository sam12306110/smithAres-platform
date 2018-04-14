/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('accessSummary', accessSummary);

    /** @ngInject */
    function accessSummary($scope, httpFactory, lotteryConst, custNotify, $uibModal, todoService, $interval, common) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url = lotteryConst.payConfigPath + '/trade';

        function initPage() {
            $scope.selectParam = {
                startTime: null,
                endTime: null
            };

            $scope.queryParam = {};
            $scope.dateFun = function (e) {
                var date = {startTime: '', endTime: ''}
                switch (e) {
                    case 0:
                        date = {
                            startTime: common.getDateDay('today'),
                            endTime: common.getDateDay('today')
                        };
                        break;
                    case 1:
                        date = {
                            startTime: common.getDateDay('yesterday'),
                            endTime: common.getDateDay('yesterday')
                        };
                        break;
                    case 2:
                        date = {
                            startTime: common.getDateDay('lastWeekStart'),
                            endTime: common.getDateDay('lastWeekEnd')
                        };
                        break;
                    case 3:
                        date = {
                            startTime: common.getDateDay('weekStart'),
                            endTime: common.getDateDay('weekEnd')
                        };
                        break;
                    case 4:
                        date = {
                            startTime: common.getDateDay('lastMonthStart'),
                            endTime: common.getDateDay('LastMonthEnd')
                        };
                        break;
                    case 5:
                        date = {
                            startTime: common.getDateDay('monthStart'),
                            endTime: common.getDateDay('monthEnd')
                        };
                        break;
                }
                $('#startTime').val(date.startTime + ' 00:00:00');
                $('#endTime').val(date.endTime + ' 23:59:59');
                $scope.selectParam.startTime = date.startTime + ' 00:00:00';
                $scope.selectParam.endTime = date.endTime + ' 23:59:59';
            };
        }

        initPage();

        /**
         * 条件搜索
         */
        $scope.isEdit = false;
        $scope.onSearch = function () {
            $scope.isEdit = true;
            if ($scope.selectParam.startTime != null) {
                $scope.queryParam.startTime = new Date($scope.selectParam.startTime).getTime();
            }
            if ($scope.selectParam.endTime != null) {
                $scope.queryParam.endTime = new Date($scope.selectParam.endTime).getTime();
            }
            httpFactory.getList(url + '/statList', 'GET', null, $scope.queryParam).then(function (result) {
                $scope.isEdit = false;
                $scope.entity = result.data;
                $scope.total = {
                    flow: 0,
                    out: 0
                };

                $scope.entity.forEach(function (rows) {
                    if (rows.chargeType == 0) {
                        $scope.total.flow += rows.totalAmount;
                    }
                    if (rows.chargeType == 1) {
                        $scope.total.out += rows.totalAmount;
                    }
                });
            }, function (data) {

            });
        };
        $scope.dateFun(0);
        $scope.onSearch();


        $scope.onReset = function () {
            initPage();
        };

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


        $scope.gogogo = function (tradeType) {
            switch (tradeType) {
                case 1:
                    common.addNav("#/funds/companyFlowInfo", "公司入款详情");
                    break;
                case 3:
                    common.addNav("#/funds/olineFlowInfo", "线上入款详情");
                    break;
                case 5:
                    common.addNav("#/funds/manualFlowInfo", "人工入款详情");
                    break;
                case 6:
                    common.addNav("#/funds/memberOutFlowInfo", "会员出款扣款详情");
                    break;
                case 7:
                    common.addNav("#/funds/memberOutInfo", "会员出款详情");
                    break;
                case 10:
                    common.addNav("#/funds/giveDiscountInfo", "给予优惠详情");
                    break;
                case 8:
                    common.addNav("#/funds/manualDrawInfo", "人工提出详情");
                    break;
                case 9:
                    common.addNav("#/funds/giveRebateInfo", "给予返水详情");
                    break;
                default:
                    break;
            }
            todoService.set(
                {
                    item: {
                        startTime: $scope.queryParam.startTime,
                        endTime: $scope.queryParam.endTime
                    }
                }
            );
        };


    }
})();


/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('manualWithdrawalRecord', manualWithdrawalRecord);

    /** @ngInject */
    function manualWithdrawalRecord($scope, httpFactory, lotteryConst, custNotify, $interval, todoService, common, $sce) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        $scope.agentFlag = !lotteryConst.agentFlag;
        var url = lotteryConst.payConfigPath;
        var fileUrl = lotteryConst.imgUrl + '/photo/file/';

        /*this.depositType*/
        function initPage() {
            $scope.selectParam = {
                depositType: [{id: null, value: '全部'}].concat(lotteryConst.depositType),
                withdrawalType: [{id: null, value: '全部'}].concat(lotteryConst.withdrawalType),
                depositTypeSelected: {id: null, value: '全部'},
                withdrawalTypeSelected: {id: null, value: '全部'},
                startTime: null,
                endTime: null
            };

            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                tradeType: 5,
                actionType: null,
                startMoney: null,
                endMoney: null
            };
            $scope.withdrawalQueryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                tradeType: 8,
                actionType: null,
                startMoney: null,
                endMoney: null
            }
        }

        initPage();
        $scope.openTab = function (e) {
            if (e == 1) {
                initPage();
                $scope.onSearch1()
            } else {
                initPage();
                $scope.onSearch2()
            }
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
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            var sodateStart = new common.soDate(); // 声明一个新的日期控件
            sodateStart.init({//初始化控件
                $id: 'startTime2',//input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss'// 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.selectParam.startTime = res;
            });
            var sodateEnd = new common.soDate();// 声明一个新的日期控件
            sodateEnd.init({//初始化控件
                $id: 'endTime2',//input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss'// 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.selectParam.endTime = res;
            });
        });

        //时间
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
            // $scope.onSearch1();
        };

        $scope.dateFun2 = function (e) {
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
            $('#startTime2').val(date.startTime + ' 00:00:00');
            $('#endTime2').val(date.endTime + ' 23:59:59');
            $scope.selectParam.startTime = date.startTime + ' 00:00:00';
            $scope.selectParam.endTime = date.endTime + ' 23:59:59';
            $scope.onSearch2();
        };


        /**
         * 条件搜索
         */
        $scope.onSearch1 = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if ($scope.selectParam.depositTypeSelected) {
                $scope.queryParam.actionType = $scope.selectParam.depositTypeSelected.id;
            }
            if ($scope.selectParam.startTime) {
                $scope.queryParam.startTime = new Date($scope.selectParam.startTime).getTime();
            }
            if ($scope.selectParam.endTime) {
                $scope.queryParam.endTime = new Date($scope.selectParam.endTime).getTime();
            }
            //console.log(url + '/chargeanddraw/record')
            httpFactory.getList(url + '/chargeanddraw/record', 'GET', null, $scope.queryParam).then(function (result) {
                $scope.entity = result.rows;
                $scope.summary = result.summary;

                /**
                 * 分页开始
                 */
                $scope.queryParam.page = result.currentPage;//获取的当前页currentPage赋值给查询方法的当前页参数page
                common.soPage({
                    $id: 'page',
                    total: result.total,//总条数
                    size: $scope.queryParam.rows,//每页条数
                    nowPage: $scope.queryParam.page
                }, function (btn) {// 回调方法，返回当前页码
                    $scope.queryParam.page = btn;//重新赋值当前页
                    $scope.onSearch1(1);// 获取list的方法
                });// 分页
                /**
                 * 分页结束
                 */
            }, function (data) {

            });
        };
        $scope.onSearch1();

        $scope.onSearch2 = function (e) {
            if (!e) {
                $scope.withdrawalQueryParam.page = 1;
            }

            if ($scope.selectParam.withdrawalTypeSelected) {
                $scope.withdrawalQueryParam.actionType = $scope.selectParam.withdrawalTypeSelected.id;
            }
            if ($scope.selectParam.startTime) {
                $scope.withdrawalQueryParam.startTime = new Date($scope.selectParam.startTime).getTime();
            }
            if ($scope.selectParam.endTime) {
                $scope.withdrawalQueryParam.endTime = new Date($scope.selectParam.endTime).getTime();
            }
            httpFactory.getList(url + '/chargeanddraw/record', 'GET', null, $scope.withdrawalQueryParam).then(function (result) {
                $scope.withdrawalEntity = result.rows;
                $scope.withdrawalSummary = result.summary;

                /**
                 * 分页开始
                 */

                $scope.withdrawalQueryParam.page = result.currentPage;//获取的当前页currentPage赋值给查询方法的当前页参数page
                common.soPage({
                    $id: 'page-2',
                    total: result.total,//总条数
                    size: $scope.withdrawalQueryParam.rows,//每页条数
                    nowPage: $scope.withdrawalQueryParam.page
                }, function (btn) {// 回调方法，返回当前页码
                    $scope.withdrawalQueryParam.page = btn;//重新赋值当前页
                    $scope.onSearch2(1);// 获取list的方法
                });// 分页
                /**
                 * 分页结束
                 */
            }, function (data) {

            });
        };
        //$scope.onSearch2();
        $scope.onReset = function () {
            initPage();
        };

    }
})();


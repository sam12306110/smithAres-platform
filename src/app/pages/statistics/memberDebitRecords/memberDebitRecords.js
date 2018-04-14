/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('memberDebitRecords', memberDebitRecords);

    /** @ngInject */
    function memberDebitRecords($scope, httpFactory, lotteryConst, custNotify, todoService, $interval, common, $sce, $uibModal) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url = lotteryConst.paymentPlatPath;

        function initPage() {
            $scope.selectParam = {
                typesSelected: {id: 1, value: "会员账号"},
                sourceSelected: {id: null, value: '全部'},
                sourceType: [{id: null, value: '全部'}].concat(lotteryConst.sourceTerminal),
                typesName: lotteryConst.typesName,
                chargeType: '手续费扣除'
            };

            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                memberName: null,
                agentName: null,
                startTime: null,
                endTime: null,
                source: null,
                orderNo: null
            };
        }


        initPage();
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
        };
        $scope.dateFun(1);
        /**
         * 条件搜索
         */
        $scope.onSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if ($scope.selectParam.sourceSelected) {
                $scope.queryParam.sourceType = $scope.selectParam.sourceSelected.id
            }
            if ($scope.selectParam.startTime) {
                $scope.queryParam.startTime = new Date($scope.selectParam.startTime).getTime();
            }
            if ($scope.selectParam.endTime) {
                $scope.queryParam.endTime = new Date($scope.selectParam.endTime).getTime();
            }

            httpFactory.getList(url + '/member/draw/order/withhold', 'GET', null, $scope.queryParam).then(function (result) {
                $scope.subSummary = 0; //小计
                $scope.summary = 0;  //总计
                if (result.data) {
                    $scope.entity = result.data.rows;
                    $scope.summary = result.data.summary;
                    $scope.entity.forEach(function (row) {
                        $scope.subSummary += row.tradeAmount;
                    });

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
                }

            }, function (result) {

            });
        };
        $scope.onSearch();
        $scope.onReset = function () {
            initPage();
        };
    }
})();


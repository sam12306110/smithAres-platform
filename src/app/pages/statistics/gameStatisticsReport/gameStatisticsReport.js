/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('gameStatisticsReport', gameStatisticsReport);

    /** @ngInject */
    function gameStatisticsReport($scope, httpFactory, lotteryConst, custNotify, $interval, todoService, common, $sce) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url = lotteryConst.hermesApis ;
        var fileUrl = lotteryConst.imgUrl + '/photo/file/';
        $scope.agentFlag=!lotteryConst.agentFlag;

        /*this.depositType*/
        function initPage() {
            $scope.selectParam = {
                sourceType:[{id: null, value: '全部'}].concat(lotteryConst.sourceType),
                statusSelected:{id: null, value: '全部'},
                lottery: [{id: null, value: '全部', sideType: 2}].concat(lotteryConst.lottery),
                lotterySelected: {id: null, value: '全部'},
            };
            $scope.queryParam = {
                page: 1,//当前页*分页必须
                count: $scope.pageSize,//分页行数*分页必须
                sideType:2
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
        $scope.gogogo = function (e) {
            if(!e.lotteryName  ){
                return false
            }
            todoService.set(
                {
                    createTimeStart:$scope.selectParam.startTime,
                    createTimeEnd:$scope.selectParam.endTime,
                    lottery:e.lotteryId
                }
            );
            window.localStorage.setItem('cTimeStart',$scope.selectParam.startTime);
            window.localStorage.setItem('statusSelected',$scope.selectParam.statusSelected);
            window.sessionStorage.setItem('lottery',e.lotteryId);
            window.location.href = '#/statistics/singleDayGameReport'
        };
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
            // $scope.onSearch();
        };
        $scope.dateFun(1)
        /**
         * 条件搜索
         */
        $scope.onSearch = function (btn, e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if ($scope.selectParam.startTime) {
                $scope.queryParam.startPdate = new Date($scope.selectParam.startTime).getTime();
            }
            if ($scope.selectParam.endTime) {
                $scope.queryParam.endPdate = new Date($scope.selectParam.endTime).getTime();

            }
            if($scope.selectParam.statusSelected){
                $scope.queryParam.source=$scope.selectParam.statusSelected.id;
            }
            if($scope.selectParam.lotterySelected){
                var arr=[];
                for (var i = 0; i < $scope.selectParam.lotterySelected.length; i++) {
                    arr.push($scope.selectParam.lotterySelected[i].id)
                }

                $scope.queryParam.lotteryIds = arr
            }

            httpFactory.getList(url + '/report/statics/game', 'GET',null,$scope.queryParam).then(function (result) {
                if(result.data){
                    $scope.entity = result.data.rows;
                    $scope.summary = result.data.summary;
                    $scope.oldsummary = {
                        orderNum:0,
                        totalBetAmount:0,
                        totalEffectiveBetAmount: 0,
                        totalReforwardPoint: 0,
                        totalPayoff:0,
                        totalGainLost:0
                    };
                    if($scope.entity){
                        $scope.entity.forEach(function (item) {
                            $scope.oldsummary.orderNum +=item.orderNum;
                            $scope.oldsummary.totalBetAmount  +=item.totalBetAmount;
                            $scope.oldsummary.totalEffectiveBetAmount +=item.totalEffectiveBetAmount;
                            $scope.oldsummary.totalReforwardPoint +=item.totalReforwardPoint;
                            $scope.oldsummary.totalPayoff +=item.totalPayoff;
                            $scope.oldsummary.totalGainLost +=item.totalGainLost;
                        });
                    }
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
            }, function (data) {
            });
        };
        $scope.onSearch();
        $scope.onReset = function () {
            initPage();
            $scope.dateFun(1)
        };
    }
})();


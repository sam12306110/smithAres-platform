
/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('singleDayGameReport', singleDayGameReport);

    /** @ngInject */
    function singleDayGameReport($scope, httpFactory, lotteryConst, todoService, common, $sce) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url = lotteryConst.hermesApis ;
        var fileUrl = lotteryConst.imgUrl + '/photo/file/';
        $scope.agentFlag=!lotteryConst.agentFlag;
        function initPage() {
            $scope.selectParam = {
                sourceType:[{id: null, value: '全部'}].concat(lotteryConst.sourceType),
                startTime:todoService.get().createTimeStart ,
                endTime:todoService.get().createTimeEnd ,
                statusSelected:todoService.get().statusSelected,
                lottery:todoService.get().lottery||sessionStorage.getItem('lottery'),
                played:'',
                plays:''
            };
            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
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
                if(!e.date){
                return false
            }
            var ddt =e.date.toString();
            var date = ddt.slice(0, 4) + '/' + ddt.slice(4,6) + '/' + ddt.slice(6, 8)
            var sdate=new Date( date+ ' 00:00:00').getTime();
            var edate=new Date( date+  ' 23:59:59').getTime();
                todoService.set(
                    {
                        createTimeStart:sdate,
                        createTimeEnd:edate,
                        lottery:$scope.selectParam.lottery,
                        plays:$scope.selectParam.plays
                    }
                );
                window.localStorage.setItem('cTimeStart',$scope.selectParam.startTime);
                window.sessionStorage.setItem('plays',JSON.stringify($scope.selectParam.plays))
                window.location.href = '#/statistics/singleGameReport'
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
        /**
         * 条件搜索
         */
        /**
         * 获取玩法列表
         */
        $scope.getPlaysList = function () {
            var lotteryId=$scope.selectParam.lottery;
            if (!lotteryId) {
                return;
            }
            httpFactory.getList(lotteryConst.aresPath + '/plays/getPlaysMap?lotteryId=' + lotteryId, 'GET', null, {}).then(function (result) {
                if (result.data) {
                    var arr = [];
                    result.data.forEach(function (row) {
                        var entity = {value: null, playId: null};
                        entity.value = row.playSetName + '-' + row.playGroupName + '-' + row.playName;
                        entity.playId = row.playId;
                        arr.push(entity);
                    });
                    $scope.selectParam.plays = [{
                        value: "全部",
                        playId: null
                    }].concat(arr);
                } else {

                }
            }, function (data) {

            });
        };
        /**
         * 彩种改变监听事件
         */
        $scope.$watch('selectParam.lottery', function () {
            $scope.getPlaysList();
});
        $scope.onSearch = function (e) {
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
            if($scope.selectParam.played){
                var arr=[];
                for (var i = 0; i < $scope.selectParam.played.length; i++) {
                    arr.push($scope.selectParam.played[i].playId)
                }

                $scope.queryParam.playIds = arr
            }
            if($scope.selectParam.lottery){
                $scope.queryParam.lotteryIds=$scope.selectParam.lottery
            }

            httpFactory.getList(url + '/report/statics/game_per_day', 'GET', null, $scope.queryParam).then(function (result) {
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
        $scope.onSearch()
        $scope.onReset = function () {
            initPage();
            $scope.dateFun(1)
        };
    }
})();


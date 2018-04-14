
/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('gameplayDetails', gameplayDetails);

    /** @ngInject */
    function gameplayDetails($scope, httpFactory, lotteryConst, custNotify, $interval, todoService, common, $sce) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url = lotteryConst.hermesApis ;
        // var fileUrl = lotteryConst.imgUrl + '/photo/file/';
        $scope.agentFlag=!lotteryConst.agentFlag;

        function initPage() {
            $scope.selectParam = {
                startTime:todoService.get().createTimeStart ,
                endTime:todoService.get().createTimeEnd ,
                sourceType:[{id: null, value: '全部'}].concat(lotteryConst.sourceType),
                statusSelected:{id: null, value: '全部'},
                plays:JSON.parse(sessionStorage.getItem('plays')),
                lotterys:sessionStorage.getItem('lottery'),
                pcode:sessionStorage.getItem('pcode'),
                played:sessionStorage.getItem('played')
            };
            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                source:'',
                lotteryId:'',
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
            // $scope.onSearch();
        };
        /**
         * 条件搜索
         */
        $scope.onSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if($scope.selectParam.lotterys){
                $scope.queryParam.lotteryId=$scope.selectParam.lotterys
            }
            if($scope.selectParam.statusSelected){
                $scope.queryParam.source=$scope.selectParam.statusSelected.id
            }
            if($scope.selectParam.played){
                $scope.queryParam.playId= $scope.selectParam.played
            }
            if($scope.selectParam.startTime) {
                $scope.queryParam.start= new Date($scope.selectParam.startTime).getTime();
            }
            if($scope.selectParam.endTime){
                $scope.queryParam.end = new Date($scope.selectParam.endTime).getTime();
            }
            if($scope.selectParam.pcode){
                $scope.queryParam.pCode=$scope.selectParam.pcode
            }
            httpFactory.getList(url + '/order/management/quick/search/game/details', 'GET', null, $scope.queryParam).then(function (result) {
                if(result.data){
                    $scope.entity = result.data.rows;
                    $scope.summary = result.data.summary;
                    $scope.oldsummary = {
                        betAmount:0,
                        validBetAmount: 0,
                        reforwardPoint: 0,
                        payoff:0,
                        gainLost:0
                    };
                    if($scope.entity){
                        $scope.entity.forEach(function (item) {
                            $scope.oldsummary.betAmount +=item.betAmount;
                            $scope.oldsummary.validBetAmount  +=item.validBetAmount;
                            $scope.oldsummary.reforwardPoint +=item.reforwardPoint;
                            $scope.oldsummary.payoff +=item.payoff;
                            $scope.oldsummary.gainLost +=item.gainLost;
                        });
                    }
                    sessionStorage.removeItem('pcode');
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


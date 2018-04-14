/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('AccessStatistics',AccessStatistics);

    /** @ngInject */
    function AccessStatistics($scope, httpFactory, lotteryConst, custNotify, $interval, todoService, common, $sce) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        $scope.agentFlag=!lotteryConst.agentFlag;
        var url = lotteryConst.payConfigPath ;
        $scope.agentFlag=!lotteryConst.agentFlag;
        // var fileUrl = lotteryConst.imgUrl + '/photo/file/';
        /*this.depositType*/
        function initPage() {
            $scope.selectParam = {
                startTimeStamp:new Date(common.getDateDay('yesterday')+ ' 00:00:00').getTime(),
                endTimeStamp:new Date(common.getDateDay('yesterday')+' 23:59:59').getTime()
            };
            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须

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
        $scope.dateFun(1)

        /**
         * 条件搜索
         */
        $scope.onSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if ($scope.selectParam.startTime) {
                $scope.queryParam.startTime = new Date($scope.selectParam.startTime).getTime();


            }
            if ($scope.selectParam.endTime) {
                $scope.queryParam.endTime = new Date($scope.selectParam.endTime).getTime();

            }
            httpFactory.getList(url+ '/momey/statistics/inout', 'GET', null, $scope.queryParam).then(function (result) {
                if(result.data){
                    $scope.entity = result.data.rows;
                    $scope.summary = result.data.summary;
                    $scope.oldsummary = {
                        inMoneyTimes: 0,
                        inMoneyAmount: 0,
                        outMoneyTimes:0,
                        outMoneyAmount:0
                    };
                    if($scope.entity){
                        $scope.entity.forEach(function (item) {
                            $scope.oldsummary.inMoneyTimes +=item.inMoneyTimes;
                            $scope.oldsummary.inMoneyAmount +=item.inMoneyAmount;
                            $scope.oldsummary.outMoneyTimes +=item.outMoneyTimes;
                            $scope.oldsummary.outMoneyAmount +=item.outMoneyAmount;
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
        $scope.gogogo = function (e,type) {
            if(type=='1'){
                if(!e.inMoneyTimes ||e.inMoneyTimes==0 ){
                    return false
                }
                if($scope.selectParam.startTime&&$scope.selectParam.endTime){
                    todoService.set(
                        {
                            memberName: e.memberName,
                            createTimeStart:$scope.selectParam.startTime,
                            createTimeEnd:$scope.selectParam.endTime
                        }
                    );
                    window.localStorage.setItem('memberName',e.memberName)
                    window.localStorage.setItem('cTimeStart',$scope.selectParam.startTime);
                    window.localStorage.setItem('cTimeEnd',$scope.selectParam.endTime);
                }
                    window.location.href = '#/statistics/MembershipDetails'
            }
            if(type=="2"){
                if(!e.outMoneyTimes||e.outMoneyTimes==0){
                    return false
                }
                if($scope.selectParam.startTime&&$scope.selectParam.endTime){
                    todoService.set(
                        {
                            memberName: e.memberName,
                            createTimeStart:$scope.selectParam.startTime,
                            createTimeEnd:$scope.selectParam.endTime
                        }
                    );
                    window.localStorage.setItem('memberName',e.memberName)
                    window.localStorage.setItem('createTimeStart',$scope.selectParam.startTime);
                    window.localStorage.setItem('createTimeEnd',$scope.selectParam.endTime);
                }

                window.location.href = '#/statistics/MemberPaymentDetails'
            }
        };
        $scope.onReset = function () {
            initPage();
            $scope.dateFun(1)
        };

    }
})();


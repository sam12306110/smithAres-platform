/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('memberStatistics', memberStatistics);

    /** @ngInject */
    function memberStatistics($scope, httpFactory, lotteryConst, custNotify, $uibModal, todoService, common) {
        var url = lotteryConst.aresAccount+'/statistics';
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        $scope.agentFlag=!lotteryConst.agentFlag;

        function initPage() {
            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                startTime: '',
                endTime: '',
                status: ''
            };
            $scope.selectParam = {
                startTime: common.getDateDay('yesterday')+ ' 00:00:00',
                endTime: common.getDateDay('yesterday')+' 23:59:59',
                startTimeStamp:new Date(common.getDateDay('yesterday')+ ' 00:00:00').getTime(),
                endTimeStamp:new Date(common.getDateDay('yesterday')+' 23:59:59').getTime(),
                statusSelected: '',
                status: lotteryConst.status,
                memberLevel: $scope.memberLevel
            };
        }

        initPage();
        /**
         * 条件搜索
         */
        $scope.onSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if ($scope.selectParam.startTime) {
                $scope.queryParam.startTime = new Date($scope.selectParam.startTime).getTime();
                /*if(new Date($scope.selectParam.startTime).getTime()> $scope.selectParam.startTimeStamp){
                    $scope.queryParam.startTime=$scope.selectParam.startTimeStamp;
                    $scope.selectParam.startTime=common.getDateDay('yesterday')+ ' 00:00:00';
                   // custNotify.warning('注册开始时间不可以大于'+ common.getDateDay('yesterday')+' 00:00:00', '提示!');
                }else {


                }*/

            }
            if ($scope.selectParam.endTime) {
                $scope.queryParam.endTime = new Date($scope.selectParam.endTime).getTime();

            }
            if ($scope.selectParam.statusSelected) {
                $scope.queryParam.status = $scope.selectParam.statusSelected.id
            }
            httpFactory.getList(url + '/memberDaylist', 'GET', null, $scope.queryParam).then(function (result) {
                // console.log(result)
                $scope.subsummary={
                    subDepositAmount:0,
                    subWithdrawalAmount:0,
                    submemberSum:0,
                    subrechargeMemberCount:0

                };
                if (result.data) {
                    $scope.entity = result.data.rows;
                    for(var i=0;i<$scope.entity.length;i++ ){
                        if($scope.entity[i].depositAmount){
                            $scope.subsummary.subDepositAmount+=$scope.entity[i].depositAmount;
                        }
                        if($scope.entity[i].withdrawalAmount){
                            $scope.subsummary.subWithdrawalAmount+=$scope.entity[i].withdrawalAmount;
                        }
                        if($scope.entity[i].memberSum){
                            $scope.subsummary.submemberSum+=$scope.entity[i].memberSum;
                        }
                        if($scope.entity[i].rechargeMemberCount){
                            $scope.subsummary.subrechargeMemberCount+=$scope.entity[i].rechargeMemberCount;
                        }


                    }

                    $scope.summary=result.data.summary;
                   //console.log($scope.summary)
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
                } else {
                    $scope.entity = null;
                }
            }, function (result) {
                $scope.entity = null;
            });
        };
        $scope.onSearch();
        $scope.onReset = function () {
            initPage();
        };

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

        $scope.gogogo = function (e) {
            if(!e.memberSum ||e.memberSum==0 ){
                return false
            }
            todoService.set(
                {
                    cid: e.cid,
                    createTimeStart:$scope.queryParam.startTime,
                    createTimeEnd:$scope.queryParam.endTime
                }
            );
            window.localStorage.setItem('cid',e.cid);
            window.localStorage.setItem('createTimeStart',$scope.queryParam.startTime);
            window.localStorage.setItem('createTimeEnd',$scope.queryParam.endTime);
           window.location.href = '#/account/memberStatisticsSubpage'
        };
        /*$scope.openEdit = function (edit, item) {
            todoService.set({
                edit: edit,
                item: item
            });
            open('app/pages/account/agentList/agentListEdit.html', 'lg');
        };*/
    }
})();


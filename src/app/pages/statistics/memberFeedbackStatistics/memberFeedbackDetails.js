/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('memberFeedbackDetails', memberFeedbackDetails);

    /** @ngInject */
    function memberFeedbackDetails($scope, httpFactory, lotteryConst, custNotify, todoService, $interval, common, $sce) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url=lotteryConst.paymentPath;
        console.log(localStorage.cashStartTime2)
        function initPage() {
            $scope.selectParam = {
                startTime:todoService.get().startTime || localStorage.cashStartTime2,
                endTime:todoService.get().endTime || localStorage.cashEndTime2,
                lottery:lotteryConst.lottery,
                lotterySelected:{id:null,value:'全部'}
            };

            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                startTime:'',
                endTime:'',
                agentId:todoService.get().agentId || localStorage.cashAgentId2 ,
                memberId:todoService.get().memberId || localStorage.cashMemberId2

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

        //获取会员层级列表

        httpFactory.getList(lotteryConst.uaaPathPlat + '/memberLevel/getSelectList', 'GET', null, null).then(function (result) {
            //console.log(result)
            if (result.data) {
                $scope.selectParam.memberLevel = result.data;
                $scope.memberLevel=$scope.selectParam.memberLevel;

            }
            //console.log($scope.selectParam.memberLevel)
        }, function (data) {

        });

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
            if ($scope.selectParam.lotterySelected) {
                $scope.queryParam.lotteryId = $scope.selectParam.lotterySelected.id;
            }
            httpFactory.getList(url + '/mem_cash_back/statistics_mem', 'GET', null, $scope.queryParam).then(function (result) {
                $scope.entity = result.data.rows;
                $scope.summary = result.data.summary;
                $scope.subSummary = {
                    cashBackAmount:0
                };
                if( $scope.entity){
                    for(var i=0;i<$scope.entity.length;i++){
                        if($scope.entity.cashBackAmount){
                            $scope.subSummary.cashBackAmount+=$scope.entity.cashBackAmount
                        }
                    }
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
            }, function (data) {

            });
        };
        $scope.onSearch();
        $scope.onReset = function () {
            initPage();
        };
        //时间
        $scope.dateFun = function (e) {
            var date = {startTime: '', endTime: ''}
            switch (e) {
                case 0:
                    date = {
                        startTime: common.getDateDay('today'),
                        endTime: common.getDateDay('today')
                    }
                    break;
                case 1:
                    date = {
                        startTime: common.getDateDay('yesterday'),
                        endTime: common.getDateDay('yesterday')
                    }
                    break;
                case 2:
                    date = {
                        startTime: common.getDateDay('lastWeekStart'),
                        endTime: common.getDateDay('lastWeekEnd')
                    }
                    break;
                case 3:
                    date = {
                        startTime: common.getDateDay('weekStart'),
                        endTime: common.getDateDay('weekEnd')
                    }
                    break;
                case 4:
                    date = {
                        startTime: common.getDateDay('lastMonthStart'),
                        endTime: common.getDateDay('LastMonthEnd')
                    }
                    break;
                case 5:
                    date = {
                        startTime: common.getDateDay('monthStart'),
                        endTime: common.getDateDay('monthEnd')
                    }
                    break;
            }
            $('#startTime').val(date.startTime + ' 00:00:00')
            $('#endTime').val(date.endTime + ' 23:59:59')
            $scope.selectParam.startTime = date.startTime + ' 00:00:00';
            $scope.selectParam.endTime = date.endTime + ' 23:59:59';
        };


    }
})();


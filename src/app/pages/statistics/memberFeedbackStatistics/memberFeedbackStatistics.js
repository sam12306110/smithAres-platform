/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('memberFeedbackStatistics', memberFeedbackStatistics);

    /** @ngInject */
    function memberFeedbackStatistics($scope, httpFactory, lotteryConst, custNotify, todoService, $interval, common, $sce) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url=lotteryConst.paymentPlatPath;
        function initPage() {
            $scope.selectParam = {

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
         *
         */
        $scope.dateFun(1);
        $scope.onSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if ($scope.selectParam.memberLevelSelected) {
                var arr = [];
                for (var i = 0; i < $scope.selectParam.memberLevelSelected.length; i++) {
                    arr.push($scope.selectParam.memberLevelSelected[i].id)
                }
                //console.log(arr)
                $scope.queryParam.levelIds = arr.toString();
            }

            if ($scope.selectParam.startTime) {
                $scope.queryParam.startTime = new Date($scope.selectParam.startTime).getTime();
            }
            if ($scope.selectParam.endTime) {
                $scope.queryParam.endTime = new Date($scope.selectParam.endTime).getTime();
            }

            httpFactory.getList(url + '/agent/backwater/stats', 'GET', null, $scope.queryParam).then(function (result) {
                $scope.entity = result.data.rows;
                $scope.summary = result.data.summary;

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
            $scope.dateFun(1);
        };




       /* function open(page, size) {
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
        }*/

        $scope.gogogo = function (e) {
            todoService.set(
                {
                    agentId: e.agentId,
                    starTime: $scope.selectParam.startTime,
                    endTime: $scope.selectParam.endTime,
                    startTime: $scope.selectParam.startTime

                }
            );
            window.localStorage.setItem('cashAgentId',e.agentId);
            window.localStorage.setItem('cashStartTime',$scope.selectParam.startTime);
            window.localStorage.setItem('cashEndTime',$scope.selectParam.endTime);
            window.location.href = '#/statistics/memberFeedbackList'
        };

    }
})();


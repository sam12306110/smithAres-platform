
    /**
     * @author Ivan
     * created on 2017-9-17
     */

    (function () {
        'use strict';

        angular.module('BlurAdmin.pages').controller('memberNoteStatistics', memberNoteStatistics);

        /** @ngInject */
        function memberNoteStatistics($scope, httpFactory, lotteryConst, custNotify, $interval, todoService, common, $sce,$uibModal) {
            $scope.pageSize = lotteryConst.pageSize; //页面显示行
            $scope.agentFlag=!lotteryConst.agentFlag;
            var url = lotteryConst.hermesApis;/**/
            function initPage() {
                $scope.selectParam = {
                    // memberLevelSelected: todoService.get().memberLevelSelected||localStorage.memberLevelSelected,
                    // lotterySelected: todoService.get().lotterySelected||localStorage.lotterySelected,
                    levelId:todoService.get().memberLevelSelected,
                    lotteryId:todoService.get().lotterySelected,
                    startTime:!todoService.get().createTimeStart?'':todoService.get().createTimeStart ,
                    endTime:!todoService.get().createTimeEnd?'':todoService.get().createTimeEnd ,
                    lottery:[{id: null, value: '全部',sideType:2}].concat(lotteryConst.lottery)
                };
                $scope.queryParam = {
                    page: 1,//当前页*分页必须
                    rows: $scope.pageSize//分页行数*分页必须
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
            /**
             * 条件搜索
             */
            //获取会员层级列表
            httpFactory.getList(lotteryConst.uaaPathPlat + '/memberLevel/getSelectList', 'GET', null, null).then(function (result) {
                if (result.data) {
                    $scope.selectParam.memberLevel = result.data;
                    $scope.memberLevel=$scope.selectParam.memberLevel;

                }
            }, function (data) {
            });
            $scope.onSearch = function (e) {
                if (!e) {
                    $scope.queryParam.page = 1;
                }
                if ($scope.selectParam.memberLevelSelected) {
                    var arr = [];
                    for (var i = 0; i < $scope.selectParam.memberLevelSelected.length; i++) {
                        arr.push($scope.selectParam.memberLevelSelected[i].id)
                    }
                    $scope.queryParam.levelIds = arr.toString();
                }
                if ($scope.selectParam.lotterySelected) {
                    var tt = [];
                    for (var o = 0; o < $scope.selectParam.lotterySelected.length; o++) {
                        tt.push($scope.selectParam.lotterySelected[0].id)
                    }
                    $scope.queryParam.lotteryIds = tt.toString();
                }
                if ($scope.selectParam.levelId){
                    $scope.queryParam.levelIds=$scope.selectParam. levelId
                }
                if ($scope.selectParam.lotteryId){
                    $scope.queryParam.lotteryIds=$scope.selectParam. lotteryId
                }
                if ($scope.selectParam.startTime) {
                    $scope.queryParam.startTime = new Date($scope.selectParam.startTime).getTime();
                }
                if ($scope.selectParam.endTime) {
                    $scope.queryParam.endTime = new Date($scope.selectParam.endTime).getTime();
                }

                httpFactory.getList(url + '/levelStatistics/member/list', 'GET', null, $scope.queryParam).then(function (result) {
                    $scope.entity = result.data.rows;
                    $scope.summary = result.data.summary;
                    $scope.oldsummary = {
                        totalBet: 0,
                        betAmount: 0,
                        validBetAmount:0,
                        payOff:0
                    };
                    if($scope.entity){
                        $scope.entity.forEach(function (item) {
                            if(item.validBetAmount==undefined){
                                item.validBetAmount=0
                            }
                            $scope.oldsummary.totalBet +=item.totalBet;
                            $scope.oldsummary.betAmount +=item.betAmount;
                            $scope.oldsummary.validBetAmount +=item.validBetAmount;
                            $scope.oldsummary.payOff +=item.payOff;
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
                }, function (data) {

                });
            };
            $scope.onSearch();
            $scope.onReset = function () {
                initPage();
            };

        }
    })();


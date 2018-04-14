/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('quickSearchSide', quickSearchSide);

    /** @ngInject */
    function quickSearchSide($scope, common, httpFactory, lotteryConst, custNotify, todoService, $uibModal) {
        var url = lotteryConst.hermesApis;
        $scope.pageSize = lotteryConst.pageSize; //页面显示行

        function initPage() {
            $scope.selectParam = {
                startTime: "",
                endTime: "",
                source: "",
                dateType: lotteryConst.dateType,
                sourceType: [{id: null, value: '全部'}].concat(lotteryConst.sourceType),
                lotterySelected: null,
                lottery: lotteryConst.lottery,
                played: '',
                plays: "",
                account: todoService.get().memberName
            };
            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                account: "",
                sideType: 2,
                start: "",
                end: "",
                orderId: "",
                source: '',
                lotteryIds: "",
                playIds: ""
            };

        }
        initPage();
        function initPage1() {
            $scope.gameSelectParam = {
                startTime:todoService.get().createTimeStart ,
                endTime:todoService.get().createTimeEnd ,
                source: "",
                dateType: lotteryConst.dateType,
                sourceType: [{id: null, value: '全部'}].concat(lotteryConst.sourceType),
                lotterySelected: null,
                lottery: lotteryConst.lottery,
                played: JSON.parse(sessionStorage.getItem('played')),
                plays: "",
                account: todoService.get().memberName
            };
            $scope.gameQueryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                start: "",
                end: "",
                source: '',
            };
        }
        initPage1()
        /**
         * 获取玩法列表
         */
        $scope.getPlaysList = function (e) {
            if(e==1){
                var lotteryId;
                if (Object.prototype.toString.call($scope.selectParam.lotterySelected) === '[object Object]') {
                    $scope.selectParam.plays = [];
                    return
                } else if (Object.prototype.toString.call($scope.selectParam.lotterySelected) === '[object Array]') {
                    if ($scope.selectParam.lotterySelected.length == 0) {
                        $scope.selectParam.plays = [];
                        return
                    } else if ($scope.selectParam.lotterySelected[0].id == null || $scope.selectParam.lotterySelected.length > 1) {
                        $scope.selectParam.plays = [];
                        return
                    } else {
                        lotteryId = $scope.selectParam.lotterySelected[0].id;
                    }

                }
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
            }
            if(e==2){
                var lotteryId;
                lotteryId=$scope.gameSelectParam.lotterySelected.id;
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
                        $scope.gameSelectParam.plays = [{
                            value: "全部",
                            playId: null
                        }].concat(arr);
                    } else {

                    }
                }, function (data) {

                });
            }
        };
        /**
         * 彩种改变监听事件
         */
        $scope.$watch('selectParam.lotterySelected', function (){
            $scope.getPlaysList(1);
            // if ($scope.selectParam.lotterySelected && $scope.selectParam.lotterySelected.length >= 2) {
            //     $scope.selectParam.played = [];
            //     $scope.editPlay = true;
            // } else {
            //     $scope.editPlay = false;
            // }
            // if (!$scope.selectParam.lotterySelected) {
            //     $scope.selectParam.played = [];
            //     $scope.editPlay = true;
            // }
            // if ($scope.selectParam.lotterySelected && $scope.selectParam.lotterySelected.length == 0) {
            //     $scope.selectParam.played = [];
            //     $scope.editPlay = true;
            // }
        });
        $scope.$watch('gameSelectParam.lotterySelected', function (){
                $scope.getPlaysList(2);
                // if ($scope.selectParam.lotterySelected && $scope.selectParam.lotterySelected.length >= 2) {
                //     $scope.selectParam.played = [];
                //     $scope.editPlay = true;
                // } else {
                //     $scope.editPlay = false;
                // }
                // if (!$scope.selectParam.lotterySelected) {
                //     $scope.selectParam.played = [];
                //     $scope.editPlay = true;
                // }
                // if ($scope.selectParam.lotterySelected && $scope.selectParam.lotterySelected.length == 0) {
                //     $scope.selectParam.played = [];
                //     $scope.editPlay = true;
                // }
            });
        /**
         * 条件搜索
         */
        $scope.gogogo = function (e) {
            if(!e.orderNum){
                return false
            }
            todoService.set(
                {
                    createTimeStart:$scope.gameSelectParam.startTime,
                    createTimeEnd:$scope.gameSelectParam.endTime,
                    statusSelected:$scope.gameSelectParam.statusSelected,
                    lotterySelected:$scope.gameSelectParam.lotterySelected
                }
            );
            window.sessionStorage.setItem('plays',JSON.stringify($scope.gameSelectParam.plays));
            window.sessionStorage.setItem('lottery',e.lotteryId);
            window.sessionStorage.setItem('played',e.playId);
            window.location.href = '#/statistics/gameplayDetails'
        };
        $scope.onSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if (!$scope.queryParam.account) {
                return
            }
            $scope.queryParam.lotteryIds = '';
            if (Object.prototype.toString.call($scope.selectParam.lotterySelected) === '[object Object]') {
                $scope.queryParam.lotteryIds = null;
            } else if (Object.prototype.toString.call($scope.selectParam.lotterySelected) === '[object Array]') {
                if ($scope.selectParam.lotterySelected.length == 1) {
                    //console.log($scope.selectParam.lotterySelected)
                    $scope.queryParam.lotteryIds = $scope.selectParam.lotterySelected[0].id;
                } else if ($scope.selectParam.lotterySelected.length > 1) {
                    var arr = [];
                    for (var i = 0; i < $scope.selectParam.lotterySelected.length; i++) {
                        arr.push($scope.selectParam.lotterySelected[i].id)
                    }
                    arr = arr.sort();
                    $scope.queryParam.lotteryIds = arr.toString();
                }
            }
            if ($scope.selectParam.source) {
                $scope.queryParam.source = $scope.selectParam.source.id;
            }
            $scope.queryParam.playIds = '';
            if ($scope.selectParam.played) {
                if ($scope.selectParam.played.length == 1) {
                    $scope.queryParam.playIds = $scope.selectParam.played[0].playId
                }
                if ($scope.selectParam.played.length > 1) {
                    var arr = [];
                    $scope.selectParam.played.forEach(function (row) {
                        arr.push(row);
                    });
                    $scope.queryParam.playIds = arr.toString();
                }
            }
            if ($scope.selectParam.startTime) {
                $scope.queryParam.start = new Date($scope.selectParam.startTime).getTime();
            }
            if ($scope.selectParam.endTime) {
                $scope.queryParam.end = new Date($scope.selectParam.endTime).getTime();
            }
            httpFactory.getList(url + '/order/management/quick/search/member', 'GET', null, $scope.queryParam).then(function (result) {
                if (!result.data) {
                    $scope.entity = [];
                    $scope.summary = [];
                    $scope.subSummary = {};
                    return false
                }
                   $scope.entity = result.data.rows;
                   $scope.summary = result.data.summary;
                   $scope.subSummary = {
                    betAmount: 0,
                    payoff: 0,
                    reforwardPoint: 0,
                    gainLost: 0,
                    effectiveBetAmount: 0
                };
                for (var i = 0; i < $scope.entity.length; i++) {
                    $scope.subSummary.betAmount += Number($scope.entity[i].betAmount);
                    $scope.subSummary.payoff += Number($scope.entity[i].payoff);
                    $scope.subSummary.reforwardPoint += Number($scope.entity[i].reforwardPoint);
                    $scope.subSummary.effectiveBetAmount += Number($scope.entity[i].effectiveBetAmount);
                    $scope.subSummary.gainLost += Number($scope.entity[i].gainLost);
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
                    $scope.onSearch(btn);// 获取list的方法
                });// 分页
                /**
                 * 分页结束
                 */
            }, function (data) {

            });
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

            var sodateStart2 = new common.soDate(); // 声明一个新的日期控件
            sodateStart2.init({//初始化控件
                $id: 'startTime2',//input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss'// 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.gameSelectParam.startTime = res;
            });
            var sodateEnd2 = new common.soDate();// 声明一个新的日期控件
            sodateEnd2.init({//初始化控件
                $id: 'endTime2',//input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss'// 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.gameSelectParam.endTime = res;
            });
        });
        //时间
        $scope.dateFun = function (e,type) {
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
            if(type=='acc'){
                $('#startTime').val(date.startTime + ' 00:00:00');
                $('#endTime').val(date.endTime + ' 23:59:59');
                $scope.selectParam.startTime = date.startTime + ' 00:00:00';
                $scope.selectParam.endTime = date.endTime + ' 23:59:59';
            }
            if(type=='ga'){
                $('#startTime2').val(date.startTime + ' 00:00:00');
                $('#endTime2').val(date.endTime + ' 23:59:59');
                $scope.gameSelectParam.startTime = date.startTime + ' 00:00:00';
                $scope.gameSelectParam.endTime = date.endTime + ' 23:59:59';
            }
        };
        $scope.dateFun(1,'acc');
        /**
         * 条件搜索
         */
        $scope.onSearch1 = function (num) {
            if (num) {
                $scope.gameQueryParam.page = num
            } else {
                $scope.gameQueryParam.page = 1;
            }
            console.log($scope.gameSelectParam.lotterySelected);
            if($scope.gameSelectParam.lotterySelected){
                var tt=[];
                for (var o = 0; o < $scope.gameSelectParam.lotterySelected.length; o++) {
                    tt.push($scope.gameSelectParam.lotterySelected[o].id)
                }
                $scope.gameQueryParam.lotteryIds= tt.toString()
            }
            if($scope.gameSelectParam.source) {
                $scope.gameQueryParam.source = $scope.gameSelectParam.source.id;
            }
            if($scope.gameSelectParam.played){
                var arr=[];
                for (var i = 0; i < $scope.gameSelectParam.played.length; i++) {
                    arr.push($scope.gameSelectParam.played[i].playId)
                }
                $scope.gameQueryParam.playIds= arr.toString()
            }
            if($scope.gameSelectParam.startTime) {
                $scope.gameQueryParam.start = new Date($scope.gameSelectParam.startTime).getTime();
            }
            if($scope.gameSelectParam.endTime) {
                $scope.gameQueryParam.end = new Date($scope.gameSelectParam.endTime).getTime();
            }
            httpFactory.getList(url + '/order/management/quick/search/game', 'GET', null, $scope.gameQueryParam).then(function (result) {
                $scope.entity1 = result.data.rows;
                $scope.summary1 = result.data.summary;

                $scope.subSummary1 = {
                    totalBetAmount: 0,
                    totalPayoff: 0,
                    totalReforwardPoint: 0,
                    totalGainLost: 0
                };
                $scope.entity1.forEach(function (row) {
                    $scope.subSummary1.totalBetAmount += Number(row.totalBetAmount);
                    $scope.subSummary1.totalPayoff += Number(row.totalPayoff);
                    $scope.subSummary1.totalGainLost += Number(row.totalGainLost);
                    $scope.subSummary1.totalReforwardPoint += Number(row.totalReforwardPoint);
                });


                /**
                 * 分页开始
                 */
                $scope.queryParam.page = result.data.currentPage;//获取的当前页currentPage赋值给查询方法的当前页参数page

                common.soPage({
                    $id: 'page-1',
                    total: result.data.total,//总条数
                    size: $scope.queryParam.rows,//每页条数
                    nowPage: $scope.queryParam.page
                }, function (btn) {// 回调方法，返回当前页码
                    $scope.queryParam.page = btn;//重新赋值当前页
                    $scope.onSearch1(btn);// 获取list的方法
                });// 分页
                /**
                 * 分页结束
                 */
            }, function (data) {

            });
        };
        $scope.openTab = function (index) {
            $scope.onReset();
            if (index === 1) {
                $scope.entity = null;
                $scope.onSearch();
            }
            if (index === 2) {
                initPage1()
                $scope.dateFun(1,'ga');
                $scope.onSearch1();
            }
        };
        $scope.onReset = function (e) {
            if(e==1){
                initPage();
                $scope.dateFun(1,'acc');
            }
            if(e==2){
                initPage1();
                $scope.dateFun(1,'ga');
            }

        };
        if (todoService.get().memberName) {
            $scope.queryParam.account = $scope.selectParam.account;
            $scope.queryParam.start = new Date(todoService.get().createTimeStart).getTime()
            $scope.queryParam.end = new Date(todoService.get().createTimeEnd).getTime()
            $scope.onSearch();
        } else {
            return
        }


    }
})();


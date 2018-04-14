/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('companyFlowCheck', companyFlowCheck);

    /** @ngInject */
    function companyFlowCheck($scope, httpFactory, lotteryConst, custNotify, todoService, $interval, common, $sce) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url = lotteryConst.payConfigPath + '/offline';
        var fileUrl = lotteryConst.imgUrl + '/photo/file/';
        $scope.agentFlag=!lotteryConst.agentFlag;
        $scope.agentFlag2=!!lotteryConst.agentFlag;
        function initPage() {
            $scope.selectParam = {
                state: lotteryConst.state,
                stateSelected: {id: null, value: '全部'},
                payMethod: lotteryConst.payMethod,
                payMethodSelected: {id: null, value: '全部'},
                startTime: null,
                endTime: null,
                cycled: {msg: '不更新', val: 0},
                cycle: lotteryConst.cycle
            };

            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                lotteryId: null,
                status: null,
                modifyUsername: null
            };
        }

        /**
         * 音效提示
         * @type {number}
         */
        $scope.lockAudio = function () {
            $scope.audioLock = 1;
            $scope.audioStr = '关闭声音';
            $scope.audioFun = function () {
                var audio = document.getElementById('audioPlay');
                audio.pause();
                if ($scope.audioLock == 1) {
                    $scope.audioLock = 0;
                    $scope.audioStr = '开启声音'
                } else if ($scope.audioLock == 0) {
                    $scope.audioLock = 1;
                    $scope.audioStr = '关闭声音';
                }
            }
        }

        if($scope.agentFlag){
            $scope.lockAudio();
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
        $scope.getAudio = function () {
            httpFactory.getList(lotteryConst.aresPathPlat + '/soundConfig' + '/view', 'GET', null, {itemType: 1}).then(function (result) {
                if (result.data) {
                    var url = fileUrl + result.data.itemUrl;
                    // $('.sourceUrl').attr("src", url);
                    $scope.audioUrl = $sce.trustAsResourceUrl(url)
                    var audio = document.getElementById('audioPlay');
                    audio.load();
                }
            }, function (result) {

            });
        };
        if($scope.agentFlag){
            $scope.getAudio();
        }

        /**
         * 条件搜索
         */
        $scope.onSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }

            if ($scope.selectParam.stateSelected) {
                $scope.queryParam.state = $scope.selectParam.stateSelected.id;
            }

            if($scope.agentFlag2){
                $scope.queryParam.state=4
            }
            if ($scope.selectParam.payMethodSelected) {
                $scope.queryParam.payMethod = $scope.selectParam.payMethodSelected.id;
            }
            if ($scope.selectParam.startTime) {
                $scope.queryParam.startTime = new Date($scope.selectParam.startTime).getTime();
            }
            if ($scope.selectParam.endTime) {
                $scope.queryParam.endTime = new Date($scope.selectParam.endTime).getTime();
            }

            httpFactory.getList(url + '/chargeList', 'GET', null, $scope.queryParam).then(function (result) {
                $scope.entity = result.data.rows;
                $scope.summary = result.data.summary;
                //音乐播放,获取新的列表第一项时间比旧的时间大，播放声音
                var audioLock = 0;
                if($scope.agentFlag){
                    $scope.entity.forEach(function (k, j) {
                        if (k.state === 0 && $scope.audioLock === 1) {
                            var audio = document.getElementById('audioPlay');
                            audio.play();
                            audioLock = 1;
                        }

                    });
                    if (audioLock === 0) {
                        var audio = document.getElementById('audioPlay');
                        audio.pause();
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
        /**
         * 自动更新
         */
        if (!todoService.get().interval) {
            todoService.set({interval: null})
        }
        $scope.$watch('selectParam.cycled', function (newVal) {
            $interval.cancel(todoService.get().interval);
            if ($scope.selectParam.cycled.val) {
                todoService.get().interval = $interval(function () {
                    $scope.onSearch();
                }, $scope.selectParam.cycled.val * 1000);
            }
        });
        /**
         * 状态修改
         * @param id
         * @param status
         */
        $scope.onStatus = function (item, state) {
            if (state == 5) {
                var audio = document.getElementById('audioPlay')
                audio.pause()
            }
            httpFactory.getList(url + '/audit', 'GET', null, {id: item.cid, state: state}).then(function (result) {
                custNotify.success(lotteryConst.msgEdit.success, '提示:');
                $scope.onSearch(1);// 获取list的方法
            }, function (data) {
                custNotify.error(data.msg, '提示:');
            });
        };

        /* //显示银行信息
         $scope.showChild=function (item) {
             item.flag=true

         };
         //隐藏银行信息
         $scope.hideChild=function (item) {
             item.flag=false;

         };*/

    }
})();


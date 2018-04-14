/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('orderSideCtrl', orderSideCtrl);

    /** @ngInject */
    function orderSideCtrl($scope, httpFactory, lotteryConst, $uibModal, todoService, common, custNotify) {
        var url = lotteryConst.hemes + '/apis/plat/order/management';
        $scope.agentFlag=!lotteryConst.agentFlag;
        $scope.agentFlag2=!!lotteryConst.agentFlag;
        $scope.pageSize = lotteryConst.pageSize;
        $scope.page = 1;
        $scope.selectParam={

        };
        $scope.queryParam = {
            condition: {},
            orderId: '',
            memberName: ''
        };
        $scope.oldQueryParam = {
            condition: {},
            orderId: '',
            memberName: ''
        };
        /**
         * 彩种改变监听事件
         */
        $scope.$watch("selectParam.lotterySelected", function (n, o) {
            $scope.selectParam.played = {
                playSetName: "全部",
                playId: null
            };
            $scope.getPlaysList();
        });

        /**
         * 官方彩票方案管理参数初始化
         */

        $scope.queryParam.condition = {
           /* sideType: "2",*/
            page: 1,
            count: lotteryConst.pageSize,
            betStartTime: "",
            betEndTime: ""
        }
        $scope.oldQueryParam.condition = {
           /* sideType: "2",*/
            page: 1,
            count: lotteryConst.pageSize,
            betStartTime: "",
            betEndTime: ""
        }
        $scope.initTable = function (e) {
            initFun()
            if (e == 0) {
                $scope.onSearch1()
            } else {
                $scope.onSearch2()
            }
        }
        /**
         * 获取双面彩今日方案管理列表
         */
        $scope.onSearch1 = function () {
            if (typeof $scope.queryParam.condition === 'string') {
                $scope.queryParam.condition = JSON.parse($scope.queryParam.condition);
            }
            $scope.queryParam.condition.page = 1;
            $scope.page = 1;
            $scope.getTodayList();
        }
        $scope.getTodayList = function (btn, e) {
            if (!e) {
                $scope.queryParam.condition.page = 1;
            }
            var queryParam = JSON.parse(JSON.stringify( $scope.queryParam));
            var status = '';
            if ($scope.queryParam.statused)
                status = $scope.queryParam.statused.code || '';
            queryParam.condition = {
                sideType: "2",
                page: btn || 1,
                count: lotteryConst.pageSize,
                betStartTime: "",
                betEndTime: "",
                memberName: $scope.queryParam.memberName || '',
                orderId: $scope.queryParam.orderId,
                status: status,
                playId: '',
                agent: $scope.selectParam.agent || ''
            };
           /* queryParam.condition.agent = $scope.queryParam.agent;*/
            if ($scope.selectParam.lotterySelected && $scope.selectParam.lotterySelected.id) {
                queryParam.condition['lotteryId'] = $scope.selectParam.lotterySelected.id;
            }
            if ($scope.selectParam.played && $scope.selectParam.played.playId) {
                queryParam.condition['playId'] = $scope.selectParam.played.playId;
            }
            if ($scope.selectParam.sourceTyped && $scope.selectParam.sourceTyped.code) {
                queryParam.condition['source'] = $scope.selectParam.sourceTyped.code;
            }
            if ($scope.selectParam.statused && $scope.selectParam.statused.code) {
                queryParam.condition['orderStatus'] = $scope.selectParam.statused.code;
            }
            queryParam.condition.betStartTime = null;
            queryParam.condition.betEndTime = null;

            /*console.log(queryParam.condition)

            */
            queryParam.condition = JSON.stringify(queryParam.condition);





            httpFactory.getList(url + '/today/list', 'GET',null,  queryParam).then(function (data) {
                if (data.err !== 'SUCCESS') {
                    custNotify.error('操作提示', data.cnMsg);
                    return;
                }
                $scope.sideList = data.data.rows;
                $scope.totalSummary=data.data.summary;
                $scope.summary = {
                    subBetAmount: 0,
                    subPayoff: 0,
                    subReforwardPoint:0,
                    effectiveBetAmount:0
                };
              $scope.sideList.forEach(function (item) {
                    $scope.summary.subBetAmount +=item.betAmount;
                    $scope.summary.subPayoff +=item.payoff;
                    $scope.summary.subReforwardPoint +=item.reforwardPoint;
                    $scope.summary.effectiveBetAmount+=item.effectiveBetAmount

              });

                //分页总数
                common.soPage({
                    $id: 'sidePage',
                    total: data.data.total,
                    size: lotteryConst.pageSize,
                    nowPage: $scope.page
                }, function (btn) { //第一个参数为总条目数,第二个参数是每页条目数，第三个是回调方法，返回当前页码
                    $scope.page = btn
                    $scope.getTodayList(btn, 1); // 用来传入页码的获取list的方法
                }); //分页
            }, function (err) {
                console.log(err);
            });
        };

        /**
         * 获取双面彩历史方案管理列表
         */
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            var sodateStart = new common.soDate()
            sodateStart.init({
                $id: 'startTime',
                formart: 'yyyy/MM/dd HH:mm:ss' // yyyy/MM/dd HH:mm:ss
            }, function (res) {
                $scope.oldQueryParam.condition.betStartTime = new Date(res).getTime();
            });
            var sodateEnd = new common.soDate()
            sodateEnd.init({
                $id: 'endTime',
                formart: 'yyyy/MM/dd HH:mm:ss' // yyyy/MM/dd HH:mm:ss
            }, function (res) {
                $scope.oldQueryParam.condition.betEndTime = new Date(res).getTime();
            });
        });
        $scope.onSearch2 = function () {
            if (typeof $scope.oldQueryParam.condition === 'string') {
                $scope.oldQueryParam.condition = JSON.parse($scope.oldQueryParam.condition)
            }
            $scope.oldQueryParam.condition.page = 1;
            $scope.page = 1;
            $scope.getOldList()
        }
        $scope.getOldList = function (btn, e) {
            if (!e) {
                $scope.oldQueryParam.condition.page = 1;
            }
            var queryParam = JSON.parse(JSON.stringify($scope.oldQueryParam));
            $scope.selectParam.lotterySelected = $scope.selectParam.lotterySelected || {
                id: ''
            };
            $scope.selectParam.played = $scope.selectParam.played || {
                cid: ''
            };
            $scope.selectParam.statused = $scope.selectParam.statused || {
                code: ''
            };
            if (queryParam.condition.betStartTime === '' || queryParam.condition.betStartTime === undefined) {
                var nowDate = new Date();
                nowDate.setDate(nowDate.getDate() - 1);
                var yesDate = '' + (nowDate.getYear() + 1900) + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();
                var yesDateStar = new Date(yesDate + ' 00:00:00');
                var yesDateEnd = new Date(yesDate + ' 23:59:59');
                queryParam.condition.betStartTime = yesDateStar.getTime();
                $scope.dateInput = {
                    betStartTime: '' + (yesDateStar.getYear() + 1900) + '-' + (yesDateStar.getMonth() + 1) + '-' + yesDateStar.getDate(),
                };
                $('#startTime').val($scope.dateInput.betStartTime + ' 00:00:00')
            }
            if (queryParam.condition.betEndTime === '' || queryParam.condition.betEndTime === undefined) {
                var nowDate = new Date();
                nowDate.setDate(nowDate.getDate() - 1);
                var yesDate = '' + (nowDate.getYear() + 1900) + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();
                var yesDateStar = new Date(yesDate + ' 00:00:00');
                var yesDateEnd = new Date(yesDate + ' 23:59:59');
                queryParam.condition.betEndTime = yesDateEnd.getTime();
                $scope.dateInput = {
                    betEndTime: '' + (yesDateEnd.getYear() + 1900) + '-' + (yesDateEnd.getMonth() + 1) + '-' + yesDateEnd.getDate()
                };
                $('#endTime').val($scope.dateInput.betEndTime + ' 23:59:59')
            }
            queryParam.condition.sideType = '2';
            queryParam.condition.page = btn || 1;
            queryParam.condition.count = lotteryConst.pageSize;
            queryParam.condition.orderId = $scope.queryParam.orderId;
            queryParam.condition.memberName = $scope.queryParam.memberName;
            queryParam.condition.agent = $scope.queryParam.agent;
            queryParam.condition.lotteryId = $scope.selectParam.lotterySelected.id || '';
            if ($scope.selectParam.played && $scope.selectParam.played.playId) {
                queryParam.condition['playId'] = $scope.selectParam.played.playId;
            }
            if ($scope.selectParam.statused && $scope.selectParam.statused.code) {
                queryParam.condition['orderStatus'] = $scope.selectParam.statused.code;
            }
            if ($scope.selectParam.sourceTyped && $scope.selectParam.sourceTyped.code) {
                queryParam.condition['source'] = $scope.selectParam.sourceTyped.code;
            }
            queryParam.condition = JSON.stringify(queryParam.condition);
            httpFactory.getList(url + '/history/list', 'GET', null, queryParam).then(function (data) {
                if (data.err !== 'SUCCESS') {
                    custNotify.error('操作提示', data.cnMsg);
                    return;
                }
                $scope.oldSideList = data.data.rows;
                $scope.oldTotalsummary=data.data.summary;
                $scope.oldsummary = {
                    subBetAmount: 0,
                    subPayoff: 0,
                    subReforwardPoint:0,
                    effectiveBetAmount:0
                };
                if($scope.oldSideList){
                    $scope.oldSideList.forEach(function (item) {
                        $scope.oldsummary.subBetAmount +=item.betAmount;
                        $scope.oldsummary.subPayoff +=item.payoff;
                        $scope.oldsummary.subReforwardPoint +=item.reforwardPoint;
                        $scope.oldsummary.effectiveBetAmount +=item.effectiveBetAmount;
                    });
                }

                // 分页总数
                common.soPage({
                    $id: 'oldSidePage',
                    total: data.data.total,
                    size: lotteryConst.pageSize,
                    nowPage: $scope.page
                }, function (btn) { // 第一个参数为总条目数,第二个参数是每页条目数，第三个是回调方法，返回当前页码
                    $scope.page = btn;
                    $scope.getOldList(btn, 1); // 用来传入页码的获取list的方法
                }); // 分页
            }, function (err) {
                console.log(err);
            });
        };
        /**
         * 获取订单状态
         */
        $scope.getOrderStatus = function () {
            httpFactory.getList(lotteryConst.hemes + '/order/config/listValidOrderStatus', 'GET', null, $scope.queryParam).then(function (data) {
                $scope.selectParam.orderStatus = [{
                    mes: "全部",
                    code: null
                }].concat(data.data.orderStatusList);
            }, function (err) {
                console.log(err)
            });
        };

        /**
         * 获取玩法列表
         */
        $scope.getPlaysList = function () {
            if ($scope.selectParam.lotterySelected && $scope.selectParam.lotterySelected.id) {
                var lotteryId = $scope.selectParam.lotterySelected.id;

                httpFactory.getList(lotteryConst.aresPath + '/plays/getPlaysMap?lotteryId=' + lotteryId, 'GET', null, {}).then(function (data) {
                    $scope.selectParam.plays = [{
                        playSetName: "全部",
                        playId: null
                    }].concat(data.data);
                }, function (data) {

                });
            } else {
                $scope.selectParam.plays = null;
            }
        }
        /**
         * 获取来源列表
         */
        $scope.getSourceType = function () {
            httpFactory.getList(lotteryConst.hemes + '/order/config/listValidSource', 'GET', null, {}).then(function (data) {
                $scope.selectParam.sourceType = [{
                    mes: "全部",
                    code: null
                }].concat(data.data.sourceTypeList);
                console.log()
            }, function (data) {

            });
        }
        /**
         * 获取平台商列表
         */
        $scope.getPlat = function () {
            httpFactory.getList(lotteryConst.aresAccount + '/platinfo/plat_map?sideType=2', 'GET', null, {}).then(function (data) {
                $scope.selectParam.plat = data.data;
                console.log()
            }, function (data) {

            });
        }
        /**
         * 获取状态列表
         */
        $scope.getStatus = function () {
            httpFactory.getList(lotteryConst.riskManageBasePath + '/risk/config/listValidRiskOrderStatus?sideType=2', 'GET', null, {}).then(function (data) {
                $scope.selectParam.status = [{
                    value: "全部",
                    code: null
                }].concat(data.orderStatusList);
                console.log();
            }, function (data) {

            });
        };
        /**
         * 搜索
         */
        $scope.onSearch = function () {
            //修改参数
            $scope.queryParam.condition = JSON.stringify({
                sideType: "2",
                page: "1",
                count: lotteryConst.pageSize,
                betStartTime: "",
                betEndTime: ""
            })
            //调用方法
            $scope.getTodayList()
        }

        /**
         * 搜索
         */
        $scope.oldOnSearch = function () {
            //修改参数
            $scope.queryParam.condition = JSON.stringify({
                sideType: "2",
                page: "1",
                count: lotteryConst.pageSize,
                betStartTime: "",
                betEndTime: ""
            })
            //调用方法
            $scope.getOldList()
        }

        /**
         * 导出
         */
        $scope.onExport = function () {
            window.open()
        }

        /**
         * 打开详情
         */

        function open(page, size) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size
            });
            modalInstance.result.then(function (result) {
                if (todoService.get().type == 1) {
                    $scope.onSearch1();
                } else {
                    $scope.onSearch2();
                }
            }, function (reason) {
                if (todoService.get().type == 1) {
                    $scope.onSearch1();
                } else {
                    $scope.onSearch2();
                }
            });
        }


        $scope.openDetail = function (e, t) {
            todoService.set({
                detail: e,
                type: t,
                cid: 0
            });
            open('app/pages/plan/order/side/orderSideEdit.html', 'lg');
        }

        function initFun() {
            $scope.selectParam = {
                lottery: [{
                    id: null,
                    value: '全部',
                    sideType: 2
                }].concat(lotteryConst.lottery),
                lotterySelected: {
                    id: null,
                    value: '全部',
                    sideType: 2
                },
                orderStatus: null,
                orderStatusSelected: null,
                startTime: null,
                endTime: null,
                statused: null,
                status: lotteryConst.periodRuleStatus,
                plays: null,
                played: null,
                plat: null,
                plated: null,
                sourceType: null,
                sourceTyped: null
            };
            $scope.queryParam = {
                condition: {},
                orderId: '',
                memberName: ''
            };
            $scope.oldQueryParam = {
                condition: {},
                orderId: '',
                memberName: ''
            };
            $('#startTime').val('');
            $('#endTime').val('');
            $scope.getOrderStatus()
            $scope.getSourceType()
        }

        /**
         * 初始化入口方法
         */
        $scope.init = function () {
            initFun()
            $scope.onSearch1()
        }
        $scope.init()
    }
})();
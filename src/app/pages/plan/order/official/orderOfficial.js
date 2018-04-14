/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('orderOfficialCtrl', orderOfficialCtrl);

    /** @ngInject */
    function orderOfficialCtrl($scope, httpFactory, lotteryConst, $uibModal, todoService, common, custNotify, $filter) {
        var url = lotteryConst.hemes + '/apis/plat/order/management';
        $scope.pageSize = 10;
        $scope.displayPage = 10;
        $scope.page = 1;
        $scope.open = open;
        $scope.opened = false;
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.options = {
            showWeeks: false
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

        function open() {
            $scope.opened = true;
        }

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
            sideType: '1',
            page: $scope.page,
            count: '10',
            betStartTime: '',
            betEndTime: ''
        };
        $scope.oldQueryParam.condition = {
            sideType: '1',
            page: $scope.page,
            count: '10',
            betStartTime: '',
            betEndTime: ''
        };
        /**
         * 获取官方彩票方案管理列表
         */
        var total = 0;
        $scope.onSearch1 = function () {
            if (typeof $scope.queryParam.condition === 'string') {
                $scope.queryParam.condition = JSON.parse($scope.queryParam.condition)
            }
            $scope.queryParam.condition.page = 1
            $scope.getTodayList()
        }
        $scope.getTodayList = function (btn, e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            var queryParam = $scope.queryParam;
            if ($scope.selectParam.lotterySelected)
                $scope.selectParam.lotterySelected = $scope.selectParam.lotterySelected || {};
            if ($scope.selectParam.played)
                $scope.selectParam.played = $scope.selectParam.played || {};
            if ($scope.selectParam.statused)
                $scope.selectParam.statused = $scope.selectParam.statused || {};
            var status = ''
            if ($scope.queryParam.statused)
                status = $scope.queryParam.statused.code || ''
            queryParam.condition = {
                sideType: '1',
                page: btn || 1,
                count: 10,
                betStartTime: '',
                betEndTime: '',
                orderId: $scope.queryParam.orderId,
                memberName: $scope.queryParam.memberName,
                lotteryId: $scope.selectParam.lotterySelected.id || '',
                playId: $scope.selectParam.played || '',
                orderStatus: status,
            };
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
                queryParam.condition['orderStatusNum'] = $scope.selectParam.statused.code;
            }
            queryParam.condition.betStartTime = null;
            queryParam.condition.betEndTime = null;
            queryParam.condition = JSON.stringify(queryParam.condition);
            httpFactory.getList(url + '/today/list', 'GET', null, queryParam).then(function (data) {
                if (data.err !== 'SUCCESS') {
                    custNotify.error('操作提示', data.cnMsg);
                    return;
                }
                $scope.officialList = data.data.list;
                if (data.data.total) {
                    total = data.data.total;
                }
                // 分页总数
                common.soPage({
                    $id: 'officialPage',
                    total: total,
                    size: lotteryConst.pageSize,
                    nowPage: $scope.page
                }, function (btn) { // 第一个参数为总条目数,第二个参数是每页条目数，第三个是回调方法，返回当前页码
                    $scope.page = btn;
                    $scope.getTodayList(btn, 1); // 用来传入页码的获取list的方法
                }); // 分页
            }, function (err) {
                console.log(err);
            });
        };

        /**
         * 获取官方彩票历史方案管理列表
         */
        $scope.onSearch2 = function () {
            if (typeof $scope.oldQueryParam.condition === 'string') {
                $scope.oldQueryParam.condition = JSON.parse($scope.oldQueryParam.condition)
            }
            $scope.oldQueryParam.condition.page = 1
            $scope.getOldList()
        }
        $scope.getOldList = function (btn, e) {
            if (!e) {
                $scope.oldQueryParam.page = 1;
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
            queryParam.condition.sideType = '1';
            queryParam.condition.page = btn || 1;
            queryParam.condition.count = 10;
            queryParam.condition.orderId = $scope.queryParam.orderId;
            queryParam.condition.memberName = $scope.queryParam.memberName;
            queryParam.condition.lotteryId = $scope.selectParam.lotterySelected.id || '';
            if ($scope.selectParam.played && $scope.selectParam.played.playId) {
                queryParam.condition['playId'] = $scope.selectParam.played.playId;
            }
            if ($scope.selectParam.statused && $scope.selectParam.statused.code) {
                queryParam.condition['orderStatusNum'] = $scope.selectParam.statused.code;
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
                $scope.oldOfficialList = data.data.list;
                // 分页总数
                common.soPage({
                    $id: 'oldOfficialPage',
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
                console.log(err);
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
                    // console.log(data.data)
                }, function (data) {

                });
            }
        };
        /**
         * 获取来源列表
         */
        $scope.getSourceType = function () {
            httpFactory.getList(lotteryConst.hemes + '/order/config/listValidSource', 'GET', null, {}).then(function (data) {
                $scope.selectParam.sourceType = [{
                    mes: "全部",
                    code: null
                }].concat(data.data.sourceTypeList);
                console.log();
            }, function (data) {

            });
        };
        /**
         * 获取平台商列表
         */
        $scope.getPlat = function () {
            httpFactory.getList(lotteryConst.aresAccount + '/platinfo/plat_map?sideType=1', 'GET', null, {}).then(function (data) {
                $scope.selectParam.plat = data.data;
                console.log();
            }, function (data) {

            });
        };
        /**
         * 获取状态列表
         */
        $scope.getStatus = function () {
            httpFactory.getList(lotteryConst.riskManageBasePath + '/risk/config/listValidRiskOrderStatus?sideType=1', 'GET', null, {}).then(function (data) {
                $scope.selectParam.status = [{
                    value: "全部",
                    code: null
                }].concat(data.orderStatusList);
                console.log();
            }, function (data) {

            });
        };
        /**
         * 导出
         */
        $scope.onExport = function () {
            window.open();
        };

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
                orderId: e.orderId,
                type: t,
                cid: 0
            });
            open('app/pages/plan/order/official/orderOfficialEdit.html', 'lg');
        }
        $scope.dateInput = {
            betStartTime: '',
            betEndTime: ''
        };

        /**
         * 初始化入口方法
         */
        $scope.init = function () {
            $scope.selectParam = {
                lottery: [{
                    id: null,
                    value: '全部',
                    sideType: 1
                }].concat(lotteryConst.lottery),
                lotterySelected: {
                    id: null,
                    value: '全部',
                    sideType: 1
                },
                orderStatus: null,
                orderStatusSelected: null,
                startTime: null,
                endTime: null,
                statused: null,
                status: null,
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
            // $scope.getTodayList()
            $scope.getOrderStatus();
            $scope.getPlaysList();
            $scope.getSourceType();
            // $scope.getStatus()
            $scope.onSearch1()
        };
        $scope.init();
    }
})();
/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('agentList', agentList);

    /** @ngInject */
    function agentList($scope, httpFactory, lotteryConst, custNotify, $uibModal, todoService, common,$filter) {
        var url = lotteryConst.aresAccount+'/agent';
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        function initPage() {
            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                startTime: '',
                endTime: '',
                memberLevelId: '',
                status: '',
                auditStatus: 1
            };
            $scope.selectParam = {
                startTime: "",
                endTime: '',
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
            }
            if ($scope.selectParam.endTime) {
                $scope.queryParam.endTime = new Date($scope.selectParam.endTime).getTime();
            }
            if ($scope.selectParam.memberLevelSelected) {
                $scope.queryParam.memberLevelId = $scope.selectParam.memberLevelSelected.id
            }
            if ($scope.selectParam.statusSelected) {
                $scope.queryParam.status = $scope.selectParam.statusSelected.id
            }
            httpFactory.getList(url + '/list', 'GET', null, $scope.queryParam).then(function (result) {
                // console.log(result)
                if (result.data) {
                    $scope.entity = result.data.rows;
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
                $scope.selectParam.endTime=res

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
        //获取会员层级列表

        httpFactory.getList(lotteryConst.uaaPathPlat + '/memberLevel/getSelectList', 'GET', null, null).then(function (result) {
            //console.log(result)
            if (result.data) {
                $scope.selectParam.memberLevel = result.data;
                $scope.memberLevel = result.data
            }
            //console.log($scope.selectParam.memberLevel)
        }, function (data) {

        });
        //修改状态
        $scope.onStatus = function (id, status) {
            status = status === 0 ? 1 : 0;
            var entity = {
                cid: id,
                status: status
            };
            httpFactory.getList(url + '/onStatus', 'POST', null, entity).then(function (data) {
                custNotify.success(lotteryConst.msgEdit.success, '提示:');
                $scope.onSearch();
            }, function (data) {
                custNotify.error(lotteryConst.msgSelect.fail, '提示:');
            });
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
            todoService.set(
                {
                    name: e.agentAccount,
                    types: "agent"
                }
            );
            window.location.href = '#/account/rapidDetection'
        };
        $scope.gogogo1 = function (e) {
            if(!e.memberCount ||e.memberCount===0 ){
                return false
            }
            todoService.set(
                {
                    cid: e.cid,
                    agentAccount:e.agentAccount,
                    num:1
                }
            );
            window.location.href = '#/account/member/side'
        };
        $scope.gogogo2 = function (e) {
            if(!e.rechargeMemberCount ||e.rechargeMemberCount===0 ){
                return false
            }
            todoService.set(
                {
                    cid: e.cid,
                    agentAccount:e.agentAccount,
                    num:2
                }
            );
            window.location.href = '#/account/member/side'
        };
        $scope.openEdit = function (edit, item) {
            todoService.set({
                edit: edit,
                item: item
            });
            open('app/pages/account/agentList/agentListEdit.html', 'lg');
        };
    }
})();


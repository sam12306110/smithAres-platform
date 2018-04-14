/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('userLogManageCtrl', userLogManageCtrl);

    /** @ngInject */
    function userLogManageCtrl($scope, $rootScope, httpFactory, lotteryConst, custNotify, common) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        $scope.selectParam = {
            fastDate: lotteryConst.fastDate, startTime: '', endTime: ''
        };

        $scope.queryParam = {
            page: 1,//当前页*分页必须
            rows: lotteryConst.pageSize,//分页行数*分页必须
            status: null,
            roleId: null,
            account: null,
            nickName: null,
            modifyAccount: null, startTime: '', endTime: ''
        };
//日期控件 事件ngRepeatFinished作用是延迟加载
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            var sodateStart = new common.soDate(); // 声明一个新的日期控件
            sodateStart.init({//初始化控件
                $id: 'startTime',//input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss'// 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.selectParam.startTime = res
            });
            var sodateEnd = new common.soDate();// 声明一个新的日期控件
            sodateEnd.init({//初始化控件
                $id: 'endTime',//input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss'// 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.selectParam.endTime = res
            });
        });

        /**
         * 条件搜索
         */
        $rootScope.onSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if ($scope.selectParam.startTime !== null) {
                $scope.queryParam.startTime = new Date($scope.selectParam.startTime).getTime();
            }
            if ($scope.selectParam.endTime !== null) {
                $scope.queryParam.endTime = new Date($scope.selectParam.endTime).getTime();
            }
            httpFactory.getList(lotteryConst.aresAccount + '/user/list', 'GET', null, $scope.queryParam).then(function (result) {
                $scope.userList = result.data.rows;
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

        $rootScope.onSearch();

        $scope.onReset = function () {
            $scope.selectParam.lotterySelected = null;
            $scope.selectParam.statusSelected = null;
            $scope.queryParam.modifyUsername = null;
        };


    }
})();


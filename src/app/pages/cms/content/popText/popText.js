/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('popText', popText);

    /** @ngInject */
    function popText($scope, httpFactory, lotteryConst, custNotify, $uibModal, todoService, common) {
        var url = lotteryConst.aresCmsPath + '/popText';
        $scope.pageSize = lotteryConst.pageSize; //页面显示行

        function initPage() {
            $scope.selectParam = {
                status: lotteryConst.status,
                statusSelected: {id: null, value: '全部'},
                beginTime:null,
                endTime:null
            };

            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                status: null,
                title:null
            };
        }

        initPage();

        //日期控件 事件ngRepeatFinished作用是延迟加载
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            var sodateStart = new common.soDate(); // 声明一个新的日期控件
            sodateStart.init({ //初始化控件
                $id: 'beginTime', //input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss' // 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.selectParam.beginTime = res;
            });
            var sodateEnd = new common.soDate(); // 声明一个新的日期控件
            sodateEnd.init({ //初始化控件
                $id: 'endTime', //input的id，记得给input加上so-date指令
                formart: 'yyyy/MM/dd HH:mm:ss' // 'yyyy/MM/dd HH:mm:ss'如果只要日期写'yyyy/MM/dd'
            }, function (res) {
                $scope.selectParam.endTime = res;
            });
        });
        /**
         * 条件搜索
         */
        $scope.onSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if ($scope.selectParam.statusSelected) {
                $scope.queryParam.status = $scope.selectParam.statusSelected.id;
            }
            if ($scope.selectParam.beginTime !== null) {
                $scope.queryParam.beginTime = new Date($scope.selectParam.beginTime).getTime();
            }
            if ($scope.selectParam.endTime !== null) {
                $scope.queryParam.endTime = new Date($scope.selectParam.endTime).getTime();
            }
            httpFactory.getList(url + '/list', 'GET', null, $scope.queryParam).then(function (result) {
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
            }, function (data) {

            });
        };
        $scope.onSearch();
        $scope.onReset = function () {
            initPage();
        };

        /**
         * 状态修改
         * @param id
         * @param status
         */
        $scope.onStatus = function (item) {
            item.status = item.status === 0 ? 1 : 0;
            httpFactory.getList(url + '/save', 'POST', null, item).then(function (result) {
                custNotify.success('操作提示', '修改成功！');
                $scope.onSearch();
            }, function (data) {
                custNotify.error('系统提示', '服务器出现未知错误！');
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


        $scope.openEdit = function (edit, item) {
            todoService.set({
                edit: edit,
                item: item
            });
            open('app/pages/cms/content/popText/popTextEdit.html', 'md');
        };
    }
})();


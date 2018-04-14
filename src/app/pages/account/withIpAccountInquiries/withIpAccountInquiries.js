
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('withIpAccountInquiries', withIpAccountInquiries);

    /** @ngInject */
    function withIpAccountInquiries($scope, httpFactory, lotteryConst, custNotify, $uibModal, todoService, common) {
        var url = lotteryConst.uaaPath + '/api/loglogin/list';
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        $scope.agentFlag=!lotteryConst.agentFlag;

        function initPage() {
            $scope.queryParam = {
                loginType:1,
                rows: $scope.pageSize//分页行数*分页必须
            };
            $scope.selectParam = {

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
            httpFactory.getList(url , 'GET', null, $scope.queryParam).then(function (result) {
                if(result.rows.length==0){
                    $scope.entity=null;
                    common.soPage({
                        $id: 'page',
                        total: result.total,//总条数
                        size: $scope.queryParam.rows,//每页条数
                        nowPage: $scope.queryParam.page
                    }, function (btn) {// 回调方法，返回当前页码
                        $scope.queryParam.page = btn;//重新赋值当前页
                        $scope.onSearch(1);// 获取list的方法
                    });// 分页
                    return false
                }
                if (result.rows.length>0) {
                    $scope.entity = result.rows;
                    /**
                     * 分页开始
                     */
                    $scope.queryParam.page = result.currentPage;//获取的当前页currentPage赋值给查询方法的当前页参数page
                    common.soPage({
                        $id: 'page',
                        total: result.total,//总条数
                        size: $scope.queryParam.rows,//每页条数
                        nowPage: $scope.queryParam.page
                    }, function (btn) {// 回调方法，返回当前页码
                        $scope.queryParam.page = btn;//重新赋值当前页
                        $scope.onSearch(1);// 获取list的方法
                    });// 分页
                    /**
                     * 分页结束
                     */
                }
            }, function (result) {
                $scope.entity = null;
            });
        };
        // $scope.onSearch();
        $scope.onReset = function () {
            initPage();
        };

    }
})();


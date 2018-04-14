/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('memberStatisticsSubpage', memberStatisticsSubpage);

    /** @ngInject */
    function memberStatisticsSubpage($scope, httpFactory, lotteryConst, custNotify, $uibModal, todoService, common) {
        var url = lotteryConst.uaaPath + '/apis/plat/data/member';
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        //var username = todoService.get().name;
        function initPage() {
            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                createTimeStart: todoService.get().createTimeStart || localStorage.createTimeStart,
                createTimeEnd: todoService.get().createTimeEnd || localStorage.createTimeEnd,
                agentId:  todoService.get().cid || localStorage.cid,
                status: null,
                login:null,
                levelId:null
            };
            $scope.selectParam = {
                statusSelected: '',
                status: lotteryConst.status,
                memberLevelSelected: {id: null, value: '全部'},
                memberLevel: [{id: null, value: '全部'} ].concat($scope.memberLevel)



            };
        }

        initPage();
         if(!todoService.get().cid && !localStorage.cid){
             window.location.href = '#/account/memberStatistics';
             return false
         }

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
        $scope.openTab = function (e) {
            if (e == 1) {
                initPage();
                $scope.onSearch1();
            } else {
                initPage();
                $scope.onSearch2();
            }
        };

        /**
         * 条件搜索
         */
        $scope.onSearch1 = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if($scope.selectParam.statusSelected){
                $scope.queryParam.status=$scope.selectParam.statusSelected.id
            }


            httpFactory.getList(url + '/list', 'GET', null, $scope.queryParam).then(function (result) {
                //console.log(result)
                $scope.subsummary={
                    subbalance:0


                };
                if (result) {
                    $scope.entity = result.rows;
                    for(var i=0;i<$scope.entity.length;i++ ){

                        if($scope.entity[i].balance){
                            $scope.subsummary.subbalance+=$scope.entity[i].balance;
                        }


                    }

                    $scope.summary=result.summary;
                   //console.log($scope.summary)
                    /**
                     * 分页开始
                     */
                    $scope.queryParam.page = result.currentPage;//获取的当前页currentPage赋值给查询方法的当前页参数page
                    common.soPage({
                        $id: 'page-1',
                        total: result.total,//总条数
                        size: $scope.queryParam.rows,//每页条数
                        nowPage: $scope.queryParam.page
                    }, function (btn) {// 回调方法，返回当前页码
                        $scope.queryParam.page = btn;//重新赋值当前页
                        $scope.onSearch1(1);// 获取list的方法
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
        $scope.onSearch2 = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if($scope.selectParam.statusSelected){
                $scope.queryParam.status=$scope.selectParam.statusSelected.id
            }
            if ($scope.selectParam.memberLevelSelected) {
                $scope.queryParam.levelId = $scope.selectParam.memberLevelSelected.id;
            }

            httpFactory.getList(url + '/list', 'GET', null, $scope.queryParam).then(function (result) {
                // console.log(result)
                $scope.levelSubsummary={
                    subbalance:0


                };
                if (result) {
                    $scope.levelEntity = result.rows;
                    //console.log($scope.levelEntity)
                    for(var i=0;i<$scope.levelEntity.length;i++ ){
                        for(var i=0;i<$scope.levelEntity.length;i++ ){

                            if($scope.levelEntity[i].balance){
                                $scope.levelSubsummary.subbalance+=$scope.levelEntity[i].balance;
                            }


                        }

                    }

                    $scope.levelsummary=result.summary;
                   //console.log($scope.summary)
                    /**
                     * 分页开始
                     */
                    $scope.queryParam.page = result.currentPage;//获取的当前页currentPage赋值给查询方法的当前页参数page
                    common.soPage({
                        $id: 'page-2',
                        total: result.total,//总条数
                        size: $scope.queryParam.rows,//每页条数
                        nowPage: $scope.queryParam.page
                    }, function (btn) {// 回调方法，返回当前页码
                        $scope.queryParam.page = btn;//重新赋值当前页
                        $scope.onSearch2(1);// 获取list的方法
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
        $scope.onSearch1();
        $scope.onReset = function () {
            initPage();
        };






    }
})();


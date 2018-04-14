


/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('cemberFlowCheck',cemberFlowCheck);

    /** @ngInject */
    function cemberFlowCheck($scope, httpFactory, lotteryConst, todoService, common, $sce) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url = lotteryConst.hermesApis ;
        var fileUrl = lotteryConst.imgUrl + '/photo/file/';

        function initPage() {
            $scope.selectParam = {
                retirementJudgeType:lotteryConst.retirementJudge,
                retirementJudgeSelected:{id: null, value: '全部'},
                retirementStatusType:lotteryConst.retirementStatus,
                retirementStatusSelected:{id: null, value: '全部'},
                IssueSelected:''
            };
            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
            };
        }
        initPage();
        function getPeriod(){
            httpFactory.getList(lotteryConst.aresPathPlat+'/agentPeriod/getSelectList','GET', null, null).then(function (result) {
                if(result.data){
                    $scope.selectParam.Issue=result.data;
                }
            })
        }
        getPeriod();
        $scope.gogogo = function (e) {
            // if(!e.cid){
            //     return false
            // }
            if($scope.selectParam.startTime&&$scope.selectParam.endTime){
                todoService.set(
                    {
                        memberName: e.memberName,
                        createTimeStart:$scope.selectParam.startTime,
                        createTimeEnd:$scope.selectParam.endTime,
                        PreferentialProjects:$scope.selectParam.statusSelected
                    }
                );
                window.localStorage.setItem('mbName',e.memberName);
                window.localStorage.setItem('cTimeStart',$scope.selectParam.startTime);
                window.localStorage.setItem('cTimeEnd',$scope.selectParam.endTime);
                window.localStorage.setItem('PreferentialProjects',$scope.selectParam.statusSelected);

            }
            window.location.href = '#/statistics/actingCommissionDetails'
        };
        /**
         * 条件搜索
         */
        $scope.onSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if ($scope.selectParam.retirementJudgeSelected) {
                $scope.queryParam.rComJudge = $scope.selectParam.retirementJudgeSelected.id;
            }
            if ($scope.selectParam.retirementStatusSelected) {
                $scope.queryParam.rComStatus = $scope.selectParam.retirementStatusSelected.id;
            }
            if ($scope.selectParam.IssueSelected) {
                $scope.queryParam.pcode = $scope.selectParam.IssueSelected.id;
            }
            httpFactory.getList(url + '/agent/r_com/stat_list', 'GET', null, $scope.queryParam).then(function (result) {
                if(result.data){
                    console.log(result.data);
                    $scope.entity = result.data.rows;
                    $scope.summary = result.data.summary;
                    $scope.oldsummary = {
                        tradeAmount:0,
                        times:0
                    };
                    if($scope.entity){
                        $scope.entity.forEach(function (item) {
                            $scope.oldsummary.times +=item.times;
                            $scope.oldsummary.tradeAmount +=item.tradeAmount;
                        });
                    }
                    $scope.queryParam.minAmount='';
                    $scope.queryParam.maxAmount='';
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
                }

            }, function (data) {

            });
        };
        // $scope.onSearch();
        $scope.onReset = function () {
            initPage();
        };
    }
})();


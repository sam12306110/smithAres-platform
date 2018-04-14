
/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('playProfitLossDetails', playProfitLossDetails);

    /** @ngInject */
    function playProfitLossDetails($scope, httpFactory, lotteryConst,todoService, common, $sce) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url = lotteryConst.hermesApis ;
        var fileUrl = lotteryConst.imgUrl + '/photo/file/';
        $scope.agentFlag=!lotteryConst.agentFlag;

        /*this.depositType*/
        function initPage() {
            $scope.selectParam = {
                startTime:!todoService.get().createTimeStart?'':todoService.get().createTimeStart ,
                endTime:!todoService.get().createTimeEnd?'':todoService.get().createTimeEnd ,
                sourceType:[{id: null, value: '全部'}].concat(lotteryConst.sourceType),
                statusSelected:{id: null, value: '全部'},
                plays:JSON.parse(sessionStorage.getItem('plays')),
                lotterys:sessionStorage.getItem('lottery'),
                pcode:sessionStorage.getItem('pcode'),
                played:JSON.parse(sessionStorage.getItem('played')),
                Issue:''
            };
            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                source:'',
                pCode:'',
                lotteryId:'',
                playIds:''
            };
        }
        initPage();
        console.log($scope.selectParam.played)
        $scope.gogogo = function (e) {
            if(!e.orderNum){
                return false
            }
                todoService.set(
                    {
                        statusSelected:$scope.selectParam.statusSelected,
                        lotterySelected:$scope.selectParam.lotterySelected
                    }
                );
                window.sessionStorage.setItem('plays',JSON.stringify($scope.selectParam.plays));
                window.sessionStorage.setItem('lottery',e.lotteryId);
                window.sessionStorage.setItem('played',e.playId);
                window.sessionStorage.setItem('pcode',$scope.summary.pcode);
                window.location.href = '#/statistics/gameplayDetails'
        };
        /**
         * 条件搜索
         */
        $scope.onSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if($scope.selectParam.lotterys){
                $scope.queryParam.lotteryId=$scope.selectParam.lotterys
            }
            if($scope.selectParam.statusSelected){
                $scope.queryParam.source=$scope.selectParam.statusSelected.id
            }
            if($scope.selectParam.played){
                var arr=[];
                for (var i = 0; i < $scope.selectParam.played.length; i++) {
                    arr.push($scope.selectParam.played[i].playId)
                }
                $scope.queryParam.playIds = arr.toString()
            }
            if($scope.selectParam.pcode){
                $scope.queryParam.pCode=$scope.selectParam.pcode
            }
            httpFactory.getList(url + '/report/statics/play/gainlost/details', 'GET', null, $scope.queryParam).then(function (result) {
                if(result.data){
                    $scope.entity = result.data.rows;
                    $scope.summary = result.data.summary;
                    $scope.oldsummary = {
                        orderNum:0,
                        totalBetAmount:0,
                        totalValidBetAmount: 0,
                        totalReforwardPoint: 0,
                        totalPayoff:0,
                        totalGainLost:0
                    };
                    if($scope.entity){
                        $scope.entity.forEach(function (item) {
                            $scope.oldsummary.orderNum +=item.orderNum;
                            $scope.oldsummary.totalBetAmount  +=item.totalBetAmount;
                            $scope.oldsummary.totalValidBetAmount +=item.totalValidBetAmount;
                            $scope.oldsummary.totalReforwardPoint +=item.totalReforwardPoint;
                            $scope.oldsummary.totalPayoff +=item.totalPayoff;
                            $scope.oldsummary.totalGainLost +=item.totalGainLost;
                        });
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
                }

            }, function (data) {

            });
        };
        $scope.onSearch();
        $scope.onReset = function (e) {
            initPage();
            $scope.dateFun(1)
        };
    }
})();


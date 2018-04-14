
/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('actingMonthlyStatement', actingMonthlyStatement);

    /** @ngInject */
    function actingMonthlyStatement($scope, httpFactory, lotteryConst,  $uibModal,todoService, common, $sce) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url = lotteryConst.payConfigPath ;
        var fileUrl = lotteryConst.imgUrl + '/photo/file/';
        /*this.depositType*/
        function initPage() {
            $scope.selectParam = {
                statusSelected:todoService.get().PreferentialProjects||localStorage.PreferentialProjects,
                PreferentialProjectsType:[{id: null, value: '全部优惠'}].concat(lotteryConst.PreferentialProjects),
                startTime:!todoService.get().createTimeStart?'':todoService.get().createTimeStart ,
                endTime:!todoService.get().createTimeEnd?'':todoService.get().createTimeEnd ,
                agentName:todoService.get().agentName||localStorage.agentName,
                startTimeStamp:new Date(common.getDateDay('yesterday')+ ' 00:00:00').getTime(),
                endTimeStamp:new Date(common.getDateDay('yesterday')+' 23:59:59').getTime()
            };

            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须

            };


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
            open('app/pages/statistics/actingMonthlyStatement/actingMonthlyEdit.html', 'lg');
        };
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
        /**
         * 条件搜索
         */
        $scope.onSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if ($scope.selectParam.statusSelected) {
                $scope.queryParam.actionType = $scope.selectParam.statusSelected.id;
            }
            if ($scope.selectParam.startTime) {
                $scope.queryParam.startTime = new Date($scope.selectParam.startTime).getTime();


            }
            if ($scope.selectParam.endTime) {
                $scope.queryParam.endTime = new Date($scope.selectParam.endTime).getTime();

            }
            if($scope.selectParam.agentName){
                $scope.queryParam.agentName=$scope.selectParam.agentName
            }
            if( $scope.selectParam.minAmount){
                $scope.queryParam.minAmount=$scope.selectParam.minAmount*100
            }
            if($scope.selectParam.maxAmount){
                $scope.queryParam.maxAmount=$scope.selectParam.maxAmount*100
            }
            //console.log(url + '/chargeanddraw/record')
            httpFactory.getList(url + '/momey/statistics/discount/member', 'GET', null, $scope.queryParam).then(function (result) {
                if(result.data){
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
        $scope.onSearch();
        $scope.onReset = function () {
            initPage();
            $scope.selectParam.startTime='';
            $scope.selectParam.endTime='';
            $scope.dateFun(1)
        };

    }
})();


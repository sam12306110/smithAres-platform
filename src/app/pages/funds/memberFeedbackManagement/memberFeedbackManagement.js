/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('memberFeedbackManagement', memberFeedbackManagement);

    /** @ngInject */
    function memberFeedbackManagement($scope, httpFactory, lotteryConst, custNotify, todoService, $interval, common, $sce,$uibModal) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        var url=lotteryConst.paymentPath;
        function initPage() {
            $scope.selectParam = {
                typesSelected:{id:1,value:"会员账号"},
                typesName:lotteryConst.typesName
            };

            $scope.queryParam = {
                page: 1,//当前页*分页必须
                rows: $scope.pageSize,//分页行数*分页必须
                startTime:'',
                endTime:'',
                accountType:'',
                levelIds:'',
                status:1

            };
        }



        initPage();
        //获取自动返水配置
        httpFactory.getList(lotteryConst.hermesApis+'/cash_back_config/get' , 'GET', null, null).then(function (result) {

            if (result.data.status) {
                $scope.switchFlag=true;

            }else {
                $scope.switchFlag=false;
            }
        }, function (data) {

        });

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

        /**
         * 条件搜索
         */
        $scope.onSearch = function (e) {
            if (!e) {
                $scope.queryParam.page = 1;
            }
            if ($scope.selectParam.memberLevelSelected) {
                var arr = [];
                for (var i = 0; i < $scope.selectParam.memberLevelSelected.length; i++) {
                    arr.push($scope.selectParam.memberLevelSelected[i].id)
                }
                //console.log(arr)
                $scope.queryParam.levelIds = arr.toString();
            }
             if($scope.selectParam.typesSelected){
                 $scope.queryParam.accountType=$scope.selectParam.typesSelected.id
             }
            if ($scope.selectParam.startTime) {
                $scope.queryParam.startTime = new Date($scope.selectParam.startTime).getTime();
            }
            if ($scope.selectParam.endTime) {
                $scope.queryParam.endTime = new Date($scope.selectParam.endTime).getTime();
            }

            httpFactory.getList(url + '/mem_cash_back/details', 'GET', null, $scope.queryParam).then(function (result) {
                $scope.entity = result.data.rows;
                $scope.summary = result.data.summary;

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
        //时间



        function open(page, size) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size
            });
            modalInstance.result.then(function (result) {


            }, function (reason) {
                console.log(reason)
                if(reason=='cancel'){
                    return
                }else  if( reason== "success"){
                    todo()
                }else  if(reason=='failed'){
                    return
                }


            });
        }
        $scope.openEdit = function () {
            todoService.set({
                num:Number(!$scope.switchFlag)
            });
            open('app/pages/funds/memberFeedbackManagement/memberFeedbackManagementPop.html', 'sm');
        };

        $scope.switchEven=function () {
            $scope.openEdit();

           /* $scope.switchFlag=!$scope.switchFlag;
            if($scope.switchFlag){
                $scope.queryParam.status=1;
            }else {
                $scope.queryParam.status=0;
            }*/


        };
        $scope.openRebateProgramView = function (rebateProgramId) {
            todoService.set({
                edit: false,
                item: {
                    cid: rebateProgramId
                }
            });
            open('app/pages/config/rebateProgram/rebateProgramEdit.html', 'md');
        };
          function todo() {
              $scope.switchFlag=!$scope.switchFlag;
              if($scope.switchFlag){
                  $scope.queryParam.status=1;
              }else {
                  $scope.queryParam.status=0;
              }
          }



    }
})();


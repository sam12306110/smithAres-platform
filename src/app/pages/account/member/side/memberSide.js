/**
 * @author Ivan
 * created on 2017-9-17
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages').controller('memberSideCtrl', memberSideCtrl);

    /** @ngInject */
    function memberSideCtrl($scope, $rootScope, httpFactory, lotteryConst, common, custNotify, todoService) {
        $scope.pageSize = lotteryConst.pageSize; //页面显示行
        $scope.agentFlag=!lotteryConst.agentFlag;
        $scope.agentFlag2=!!lotteryConst.agentFlag;
        var url = lotteryConst.uaaPath + '/apis/plat/data/member';
        var url2 = lotteryConst.uaaPath + '/apis/plat/member';
        $scope.init = function () {
            $scope.selectParam = {
                status: lotteryConst.statusLock,
                statusSelected: null,
                memberLevelSelected: {id: null, value: '全部'},
                sourceType:[{id: null, value: '全部'}].concat(lotteryConst.sourceType),
                memberLevel: $scope.memberLevel


            };
            $scope.queryParam = {
                status: null,
                rows: $scope.pageSize,
                page: 1
            };
            $('#startTime').val('');
            $('#endTime').val('');




        };
        $scope.init();



            httpFactory.getList(lotteryConst.uaaPathPlat + '/memberLevel/getSelectList', 'GET', null, $scope.entity).then(function (result) {
                if (result.data) {
                    $scope.memberLevel= [{id: null, value: '全部'}].concat(result.data);
                    $scope.selectParam.memberLevel = [{id: null, value: '全部'}].concat(result.data);
                }
            }, function (data) {

            });




        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            var sodateStart = new common.soDate();
            sodateStart.init({
                $id: 'startTime',
                formart: 'yyyy/MM/dd HH:mm:ss' // yyyy/MM/dd HH:mm:ss
            }, function (res) {
                $scope.queryParam.createTimeStart = new Date(res).getTime();
            });
            var sodateEnd = new common.soDate();
            sodateEnd.init({
                $id: 'endTime',
                formart: 'yyyy/MM/dd HH:mm:ss' // yyyy/MM/dd HH:mm:ss
            }, function (res) {
                $scope.queryParam.createTimeEnd = new Date(res).getTime();
            });
        });

        /**
         * 条件搜索
         */
        $rootScope.onSearch = function () {
            if ($scope.selectParam.statusSelected) {
                $scope.queryParam.status = $scope.selectParam.statusSelected.id;
            }
            if ($scope.selectParam.memberLevelSelected) {
                $scope.queryParam.levelId = $scope.selectParam.memberLevelSelected.id;
            }
            if ($scope.selectParam.source) {
                $scope.queryParam.source = $scope.selectParam.source.id;
            }

            httpFactory.getList(url + '/list', 'GET', null, $scope.queryParam).then(function (data) {
                $scope.total = data.total;
                $scope.entity = data.rows;
                // 分页总数
                common.soPage({
                    $id: 'page',
                    total: data.total,
                    size: lotteryConst.pageSize,
                    nowPage: $scope.queryParam.page
                }, function (btn) { // 第一个参数为总条目数,第二个参数是每页条目数，第三个是回调方法，返回当前页码
                    $scope.queryParam.page = btn;
                    $scope.onSearch(); // 用来传入页码的获取list的方法
                }); // 分页
            }, function (data) {

            });
        };


        if(todoService.get().num==1){
            $scope.queryParam.agentAccount=todoService.get().agentAccount;
            $scope.queryParam.agentId=todoService.get().cid;
            $rootScope.onSearch()
        }else if(todoService.get().num==2){
            $scope.queryParam.agentAccount=todoService.get().agentAccount;
            $scope.queryParam.agentId=todoService.get().cid;
            $scope.queryParam.ifCharge=1;
            $rootScope.onSearch();
        }else {
            $rootScope.onSearch();
        }
        $scope.onReset = function () {

            $scope.init();

        };
        //强制下线
        $scope.offLine = function (username) {
            var data = {
                username: username
            };
            //console.log(url2+ '/offline')
            httpFactory.getList(url2 + '/offline', 'GET', null, data).then(function (data) {
                console.log(data);
                custNotify.success('操作提示', '修改成功！');
                $scope.onSearch();
            }, function (data) {
                custNotify.error('系统提示', '服务器出现未知错误！');
            });
        };

        $scope.gogogo = function (e) {
            todoService.set(
                {
                    name: e.login,
                    types:"member"


                }
            );
            window.location.href = '#/account/rapidDetection'
        };



        /**
         * 状态修改
         * @param id
         * @param status
         */
        $scope.onStatus = function (id, status) {
            status = status === 0 ? 1 : 0;
            httpFactory.getList(url + '/statusChange/' + id + '/' + status, 'GET', null, null).then(function (data) {
                console.log(data);
                custNotify.success(lotteryConst.msgEdit.success, '提示:');
                $scope.onSearch();
            }, function (data) {
                custNotify.error(lotteryConst.msgSelect.fail, '提示:');
            });
        };
    }

})();

